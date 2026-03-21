import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth';
import { generateAssessment, submitAnswer, getCandidateAssessment } from '../controllers/assessmentController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', protect, generateAssessment);
router.post('/:assessmentId/submit', protect, upload.single('audio'), submitAnswer);
router.get('/:assessmentId', protect, getCandidateAssessment);

export default router;
