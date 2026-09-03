import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  shortName: { type: String, required: true },
  longName: { type: String, required: true },
  code: { type: String, default: 'TBA' },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  bg: { type: String, required: true },
  url: { type: String, default: '' }
});

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  courses: [courseSchema]
}, {
  timestamps: true,
});

const Branch = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
export default Branch;
