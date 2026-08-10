import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/Student.js';

dotenv.config();

const createTestStudent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const testStudent = {
      email: "ojhabharat75@gmail.com", // Use the email you're testing with
      name: "Test Student",
      roomNumber: "A101",
      block: "A",
      phoneNumber: "1234567890",
      registrationNumber: "TEST123"
    };

    const student = await Student.create(testStudent);
    console.log('Test student created:', student);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestStudent();
