import mongoose from 'mongoose';

const canteenOrderSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CanteenItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  tokenNumber: {
    type: Number,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  paidAt: {
    type: Date
  }
}, { timestamps: true });

// Add indexes for better performance
canteenOrderSchema.index({ student: 1 });
canteenOrderSchema.index({ tokenNumber: 1 });
canteenOrderSchema.index({ paymentStatus: 1 });
canteenOrderSchema.index({ orderStatus: 1 });

export default mongoose.model('CanteenOrder', canteenOrderSchema);
