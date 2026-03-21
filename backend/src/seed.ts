import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import JobRole from './models/JobRole';
import Resume from './models/Resume';
import MatchResult from './models/MatchResult';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentlens';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await User.deleteMany();
    await JobRole.deleteMany();
    await Resume.deleteMany();
    await MatchResult.deleteMany();

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const recruiter = await User.create({
      name: 'Sarah Recruiter',
      email: 'recruiter@talentlens.ai',
      password,
      role: 'recruiter',
    });

    const candidate1 = await User.create({
      name: 'Alex Developer',
      email: 'candidate@talentlens.ai',
      password,
      role: 'candidate',
    });

    const candidate2 = await User.create({
      name: 'Jordan Designer',
      email: 'jordan@talentlens.ai',
      password,
      role: 'candidate',
    });

    // 2. Create Job Roles
    const role1 = await JobRole.create({
      title: 'Senior Frontend Engineer',
      description: 'Looking for a React expert with strong UI/UX sensibilities.',
      requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript'],
      preferredSkills: ['Next.js', 'Framer Motion', 'GraphQL'],
      experienceLevel: 'Senior',
      department: 'Engineering',
      status: 'open',
      createdBy: recruiter._id,
    });

    const role2 = await JobRole.create({
      title: 'Full Stack Developer',
      description: 'Build robust end-to-end applications using the MERN stack.',
      requiredSkills: ['Node.js', 'Express', 'React', 'MongoDB'],
      preferredSkills: ['AWS', 'Docker', 'Redis'],
      experienceLevel: 'Mid',
      department: 'Engineering',
      status: 'open',
      createdBy: recruiter._id,
    });

    const role3 = await JobRole.create({
      title: 'UI/UX Designer',
      description: 'Design beautiful, intuitive interfaces for our core product.',
      requiredSkills: ['Figma', 'Prototyping', 'Wireframing', 'User Research'],
      preferredSkills: ['Framer', 'CSS', 'HTML'],
      experienceLevel: 'Mid',
      department: 'Design',
      status: 'open',
      createdBy: recruiter._id,
    });

    // 3. Create Resumes
    const resume1 = await Resume.create({
      userId: candidate1._id,
      fileName: 'Alex_Resume_2026.pdf',
      fileUrl: '/uploads/mock1.pdf',
      parsedData: {
        skills: ['React', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Express', 'MongoDB'],
        experience: 4,
        education: 'BS Computer Science',
        projects: ['E-commerce Platform', 'Real-time Chat App'],
      },
      parsingConfidence: 94,
      status: 'processed'
    });

    const resume2 = await Resume.create({
      userId: candidate2._id,
      fileName: 'Jordan_Portfolio.pdf',
      fileUrl: '/uploads/mock2.pdf',
      parsedData: {
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'React', 'Tailwind CSS', 'Wireframing'],
        experience: 3,
        education: 'BA Graphic Design',
        projects: ['Fintech Mobile App Redesign', 'Saas Dashboard UI'],
      },
      parsingConfidence: 88,
      status: 'processed'
    });

    // 4. Create Match Results (Alex to Role 1 and Role 2)
    await MatchResult.create({
      candidateId: candidate1._id,
      roleId: role1._id,
      resumeId: resume1._id,
      overallScore: 85,
      dimensionScores: {
        skills: 90,
        experience: 80,
        projects: 85,
        education: 85
      },
      missingSkills: ['Next.js', 'Framer Motion'],
      matchedSkills: ['React', 'TypeScript', 'JavaScript'],
      explanation: 'Strong Frontend candidate with excellent React and TypeScript fundamentals. Minor gap in Next.js but highly trainable.',
      recommendedAlternateRoleId: null,
      status: 'shortlisted'
    });

    await MatchResult.create({
      candidateId: candidate1._id,
      roleId: role2._id,
      resumeId: resume1._id,
      overallScore: 92,
      dimensionScores: {
        skills: 95,
        experience: 90,
        projects: 90,
        education: 93
      },
      missingSkills: ['Docker', 'AWS'],
      matchedSkills: ['Node.js', 'Express', 'React', 'MongoDB'],
      explanation: 'Exceptional MERN stack developer. Alex matches nearly all core requirements for this Full Stack role.',
      alternateRoleFlag: true,
      recommendedAlternateRoleId: role2._id, // Suggesting Role 2 as alternate over Role 1!
      status: 'recommended'
    });

    // Match Jordan to UI/UX
    await MatchResult.create({
      candidateId: candidate2._id,
      roleId: role3._id,
      resumeId: resume2._id,
      overallScore: 88,
      dimensionScores: {
        skills: 85,
        experience: 88,
        projects: 95,
        education: 85
      },
      missingSkills: ['User Research', 'Framer'],
      matchedSkills: ['Figma', 'Prototyping', 'Wireframing', 'CSS'],
      explanation: 'Solid design candidate with great prototyping skills. Familiarity with frontend code (React/Tailwind) makes communication with engineers easier.',
      status: 'shortlisted'
    });

    console.log('Database seeded successfully with Users, Job Roles, Resumes, and Matches!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
