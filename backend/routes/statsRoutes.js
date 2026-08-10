import express from 'express';
import { getDashboardStats, getWorkerStats } from '../controllers/statsController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/dashboard', checkRole(['cts', 'warden']), getDashboardStats);
router.get('/worker', checkRole(['worker']), getWorkerStats);

export default router;
