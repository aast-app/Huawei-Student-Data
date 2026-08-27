import express from 'express';
import Student from '../models/Student.js';
import Setting from '../models/Setting.js';
import connectDB from '../config/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, huaweiId, email, phoneNumber, branch } = req.body;

  if (!name || !huaweiId || !email || !phoneNumber || !branch) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  // Data Hygiene: trim spaces and force to lowercase for uniqueness
  const normalizedId = huaweiId.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await connectDB();

    const existingStudent = await Student.findOne({ huaweiId: normalizedId });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'This Huawei ID is already registered. Please use the Student Login button, or use a new ID.' 
      });
    }

    const existingEmail = await Student.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'This Email is already registered. Please use the Student Login button.' 
      });
    }

    const student = await Student.create({
      name: name.trim(),
      huaweiId: normalizedId,
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
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

router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide your Email' });
  }

  // Data Hygiene: trim and lowercase before searching
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await connectDB();
    const student = await Student.findOne({ email: normalizedEmail });

    if (student) {
      res.status(200).json({ branch: student.branch, name: student.name });
    } else {
      res.status(404).json({ message: 'Email not found. Please register below.' });
    }
  } catch (error) {
    console.error('Error logging in student:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/', async (req, res) => {
  const password = req.headers['x-admin-password'];

  try {
    await connectDB();

    // Verify Password from MongoDB
    const settings = await Setting.findOne();
    if (!settings || password !== settings.adminPassword) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }

    // Build Query
    const { searchId, searchName, searchEmail, branch, sortOrder = 'desc' } = req.query;
    const query = {};
    if (searchId) query.huaweiId = { $regex: searchId.trim(), $options: 'i' };
    if (searchName) query.name = { $regex: searchName.trim(), $options: 'i' };
    if (searchEmail) query.email = { $regex: searchEmail.trim(), $options: 'i' };
    if (branch && branch !== 'All Branches') query.branch = branch;

    const sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };

    // If exporting CSV, fetch everything matching the query ignoring pagination
    if (req.query.exportAll === 'true') {
      const students = await Student.find(query).sort(sort);
      return res.status(200).json(students);
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const students = await Student.find(query)
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await Student.countDocuments(query);

    res.status(200).json({
      students,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalStudents: count
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching data' });
  }
});

router.get('/backup', async (req, res) => {
  const password = req.headers['x-admin-password'];
  
  try {
    await connectDB();
    
    // Verify Password from MongoDB
    const settings = await Setting.findOne();
    if (!settings || password !== settings.adminPassword) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }

    // Fetch all collections data
    const students = await Student.find({});
    
    const backupData = {
      timestamp: new Date().toISOString(),
      collections: {
        students: students,
        settings: settings
      }
    };

    res.status(200).json(backupData);
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ message: 'Server error creating backup' });
  }
});

router.delete('/:id', async (req, res) => {
  const password = req.headers['x-admin-password'];
  
  try {
    await connectDB();
    
    const settings = await Setting.findOne();
    if (!settings || password !== settings.adminPassword) {
      return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error deleting student' });
  }
});

export default router;
