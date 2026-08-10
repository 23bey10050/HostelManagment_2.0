import { auth } from '../../firebase';
import axios from 'axios';

function RecentAnnouncements({ announcements, onDelete }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:8000/api/announcements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div 
          key={announcement._id}
          className={`p-4 rounded-lg border ${
            announcement.important ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{announcement.title}</h3>
              <p className="text-gray-600 mt-1">{announcement.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                Posted on {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={() => handleDelete(announcement._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {announcements.length === 0 && (
        <p className="text-gray-500 text-center py-4">No announcements yet</p>
      )}
    </div>
  );
}

export default RecentAnnouncements;
