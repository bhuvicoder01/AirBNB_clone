2# AirBNB Clone - Project Workflow Documentation

## Project Overview
Full-stack accommodation booking platform with property listings, user authentication, booking management, payment processing, and multi-language support.

---

## 1. METHODOLOGY

### Frontend Details
- **Framework**: React 18 with React Router v6
- **UI Library**: Bootstrap 5 with custom CSS
- **State Management**: React Context API (AuthContext, BookingContext, PropertyContext, WishlistContext, PaymentContext, LanguageContext)
- **Date Handling**: date-fns library
- **Icons**: Bootstrap Icons

### Backend Details
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **API Architecture**: RESTful API design
- **File Storage**: Cloudinary for image uploads

### Algorithms/Technology Used
- **Authentication Flow**: JWT-based stateless authentication with localStorage persistence
- **Date Validation**: Calendar algorithm with past date blocking and check-in/check-out validation
- **Search Algorithm**: MongoDB text search with location and date filtering
- **Price Calculation**: Dynamic pricing with service fees and taxes
- **Language Switching**: Context-based i18n with localStorage persistence
- **Image Carousel**: React-based slider with navigation controls

---

## 2. IMPLEMENTATION

### System Architecture
```
Client (React SPA)
    ↓
React Router (Navigation)
    ↓
Context Providers (State Management)
    ↓
API Services (Axios)
    ↓
Express Backend (REST API)
    ↓
MongoDB Database
```

### Module Explanation

#### **Authentication Module**
- **Components**: Login.jsx, Register.jsx, LoginForm.jsx, RegisterForm.jsx
- **Context**: AuthContext.jsx
- **Flow**: User registers → Password hashed → JWT token generated → Token stored in localStorage → Protected routes accessible
- **Features**: Role-based access (guest/host), persistent sessions, logout functionality

#### **Property Management Module**
- **Components**: PropertyGrid.jsx, PropertyCard.jsx, PropertyDetailsPage.jsx, NewListing.jsx, EditHostListing.jsx
- **Context**: PropertyContext.jsx
- **Flow**: Host creates listing → Images uploaded to Cloudinary → Property saved to DB → Displayed in grid → Users can view details
- **Features**: Image carousel, amenities display, rating system, max guest capacity

#### **Search & Filter Module**
- **Components**: SearchBar.jsx, SearchResults.jsx, DateRangePicker.jsx
- **Flow**: User enters location/dates → API queries MongoDB → Results filtered by availability → Displayed in grid
- **Features**: Location autocomplete, date range picker with validation, guest count selector

#### **Booking Module**
- **Components**: BookingWidget.jsx, Calendar.jsx, PriceBreakdown.jsx, Bookings.jsx
- **Context**: BookingContext.jsx
- **Flow**: User selects dates → Price calculated → Booking created → Payment initiated → Confirmation sent
- **Features**: Date validation (no past dates, checkout > checkin), guest selection, price breakdown with fees

#### **Payment Module**
- **Components**: PaymentInterface.jsx, Payment.jsx
- **Context**: PaymentContext.jsx
- **Flow**: Booking created → Payment form displayed → Card details validated → Mock payment processed → Booking confirmed
- **Features**: Form validation, order summary, transaction ID generation, payment status tracking

#### **Wishlist Module**
- **Components**: Wishlist.jsx, WishlistButton.jsx
- **Context**: WishlistContext.jsx
- **Flow**: User clicks heart icon → Property added to wishlist → Stored in DB → Displayed on wishlist page
- **Features**: Toggle add/remove, persistent storage, visual feedback

#### **User Dashboard Module**
- **Components**: Dashboard.jsx, HostDashboard.jsx, ProfileCard.jsx, UserMenu.jsx
- **Flow**: User logs in → Dashboard displays bookings/listings → User can manage data
- **Features**: Booking history, property management, profile editing, role-specific views

#### **Language Module**
- **Components**: LanguageSelector.jsx
- **Context**: LanguageContext.jsx
- **Flow**: User selects language → Context updates → All components re-render with translations → Preference saved to localStorage
- **Features**: English, Spanish, French support, persistent preference, dropdown selector

#### **Layout Module**
- **Components**: Layout.jsx, Navbar.jsx, Footer.jsx
- **Flow**: Wraps all routes → Provides consistent navigation → Responsive design
- **Features**: Sticky navbar, user menu, search bar integration, mobile responsive

---

## 3. KEY FEATURES IMPLEMENTED

### Date Picker System
- Calendar grid aligned with universal calendar (Su-Sa)
- Past dates disabled automatically
- Check-out must be after check-in (minimum 1 day gap)
- Separate modals for check-in and check-out selection
- Visual feedback for selected dates and date ranges
- Month navigation with current month restriction for previous button

### Authentication System
- Secure password hashing with bcrypt
- JWT token generation and validation
- Protected routes requiring authentication
- Role-based access control (guest/host)
- Persistent login sessions via localStorage
- Automatic token refresh on page reload

### Booking Workflow
1. User browses properties
2. Selects property and views details
3. Chooses check-in/check-out dates via calendar
4. Selects number of guests
5. Reviews price breakdown (base price + service fee + taxes)
6. Clicks Reserve → Redirected to payment
7. Enters payment details
8. Booking confirmed → Stored in database
9. User can view booking in "My Bookings"

### Payment Processing
- Mock payment interface with form validation
- Card number formatting (16 digits with spaces)
- Expiry date validation (MM/YY format)
- CVV validation (3-4 digits)
- Order summary display
- Transaction ID generation
- Payment status tracking (pending/completed/failed)

### Multi-language Support
- Context-based translation system
- 40+ translation keys covering all pages
- Language selector in navbar
- Persistent language preference
- Supports English, Spanish, French
- Real-time UI updates on language change

---

## 4. API ENDPOINTS

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Properties
- GET /api/properties - Get all properties
- GET /api/properties/:id - Get property by ID
- POST /api/properties - Create property (host only)
- PUT /api/properties/:id - Update property (host only)
- DELETE /api/properties/:id - Delete property (host only)

### Bookings
- GET /api/bookings - Get all bookings
- GET /api/bookings/user/:userId - Get user bookings
- GET /api/bookings/:id - Get booking by ID
- POST /api/bookings - Create booking
- PUT /api/bookings/:id/cancel - Cancel booking

### Payments
- POST /api/payments/process - Process payment
- GET /api/payments/:id - Get payment details

### Wishlist
- GET /api/wishlist/:userId - Get user wishlist
- POST /api/wishlist - Add to wishlist
- DELETE /api/wishlist/:id - Remove from wishlist

---

## 5. DATABASE SCHEMA

### User Collection
```
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  role: String (guest/host),
  createdAt: Date
}
```

### Property Collection
```
{
  _id: ObjectId,
  hostId: ObjectId (ref: User),
  title: String,
  description: String,
  location: String,
  price_per_night: Number,
  max_guests: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  images: [String],
  rating: { overall: Number },
  reviews_count: Number,
  createdAt: Date
}
```

### Booking Collection
```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  hostId: ObjectId (ref: User),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalPrice: Number,
  status: String (pending/confirmed/cancelled/completed),
  createdAt: Date
}
```

### Payment Collection
```
{
  _id: ObjectId,
  bookingId: ObjectId (ref: Booking),
  amount: Number,
  currency: String,
  transactionId: String,
  status: String (pending/completed/failed),
  timestamp: Date
}
```

### Wishlist Collection
```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  createdAt: Date
}
```

---

## 6. COMPONENT HIERARCHY

```
App.jsx
├── LanguageProvider
├── PaymentProvider
├── AuthProvider
├── PropertyProvider
├── BookingProvider
└── WishlistProvider
    ├── Router
    │   ├── Layout (with Navbar & Footer)
    │   │   ├── Home
    │   │   │   ├── SearchBar
    │   │   │   └── PropertyGrid
    │   │   │       └── PropertyCard
    │   │   ├── PropertyDetailsPage
    │   │   │   ├── ImageCarousel
    │   │   │   ├── BookingWidget
    │   │   │   │   └── DateRangePicker
    │   │   │   └── ReviewSection
    │   │   ├── SearchResults
    │   │   │   └── PropertyGrid
    │   │   ├── Bookings
    │   │   │   └── BookingCard
    │   │   ├── Wishlist
    │   │   │   └── PropertyGrid
    │   │   ├── Login
    │   │   │   └── LoginForm
    │   │   ├── Register
    │   │   │   └── RegisterForm
    │   │   ├── Dashboard
    │   │   │   └── ProfileCard
    │   │   └── HostDashboard
    │   │       ├── NewListing
    │   │       └── EditHostListing
    │   ├── PaymentInterface (no Layout)
    │   └── Payment (no Layout)
```

---

## 7. STATE MANAGEMENT FLOW

### Context Providers
1. **AuthContext**: User authentication state, login/logout functions
2. **PropertyContext**: Property listings, CRUD operations
3. **BookingContext**: User bookings, create/cancel operations
4. **WishlistContext**: Wishlist items, add/remove operations
5. **PaymentContext**: Payment processing, status tracking
6. **LanguageContext**: Current language, translation function

### Data Flow Pattern
```
User Action → Component → Context Hook → API Service → Backend → Database
                ↓                                          ↓
            UI Update ← Context State Update ← Response ←
```

---

## 8. RESPONSIVE DESIGN

- Mobile-first approach with Bootstrap grid system
- Breakpoints: xs (<576px), sm (≥576px), md (≥768px), lg (≥992px), xl (≥1200px)
- Collapsible navbar for mobile
- Stacked layout for property cards on small screens
- Touch-friendly date picker
- Responsive tables with horizontal scroll
- Adaptive image sizing with object-fit

---

## 9. SECURITY FEATURES

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with expiration
- Protected API routes with middleware
- Input validation on frontend and backend
- XSS prevention with React's built-in escaping
- CORS configuration for API access
- Environment variables for sensitive data
- No credentials stored in code

---

## 10. PERFORMANCE OPTIMIZATIONS

- React.memo for preventing unnecessary re-renders
- useMemo for expensive calculations (translation function)
- useCallback for stable function references
- Lazy loading for images
- Code splitting with React Router
- LocalStorage caching for user data and preferences
- Debounced search input
- Pagination for property listings

---

This workflow documentation provides a comprehensive overview of the AirBNB clone project architecture, implementation details, and component interactions suitable for technical reporting and AI prompt generation.
