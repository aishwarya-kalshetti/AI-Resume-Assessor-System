import express from 'express';
import { protect } from '../middleware/auth';
import { createJobRole, getJobRoles, updateJobRole, deleteJobRole, scanBias, generateRole } from '../controllers/jobRoleController';

const router = express.Router();

router.get('/', protect, getJobRoles);
router.post('/', protect, createJobRole);
router.post('/generate', protect, generateRole);
router.put('/:roleId', protect, updateJobRole);
router.delete('/:roleId', protect, deleteJobRole);
router.post('/scan-bias', protect, scanBias);

export default router;
