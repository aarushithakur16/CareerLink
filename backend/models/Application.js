// Application Model representing candidate applications for opportunities
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
      required: [true, 'Opportunity ID is required']
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    message: {
      type: String,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure a candidate cannot apply twice to the same opportunity
applicationSchema.index({ opportunity: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);

