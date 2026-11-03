// Controllers for Application routes
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// @desc    Submit a new application for an opportunity
// @route   POST /api/applications
const createApplication = async (req, res, next) => {
  try {
    const { opportunity, name, email, phone, message } = req.body;

    if (!opportunity) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Opportunity ID is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(opportunity)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid Opportunity ID format: ${opportunity}`
      });
    }

    // Check if the opportunity exists
    const opp = await Opportunity.findById(opportunity);
    if (!opp) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Opportunity not found'
      });
    }

    // Check if the applicant already applied with this email for this opportunity
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await Application.findOne({
        opportunity,
        email: normalizedEmail
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          data: null,
          message: 'You have already applied for this opportunity with this email address'
        });
      }
    }

    // Create the application
    const application = await Application.create({
      opportunity,
      name,
      email,
      phone,
      message
    });

    // Populate opportunity title and company for the confirmation response
    const populatedApplication = await Application.findById(application._id).populate(
      'opportunity',
      'title company'
    );

    res.status(201).json({
      success: true,
      data: populatedApplication,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (admin list) with optional opportunity filter
// @route   GET /api/applications
const getApplications = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.opportunity) {
      if (!mongoose.Types.ObjectId.isValid(req.query.opportunity)) {
        return res.status(400).json({
          success: false,
          data: null,
          message: `Invalid Opportunity ID format: ${req.query.opportunity}`
        });
      }
      filter.opportunity = req.query.opportunity;
    }

    const applications = await Application.find(filter)
      .populate('opportunity', 'title company')
      .sort({ createdAt: -1, _id: -1 });

    res.status(200).json({
      success: true,
      data: applications,
      message: 'Applications retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid ID format: ${id}`
      });
    }

    const application = await Application.findById(id).populate(
      'opportunity',
      'title company'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: application,
      message: 'Application retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById
};

