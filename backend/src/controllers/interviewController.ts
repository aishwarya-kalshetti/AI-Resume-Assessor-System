import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MatchResult from '../models/MatchResult';
import User from '../models/User';
import JobRole from '../models/JobRole';

// Simulated recruiter slots (in a real system, this would come from a calendar API)
const generateAvailableSlots = () => {
  const slots = [];
  const now = new Date();
  for (let d = 1; d <= 5; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends
    const hours = [9, 11, 14, 16];
    for (const h of hours) {
      const slot = new Date(date);
      slot.setHours(h, 0, 0, 0);
      slots.push(slot);
    }
  }
  return slots;
};

export const scheduleInterview = async (req: any, res: Response) => {
  try {
    const { matchId, candidateName } = req.body;

    const match = await MatchResult.findById(matchId).populate('candidateId', 'name email').populate('roleId');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Verify role ownership (only the recruiter who created the role can schedule)
    const role = await JobRole.findById(match.roleId);
    if (!role || !role.createdBy || role.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this role' });
    }

    const finalCandidateName = (match as any).candidateName || candidateName || (match.candidateId as any)?.name || 'Candidate';

    const slots = generateAvailableSlots();
    const bestSlot = slots[0]; // AI picks the first available slot (simulate AI decision)
    const displayDate = bestSlot.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const displayTime = bestSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let aiReason = `I found the earliest mutual availability window for ${finalCandidateName}. A ${displayTime} slot on ${displayDate} has been reserved.`;

    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('PLACEHOLDER')) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Write a short, professional 1-sentence reason for scheduling an interview on ${displayDate} at ${displayTime} for a candidate named ${finalCandidateName} who has a ${match.overallScore}% match score. Be confident and data-driven.`;
        const result = await model.generateContent(prompt);
        aiReason = result.response.text();
      } catch (_) {}
    }

    // Simulate saving the scheduled interview
    const scheduledInterview = {
      matchId,
      candidateName: finalCandidateName,
      candidateEmail: (match.candidateId as any)?.email,
      scheduledAt: bestSlot.toISOString(),
      displayDate,
      displayTime,
      meetLink: `https://meet.google.com/xxx-${Math.random().toString(36).substring(2, 9)}`,
      aiReason,
      status: 'Scheduled'
    };

    res.json(scheduledInterview);
  } catch (error) {
    console.error('Schedule Error:', error);
    res.status(500).json({ message: 'Error scheduling interview' });
  }
};
