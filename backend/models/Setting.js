import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  adminPassword: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);
export default Setting;
