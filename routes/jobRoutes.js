const express = require('express');
const router = express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    updateJobStatus,
} = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.post('/', createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.patch('/:id/status', updateJobStatus);

module.exports = router;
