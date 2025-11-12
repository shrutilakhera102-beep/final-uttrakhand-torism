// Uttarakhand Tourist Guide - Backend Server with MongoDB Integration
// Node.js + Express + MongoDB + JWT Authentication

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

// Initialize Twilio client
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uttarakhand-guide';
mongoose.connect(mongoURI)
.then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.name);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// User Schema with Enhanced Booking Fields
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true,
        sparse: true,
        unique: true
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    },
    password: {
        type: String,
        minlength: 8
    },
    favorites: [{
        type: String,
        default: []
    }],
    hotelBookings: [{
        hotelName: String,
        checkIn: Date,
        checkOut: Date,
        rooms: Number,
        guests: Number,
        price: Number,
        bookingDate: { type: Date, default: Date.now },
        status: { type: String, default: 'confirmed' }
    }],
    restaurantReservations: [{
        restaurantName: String,
        date: Date,
        time: String,
        guests: Number,
        cuisine: String,
        bookingDate: { type: Date, default: Date.now },
        status: { type: String, default: 'confirmed' }
    }],
    taxiBookings: [{
        pickupLocation: String,
        dropLocation: String,
        date: Date,
        time: String,
        vehicleType: String,
        distance: String,
        estimatedPrice: Number,
        bookingDate: { type: Date, default: Date.now },
        status: { type: String, default: 'confirmed' }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// JWT Token Generation
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '7d'
    });
};

// ============ AUTHENTICATION ROUTES ============

// Register Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        // Save user
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, remember } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate token
        let tokenExpiresIn = '7d';
        if (remember) {
            tokenExpiresIn = '30d'; // Longer expiration if "Remember me" is checked
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: tokenExpiresIn
        });

        // Return response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ OTP AUTHENTICATION ============

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Send OTP to Phone (Request OTP)
app.post('/api/auth/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate phone format (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format. Use 10-digit Indian mobile number' });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Find or create user with phone
        let user = await User.findOne({ phone });
        
        if (!user) {
            // Create new user with phone only (no password required)
            user = new User({
                phone,
                otp,
                otpExpiry,
                firstName: 'User',
                lastName: phone.slice(-4),
                email: `${phone}@phone.login`, // Temporary email
                phoneVerified: false
            });
        } else {
            // Update existing user's OTP
            user.otp = otp;
            user.otpExpiry = otpExpiry;
        }

        await user.save();

        // Send OTP via Twilio SMS
        let smsSent = false;
        if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
            try {
                await twilioClient.messages.create({
                    body: `Your Uttarakhand Tourist Guide OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phone}`
                });
                smsSent = true;
                console.log(`✅ SMS sent successfully to +91${phone}`);
            } catch (twilioError) {
                console.error('❌ Twilio SMS error:', twilioError.message);
                // Continue even if SMS fails - OTP still saved in DB
            }
        } else {
            console.log(`⚠️ Twilio not configured. OTP for ${phone}: ${otp}`);
        }
        
        // Response
        const response = { 
            message: smsSent ? 'OTP sent to your phone' : 'OTP sent successfully',
            expiresIn: '10 minutes'
        };

        // In development mode, include OTP in response for testing
        if (process.env.NODE_ENV === 'development') {
            response.otp = otp;
            console.log(`📱 DEV MODE - OTP for ${phone}: ${otp}`);
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify OTP and Login
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ message: 'Phone number and OTP are required' });
        }

        // Find user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP exists
        if (!user.otp) {
            return res.status(400).json({ message: 'No OTP found. Please request a new OTP' });
        }

        // Check if OTP expired
        if (new Date() > user.otpExpiry) {
            return res.status(400).json({ message: 'OTP expired. Please request a new OTP' });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Mark phone as verified
        user.phoneVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '30d'
        });

        console.log('✅ OTP verified successfully for:', phone);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                phoneVerified: user.phoneVerified
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via Twilio SMS
        let smsSent = false;
        if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
            try {
                await twilioClient.messages.create({
                    body: `Your Uttarakhand Tourist Guide OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phone}`
                });
                smsSent = true;
                console.log(`✅ SMS resent successfully to +91${phone}`);
            } catch (twilioError) {
                console.error('❌ Twilio SMS error:', twilioError.message);
            }
        } else {
            console.log(`⚠️ Twilio not configured. Resent OTP for ${phone}: ${otp}`);
        }

        // Response
        const response = { 
            message: smsSent ? 'OTP resent to your phone' : 'OTP resent successfully',
            expiresIn: '10 minutes'
        };

        // In development mode, include OTP in response for testing
        if (process.env.NODE_ENV === 'development') {
            response.otp = otp;
            console.log(`📱 DEV MODE - Resent OTP for ${phone}: ${otp}`);
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify Token Route
app.post('/api/auth/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        res.status(200).json({ message: 'Token valid', userId: decoded.id });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Get User Profile
app.get('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update User Profile
app.put('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const { firstName, lastName, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { firstName, lastName, phone, updatedAt: Date.now() },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'Profile updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add to Favorites
app.post('/api/auth/favorites', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const { placeId } = req.body;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { $addToSet: { favorites: placeId } }, // $addToSet prevents duplicates
            { new: true }
        );

        res.status(200).json({ message: 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove from Favorites
app.delete('/api/auth/favorites/:placeId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const { placeId } = req.params;

        const user = await User.findByIdAndUpdate(
            decoded.id,
            { $pull: { favorites: placeId } },
            { new: true }
        );

        res.status(200).json({ message: 'Removed from favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ HOTEL BOOKING ROUTES ============

// Book Hotel
app.post('/api/bookings/hotel', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('✅ Token verified for user:', decoded.id);
        
        const { hotelName, checkIn, checkOut, rooms, guests, price } = req.body;
        console.log('📝 Booking data:', { hotelName, checkIn, checkOut, rooms, guests, price });

        if (!hotelName || !checkIn || !checkOut || !rooms || !guests) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                $push: {
                    hotelBookings: {
                        hotelName,
                        checkIn: new Date(checkIn),
                        checkOut: new Date(checkOut),
                        rooms: parseInt(rooms),
                        guests: parseInt(guests),
                        price: parseFloat(price),
                        bookingDate: new Date(),
                        status: 'confirmed'
                    }
                }
            },
            { new: true }
        );

        console.log('✅ Hotel booking saved! Total bookings:', user.hotelBookings.length);
        
        res.status(201).json({
            message: 'Hotel booked successfully',
            booking: user.hotelBookings[user.hotelBookings.length - 1]
        });
    } catch (error) {
        console.error('❌ Hotel booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Hotel Bookings
app.get('/api/bookings/hotel', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log('❌ No token provided for GET bookings');
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        console.log('✅ Fetching bookings for user:', decoded.id);
        
        const user = await User.findById(decoded.id);
        
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('📋 Found', user.hotelBookings.length, 'hotel bookings');
        res.status(200).json({ bookings: user.hotelBookings });
    } catch (error) {
        console.error('❌ Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ RESTAURANT RESERVATION ROUTES ============

// Book Restaurant
app.post('/api/bookings/restaurant', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const { restaurantName, date, time, guests, cuisine } = req.body;

        if (!restaurantName || !date || !time || !guests) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                $push: {
                    restaurantReservations: {
                        restaurantName,
                        date: new Date(date),
                        time,
                        guests: parseInt(guests),
                        cuisine,
                        bookingDate: new Date(),
                        status: 'confirmed'
                    }
                }
            },
            { new: true }
        );

        res.status(201).json({
            message: 'Restaurant reservation confirmed',
            booking: user.restaurantReservations[user.restaurantReservations.length - 1]
        });
    } catch (error) {
        console.error('Restaurant booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Restaurant Reservations
app.get('/api/bookings/restaurant', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id);

        res.status(200).json({ bookings: user.restaurantReservations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ============ TAXI/TRANSPORT BOOKING ROUTES ============

// Book Taxi
app.post('/api/bookings/taxi', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const { pickupLocation, dropLocation, date, time, vehicleType, distance, estimatedPrice } = req.body;

        if (!pickupLocation || !dropLocation || !date || !time || !vehicleType) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const user = await User.findByIdAndUpdate(
            decoded.id,
            {
                $push: {
                    taxiBookings: {
                        pickupLocation,
                        dropLocation,
                        date: new Date(date),
                        time,
                        vehicleType,
                        distance,
                        estimatedPrice: parseFloat(estimatedPrice),
                        bookingDate: new Date(),
                        status: 'confirmed'
                    }
                }
            },
            { new: true }
        );

        res.status(201).json({
            message: 'Taxi booked successfully',
            booking: user.taxiBookings[user.taxiBookings.length - 1]
        });
    } catch (error) {
        console.error('Taxi booking error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Taxi Bookings
app.get('/api/bookings/taxi', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id);

        res.status(200).json({ bookings: user.taxiBookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get All Bookings (Dashboard)
app.get('/api/bookings/all', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findById(decoded.id).select('-password');

        res.status(200).json({
            hotels: user.hotelBookings,
            restaurants: user.restaurantReservations,
            taxis: user.taxiBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running', timestamp: new Date() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
