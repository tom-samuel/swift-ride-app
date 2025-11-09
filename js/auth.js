// SwiftRide Authentication JavaScript
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPasswordToggle();
        this.setupFormValidation();
        this.setupSignupForm();
        this.setupSocialLogin();
        console.log('🔐 Auth Manager initialized');
    }

    // Password visibility toggle
    setupPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.password-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const passwordInput = button.parentElement.querySelector('.input-field');
                const icon = button.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                    button.setAttribute('aria-label', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                    button.setAttribute('aria-label', 'Show password');
                }
                
                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Form validation and submission
    setupFormValidation() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // Real-time validation
            const inputs = loginForm.querySelectorAll('.input-field');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            });
        }
    }

    // Sign Up specific functionality
    setupSignupForm() {
        const signupForm = document.getElementById('signupForm');
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });

            // Password strength indicator
            const passwordInput = document.getElementById('password');
            if (passwordInput) {
                passwordInput.addEventListener('input', () => {
                    this.updatePasswordStrength(passwordInput.value);
                });
            }

            // Confirm password validation
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', () => {
                    this.validatePasswordMatch();
                });
            }

            // Real-time validation for all inputs
            const inputs = signupForm.querySelectorAll('.input-field');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateSignupField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearError(input);
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const container = field.parentElement;
        
        // Remove any existing error
        this.clearError(field);
        
        if (!value) {
            this.showError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && !this.isValidEmail(value)) {
            this.showError(field, 'Please enter a valid email address');
            return false;
        }
        
        if (field.type === 'password' && value.length < 6) {
            this.showError(field, 'Password must be at least 6 characters');
            return false;
        }
        
        return true;
    }

    updatePasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-value');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let feedback = 'Weak';

        // Length check
        if (password.length >= 8) strength++;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength++;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;
        
        // Number check
        if (/[0-9]/.test(password)) strength++;
        
        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Cap strength at 4
        strength = Math.min(strength, 4);

        // Update UI
        strengthBar.setAttribute('data-strength', strength - 1);
        
        switch(strength) {
            case 1:
                feedback = 'Weak';
                strengthText.className = 'strength-value weak';
                break;
            case 2:
                feedback = 'Medium';
                strengthText.className = 'strength-value medium';
                break;
            case 3:
                feedback = 'Strong';
                strengthText.className = 'strength-value strong';
                break;
            case 4:
                feedback = 'Very Strong';
                strengthText.className = 'strength-value very-strong';
                break;
            default:
                feedback = 'Weak';
                strengthText.className = 'strength-value weak';
        }

        strengthText.textContent = feedback;
    }

    validatePasswordMatch() {
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!password || !confirmPassword) return;

        if (confirmPassword.value && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
        } else {
            this.clearError(confirmPassword);
            if (confirmPassword.value && password.value === confirmPassword.value) {
                this.showFieldSuccess(confirmPassword);
            }
        }
    }

    validateSignupField(field) {
        const value = field.value.trim();
        
        // Remove any existing error
        this.clearError(field);
        
        if (!value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        switch(field.type) {
            case 'email':
                if (!this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'tel':
                if (!this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'password':
                if (field.id === 'password' && value.length < 8) {
                    this.showFieldError(field, 'Password must be at least 8 characters');
                    return false;
                }
                break;
        }
        
        this.showFieldSuccess(field);
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    showError(field, message) {
        const container = field.parentElement;
        container.classList.add('error');
        
        // Remove existing error message
        const existingError = container.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        container.parentElement.appendChild(errorElement);
    }

    showFieldError(field, message) {
        const container = field.parentElement;
        container.classList.add('error');
        container.classList.remove('success');
        
        // Remove existing error message
        const existingError = container.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        container.parentElement.appendChild(errorElement);
    }

    showFieldSuccess(field) {
        const container = field.parentElement;
        container.classList.add('success');
        container.classList.remove('error');
        
        // Remove any error message
        const errorMessage = container.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    clearError(field) {
        const container = field.parentElement;
        container.classList.remove('error');
        container.classList.remove('success');
        
        const errorMessage = container.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Login handling
    async handleLogin() {
        const form = document.getElementById('loginForm');
        const submitBtn = form.querySelector('.auth-submit-btn');
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate all fields
        let isValid = true;
        const inputs = form.querySelectorAll('.input-field');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateLogin({ email, password, rememberMe });
            
            this.showNotification('🎉 Login successful! Redirecting...', 'success');
            
            // Simulate redirect
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setLoadingState(submitBtn, false);
        }
    }

    simulateLogin(credentials) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo validation - in real app, this would be API call
                if (credentials.email === 'demo@swiftride.com' && credentials.password === 'password') {
                    resolve({ success: true, user: { name: 'Demo User', email: credentials.email } });
                } else {
                    reject(new Error('Invalid email or password. Try demo@swiftride.com / password'));
                }
            }, 1000);
        });
    }

    async handleSignup() {
        const form = document.getElementById('signupForm');
        const submitBtn = form.querySelector('.auth-submit-btn');
        const formData = {
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            acceptTerms: document.getElementById('acceptTerms').checked,
            marketingConsent: document.getElementById('marketingConsent').checked
        };

        // Validate all fields
        let isValid = true;
        const inputs = form.querySelectorAll('.input-field');
        inputs.forEach(input => {
            if (!this.validateSignupField(input)) {
                isValid = false;
            }
        });

        // Special validation for password match
        if (formData.password !== formData.confirmPassword) {
            this.showFieldError(document.getElementById('confirmPassword'), 'Passwords do not match');
            isValid = false;
        }

        // Validate terms acceptance
        if (!formData.acceptTerms) {
            this.showNotification('Please accept the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }

        if (!isValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(submitBtn, true);

        try {
            // Simulate API call
            await this.simulateSignup(formData);
            
            this.showNotification('🎉 Account created successfully! Redirecting...', 'success');
            
            // Simulate redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setLoadingState(submitBtn, false);
        }
    }

    simulateSignup(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo validation - in real app, this would be API call
                if (userData.email && userData.password.length >= 8) {
                    resolve({ 
                        success: true, 
                        user: { 
                            name: userData.fullName, 
                            email: userData.email,
                            phone: userData.phone
                        } 
                    });
                } else {
                    reject(new Error('Please check your information and try again'));
                }
            }, 1500);
        });
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Social login handlers
    setupSocialLogin() {
        const googleBtn = document.querySelector('.google-btn');
        const appleBtn = document.querySelector('.apple-btn');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                this.handleSocialLogin('google');
            });
        }
        
        if (appleBtn) {
            appleBtn.addEventListener('click', () => {
                this.handleSocialLogin('apple');
            });
        }
    }

    handleSocialLogin(provider) {
        this.showNotification(`🔐 ${provider.charAt(0).toUpperCase() + provider.slice(1)} login would open here`, 'info');
        
        // Simulate social login process
        setTimeout(() => {
            this.showNotification(`✅ ${provider.charAt(0).toUpperCase() + provider.slice(1)} login successful!`, 'success');
            
            // Redirect after social login
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 1500);
    }

    // Notification system
    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.auth-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `auth-notification auth-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);

        // Add close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        notification.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Add CSS for notifications (inject into page)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .auth-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #1f2937;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #0066FF;
        z-index: 10000;
        max-width: 350px;
        animation: slideInDown 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #e5e7eb;
    }
    
    .auth-notification-success {
        border-left-color: #10b981;
    }
    
    .auth-notification-error {
        border-left-color: #ef4444;
    }
    
    .auth-notification-info {
        border-left-color: #0066FF;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
    }
    
    .notification-content i {
        font-size: 1.1rem;
    }
    
    .auth-notification-success .notification-content i {
        color: #10b981;
    }
    
    .auth-notification-error .notification-content i {
        color: #ef4444;
    }
    
    .auth-notification-info .notification-content i {
        color: #0066FF;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .notification-close:hover {
        color: #374151;
        background: #f3f4f6;
    }
    
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    /* Enhanced loading animation */
    .auth-submit-btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid #ffffff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(notificationStyles);
