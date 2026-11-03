// Footer component for CareerLink
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">CareerLink</div>
          <p className="footer-tagline">Internship & Job Listing Portal</p>
        </div>

        <div className="footer-links">
          <Link to="/?type=Job" className="footer-link">
            Jobs
          </Link>
          <Link to="/?type=Internship" className="footer-link">
            Internships
          </Link>
          <Link to="/admin" className="footer-link">
            Admin
          </Link>
        </div>
      </div>

      <div className="footer-copy">
        &copy; {new Date().getFullYear()} CareerLink. All rights reserved. Built for aspiring interns & developers.
      </div>
    </footer>
  );
};

export default Footer;

