import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/index.css'

const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/');
  };

  return (
    <div className="user-menu position-relative" ref={menuRef}>
      <button
        className="btn user-menu-btn rounded-pill px-3 py-2 d-flex align-items-center gap-2"style={{borderColor:'red'}}
        onClick={() => setShowMenu(!showMenu)}
      >
        <i className="bi bi-list fs-5"></i>
        {isAuthenticated && user ? (
          <img
            src={user?.avatar?.url}
            alt={user?.firstName}
            className="rounded-circle"
            style={{ width: '32px', height: '32px' }}
          />
        ) : (
          <i className="bi bi-person-circle fs-5"></i>
        )}
      </button>

      {showMenu && (
        <div 
          className="position-absolute user-menu-modal end-0 mt-2 bg-white  shadow-lg border"
          style={{ minWidth: '240px', zIndex: 1000 }}
        >
          {isAuthenticated ? (
            <>
              <div className="p-3 border-bottom">
                <div className="fw-semibold">{user.name}</div>
                <small className="text-muted">{user.email}</small>
              </div>

              <div className="py-2">
                <Link
                  to="/bookings"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Trips
                </Link>
                <Link
                  to="/wishlist"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  <i className="bi bi-heart me-2"></i>
                  Wishlists
                </Link>
                {user.role === 'host' && (
                  <Link
                    to="/host/dashboard"
                    className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                    onClick={() => setShowMenu(false)}
                  >
                    <i className="bi bi-house-heart me-2"></i>
                    Host Dashboard
                  </Link>
                )}
              </div>

              <hr className="my-2" />

              <div className="py-2">
                <Link
                  to="/profile"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  Account
                </Link>
                <button
                  className="dropdown-item px-3 py-2 d-block text-start w-100 border-0 bg-transparent"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="py-2">
                <Link
                  to="/login"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark fw-semibold"
                  onClick={() => setShowMenu(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  Sign up
                </Link>
              </div>

              <hr className="my-2" />

              <div className="py-2">
                <Link
                  to="/register"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  Wandora your home
                </Link>
                <Link
                  to="/help"
                  className="dropdown-item px-3 py-2 d-block text-decoration-none text-dark"
                  onClick={() => setShowMenu(false)}
                >
                  Help Center
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
