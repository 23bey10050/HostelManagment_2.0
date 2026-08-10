import { useState } from 'react';

function MessFeedbackResponses({ responses, currentPage, totalPages, onPageChange, onFilterChange }) {
  const [filters, setFilters] = useState({
    mess: '',
    mealType: ''
  });
  
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mess</label>
          <select
            value={filters.mess}
            onChange={(e) => handleFilterChange('mess', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Messes</option>
            <option value="JMB Mess">JMB Mess</option>
            <option value="Safal Mess">Safal Mess</option>
            <option value="Mayuri Mess">Mayuri Mess</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Meal Type</label>
          <select
            value={filters.mealType}
            onChange={(e) => handleFilterChange('mealType', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Meals</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Hi-Tea">Hi-Tea</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
      </div>
      
      {/* Responses */}
      {responses.length > 0 ? (
        <div className="space-y-6">
          {responses.map((feedback) => (
            <div key={feedback._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{feedback.student.name}</h3>
                  <p className="text-sm text-gray-600">{feedback.student.registrationNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{feedback.mess}</p>
                  <p className="text-sm text-gray-600">{feedback.mealType}</p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Food Quality</p>
                  <p className="text-lg">{renderStars(feedback.foodQuality)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cleanliness</p>
                  <p className="text-lg">{renderStars(feedback.cleanliness)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Service Quality</p>
                  <p className="text-lg">{renderStars(feedback.serviceQuality)}</p>
                </div>
              </div>
              
              {feedback.comments && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{feedback.comments}</p>
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500 text-right">
                Submitted: {new Date(feedback.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 mx-1 rounded ${
                  currentPage === i + 1 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No feedback responses found.
        </div>
      )}
    </div>
  );
}

export default MessFeedbackResponses;
