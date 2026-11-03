// Left sidebar filter panel for CareerLink listings
import React from 'react';

const FilterSidebar = ({
  domains = [],
  selectedDomain = '',
  selectedType = '',
  selectedExperience = '',
  onFilterChange,
  onClearAll,
  isOpen = false,
  onCloseMobile
}) => {
  const experiences = ['Fresher', '0-1 years', '1-2 years', '2-3 years'];
  const workTypes = ['Internship', 'Job'];

  const handleDomainClick = (domain) => {
    // Single choice, click again to unselect
    const nextVal = selectedDomain === domain ? '' : domain;
    onFilterChange('domain', nextVal);
  };

  const handleTypeClick = (type) => {
    const nextVal = selectedType === type ? '' : type;
    onFilterChange('type', nextVal);
  };

  const handleExpClick = (exp) => {
    const nextVal = selectedExperience === exp ? '' : exp;
    onFilterChange('experience', nextVal);
  };

  const hasAnyFilter = Boolean(selectedDomain || selectedType || selectedExperience);

  return (
    <aside className={`filters-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="filters-header">
        <h3>All Filters</h3>
        <button type="button" className="clear-all-link" onClick={onClearAll}>
          Clear all
        </button>
      </div>

      {/* Work Type Filter */}
      <div className="filter-group">
        <div className="filter-group-title">Work Type</div>
        <div className="filter-option-list">
          {workTypes.map((type) => (
            <div
              key={type}
              className={`filter-option-item ${selectedType === type ? 'selected' : ''}`}
              onClick={() => handleTypeClick(type)}
            >
              <div className="filter-radio-indicator"></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-group">
        <div className="filter-group-title">Experience</div>
        <div className="filter-option-list">
          {experiences.map((exp) => (
            <div
              key={exp}
              className={`filter-option-item ${selectedExperience === exp ? 'selected' : ''}`}
              onClick={() => handleExpClick(exp)}
            >
              <div className="filter-radio-indicator"></div>
              <span>{exp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Filter */}
      <div className="filter-group">
        <div className="filter-group-title">Domain</div>
        <div className="filter-option-list">
          {domains.map((dom) => (
            <div
              key={dom}
              className={`filter-option-item ${selectedDomain === dom ? 'selected' : ''}`}
              onClick={() => handleDomainClick(dom)}
            >
              <div className="filter-radio-indicator"></div>
              <span>{dom}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
