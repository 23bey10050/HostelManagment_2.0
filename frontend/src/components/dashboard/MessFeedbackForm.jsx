import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

function MessFeedbackForm() {
  const { user } = useAuth();
  const [feedbackEnabled, setFeedbackEnabled] = useState(false);
  const [formData, setFormData] = useState({
    mess: '',
    mealType: '',
    foodQuality: 0,
    cleanliness: 0,
    serviceQuality: 0,
    comments: ''
  });
  
  const [completedMealTypes, setCompletedMealTypes] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mealTypes = ['Breakfast', 'Lunch', 'Hi-Tea', 'Dinner'];

  // Check which meal types have been completed
  useEffect(() => {
    const checkCompletedMealTypes = async () => {
      try {
        const token = localStorage.getItem('demo_token');
        const response = await axios.get(
          '/api/mess-feedback/my-submissions',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Get array of already submitted meal types
        const submitted = response.data.map(feedback => feedback.mealType);
        setCompletedMealTypes(submitted);
        
        // Check if all meal types are completed
        const isAllCompleted = mealTypes.every(mealType => 
          submitted.includes(mealType)
        );
        setAllCompleted(isAllCompleted);
      } catch (error) {
        console.error('Error checking completed feedback:', error);
      }
    };

    if (user) {
      checkCompletedMealTypes();
    }
  }, [user, success]);

  // Check feedback status and fetch student data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatusLoading(true);
        const token = localStorage.getItem('demo_token');
        
        // Fetch feedback status
        const statusResponse = await axios.get(
          '/api/mess-feedback/status',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setFeedbackEnabled(statusResponse.data.enabled);

        // Fetch student data to get mess assignment if needed
        if (!user?.mess) {
          const studentResponse = await axios.get(
            '/api/students/me',
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          if (studentResponse.data.mess) {
            setFormData(prev => ({
              ...prev,
              mess: studentResponse.data.mess
            }));
          }
        }
      } catch (error) {
        console.error('Error checking feedback status:', error);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Set user's mess when user data loads
  useEffect(() => {
    if (user?.mess) {
      setFormData(prev => ({
        ...prev,
        mess: user.mess
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingChange = (field, rating) => {
    setFormData({
      ...formData,
      [field]: rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('demo_token');
      await axios.post(
        '/api/mess-feedback/submit',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSuccess('Thank you for your feedback!');
      
      // Add to completed meal types
      setCompletedMealTypes(prev => [...prev, formData.mealType]);
      
      // Check if all meal types are now completed
      if ([...completedMealTypes, formData.mealType].length === mealTypes.length) {
        setAllCompleted(true);
      }
      
      // Reset form
      setFormData({
        mess: user?.mess || '',
        mealType: '',
        foodQuality: 0,
        cleanliness: 0,
        serviceQuality: 0,
        comments: ''
      });
    } catch (error) {
      if (error.response?.status === 409) {
        setError('You have already submitted feedback for this meal type.');
      } else {
        setError(error.response?.data?.message || 'Failed to submit feedback');
      }
    } finally {
      setLoading(false);
    }
  };

  const RatingStars = ({ name, rating, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(name, star)}
            className={`text-2xl transition-all ${
              star <= rating
                ? 'text-yellow-500 hover:text-yellow-600'
                : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (statusLoading) {
    return (
      <div id="mess-feedback" className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (!feedbackEnabled) {
    return (
      <div id="mess-feedback" className="bg-gray-100 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Mess Feedback Paused</h3>
        <p className="text-gray-600">
          The mess feedback system is currently disabled. Please check back later.
        </p>
      </div>
    );
  }

  if (allCompleted) {
    return (
      <div id="mess-feedback" className="bg-green-50 border border-green-100 rounded-lg shadow p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">All Feedback Completed!</h3>
        <p className="text-gray-600">
          You've provided feedback for all meal types. Thank you for helping us improve our mess service!
        </p>
        <p className="text-sm text-gray-500 mt-4">
          The feedback form will be available again after the next feedback cycle begins.
        </p>
      </div>
    );
  }

  return (
    <div id="mess-feedback" className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Mess Feedback</h2>
        <p className="text-sm text-gray-500">Help us improve your dining experience</p>
        
        {completedMealTypes.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium">Completed: {completedMealTypes.length}/{mealTypes.length}</h3>
            <div className="flex mt-1 space-x-1">
              {mealTypes.map(type => (
                <div 
                  key={type}
                  className={`px-2 py-1 text-xs rounded-full ${
                    completedMealTypes.includes(type) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Mess</label>
            <input
              type="text"
              name="mess"
              value={formData.mess || 'Loading...'}
              className="w-full p-2 border rounded bg-gray-50"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">This is your assigned mess</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Meal Type</label>
            <select
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Select Meal</option>
              {mealTypes
                .filter(mealType => !completedMealTypes.includes(mealType))
                .map(mealType => (
                  <option key={mealType} value={mealType}>{mealType}</option>
                ))
              }
            </select>
          </div>
        </div>
        
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Food Quality</label>
            <RatingStars
              name="foodQuality"
              rating={formData.foodQuality}
              onChange={handleRatingChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cleanliness</label>
            <RatingStars
              name="cleanliness"
              rating={formData.cleanliness}
              onChange={handleRatingChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Service Quality</label>
            <RatingStars
              name="serviceQuality"
              rating={formData.serviceQuality}
              onChange={handleRatingChange}
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Additional Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full p-2 border rounded h-24 resize-none"
            placeholder="Share your experience or suggestions..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.foodQuality || !formData.cleanliness || !formData.serviceQuality || !formData.mealType}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MessFeedbackForm;
