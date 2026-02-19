const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true }, // [cite: 103]
  scheduledDate: { type: Date, required: true }, // [cite: 105]
  meetingLink: { type: String, required: true }, // [cite: 106] (Zoom/Meet mentioned in source 44)
  notes: { type: String },                       // [cite: 107]
  status: { type: String, default: 'Scheduled' } // [cite: 108]
});

module.exports = mongoose.model('Interview', InterviewSchema);