import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole', required: true },
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
  overallAssessmentScore: { type: Number, default: 0 },
  status: { type: String, enum: ['started', 'completed'], default: 'started' },
  isConversational: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Assessment', assessmentSchema);
