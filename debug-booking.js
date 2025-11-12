// Debug script to test booking directly
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/uttarakhand-guide')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ Connection error:', err));

// User Schema (same as server.js)
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    favorites: [String],
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function testBooking() {
    try {
        console.log('\n🔍 Checking existing users...');
        const users = await User.find();
        console.log(`Found ${users.length} users in database`);
        
        if (users.length > 0) {
            console.log('\n📋 User details:');
            users.forEach((user, index) => {
                console.log(`\nUser ${index + 1}:`);
                console.log(`  Email: ${user.email}`);
                console.log(`  Name: ${user.firstName} ${user.lastName}`);
                console.log(`  Hotel Bookings: ${user.hotelBookings.length}`);
                console.log(`  Restaurant Bookings: ${user.restaurantReservations.length}`);
                console.log(`  Taxi Bookings: ${user.taxiBookings.length}`);
                
                if (user.hotelBookings.length > 0) {
                    console.log('\n  📌 Hotel Bookings:');
                    user.hotelBookings.forEach((booking, i) => {
                        console.log(`    ${i + 1}. ${booking.hotelName} - ${booking.status}`);
                    });
                }
            });
            
            // Test adding a booking to first user
            console.log('\n\n🧪 Testing: Adding a hotel booking to first user...');
            const testUser = users[0];
            
            testUser.hotelBookings.push({
                hotelName: 'Debug Test Hotel',
                checkIn: new Date('2025-12-01'),
                checkOut: new Date('2025-12-05'),
                rooms: 2,
                guests: 4,
                price: 5000,
                bookingDate: new Date(),
                status: 'confirmed'
            });
            
            await testUser.save();
            console.log('✅ Booking added successfully!');
            console.log(`   Total hotel bookings now: ${testUser.hotelBookings.length}`);
            
        } else {
            console.log('\n⚠️  No users found. Creating a test user...');
            
            const hashedPassword = await bcrypt.hash('Test1234!', 10);
            const newUser = new User({
                firstName: 'Debug',
                lastName: 'User',
                email: 'debug@test.com',
                phone: '1234567890',
                password: hashedPassword,
                hotelBookings: [{
                    hotelName: 'Test Hotel Nainital',
                    checkIn: new Date('2025-12-01'),
                    checkOut: new Date('2025-12-05'),
                    rooms: 2,
                    guests: 4,
                    price: 5000,
                    bookingDate: new Date(),
                    status: 'confirmed'
                }]
            });
            
            await newUser.save();
            console.log('✅ Test user created with 1 hotel booking');
            console.log(`   Email: ${newUser.email}`);
            console.log(`   Password: Test1234!`);
        }
        
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the test
setTimeout(testBooking, 1000);
