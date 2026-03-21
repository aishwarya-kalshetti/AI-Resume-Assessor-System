# 🎯 TalentLens AI — AI-Powered Resume Assessor & Hiring Intelligence Platform

TalentLens AI is a full-stack, production-grade hiring intelligence platform that goes far beyond keyword matching. It parses resumes, analyzes job descriptions, matches candidates against multiple roles simultaneously, and generates explainable multi-dimensional AI scorecards — all powered by Google Gemini AI.

Built as a response to **Assignment Brief 1: The Resume Assessor**, this platform significantly exceeds the deliverables with enterprise-grade AI features.

---

## ✅ Problem Statement Coverage

| Requirement | Status |
|---|---|
| Parse resumes & analyze job descriptions | ✅ Fully implemented |
| Match candidates against multiple roles simultaneously | ✅ Multi-role engine |
| Multi-dimensional scorecards with clear reasoning | ✅ Skills, Experience, Projects, Education |
| Beyond simple keyword matching | ✅ Contextual AI via Gemini |
| Working end-to-end prototype | ✅ Live full-stack app |
| 10 resumes across 2–3 roles | ✅ Seed script included |

---

## 🚀 Core Features

### For Recruiters
- **Multi-Role Matching Engine** — Upload once, score against all open roles simultaneously
- **Alternate Role Discovery** — Flags candidates who are a better fit for other roles
- **Explainable AI Scorecards** — Radar chart breakdown with narrative AI reasoning
- **Blind Hiring Mode** — Masks candidate PII for unbiased screening
- **Pipeline Analytics** — Funnel metrics, stage velocity, and performance trends
- **AI Outreach Drafting** — One-click personalized email generation per candidate
- **AI Bias Detection** — Scans job descriptions for exclusionary language with an inclusion score
- **Predictive Flight Risk** — Calculates attrition probability based on career patterns
- **Recruiter AI Copilot** — Natural language chat to search & analyze your candidate pipeline
- **Batch Resume Upload** — Upload up to 50 PDF resumes at once for auto-parsing & matching
- **Side-by-Side Comparison** — Select 2 candidates and compare scorecards in a table
- **AI Interview Scheduling** — Auto-books interviews based on next available calendar slots
- **PDF Export** — Download any AI scorecard as a professional printable report

### For Candidates
- **Resume Parser** — Upload a PDF and instantly extract skills, experience, and education
- **AI Resume Optimizer** — Tailors your career summary to a specific role's requirements
- **Career Roadmap** — AI-generated personalized learning & upskilling recommendations
- **Conversational AI Interviewer** — Live adaptive interview with follow-up questions based on your answers
- **Personal Analytics** — Track applications, match scores, and skill gaps

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Styling / UX** | Framer Motion, Recharts, Lucide React |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB with Mongoose |
| **AI Engine** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **Auth** | JWT + bcryptjs |
| **File Handling** | Multer (single & batch), pdf-parse |

---

## ⚙️ Setup & Running Locally

### 1. Install Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 2. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/talentlens
JWT_SECRET=your_super_secret_jwt_key_123
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Note:** `GEMINI_API_KEY` is optional. All AI features have a smart simulation fallback if no key is provided.

### 3. Seed the Database (Required for Demo)

Ensure **MongoDB is running** on your machine, then:

```bash
cd backend && npm run seed
```

This populates: Job Roles, Users (Recruiter + Candidates), Resumes, Match Results, and Assessments — ready for a demo with 10+ candidates across 3 roles.

### 4. Start the Application

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev
# → http://localhost:5173

# Terminal 2 — Backend
cd backend && npm run dev
# → http://localhost:5000
```

---

## 👤 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Recruiter | `recruiter@talentlens.ai` | `password123` |
| Candidate | `candidate@talentlens.ai` | `password123` |

---

## 🎬 Usage Flow

### Recruiter Flow
1. Log in as Recruiter
2. Go to **Dashboard** → View pipeline analytics, candidate funnel, and AI insights
3. Click a **Job Role** → Browse AI-matched candidate cards sorted by fit score
4. Use **☑ checkboxes** to select 2 candidates → compare them side-by-side
5. Click the **📅 calendar icon** on a candidate → Auto-schedule an interview
6. Click a candidate → View full **AI Scorecard** → **Export PDF**
7. Use the **Batch Upload** button to upload multiple resumes at once
8. Ask the **AI Copilot** (chat widget, bottom-right) natural language questions about your pipeline
9. Go to **Jobs** → Create/Edit a role → Click **Scan for Bias** to check the description

### Candidate Flow
1. Log in as Candidate
2. Go to **Dashboard** → View your Career Roadmap and AI insights
3. Go to **Resumes** → Upload a PDF → Watch it get parsed and auto-matched
4. Click **Optimize Resume** to generate a role-tailored summary
5. Go to **Assessment** → Take the **Conversational AI Interview** (adaptive Q&A)

---

## 📁 Project Structure

```
PPO-Ass-3/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API logic (resume, match, copilot, interview, etc.)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routers
│   │   ├── services/         # aiService.ts (Gemini integration)
│   │   ├── utils/            # resumeParser, matcherLogic
│   │   └── server.ts         # Entry point
│   └── .env
└── frontend/
    └── src/
        ├── components/       # RecruiterDashboard, Scorecard, ComparisonModal, etc.
        ├── pages/            # Resumes, Analytics, JobRoles, Assessment, etc.
        ├── context/          # AuthContext, ThemeContext
        └── layouts/          # MainLayout (Navbar + Footer)
```

---

## 📄 Assumptions & Limitations

- Resume parsing uses `pdf-parse` for text extraction + AI/heuristic NLP. Scanned image PDFs without OCR may yield lower accuracy.
- Interview scheduling is simulated (no real calendar API integration), using next-available slots in a 5-day window.
- Flight Risk and Bias Detection scores are heuristic-based when no Gemini API key is provided, and AI-powered when a key is present.
- The platform uses a local MongoDB instance; no cloud database is configured by default.

---

*© 2026 TalentLens AI — MVP Prototype*
