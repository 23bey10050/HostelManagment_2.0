import { useState, useEffect } from 'react';
import axios from 'axios';
import StaffTable from '../../components/dashboard/StaffTable';
import AddStaffModal from '../../components/dashboard/AddStaffModal';

function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('demo_token');
      const response = await axios.get(
        `/api/staff?search=${searchTerm}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      let filteredStaff = response.data;
      if (roleFilter) {
        filteredStaff = response.data.filter(member => member.role === roleFilter);
      }

      setStaff(filteredStaff);
    } catch (error) {
      setError('Failed to fetch staff');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [searchTerm, roleFilter]);

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const token = localStorage.getItem('demo_token');
      await axios.delete(`/api/staff/${staffId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

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
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Staff Member
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search staff..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Roles</option>
          <option value="warden">Warden</option>
          <option value="worker">Worker</option>
          <option value="canteen">Canteen Staff</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <StaffTable
        staff={staff}
        onDelete={handleDelete}
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStaff}
      />
    </div>
  );
}

export default StaffManagementPage;
