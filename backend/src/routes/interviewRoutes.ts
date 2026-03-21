import express from 'express';
import { scheduleInterview } from '../controllers/interviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/schedule', protect, scheduleInterview);

export default router;
