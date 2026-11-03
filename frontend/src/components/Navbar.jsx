// Top navigation bar for CareerLink
import React from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentType = searchParams.get('type');

  // Check if link is active
  const isJobsActive = location.pathname === '/' && currentType === 'Job';
  const isInternshipsActive = location.pathname === '/' && currentType === 'Internship';
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo-icon">CL</div>
          <div>
            <span className="navbar-brand-name">CareerLink</span>
            <span className="navbar-tagline">Internship & Job Listing Portal</span>
          </div>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link
              to="/?type=Job"
              className={`navbar-link ${isJobsActive ? 'active' : ''}`}
            >
              Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/?type=Internship"
              className={`navbar-link ${isInternshipsActive ? 'active' : ''}`}
            >
              Internships
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className={`navbar-link ${isAdminActive ? 'active' : ''}`}
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

