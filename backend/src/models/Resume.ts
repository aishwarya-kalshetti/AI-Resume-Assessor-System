import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  parsedData: {
    skills: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    education: [{ type: String }],
    projects: [{ type: String }],
    summary: { type: String },
    email: { type: String }
  },
  parsingConfidence: { type: Number, default: 0 },
  resumeQualityScore: { type: Number, default: 0 },
  improvementTips: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
