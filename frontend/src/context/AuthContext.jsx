import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an active session and JWT token
    const checkSession = () => {
      try {
        const session = localStorage.getItem('demo_session');
        const token = localStorage.getItem('demo_token');
        if (session && token) {
          const userData = JSON.parse(session);
          setUserState(userData);
          // Attach token to every request automatically
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          setUserState(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        console.error('Session read error:', error);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const setUser = (userData, token) => {
    if (userData === null) {
      localStorage.removeItem('demo_session');
      localStorage.removeItem('demo_token');
      delete axios.defaults.headers.common['Authorization'];
      setUserState(null);
      return;
    }

    if (token) {
      localStorage.setItem('demo_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    if (typeof userData === 'function') {
      setUserState(prev => {
        const nextState = userData(prev);
        localStorage.setItem('demo_session', JSON.stringify(nextState));
        return nextState;
      });
    } else {
      localStorage.setItem('demo_session', JSON.stringify(userData));
      setUserState(userData);
    }
  };

  const value = {
    user,
    loading,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
