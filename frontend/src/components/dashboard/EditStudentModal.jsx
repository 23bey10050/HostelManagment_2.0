import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';

function EditStudentModal({ isOpen, onClose, student, onEditSuccess }) {
  const [formData, setFormData] = useState(student || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(student || {});
  }, [student]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(`http://localhost:8000/api/students/${student._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onEditSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Edit Student</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Same form fields as StudentAddModal but with pre-filled values */}
            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                required
                className="form-input"
                disabled // Email shouldn't be editable
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber || ''}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Block</label>
                <input
                  type="text"
                  name="block"
                  value={formData.block || ''}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={handleChange}
                required
                className="form-input"
                disabled // Registration number shouldn't be editable
              />
            </div>
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
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudentModal;
