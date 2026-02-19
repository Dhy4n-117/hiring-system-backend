const mongoose = require('mongoose');

<<<<<<< HEAD
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
=======
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
>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab

module.exports = mongoose.model('Job', JobSchema);