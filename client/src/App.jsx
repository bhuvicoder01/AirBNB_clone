import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaymentProvider } from './contexts/PaymentContext';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { BookingProvider } from './contexts/BookingContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import Bookings from './pages/Bookings';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import ProfileCard from './components/user/ProfileCard';
import NewListing from './components/host/NewListing';
import EditHostListing from './components/host/EditHostListing';
import PaymentInterface from './pages/PaymentInterface';

function App() {
  return (
    <Router>
      <PaymentProvider>
      <AuthProvider>
        <PropertyProvider>
          <BookingProvider>
            <WishlistProvider>
              <Routes>
                {/* Isolated Payment Route - No Layout */}
                <Route path='/payment' element={<PaymentInterface/>}/>
                
                {/* All other routes with Layout */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/property/:id" element={<PropertyDetailsPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/host/dashboard" element={<HostDashboard />} />
                  <Route path='/host/new-listing' element={<NewListing/>}/>
                  <Route path='/host/edit-listing/:id' element={<EditHostListing/>}/>
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path='/profile' element={<ProfileCard/>}/>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </BookingProvider>
        </PropertyProvider>
      </AuthProvider>
      </PaymentProvider>
    </Router>
  );
}

export default App;