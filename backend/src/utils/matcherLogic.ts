import JobRole from '../models/JobRole';
import { normalizeSkill } from './skillNormalizer';

const expMap: Record<string, number> = {
  'Intern': 0, 'Entry': 1, 'Junior': 2, 'Mid': 4, 'Senior': 6, 'Lead': 8
};

export const computeMatch = (resume: any, job: any) => {
  const resumeSkills = (resume.parsedData?.skills || []).map((s: string) => normalizeSkill(s));
  const reqSkills = (job.requiredSkills || []).map((s: string) => normalizeSkill(s));
  const prefSkills = (job.preferredSkills || []).map((s: string) => normalizeSkill(s));

  // Use lowercased versions for comparison
  const resumeSkillsLow = resumeSkills.map((s: string) => s.toLowerCase());

  let skillsScore = 0;
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let missingSkills: string[] = [];

  if (reqSkills.length > 0) {
    reqSkills.forEach((rs: string) => {
      if (resumeSkillsLow.includes(rs.toLowerCase())) {
        skillsScore += (100 / reqSkills.length);
        strengths.push(rs); // Use canonical name
      } else {
        missingSkills.push(rs);
        weaknesses.push(`Missing core skill: ${rs}`);
      }
    });
  } else {
    skillsScore = 50; 
  }

  prefSkills.forEach((ps: string) => {
    if (resumeSkillsLow.includes(ps.toLowerCase())) {
      skillsScore += 5; 
      strengths.push(`Bonus skill: ${ps}`);
    }
  });

  skillsScore = Math.min(skillsScore, 100);

  const expectedExp = expMap[job.experienceLevel] || 2;
  const actualExp = resume.parsedData?.experienceYears || 0;
  
  let expScore = actualExp >= expectedExp ? 100 : (actualExp / expectedExp) * 100;
  
  const projectsScore = resume.resumeQualityScore || 75;
  const educationScore = 80;

  const overallScore = Math.round(
    (skillsScore * 0.45) + 
    (expScore * 0.25) + 
    (projectsScore * 0.20) + 
    (educationScore * 0.10)
  );

  let explanation = '';
  if (overallScore > 80) explanation = `Strong candidate! Meets core requirements with ${Math.round(skillsScore)}% skill match.`;
  else if (overallScore > 65) explanation = `Moderate fit. Missing ${missingSkills.length} core skills but has relevant background.`;
  else explanation = `Low fit for this specific role. Significant skill and experience gaps identified.`;

  return {
    overallScore,
    dimensionScores: { skills: skillsScore, experience: expScore, projects: projectsScore, education: educationScore },
    strengths,
    weaknesses,
    missingSkills,
    explanation
  };
};

export const runMatchingEngine = async (resume: any) => {
  const allRoles = await JobRole.find({ status: 'active' });
  const results = [];

  for (const job of allRoles) {
    const match = computeMatch(resume, job);
    results.push({
      role: job,
      match
    });
  }

  results.sort((a, b) => b.match.overallScore - a.match.overallScore);
  return results;
};
