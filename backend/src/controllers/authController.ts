import { Request, Response } from 'express';
import User from '../models/User';
import Resume from '../models/Resume';
import MatchResult from '../models/MatchResult';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const linkOrphanedData = async (userId: string, email: string) => {
  try {
    const safeEmail = email.trim().toLowerCase();
    const emailRegex = new RegExp('^' + safeEmail + '$', 'i');

    // 1. Re-assign any resumes matching this email that don't belong to this user
    await Resume.updateMany(
      { userId: { $ne: userId }, 'parsedData.email': emailRegex },
      { userId }
    );
    // 2. Re-assign any match results matching this email that don't belong to this user
    await MatchResult.updateMany(
      { candidateEmail: emailRegex },
      { candidateId: userId }
    );
  } catch (error) {
    console.error('Data linking error:', error);
  }
};

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate'
    });

    if (user) {
      // Link any previously uploaded recruiter data for this candidate
      if (user.role === 'candidate') {
        await linkOrphanedData(user._id.toString(), email);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Periodic check to link data in case something was uploaded while they were away
      if (user.role === 'candidate') {
        await linkOrphanedData(user._id.toString(), email);
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: any, res: Response) => {
  res.json(req.user);
};
