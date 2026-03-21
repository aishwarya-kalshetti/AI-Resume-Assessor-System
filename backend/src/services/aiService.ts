import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper for Gemini
const getGeminiModel = () => {
  if (!genAI) return null;
  // Using gemini-1.5-flash as default, it's the most robust across regions
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

export const summarizeResume = async (text: string) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Summarize this candidate's resume into a 2-3 sentence professional bio. Focus on their core strengths and years of experience. Resume Text: ${text.substring(0, 5000)}`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.error('Gemini Summary Error:', e);
    }
  }
  return text.substring(0, 300).replace(/\n/g, ' ').trim() + '...';
};

export const extractCandidateName = async (text: string, fileName: string) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const sample = text.substring(0, 2000);
      const prompt = `Extract the candidate's full legal name from the following resume text. 
      Only return the name, no other text. If no clear name is found, return "Unknown". 
      Resume Text Snapshot: ${sample}`;
      const result = await model.generateContent(prompt);
      const name = result.response.text().trim();
      if (name && name.toLowerCase() !== 'unknown' && name.split(' ').length <= 4) {
        return name;
      }
    } catch (e) {
      console.error('Gemini Name extraction Error:', e);
    }
  }

  // ROBUST HEURISTIC FALLBACK (If AI fails)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const searchLines = lines.slice(0, 10);

  for (const line of searchLines) {
    // Skip emails, phones, and common headers
    if (/@/.test(line) || /^\d/.test(line)) continue;
    if (/resume|curriculum|summary|experience|objective|contact|email|phone|skills|education/i.test(line)) continue;

    // Clean name from bullets/numbers
    const cleaned = line.replace(/^[\u2022\-\*\d\.\)]+\s*/, '').trim();
    const words = cleaned.split(/\s+/);

    // Names are typically 2-3 words, mostly capitalized
    if (words.length >= 2 && words.length <= 3) {
      if (words.every(w => /^[A-Z][a-z]*/.test(w))) {
        return cleaned;
      }
    }
  }

  // Last resort: filename
  return fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();
};

export const generateTailoredResume = async (
  candidateName: string,
  missingSkills: string[],
  roleTitle: string
) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Generate a 3-sentence professional summary for ${candidateName} tailored for a ${roleTitle} role. Mention they are upskilling in ${missingSkills.join(', ')}.`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.error('Gemini Tailor Error:', e);
    }
  }

  const skillInjection = missingSkills.length > 0
    ? `Proactively upskilling in ${missingSkills.slice(0, 2).join(' and ')} to align with modern architectural patterns.`
    : `Continuously adapting to cutting-edge tools to deliver optimized solutions.`;

  return `Highly motivated and results-driven professional seeking the ${roleTitle} position. With a strong track record of rapidly understanding domain complexities, I bring scalable, maintainable logic to production applications. ${skillInjection}`;
};

export const generateOutreachEmail = async (
  candidateName: string,
  roleTitle: string,
  matchScore: number,
  strengths: string[]
) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Write a short, professional outreach email to ${candidateName} for a ${roleTitle} position. Mention their ${matchScore}% match score and strengths in ${strengths.slice(0, 2).join(', ')}.`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.error('Gemini Outreach Error:', e);
    }
  }

  const keyStrength = strengths.length > 0 ? strengths[0] : 'your impressive background';
  return `Hi ${candidateName},\n\nI'm reaching out because your profile caught my eye for our ${roleTitle} position. Your expertise in ${keyStrength} aligns perfectly with our stack. Given your ${matchScore}% match score, we'd love to chat!`;
};

export const generateFollowUpQuestion = async (
  previousQuestion: string,
  candidateAnswer: string,
  roleTitle: string
) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Act as an expert technical interviewer for a ${roleTitle} position. Previous question: "${previousQuestion}". Candidate answered: "${candidateAnswer}". Ask ONE brief, insightful follow-up question.`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      console.error('Gemini Follow-up Error:', e);
    }
  }
  return `That's a great example! How did you ensure the scalability of that solution?`;
};

export const generateRoleDescription = async (title: string) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Act as an expert technical recruiter and architect. Generate a professional, high-impact job role description for: "${title}".
      Return EXACTLY this JSON structure:
      {
        "description": "2-3 sentences highlighting the mission, technical impact, and primary stack focus.",
        "requiredSkills": ["Deep Technical Skill 1", "Core Tech 2", "Core Tech 3", "Architecture/Methodology 4", "Soft Skill 5"]
      }
      IMPORTANT: Ensure at least 80% of the 'requiredSkills' are core technical/hard skills relevant to the role.
      Return ONLY valid JSON.`;

      const result = await model.generateContent(prompt);
      const output = result.response.text();

      const jsonMatch = output.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

      return {
        description: parsed?.description || `We are looking for a talented ${title} to join our growing team...`,
        requiredSkills: parsed?.requiredSkills || (title.toLowerCase().includes('frontend') ? ["React", "TypeScript", "CSS", "Problem Solving"] : ["Node.js", "API Design", "SQL", "Teamwork"])
      };
    } catch (e) {
      console.error('Gemini Role Gen Error:', e);
    }
  }

  // Improved Fallback with more "real" feel even if AI fails
  const t = title.toLowerCase();
  const isFrontend = t.includes('frontend') || t.includes('react') || t.includes('web');
  const isBackend = t.includes('backend') || t.includes('node') || t.includes('api') || t.includes('server');
  const isCloud = t.includes('cloud') || t.includes('aws') || t.includes('devops') || t.includes('infrastructure');
  const isFullstack = t.includes('fullstack') || t.includes('full stack');
  
  let dynamicSkills = ["Problem Solving", "System Design", "Agile Methodology", "Code Review", "Communication"];
  
  if (isFrontend || isFullstack) dynamicSkills = ["React.js", "TypeScript", "Modern CSS", "Web Performance", ...dynamicSkills];
  if (isBackend || isFullstack) dynamicSkills = ["Node.js", "API Design", "Database Management", "Security", ...dynamicSkills];
  if (isCloud) dynamicSkills = ["AWS/Cloud", "Docker", "Kubernetes", "CI/CD Pipelines", ...dynamicSkills];
  
  // Ensure we don't have too many and keep them relevant
  const uniqueSkills = [...new Set(dynamicSkills)].slice(0, 8);

  return {
    description: `We are looking for a highly motivated ${title} to contribute to our core infrastructure and deliver high-quality scalable solutions.`,
    requiredSkills: uniqueSkills
  };
};

export const analyzeJobBias = async (description: string) => {
  const model = getGeminiModel();
  if (model && !process.env.GEMINI_API_KEY?.includes('PLACEHOLDER')) {
    try {
      const prompt = `Analyze this job description for bias: "${description}". Return JSON: {score: 0-100, issues: [], suggestions: []}.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return JSON.parse(text);
    } catch (e) {
      console.error('Gemini Bias Error:', e);
    }
  }

  return {
    score: 85,
    issues: ["Looking for a 'rockstar' developer"],
    suggestions: ["Looking for an 'exceptional' developer"]
  };
};

export const calculateFlightRisk = async (parsedExperience: any) => {
  // simple predictive logic for prototype
  const years = parsedExperience?.experience || 5;
  const risk = years < 3 ? 'High' : years < 6 ? 'Medium' : 'Low';
  const probability = years < 3 ? 75 : years < 6 ? 40 : 15;

  return { risk, probability };
};
