import express from 'express';
import multer from 'multer';
import Student from '../models/Student.js';
import { getAllStudents, addStudent, bulkAddStudents, deleteStudent, updateStudent, toggleStudentAccess } from '../controllers/studentController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

// Add this route for getting current student's data
router.get('/me', verifyToken, async (req, res) => {
  try {
    // Get student email from the authenticated user
    const { email } = req.user;
    
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Return student data including mess
    res.json({
      name: student.name,
      email: student.email,
      registrationNumber: student.registrationNumber,
      roomNumber: student.roomNumber,
      hostelBlock: student.hostelBlock,
      phoneNumber: student.phoneNumber,
      mess: student.mess // Make sure to include the mess field
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add this new route to fetch all students without pagination
router.get('/all', checkRole(['cts', 'warden']), async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Changed 'admin' to 'cts' in the roles array and added 'warden' for access control
router.get('/', checkRole(['cts', 'warden']), getAllStudents);
router.post('/', checkRole(['cts', 'warden']), addStudent);
router.post('/bulk', checkRole(['cts']), upload.single('file'), bulkAddStudents);
router.put('/:id', checkRole(['cts', 'warden']), updateStudent);
router.delete('/:id', checkRole(['cts']), deleteStudent);
router.patch('/:id/access', checkRole(['cts', 'warden']), toggleStudentAccess); // Added 'warden' role

export default router;
