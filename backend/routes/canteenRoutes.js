import express from 'express';
import multer from 'multer';
import { 
  getMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  createOrder,
  verifyPayment,
  getOrders,
  getStudentOrders,
  completeOrder,
  getCanteenStats,
  getCanteenStatus,
  updateCanteenStatus,
  updateOrderStatus,
  toggleItemAvailability
} from '../controllers/canteenController.js';
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

// Menu item routes
router.get('/items', getMenuItems);
router.post('/items', checkRole(['canteen']), upload.single('image'), addMenuItem);
router.put('/items/:id', checkRole(['canteen']), updateMenuItem);
router.delete('/items/:id', checkRole(['canteen']), deleteMenuItem);
router.patch('/items/:id/toggle', checkRole(['canteen']), toggleItemAvailability);

// Order routes
router.post('/orders', checkRole(['student']), createOrder);
router.get('/orders', checkRole(['canteen']), getOrders);
router.get('/my-orders', checkRole(['student']), getStudentOrders);
router.put('/orders/:id/complete', checkRole(['canteen']), completeOrder);
router.put('/orders/:id/status', checkRole(['canteen']), updateOrderStatus);

// Canteen Status routes
router.get('/status', getCanteenStatus);
router.put('/status', checkRole(['canteen']), updateCanteenStatus);

// Stats route
router.get('/stats', checkRole(['canteen']), getCanteenStats);

// Payment verification route
router.post('/orders/verify-payment', checkRole(['student']), verifyPayment);

export default router;
