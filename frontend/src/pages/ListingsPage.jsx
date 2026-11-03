// Listings Page (Home /)
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchOpportunities, fetchDomains, getErrorMessage } from '../api/api';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import OpportunityCard from '../components/OpportunityCard';
import Pagination from '../components/Pagination';

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query state
  const searchKeyword = searchParams.get('search') || '';
  const selectedDomain = searchParams.get('domain') || '';
  const selectedType = searchParams.get('type') || '';
  const selectedExperience = searchParams.get('experience') || '';
  const searchLocation = searchParams.get('location') || '';
  const sort = searchParams.get('sort') || 'newest';
  const pageParam = searchParams.get('page');
  const requestedPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Local state
  const [opportunities, setOpportunities] = useState([]);
  const [domains, setDomains] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch domains once on mount
  useEffect(() => {
    let isMounted = true;
    fetchDomains()
      .then((res) => {
        if (isMounted && res.data && res.data.data) {
          setDomains(res.data.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch domains:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch opportunities whenever query params change
  const loadOpportunities = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = {
      page: requestedPage,
      limit: 10,
      sort
    };

    if (searchKeyword) params.search = searchKeyword;
    if (selectedDomain) params.domain = selectedDomain;
    if (selectedType) params.type = selectedType;
    if (selectedExperience) params.experience = selectedExperience;
    if (searchLocation) params.location = searchLocation;

    fetchOpportunities(params)
      .then((res) => {
        if (res.data && res.data.success) {
          setOpportunities(res.data.data);
          setPagination(res.data.pagination || { total: 0, page: requestedPage, pages: 1, limit: 10 });
        }
      })
      .catch((err) => {
        setError(getErrorMessage(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchKeyword, selectedDomain, selectedType, selectedExperience, searchLocation, sort, requestedPage]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Page > total pages redirect rule:
  // "If the URL has a page number higher than the real number of pages (for example ?page=99),
  // redirect to page 1 using { replace: true }. Do this in a useEffect that runs ONLY when
  // loading is false, there is no error, total > 0, the returned page equals the requested page,
  // and the requested page > pages. It must never loop."
  useEffect(() => {
    if (
      !loading &&
      !error &&
      pagination.total > 0 &&
      pagination.page === requestedPage &&
      requestedPage > pagination.pages
    ) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('page', '1');
      setSearchParams(nextParams, { replace: true });
    }
  }, [loading, error, pagination.total, pagination.page, pagination.pages, requestedPage, searchParams, setSearchParams]);

  // Update query params helper (resets page to 1)
  const updateQueryParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value && value.trim()) {
      nextParams.set(key, value.trim());
    } else {
      nextParams.delete(key);
    }
    // Any filter change resets page to 1
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Search handler from hero
  const handleHeroSearch = ({ search, experience, location }) => {
    const nextParams = new URLSearchParams(searchParams);
    if (search) nextParams.set('search', search); else nextParams.delete('search');
    if (experience) nextParams.set('experience', experience); else nextParams.delete('experience');
    if (location) nextParams.set('location', location); else nextParams.delete('location');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Quick domain pill click
  const handleSelectDomain = (dom) => {
    const nextDomain = selectedDomain === dom ? '' : dom;
    updateQueryParam('domain', nextDomain);
  };

  // Clear all filters
  const handleClearAll = () => {
    const nextParams = new URLSearchParams();
    if (sort && sort !== 'newest') {
      nextParams.set('sort', sort);
    }
    setSearchParams(nextParams);
    setMobileFilterOpen(false);
  };

  // Sort change handler
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', newSort);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Page change
  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', newPage.toString());
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Showing range calculation
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div>
      {/* Hero section with unified search bar and quick domain links */}
      <SearchBar
        initialKeyword={searchKeyword}
        initialExp={selectedExperience}
        initialLoc={searchLocation}
        domains={domains}
        activeDomain={selectedDomain}
        onSearch={handleHeroSearch}
        onSelectDomain={handleSelectDomain}
      />

      <div className="listings-layout">
        {/* Left Filter Sidebar */}
        <FilterSidebar
          domains={domains}
          selectedDomain={selectedDomain}
          selectedType={selectedType}
          selectedExperience={selectedExperience}
          onFilterChange={(key, val) => updateQueryParam(key, val)}
          onClearAll={handleClearAll}
          isOpen={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Right Results Container */}
        <main className="results-container">
          <div className="results-header">
            <div className="results-count-text">
              {loading ? (
                <span>Loading opportunities...</span>
              ) : (
                <span>
                  Showing {startItem}-{endItem} of {pagination.total} opportunities
                </span>
              )}
            </div>

            <div className="results-actions">
              <button
                type="button"
                className="mobile-filter-trigger"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                <span>Filters {Boolean(selectedDomain || selectedType || selectedExperience) ? '•' : ''}</span>
              </button>

              <div className="sort-group">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  className="sort-select"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Skeleton State */}
          {loading && (
            <div className="opportunities-list">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-box" style={{ width: 48, height: 48, borderRadius: 10 }}></div>
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-box" style={{ width: '40%', height: 20, marginBottom: 8 }}></div>
                    <div className="skeleton-box" style={{ width: '25%', height: 16, marginBottom: 16 }}></div>
                    <div className="skeleton-box" style={{ width: '80%', height: 14, marginBottom: 8 }}></div>
                    <div className="skeleton-box" style={{ width: '60%', height: 14 }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="state-box">
              <div className="state-icon">⚠️</div>
              <h3 className="state-title">Failed to load opportunities</h3>
              <p className="state-desc">{error}</p>
              <button type="button" className="state-btn" onClick={loadOpportunities}>
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && opportunities.length === 0 && (
            <div className="state-box">
              <div className="state-icon">🔍</div>
              <h3 className="state-title">No opportunities found</h3>
              <p className="state-desc">
                We couldn't find any opportunities matching your current filters. Try resetting your search or clearing filters.
              </p>
              <button type="button" className="state-btn" onClick={handleClearAll}>
                Clear all filters
              </button>
            </div>
          )}

          {/* List Cards */}
          {!loading && !error && opportunities.length > 0 && (
            <div className="opportunities-list">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ListingsPage;

