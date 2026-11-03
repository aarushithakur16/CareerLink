// Admin Dashboard Page (/admin)
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchOpportunities,
  fetchApplications,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getErrorMessage
} from '../api/api';
import Toast from '../components/Toast';

const KNOWN_DOMAINS = [
  'Web Development',
  'Full Stack Development',
  'Python Development',
  'Java Development',
  'Data Science',
  'Data Analytics',
  'AI/ML',
  'Mobile Development',
  'UI/UX Design',
  'Cybersecurity',
  'Cloud & DevOps',
  'Software Testing',
  'Embedded & IoT',
  'Game Development',
  'Blockchain',
  'Digital Marketing'
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'applications'

  // Opportunities state
  const [opportunities, setOpportunities] = useState([]);
  const [opportunitiesCount, setOpportunitiesCount] = useState(0);
  const [oppLoading, setOppLoading] = useState(true);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [unfilteredAppsCount, setUnfilteredAppsCount] = useState(0);
  const [appLoading, setAppLoading] = useState(false);
  const [selectedOppFilter, setSelectedOppFilter] = useState('');

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null); // null for Add, object for Edit
  const [modalFormData, setModalFormData] = useState({
    title: '',
    company: '',
    domain: '',
    type: 'Internship',
    location: '',
    experience: 'Fresher',
    salary: '',
    skills: '',
    applicationLink: '',
    description: ''
  });
  const [modalErrors, setModalErrors] = useState({});
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load unfiltered applications total count
  const loadUnfilteredAppsTotal = useCallback(() => {
    fetchApplications()
      .then((res) => {
        if (res.data && res.data.success && Array.isArray(res.data.data)) {
          setUnfilteredAppsCount(res.data.data.length);
        }
      })
      .catch(() => {
        // Ignore errors silently as specified
      });
  }, []);

  // Load opportunities list
  const loadOpportunities = useCallback(() => {
    setOppLoading(true);
    fetchOpportunities({ limit: 50 })
      .then((res) => {
        if (res.data && res.data.success) {
          setOpportunities(res.data.data);
          setOpportunitiesCount(res.data.pagination?.total || res.data.data.length);
        }
      })
      .catch((err) => {
        addToast(getErrorMessage(err), 'error');
      })
      .finally(() => {
        setOppLoading(false);
      });
  }, []);

  // Load applications list (with optional opportunity filter)
  const loadApplications = useCallback(() => {
    setAppLoading(true);
    const params = {};
    if (selectedOppFilter) {
      params.opportunity = selectedOppFilter;
    }
    fetchApplications(params)
      .then((res) => {
        if (res.data && res.data.success) {
          setApplications(res.data.data);
        }
      })
      .catch((err) => {
        addToast(getErrorMessage(err), 'error');
      })
      .finally(() => {
        setAppLoading(false);
      });
  }, [selectedOppFilter]);

  // Load counts immediately on mount before any tab is clicked
  useEffect(() => {
    loadOpportunities();
    loadUnfilteredAppsTotal();
  }, [loadOpportunities, loadUnfilteredAppsTotal]);

  // When switching to applications tab or changing filter, load applications
  useEffect(() => {
    if (activeTab === 'applications') {
      loadApplications();
    }
  }, [activeTab, loadApplications]);

  // Domain normalizer: trim, collapse spaces, match known domain ignoring case
  const normalizeDomain = (inputDomain) => {
    if (!inputDomain) return '';
    const cleaned = inputDomain.trim().replace(/\s+/g, ' ');
    const matched = KNOWN_DOMAINS.find(
      (d) => d.toLowerCase() === cleaned.toLowerCase()
    );
    return matched || cleaned;
  };

  // Open modal for Add
  const handleOpenAdd = () => {
    setEditingOpp(null);
    setModalFormData({
      title: '',
      company: '',
      domain: '',
      type: 'Internship',
      location: '',
      experience: 'Fresher',
      salary: '',
      skills: '',
      applicationLink: '',
      description: ''
    });
    setModalErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (opp) => {
    setEditingOpp(opp);
    setModalFormData({
      title: opp.title || '',
      company: opp.company || '',
      domain: opp.domain || '',
      type: opp.type || 'Internship',
      location: opp.location || '',
      experience: opp.experience || 'Fresher',
      salary: opp.salary || '',
      skills: Array.isArray(opp.skills) ? opp.skills.join(', ') : '',
      applicationLink: opp.applicationLink || '',
      description: opp.description || ''
    });
    setModalErrors({});
    setIsModalOpen(true);
  };

  // Validate modal form
  const validateModal = () => {
    const errs = {};
    if (!modalFormData.title.trim()) errs.title = 'Title is required';
    if (!modalFormData.company.trim()) errs.company = 'Company is required';
    if (!modalFormData.domain.trim()) errs.domain = 'Domain is required';
    if (!modalFormData.location.trim()) errs.location = 'Location is required';
    if (!modalFormData.applicationLink.trim()) {
      errs.applicationLink = 'Application Link is required';
    } else if (!/^https?:\/\/.+/.test(modalFormData.applicationLink.trim())) {
      errs.applicationLink = 'Must be a valid http or https URL';
    }
    if (!modalFormData.description.trim()) errs.description = 'Description is required';

    setModalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save Add/Edit
  const handleModalSave = async (e) => {
    e.preventDefault();
    if (!validateModal()) return;

    setModalSubmitting(true);
    try {
      const skillsArr = modalFormData.skills
        ? modalFormData.skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const normalizedDomain = normalizeDomain(modalFormData.domain);

      const payload = {
        title: modalFormData.title.trim(),
        company: modalFormData.company.trim(),
        domain: normalizedDomain,
        type: modalFormData.type,
        location: modalFormData.location.trim(),
        experience: modalFormData.experience,
        salary: modalFormData.salary.trim(),
        skills: skillsArr,
        applicationLink: modalFormData.applicationLink.trim(),
        description: modalFormData.description.trim()
      };

      if (editingOpp) {
        await updateOpportunity(editingOpp._id, payload);
        addToast('Opportunity updated successfully');
      } else {
        await createOpportunity(payload);
        addToast('Opportunity created successfully');
      }

      setIsModalOpen(false);
      loadOpportunities();
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    } finally {
      setModalSubmitting(false);
    }
  };

  // Delete opportunity with confirmation
  const handleDeleteOpportunity = async (opp) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${opp.title}" at ${opp.company}? This will also delete any associated candidate applications.`
    );
    if (!confirmed) return;

    try {
      await deleteOpportunity(opp._id);
      addToast('Opportunity and associated applications deleted');
      // Refresh both opportunities list and unfiltered applications count
      loadOpportunities();
      loadUnfilteredAppsTotal();
      if (activeTab === 'applications') {
        loadApplications();
      }
    } catch (err) {
      addToast(getErrorMessage(err), 'error');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Manage job postings and review candidate applications
          </p>
        </div>

        {activeTab === 'opportunities' && (
          <button type="button" className="card-action-btn" onClick={handleOpenAdd}>
            <span>+ Add Opportunity</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities ({opportunitiesCount})
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Candidate Applications ({unfilteredAppsCount})
        </button>
      </div>

      {/* Tab 1: Opportunities Table */}
      {activeTab === 'opportunities' && (
        <div className="table-card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title & Company</th>
                  <th>Domain</th>
                  <th>Type</th>
                  <th>Experience</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {oppLoading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 32 }}>
                      Loading opportunities...
                    </td>
                  </tr>
                ) : opportunities.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 32 }}>
                      No opportunities found.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp) => (
                    <tr key={opp._id}>
                      <td>
                        <strong>{opp.title}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {opp.company}
                        </div>
                      </td>
                      <td>
                        <span className="tag tag-domain">{opp.domain}</span>
                      </td>
                      <td>
                        <span
                          className={`tag ${
                            opp.type === 'Job' ? 'tag-job' : 'tag-internship'
                          }`}
                        >
                          {opp.type}
                        </span>
                      </td>
                      <td>{opp.experience}</td>
                      <td>{opp.location}</td>
                      <td>{opp.salary || 'Not disclosed'}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className="table-btn table-btn-edit"
                          onClick={() => handleOpenEdit(opp)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="table-btn table-btn-delete"
                          onClick={() => handleDeleteOpportunity(opp)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Table */}
      {activeTab === 'applications' && (
        <div className="table-card">
          <div className="table-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label htmlFor="opp-filter" style={{ fontSize: 13, fontWeight: 500 }}>
                Filter by Opportunity:
              </label>
              <select
                id="opp-filter"
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px' }}
                value={selectedOppFilter}
                onChange={(e) => setSelectedOppFilter(e.target.value)}
              >
                <option value="">All Opportunities ({unfilteredAppsCount})</option>
                {opportunities.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.title} - {o.company}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Showing {applications.length} applications
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Contact</th>
                  <th>Opportunity Applied</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Applied Date</th>
                </tr>
              </thead>
              <tbody>
                {appLoading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 32 }}>
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 32 }}>
                      No applications found for this filter.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.name}</strong>
                      </td>
                      <td>
                        <div>{app.email}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {app.phone}
                        </div>
                      </td>
                      <td>
                        <strong>{app.opportunity?.title || 'Unknown Opportunity'}</strong>
                      </td>
                      <td>{app.opportunity?.company || 'N/A'}</td>
                      <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.message}>
                        {app.message || <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Reusable Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !modalSubmitting && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>
                {editingOpp ? 'Edit Opportunity' : 'Add New Opportunity'}
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => !modalSubmitting && setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Title */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">
                    Role Title <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${modalErrors.title ? 'error' : ''}`}
                    placeholder="e.g. React Developer Intern"
                    value={modalFormData.title}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, title: e.target.value })
                    }
                  />
                  {modalErrors.title && <div className="error-text">{modalErrors.title}</div>}
                </div>

                {/* Company */}
                <div className="form-group">
                  <label className="form-label">
                    Company Name <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${modalErrors.company ? 'error' : ''}`}
                    placeholder="e.g. PixelCraft Labs"
                    value={modalFormData.company}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, company: e.target.value })
                    }
                  />
                  {modalErrors.company && <div className="error-text">{modalErrors.company}</div>}
                </div>

                {/* Domain with Datalist of 16 Known Domains */}
                <div className="form-group">
                  <label className="form-label">
                    Domain <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    list="known-domains-datalist"
                    className={`form-input ${modalErrors.domain ? 'error' : ''}`}
                    placeholder="e.g. Web Development"
                    value={modalFormData.domain}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, domain: e.target.value })
                    }
                  />
                  <datalist id="known-domains-datalist">
                    {KNOWN_DOMAINS.map((dom) => (
                      <option key={dom} value={dom} />
                    ))}
                  </datalist>
                  {modalErrors.domain && <div className="error-text">{modalErrors.domain}</div>}
                </div>

                {/* Work Type */}
                <div className="form-group">
                  <label className="form-label">Work Type</label>
                  <select
                    className="form-select"
                    value={modalFormData.type}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, type: e.target.value })
                    }
                  >
                    <option value="Internship">Internship</option>
                    <option value="Job">Job</option>
                  </select>
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select
                    className="form-select"
                    value={modalFormData.experience}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, experience: e.target.value })
                    }
                  >
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-3 years">2-3 years</option>
                  </select>
                </div>

                {/* Location */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">
                    Location <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-input ${modalErrors.location ? 'error' : ''}`}
                    placeholder="e.g. Bengaluru, India (Remote)"
                    value={modalFormData.location}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, location: e.target.value })
                    }
                  />
                  {modalErrors.location && <div className="error-text">{modalErrors.location}</div>}
                </div>

                {/* Salary (Optional) */}
                <div className="form-group">
                  <label className="form-label">Salary / Stipend (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹15,000 - ₹25,000 /month"
                    value={modalFormData.salary}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, salary: e.target.value })
                    }
                  />
                </div>

                {/* Skills (Comma-separated) */}
                <div className="form-group">
                  <label className="form-label">Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. React, JavaScript, CSS"
                    value={modalFormData.skills}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, skills: e.target.value })
                    }
                  />
                </div>

                {/* Application Link */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">
                    Application Portal URL <span className="req">*</span>
                  </label>
                  <input
                    type="url"
                    className={`form-input ${modalErrors.applicationLink ? 'error' : ''}`}
                    placeholder="https://example.com/apply/..."
                    value={modalFormData.applicationLink}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, applicationLink: e.target.value })
                    }
                  />
                  {modalErrors.applicationLink && (
                    <div className="error-text">{modalErrors.applicationLink}</div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">
                    Job Description <span className="req">*</span>
                  </label>
                  <textarea
                    rows="3"
                    className={`form-textarea ${modalErrors.description ? 'error' : ''}`}
                    placeholder="Enter detailed role requirements and responsibilities..."
                    value={modalFormData.description}
                    onChange={(e) =>
                      setModalFormData({ ...modalFormData, description: e.target.value })
                    }
                  />
                  {modalErrors.description && (
                    <div className="error-text">{modalErrors.description}</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-secondary-link"
                  onClick={() => setIsModalOpen(false)}
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-apply-primary"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting ? 'Saving...' : editingOpp ? 'Save Changes' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notifications container */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default AdminPage;

