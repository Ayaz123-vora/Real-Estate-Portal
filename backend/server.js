require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');

const app = express();

// Ensure uploads directory exists
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsPath));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate_portal_db';
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`✅ MongoDB Connected to: ${MONGODB_URI}`))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Real Estate Portal API running successfully! 🚀',
    timestamp: new Date()
  });
});

// Global 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Server listener with EADDRINUSE auto-fallback handling
const DEFAULT_PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Real Estate Backend Server running at http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is currently in use. Attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(Number(DEFAULT_PORT));