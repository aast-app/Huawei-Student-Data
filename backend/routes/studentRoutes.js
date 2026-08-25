import express from 'express';
import Student from '../models/Student.js';
import connectDB from '../config/db.js';

const router = express.Router();

// @route   POST /api/students/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  const { name, huaweiId, email, phoneNumber, branch } = req.body;

  if (!name || !huaweiId || !email || !phoneNumber || !branch) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    await connectDB(); // Ensure DB is connected before interacting with it!

    const existingStudent = await Student.findOne({ huaweiId });

    if (existingStudent) {
      return res.status(400).json({ 
        message: 'This Huawei ID is already registered. Please use the Student Login button, or use a new ID.' 
      });
    }

    // If ID does not exist at all, create a brand new student
    const student = await Student.create({
      name,
      huaweiId,
      email,
      phoneNumber,
      branch
    });

    res.status(201).json({
      message: 'Successfully registered!',
      student
    });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ message: 'Server error while saving to database' });
  }
});

// @route   POST /api/students/login
// @desc    Login a returning student using Huawei ID
// @access  Public
router.post('/login', async (req, res) => {
  const { huaweiId } = req.body;

  if (!huaweiId) {
    return res.status(400).json({ message: 'Please provide a Huawei ID' });
  }

  try {
    await connectDB();
    const student = await Student.findOne({ huaweiId });

    if (student) {
      res.status(200).json({ branch: student.branch });
    } else {
      res.status(404).json({ message: 'Huawei ID not found. Please register below.' });
    }
  } catch (error) {
    console.error('Error logging in student:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  const password = req.headers['x-admin-password'];
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
  }

  try {
    await connectDB();
    const students = await Student.find({}).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching data' });
  }
});

export default router;
