import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume';
import MatchResult from '../models/MatchResult';
import { parseResumeFile } from '../utils/resumeParser';
import { runMatchingEngine } from '../utils/matcherLogic';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

export const uploadResume = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const safeFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    fs.writeFileSync(path.join(uploadsDir, safeFileName), fileBuffer);

    const parsedData = await parseResumeFile(fileBuffer, fileName);

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: fileName,
      fileUrl: `/uploads/${safeFileName}`,
      parsedData,
      parsingConfidence: 85,
      resumeQualityScore: 80 + Math.floor(Math.random() * 10),
      improvementTips: ['Consider quantifying your achievements', 'Ensure contact info is clear']
    });

    const matchEngineOutputs = await runMatchingEngine(resume);
    if (matchEngineOutputs && matchEngineOutputs.length > 0) {
      const bestMatch = matchEngineOutputs[0];
      const extractedName = parsedData.name;
      const fileNameFallback = fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();
      const finalCandidateName = extractedName || fileNameFallback;

      for (let i = 0; i < matchEngineOutputs.length; i++) {
        const output = matchEngineOutputs[i];
        const isAlternate = (i > 0);
        
        await MatchResult.create({
          candidateId: resume.userId,
          candidateName: finalCandidateName,
          candidateEmail: parsedData.email,
          resumeId: resume._id,
          roleId: output.role._id,
          overallScore: output.match.overallScore,
          dimensionScores: output.match.dimensionScores,
          explanation: output.match.explanation,
          strengths: output.match.strengths,
          weaknesses: output.match.weaknesses,
          missingSkills: output.match.missingSkills,
          alternateRoleFlag: isAlternate && output.match.overallScore > 70,
          recommendedAlternateRoleId: isAlternate ? bestMatch.role._id : null
        });
      }
    }

    res.status(201).json(resume);
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error processing resume' });
  }
};

export const getMyResumes = async (req: any, res: Response) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const batchUploadResumes = async (req: any, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const results: { fileName: string; status: 'success' | 'failed'; error?: string }[] = [];

    for (const file of files) {
      try {
        const parsedData = await parseResumeFile(file.buffer, file.originalname);
        const safeFileName = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        fs.writeFileSync(path.join(uploadsDir, safeFileName), file.buffer);
        const resume = await Resume.create({
          userId: req.user._id,
          fileName: file.originalname,
          fileUrl: `/uploads/${safeFileName}`,
          parsedData,
          parsingConfidence: 85,
          resumeQualityScore: 80 + Math.floor(Math.random() * 10),
          improvementTips: ['Consider quantifying your achievements', 'Ensure contact info is clear']
        });

        const matchEngineOutputs = await runMatchingEngine(resume);
        if (matchEngineOutputs && matchEngineOutputs.length > 0) {
          const bestMatch = matchEngineOutputs[0];
          const extractedName = parsedData.name;
          const fileNameFallback = file.originalname.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();
          const finalCandidateName = extractedName || fileNameFallback;

          for (let i = 0; i < matchEngineOutputs.length; i++) {
            const output = matchEngineOutputs[i];
            await MatchResult.create({
              candidateId: resume.userId,
              candidateName: finalCandidateName,
              candidateEmail: parsedData.email,
              resumeId: resume._id,
              roleId: output.role._id,
              overallScore: output.match.overallScore,
              dimensionScores: output.match.dimensionScores,
              explanation: output.match.explanation,
              strengths: output.match.strengths,
              weaknesses: output.match.weaknesses,
              missingSkills: output.match.missingSkills,
              alternateRoleFlag: i > 0 && output.match.overallScore > 70,
              recommendedAlternateRoleId: i > 0 ? bestMatch.role._id : null
            });
          }
        }
        results.push({ fileName: file.originalname, status: 'success' });
      } catch (fileError: any) {
        results.push({ fileName: file.originalname, status: 'failed', error: fileError.message });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    res.status(201).json({
      message: `Batch upload complete: ${successCount}/${files.length} resumes processed successfully.`,
      results
    });
  } catch (error) {
    console.error('Batch Upload Error:', error);
    res.status(500).json({ message: 'Error processing batch upload' });
  }
};
