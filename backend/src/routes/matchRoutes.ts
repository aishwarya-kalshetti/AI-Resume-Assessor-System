import { Request, Response } from 'express';
import Resume from '../models/Resume';
import express from 'express';
import { protect } from '../middleware/auth';
import { 
  triggerMatch, 
  getCandidateMatches, 
  getRoleMatches, 
  generateOutreach, 
  autoTailorResume,
  updateMatchStatus,
  deleteMatch,
  sendOutreach,
  inviteToAssessment,
  scheduleInterview
} from '../controllers/matchController';

const router = express.Router();

router.post('/trigger', protect, triggerMatch);
router.get('/candidate/:candidateId?', protect, getCandidateMatches);
router.get('/role/:roleId', protect, getRoleMatches);
router.post('/:matchId/outreach', protect, generateOutreach);
router.post('/:matchId/tailor', protect, autoTailorResume);
router.patch('/:matchId/status', protect, updateMatchStatus);
router.delete('/:matchId', protect, deleteMatch);
router.post('/:matchId/send-outreach', protect, sendOutreach);
router.post('/:matchId/invite-assessment', protect, inviteToAssessment);
router.post('/:matchId/schedule', protect, scheduleInterview);

export default router;
