// Application Form Page (/apply/:id)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOpportunityById, createApplication, getErrorMessage } from '../api/api';

const ApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loadingOpp, setLoadingOpp] = useState(true);
  const [oppError, setOppError] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Validation & status
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Load opportunity info to show title/company at top
  useEffect(() => {
    let isMounted = true;
    fetchOpportunityById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.success) {
          setOpportunity(res.data.data);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setOppError(getErrorMessage(err));
      })
      .finally(() => {
        if (isMounted) setLoadingOpp(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Client-side validation helper
  const validateForm = () => {
    const errs = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      errs.name = 'Full name is required';
    } else if (trimmedName.length > 100) {
      errs.name = 'Name cannot exceed 100 characters';
    }

    if (!trimmedEmail) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!trimmedPhone) {
      errs.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(trimmedPhone)) {
      errs.phone = 'Phone number must be exactly 10 digits';
    }

    if (message && message.length > 1000) {
      errs.message = 'Message cannot exceed 1000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        opportunity: id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        message: message.trim()
      };

      const res = await createApplication(payload);

      if (res.data && res.data.success && res.data.data) {
        const savedApp = res.data.data;
        navigate(`/confirmation/${savedApp._id}`);
      }
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOpp) {
    return (
      <div className="form-page-container">
        <div className="form-card">
          <div className="skeleton-box" style={{ width: '50%', height: 28, marginBottom: 12 }}></div>
          <div className="skeleton-box" style={{ width: '80%', height: 18, marginBottom: 24 }}></div>
          <div className="skeleton-box" style={{ width: '100%', height: 250 }}></div>
        </div>
      </div>
    );
  }

  if (oppError || !opportunity) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div className="state-box">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Opportunity Unavailable</h2>
          <p className="state-desc">
            The opportunity you are trying to apply for was not found or is currently unavailable.
          </p>
          <Link to="/" className="state-btn">
            Browse All Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Apply for {opportunity.title}</h1>
          <p className="form-subtitle">
            at <strong>{opportunity.company}</strong> • {opportunity.location}
          </p>
        </div>

        {/* Server Error Message Alert (e.g. 409 duplicate) */}
        {serverError && (
          <div className="form-alert-error" role="alert">
            <strong>Application Error:</strong> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name <span className="req">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              disabled={submitting}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="req">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="e.g. jane.doe@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              disabled={submitting}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number (10 digits) <span className="req">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="e.g. 9876543210"
              maxLength="10"
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPhone(val);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              disabled={submitting}
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          {/* Optional Message */}
          <div className="form-group">
            <label className="form-label" htmlFor="message">
              Why are you a good fit? (Optional)
            </label>
            <textarea
              id="message"
              rows="4"
              className={`form-textarea ${errors.message ? 'error' : ''}`}
              placeholder="Share a brief overview of your projects, skills, or why you're interested in this role..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: null });
              }}
              maxLength="1000"
              disabled={submitting}
            ></textarea>
            <div className="char-counter">{message.length}/1000 characters</div>
            {errors.message && <div className="error-text">{errors.message}</div>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting Application...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;

