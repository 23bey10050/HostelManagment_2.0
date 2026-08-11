import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ComplaintTable from '../../components/dashboard/ComplaintTable';
import ComplaintFilters from '../../components/dashboard/ComplaintFilters';

function ComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    dateRange: 'all'
  });

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);

      const response = await axios.get(`/api/complaints?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (error) {
      setError('Failed to fetch complaints');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComplaints();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('demo_token');
      await axios.patch(
        `/api/complaints/${complaintId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Only warden and worker can update status
  const canUpdateStatus = user?.role === 'warden' || user?.role === 'worker';

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
        <h1 className="text-2xl font-bold">Complaints Management</h1>
      </div>

      <ComplaintFilters
        filters={filters}
        onChange={setFilters}
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ComplaintTable
        complaints={complaints}
        onStatusChange={canUpdateStatus ? handleStatusChange : null}
        canUpdateStatus={canUpdateStatus}
      />
    </div>
  );
}

export default ComplaintsPage;
