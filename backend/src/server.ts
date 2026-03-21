import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import jobRoleRoutes from './routes/jobRoleRoutes';
import matchRoutes from './routes/matchRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import copilotRoutes from './routes/copilotRoutes';
import interviewRoutes from './routes/interviewRoutes';

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TalentLens AI API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/roles', jobRoleRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/copilot', copilotRoutes);
app.use('/api/interviews', interviewRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentlens';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
