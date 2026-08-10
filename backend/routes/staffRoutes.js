import express from 'express';
import { getAllStaff, addStaffMember, deleteStaffMember } from '../controllers/staffController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', checkRole(['cts']), getAllStaff);
router.post('/', checkRole(['cts']), addStaffMember);
router.delete('/:id', checkRole(['cts']), deleteStaffMember);

export default router;
