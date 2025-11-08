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
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .ride-option');
        interactiveElements.forEach(el => {
            el.classList.add('hover-lift');
        });

        const buttons = document.querySelectorAll('.btn-primary, .btn-hero-primary, .book-ride-btn');
        buttons.forEach(button => {
            button.classList.add('ripple');
        });
    }

    setupEventListeners() {
        const downloadButtons = document.querySelectorAll('.store-btn, .btn-hero-primary');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDownloadModal();
            });
        });

        const demoBtn = document.querySelector('.btn-hero-secondary');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.playDemoVideo();
            });
        }

        const rideOptions = document.querySelectorAll('.ride-option');
        rideOptions.forEach(option => {
            option.addEventListener('click', () => {
                rideOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const rideType = option.querySelector('strong').textContent;
                this.showNotification(`Selected ${rideType} ride`, 'success');
            });
        });

        const bookBtn = document.querySelector('.book-ride-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                this.bookRide();
            });
        }
    }

    showDownloadModal() {
        this.showNotification('📱 Download starting soon...', 'success');
    }

    playDemoVideo() {
        this.showNotification('🎬 Demo video would play here', 'info');
    }

    bookRide() {
        const activeRide = document.querySelector('.ride-option.active');
        const rideType = activeRide ? activeRide.querySelector('strong').textContent : 'Swift';
        
        this.showNotification(`🚗 Booking ${rideType} ride...`, 'success');
        
        setTimeout(() => {
            this.showNotification(`✅ ${rideType} ride booked! Driver arriving in 2 minutes.`, 'success');
        }, 1500);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} bounce-in`;
        notification.innerHTML = `<div class="notification-content">${message}</div>`;
        
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

        setTimeout(() => {
            notification.style.animation = 'fadeInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SwiftRideApp();
});

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
