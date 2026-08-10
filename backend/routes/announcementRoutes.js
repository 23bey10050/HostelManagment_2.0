import express from 'express';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAnnouncements);
router.post('/', checkRole(['warden']), createAnnouncement);
router.delete('/:id', checkRole(['warden']), deleteAnnouncement);

export default router;
