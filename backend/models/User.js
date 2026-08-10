import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['student', 'warden', 'worker', 'cts', 'canteen']
  },
  workerCategory: { 
    type: String,
    enum: ['Housekeeping', 'Carpenter', 'Electrician', 'Canteen', null],
    default: null,
    validate: {
      validator: function(v) {
        // Only require workerCategory if role is worker
        return this.role !== 'worker' || (this.role === 'worker' && v);
      },
      message: 'Worker category is required for worker role'
    }
  },
  upiId: { 
    type: String,
    validate: {
      validator: function(v) {
        // Only validate UPI ID if role is canteen
        return this.role !== 'canteen' || (this.role === 'canteen' && v);
      },
      message: 'UPI ID is required for canteen staff'
    }
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
