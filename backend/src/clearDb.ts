import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import JobRole from './models/JobRole';
import Resume from './models/Resume';
import MatchResult from './models/MatchResult';
import Assessment from './models/Assessment';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentlens';

const clearDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for cleanup...');

    await User.deleteMany({});
    await JobRole.deleteMany({});
    await Resume.deleteMany({});
    await MatchResult.deleteMany({});
    await Assessment.deleteMany({});

    console.log('Successfully cleared all data from the database.');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup error:', error);
    process.exit(1);
  }
};

clearDatabase();
