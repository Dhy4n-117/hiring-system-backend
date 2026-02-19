// controllers/applicationController.js  (Role 2 – Public Side)
const Application = require('../models/Application');
const Job         = require('../models/Job');
const nodemailer  = require('nodemailer');

// ─── Email helper ──────────────────────────────────────────────────────────────
const sendConfirmationEmail = async (toEmail, candidateName, jobTitle) => {
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
      to:       toEmail,
      subject: `Application Received – ${jobTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;border:1px solid #e0e0e0;border-radius:10px;">
          <h2 style="color:#1a237e;">Application Received ✅</h2>
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> role at <strong>Adversity Solutions</strong>.</p>
          <p>We have received your application and our team will review it shortly.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:0.85rem;color:#888;">© Adversity Solutions</p>
        </div>
      `
    });
  } catch (emailErr) {
    console.warn('Confirmation email failed to send:', emailErr.message);
  }
};

// ─── POST /applications/apply (Role 2) ──────────────────────────────────────────
const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter, portfolioLinks } = req.body;

    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({ message: 'jobId, name, email, and phone are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    const job = await Job.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or no longer active.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const existing = await Application.findOne({ jobId, email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this position.' });
    }

    const application = new Application({
      jobId,
      name:           name.trim(),
      email:          email.toLowerCase().trim(),
      phone:          phone.trim(),
      resumeUrl:      req.file.path,
      coverLetter:    coverLetter?.trim() || '',
      portfolioLinks: portfolioLinks || "",
      status:         'Applied',
      appliedAt:      new Date()
    });

    await application.save();
    sendConfirmationEmail(email, name, job.title);

    res.status(201).json({
      message: 'Application submitted successfully!',
      applicationId: application._id
    });

  } catch (err) {
    console.error('submitApplication error:', err.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── GET /applications/all (Role 1/3 - Protected) ────────────────────────────────
const getAllApplications = async (req, res) => {
  try {
    // Only reachable if JWT auth middleware passes
    const applications = await Application.find().populate('jobId', 'title department');
    res.status(200).json(applications);
  } catch (err) {
    console.error('getAllApplications error:', err.message);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

// Ensure BOTH functions are exported for routes/applications.js to find them
module.exports = { 
    submitApplication, 
    getAllApplications 
};