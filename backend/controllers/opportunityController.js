// Controllers for Opportunity routes
const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');
const Application = require('../models/Application');

// Helper to escape regex special characters to prevent ReDoS / errors
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper to clean and format skills array:
// Trims each skill, removes empty & duplicate (case-insensitive) values, keeps max 8, max 30 chars each
const cleanSkills = (skills) => {
  if (skills === undefined || skills === null) return undefined;
  let arr = [];
  if (Array.isArray(skills)) {
    arr = skills;
  } else if (typeof skills === 'string') {
    arr = skills.split(',');
  } else {
    return [];
  }

  const seen = new Set();
  const cleaned = [];

  for (const item of arr) {
    if (typeof item === 'string') {
      const trimmed = item.trim();
      const lower = trimmed.toLowerCase();
      if (trimmed.length > 0 && !seen.has(lower)) {
        seen.add(lower);
        cleaned.push(trimmed.slice(0, 30));
        if (cleaned.length === 8) {
          break;
        }
      }
    }
  }

  return cleaned;
};

// @desc    Get all opportunities with filtering, search, pagination, and sorting
// @route   GET /api/opportunities
const getOpportunities = async (req, res, next) => {
  try {
    const { search, domain, type, experience, location, sort, page, limit } = req.query;

    const queryFilter = {};

    // Search query matches across title, company, location, domain, and skills
    if (search && search.trim()) {
      const safeSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(safeSearch, 'i');
      queryFilter.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { domain: searchRegex },
        { skills: searchRegex }
      ];
    }

    // Exact domain filter
    if (domain && domain.trim()) {
      queryFilter.domain = domain.trim();
    }

    // Exact type filter
    if (type && type.trim()) {
      queryFilter.type = type.trim();
    }

    // Exact experience filter
    if (experience && experience.trim()) {
      queryFilter.experience = experience.trim();
    }

    // Partial case-insensitive location filter
    if (location && location.trim()) {
      const safeLocation = escapeRegex(location.trim());
      queryFilter.location = new RegExp(safeLocation, 'i');
    }

    // Stable sort with tie-breaker
    const sortOption = sort === 'oldest' ? { createdAt: 1, _id: 1 } : { createdAt: -1, _id: -1 };

    // Pagination defaults and clamping
    let pageNum = parseInt(page, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      pageNum = 1;
    }

    let limitNum = parseInt(limit, 10);
    if (isNaN(limitNum) || limitNum < 1) {
      limitNum = 10;
    } else if (limitNum > 50) {
      limitNum = 50;
    }

    const total = await Opportunity.countDocuments(queryFilter);
    const pages = Math.ceil(total / limitNum) || 0;
    const skip = (pageNum - 1) * limitNum;

    const opportunities = await Opportunity.find(queryFilter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: opportunities,
      pagination: {
        total,
        page: pageNum,
        pages,
        limit: limitNum
      },
      message: 'Opportunities retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct domains sorted A to Z
// @route   GET /api/opportunities/domains
const getDomains = async (req, res, next) => {
  try {
    const domains = await Opportunity.distinct('domain');
    domains.sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      data: domains,
      message: 'Domains retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid ID format: ${id}`
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: opportunity,
      message: 'Opportunity retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new opportunity (allowed fields only)
// @route   POST /api/opportunities
const createOpportunity = async (req, res, next) => {
  try {
    const allowedFields = [
      'title',
      'company',
      'domain',
      'location',
      'experience',
      'description',
      'applicationLink',
      'type',
      'salary'
    ];

    const opportunityData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        opportunityData[field] = req.body[field];
      }
    }

    if (req.body.skills !== undefined) {
      opportunityData.skills = cleanSkills(req.body.skills);
    }

    const opportunity = await Opportunity.create(opportunityData);

    res.status(201).json({
      success: true,
      data: opportunity,
      message: 'Opportunity created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update opportunity by ID (allowed fields only, runs validators)
// @route   PUT /api/opportunities/:id
const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid ID format: ${id}`
      });
    }

    const allowedFields = [
      'title',
      'company',
      'domain',
      'location',
      'experience',
      'description',
      'applicationLink',
      'type',
      'salary'
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (req.body.skills !== undefined) {
      updateData.skills = cleanSkills(req.body.skills);
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedOpportunity) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Opportunity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOpportunity,
      message: 'Opportunity updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete opportunity by ID and its associated applications
// @route   DELETE /api/opportunities/:id
const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid ID format: ${id}`
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Opportunity not found'
      });
    }

    // Delete all applications linked to this opportunity
    await Application.deleteMany({ opportunity: id });

    // Delete the opportunity itself
    await Opportunity.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Opportunity and associated applications deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getDomains,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  cleanSkills
};

