// SwiftRide Dashboard JavaScript
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupRideSelection();
        this.setupBooking();
        this.setupQuickActions();
        console.log('🚗 Dashboard initialized');
    }

    setupRideSelection() {
        const rideOptions = document.querySelectorAll('.ride-option');
        
        rideOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                rideOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Update book button text
                const rideType = option.querySelector('.ride-name').textContent;
                const ridePrice = option.querySelector('.ride-price').textContent;
                this.updateBookButton(rideType, ridePrice);
                
                // Show confirmation
                this.showNotification(`Selected ${rideType} ride`, 'success');
            });
        });
    }

    updateBookButton(rideType, price) {
        const bookButton = document.querySelector('.book-ride-btn');
        if (bookButton) {
            bookButton.innerHTML = `
                <i class="fas fa-bolt"></i>
                Confirm ${rideType} Ride • ${price}
            `;
        }
    }

    setupBooking() {
        const bookButton = document.querySelector('.book-ride-btn');
        
        if (bookButton) {
            bookButton.addEventListener('click', () => {
                this.bookRide();
            });
        }
    }

    bookRide() {
        const activeRide = document.querySelector('.ride-option.active');
        const pickup = document.querySelector('.pickup .location-input').value;
        const destination = document.querySelector('.destination .location-input').value;
        
        if (!pickup || !destination) {
            this.showNotification('Please enter both pickup and destination locations', 'error');
            return;
        }

        const rideType = activeRide ? activeRide.querySelector('.ride-name').textContent : 'Swift';
        const price = activeRide ? activeRide.querySelector('.ride-price').textContent : '$12.50';
        
        // Show loading state
        const bookButton = document.querySelector('.book-ride-btn');
        bookButton.classList.add('loading');
        bookButton.disabled = true;

        // Simulate booking process
        this.showNotification(`🚗 Booking ${rideType} ride...`, 'info');
        
        setTimeout(() => {
            bookButton.classList.remove('loading');
            bookButton.disabled = false;
            
            this.showNotification(`✅ ${rideType} ride confirmed! Driver arriving in 2 minutes.`, 'success');
            
            // In a real app, this would redirect to ride tracking
            console.log(`Ride booked: ${pickup} → ${destination}, ${rideType}, ${price}`);
        }, 2000);
    }

    setupQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const actionText = card.querySelector('.action-text').textContent;
                this.showNotification(`📱 ${actionText} feature would open here`, 'info');
            });
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.dashboard-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `dashboard-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066FF'};
            color: white;
            padding: 12px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
            text-align: center;
            animation: slideInDown 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Add CSS animations for notifications
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideOutUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(dashboardStyles);
