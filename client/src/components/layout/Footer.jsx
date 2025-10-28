import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container py-5">
        <div className="row">
          {/* Support */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/help" className="text-muted text-decoration-none">Help Center</Link></li>
              <li className="mb-2"><Link to="/safety" className="text-muted text-decoration-none">Safety information</Link></li>
              <li className="mb-2"><Link to="/cancellation" className="text-muted text-decoration-none">Cancellation options</Link></li>
              <li className="mb-2"><Link to="/covid" className="text-muted text-decoration-none">COVID-19 Response</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Community</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/impact" className="text-muted text-decoration-none">Airbnb.org</Link></li>
              <li className="mb-2"><Link to="/refugees" className="text-muted text-decoration-none">Support refugees</Link></li>
              <li className="mb-2"><Link to="/combat" className="text-muted text-decoration-none">Combat discrimination</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Hosting</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/host" className="text-muted text-decoration-none">Try hosting</Link></li>
              <li className="mb-2"><Link to="/aircover" className="text-muted text-decoration-none">AirCover for Hosts</Link></li>
              <li className="mb-2"><Link to="/resources" className="text-muted text-decoration-none">Hosting resources</Link></li>
              <li className="mb-2"><Link to="/community-forum" className="text-muted text-decoration-none">Community forum</Link></li>
            </ul>
          </div>

          {/* Airbnb */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">Airbnb</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/newsroom" className="text-muted text-decoration-none">Newsroom</Link></li>
              <li className="mb-2"><Link to="/features" className="text-muted text-decoration-none">New features</Link></li>
              <li className="mb-2"><Link to="/careers" className="text-muted text-decoration-none">Careers</Link></li>
              <li className="mb-2"><Link to="/investors" className="text-muted text-decoration-none">Investors</Link></li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />

        {/* Bottom Row */}
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex flex-wrap gap-3 small text-muted">
              <span>© 2025 Airbnb, Inc.</span>
              <Link to="/terms" className="text-muted text-decoration-none">Terms</Link>
              <Link to="/sitemap" className="text-muted text-decoration-none">Sitemap</Link>
              <Link to="/privacy" className="text-muted text-decoration-none">Privacy</Link>
              <Link to="/choices" className="text-muted text-decoration-none">Your Privacy Choices</Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end gap-3">
              <button className="btn btn-link text-muted text-decoration-none p-0">
                <i className="bi bi-globe me-1"></i> English (US)
              </button>
              <button className="btn btn-link text-muted text-decoration-none p-0">
                <i className="bi bi-currency-dollar me-1"></i> USD
              </button>
              <div className="d-flex gap-2">
                <a href="#" className="text-muted"><i className="bi bi-facebook fs-5"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-twitter fs-5"></i></a>
                <a href="#" className="text-muted"><i className="bi bi-instagram fs-5"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
