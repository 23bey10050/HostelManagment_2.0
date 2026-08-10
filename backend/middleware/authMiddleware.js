import firebaseAdmin from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      // Enhanced debugging info
      console.log('Token verified for user:', decodedToken.email || decodedToken.uid);
      console.log('Claims in token:', {
        role: decodedToken.role,
        workerCategory: decodedToken.workerCategory,
        upiId: decodedToken.upiId,
        timestamp: new Date().toISOString()
      });
      
      // Check if token has role claim
      if (!decodedToken.role) {
        return res.status(403).json({ message: 'No role specified in token' });
      }
      
      req.user = {
        ...decodedToken,
        role: decodedToken.role
      };
      
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error in auth middleware' });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('Checking role:', req.user.role, 'Against allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Unauthorized access', 
        userRole: req.user.role, 
        requiredRoles: roles 
      });
    }
    next();
  };
};
