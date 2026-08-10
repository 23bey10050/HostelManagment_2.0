import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase';
import StudentTable from '../../components/dashboard/StudentTable';
import StudentAddModal from '../../components/dashboard/StudentAddModal';
import StudentUploadModal from '../../components/dashboard/StudentUploadModal';
import EditStudentModal from '../../components/dashboard/EditStudentModal';
import RoomAllocationView from '../../components/dashboard/RoomAllocationView';
import { useAuth } from '../../context/AuthContext';

function StudentsPage() {
  const { user } = useAuth();
  const isWarden = user?.role === 'warden';
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // New state for all students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'allocation'

  const fetchStudents = async (page = 1, search = '') => {
    try {
      const token = await auth.currentUser.getIdToken();
      
      // Fetch paginated students for table view
      const response = await axios.get(
        `http://localhost:8000/api/students?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      
      // If we're in allocation view or switching to it, fetch all students
      if (viewMode === 'allocation' || !allStudents.length) {
        const allResponse = await axios.get(
          `http://localhost:8000/api/students/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAllStudents(allResponse.data);
      }
    } catch (error) {
      setError('Failed to fetch students');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  // Add effect to fetch all students when view mode changes to allocation
  useEffect(() => {
    if (viewMode === 'allocation' && !allStudents.length) {
      const fetchAllStudents = async () => {
        try {
          const token = await auth.currentUser.getIdToken();
          const response = await axios.get(
            `http://localhost:8000/api/students/all`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setAllStudents(response.data);
        } catch (error) {
          console.error('Error fetching all students:', error);
        }
      };
      
      fetchAllStudents();
    }
  }, [viewMode]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`http://localhost:8000/api/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchStudents(currentPage, searchTerm);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleToggleAccess = async (studentId, disable) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.patch(
        `http://localhost:8000/api/students/${studentId}/access`,
        { isDisabled: disable },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        fetchStudents(currentPage, searchTerm);
      }
    } catch (error) {
      console.error('Error toggling access:', error.response?.data || error);
      setError(error.response?.data?.message || 'Failed to update student access');
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
        <h1 className="text-2xl font-bold">Student Management</h1>
        
        <div className="flex items-center gap-4">
          {/* View toggle buttons */}
          <div className="flex border rounded overflow-hidden">
            <button 
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 ${viewMode === 'table' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700'}`}
            >
              Table View
            </button>
            <button 
              onClick={() => setViewMode('allocation')}
              className={`px-4 py-2 ${viewMode === 'allocation' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700'}`}
            >
              Room Allocation
            </button>
          </div>
          
          {/* Allow both staff and CTS to add/upload students */}
          {viewMode === 'table' && (
            <div className="space-x-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Student
              </button>
              {!isWarden && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Bulk Upload
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {viewMode === 'table' ? (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <StudentTable
            students={students}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleAccess={handleToggleAccess}
          />
        </>
      ) : (
        <RoomAllocationView 
          students={allStudents.length ? allStudents : students} 
          onStudentAdded={() => {
            // Refresh all students data when adding from room view
            const fetchAllStudents = async () => {
              try {
                const token = await auth.currentUser.getIdToken();
                const response = await axios.get(
                  `http://localhost:8000/api/students/all`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );
                setAllStudents(response.data);
              } catch (error) {
                console.error('Error fetching all students:', error);
              }
            };
            
            fetchAllStudents();
          }}
        />
      )}

      <StudentAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={() => fetchStudents(currentPage, searchTerm)}
      />

      <StudentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => fetchStudents(currentPage, searchTerm)}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        onEditSuccess={() => {
          fetchStudents(currentPage, searchTerm);
          setIsEditModalOpen(false);
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}

export default StudentsPage;
