// routes/jobs.js  –  Public Job Routes (Role 2)
const express = require('express');
const router  = express.Router();
const { getAllJobs, getJobById, createJob } = require('../controllers/jobController');

// GET /jobs           – List all active jobs (with optional query filters)
// GET /jobs/:id       – Get single job details
router.get('/',    getAllJobs);
router.get('/:id', getJobById);

module.exports = router;

//TEMP
router.post('/create', createJob); // Add this line