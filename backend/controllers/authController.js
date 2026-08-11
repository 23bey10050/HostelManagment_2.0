import Student from '../models/Student.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hostel_mgmt_super_secure_jwt_secret_2024';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

// Unified login for all roles (staff + students)
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let userData = null;
    let role = null;

    // 1. Check if student (students table has no password, use email match only for demo)
    const student = await Student.findOne({ email });
    if (student) {
      // For student demo login - check against known demo password
      if (password !== 'demo123') {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      role = 'student';
      userData = {
        uid: student._id,
        email: student.email,
        role: 'student',
        name: student.name,
        roomNumber: student.roomNumber,
        hostelBlock: student.hostelBlock,
        registrationNumber: student.registrationNumber
      };
    } else {
      // 2. Check staff users (warden, worker, canteen)
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
      }

      // Verify password with bcrypt
      if (!user.password) {
        return res.status(401).json({ message: 'Account not configured. Contact admin.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      role = user.role;
      userData = {
        uid: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        workerCategory: user.workerCategory,
        upiId: user.upiId
      };
    }

    const token = generateToken(userData);

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.', error: error.message });
  }
};

export const loginCTS = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: 'cts' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid CTS credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid CTS credentials' });
    }

    const userData = {
      uid: user._id,
      email: user.email,
      role: 'cts',
      name: user.name
    };
    const token = generateToken(userData);

    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error('CTS Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Create staff account
export const createStaffAccount = async (req, res) => {
  try {
    const { email, password, role, workerCategory, name, upiId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hashedPassword, role, name,
      ...(role === 'worker' ? { workerCategory } : {}),
      ...(role === 'canteen' ? { upiId } : {})
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      user: { email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error('Account creation error:', error);
    res.status(500).json({ message: 'Failed to create account', error: error.message });
  }
};

