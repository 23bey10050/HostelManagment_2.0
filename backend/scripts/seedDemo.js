import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Announcement from '../models/Announcement.js';
import Complaint from '../models/Complaint.js';
import CanteenItem from '../models/CanteenItem.js';
import MessFeedback from '../models/MessFeedback.js';

const seedDemo = async () => {
  try {
    console.log('🌱 Seeding demo data...');

    // ─── DEMO USERS ───────────────────────────────────────────────────────────
    const demoPassword = await bcrypt.hash('demo123', 10);

    // Warden
    const warden = await User.findOneAndUpdate(
      { email: 'warden@demo.com' },
      { name: 'Rajesh Kumar', email: 'warden@demo.com', role: 'warden', password: demoPassword },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Worker - Electrician
    await User.findOneAndUpdate(
      { email: 'worker@demo.com' },
      { name: 'Suresh Singh', email: 'worker@demo.com', role: 'worker', password: demoPassword, workerCategory: 'Electrician' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Canteen Staff
    await User.findOneAndUpdate(
      { email: 'canteen@demo.com' },
      { name: 'Priya Sharma', email: 'canteen@demo.com', role: 'canteen', password: demoPassword, upiId: 'canteen@upi' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ─── DEMO STUDENTS ────────────────────────────────────────────────────────
    const student1 = await Student.findOneAndUpdate(
      { email: 'student@demo.com' },
      {
        name: 'Amit Verma', email: 'student@demo.com',
        registrationNumber: 'REG2024001', phoneNumber: '9876543210',
        hostelBlock: 'A', roomType: '3 Bedded', roomNumber: 'A-101', mess: 'JMB Mess'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const student2 = await Student.findOneAndUpdate(
      { email: 'priya.student@demo.com' },
      {
        name: 'Priya Patel', email: 'priya.student@demo.com',
        registrationNumber: 'REG2024002', phoneNumber: '9876543211',
        hostelBlock: 'B', roomType: '4 Bedded', roomNumber: 'B-205', mess: 'Safal Mess'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const student3 = await Student.findOneAndUpdate(
      { email: 'rahul.student@demo.com' },
      {
        name: 'Rahul Gupta', email: 'rahul.student@demo.com',
        registrationNumber: 'REG2024003', phoneNumber: '9876543212',
        hostelBlock: 'A', roomType: '4 Bedded Bunk AC', roomNumber: 'A-302', mess: 'Mayuri Mess'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const student4 = await Student.findOneAndUpdate(
      { email: 'neha.student@demo.com' },
      {
        name: 'Neha Sharma', email: 'neha.student@demo.com',
        registrationNumber: 'REG2024004', phoneNumber: '9876543213',
        hostelBlock: 'C', roomType: '3 Bedded Flat Non AC', roomNumber: 'C-110', mess: 'JMB Mess'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Student.findOneAndUpdate(
      { email: 'arjun.student@demo.com' },
      {
        name: 'Arjun Singh', email: 'arjun.student@demo.com',
        registrationNumber: 'REG2024005', phoneNumber: '9876543214',
        hostelBlock: 'B', roomType: '3 Bedded', roomNumber: 'B-301', mess: 'Safal Mess'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // ─── ANNOUNCEMENTS ────────────────────────────────────────────────────────
    const existingAnnouncements = await Announcement.countDocuments();
    if (existingAnnouncements === 0) {
      await Announcement.insertMany([
        {
          title: 'Welcome to Hostel Management System',
          content: 'Dear students, welcome to the new Hostel Management System. You can now submit complaints, view mess menus, order from the canteen, and stay updated with announcements.',
          postedBy: 'Hostel Warden',
          important: true
        },
        {
          title: 'Water Supply Maintenance - Block A',
          content: 'Water supply in Block A will be disrupted from 10 AM to 2 PM on Sunday for maintenance work. Please store water accordingly.',
          postedBy: 'Hostel Warden',
          important: true
        },
        {
          title: 'Mess Menu Updated for This Week',
          content: 'The mess menu has been updated for this week. Special items have been added for weekends. Check the mess menu section for details.',
          postedBy: 'Mess Committee',
          important: false
        },
        {
          title: 'Room Inspection Scheduled',
          content: 'Room inspections will be conducted next Monday (Block A) and Tuesday (Block B & C) from 9 AM to 12 PM. Please ensure your rooms are clean and tidy.',
          postedBy: 'Hostel Warden',
          important: false
        }
      ]);
    }

    // ─── COMPLAINTS ───────────────────────────────────────────────────────────
    const existingComplaints = await Complaint.countDocuments();
    if (existingComplaints === 0) {
      await Complaint.insertMany([
        {
          student: student1._id,
          category: 'Electrician',
          description: 'The ceiling fan in my room is making a loud noise and vibrating. Needs urgent repair.',
          status: 'Pending',
          roomNumber: 'A-101'
        },
        {
          student: student2._id,
          category: 'Housekeeping',
          description: 'The bathroom floor is not being cleaned properly. There is mold forming near the drain.',
          status: 'In Progress',
          roomNumber: 'B-205'
        },
        {
          student: student3._id,
          category: 'Carpenter',
          description: 'The wardrobe door hinge is broken and the door does not close properly.',
          status: 'Resolved',
          roomNumber: 'A-302'
        },
        {
          student: student4._id,
          category: 'Electrician',
          description: 'One of the power outlets in my room is not working. My laptop charger is not getting power.',
          status: 'Pending',
          roomNumber: 'C-110'
        }
      ]);
    }

    // ─── CANTEEN ITEMS ────────────────────────────────────────────────────────
    const existingCanteen = await CanteenItem.countDocuments();
    if (existingCanteen === 0) {
      await CanteenItem.insertMany([
        { name: 'Veg Thali', description: 'Full meal with roti, sabzi, dal, rice, salad', price: 80, category: 'Meals', availability: true },
        { name: 'Paneer Butter Masala', description: 'Creamy paneer in rich tomato-butter gravy', price: 90, category: 'Main Course', availability: true },
        { name: 'Masala Chai', description: 'Hot spiced tea', price: 15, category: 'Beverages', availability: true },
        { name: 'Cold Coffee', description: 'Chilled coffee with milk and ice cream', price: 60, category: 'Beverages', availability: true },
        { name: 'Samosa (2 pcs)', description: 'Crispy samosa with green chutney', price: 20, category: 'Snacks', availability: true },
        { name: 'Maggi Noodles', description: 'Classic Maggi with veggies', price: 40, category: 'Snacks', availability: true },
        { name: 'Idli Sambhar', description: '3 idlis with sambhar and coconut chutney', price: 50, category: 'Breakfast', availability: true },
        { name: 'Aloo Paratha', description: 'Stuffed potato paratha with butter and curd', price: 45, category: 'Breakfast', availability: true },
        { name: 'Fruit Bowl', description: 'Seasonal fresh fruit bowl', price: 55, category: 'Healthy', availability: true },
        { name: 'Chocolate Brownie', description: 'Warm chocolate brownie with ice cream', price: 70, category: 'Desserts', availability: false }
      ]);
    }

    // ─── MESS FEEDBACK ────────────────────────────────────────────────────────
    const existingFeedback = await MessFeedback.countDocuments();
    if (existingFeedback === 0) {
      await MessFeedback.insertMany([
        { student: student1._id, mess: 'JMB Mess', foodQuality: 4, cleanliness: 5, serviceQuality: 4, mealType: 'Lunch', comments: 'Food was great today! The dal was especially tasty.' },
        { student: student2._id, mess: 'Safal Mess', foodQuality: 3, cleanliness: 4, serviceQuality: 3, mealType: 'Dinner', comments: 'Dinner was okay but the quantity was a bit less.' },
        { student: student3._id, mess: 'Mayuri Mess', foodQuality: 5, cleanliness: 4, serviceQuality: 5, mealType: 'Breakfast', comments: 'Best breakfast I have had in the hostel mess! Keep it up.' },
        { student: student4._id, mess: 'JMB Mess', foodQuality: 2, cleanliness: 3, serviceQuality: 3, mealType: 'Lunch', comments: 'The food was cold today. Please serve it warm.' }
      ]);
    }

    console.log('✅ Demo data seeded successfully!');
    console.log('');
    console.log('─────────────────────────────────────────');
    console.log('  DEMO LOGIN CREDENTIALS');
    console.log('─────────────────────────────────────────');
    console.log('  Warden:  warden@demo.com / demo123');
    console.log('  Student: student@demo.com / demo123');
    console.log('  Worker:  worker@demo.com  / demo123');
    console.log('  Canteen: canteen@demo.com / demo123');
    console.log('─────────────────────────────────────────');

  } catch (error) {
    console.error('❌ Demo seeding error:', error.message);
  }
};

export default seedDemo;
