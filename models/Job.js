const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },          // [cite: 81]
  department: { type: String, required: true },     // [cite: 82]
  location: { type: String, required: true },       // [cite: 83]
  description: { type: String, required: true },    // [cite: 84]
  requirements: { type: String, required: true },   // [cite: 85]
  employmentType: { type: String, required: true }, // [cite: 86]
  isActive: { type: Boolean, default: true },       // [cite: 87]
  createdAt: { type: Date, default: Date.now }      // [cite: 88]
});

module.exports = mongoose.model('Job', JobSchema);