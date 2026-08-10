function StaffTable({ staff, onDelete }) {
  // Function to convert role to proper display format
  const formatRole = (role) => {
    const roleMap = {
      'worker': 'Worker',
      'warden': 'Warden',
      'canteen': 'Canteen Staff'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="table min-w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Category/UPI</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member._id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{formatRole(member.role)}</td>
              <td>
                {member.role === 'worker' && member.workerCategory ? member.workerCategory : ''}
                {member.role === 'canteen' && member.upiId ? member.upiId : ''}
              </td>
              <td>
                <button 
                  onClick={() => onDelete(member._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StaffTable;
