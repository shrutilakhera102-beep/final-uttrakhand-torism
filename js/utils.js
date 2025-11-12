// ============ UTILITY FUNCTIONS FOR BETTER UX ============

// Toast Notification System
class ToastNotification {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        toast.style.cssText = `
            background: white;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideIn 0.3s ease-out;
            border-left: 4px solid ${colors[type]};
            min-width: 300px;
            max-width: 400px;
        `;

        toast.innerHTML = `
            <span style="font-size: 20px;">${icons[type]}</span>
            <span style="flex: 1; color: #1f2937; font-weight: 500;">${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #9ca3af;
                padding: 0;
                line-height: 1;
            ">×</button>
        `;

        this.container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    success(message, duration) { this.show(message, 'success', duration); }
    error(message, duration) { this.show(message, 'error', duration); }
    warning(message, duration) { this.show(message, 'warning', duration); }
    info(message, duration) { this.show(message, 'info', duration); }
}

// Initialize global toast
const toast = new ToastNotification();

// Add toast animations to document
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ LOADING OVERLAY ============
const LoadingOverlay = {
    show(message = 'Loading...') {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                backdrop-filter: blur(4px);
            `;
            overlay.innerHTML = `
                <div style="
                    background: white;
                    padding: 30px 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                ">
                    <div class="spinner" style="
                        width: 50px;
                        height: 50px;
                        border: 4px solid #e5e7eb;
                        border-top-color: #1B7A4E;
                        border-radius: 50%;
                        animation: spin 0.8s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <p id="loading-message" style="
                        color: #1f2937;
                        font-weight: 600;
                        font-size: 16px;
                        margin: 0;
                    ">${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
            
            // Add spinner animation
            if (!document.getElementById('spinner-style')) {
                const spinStyle = document.createElement('style');
                spinStyle.id = 'spinner-style';
                spinStyle.textContent = `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(spinStyle);
            }
        }
        overlay.style.display = 'flex';
        const messageEl = document.getElementById('loading-message');
        if (messageEl) messageEl.textContent = message;
    },

    hide() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
};

// ============ FORM VALIDATION ============
const FormValidator = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePhone(phone) {
        const re = /^[0-9]{10}$/;
        return re.test(phone.replace(/\D/g, ''));
    },

    validatePassword(password) {
        return {
            isValid: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[!@#$%^&*]/.test(password),
            length: password.length
        };
    },

    validateDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    },

    validateDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return end > start;
    }
};

// ============ DATE UTILITIES ============
const DateUtils = {
    formatDate(date) {
        const d = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return d.toLocaleDateString('en-IN', options);
    },

    formatDateTime(date) {
        const d = new Date(date);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        return d.toLocaleDateString('en-IN', dateOptions) + ' at ' + 
               d.toLocaleTimeString('en-IN', timeOptions);
    },

    getTodayString() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    },

    getTomorrowString() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    },

    getDateAfterDays(days) {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    },

    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// ============ LOCAL STORAGE UTILITIES ============
const StorageUtils = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// ============ CONFIRMATION DIALOG ============
const ConfirmDialog = {
    show(message, onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        overlay.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 400px;
                width: 90%;
            ">
                <h3 style="margin: 0 0 15px 0; color: #1f2937;">Confirm Action</h3>
                <p style="margin: 0 0 25px 0; color: #4b5563;">${message}</p>
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="cancel-btn" style="
                        padding: 10px 20px;
                        border: 2px solid #e5e7eb;
                        background: white;
                        color: #4b5563;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Cancel</button>
                    <button id="confirm-btn" style="
                        padding: 10px 20px;
                        border: none;
                        background: #1B7A4E;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                    ">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('confirm-btn').onclick = () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        };

        document.getElementById('cancel-btn').onclick = () => {
            overlay.remove();
            if (onCancel) onCancel();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                if (onCancel) onCancel();
            }
        };
    }
};

// ============ DEBOUNCE UTILITY ============
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============ SCROLL TO TOP SMOOTHLY ============
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ============ FORMAT CURRENCY ============
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// ============ TRUNCATE TEXT ============
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// ============ COPY TO CLIPBOARD ============
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
        return true;
    } catch (err) {
        toast.error('Failed to copy');
        return false;
    }
}

// ============ SHARE FUNCTIONALITY ============
async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            return true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
            return false;
        }
    } else {
        // Fallback: copy URL to clipboard
        await copyToClipboard(url);
        return false;
    }
}

// ============ EXPORT ALL UTILITIES ============
window.Utils = {
    toast,
    LoadingOverlay,
    FormValidator,
    DateUtils,
    StorageUtils,
    ConfirmDialog,
    debounce,
    scrollToTop,
    formatCurrency,
    truncateText,
    copyToClipboard,
    shareContent
};
