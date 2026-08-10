import express from 'express';
import multer from 'multer';
import { createComplaint, updateComplaintStatus, getComplaints, getComplaintStats, getWorkerComplaints } from '../controllers/complaintController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

// Public routes (accessible to all authenticated users)
router.get('/', getComplaints);
router.post('/', upload.single('image'), checkRole(['student']), createComplaint);

// Protected routes
router.patch('/:id/status', checkRole(['warden', 'worker']), updateComplaintStatus);
router.get('/worker', checkRole(['worker']), getWorkerComplaints);
router.get('/stats', checkRole(['worker', 'warden', 'cts']), getComplaintStats);

export default router;
