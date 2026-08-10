import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Always force a token refresh when auth state changes
          await firebaseUser.getIdToken(true);
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          
          // Add debugging
          console.log('Auth state changed:', {
            uid: firebaseUser.uid,
            role: idTokenResult.claims.role
          });
          
          // If no role claim, sign out and force re-login
          if (!idTokenResult.claims.role) {
            console.warn('No role claim found, signing out...');
            await auth.signOut();
            setUser(null);
          } else {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: idTokenResult.claims.role,
              name: firebaseUser.displayName || '',
              workerCategory: idTokenResult.claims.workerCategory || null
            });
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          await auth.signOut();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    setUser // Export setUser to allow direct updates
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
