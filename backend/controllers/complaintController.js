import Complaint from '../models/Complaint.js';
import Student from '../models/Student.js';
import axios from 'axios';

export const createComplaint = async (req, res) => {
  try {
    // First find the student by email from the token
    const studentEmail = req.user.email;
    const student = await Student.findOne({ email: studentEmail });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate required fields
    const { category, description, roomNumber } = req.body;
    if (!category || !description || !roomNumber) {
      return res.status(400).json({ 
        message: 'Missing required fields. Category, description, and room number are required.' 
      });
    }

    // Handle image upload if present
    let imageUrl = '';
    if (req.file) {
      try {
        const imageData = req.file.buffer.toString('base64');
        const response = await axios.post('https://api.imgbb.com/1/upload', {
          key: process.env.IMGBB_API_KEY,
          image: imageData,
        }, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = response.data.data.url;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Create and save the complaint
    const complaint = new Complaint({
      category,
      description,
      roomNumber,
      imageUrl,
      status: 'Pending',
      student: student._id
    });
    
    await complaint.save();

    // Populate student details in response
    await complaint.populate('student', 'name email registrationNumber');
    
    res.status(201).json(complaint);
  } catch (error) {
    console.error('Complaint creation error:', error);
    res.status(500).json({ message: 'Failed to create complaint' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('student', 'name email roomNumber');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { role, email, workerCategory } = req.user;
    const { status, category, dateRange } = req.query;
    let query = {};

    // Base query based on user role
    if (role === 'student') {
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      query.student = student._id;
    } else if (role === 'worker') {
      query.category = workerCategory;
    }

    // Add filters
    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      switch (dateRange) {
        case 'today':
          query.createdAt = {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(23, 59, 59, 999))
          };
          break;
        case 'week':
          query.createdAt = {
            $gte: new Date(now.setDate(now.getDate() - 7)),
            $lt: new Date()
          };
          break;
        case 'month':
          query.createdAt = {
            $gte: new Date(now.setMonth(now.getMonth() - 1)),
            $lt: new Date()
          };
          break;
      }
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name email registrationNumber roomNumber')
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(complaints);
  } catch (error) {
    console.error('Complaint fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

export const getWorkerComplaints = async (req, res) => {
  try {
    const { workerCategory } = req.user;
    
    const complaints = await Complaint.find({ 
      category: workerCategory 
    })
    .populate('student', 'name email registrationNumber phoneNumber hostelBlock roomNumber')
    .sort({ createdAt: -1 });

    // Format complaints data to ensure all fields are present
    const formattedComplaints = complaints.map(complaint => ({
      ...complaint.toObject(),
      student: complaint.student ? {
        ...complaint.student,
        // Provide default values for missing fields
        name: complaint.student.name || 'N/A',
        registrationNumber: complaint.student.registrationNumber || 'N/A',
        phoneNumber: complaint.student.phoneNumber || 'N/A',
        email: complaint.student.email || 'N/A',
        hostelBlock: complaint.student.hostelBlock || 'N/A'
      } : {
        name: 'N/A',
        registrationNumber: 'N/A',
        phoneNumber: 'N/A',
        email: 'N/A',
        hostelBlock: 'N/A'
      }
    }));

    res.json(formattedComplaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

export const getComplaintStats = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          pending: 1,
          inProgress: 1,
          resolved: 1
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      overallStats: stats[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      },
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
