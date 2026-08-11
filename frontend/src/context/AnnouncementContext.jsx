import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Get read announcements from localStorage
  const getReadAnnouncements = () => {
    const readIds = localStorage.getItem('readAnnouncements');
    return readIds ? JSON.parse(readIds) : [];
  };

  // Save read announcement to localStorage
  const markAsRead = (announcementId) => {
    const readIds = getReadAnnouncements();
    if (!readIds.includes(announcementId)) {
      const newReadIds = [...readIds, announcementId];
      localStorage.setItem('readAnnouncements', JSON.stringify(newReadIds));
      calculateUnreadCount(announcements, newReadIds);
    }
  };

  // Calculate unread announcements
  const calculateUnreadCount = (anns, readIds = getReadAnnouncements()) => {
    const count = anns.filter(ann => !readIds.includes(ann._id)).length;
    setUnreadCount(count);
    return count;
  };

  // Fetch all announcements
  const fetchAnnouncements = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get('http://localhost:8000/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnnouncements(response.data);
      calculateUnreadCount(response.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  return (
    <AnnouncementContext.Provider value={{
      announcements,
      loading,
      error,
      unreadCount,
      markAsRead,
      fetchAnnouncements
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => useContext(AnnouncementContext);
