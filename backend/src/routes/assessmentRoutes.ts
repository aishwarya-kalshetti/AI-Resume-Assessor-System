import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth';
import { generateAssessment, submitAnswer, getCandidateAssessment, getAssessmentByMatch } from '../controllers/assessmentController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', protect, generateAssessment);
router.post('/:assessmentId/submit', protect, upload.single('audio'), submitAnswer);
router.get('/match/:matchId', protect, getAssessmentByMatch);
router.get('/:assessmentId', protect, getCandidateAssessment);

export default router;
