import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Housekeeping', 'Carpenter', 'Electrician'] 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Resolved'] 
  },
  imageUrl: { type: String },
  roomNumber: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
