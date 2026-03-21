import { Request, Response } from 'express';
import MatchResult from '../models/MatchResult';
import Assessment from '../models/Assessment';
import { generateFollowUpQuestion } from '../services/aiService';

export const generateAssessment = async (req: any, res: Response) => {
  try {
    const { matchId } = req.body;
    
    const match = await MatchResult.findById(matchId).populate('roleId');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    let assessment = await Assessment.findOne({ candidateId: req.user._id, roleId: match.roleId });
    
    if (!assessment) {
      const title = (match.roleId as any)?.title || 'this role';
      const initialQuestion = `Why do you feel you are a good fit for the ${title} position?`;
      
      const questions = [{
        questionId: 'q1',
        questionText: initialQuestion,
        category: 'Communication'
      }];

      assessment = await Assessment.create({
        candidateId: req.user._id,
        roleId: match.roleId,
        questions,
        answers: [],
        overallAssessmentScore: 0,
        status: 'started',
        isConversational: true
      });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating assessment' });
  }
};

export const submitAnswer = async (req: any, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const { questionId, transcription } = req.body;
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const audioUrl = req.file ? `/uploads/audio/${req.file.originalname}` : '';
    
    const answerIndex = assessment.answers.findIndex(a => a.questionId === questionId);
    if (answerIndex > -1) {
      assessment.answers[answerIndex].transcription = transcription;
      if (audioUrl) assessment.answers[answerIndex].responseAudioUrl = audioUrl;
    } else {
      assessment.answers.push({
        questionId,
        transcription,
        responseAudioUrl: audioUrl
      });
    }

    // Dynamic Follow-up Logic
    const MAX_QUESTIONS = 5;
    if (assessment.answers.length < MAX_QUESTIONS) {
      const lastQuestion = assessment.questions.find(q => q.questionId === questionId)?.questionText || '';
      const roleTitle = (assessment.roleId as any)?.title || 'this role';
      
      const nextQuestionText = await generateFollowUpQuestion(lastQuestion, transcription, roleTitle);
      
      assessment.questions.push({
        questionId: `q${assessment.questions.length + 1}`,
        questionText: nextQuestionText,
        category: 'Dynamic Follow-up'
      });
    } else {
      // Complete the assessment
      assessment.status = 'completed';
      assessment.communicationScore = 80 + Math.random() * 15;
      assessment.technicalScore = 75 + Math.random() * 20;
      assessment.overallAssessmentScore = (assessment.communicationScore + assessment.technicalScore) / 2;
    }

    await assessment.save();
    res.json(assessment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
};

export const getCandidateAssessment = async (req: any, res: Response) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await Assessment.findById(assessmentId).populate('roleId');
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessment' });
  }
};
