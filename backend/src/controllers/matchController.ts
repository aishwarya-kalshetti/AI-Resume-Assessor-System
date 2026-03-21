import { Request, Response } from 'express';
import Resume from '../models/Resume';
import JobRole from '../models/JobRole';
import MatchResult from '../models/MatchResult';
import { runMatchingEngine } from '../utils/matcherLogic';
import { generateOutreachEmail, generateTailoredResume, calculateFlightRisk } from '../services/aiService';
import { sendEmail } from '../services/emailService';

export const triggerMatch = async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    const matchEngineOutputs = await runMatchingEngine(resume);

    if (matchEngineOutputs.length === 0) {
      return res.status(400).json({ message: 'No active job roles to match against' });
    }

    const savedResults = [];
    const bestMatch = matchEngineOutputs[0];

    await MatchResult.deleteMany({ resumeId: resume._id });

    for (let i = 0; i < matchEngineOutputs.length; i++) {
      const output = matchEngineOutputs[i];
      const isAlternate = (i > 0);

      // Attrition Prediction
      const { risk, probability } = await calculateFlightRisk(resume.parsedData);

      const extractedName = (resume.parsedData as any)?.name;
      const fileNameFallback = resume.fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();
      const finalCandidateName = extractedName || fileNameFallback;

      const matchResult = await MatchResult.create({
        candidateId: resume.userId,
        candidateName: finalCandidateName,
        candidateEmail: (resume.parsedData as any)?.email,
        resumeId: resume._id,
        roleId: output.role._id,
        overallScore: output.match.overallScore,
        dimensionScores: output.match.dimensionScores,
        explanation: output.match.explanation,
        strengths: output.match.strengths,
        weaknesses: output.match.weaknesses,
        missingSkills: output.match.missingSkills,
        flightRisk: risk,
        flightRiskProbability: probability,
        alternateRoleFlag: isAlternate && output.match.overallScore > 70,
        recommendedAlternateRoleId: isAlternate ? bestMatch.role._id : null
      });
      savedResults.push(matchResult);
    }

    res.status(200).json({ message: 'Matching complete', results: savedResults });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Engine Error' });
  }
};

export const getCandidateMatches = async (req: any, res: Response) => {
  try {
    const candidateId = req.user.role === 'candidate' ? req.user._id : req.params.candidateId;
    const matches = await MatchResult.find({ candidateId })
      .populate('roleId')
      .populate('resumeId')
      .populate('recommendedAlternateRoleId')
      .sort({ overallScore: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
};

export const getRoleMatches = async (req: any, res: Response) => {
  try {
    const { roleId } = req.params;

    // Check role ownership
    const role = await JobRole.findById(roleId);
    if (!role || !role.createdBy || role.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this role' });
    }

    const matches = await MatchResult.find({ roleId })
      .populate({ path: 'candidateId', select: '-password' })
      .populate('resumeId')
      .sort({ overallScore: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates for role' });
  }
};

export const generateOutreach = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const match = await MatchResult.findById(matchId).populate('roleId').populate('candidateId');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Check ownership (only the recruiter who created the role can generate outreach)
    const role = await JobRole.findById(match.roleId);
    if (!role || role.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const candidateName = match.candidateName || (match.candidateId as any)?.name || 'Candidate';
    const roleTitle = (match.roleId as any)?.title || 'Open Role';

    const emailDraft = await generateOutreachEmail(candidateName, roleTitle, match.overallScore, match.strengths);

    res.json({
      draft: emailDraft,
      candidateEmail: match.candidateEmail || (match.candidateId as any)?.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating outreach text' });
  }
};

export const autoTailorResume = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const match = await MatchResult.findById(matchId).populate('roleId').populate('candidateId');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // For tailored resume, either the candidate or the recruiter assigned to role
    const role = await JobRole.findById(match.roleId);
    const isOwner = match.candidateId._id.toString() === req.user._id.toString();
    const isRecruiter = role?.createdBy ? role.createdBy.toString() === req.user._id.toString() : false;

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const candidateName = match.candidateName || (match.candidateId as any)?.name || 'Candidate';
    const roleTitle = (match.roleId as any)?.title || 'Open Role';

    const tailoredText = await generateTailoredResume(candidateName, match.missingSkills, roleTitle);

    res.json({ tailoredSummary: tailoredText });
  } catch (error) {
    res.status(500).json({ message: 'Error tailoring resume' });
  }
};

export const updateMatchStatus = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    if (!['pending', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const match = await MatchResult.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Verify role ownership
    const role = await JobRole.findById(match.roleId);
    if (!role || !role.createdBy || role.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    match.status = status;
    await match.save();

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Error updating match status' });
  }
};

export const deleteMatch = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const match = await MatchResult.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Only recruiters can delete matches
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Only recruiters can delete candidate entries' });
    }

    // Verify role ownership
    const role = await JobRole.findById(match.roleId);
    if (!role || !role.createdBy || role.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this role' });
    }

    await MatchResult.findByIdAndDelete(matchId);

    // Only delete the linked resume document if it's not referenced by any OTHER matches
    if (match.resumeId) {
      const otherMatches = await MatchResult.countDocuments({
        resumeId: match.resumeId,
        _id: { $ne: matchId }
      });

      if (otherMatches === 0) {
        await Resume.findByIdAndDelete(match.resumeId);
        console.log(`[CLEANUP] Deleted resume ${match.resumeId} as it's no longer in use.`);
      } else {
        console.log(`[CLEANUP] Kept resume ${match.resumeId} as it's still used by ${otherMatches} other matches.`);
      }
    }

    res.json({ message: 'Candidate entry removed from role successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate entry' });
  }
};

export const sendOutreach = async (req: any, res: Response) => {
  try {
    const { matchId } = req.params;
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: 'Email and message are required' });
    }

    const match = await MatchResult.findById(matchId).populate('roleId');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Verify ownership
    const role = await JobRole.findById(match.roleId);
    if (!role || role.createdBy?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const roleTitle = (match.roleId as any)?.title || 'Job Opportunity';
    const subject = `Opportunity: ${roleTitle} at ${req.user.company || 'TalentLens Partners'}`;

    await sendEmail(email, subject, message);

    res.json({ message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Send Outreach Error:', error);
    res.status(500).json({ message: error.message || 'Failed to send email' });
  }
};

