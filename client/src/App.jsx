import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <PropertyProvider>
          <BookingProvider>
            <WishlistProvider>
              <Layout>
                <Routes>
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
                </Routes>
              </Layout>
            </WishlistProvider>
          </BookingProvider>
        </PropertyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;