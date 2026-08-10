import express from 'express';
import { queryChatbot } from '../controllers/chatbotController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
router.post('/query', checkRole(['student']), queryChatbot);

export default router;
