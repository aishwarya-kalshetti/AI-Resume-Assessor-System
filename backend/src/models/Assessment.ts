import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole', required: true },
  matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchResult' },
  questions: [{
    questionId: { type: String },
    questionText: String,
    category: String,
  }],
  answers: [{
    questionId: { type: String },
    responseAudioUrl: String,
    transcription: String
  }],
  communicationScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  technicalDepth: { type: Number, default: 0 },
  problemSolving: { type: Number, default: 0 },
  professionalism: { type: Number, default: 0 },
  overallAssessmentScore: { type: Number, default: 0 },
  aiSummary: { type: String },
  status: { type: String, enum: ['started', 'completed'], default: 'started' },
  isConversational: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Assessment', assessmentSchema);
