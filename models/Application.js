const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // [cite: 92]
  name: { type: String, required: true },       // [cite: 93]
  email: { type: String, required: true },      // [cite: 94]
  phone: { type: String, required: true },      // [cite: 95]
  resumeUrl: { type: String, required: true },  // [cite: 96]
  coverLetter: { type: String },                // [cite: 97]
  portfolioLinks: { type: String },             // [cite: 98]
  status: {                                     // [cite: 99]
    type: String,
    enum: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Offer Sent', 'Hired', 'Rejected'], // [cite: 31-38]
    default: 'Applied'
  },
  interviewDate: { type: Date },
  notes: { type: String },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);