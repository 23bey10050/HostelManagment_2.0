import { useState, useEffect } from 'react';
import axios from 'axios';

function WorkerComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get('/api/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {complaints.map((complaint) => (
            <tr key={complaint._id}>
              <td className="px-6 py-4">{complaint.roomNumber}</td>
              <td className="px-6 py-4">{complaint.description}</td>
              <td className="px-6 py-4">
                <select
                  value={complaint.status}
                  onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </td>
              <td className="px-6 py-4">
                {new Date(complaint.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {complaint.imageUrl && (
                  <a
                    href={complaint.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkerComplaintList;
