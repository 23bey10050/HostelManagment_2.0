import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill demo credentials based on role
  useEffect(() => {
    if (role === 'student') setCredentials({ email: 'student@demo.com', password: 'password123' });
    if (role === 'warden') setCredentials({ email: 'warden@demo.com', password: 'password123' });
    if (role === 'worker') setCredentials({ email: 'worker@demo.com', password: 'password123' });
    if (role === 'canteen') setCredentials({ email: 'canteen@demo.com', password: 'password123' });
  }, [role]);

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Logging in with credentials:', { email: credentials.email, role });
      const response = await axios.post('http://localhost:8000/api/auth/staff/login', credentials);
      const { user: userData } = response.data;
      
      console.log('Login successful:', userData);
      
      // Update user context immediately
      setUser({
        uid: userData.uid || 'demo-user',
        email: credentials.email,
        role: userData.role,
        name: userData.name,
        workerCategory: userData.workerCategory,
        upiId: userData.upiId
      });

      // Navigate based on role
      let dashboardPath = '/dashboard';
      if (userData.role === 'worker') {
        dashboardPath = '/dashboard/worker';
      } else if (userData.role === 'warden') {
        dashboardPath = '/dashboard/warden';
      } else if (userData.role === 'canteen') {
        dashboardPath = '/dashboard/canteen';
      }
      
      console.log('Navigating to:', dashboardPath);
      navigate(dashboardPath);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      try {
        const response = await axios.post('http://localhost:8000/api/auth/google/verify', { token });
        
        // Sign in with custom token to get the role claims
        if (response.data.customToken) {
          await signInWithCustomToken(auth, response.data.customToken);
        }
        
        navigate('/dashboard');
      } catch (verifyError) {
        await auth.signOut();
        setError(verifyError.response?.data?.message || 'Access denied');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (role === 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Student Demo Login</h2>
          
          <button
            onClick={handleStaffLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <span>Quick Login as Student</span>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              <p className="font-medium">Access Denied</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {role.charAt(0).toUpperCase() + role.slice(1)} Login
        </h2>
        
        <form onSubmit={handleStaffLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
