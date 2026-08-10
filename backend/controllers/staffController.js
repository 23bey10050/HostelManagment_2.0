import User from '../models/User.js';
import firebaseAdmin from '../config/firebase.js';

export const getAllStaff = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ],
      role: { $in: ['warden', 'worker', 'canteen'] } // Update query to include 'canteen' role
    } : { role: { $in: ['warden', 'worker', 'canteen'] } }; // Update query to include 'canteen' role

    const staff = await User.find(searchQuery);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addStaffMember = async (req, res) => {
  try {
    const { email, password, role, workerCategory, name, upiId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: 'Missing required fields. Name, email, password, and role are required.' 
      });
    }

    // Validate worker category
    if (role === 'worker' && !workerCategory) {
      return res.status(400).json({
        message: 'Worker category is required for worker role'
      });
    }

    // Validate UPI ID for canteen staff
    if (role === 'canteen' && !upiId) {
      return res.status(400).json({
        message: 'UPI ID is required for canteen staff'
      });
    }

    // Only include role-specific fields
    const userData = {
      name,
      email,
      role,
      ...(role === 'worker' ? { workerCategory } : {}),
      ...(role === 'canteen' ? { upiId } : {})
    };

    try {
      // Create Firebase user
      const firebaseUser = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: name
      });

      // Set custom claims
      await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, {
        role,
        ...(role === 'worker' ? { workerCategory } : {}),
        ...(role === 'canteen' ? { upiId } : {})
      });

      // Create MongoDB user
      const user = await User.create(userData);

      res.status(201).json({
        message: 'Staff member created successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          workerCategory: user.workerCategory,
          upiId: user.upiId
        }
      });
    } catch (error) {
      // Clean up Firebase user if MongoDB creation fails
      if (error.code !== 'auth/email-already-exists') {
        try {
          await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
        } catch (deleteError) {
          console.error('Error cleaning up Firebase user:', deleteError);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to create staff member'
    });
  }
};

export const deleteStaffMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Delete from Firebase
    try {
      const firebaseUser = await firebaseAdmin.auth().getUserByEmail(user.email);
      await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
    } catch (firebaseError) {
      console.error('Firebase deletion error:', firebaseError);
    }

    // Delete from MongoDB
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
