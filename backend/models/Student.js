import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  hostelBlock: { type: String, required: true },
  roomType: { 
    type: String, 
    required: true,
    enum: ['3 Bedded', '4 Bedded', '3 Bedded Flat Non AC', '4 Bedded Bunk AC']
  },
  roomNumber: { type: String, required: true },
  mess: { 
    type: String, 
    required: true,
    enum: ['JMB Mess', 'Safal Mess', 'Mayuri Mess']
  },
  isDisabled: { type: Boolean, default: false },
  disabledAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
