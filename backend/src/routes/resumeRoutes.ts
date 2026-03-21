import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth';
import { uploadResume, getMyResumes, batchUploadResumes } from '../controllers/resumeController';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.post('/batch-upload', protect, upload.array('resumes', 50), batchUploadResumes);
router.get('/my', protect, getMyResumes);

export default router;
