import mongoose from 'mongoose';

const canteenItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String
  },
  availability: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('CanteenItem', canteenItemSchema);
