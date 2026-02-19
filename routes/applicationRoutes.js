const express = require('express');
const router = express.Router();
const {
    getApplications,
    updateApplicationStatus,
} = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.get('/', getApplications);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
