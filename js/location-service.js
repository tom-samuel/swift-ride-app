// SwiftRide Location Service - Autocomplete & Geocoding
class LocationService {
    constructor() {
        this.searchResults = [];
        this.selectedLocation = null;
        this.init();
    }

    init() {
        this.setupSearchListeners();
        console.log('📍 Location Service initialized');
    }

    setupSearchListeners() {
        // Pickup location search
        const pickupInput = document.getElementById('pickupInput');
        const destinationInput = document.getElementById('destinationInput');

        if (pickupInput) {
            pickupInput.addEventListener('input', (e) => {
                this.handleLocationSearch(e.target.value, 'pickup');
            });
            
            pickupInput.addEventListener('focus', () => {
                this.showSearchResults('pickup');
            });
        }

        if (destinationInput) {
            destinationInput.addEventListener('input', (e) => {
                this.handleLocationSearch(e.target.value, 'destination');
            });
            
            destinationInput.addEventListener('focus', () => {
                this.showSearchResults('destination');
            });
        }

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.location-search-container')) {
                this.hideSearchResults();
            }
        });
    }

    async handleLocationSearch(query, type) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        try {
            const results = await this.searchLocations(query);
            this.displaySearchResults(results, type);
        } catch (error) {
            console.error('Location search error:', error);
            this.showFallbackResults(query, type);
        }
    }

    async searchLocations(query) {
        // Simulate API call to geocoding service
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockResults = this.generateMockResults(query);
                resolve(mockResults);
            }, 300);
        });
    }

    generateMockResults(query) {
        const locations = [
            {
                id: 1,
                name: 'Times Square',
                address: 'Manhattan, New York, NY',
                type: 'landmark',
                coordinates: [40.7580, -73.9855]
            },
            {
                id: 2,
                name: 'Central Park',
                address: 'Manhattan, New York, NY',
                type: 'park',
                coordinates: [40.7829, -73.9654]
            },
            {
                id: 3,
                name: 'Empire State Building',
                address: '350 5th Ave, New York, NY',
                type: 'landmark',
                coordinates: [40.7484, -73.9857]
            },
            {
                id: 4,
                name: 'Brooklyn Bridge',
                address: 'New York, NY 10038',
                type: 'landmark',
                coordinates: [40.7061, -73.9969]
            },
            {
                id: 5,
                name: 'JFK Airport',
                address: 'Queens, NY 11430',
                type: 'airport',
                coordinates: [40.6413, -73.7781]
            },
            {
                id: 6,
                name: 'LaGuardia Airport',
                address: 'Queens, NY 11371',
                type: 'airport',
                coordinates: [40.7769, -73.8740]
            },
            {
                id: 7,
                name: 'Wall Street',
                address: 'Manhattan, New York, NY',
                type: 'area',
                coordinates: [40.7074, -74.0113]
            },
            {
                id: 8,
                name: 'Grand Central Terminal',
                address: '89 E 42nd St, New York, NY',
                type: 'transit',
                coordinates: [40.7527, -73.9772]
            }
        ];

        // Filter based on query
        return locations.filter(location => 
            location.name.toLowerCase().includes(query.toLowerCase()) ||
            location.address.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6); // Limit to 6 results
    }

    displaySearchResults(results, type) {
        this.hideSearchResults();
        
        const inputElement = document.getElementById(type + 'Input');
        if (!inputElement) return;

        const searchContainer = this.createSearchContainer(type);
        const resultsList = document.createElement('div');
        resultsList.className = 'search-results-list';

        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="search-result-item no-results">
                    <i class="fas fa-search"></i>
                    <div class="result-info">
                        <div class="result-name">No locations found</div>
                        <div class="result-address">Try a different search term</div>
                    </div>
                </div>
            `;
        } else {
            results.forEach(result => {
                const resultElement = this.createResultElement(result, type);
                resultsList.appendChild(resultElement);
            });
        }

        searchContainer.appendChild(resultsList);
        inputElement.parentNode.appendChild(searchContainer);

        // Position the results dropdown
        this.positionSearchResults(searchContainer, inputElement);
    }

    createSearchContainer(type) {
        const container = document.createElement('div');
        container.className = `location-search-results ${type}-results`;
        container.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 0 0 10px 10px;
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            max-height: 300px;
            overflow-y: auto;
            border: 2px solid var(--primary);
            border-top: none;
        `;
        return container;
    }

    createResultElement(result, type) {
        const resultElement = document.createElement('div');
        resultElement.className = 'search-result-item';
        resultElement.innerHTML = `
            <i class="fas fa-${this.getLocationIcon(result.type)}"></i>
            <div class="result-info">
                <div class="result-name">${result.name}</div>
                <div class="result-address">${result.address}</div>
            </div>
        `;

        resultElement.addEventListener('click', () => {
            this.selectLocation(result, type);
        });

        return resultElement;
    }

    getLocationIcon(type) {
        const icons = {
            landmark: 'landmark',
            park: 'tree',
            airport: 'plane',
            transit: 'train',
            area: 'map-marker-alt'
        };
        return icons[type] || 'map-marker-alt';
    }

    positionSearchResults(container, inputElement) {
        const rect = inputElement.getBoundingClientRect();
        container.style.width = rect.width + 'px';
        container.style.top = (rect.height - 2) + 'px'; // Adjust for border
    }

    hideSearchResults() {
        const existingResults = document.querySelectorAll('.location-search-results');
        existingResults.forEach(result => result.remove());
    }

    selectLocation(location, type) {
        this.selectedLocation = location;
        
        // Update input field
        const inputElement = document.getElementById(type + 'Input');
        if (inputElement) {
            inputElement.value = location.name;
        }

        // Update map marker
        if (window.swiftRideMap) {
            if (type === 'pickup') {
                window.swiftRideMap.setPickupLocation(location.coordinates);
            } else if (type === 'destination') {
                window.swiftRideMap.setDestinationLocation(location.coordinates);
            }
        }

        this.hideSearchResults();

        // Show confirmation
        this.showNotification(`📍 ${type.toUpperCase()} set to ${location.name}`, 'success');

        // If both locations are set, calculate route
        if (this.bothLocationsSet()) {
            setTimeout(() => {
                if (window.swiftRideMap) {
                    window.swiftRideMap.calculateRoute();
                }
            }, 500);
        }
    }

    bothLocationsSet() {
        const pickupInput = document.getElementById('pickupInput');
        const destinationInput = document.getElementById('destinationInput');
        return pickupInput && pickupInput.value && destinationInput && destinationInput.value;
    }

    showFallbackResults(query, type) {
        const fallbackResults = [{
            id: 'current',
            name: 'Use Current Location',
            address: 'Detect your current position',
            type: 'current',
            coordinates: null
        }];
        this.displaySearchResults(fallbackResults, type);
    }

    showNotification(message, type) {
        if (window.swiftRideApp) {
            window.swiftRideApp.showNotification(message, type);
        }
    }

    // Method to get current location
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        name: 'Current Location',
                        address: 'Your current position'
                    };
                    resolve(location);
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }

    // Reverse geocoding - get address from coordinates
    async reverseGeocode(lat, lng) {
        // Simulate reverse geocoding API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const addresses = [
                    'Times Square, Manhattan, NY',
                    'Central Park, New York, NY',
                    'Empire State Building, NYC',
                    'Brooklyn Bridge, New York, NY'
                ];
                const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
                resolve(randomAddress);
            }, 500);
        });
    }
}

// Initialize location service
let locationService;
document.addEventListener('DOMContentLoaded', () => {
    locationService = new LocationService();
    window.locationService = locationService;
});
