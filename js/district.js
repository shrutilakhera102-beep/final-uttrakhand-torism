// Districts Data
const districtsData = [
    {
        id: 1,
        name: "Dehradun",
        category: "hill",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        touristPlace: "Sahasradhara",
        description: "Capital city known for its pleasant climate and educational institutions.",
        spots: ["Robber's Cave", "Sahastradhara", "Mindrolling Monastery", "Tapkeshwar Temple"],
        bestTime: "March to June, September to November",
        entryFees: "Most attractions: ₹20-₹100",
        hotels: ["JW Marriott", "Lemon Tree", "Monal Resort"],
        restaurants: ["Kalsang", "Black Pepper", "Orchid"],
        transport: "Taxis available throughout the city, bus service to all major destinations"
    },
    {
        id: 2,
        name: "Haridwar",
        category: "pilgrimage",
        image: "https://images.unsplash.com/photo-1585268341612-d0645b0b0a73?w=800&h=600&fit=crop",
        touristPlace: "Har Ki Pauri",
        description: "One of the seven holiest places in Hinduism, located on the banks of Ganga.",
        spots: ["Har Ki Pauri", "Mansa Devi Temple", "Chandi Devi Temple", "Ganga Aarti"],
        bestTime: "October to March",
        entryFees: "Temples: ₹50-₹200 (including cable car)",
        hotels: ["Haveli Hari Ganga", "Ganga Lahari", "SRS Lakshya"],
        restaurants: ["Hoshiyar Puri", "Chotiwala", "Dada Boudir Hotel"],
        transport: "Auto-rickshaws, cycle rickshaws, taxis available"
    },
    {
        id: 3,
        name: "Nainital",
        category: "hill",
        image: "https://images.unsplash.com/photo-1537325387374-cc028cfc7cb2?w=800&h=600&fit=crop",
        touristPlace: "Naini Lake",
        description: "Famous for its beautiful lake and panoramic views of the Himalayas.",
        spots: ["Naini Lake", "Snow View Point", "Eco Cave Garden", "Naina Devi Temple"],
        bestTime: "March to June, September to November",
        entryFees: "Boating: ₹150-₹500, Cable car: ₹200",
        hotels: ["The Naini Retreat", "Shervani Hilltop", "Alka Hotel"],
        restaurants: ["Embassy", "Machan", "Sonam's"],
        transport: "Shared taxis, private taxis, boating in the lake"
    },
    {
        id: 4,
        name: "Rishikesh",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=800&h=600&fit=crop",
        touristPlace: "Laxman Jhula",
        description: "Yoga capital of the world and gateway to the Garhwal Himalayas.",
        spots: ["Laxman Jhula", "Ram Jhula", "The Beatles Ashram", "White Water Rafting"],
        bestTime: "September to November, February to May",
        entryFees: "Rafting: ₹1500-₹2500, Yoga classes: ₹500-₹2000",
        hotels: ["Aloha on the Ganges", "Ganga Kinare", "Divine Ganga Cottage"],
        restaurants: ["Little Buddha Cafe", "German Bakery", "Chotiwala"],
        transport: "Auto-rickshaws, taxis, shared jeeps to nearby areas"
    },
    {
        id: 5,
        name: "Mussoorie",
        category: "hill",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop",
        touristPlace: "Kempty Falls",
        description: "Queen of Hills offering breathtaking views of the Himalayan ranges.",
        spots: ["Kempty Falls", "Gun Hill", "Camel's Back Road", "Lal Tibba"],
        bestTime: "March to June, September to November",
        entryFees: "Cable car: ₹200, Kempty Falls: ₹50",
        hotels: ["JW Marriott", "Sterling Resort", "Hotel Padmini Nivas"],
        restaurants: ["Kalsang", "Lovely Omelette Centre", "Clock Tower Cafe"],
        transport: "Taxis, shared jeeps, cable car, walking is popular"
    },
    {
        id: 6,
        name: "Almora",
        category: "hill",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        touristPlace: "Kasar Devi Temple",
        description: "Cultural hub of Kumaon region with rich heritage and temples.",
        spots: ["Kasar Devi Temple", "Bright End Corner", "Jageshwar Temples", "Binsar Wildlife Sanctuary"],
        bestTime: "March to June, September to November",
        entryFees: "Binsar Sanctuary: ₹150, Jageshwar: ₹50",
        hotels: ["Kasaar Jungle Resort", "Kalmatia Sangam", "Deodar Resort"],
        restaurants: ["Laxmi", "Snow View", "Kumaon Restaurant"],
        transport: "Taxis, shared jeeps, local buses"
    },
    {
        id: 7,
        name: "Chamoli",
        category: "pilgrimage",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        touristPlace: "Valley of Flowers National Park",
        description: "Home to the Valley of Flowers and Hemkund Sahib.",
        spots: ["Valley of Flowers", "Hemkund Sahib", "Auli", "Badrinath Temple"],
        bestTime: "May to October (Valley of Flowers: July-September)",
        entryFees: "Valley of Flowers: ₹150, Auli ropeway: ₹700",
        hotels: ["GMVN Tourist Bungalow", "Hotel Mount View", "Snow Crest"],
        restaurants: ["Local dhabas", "GMVN Restaurant", "Hotel Mount View Restaurant"],
        transport: "Shared jeeps, taxis, ropeway in Auli"
    },
    {
        id: 8,
        name: "Pithoragarh",
        category: "hill",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        touristPlace: "Khaliya Bugyal",
        description: "Known as 'Little Kashmir' for its stunning natural beauty.",
        spots: ["Pithoragarh Fort", "Chandak", "Dharchula", "Narayan Ashram"],
        bestTime: "March to June, September to November",
        entryFees: "Most attractions: Free or minimal charges",
        hotels: ["Hotel Anand", "GMVN Tourist Rest House", "Milan Hotel"],
        restaurants: ["Local eateries", "Hotel Anand Restaurant", "GMVN Restaurant"],
        transport: "Taxis, shared jeeps, limited bus service"
    },
    {
        id: 9,
        name: "Udham Singh Nagar",
        category: "wildlife",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        touristPlace: "Corbett National Park",
        description: "Agricultural hub with wildlife sanctuaries and industrial areas.",
        spots: ["Corbett National Park", "Nanakmatta Gurudwara", "Khatima", "Kashipur"],
        bestTime: "November to June",
        entryFees: "Corbett National Park: ₹200-₹5000 (varies by zone)",
        hotels: ["Corbett Riverside Resort", "The Solluna Resort", "Hotel Krishna"],
        restaurants: ["Resort restaurants", "Local dhabas", "Hotel restaurants"],
        transport: "Taxis, auto-rickshaws, buses"
    },
    {
        id: 10,
        name: "Tehri",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        touristPlace: "Tehri Dam",
        description: "Famous for the Tehri Dam and adventure sports.",
        spots: ["Tehri Dam", "New Tehri Town", "Khatling Glacier", "Devprayag"],
        bestTime: "March to June, September to November",
        entryFees: "Tehri Dam: ₹50, Adventure sports: ₹500-₹3000",
        hotels: ["Tehri Lake Resort", "GMVN Tourist Bungalow", "Hotel Devlok"],
        restaurants: ["Lakeview Restaurant", "GMVN Restaurant", "Local eateries"],
        transport: "Taxis, shared jeeps, boats in the reservoir"
    }
];

// Render Districts
const districtsGrid = document.getElementById('districtsGrid');
const filterButtons = document.getElementById('filterButtons');
const districtModal = document.getElementById('districtModal');
const closeModal = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');

function renderDistricts(filter = 'all') {
    if (!districtsGrid) return;
    
    districtsGrid.innerHTML = '';
    
    const filteredDistricts = filter === 'all' 
        ? districtsData 
        : districtsData.filter(district => district.category === filter);
    
    filteredDistricts.forEach(district => {
        const districtCard = document.createElement('div');
        districtCard.className = 'district-card';
        districtCard.innerHTML = `
            <div class="district-img">
                <img src="${district.image}" alt="${district.name}">
            </div>
            <div class="district-info">
                <h3>${district.name}</h3>
                <p>${district.description}</p>
                <div class="tourist-spots">
                    <h4>Popular Spots:</h4>
                    <ul>
                        ${district.spots.map(spot => `<li><i class="fas fa-map-marker-alt"></i> ${spot}</li>`).join('')}
                    </ul>
                </div>
                <button class="btn view-details-btn" data-id="${district.id}" style="margin-top: 15px;">View Details</button>
            </div>
        `;
        districtsGrid.appendChild(districtCard);
    });
    
    // Add event listeners to view details buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const districtId = parseInt(e.target.getAttribute('data-id'));
            openDistrictModal(districtId);
        });
    });
}

// Open District Modal
function openDistrictModal(districtId) {
    const district = districtsData.find(d => d.id === districtId);
    if (!district || !modalContent) return;
    
    modalContent.innerHTML = `
        <h2>${district.name}</h2>
        <div class="modal-district-image">
            <img src="${district.image}" alt="${district.name}">
        </div>
        <p>${district.description}</p>
        
        <div class="modal-details">
            <div class="detail-section">
                <h3><i class="fas fa-map-marked-alt"></i> Tourist Spots</h3>
                <ul>
                    ${district.spots.map(spot => `<li>${spot}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-calendar-alt"></i> Best Time to Visit</h3>
                <p>${district.bestTime}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-ticket-alt"></i> Entry Fees</h3>
                <p>${district.entryFees}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-hotel"></i> Recommended Hotels</h3>
                <ul>
                    ${district.hotels.map(hotel => `<li>${hotel}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-utensils"></i> Popular Restaurants</h3>
                <ul>
                    ${district.restaurants.map(restaurant => `<li>${restaurant}</li>`).join('')}
                </ul>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-bus"></i> Transport Options</h3>
                <p>${district.transport}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <a href="hotels.html" class="btn">Find Hotels</a>
            <a href="restaurants.html" class="btn">Find Restaurants</a>
            <a href="taxi.html" class="btn">Book Transport</a>
        </div>
    `;
    
    if (districtModal) {
        districtModal.style.display = 'block';
    }
}

// Close Modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        if (districtModal) {
            districtModal.style.display = 'none';
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === districtModal) {
        districtModal.style.display = 'none';
    }
});

// Filter functionality
if (filterButtons) {
    filterButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            e.target.classList.add('active');
            // Get filter value
            const filterValue = e.target.getAttribute('data-filter');
            // Render districts based on filter
            renderDistricts(filterValue);
        }
    });
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderDistricts();
});