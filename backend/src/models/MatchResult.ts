import mongoose from 'mongoose';

const matchResultSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  candidateName: { type: String }, // Parsed directly from resume PDF (overrides user account name for batch uploads)
  candidateEmail: { type: String }, // Parsed directly from resume PDF
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole', required: true },
  overallScore: { type: Number, required: true, default: 0 },
  dimensionScores: {
    skills: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    education: { type: Number, default: 0 }
  },
  explanation: { type: String },
  alternateRoleFlag: { type: Boolean, default: false },
  recommendedAlternateRoleId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  missingSkills: [{ type: String }],
  matchedSkills: [{ type: String }],
  status: { type: String, enum: ['pending', 'shortlisted', 'rejected', 'recommended'], default: 'pending' },
  flightRisk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  flightRiskProbability: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('MatchResult', matchResultSchema);
