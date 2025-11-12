// Test Twilio Configuration
// Run this file to verify your Twilio setup: node test-twilio.js

require('dotenv').config();
const twilio = require('twilio');

console.log('🔍 Testing Twilio Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Not set');
console.log('TWILIO_AUTH_TOKEN:', process.env.TWILIO_AUTH_TOKEN ? '✅ Set' : '❌ Not set');
console.log('TWILIO_PHONE_NUMBER:', process.env.TWILIO_PHONE_NUMBER || '❌ Not set');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('');

// Test Twilio client
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        console.log('✅ Twilio client initialized successfully!');
        console.log('');
        console.log('🎉 Your Twilio is configured correctly!');
        console.log('📱 You can now send OTP via SMS.');
        console.log('');
        console.log('💡 To test OTP login:');
        console.log('   1. Start server: node server.js');
        console.log('   2. Open: http://localhost:8000/html/login.html');
        console.log('   3. Click "Phone" tab');
        console.log('   4. Enter your phone number');
        console.log('   5. Check your phone for SMS!');
    } catch (error) {
        console.error('❌ Twilio initialization failed:', error.message);
        console.log('');
        console.log('🔧 Please check your credentials in .env file');
    }
} else {
    console.log('⚠️ Twilio not configured');
    console.log('');
    console.log('📝 To configure Twilio:');
    console.log('   1. Sign up at https://www.twilio.com/try-twilio');
    console.log('   2. Get your Account SID and Auth Token');
    console.log('   3. Get a Twilio phone number');
    console.log('   4. Update .env file with your credentials');
    console.log('');
    console.log('💡 Without Twilio:');
    console.log('   - OTP will be shown in server console');
    console.log('   - OTP will be in API response (dev mode)');
    console.log('   - Perfect for testing!');
}

console.log('');
console.log('✅ Test complete!');
