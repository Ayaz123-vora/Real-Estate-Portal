const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_realestate_jwt_key_2026');
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid authentication token. User not found.' });
    }
    
    req.userId = user._id;
    req.userRole = user.role;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
  }
  next();
};

const agentOrAdmin = (req, res, next) => {
  if (req.userRole !== 'agent' && req.userRole !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Agent or Admin role required.' });
  }
  next();
};

module.exports = { auth, adminOnly, agentOrAdmin };