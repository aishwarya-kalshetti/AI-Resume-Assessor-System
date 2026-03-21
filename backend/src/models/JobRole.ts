import mongoose from 'mongoose';

const jobRoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String },
  description: { type: String },
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  experienceLevel: { type: String, enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Intern'] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'paused', 'closed'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('JobRole', jobRoleSchema);
