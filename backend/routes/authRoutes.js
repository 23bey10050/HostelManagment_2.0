import express from 'express';
import { verifyGoogleLogin, loginStaff, createStaffAccount, loginCTS } from '../controllers/authController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/google/verify', verifyGoogleLogin);
router.post('/staff/login', loginStaff); // Make sure this correctly handles canteen role
router.post('/cts/login', loginCTS);

// Protected route with proper middleware
router.post('/staff/create', verifyToken, checkRole(['admin', 'cts']), createStaffAccount);

export default router;
