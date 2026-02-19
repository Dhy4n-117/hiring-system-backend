const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Role 1 Security Middleware
const { adminLogin, adminRegister } = require('../controllers/authController');
const { 
    createJob, 
    updateJob, 
    deleteJob 
} = require('../controllers/jobController');

// ─── AUTH ROUTES (Role 1) ──────────────────────────────────────────────────
// Used to create the initial admin and for subsequent logins
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// ─── JOB MANAGEMENT ROUTES (Role 1/3 - Protected) ──────────────────────────
// Only admins with a valid Bearer token can access these routes.
// Sampreeth (Role 3) will connect his HR Dashboard forms to these APIs.

// Create a new job listing
router.post('/jobs/create', auth, createJob);

// Update an existing job (requires job ID in the URL)
router.put('/jobs/:id', auth, updateJob);

// Remove a job from the system (requires job ID in the URL)
router.delete('/jobs/:id', auth, deleteJob);

module.exports = router;