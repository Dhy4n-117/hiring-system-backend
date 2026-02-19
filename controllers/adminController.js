const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Login admin
// @route   POST /admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const payload = {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /admin/stats
// @access  Protected
const getDashboardStats = async (req, res) => {
    try {
        const [totalJobs, totalApplications, pendingApplications, shortlistedApplications] =
            await Promise.all([
                Job.countDocuments(),
                Application.countDocuments(),
                Application.countDocuments({ status: 'Applied' }),
                Application.countDocuments({ status: 'Shortlisted' }),
            ]);

        return res.status(200).json({
            totalJobs,
            totalApplications,
            pendingApplications,
            shortlistedApplications,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginAdmin, getDashboardStats };
