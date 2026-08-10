import firebaseAdmin from '../config/firebase.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createWarden = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create Firebase user
    const userRecord = await firebaseAdmin.auth().createUser({
      email: 'warden@hostel.com',
      password: 'warden123'
    });

    // Set custom claims
    await firebaseAdmin.auth().setCustomUserClaims(userRecord.uid, {
      role: 'warden'
    });

    // Create user in MongoDB
    const user = await User.create({
      email: 'warden@hostel.com',
      role: 'warden'
    });

    console.log('Warden account created:', {
      email: 'warden@hostel.com',
      password: 'warden123',
      uid: userRecord.uid,
      mongoId: user._id
    });

  } catch (error) {
    console.error('Error creating warden:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createWarden();
