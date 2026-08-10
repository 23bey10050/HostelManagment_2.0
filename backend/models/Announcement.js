import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: String, required: true },
  important: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
