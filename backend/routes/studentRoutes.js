import express from 'express';
import Student from '../models/Student.js';
import connectDB from '../config/db.js';

const router = express.Router();

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    await connectDB(); // Ensure DB is connected before interacting with it!

    const student = await Student.create({
      name,
      email,
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        message: 'Successfully registered!',
      });
    } else {
      res.status(400).json({ message: 'Invalid student data' });
    }
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ message: 'Server error while saving to database' });
  }
});

export default router;
