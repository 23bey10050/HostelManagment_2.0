import { useState } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';

function AddStaffModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'worker',
    workerCategory: '',
    upiId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate worker category
    if (formData.role === 'worker' && !formData.workerCategory) {
      setError('Worker category is required for worker role');
      return;
    }

    // Validate UPI ID for canteen staff
    if (formData.role === 'canteen' && !formData.upiId) {
      setError('UPI ID is required for canteen staff');
      return;
    }

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      
      // Only include relevant fields based on role
      const submitData = {
        ...formData,
        workerCategory: formData.role === 'worker' ? formData.workerCategory : undefined,
        upiId: formData.role === 'canteen' ? formData.upiId : undefined
      };

      await axios.post('http://localhost:8000/api/staff', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Staff creation error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to add staff member');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Add Staff Member</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="form-input"
                required
                placeholder="Enter staff member's name"
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="form-label">Role</label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setFormData({
                    ...formData,
                    role: newRole,
                    // Clear role-specific fields when role changes
                    workerCategory: newRole === 'worker' ? formData.workerCategory : '',
                    upiId: newRole === 'canteen' ? formData.upiId : ''
                  });
                }}
                className="form-input"
                required
              >
                <option value="worker">Worker</option>
                <option value="warden">Warden</option>
                <option value="canteen">Canteen Staff</option>
              </select>
            </div>

            {formData.role === 'worker' && (
              <div>
                <label className="form-label">Category</label>
                <select
                  value={formData.workerCategory}
                  onChange={(e) => setFormData({...formData, workerCategory: e.target.value})}
                  className="form-input"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Electrician">Electrician</option>
                </select>
              </div>
            )}

            {formData.role === 'canteen' && (
              <div>
                <label className="form-label">UPI ID</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                  className="form-input"
                  required
                  placeholder="e.g. name@upi"
                />
                <p className="text-xs text-gray-500 mt-1">
                  UPI ID for receiving payments
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStaffModal;
