import { Request, Response } from 'express';
import MatchResult from '../models/MatchResult';
import JobRole from '../models/JobRole';
import Resume from '../models/Resume';

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const totalRoles = await JobRole.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalMatches = await MatchResult.countDocuments();

    const matches = await MatchResult.find();
    const avgScore = matches.length > 0 
      ? matches.reduce((acc, curr) => acc + curr.overallScore, 0) / matches.length 
      : 0;

    const pipeline = [
      { name: 'Sourced', value: totalResumes },
      { name: 'Matched', value: totalMatches },
      { name: 'Screened', value: Math.floor(totalMatches * 0.4) },
      { name: 'Interviewed', value: Math.floor(totalMatches * 0.15) }
    ];

    res.json({
      totalRoles,
      totalResumes,
      totalMatches,
      avgScore: Math.round(avgScore),
      pipeline
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching metrics' });
  }
};
