const express = require('express');
const router = express.Router();
const { loginAdmin, getDashboardStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /admin/login — public
router.post('/login', loginAdmin);

// GET /admin/stats — protected
router.get('/stats', authMiddleware, getDashboardStats);

module.exports = router;
