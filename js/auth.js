// Enhanced Authentication & Booking Handler with MongoDB Integration

const API_URL = 'http://localhost:5000/api';

// ============ SESSION MANAGEMENT ============
function checkUserLogin() {
    const token = localStorage.getItem('token');
    return token ? true : false;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function saveUserSession(user, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

function clearUserSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// ============ PAGE PROTECTION ============
function protectPage() {
    if (!checkUserLogin()) {
        alert('Please login to access this page');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ============ LOGIN HANDLER ============
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember')?.checked || false;
        
        const errorMsg = document.getElementById('errorMessage');
        const successMsg = document.getElementById('successMessage');
        const loading = document.getElementById('loading');
        const submitBtn = document.getElementById('submitBtn');
        
        if (errorMsg) errorMsg.classList.remove('show');
        if (successMsg) successMsg.classList.remove('show');
        if (errorMsg) errorMsg.textContent = '';
        if (successMsg) successMsg.textContent = '';
        
        if (!email || !password) {
            if (errorMsg) {
                errorMsg.textContent = 'Please fill in all fields';
                errorMsg.classList.add('show');
            }
            return;
        }
        
        if (!validateEmail(email)) {
            if (errorMsg) {
                errorMsg.textContent = 'Please enter a valid email address';
                errorMsg.classList.add('show');
            }
            return;
        }
        
        if (loading) loading.style.display = 'block';
        if (submitBtn) submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                saveUserSession(data.user, data.token);
                if (successMsg) {
                    successMsg.textContent = 'Login successful! Redirecting...';
                    successMsg.classList.add('show');
                }
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            if (errorMsg) {
                errorMsg.textContent = error.message || 'An error occurred. Please try again.';
                errorMsg.classList.add('show');
            }
        } finally {
            if (loading) loading.style.display = 'none';
            if (submitBtn) submitBtn.disabled = false;
        }
    });
}

// ============ REGISTER HANDLER ============
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    // Password strength indicator
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            const strength = calculatePasswordStrength(e.target.value);
            updatePasswordStrengthUI(strength, strengthBar, strengthText);
        });
    }
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        const errorMsg = document.getElementById('errorMessage');
        const successMsg = document.getElementById('successMessage');
        const loading = document.getElementById('loading');
        const submitBtn = document.getElementById('submitBtn');
        
        // Clear previous messages
        errorMsg.classList.remove('show');
        successMsg.classList.remove('show');
        errorMsg.textContent = '';
        successMsg.textContent = '';
        
        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            errorMsg.textContent = 'Please fill in all required fields';
            errorMsg.classList.add('show');
            return;
        }
        
        if (!validateEmail(email)) {
            errorMsg.textContent = 'Please enter a valid email address';
            errorMsg.classList.add('show');
            return;
        }
        
        if (password.length < 8) {
            errorMsg.textContent = 'Password must be at least 8 characters long';
            errorMsg.classList.add('show');
            return;
        }
        
        if (password !== confirmPassword) {
            errorMsg.textContent = 'Passwords do not match';
            errorMsg.classList.add('show');
            return;
        }
        
        if (!terms) {
            errorMsg.textContent = 'Please accept the Terms and Conditions';
            errorMsg.classList.add('show');
            return;
        }
        
        // Show loading state
        loading.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            // API call to backend
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                successMsg.textContent = 'Account created successfully! Redirecting to login...';
                successMsg.classList.add('show');
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            errorMsg.textContent = error.message || 'An error occurred. Please try again.';
            errorMsg.classList.add('show');
        } finally {
            loading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// ============ UTILITY FUNCTIONS ============

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Update password strength UI
function updatePasswordStrengthUI(strength, strengthBar, strengthText) {
    const strengthLevels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent'];
    const strengthColors = ['#c33', '#ff9800', '#ffc107', '#8bc34a', '#4caf50', '#2e7d32'];
    
    const percentage = (strength / 6) * 100;
    strengthBar.style.width = percentage + '%';
    strengthBar.style.background = strengthColors[Math.max(0, strength - 1)];
    strengthText.textContent = `Password strength: ${strengthLevels[Math.max(0, strength - 1)]}`;
}

// Logout function
function logout() {
    clearUserSession();
    window.location.href = 'login.html';
}

// Update header with user info if logged in
function updateHeaderWithUserInfo() {
    const user = getCurrentUser();
    if (user) {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            const userLi = document.createElement('li');
            userLi.innerHTML = `
                <a href="#user-menu" class="user-menu-trigger">
                    <i class="fas fa-user-circle"></i> ${user.firstName}
                </a>
                <ul class="user-dropdown" style="display: none;">
                    <li><a href="dashboard.html">Dashboard</a></li>
                    <li><a href="profile.html">My Profile</a></li>
                    <li><a href="mybookings.html">My Bookings</a></li>
                    <li><a href="favorites.html">Favorites</a></li>
                    <li><hr style="margin: 10px 0; border: none; border-top: 1px solid #e0e0e0;"></li>
                    <li><a href="#" onclick="logout(); return false;">Logout</a></li>
                </ul>
            `;
            navMenu.appendChild(userLi);
            
            // Toggle user dropdown
            const userTrigger = userLi.querySelector('.user-menu-trigger');
            const userDropdown = userLi.querySelector('.user-dropdown');
            
            userTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                userDropdown.style.display = userDropdown.style.display === 'none' ? 'block' : 'none';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userLi.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderWithUserInfo();
});

// ============ HOTEL BOOKING ============
async function bookHotel(hotelData) {
    if (!checkUserLogin()) {
        alert('Please login to book a hotel');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings/hotel`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(hotelData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Hotel booked successfully!');
            return true;
        } else {
            throw new Error(data.message || 'Booking failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function getHotelBookings() {
    if (!checkUserLogin()) return [];
    
    try {
        const response = await fetch(`${API_URL}/bookings/hotel`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        console.log('Hotel bookings response:', data);
        
        if (response.ok) {
            return data.bookings || [];
        } else {
            console.error('Error fetching bookings:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
    }
}

// ============ RESTAURANT BOOKING ============
async function bookRestaurant(restaurantData) {
    if (!checkUserLogin()) {
        alert('Please login to make a reservation');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings/restaurant`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(restaurantData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Restaurant reservation confirmed!');
            return true;
        } else {
            throw new Error(data.message || 'Reservation failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function getRestaurantBookings() {
    if (!checkUserLogin()) return [];
    
    try {
        const response = await fetch(`${API_URL}/bookings/restaurant`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        console.log('Restaurant bookings response:', data);
        
        if (response.ok) {
            return data.bookings || [];
        } else {
            console.error('Error fetching reservations:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

// ============ TAXI BOOKING ============
async function bookTaxi(taxiData) {
    if (!checkUserLogin()) {
        alert('Please login to book a taxi');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const response = await fetch(`${API_URL}/bookings/taxi`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(taxiData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Taxi booked successfully!');
            return true;
        } else {
            throw new Error(data.message || 'Booking failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
        return false;
    }
}

async function getTaxiBookings() {
    if (!checkUserLogin()) return [];
    
    try {
        const response = await fetch(`${API_URL}/bookings/taxi`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        console.log('Taxi bookings response:', data);
        
        if (response.ok) {
            return data.bookings || [];
        } else {
            console.error('Error fetching taxi bookings:', data.message);
            return [];
        }
    } catch (error) {
        console.error('Error fetching taxi bookings:', error);
        return [];
    }
}

// ============ GET ALL BOOKINGS (DASHBOARD) ============
async function getAllBookings() {
    if (!checkUserLogin()) return null;
    
    try {
        const response = await fetch(`${API_URL}/bookings/all`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        
        const data = await response.json();
        return response.ok ? data : null;
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        return null;
    }
}
