const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    employmentType: { type: String, required: true },
    salary: { type: String },
    status: { type: String, default: 'open' },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);