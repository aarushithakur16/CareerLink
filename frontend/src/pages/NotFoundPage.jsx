// 404 Page for unknown routes
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      <div className="state-box">
        <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 12 }}>
          404
        </div>
        <h1 className="state-title" style={{ fontSize: 24, marginBottom: 8 }}>
          Page Not Found
        </h1>
        <p className="state-desc">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="state-btn">
          Back to CareerLink Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

