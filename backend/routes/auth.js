const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Generate JWT Token helper
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'super_secret_realestate_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// Register User / Agent
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const allowedRole = ['user', 'agent'].includes(role) ? role : 'user';
    
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: allowedRole,
      phone: phone || ''
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        savedProperties: user.savedProperties
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        savedProperties: user.savedProperties
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get Current User Profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('savedProperties');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      bio: user.bio,
      savedProperties: user.savedProperties
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, bio, avatar } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        savedProperties: user.savedProperties
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;