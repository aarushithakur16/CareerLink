// Routes for Application endpoints
const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById
} = require('../controllers/applicationController');

// Submit new application or view all applications
router.route('/')
  .post(createApplication)
  .get(getApplications);

// View single application by ID
router.route('/:id')
  .get(getApplicationById);

module.exports = router;

