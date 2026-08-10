import { useEffect } from 'react';
import { useAnnouncements } from '../../context/AnnouncementContext';

function StudentAnnouncements() {
  const { announcements, loading, error, markAsRead } = useAnnouncements();

  // Get stored read announcements
  const getReadAnnouncements = () => {
    const readIds = localStorage.getItem('readAnnouncements');
    return readIds ? JSON.parse(readIds) : [];
  };

  // Check if an announcement is unread
  const isUnread = (id) => {
    const readIds = getReadAnnouncements();
    return !readIds.includes(id);
  };

  // Mark announcement as read when viewed
  const handleAnnouncementClick = (id) => {
    markAsRead(id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>
      
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map(announcement => (
            <div 
              key={announcement._id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 transition-all ${
                isUnread(announcement._id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300'
              }`}
              onClick={() => handleAnnouncementClick(announcement._id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  {isUnread(announcement._id) && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              
              <div className="text-sm text-gray-500">
                Posted by: {announcement.postedBy}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <p className="mt-2 text-gray-500">No announcements available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentAnnouncements;
