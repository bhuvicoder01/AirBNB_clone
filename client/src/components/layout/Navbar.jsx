import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../search/SearchBar';
import UserMenu from '../user/UserMenu';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-fluid px-4">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-house-heart-fill text-danger fs-3 me-2"></i>
          <span className="fw-bold airbnb-logo">airbnb</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="d-none d-md-block flex-grow-1 mx-5">
          <SearchBar compact={true} />
        </div>

        {/* Right Side Menu */}
        <div className="d-flex align-items-center gap-3">
          {/* Become a Host */}
          <Link 
            to="/host/dashboard" 
            className="text-decoration-none text-dark fw-semibold d-none d-lg-block host-link"
          >
            Become a Host
          </Link>

          {/* Globe Icon */}
          <button className="btn btn-link text-dark p-2">
            <i className="bi bi-globe fs-5"></i>
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>

        {/* Mobile Search Button */}
        <button 
          className="btn btn-link d-md-none"
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="d-md-none p-3 border-top">
          <SearchBar />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
