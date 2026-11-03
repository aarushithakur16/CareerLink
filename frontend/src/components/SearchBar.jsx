// Naukri-style unified search bar with quick domain filters
import React, { useState, useEffect } from 'react';

const SearchBar = ({ initialKeyword = '', initialExp = '', initialLoc = '', domains = [], activeDomain = '', onSearch, onSelectDomain }) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [experience, setExperience] = useState(initialExp);
  const [location, setLocation] = useState(initialLoc);

  // Sync internal state if URL parameters change
  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setExperience(initialExp);
  }, [initialExp]);

  useEffect(() => {
    setLocation(initialLoc);
  }, [initialLoc]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    onSearch({
      search: keyword.trim(),
      experience: experience.trim(),
      location: location.trim()
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // First 8 domains for popular quick pills
  const quickDomains = domains.slice(0, 8);

  return (
    <div className="hero-section">
      <div className="hero-inner">
        <h1 className="hero-title">Find Your Next Career Opportunity</h1>
        <p className="hero-subtitle">Discover handpicked internships and early-career jobs from top innovative companies</p>

        <form className="search-bar-unified" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by role, company or skill"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="search-divider"></div>

          <div className="search-input-group exp-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="">Any experience</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-2 years">1-2 years</option>
              <option value="2-3 years">2-3 years</option>
            </select>
          </div>

          <div className="search-divider"></div>

          <div className="search-input-group loc-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button type="submit" className="search-btn">
            <span>Search</span>
          </button>
        </form>

        {quickDomains.length > 0 && (
          <div className="quick-domains-container">
            <span className="quick-domains-label">Popular Domains:</span>
            {quickDomains.map((dom) => (
              <button
                key={dom}
                type="button"
                className={`quick-domain-pill ${activeDomain === dom ? 'active' : ''}`}
                onClick={() => onSelectDomain(dom)}
              >
                {dom}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

