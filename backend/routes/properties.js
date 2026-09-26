const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/property');
const User = require('../models/user');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// GET /api/properties - Dynamic Search & Filter
router.get('/', async (req, res) => {
  try {
    const {
      search,
      listingType,
      propertyType,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
      sort
    } = req.query;

    let query = { status: 'approved' };

    // Search query (title, description, city, address)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'location.city': searchRegex },
        { 'location.address': searchRegex }
      ];
    }

    // Filter by Listing Type (sale, rent)
    if (listingType && listingType !== 'all') {
      query.listingType = listingType;
    }

    // Filter by Property Type (apartment, house, villa, etc.)
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Filter by City
    if (city && city.trim() !== '') {
      query['location.city'] = new RegExp(city.trim(), 'i');
    }

    // Filter by Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by Bedrooms
    if (bedrooms && bedrooms !== 'all') {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by Bathrooms
    if (bathrooms && bathrooms !== 'all') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Filter by Area
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    // Filter by Amenities
    if (amenities) {
      const amenitiesList = Array.isArray(amenities)
        ? amenities
        : amenities.split(',').map(a => a.trim()).filter(Boolean);
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    // Sort order
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'views') sortOptions = { viewsCount: -1 };

    const properties = await Property.find(query)
      .populate('postedBy', 'name email phone avatar role')
      .sort(sortOptions);

    res.json(properties);
  } catch (error) {
    console.error('Fetch properties error:', error);
    res.status(500).json({ message: 'Error fetching properties: ' + error.message });
  }
});

// GET /api/properties/featured - Home Page Featured Properties
router.get('/featured', async (req, res) => {
  try {
    const featured = await Property.find({ status: 'approved', featured: true })
      .populate('postedBy', 'name email phone avatar')
      .limit(8);

    // Fallback to latest properties if not enough featured properties
    if (featured.length < 4) {
      const latest = await Property.find({ status: 'approved' })
        .populate('postedBy', 'name email phone avatar')
        .sort({ createdAt: -1 })
        .limit(8);
      return res.json(latest);
    }

    res.json(featured);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/properties/user/my-listings - Current User's Listings
router.get('/user/my-listings', auth, async (req, res) => {
  try {
    const properties = await Property.find({ postedBy: req.userId })
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/properties/user/saved - User's Favorited Properties
router.get('/user/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'savedProperties',
      populate: { path: 'postedBy', select: 'name email phone avatar' }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.savedProperties || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/properties/:id - Single Property Details
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('postedBy', 'name email phone avatar bio role');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment views counter asynchronously
    property.viewsCount = (property.viewsCount || 0) + 1;
    await property.save();

    // Fetch 3 similar properties in same city or of same type
    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      status: 'approved',
      $or: [
        { 'location.city': property.location.city },
        { propertyType: property.propertyType }
      ]
    }).limit(3);

    res.json({ property, similarProperties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/properties - Create Property Listing
router.post('/', auth, upload.array('images', 8), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      listingType,
      rentPeriod,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      amenities,
      imageUrls,
      featured
    } = req.body;

    let images = [];
    
    // Process uploaded file images
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Process external URL images if provided
    if (imageUrls) {
      const parsedUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
      if (Array.isArray(parsedUrls)) {
        images = [...images, ...parsedUrls];
      }
    }

    // Default image if none provided
    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&fit=crop'];
    }

    // Parse amenities
    let parsedAmenities = [];
    if (amenities) {
      parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    const property = new Property({
      title,
      description,
      price: Number(price),
      listingType: listingType || 'sale',
      rentPeriod: listingType === 'rent' ? (rentPeriod || 'monthly') : 'n/a',
      propertyType,
      bedrooms: Number(bedrooms || 0),
      bathrooms: Number(bathrooms || 0),
      area: Number(area),
      location: {
        address,
        city,
        state: state || '',
        zipCode: zipCode || ''
      },
      amenities: parsedAmenities,
      images,
      featured: featured === true || featured === 'true',
      status: 'approved', // Auto-approve for responsive demo experience
      postedBy: req.userId
    });

    await property.save();
    await property.populate('postedBy', 'name email phone avatar');

    res.status(201).json({ message: 'Property created successfully!', property });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/properties/:id - Update Property Listing
router.put('/:id', auth, upload.array('images', 8), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check ownership or admin status
    if (property.postedBy.toString() !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing.' });
    }

    const {
      title, description, price, listingType, rentPeriod,
      propertyType, bedrooms, bathrooms, area, address, city, state, zipCode,
      amenities, imageUrls
    } = req.body;

    if (title) property.title = title;
    if (description) property.description = description;
    if (price) property.price = Number(price);
    if (listingType) property.listingType = listingType;
    if (rentPeriod) property.rentPeriod = rentPeriod;
    if (propertyType) property.propertyType = propertyType;
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
    if (area) property.area = Number(area);
    
    if (address || city || state || zipCode) {
      property.location = {
        address: address || property.location.address,
        city: city || property.location.city,
        state: state !== undefined ? state : property.location.state,
        zipCode: zipCode !== undefined ? zipCode : property.location.zipCode
      };
    }

    if (amenities) {
      property.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
    }

    if (req.files && req.files.length > 0) {
      const newFileImages = req.files.map(file => `/uploads/${file.filename}`);
      property.images = [...property.images, ...newFileImages];
    }

    if (imageUrls) {
      const urls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
      if (Array.isArray(urls) && urls.length > 0) {
        property.images = urls;
      }
    }

    await property.save();
    res.json({ message: 'Property updated successfully!', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/properties/:id - Delete Listing
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.postedBy.toString() !== req.userId.toString() && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing.' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/properties/:id/save - Toggle Save / Bookmark Property
router.post('/:id/save', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const propertyId = req.params.id;
    const isSaved = user.savedProperties.includes(propertyId);

    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
    } else {
      user.savedProperties.push(propertyId);
    }

    await user.save();
    res.json({
      saved: !isSaved,
      message: !isSaved ? 'Property saved to favorites!' : 'Property removed from saved.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;