function StudentTable({ students, currentPage, totalPages, onPageChange, onDelete, onEdit, onToggleAccess }) {
  return (
    <div className="overflow-x-auto">
      <table className="table min-w-full">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Reg No.</th>
            <th>Email</th>
            <th>Contact No.</th>
            <th>Hostel Block</th>
            <th>Room Type</th>
            <th>Room Number</th>
            <th>Mess</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.registrationNumber}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>{student.hostelBlock}</td>
              <td>{student.roomType}</td>
              <td>{student.roomNumber}</td>
              <td>{student.mess}</td>
              <td>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(student)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onToggleAccess(student._id, !student.isDisabled)}
                    className={student.isDisabled ? 'text-green-500' : 'text-orange-500'}
                  >
                    {student.isDisabled ? 'Enable' : 'Disable'}
                  </button>
                  <button 
                    onClick={() => onDelete(student._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default StudentTable;
