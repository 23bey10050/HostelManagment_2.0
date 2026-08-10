import Student from '../models/Student.js';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalStaff,
      totalWorkers,
      complaints
    ] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments({ role: 'warden' }),
      User.countDocuments({ role: 'worker' }),
      Complaint.aggregate([
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
        }
      ])
    ]);

    res.json({
      totalStudents,
      totalStaff,
      totalWorkers,
      complaints: complaints[0] || {
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWorkerStats = async (req, res) => {
  try {
    const { workerCategory } = req.user;
    
    const workerStats = await Complaint.aggregate([
      {
        $match: { category: workerCategory }
      },
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
      }
    ]);

    res.json(workerStats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
