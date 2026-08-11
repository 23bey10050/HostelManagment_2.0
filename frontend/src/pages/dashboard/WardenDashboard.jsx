import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import RecentAnnouncements from '../../components/dashboard/RecentAnnouncements';
import AnnouncementModal from '../../components/dashboard/AnnouncementModal';

function WardenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    complaints: {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const [statsRes, announcementsRes] = await Promise.all([
        axios.get('/api/stats/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/announcements', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setAnnouncements(announcementsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, Warden</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          color="blue"
        />
        <StatCard
          title="Total Complaints"
          value={stats.complaints.total}
          color="gray"
        />
        <StatCard
          title="Pending Complaints"
          value={stats.complaints.pending + stats.complaints.inProgress}
          color="yellow"
        />
        <StatCard
          title="Resolved Complaints"
          value={stats.complaints.resolved}
          color="green"
        />
      </div>

      {/* Recent Announcements */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Announcements</h2>
          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Announcement
          </button>
        </div>
        <div className="p-6">
          <RecentAnnouncements 
            announcements={announcements.slice(0, 5)}
            onDelete={fetchDashboardData}
          />
        </div>
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}

// Helper Components
const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-500 mt-2`}>{value}</p>
  </div>
);

export default WardenDashboard;
