import mongoose from 'mongoose';

const messFeedbackSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  mess: { 
    type: String, 
    required: true,
    enum: ['JMB Mess', 'Safal Mess', 'Mayuri Mess']
  },
  foodQuality: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  cleanliness: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  serviceQuality: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  comments: { 
    type: String,
    maxlength: 500 
  },
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Hi-Tea', 'Dinner']
  }
}, { timestamps: true });

export default mongoose.model('MessFeedback', messFeedbackSchema);
