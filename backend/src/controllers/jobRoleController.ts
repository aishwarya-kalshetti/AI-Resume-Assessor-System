import { Request, Response } from 'express';
import JobRole from '../models/JobRole';
import { analyzeJobBias } from '../services/aiService';
import { normalizeSkill } from '../utils/skillNormalizer';

export const createJobRole = async (req: any, res: Response) => {
  try {
    const { title, department, description, requiredSkills, preferredSkills, experienceLevel } = req.body;
    
    // Simple heuristic to extract text into array if it's sent as string
    const formatSkills = (skills: string | string[] | undefined) => {
      if (!skills) return [];
      const raw = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
      return raw.map(s => normalizeSkill(s));
    };

    const jobRole = await JobRole.create({
      title,
      department,
      description,
      requiredSkills: formatSkills(requiredSkills),
      preferredSkills: formatSkills(preferredSkills),
      experienceLevel,
      status: req.body.status || 'active',
      createdBy: req.user._id
    });

    res.status(201).json(jobRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating job role' });
  }
};

export const getJobRoles = async (req: any, res: Response) => {
  try {
    const roles = await JobRole.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving roles' });
  }
};

export const updateJobRole = async (req: any, res: Response) => {
  try {
    const { title, department, description, requiredSkills, preferredSkills, experienceLevel, status } = req.body;
    
    const formatSkills = (skills: string | string[] | undefined) => {
      if (!skills) return [];
      const raw = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
      return raw.map(s => normalizeSkill(s));
    };

    const jobRole = await JobRole.findByIdAndUpdate(
      req.params.roleId,
      {
        title,
        department,
        description,
        requiredSkills: formatSkills(requiredSkills),
        preferredSkills: formatSkills(preferredSkills),
        experienceLevel,
        status: status || 'active'
      },
      { new: true }
    );

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json(jobRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating job role' });
  }
};

export const deleteJobRole = async (req: any, res: Response) => {
  try {
    const { roleId } = req.params;
    const jobRole = await JobRole.findById(roleId);

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    // Check ownership
    if (jobRole.createdBy && jobRole.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this role' });
    }

    await JobRole.findByIdAndDelete(roleId);
    res.json({ message: 'Job role deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting job role' });
  }
};

export const generateRole = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    // Import here to avoid circular dependency if any
    const { generateRoleDescription } = require('../services/aiService');
    const roleDetails = await generateRoleDescription(title);
    
    res.json(roleDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error generating role details' });
  }
};

export const scanBias = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ message: 'Description is required' });
    
    const analysis = await analyzeJobBias(description);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error scanning bias' });
  }
};
