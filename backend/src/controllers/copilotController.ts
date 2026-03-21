import { Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MatchResult from '../models/MatchResult';
import JobRole from '../models/JobRole';
import User from '../models/User';

export const handleCopilotQuery = async (req: any, res: Response) => {
  try {
    const { message, roleId, history = [] } = req.body;
    
    // 1. Fetch data for context
    const matches = await MatchResult.find({ roleId })
      .populate('candidateId', 'name email')
      .populate('resumeId');

    const context = matches.map(m => ({
      name: m.candidateName || (m.candidateId as any)?.name || 'Candidate',
      score: m.overallScore,
      skills: m.resumeId ? (m.resumeId as any).parsedData?.skills : [],
      projects: m.resumeId ? (m.resumeId as any).parsedData?.projects : [],
      experienceYears: m.resumeId ? (m.resumeId as any).parsedData?.experienceYears : 0,
      strengths: m.strengths || [],
      weaknesses: m.weaknesses || []
    }));

    // 2. Try Gemini AI
    const rawKey = process.env.GEMINI_API_KEY;
    if (rawKey && rawKey.length > 10 && !rawKey.includes('PLACEHOLDER')) {
      try {
        const genAI = new GoogleGenerativeAI(rawKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
        
        const chatHistory = history.map((chat: any) => ({
          role: chat.role === 'user' ? 'user' : 'model',
          parts: [{ text: chat.content }]
        }));

        const systemPrompt = `You are a Recruitment AI Assistant. Candidates: ${JSON.stringify(context)}. 
        Guidelines:
        - Greeting: If message is "hello/hi", greet and mention the ${context.length} candidates.
        - Analysis: If they ask for skills/exp/projects, use the data in the context.
        - Stats: Be data-driven and professional.`;
        
        const chat = model.startChat({
          history: chatHistory,
          generationConfig: { maxOutputTokens: 800 }
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        const aiText = result.response.text();
        if (aiText) return res.json({ answer: aiText });
      } catch (aiError: any) {
        console.error('Gemini API Error in Copilot:', aiError.message || aiError);
      }
    }

    // 3. ENHANCED DYNAMIC FALLBACK (If AI fails)
    const query = message.toLowerCase();
    const topCandidate = context.sort((a,b) => b.score - a.score)[0];
    let simResponse = "";

    if (!topCandidate) {
      simResponse = "I haven't found any candidates for this role yet. Please upload some resumes to get started!";
    } else if (query.includes("how many project")) {
      const count = topCandidate.projects?.length || 0;
      simResponse = `${topCandidate.name} has worked on ${count} key projects mentioned in the resume.`;
    } else if (query.includes("what project") || query.includes("list project") || query.includes("worked on")) {
      const pList = topCandidate.projects || [];
      simResponse = pList.length > 0 
        ? `${topCandidate.name} worked on: ${pList.join(', ')}. These showcase strong ${topCandidate.skills[0]} skills.`
        : `${topCandidate.name} has significant experience but no specific project names were extracted.`;
    } else if (query.includes("skill") || query.includes("know") || query.includes("can do")) {
      simResponse = `${topCandidate.name} is a strong choice with skills in ${topCandidate.skills.slice(0, 4).join(', ')}.`;
    } else if (query.includes("exper") || query.includes("how long") || query.includes("year")) {
      simResponse = `${topCandidate.name} has approximately ${topCandidate.experienceYears} years of relevant experience.`;
    } else if (query.includes("who") || query.includes("best") || query.includes("top")) {
      simResponse = `${topCandidate.name} is currently leading with an ${topCandidate.score}% match score.`;
    } else {
      simResponse = `I've analyzed the candidates, and ${topCandidate.name} stands out with a ${topCandidate.score}% match and strengths in ${topCandidate.strengths.slice(0, 2).join(', ')}.`;
    }

    res.json({ answer: simResponse });

  } catch (error) {
    console.error('Copilot Query Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
export const simulateCandidate = async (req: any, res: Response) => {
  try {
    const { message, matchId, history = [] } = req.body;
    
    const match = await MatchResult.findById(matchId).populate('resumeId').populate('roleId');
    if (!match) return res.status(404).json({ message: 'Candidate match not found' });

    // Data Isolation: Verify that the recruiter owns the role or the candidate is the user
    const role = await JobRole.findById(match.roleId);
    const isRecruiter = role?.createdBy?.toString() === req.user._id.toString();
    const isCandidate = match.candidateId?.toString() === req.user._id.toString();

    if (!isRecruiter && !isCandidate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const candidateName = match.candidateName || 'Candidate';
    const resumeData = (match.resumeId as any)?.parsedData;
    const roleTitle = (match.roleId as any)?.title || 'this position';

    const personaContext = `
      Name: ${candidateName}
      Applying for: ${roleTitle}
      Skills: ${resumeData?.skills?.join(', ') || 'General professional skills'}
      Experience: ${resumeData?.experienceYears || 'proven'} years
      Summary: ${resumeData?.summary || 'Experienced professional.'}
    `;

    const rawKey = process.env.GEMINI_API_KEY;
    if (rawKey && rawKey.length > 10 && !rawKey.includes('PLACEHOLDER')) {
      try {
        console.log(`[SIMULATION] Starting Gemini (gemini-pro) for ${candidateName}`);
        const genAI = new GoogleGenerativeAI(rawKey);
        const model = genAI.getGenerativeModel({ 
          model: "gemini-pro",
        });
        
        // Build a manual chat history string for more control
        const recentHistory = history.slice(-5).map((h: any) => `${h.role === 'user' ? 'Recruiter' : candidateName}: ${h.content}`).join('\n');

        const systemPrompt = `You are ${candidateName}, a professional candidate applying for the ${roleTitle} position. 
        ---
        CANDIDATE PROFILE:
        ${personaContext}
        ---
        INTERVIEW HISTORY:
        ${recentHistory}
        ---
        INSTRUCTIONS:
        1. Stay strictly in character as ${candidateName}.
        2. Use the profile data (skills, experience: ${resumeData?.experienceYears} years) provided above.
        3. Keep your response brief and natural (1-3 sentences).
        4. Do NOT use prefixes like "As Aarav Mehta" or "As an AI". 
        5. Just answer the recruiter directly.
        6. Current Recruiter Question: "${message}"`;
        
        const result = await model.generateContent(systemPrompt);
        const answer = result.response.text().trim();
        
        if (answer) {
          console.log(`[SIMULATION] Successful AI response for ${candidateName}`);
          return res.json({ answer });
        }
      } catch (aiError: any) {
        console.error('Gemini Simulation API Error:', aiError);
      }
    }

    console.log(`[SIMULATION] Data-Driven Fallback for ${candidateName}`);
    const query = message.toLowerCase();
    const skills = resumeData?.skills || [];
    const projects = resumeData?.projects || [];
    const exp = resumeData?.experienceYears || 'proven';
    
    // EXTREMELY ROBUST DATA-DRIVEN FALLBACK
    let fallbackText = `I have extensive experience with ${skills[0] || 'software development'}, and I always focus on delivering high-quality, scalable code. My background aligns well with the ${roleTitle} role.`;
    
    if (query.includes('introduce') || query.includes('tell me about')) {
      fallbackText = `I'm ${candidateName}, a developer with ${exp} years of experience. I specialize in ${skills.slice(0, 3).join(', ') || 'modern software engineering'}. I'm excited about the possibility of joining your team!`;
    } else if (query.includes('why should we hire') || query.includes('why are you')) {
      fallbackText = `You should hire me because I bring strong technical expertise in ${skills.slice(0, 2).join(' and ') || 'engineering'} combined with ${exp} years of hands-on experience. I'm a fast learner and a solid team player.`;
    } else if (query.includes('experience') || query.includes('how long')) {
      fallbackText = `Throughout my ${exp} years in the industry, I've worked on building robust applications. I've spent a lot of time working with ${skills.slice(0, 2).join(' and ')} to solve complex real-world problems.`;
    } else if (query.includes('skill') || query.includes('what do you know')) {
      fallbackText = `My core technical stack includes ${skills.join(', ')}. I'm also comfortable with general software design patterns and collaborating with cross-functional teams.`;
    } else if (query.includes('project') || query.includes('worked on')) {
      if (projects.length > 0) {
        fallbackText = `Some of the key projects I've worked on include: ${projects.slice(0, 3).join(', ')}. These projects allowed me to apply my skills in ${skills[0] || 'development'} to deliver meaningful results.`;
      } else {
        fallbackText = `I've worked on several impactful projects involving ${skills.slice(0, 2).join(' and ')}. Most of my work focused on building scalable, user-centric features.`;
      }
    } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
      fallbackText = `Hello! I'm ${candidateName}. It's great to meet you. What would you like to know about my experience or skills?`;
    }

    res.json({ answer: fallbackText });
  } catch (error) {
    console.error('Simulation Error:', error);
    res.status(500).json({ message: 'Error simulating candidate' });
  }
};
