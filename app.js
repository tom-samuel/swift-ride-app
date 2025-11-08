// SwiftRide Premium JavaScript
class SwiftRideApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupAnimations();
        this.setupEventListeners();
        console.log('🚗 SwiftRide Premium initialized');
    }

    setupNavbar() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupAnimations() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .service-card');
        interactiveElements.forEach(el => {
            el.classList.add('hover-lift');
        });

        // Add ripple effects to buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-hero-primary');
        buttons.forEach(button => {
            button.classList.add('ripple');
        });
    }

    setupEventListeners() {
        // Download button handlers
        const downloadButtons = document.querySelectorAll('.store-btn, .btn-hero-primary');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDownloadModal();
            });
        });

        // Demo video handler
        const demoBtn = document.querySelector('.btn-hero-secondary');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.playDemoVideo();
            });
        }
    }

    showDownloadModal() {
        // Simple notification for demo
        this.showNotification('📱 Download starting soon...', 'success');
    }

    playDemoVideo() {
        this.showNotification('🎬 Demo video would play here', 'info');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} bounce-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00C851' : '#0066FF'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SwiftRideApp();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
