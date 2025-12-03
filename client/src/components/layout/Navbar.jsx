import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import SearchBar from '../search/SearchBar';
import UserMenu from '../user/UserMenu';
import LanguageSelector from '../common/LanguageSelector';
import Toast from '../common/Toast';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(t('please_login_to_continue'));
  const [firstTimeVisit, setFirstTimeVisit] = useState(localStorage.getItem('firstTimeVisit') === null ? true : false);

  useEffect(() => {
    if (firstTimeVisit && !isAuthenticated) {
      setShowToast(true);
      setToastMessage(t(`Welcome👋! Please login to Explore all features.` ));
      localStorage.setItem('firstTimeVisit', 'false');
      setFirstTimeVisit(false);
    }
  }, [firstTimeVisit, isAuthenticated]);

  

  return (<>
    <nav className="navbar navbar-expand-lg navbar-light  sticky-top"style={{backgroundColor:'transparent'}}>
      <div className="container-fluid  py-2 px-0 "style={{backgroundColor:'rgba(255, 255, 255, 0.82)',borderRadius:'20px',marginInline:'2%'}}>
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          {/* <i className="bi bi-house-heart-fill text-danger fs-3 me-0"></i> */}
          {/* <span className="fw-bold airbnb-logo">Wandora</span> */}
          <img src="/logo.png" alt="Wandora Logo" />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="d-none d-md-block flex-grow-1 mx-0 px-0 ">
          <SearchBar compact={true} />
        </div>

        {/* Right Side Menu */}
        <div className="d-flex align-items-center gap-1">
          {/* Become a Host */}
          {user?.role!=='host' ? (<Link 
            to="/apply/host" 
            className="text-decoration-none text-dark fw-semibold d-none d-lg-block host-link"
          >
            Become a Host
          </Link>):(<Link 
            to="/host/dashboard" 
            className="text-decoration-none bi bi-speedometer px-1 text-dark fw-bold d-none d-lg-block host-link"
          >
          <span className='px-1'>Dashboard</span>
          </Link>)}
{/* Mobile Search Button */}
        <button 
          className="btn btn-link d-md-none"
          onClick={() => setShowSearchBar(!showSearchBar)}
        >
          <i className="bi bi-search"></i>
        </button>
          {/* Language Selector */}
          <LanguageSelector />

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
    <Toast show={showToast} message={toastMessage} duration={6000} position='bottom-center' onClose={()=>setShowToast(false)}  />
    </>
  );
};

export default Navbar;
