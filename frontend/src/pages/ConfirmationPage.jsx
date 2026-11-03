// Confirmation Page (/confirmation/:applicationId)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApplicationById, getErrorMessage } from '../api/api';

const ConfirmationPage = () => {
  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchApplicationById(applicationId)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.success && res.data.data) {
          setApplication(res.data.data);
        } else {
          setError('Application details not found');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  if (loading) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px' }}>
        <div className="state-box">
          <div className="skeleton-box" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px' }}></div>
          <div className="skeleton-box" style={{ width: '60%', height: 24, margin: '0 auto 12px' }}></div>
          <div className="skeleton-box" style={{ width: '80%', height: 16, margin: '0 auto 24px' }}></div>
          <div className="skeleton-box" style={{ width: '100%', height: 120 }}></div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 20px' }}>
        <div className="state-box">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Application Not Found</h2>
          <p className="state-desc">{error || 'Could not retrieve your application confirmation.'}</p>
          <Link to="/" className="state-btn">
            Browse Opportunities
          </Link>
        </div>
      </div>
    );
  }

  const { name, email, phone, opportunity, createdAt, _id } = application;
  const oppTitle = opportunity?.title || 'Selected Opportunity';
  const oppCompany = opportunity?.company || 'Company';
  const appliedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div style={{ padding: '0 20px' }}>
      <div className="confirm-card">
        {/* Green Checkmark */}
        <div className="confirm-check-icon">✓</div>

        <h1 className="confirm-title">Application Submitted!</h1>
        <p className="confirm-subtitle">
          Your application for <strong>{oppTitle}</strong> at <strong>{oppCompany}</strong> has been received successfully.
        </p>

        {/* Confirmation Spec Box */}
        <div className="confirm-details-box">
          <div className="confirm-row">
            <span className="confirm-label">Reference ID:</span>
            <span className="confirm-val" style={{ fontFamily: 'monospace' }}>{_id}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Applicant Name:</span>
            <span className="confirm-val">{name}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Email:</span>
            <span className="confirm-val">{email}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Phone:</span>
            <span className="confirm-val">{phone}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Role:</span>
            <span className="confirm-val">{oppTitle}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Company:</span>
            <span className="confirm-val">{oppCompany}</span>
          </div>
          <div className="confirm-row">
            <span className="confirm-label">Submitted On:</span>
            <span className="confirm-val">{appliedDate}</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="confirm-actions">
          <Link to="/" className="state-btn">
            Browse More Opportunities
          </Link>
          <Link to="/?type=Internship" className="btn-secondary-link">
            Browse Internships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;

