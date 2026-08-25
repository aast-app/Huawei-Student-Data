import mongoose from 'mongoose';

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'Please add a name'] },
    huaweiId: { type: String, required: [true, 'Please add a Huawei ID'], unique: true },
    email: { type: String, required: [true, 'Please add an email'] },
    phoneNumber: { type: String, required: [true, 'Please add a phone number'] },
    branch: { type: String, required: [true, 'Please add a branch'] },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;
