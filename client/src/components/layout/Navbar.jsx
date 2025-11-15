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
    <nav className="navbar navbar-expand-lg navbar-light  sticky-top"style={{backgroundColor:'transparent'}}>
      <div className="container-fluid  py-2 px-2 "style={{backgroundColor:'rgba(255, 255, 255, 0.82)',borderRadius:'20px',marginInline:'4%'}}>
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-house-heart-fill text-danger fs-3 me-2"></i>
          <span className="fw-bold airbnb-logo">AirBnB</span>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="d-none d-md-block flex-grow-1 mx-5">
          <SearchBar compact={true} />
        </div>

        {/* Right Side Menu */}
        <div className="d-flex align-items-center gap-3">
          {/* Become a Host */}
          {user?.role!=='host' ? (<Link 
            to="/apply/host" 
            className="text-decoration-none text-dark fw-semibold d-none d-lg-block host-link"
          >
            Become a Host
          </Link>):(<Link 
            to="/host/dashboard" 
            className="text-decoration-none text-dark fw-bold d-none d-lg-block host-link"
          >
            Dashboard
          </Link>)}
{/* Mobile Search Button */}
        <button 
          className="btn btn-link d-md-none"
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <i className="bi bi-search"></i>
        </button>
          {/* Globe Icon */}
          <button className="btn btn-link text-dark p-2">
            <i className="bi bi-globe fs-5"></i>
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>

        
      </div>

      {/* Mobile Search Bar */}
      {showSearchBar && (
        <div className="d-md-none p-3 "style={{backgroundColor:'transparent'}}>
          <SearchBar />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
