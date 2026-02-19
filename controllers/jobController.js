const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /jobs
// @access  Protected
const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            createdBy: req.admin.id,
        });
        return res.status(201).json(job);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all jobs
// @route   GET /jobs
// @access  Protected
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        return res.status(200).json(jobs);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single job
// @route   GET /jobs/:id
// @access  Protected
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json(job);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a job
// @route   PUT /jobs/:id
// @access  Protected
const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json(job);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a job
// @route   DELETE /jobs/:id
// @access  Protected
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update job status
// @route   PATCH /jobs/:id/status
// @access  Protected
const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const job = await Job.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        return res.status(200).json(job);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob, updateJobStatus };
