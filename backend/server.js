import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorLogger, errorHandler } from './middleware/errorMiddleware.js';

// Routes imports will go here
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import messFeedbackRoutes from './routes/messFeedbackRoutes.js';
import canteenRoutes from './routes/canteenRoutes.js'; // Add this import
import chatbotRoutes from './routes/chatbotRoutes.js'; // Add this import

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware to debug API requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/mess-feedback', messFeedbackRoutes);
app.use('/api/canteen', canteenRoutes); // Add this line
app.use('/api/chatbot', chatbotRoutes); // Add this line

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
