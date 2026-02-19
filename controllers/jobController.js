// controllers/jobController.js  (Role 2 & Role 3)
const Job = require('../models/Job');

// ─── PUBLIC ROUTES (Role 2) ──────────────────────────────────────────────────

// GET /api/jobs
exports.getAllJobs = async (req, res) => {
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

// GET /api/jobs/:id
exports.getJobById = async (req, res) => {
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

// ─── ADMIN ROUTES (Role 1/3 - Protected) ──────────────────────────────────────

// POST /api/admin/jobs/create
exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/admin/jobs/:id (Unblocks Sampreeth)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // returns the updated doc & validates
    );
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    console.error('updateJob error:', err.message);
    res.status(500).json({ message: 'Server error while updating job.' });
  }
};

// DELETE /api/admin/jobs/:id (Unblocks Sampreeth)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error('deleteJob error:', err.message);
    res.status(500).json({ message: 'Server error while deleting job.' });
  }
};