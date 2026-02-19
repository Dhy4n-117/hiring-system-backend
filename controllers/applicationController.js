const mongoose = require('mongoose');
const Application = require('../models/Application');

// @desc    Get all applications with optional filters
// @route   GET /applications
// @access  Protected
const getApplications = async (req, res) => {
    try {
        const { status, jobId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (jobId) {
            if (!mongoose.Types.ObjectId.isValid(jobId)) {
                return res.status(400).json({ message: 'Invalid jobId format' });
            }
            filter.jobId = new mongoose.Types.ObjectId(jobId);
        }

        const applications = await Application.find(filter)
            .populate('jobId', 'title department location')
            .sort({ appliedAt: -1 });

        return res.status(200).json(applications);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update application status, interviewDate, notes
// @route   PATCH /applications/:id/status
// @access  Protected
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, interviewDate, notes } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updateFields = { status };
        if (interviewDate !== undefined) updateFields.interviewDate = interviewDate;
        if (notes !== undefined) updateFields.notes = notes;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        return res.status(200).json(application);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getApplications, updateApplicationStatus };
