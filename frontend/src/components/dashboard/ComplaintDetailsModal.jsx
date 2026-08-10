function ComplaintDetailsModal({ isOpen, onClose, complaint }) {
  if (!isOpen || !complaint) return null;

  const studentDetails = [
    { label: 'Name', value: complaint.student?.name || 'N/A' },
    { label: 'Registration No', value: complaint.student?.registrationNumber || 'N/A' },
    { label: 'Contact', value: complaint.student?.phoneNumber || 'N/A' },
    { label: 'Email', value: complaint.student?.email || 'N/A' },
    { label: 'Hostel Block', value: complaint.student?.hostelBlock || 'N/A' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold">Complaint Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Complaint Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Complaint Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                      complaint.status === 'Resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {complaint.status === 'Resolved' ? 'Completed' : 'Assigned'}
                    </span>
                  </div>
                  <InfoRow label="Category" value={complaint.category} />
                  <InfoRow 
                    label="Date Submitted" 
                    value={new Date(complaint.createdAt).toLocaleString()} 
                  />
                  <InfoRow label="Room Number" value={complaint.roomNumber} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{complaint.description}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Student Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {studentDetails.map(({ label, value }) => (
                    <InfoRow key={label} label={label} value={value} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            {complaint.imageUrl ? (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Attached Image</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="relative aspect-video">
                    <img 
                      src={complaint.imageUrl} 
                      alt="Complaint" 
                      className="rounded-lg w-full h-full object-contain"
                    />
                  </div>
                  <a 
                    href={complaint.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <span>View Full Image</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center">
                No image attached
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying info rows
const InfoRow = ({ label, value }) => (
  <p>
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="ml-2">{value}</span>
  </p>
);

export default ComplaintDetailsModal;
