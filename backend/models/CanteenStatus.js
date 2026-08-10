import mongoose from 'mongoose';

const canteenStatusSchema = new mongoose.Schema({
  isOpen: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    default: "Night Canteen is currently closed."
  }
}, { timestamps: true });

export default mongoose.model('CanteenStatus', canteenStatusSchema, 'canteenStatus');
