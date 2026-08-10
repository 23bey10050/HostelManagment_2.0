import firebaseAdmin from '../config/firebase.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// For students (Google login)
export const verifyGoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const { email } = decodedToken;
      
      // Only check Students collection
      const student = await Student.findOne({ email });

      if (!student) {
        await firebaseAdmin.auth().revokeRefreshTokens(decodedToken.uid);
        return res.status(403).json({ 
          message: 'Access Denied: Your email is not registered in the system.',
          accessDenied: true,
          email 
        });
      }

      if (student.isDisabled) {
        await firebaseAdmin.auth().revokeRefreshTokens(decodedToken.uid);
        return res.status(403).json({
          message: 'Your access has been disabled. Please contact the hostel administration.',
          accessDenied: true,
          email
        });
      }

      // Set student role in Firebase
      await firebaseAdmin.auth().setCustomUserClaims(decodedToken.uid, {
        role: 'student',
        studentId: student._id.toString()
      });

      // Get a fresh token with the new claims
      const customToken = await firebaseAdmin.auth().createCustomToken(decodedToken.uid, {
        role: 'student',
        studentId: student._id.toString()
      });

      res.status(200).json({
        user: {
          email,
          role: 'student',
          name: student.name,
          studentId: student._id
        },
        customToken
      });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return res.status(401).json({ 
        message: 'Invalid token',
        error: tokenError.message 
      });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

// For workers, wardens and canteen staff (Firebase email/password)
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Update this query to include canteen role
    const user = await User.findOne({ 
      email, 
      role: { $in: ['warden', 'worker', 'canteen'] }
    });

    if (!user) {
      console.log(`Staff login failed: User with email ${email} not found or not a staff member`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    try {
      // First check if user exists in Firebase
      let firebaseUser;
      try {
        firebaseUser = await firebaseAdmin.auth().getUserByEmail(email);
      } catch (error) {
        // If user doesn't exist, create them
        console.log(`Creating Firebase user for ${email}`);
        firebaseUser = await firebaseAdmin.auth().createUser({
          email,
          password,
          displayName: user.name
        });
      }

      // Set custom claims based on role
      const customClaims = {
        role: user.role,
        ...(user.role === 'worker' && { workerCategory: user.workerCategory }),
        ...(user.role === 'canteen' && { upiId: user.upiId }) // Add UPI ID for canteen staff
      };

      console.log(`Setting custom claims for ${email}:`, customClaims);

      // Set claims and create token
      await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, customClaims);
      const customToken = await firebaseAdmin.auth().createCustomToken(firebaseUser.uid, customClaims);

      // Return both token and user data
      res.status(200).json({
        customToken,
        user: {
          email: user.email,
          role: user.role,
          name: user.name,
          workerCategory: user.workerCategory,
          upiId: user.upiId // Include UPI ID for canteen staff
        }
      });

    } catch (error) {
      console.error('Firebase auth error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// For CTS (uses environment variables)
export const loginCTS = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check against environment variables
    if (email !== process.env.CTS_EMAIL || password !== process.env.CTS_PASSWORD) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create custom token for CTS
    const customToken = await firebaseAdmin.auth().createCustomToken('cts-admin', {
      role: 'cts'
    });

    res.status(200).json({
      user: {
        email,
        role: 'cts'
      },
      customToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// Create staff account (for admin use)
export const createStaffAccount = async (req, res) => {
  try {
    const { email, password, role, workerCategory } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      workerCategory
    });

    // Create Firebase user
    await firebaseAdmin.auth().createUser({
      email,
      password,
      customClaims: { role, workerCategory }
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
