// Enhanced Booking System with Better UX
// Requires: utils.js, auth.js

const API_URL = 'http://localhost:5000/api';

// ============ ENHANCED HOTEL BOOKING ============
async function bookHotelEnhanced(hotelData) {
    // Check login
    if (!checkUserLogin()) {
        Utils.toast.warning('Please login to book a hotel');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return false;
    }

    // Validate data
    const validation = validateHotelBooking(hotelData);
    if (!validation.isValid) {
        Utils.toast.error(validation.message);
        return false;
    }

    // Show loading
    Utils.LoadingOverlay.show('Booking your hotel...');

    try {
        const response = await fetch(`${API_URL}/bookings/hotel`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(hotelData)
        });

        const data = await response.json();

        if (response.ok) {
            Utils.LoadingOverlay.hide();
            Utils.toast.success('Hotel booked successfully! 🎉');
            
            // Show booking confirmation
            showBookingConfirmation('hotel', data.booking);
            return true;
        } else {
            throw new Error(data.message || 'Booking failed');
        }
    } catch (error) {
        Utils.LoadingOverlay.hide();
        Utils.toast.error('Booking failed: ' + error.message);
        return false;
    }
}

// ============ ENHANCED RESTAURANT BOOKING ============
async function bookRestaurantEnhanced(restaurantData) {
    if (!checkUserLogin()) {
        Utils.toast.warning('Please login to make a reservation');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return false;
    }

    const validation = validateRestaurantBooking(restaurantData);
    if (!validation.isValid) {
        Utils.toast.error(validation.message);
        return false;
    }

    Utils.LoadingOverlay.show('Making your reservation...');

    try {
        const response = await fetch(`${API_URL}/bookings/restaurant`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(restaurantData)
        });

        const data = await response.json();

        if (response.ok) {
            Utils.LoadingOverlay.hide();
            Utils.toast.success('Restaurant reservation confirmed! 🍽️');
            showBookingConfirmation('restaurant', data.booking);
            return true;
        } else {
            throw new Error(data.message || 'Reservation failed');
        }
    } catch (error) {
        Utils.LoadingOverlay.hide();
        Utils.toast.error('Reservation failed: ' + error.message);
        return false;
    }
}

// ============ ENHANCED TAXI BOOKING ============
async function bookTaxiEnhanced(taxiData) {
    if (!checkUserLogin()) {
        Utils.toast.warning('Please login to book a taxi');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return false;
    }

    const validation = validateTaxiBooking(taxiData);
    if (!validation.isValid) {
        Utils.toast.error(validation.message);
        return false;
    }

    Utils.LoadingOverlay.show('Booking your taxi...');

    try {
        const response = await fetch(`${API_URL}/bookings/taxi`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(taxiData)
        });

        const data = await response.json();

        if (response.ok) {
            Utils.LoadingOverlay.hide();
            Utils.toast.success('Taxi booked successfully! 🚕');
            showBookingConfirmation('taxi', data.booking);
            return true;
        } else {
            throw new Error(data.message || 'Booking failed');
        }
    } catch (error) {
        Utils.LoadingOverlay.hide();
        Utils.toast.error('Booking failed: ' + error.message);
        return false;
    }
}

// ============ VALIDATION FUNCTIONS ============
function validateHotelBooking(data) {
    if (!data.hotelName || data.hotelName.trim() === '') {
        return { isValid: false, message: 'Please enter hotel name' };
    }
    if (!data.checkIn) {
        return { isValid: false, message: 'Please select check-in date' };
    }
    if (!data.checkOut) {
        return { isValid: false, message: 'Please select check-out date' };
    }
    if (!Utils.FormValidator.validateDate(data.checkIn)) {
        return { isValid: false, message: 'Check-in date must be today or later' };
    }
    if (!Utils.FormValidator.validateDateRange(data.checkIn, data.checkOut)) {
        return { isValid: false, message: 'Check-out must be after check-in' };
    }
    if (!data.rooms || data.rooms < 1) {
        return { isValid: false, message: 'Please select at least 1 room' };
    }
    if (!data.guests || data.guests < 1) {
        return { isValid: false, message: 'Please select at least 1 guest' };
    }
    return { isValid: true };
}

function validateRestaurantBooking(data) {
    if (!data.restaurantName || data.restaurantName.trim() === '') {
        return { isValid: false, message: 'Please enter restaurant name' };
    }
    if (!data.date) {
        return { isValid: false, message: 'Please select date' };
    }
    if (!data.time) {
        return { isValid: false, message: 'Please select time' };
    }
    if (!Utils.FormValidator.validateDate(data.date)) {
        return { isValid: false, message: 'Reservation date must be today or later' };
    }
    if (!data.guests || data.guests < 1) {
        return { isValid: false, message: 'Please select at least 1 guest' };
    }
    return { isValid: true };
}

function validateTaxiBooking(data) {
    if (!data.pickupLocation || data.pickupLocation.trim() === '') {
        return { isValid: false, message: 'Please enter pickup location' };
    }
    if (!data.dropLocation || data.dropLocation.trim() === '') {
        return { isValid: false, message: 'Please enter drop location' };
    }
    if (!data.date) {
        return { isValid: false, message: 'Please select date' };
    }
    if (!data.time) {
        return { isValid: false, message: 'Please select time' };
    }
    if (!Utils.FormValidator.validateDate(data.date)) {
        return { isValid: false, message: 'Booking date must be today or later' };
    }
    if (!data.vehicleType) {
        return { isValid: false, message: 'Please select vehicle type' };
    }
    return { isValid: true };
}

// ============ BOOKING CONFIRMATION MODAL ============
function showBookingConfirmation(type, booking) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    `;

    let content = '';
    
    if (type === 'hotel') {
        const nights = Utils.DateUtils.daysBetween(booking.checkIn, booking.checkOut);
        content = `
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                        ✓
                    </div>
                    <h2 style="color: #1f2937; margin: 0 0 10px 0;">Booking Confirmed!</h2>
                    <p style="color: #6b7280; margin: 0;">Your hotel reservation has been confirmed</p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Booking Details</h3>
                    <div style="display: grid; gap: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Hotel:</span>
                            <strong style="color: #1f2937;">${booking.hotelName}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Check-in:</span>
                            <strong style="color: #1f2937;">${Utils.DateUtils.formatDate(booking.checkIn)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Check-out:</span>
                            <strong style="color: #1f2937;">${Utils.DateUtils.formatDate(booking.checkOut)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Duration:</span>
                            <strong style="color: #1f2937;">${nights} night${nights > 1 ? 's' : ''}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Rooms:</span>
                            <strong style="color: #1f2937;">${booking.rooms}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Guests:</span>
                            <strong style="color: #1f2937;">${booking.guests}</strong>
                        </div>
                        ${booking.price ? `
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #e5e7eb; margin-top: 10px;">
                            <span style="color: #1f2937; font-weight: 600;">Total:</span>
                            <strong style="color: #10b981; font-size: 20px;">${Utils.formatCurrency(booking.price)}</strong>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.location.href='mybookings.html'" style="flex: 1; padding: 12px; background: #1B7A4E; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        View Bookings
                    </button>
                    <button onclick="this.closest('[style*=fixed]').remove()" style="flex: 1; padding: 12px; background: #f3f4f6; color: #1f2937; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
    } else if (type === 'restaurant') {
        content = `
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                        🍽️
                    </div>
                    <h2 style="color: #1f2937; margin: 0 0 10px 0;">Reservation Confirmed!</h2>
                    <p style="color: #6b7280; margin: 0;">Your table has been reserved</p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Reservation Details</h3>
                    <div style="display: grid; gap: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Restaurant:</span>
                            <strong style="color: #1f2937;">${booking.restaurantName}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Date:</span>
                            <strong style="color: #1f2937;">${Utils.DateUtils.formatDate(booking.date)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Time:</span>
                            <strong style="color: #1f2937;">${booking.time}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Guests:</span>
                            <strong style="color: #1f2937;">${booking.guests}</strong>
                        </div>
                        ${booking.cuisine ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Cuisine:</span>
                            <strong style="color: #1f2937;">${booking.cuisine}</strong>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.location.href='mybookings.html'" style="flex: 1; padding: 12px; background: #f59e0b; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        View Bookings
                    </button>
                    <button onclick="this.closest('[style*=fixed]').remove()" style="flex: 1; padding: 12px; background: #f3f4f6; color: #1f2937; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
    } else if (type === 'taxi') {
        content = `
            <div style="background: white; padding: 40px; border-radius: 20px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #2563eb); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                        🚕
                    </div>
                    <h2 style="color: #1f2937; margin: 0 0 10px 0;">Taxi Booked!</h2>
                    <p style="color: #6b7280; margin: 0;">Your ride has been confirmed</p>
                </div>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">📋 Booking Details</h3>
                    <div style="display: grid; gap: 10px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">From:</span>
                            <strong style="color: #1f2937;">${booking.pickupLocation}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">To:</span>
                            <strong style="color: #1f2937;">${booking.dropLocation}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Date:</span>
                            <strong style="color: #1f2937;">${Utils.DateUtils.formatDate(booking.date)}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Time:</span>
                            <strong style="color: #1f2937;">${booking.time}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Vehicle:</span>
                            <strong style="color: #1f2937;">${booking.vehicleType}</strong>
                        </div>
                        ${booking.distance ? `
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280;">Distance:</span>
                            <strong style="color: #1f2937;">${booking.distance}</strong>
                        </div>
                        ` : ''}
                        ${booking.estimatedPrice ? `
                        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #e5e7eb; margin-top: 10px;">
                            <span style="color: #1f2937; font-weight: 600;">Estimated Fare:</span>
                            <strong style="color: #3b82f6; font-size: 20px;">${Utils.formatCurrency(booking.estimatedPrice)}</strong>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.location.href='mybookings.html'" style="flex: 1; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        View Bookings
                    </button>
                    <button onclick="this.closest('[style*=fixed]').remove()" style="flex: 1; padding: 12px; background: #f3f4f6; color: #1f2937; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;
    }

    modal.innerHTML = content;
    document.body.appendChild(modal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============ SET MINIMUM DATES FOR DATE INPUTS ============
function initializeDateInputs() {
    const today = Utils.DateUtils.getTodayString();
    const tomorrow = Utils.DateUtils.getTomorrowString();

    // Set minimum dates for all date inputs
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.hasAttribute('min')) {
            input.setAttribute('min', today);
        }
    });

    // Handle check-in/check-out date logic for hotels
    const checkInInput = document.getElementById('checkin') || document.getElementById('hotelCheckIn');
    const checkOutInput = document.getElementById('checkout') || document.getElementById('hotelCheckOut');

    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', () => {
            const checkInDate = checkInInput.value;
            if (checkInDate) {
                const nextDay = new Date(checkInDate);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutInput.setAttribute('min', nextDay.toISOString().split('T')[0]);
                
                // If checkout is before new minimum, clear it
                if (checkOutInput.value && checkOutInput.value <= checkInDate) {
                    checkOutInput.value = '';
                }
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeDateInputs);
