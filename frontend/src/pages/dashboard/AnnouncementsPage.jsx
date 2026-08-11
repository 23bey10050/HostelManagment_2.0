import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import RecentAnnouncements from '../../components/dashboard/RecentAnnouncements';
import AnnouncementModal from '../../components/dashboard/AnnouncementModal';

function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get('/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {user?.role === 'warden' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Announcement
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <RecentAnnouncements 
            announcements={announcements}
            onDelete={fetchAnnouncements}
          />
        </div>
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchAnnouncements();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default AnnouncementsPage;
