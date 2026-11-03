// Opportunity Model representing internship and job postings
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    experience: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: {
        values: ['Fresher', '0-1 years', '1-2 years', '2-3 years'],
        message: '{VALUE} is not a valid experience level'
      },
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    applicationLink: {
      type: String,
      required: [true, 'Application link is required'],
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid http or https URL']
    },
    type: {
      type: String,
      required: [true, 'Opportunity type is required'],
      enum: {
        values: ['Internship', 'Job'],
        message: '{VALUE} is not a valid opportunity type'
      },
      default: 'Internship',
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    salary: {
      type: String,
      maxlength: [60, 'Salary cannot exceed 60 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes to speed up common queries
opportunitySchema.index({ domain: 1 });
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);

