// controllers/jobController.js  (Role 2 – Public Side)
const Job = require('../models/Job');   // Model provided by System Architect

// GET /jobs
// Supports query params: ?department=Engineering&location=Bangalore
const getAllJobs = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.department) filter.department = req.query.department;
    if (req.query.location)   filter.location   = req.query.location;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error('getAllJobs error:', err.message);
    res.status(500).json({ message: 'Server error while fetching jobs.' });
  }
};

// GET /jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, isActive: true });
    if (!job) return res.status(404).json({ message: 'Job not found or no longer active.' });
    res.status(200).json(job);
  } catch (err) {
    console.error('getJobById error:', err.message);
    if (err.kind === 'ObjectId')
      return res.status(400).json({ message: 'Invalid job ID.' });
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { getAllJobs, getJobById };
