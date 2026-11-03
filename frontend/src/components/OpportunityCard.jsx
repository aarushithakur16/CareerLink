// Opportunity Card Component for CareerLink
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Modern palette for avatar initials
const AVATAR_COLORS = [
  '#4F46E5', '#0284C7', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#0D9488',
  '#2563EB', '#EA580C', '#475569', '#16A34A'
];

const getAvatarColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Posted recently';
  const created = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  return `Posted ${diffDays} days ago`;
};

const OpportunityCard = ({ opportunity }) => {
  const navigate = useNavigate();

  const {
    _id,
    title,
    company,
    domain,
    location,
    experience,
    description,
    type,
    skills = [],
    salary,
    createdAt
  } = opportunity;

  const initial = company ? company.charAt(0).toUpperCase() : 'C';
  const avatarBg = getAvatarColor(company);
  const displaySalary = salary && salary.trim() ? salary : 'Not disclosed';

  const visibleSkills = skills.slice(0, 4);
  const remainingSkills = skills.length - visibleSkills.length;

  const handleCardClick = (e) => {
    // If the click is on an action button, navigate naturally
    navigate(`/opportunity/${_id}`);
  };

  return (
    <div className="opportunity-card" onClick={handleCardClick}>
      {/* Avatar */}
      <div className="card-avatar" style={{ backgroundColor: avatarBg }}>
        {initial}
      </div>

      {/* Main Details */}
      <div className="card-body">
        <div className="card-header-line">
          <h2 className="card-title">{title}</h2>
        </div>
        <div className="card-company">{company}</div>

        {/* Spec row: Experience, Salary, Location */}
        <div className="card-spec-row">
          <div className="spec-item" title="Experience">
            <svg className="spec-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span>{experience}</span>
          </div>

          <div className="spec-item" title="Salary / Stipend">
            <svg className="spec-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span>{displaySalary}</span>
          </div>

          <div className="spec-item" title="Location">
            <svg className="spec-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{location}</span>
          </div>
        </div>

        {/* Description line clamped to 2 lines */}
        <p className="card-description">{description}</p>

        {/* Skills Chips */}
        {visibleSkills.length > 0 && (
          <div className="card-skills-row">
            {visibleSkills.map((skill, index) => (
              <span key={index} className="skill-chip">
                {skill}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="skill-chip-more">+{remainingSkills} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div className="card-tags">
            <span className={`tag ${type === 'Job' ? 'tag-job' : 'tag-internship'}`}>
              {type}
            </span>
            <span className="tag tag-domain">{domain}</span>
            <span className="card-time">{getRelativeTime(createdAt)}</span>
          </div>

          <button
            type="button"
            className="card-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/opportunity/${_id}`);
            }}
          >
            <span>View & Apply</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;

