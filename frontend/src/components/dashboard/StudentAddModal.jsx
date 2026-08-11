import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentAddModal({ isOpen, onClose, onAddSuccess, prefillData = null, fixedRoomData = false }) {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    hostelBlock: 'Boys Hostel Block 6', // Default value
    roomType: '',
    roomNumber: '',
    mess: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add prefill functionality when prefillData changes
  useEffect(() => {
    if (prefillData) {
      setFormData(prevData => ({
        ...prevData,
        ...prefillData
      }));
    } else {
      // Always set default hostel block
      setFormData(prevData => ({
        ...prevData,
        hostelBlock: 'Boys Hostel Block 6'
      }));
    }
  }, [prefillData]);

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
      const token = localStorage.getItem('demo_token');
      await axios.post('http://localhost:8000/api/students', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onAddSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const roomTypes = ['3 Bedded', '4 Bedded'];
  const messOptions = ['JMB Mess', 'Safal Mess', 'Mayuri Mess'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel Block
                </label>
                <input
                  type="text"
                  name="hostelBlock"
                  value={formData.hostelBlock}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded bg-gray-100"
                  disabled={true} // Always disable hostel block
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded ${fixedRoomData ? 'bg-gray-100' : ''}`}
                  disabled={fixedRoomData} // Disable if room data is fixed
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded ${fixedRoomData ? 'bg-gray-100' : ''}`}
                  disabled={fixedRoomData} // Disable if room data is fixed
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mess
                </label>
                <select
                  name="mess"
                  value={formData.mess}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Mess</option>
                  {messOptions.map(mess => (
                    <option key={mess} value={mess}>{mess}</option>
                  ))}
                </select>
              </div>
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
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentAddModal;
