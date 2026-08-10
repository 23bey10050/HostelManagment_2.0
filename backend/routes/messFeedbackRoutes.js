import express from 'express';
import { 
  submitFeedback, 
  getFeedbackStatus, 
  toggleFeedbackSystem, 
  getFeedbackAnalytics, 
  getAllFeedback,
  getMySubmissions,
  getAIFeedbackAnalysis
} from '../controllers/messFeedbackController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);

// Student routes
router.post('/submit', checkRole(['student']), submitFeedback);
router.get('/status', getFeedbackStatus);
router.get('/my-submissions', checkRole(['student']), getMySubmissions);

// Staff/Warden routes
router.put('/toggle', checkRole(['warden', 'cts']), toggleFeedbackSystem);
router.get('/analytics', checkRole(['warden', 'cts']), getFeedbackAnalytics);
router.get('/', checkRole(['warden', 'cts']), getAllFeedback);
router.get('/ai-analysis', checkRole(['warden', 'cts']), getAIFeedbackAnalysis);

export default router;
