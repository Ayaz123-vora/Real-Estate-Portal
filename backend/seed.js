require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');
const Property = require('./models/property');
const Inquiry = require('./models/inquiry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate_portal_db';

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!');

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('👤 Creating initial users...');
    const adminUser = new User({
      name: 'Admin Manager',
      email: 'admin@realestate.com',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+1 (800) 555-0199',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&fit=crop&crop=faces',
      bio: 'Head administrator and property listing curator.'
    });

    const agent1 = new User({
      name: 'John Reynolds',
      email: 'john.realty@realestate.com',
      password: 'agentpassword123',
      role: 'agent',
      phone: '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&crop=faces',
      bio: 'Premier luxury real estate specialist with 10+ years experience in urban & coastal residences.'
    });

    const agent2 = new User({
      name: 'Sarah Connor',
      email: 'sarah.villas@realestate.com',
      password: 'agentpassword123',
      role: 'agent',
      phone: '+1 (555) 876-5432',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&fit=crop&crop=faces',
      bio: 'Specializing in suburban family homes, luxury rentals, and waterfront estates.'
    });

    const regularUser = new User({
      name: 'Alex Morgan',
      email: 'user@realestate.com',
      password: 'userpassword123',
      role: 'user',
      phone: '+1 (555) 345-6789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&crop=faces',
      bio: 'Homebuyer seeking modern urban living spaces.'
    });

    await adminUser.save();
    await agent1.save();
    await agent2.save();
    await regularUser.save();

    console.log('✅ Users created: Admin, Agents, and User.');

    console.log('🏠 Creating rich property listings...');

    const sampleProperties = [
      {
        title: 'Modern Sunset Heights Villa',
        description: 'An architectural masterpiece offering panoramic ocean and city views. Features open-concept living spaces, custom Italian marble countertops, floor-to-ceiling glass walls, and a heated infinity pool with an outdoor kitchen.',
        price: 2450000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'villa',
        bedrooms: 5,
        bathrooms: 6,
        area: 5200,
        location: {
          address: '742 Sunset Boulevard',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90069'
        },
        amenities: ['Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Parking', 'Air Conditioning', 'Security', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 142
      },
      {
        title: 'Downtown Skyline Luxury Loft',
        description: 'Experience refined urban living in this sun-drenched penthouse loft. Featuring 14ft high ceilings, exposed brick accent walls, high-end Miele appliances, and direct private elevator access to the rooftop deck.',
        price: 4800,
        listingType: 'rent',
        rentPeriod: 'monthly',
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1650,
        location: {
          address: '120 Broadway Street, Penthouse 4B',
          city: 'New York',
          state: 'NY',
          zipCode: '10005'
        },
        amenities: ['Gym', 'Balcony', 'Air Conditioning', 'Security', 'WiFi', 'Elevator'],
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 215
      },
      {
        title: 'Charming Suburban Family Residence',
        description: 'Nestled in a peaceful cul-de-sac with top-rated school districts. Features a newly renovated kitchen, cozy stone fireplace, large private backyard with fruit trees, and a two-car garage.',
        price: 685000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 2850,
        location: {
          address: '458 Maple Ridge Way',
          city: 'Austin',
          state: 'TX',
          zipCode: '78704'
        },
        amenities: ['Garden', 'Parking', 'Air Conditioning', 'Security', 'Fireplace'],
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1583608205776-bfd35f55b5ed?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 98
      },
      {
        title: 'Waterfront Ocean Drive Apartment',
        description: 'Prime South Beach condo with unobstructed turquoise ocean views. Fully furnished with contemporary designer items, floor-to-ceiling windows, and access to 24/7 concierge and resort amenities.',
        price: 3500,
        listingType: 'rent',
        rentPeriod: 'monthly',
        propertyType: 'apartment',
        bedrooms: 1,
        bathrooms: 1.5,
        area: 950,
        location: {
          address: '1001 Ocean Drive, Suite 802',
          city: 'Miami',
          state: 'FL',
          zipCode: '33139'
        },
        amenities: ['Swimming Pool', 'Gym', 'Balcony', 'Security', 'WiFi', 'Air Conditioning'],
        images: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 310
      },
      {
        title: 'High-Tech Commercial Office Suite',
        description: 'State-of-the-art tech workspace in the heart of South Lake Union. Open layout floor plan with dedicated conference rooms, soundproof phone booths, fiber internet infrastructure, and kitchen lounge.',
        price: 12500,
        listingType: 'rent',
        rentPeriod: 'monthly',
        propertyType: 'commercial',
        bedrooms: 0,
        bathrooms: 4,
        area: 4500,
        location: {
          address: '880 Westlake Avenue N',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98109'
        },
        amenities: ['Parking', 'Air Conditioning', 'Security', 'WiFi', 'Elevator'],
        images: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 67
      },
      {
        title: 'Lakeside Mountain Chalet & Resort',
        description: 'Rustic luxury meets modern comfort in this custom log chalet near Aspen ski resorts. Wrap-around deck, hot tub, stone wood-burning fireplace, and breathtaking mountain peak views.',
        price: 1850000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'villa',
        bedrooms: 4,
        bathrooms: 4,
        area: 3600,
        location: {
          address: '310 Pine Crest Trail',
          city: 'Aspen',
          state: 'CO',
          zipCode: '81611'
        },
        amenities: ['Garden', 'Balcony', 'Parking', 'Fireplace', 'WiFi', 'Hot Tub'],
        images: [
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 184
      },
      {
        title: 'Prime Residential Building Plot',
        description: 'Rare opportunity to build your dream estate on this 1.2-acre flat parcel in prestigious Silicon Valley neighborhood. Fully utility ready with approved architectural permits.',
        price: 1200000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'land',
        bedrooms: 0,
        bathrooms: 0,
        area: 52272,
        location: {
          address: '550 Foothill Expressway',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94022'
        },
        amenities: ['Security'],
        images: [
          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 45
      },
      {
        title: 'Historic Gold Coast Townhouse',
        description: 'Impeccably restored 19th-century brick townhouse combining historic charm with sleek contemporary finishes. Features gourmet chef kitchen, private brick courtyard, and wine cellar.',
        price: 1450000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 3.5,
        area: 3100,
        location: {
          address: '1410 N Dearborn Parkway',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60610'
        },
        amenities: ['Garden', 'Balcony', 'Parking', 'Fireplace', 'Air Conditioning', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 112
      },
      {
        title: 'Modern Urban Studio Apartment',
        description: 'Sleek and efficient studio in heart of vibrant arts district. Smart layout with built-in Murphy storage bed, quartz island, and in-unit washer/dryer.',
        price: 1950,
        listingType: 'rent',
        rentPeriod: 'monthly',
        propertyType: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        area: 620,
        location: {
          address: '715 NW 23rd Ave',
          city: 'Portland',
          state: 'OR',
          zipCode: '97210'
        },
        amenities: ['Air Conditioning', 'WiFi', 'Elevator', 'Security'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 89
      },
      {
        title: 'Tropical Palm Beach Estate',
        description: 'Exclusive Mediterranean-style estate featuring lush palm gardens, guest house, salt-water pool, and private dock capable of accommodating a 60ft yacht.',
        price: 4950000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'villa',
        bedrooms: 6,
        bathrooms: 7,
        area: 7800,
        location: {
          address: '220 Royal Palm Way',
          city: 'Miami',
          state: 'FL',
          zipCode: '33480'
        },
        amenities: ['Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Parking', 'Air Conditioning', 'Security', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1000&fit=crop',
          'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1000&fit=crop'
        ],
        featured: true,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 290
      },
      {
        title: 'Eco-Friendly Modern Hillside Home',
        description: 'Solar-powered smart home built into the rolling Texas hills. Features rainwater harvesting, smart home automation, expansive glass walls, and electric vehicle charging station.',
        price: 890000,
        listingType: 'sale',
        rentPeriod: 'n/a',
        propertyType: 'house',
        bedrooms: 3,
        bathrooms: 2.5,
        area: 2400,
        location: {
          address: '8900 Barton Creek Blvd',
          city: 'Austin',
          state: 'TX',
          zipCode: '78735'
        },
        amenities: ['Garden', 'Parking', 'Air Conditioning', 'Security', 'WiFi', 'EV Charger'],
        images: [
          'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent1._id,
        viewsCount: 76
      },
      {
        title: 'Luxury Retail Shop & Showroom',
        description: 'High-foot-traffic corner retail location in prime shopping corridor. Large glass window display, high ceilings, storage room, and dedicated customer parking.',
        price: 8500,
        listingType: 'rent',
        rentPeriod: 'monthly',
        propertyType: 'commercial',
        bedrooms: 0,
        bathrooms: 2,
        area: 2100,
        location: {
          address: '404 Rodeo Drive',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        amenities: ['Parking', 'Air Conditioning', 'Security', 'WiFi'],
        images: [
          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&fit=crop'
        ],
        featured: false,
        status: 'approved',
        postedBy: agent2._id,
        viewsCount: 130
      }
    ];

    const insertedProperties = await Property.insertMany(sampleProperties);
    console.log(`✅ ${insertedProperties.length} Properties inserted!`);

    // Add a couple of properties to regularUser's saved list
    regularUser.savedProperties = [insertedProperties[0]._id, insertedProperties[1]._id];
    await regularUser.save();

    // Create a sample inquiry
    const inquiry = new Inquiry({
      property: insertedProperties[0]._id,
      sender: regularUser._id,
      recipient: agent1._id,
      senderName: regularUser.name,
      senderEmail: regularUser.email,
      senderPhone: regularUser.phone,
      message: 'Hi John, I am very interested in touring the Modern Sunset Heights Villa this weekend. Is Saturday morning available?',
      status: 'unread'
    });
    await inquiry.save();
    console.log('✅ Sample inquiry created!');

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('Database Name: realestate_portal_db');
    console.log('Sample Accounts Created:');
    console.log('1. Admin:  admin@realestate.com / adminpassword123');
    console.log('2. Agent:  john.realty@realestate.com / agentpassword123');
    console.log('3. Agent:  sarah.villas@realestate.com / agentpassword123');
    console.log('4. User:   user@realestate.com / userpassword123');
    console.log('--------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
};

seedDatabase();