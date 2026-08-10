import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import { auth } from '../../firebase';
import axios from 'axios';
import MessMenu from '../../components/dashboard/MessMenu';
import MessFeedbackForm from '../../components/dashboard/MessFeedbackForm';
import FeedbackNotification from '../../components/dashboard/FeedbackNotification';
import Chatbot from '../../components/chatbot/Chatbot';

function StudentDashboard() {
  const { user, setUser } = useAuth();
  const { announcements, loading: announcementsLoading, markAsRead } = useAnnouncements();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackStatus, setFeedbackStatus] = useState({
    enabled: false,
    loading: true
  });

  // Get most recent announcements (limited to 3)
  const recentAnnouncements = announcements.slice(0, 3);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const [studentRes, complaintsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/students/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/complaints', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Make sure to include the mess in the user object
        setUser(prev => ({
          ...prev,
          ...studentRes.data,
          mess: studentRes.data.mess // Explicitly set the mess property
        }));
        setComplaints(complaintsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Fetch mess feedback status
  useEffect(() => {
    const getFeedbackStatus = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await axios.get(
          'http://localhost:8000/api/mess-feedback/status',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setFeedbackStatus({
          enabled: response.data.enabled,
          loading: false
        });
      } catch (error) {
        console.error('Error checking feedback status:', error);
        setFeedbackStatus({
          enabled: false,
          loading: false
        });
      }
    };

    getFeedbackStatus();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="p-6">
      {/* Feedback Notification - Only show when enabled */}
      {feedbackStatus.enabled && (
        <FeedbackNotification />
      )}

      {/* Recent Announcements Banner - Only shown if there are unread announcements */}
      {recentAnnouncements.length > 0 && (
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-blue-800">Recent Announcements</h3>
            <Link to="/dashboard/student-announcements" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentAnnouncements.map(announcement => (
              <div 
                key={announcement._id} 
                className="bg-white p-3 rounded border border-blue-100 shadow-sm"
                onClick={() => markAsRead(announcement._id)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <span className="text-xs text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{announcement.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
        <div className="text-gray-600 space-y-1">
          <p>Registration Number: {user?.registrationNumber}</p>
          <p>Room: {user?.roomNumber}</p>
          <p>Hostel Block: {user?.hostelBlock}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/dashboard/submit-complaint" 
          className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 transition">
          <h3 className="text-lg font-semibold">Submit New Complaint</h3>
          <p className="mt-2 text-sm opacity-90">Report an issue with your room or facilities</p>
        </Link>

        <Link to="/dashboard/student-announcements" 
          className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 transition">
          <h3 className="text-lg font-semibold">View Announcements</h3>
          <p className="mt-2 text-sm opacity-90">Check latest hostel announcements</p>
        </Link>
      </div>

      {/* Mess Menu Section */}
      <div className="mb-8">
        <MessMenu />
      </div>

      {/* Mess Feedback Section - Only show when enabled */}
      {feedbackStatus.enabled && (
        <div className="mb-8">
          <MessFeedbackForm />
        </div>
      )}

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Complaints</h2>
          <Link 
            to="/dashboard/complaints"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            View All Complaints →
          </Link>
        </div>
        <div className="p-6">
          <div className="divide-y">
            {complaints.slice(0, 5).map(complaint => (
              <div key={complaint._id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{complaint.category}</p>
                      <span className="text-sm text-gray-500">
                        #{complaint._id.slice(-6)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    complaint.status === 'Resolved' 
                      ? 'bg-green-100 text-green-800'
                      : complaint.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                {complaint.imageUrl && (
                  <a 
                    href={complaint.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
                  >
                    View Attachment
                  </a>
                )}
              </div>
            ))}
            {complaints.length === 0 && (
              <p className="text-gray-500 text-center py-4">No complaints submitted yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Chatbot component */}
      <Chatbot />
    </div>
  );
}

export default StudentDashboard;
