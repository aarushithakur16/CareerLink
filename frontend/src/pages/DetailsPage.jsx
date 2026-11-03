// Details Page for an opportunity (/opportunity/:id)
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOpportunityById, fetchOpportunities, getErrorMessage } from '../api/api';

const AVATAR_COLORS = [
  '#4F46E5', '#0284C7', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0D9488'
];

const getAvatarColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetchOpportunityById(id)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.success && res.data.data) {
          const opp = res.data.data;
          setOpportunity(opp);

          // Fetch similar opportunities from the same domain (limit 5, client removes current)
          fetchOpportunities({ domain: opp.domain, limit: 5 })
            .then((simRes) => {
              if (!isMounted) return;
              if (simRes.data && simRes.data.data) {
                const filtered = simRes.data.data.filter((item) => item._id !== opp._id).slice(0, 4);
                setSimilar(filtered);
              }
            })
            .catch(() => {
              // Ignore similar fetching error silently
            });
        } else {
          setNotFound(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.response && (err.response.status === 404 || err.response.status === 400)) {
          setNotFound(true);
        } else {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="details-page-layout">
        <div className="details-main">
          <div className="details-card">
            <div className="skeleton-box" style={{ width: '60%', height: 32, marginBottom: 12 }}></div>
            <div className="skeleton-box" style={{ width: '30%', height: 20, marginBottom: 24 }}></div>
            <div className="skeleton-box" style={{ width: '100%', height: 120, marginBottom: 24 }}></div>
            <div className="skeleton-box" style={{ width: '100%', height: 160 }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div className="state-box">
          <div className="state-icon">🔍</div>
          <h2 className="state-title">Opportunity Not Found</h2>
          <p className="state-desc">
            The job or internship you are looking for does not exist or may have been removed.
          </p>
          <Link to="/" className="state-btn">
            Browse All Opportunities
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div className="state-box">
          <div className="state-icon">⚠️</div>
          <h2 className="state-title">Unable to load details</h2>
          <p className="state-desc">{error}</p>
          <button type="button" className="state-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    company,
    domain,
    location,
    experience,
    description,
    type,
    skills = [],
    salary,
    applicationLink
  } = opportunity;

  const initial = company ? company.charAt(0).toUpperCase() : 'C';
  const avatarBg = getAvatarColor(company);
  const displaySalary = salary && salary.trim() ? salary : 'Not disclosed';

  return (
    <div className="details-page-layout">
      {/* Main Opportunity Card */}
      <div className="details-main">
        <div className="details-card">
          <div className="details-header">
            <div className="card-avatar" style={{ backgroundColor: avatarBg, width: 56, height: 56, fontSize: 22 }}>
              {initial}
            </div>
            <div>
              <h1 className="details-title">{title}</h1>
              <div className="details-company">{company}</div>
              <div className="card-tags">
                <span className={`tag ${type === 'Job' ? 'tag-job' : 'tag-internship'}`}>
                  {type}
                </span>
                <span className="tag tag-domain">{domain}</span>
              </div>
            </div>
          </div>

          {/* Spec Grid */}
          <div className="details-spec-grid">
            <div>
              <div className="spec-cell-label">Location</div>
              <div className="spec-cell-value">{location}</div>
            </div>
            <div>
              <div className="spec-cell-label">Experience</div>
              <div className="spec-cell-value">{experience}</div>
            </div>
            <div>
              <div className="spec-cell-label">Salary / Stipend</div>
              <div className="spec-cell-value">{displaySalary}</div>
            </div>
            <div>
              <div className="spec-cell-label">Work Type</div>
              <div className="spec-cell-value">{type}</div>
            </div>
            <div>
              <div className="spec-cell-label">Domain</div>
              <div className="spec-cell-value">{domain}</div>
            </div>
          </div>

          {/* Required Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div className="details-section-title">Required Skills</div>
              <div className="card-skills-row">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full Role Description */}
          <div>
            <div className="details-section-title">Job Description & Responsibilities</div>
            <p className="details-description-body">{description}</p>
          </div>

          {/* Action buttons */}
          <div className="details-actions-bar">
            <button
              type="button"
              className="btn-apply-primary"
              onClick={() => navigate(`/apply/${opportunity._id}`)}
            >
              Apply on CareerLink
            </button>

            {applicationLink && (
              <a
                href={applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-link"
              >
                Visit company portal ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Similar Opportunities */}
      {similar.length > 0 && (
        <aside className="similar-panel">
          <div className="similar-title">Similar Opportunities</div>
          <div className="similar-list">
            {similar.map((sim) => (
              <Link
                key={sim._id}
                to={`/opportunity/${sim._id}`}
                className="similar-card"
              >
                <div className="similar-card-title">{sim.title}</div>
                <div className="similar-card-company">{sim.company}</div>
                <div className="similar-card-meta">
                  {sim.experience} • {sim.location}
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
};

export default DetailsPage;

