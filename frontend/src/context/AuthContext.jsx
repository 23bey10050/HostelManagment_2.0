import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Demo Mode: Check local storage for an active session
    const checkSession = () => {
      try {
        const session = localStorage.getItem('demo_session');
        if (session) {
          const userData = JSON.parse(session);
          setUserState(userData);
        } else {
          setUserState(null);
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

  const setUser = (userData) => {
    if (userData) {
      localStorage.setItem('demo_session', JSON.stringify(userData));
    } else {
      localStorage.removeItem('demo_session');
    }
    setUserState(userData);
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
