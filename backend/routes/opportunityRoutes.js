// Routes for Opportunity endpoints
const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getDomains,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');

// Domain list endpoint - MUST be defined before /:id so "domains" is not treated as an ID
router.get('/domains', getDomains);

// List opportunities with filtering & pagination, and create a new opportunity
router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

// Specific opportunity operations by ID
router.route('/:id')
  .get(getOpportunityById)
  .put(updateOpportunity)
  .delete(deleteOpportunity);

module.exports = router;

