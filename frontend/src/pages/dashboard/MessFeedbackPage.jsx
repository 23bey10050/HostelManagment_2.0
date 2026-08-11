import { useState, useEffect } from 'react';
import axios from 'axios';
import MessFeedbackAnalytics from '../../components/dashboard/MessFeedbackAnalytics';
import MessFeedbackResponses from '../../components/dashboard/MessFeedbackResponses';
import MessFeedbackAnalysis from '../../components/dashboard/MessFeedbackAnalysis';

function MessFeedbackPage() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [responses, setResponses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFeedbackStatus = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get(
        '/api/mess-feedback/status',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedbackEnabled(response.data.enabled);
    } catch (error) {
      console.error('Error fetching feedback status:', error);
      setError('Failed to fetch feedback status');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get(
        '/api/mess-feedback/analytics',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics');
    }
  };

  const fetchResponses = async (page = 1, filters = {}) => {
    try {
      const token = localStorage.getItem('demo_token');
      const params = new URLSearchParams({ page, ...filters });
      
      const response = await axios.get(
        `/api/mess-feedback?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setResponses(response.data.feedbacks);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching responses:', error);
      setError('Failed to fetch responses');
    }
  };

  const toggleFeedbackSystem = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      await axios.put(
        '/api/mess-feedback/toggle',
        { enabled: !feedbackEnabled },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedbackEnabled(!feedbackEnabled);
    } catch (error) {
      console.error('Error toggling feedback system:', error);
      setError('Failed to toggle feedback system');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchFeedbackStatus(),
        fetchAnalytics(),
        fetchResponses(1)
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mess Feedback Management</h1>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Feedback system is currently {feedbackEnabled ? 'enabled' : 'disabled'}
          </span>
          <button
            onClick={toggleFeedbackSystem}
            className={`px-4 py-2 rounded ${
              feedbackEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {feedbackEnabled ? 'Disable Feedback' : 'Enable Feedback'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'responses'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('responses')}
            >
              Responses
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'ai-analysis'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ai-analysis')}
            >
              AI Analysis
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'analytics' ? (
            <MessFeedbackAnalytics analytics={analytics} />
          ) : activeTab === 'responses' ? (
            <MessFeedbackResponses 
              responses={responses}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchResponses(page)}
              onFilterChange={(filters) => fetchResponses(1, filters)}
            />
          ) : (
            <MessFeedbackAnalysis />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessFeedbackPage;
