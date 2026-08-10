import Student from '../models/Student.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  // Use a default secret if not provided in env for demo purposes
  const secret = process.env.JWT_SECRET || 'fallback_demo_secret_key_123';
  return jwt.sign(
    { 
      uid: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name,
      workerCategory: user.workerCategory,
      upiId: user.upiId,
      studentId: user.role === 'student' ? user._id : undefined
    }, 
    secret, 
    { expiresIn: '30d' }
  );
};

// For all users (Demo Mode bypassing Firebase)
export const loginStaff = async (req, res) => {
  try {
    const { email } = req.body; // We ignore password for demo mode to make login seamless
    
    // Check if it's a student
    let user = await Student.findOne({ email });
    let role = 'student';

    // If not a student, check staff
    if (!user) {
      user = await User.findOne({ email });
      if (user) role = user.role;
    }

    // Demo Mode: If user still doesn't exist, we will create a dummy one on the fly
    // This ensures recruiters can login even on a fresh DB
    if (!user) {
      console.log(`Demo user not found for ${email}. Auto-creating dummy user.`);
      if (email.includes('student')) {
        user = await Student.create({ 
          name: 'Demo Student', 
          email, 
          roomNumber: '101', 
          rollNo: 'DEMO123' 
        });
        role = 'student';
      } else {
        role = email.includes('warden') ? 'warden' : email.includes('canteen') ? 'canteen' : 'worker';
        user = await User.create({ 
          name: `Demo ${role}`, 
          email, 
          password: await bcrypt.hash('password123', 10), 
          role,
          workerCategory: role === 'worker' ? 'plumber' : undefined
        });
      }
    }

    // In a real app we'd check password here. 
    // But since this is a demo to bypass Firebase, we just generate the token.
    user.role = role; // attach role for token generation
    const token = generateToken(user);

    res.status(200).json({
      token, // standard JWT
      user: {
        uid: user._id,
        email: user.email,
        role: role,
        name: user.name,
        workerCategory: user.workerCategory,
        upiId: user.upiId
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// For CTS Admin
export const loginCTS = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Demo Mode bypass
    if (email !== process.env.CTS_EMAIL && !email.includes('cts')) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ _id: 'cts-admin-id', email, role: 'cts', name: 'CTS Admin' });

    res.status(200).json({
      user: {
        email,
        role: 'cts'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

export const createStaffAccount = async (req, res) => {
  try {
    const { email, password, role, workerCategory } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      workerCategory
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      user: {
        email: user.email,
        role: user.role,
        workerCategory: user.workerCategory
      }
    });
  } catch (error) {
    console.error('Account creation error:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
};
