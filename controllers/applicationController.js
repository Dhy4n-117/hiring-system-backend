<<<<<<< HEAD
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
=======
// controllers/applicationController.js  (Role 2 – Public Side)
const Application = require('../models/Application');
const Job         = require('../models/Job');
const nodemailer  = require('nodemailer');

// ─── Email helper ──────────────────────────────────────────────────────────────
const sendConfirmationEmail = async (toEmail, candidateName, jobTitle) => {
  // Uses env vars set by System Architect (SMTP_USER, SMTP_PASS)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from:    `"Adversity Solutions Careers" <${process.env.SMTP_USER}>`,
      to:      toEmail,
      subject: `Application Received – ${jobTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;border:1px solid #e0e0e0;border-radius:10px;">
          <h2 style="color:#1a237e;">Application Received ✅</h2>
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> role at <strong>Adversity Solutions</strong>.</p>
          <p>We have received your application and our team will review it shortly. If your profile matches our requirements, we will reach out to you for next steps.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:0.85rem;color:#888;">
            This is an automated confirmation. Please do not reply to this email.<br/>
            © Adversity Solutions
          </p>
        </div>
      `
    });
  } catch (emailErr) {
    // Do not fail the request if email fails — just log it
    console.warn('Confirmation email failed to send:', emailErr.message);
  }
};

// ─── POST /applications/apply ──────────────────────────────────────────────────
const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter, portfolioLinks } = req.body;

    // Validate required fields
    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({ message: 'jobId, name, email, and phone are required.' });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    // Check job exists and is active
    const job = await Job.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or no longer accepting applications.' });
    }

    // Check resume was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    // Prevent duplicate applications (same email + same job)
    const existing = await Application.findOne({ jobId, email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this position.' });
    }

    // Parse optional portfolio links
    let parsedLinks = {};
    try {
      parsedLinks = portfolioLinks ? JSON.parse(portfolioLinks) : {};
    } catch {
      parsedLinks = {};
    }

    // Create application record
    const application = new Application({
      jobId,
      name:           name.trim(),
      email:          email.toLowerCase().trim(),
      phone:          phone.trim(),
      resumeUrl:      req.file.path,               // local path; swap for cloud URL if using S3/Cloudinary
      coverLetter:    coverLetter?.trim() || '',
      portfolioLinks: req.body.portfolioLinks || "",
      status:         'Applied',
      appliedAt:      new Date()
    });

    await application.save();

    // Fire-and-forget confirmation email
    sendConfirmationEmail(email, name, job.title);

    res.status(201).json({
      message: 'Application submitted successfully! A confirmation email has been sent.',
      applicationId: application._id
    });

  } catch (err) {
    console.error('submitApplication error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = { submitApplication };
>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab
