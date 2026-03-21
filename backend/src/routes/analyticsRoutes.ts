import express from 'express';
import { protect } from '../middleware/auth';
import { getDashboardMetrics } from '../controllers/analyticsController';

const router = express.Router();

router.get('/metrics', protect, getDashboardMetrics);

export default router;
