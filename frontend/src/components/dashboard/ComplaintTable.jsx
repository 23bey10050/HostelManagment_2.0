function ComplaintTable({ complaints, onStatusChange, canUpdateStatus }) {
  return (
    <div className="overflow-x-auto">
      <table className="table min-w-full">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Student</th>
            <th>Category</th>
            <th>Description</th>
            <th>Room</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint._id}>
              <td>
                <span className="font-mono text-sm">{complaint._id}</span>
              </td>
              <td>
                {complaint.student ? (
                  `${complaint.student.name} (${complaint.student.registrationNumber})`
                ) : (
                  'Unknown Student'
                )}
              </td>
              <td>{complaint.category}</td>
              <td>{complaint.description}</td>
              <td>{complaint.roomNumber}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  complaint.status === 'Resolved' 
                    ? 'bg-green-100 text-green-800'
                    : complaint.status === 'In Progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {complaint.status}
                </span>
              </td>
              <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
              <td>
                {complaint.imageUrl && (
                  <a 
                    href={complaint.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Image
                  </a>
                )}
              </td>
            </tr>
          ))}
          {complaints.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No complaints found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
