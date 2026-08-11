import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllStaff = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ],
      role: { $in: ['warden', 'worker', 'canteen'] }
    } : { role: { $in: ['warden', 'worker', 'canteen'] } };

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

    if (role === 'worker' && !workerCategory) {
      return res.status(400).json({
        message: 'Worker category is required for worker role'
      });
    }

    if (role === 'canteen' && !upiId) {
      return res.status(400).json({
        message: 'UPI ID is required for canteen staff'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === 'worker' ? { workerCategory } : {}),
      ...(role === 'canteen' ? { upiId } : {})
    });

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

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
