export const mockProperties = [
  {
    id: 1,
    title: "Cozy Beach House with Ocean View",
    description: "Beautiful beachfront property with stunning sunset views. Perfect for a relaxing getaway with family and friends.",
    location: {
      city: "Malibu",
      country: "USA",
      lat: 34.0259,
      lng: -118.7798
    },
    price_per_night: 350,
    property_type: "Entire place",
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    max_guests: 6,
    amenities: ["WiFi", "Kitchen", "Free parking", "Pool", "Beach access", "Hot tub", "Air conditioning"],
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    ],
    host: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      superhost: true,
      response_time: "within an hour"
    },
    rating: {
      overall: 4.95,
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 5.0,
      location: 4.9,
      value: 4.8
    },
    reviews_count: 127
  },
  {
    id: 2,
    title: "Modern Downtown Loft",
    description: "Stylish loft in the heart of the city with amazing views and walking distance to everything.",
    location: {
      city: "New York",
      country: "USA",
      lat: 40.7128,
      lng: -74.0060
    },
    price_per_night: 180,
    property_type: "Entire place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    max_guests: 2,
    amenities: ["WiFi", "Kitchen", "Gym", "Elevator", "Air conditioning"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
    ],
    host: {
      name: "Mike Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
      superhost: false,
      response_time: "within a few hours"
    },
    rating: {
      overall: 4.7,
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.6,
      location: 4.9,
      value: 4.5
    },
    reviews_count: 43
  },
  {
    id: 3,
    title: "Mountain Cabin Retreat",
    description: "Peaceful cabin surrounded by nature. Perfect for hiking and outdoor activities.",
    location: {
      city: "Aspen",
      country: "USA",
      lat: 39.1911,
      lng: -106.8175
    },
    price_per_night: 280,
    property_type: "Entire place",
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    max_guests: 4,
    amenities: ["WiFi", "Kitchen", "Fireplace", "Hiking trails", "Mountain view"],
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c"
    ],
    host: {
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=5",
      superhost: true,
      response_time: "within an hour"
    },
    rating: {
      overall: 4.92,
      cleanliness: 4.9,
      accuracy: 4.9,
      communication: 5.0,
      location: 4.8,
      value: 4.9
    },
    reviews_count: 89
  }
  // Add more mock properties as needed
];

// Mock Users
export const mockUsers = [
  {
    id: 1,
    email: "guest@example.com",
    password: "password123",
    role: "guest",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  {
    id: 2,
    email: "host@example.com",
    password: "password123",
    role: "host",
    name: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=44"
  }
];
