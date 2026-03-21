import express from 'express';
import { protect } from '../middleware/auth';
import { handleCopilotQuery, simulateCandidate } from '../controllers/copilotController';

const router = express.Router();

router.post('/query', protect, handleCopilotQuery);
router.post('/simulate', protect, simulateCandidate);

export default router;
