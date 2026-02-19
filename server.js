const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const connectDB = require('./config/db');
=======
const connectDB = require('./config/db'); // Import DB logic
>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab
require('dotenv').config();

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
<<<<<<< HEAD
app.use(express.json());

// 3. Routes
app.use('/admin', require('./routes/adminRoutes'));
app.use('/jobs', require('./routes/jobRoutes'));
app.use('/applications', require('./routes/applicationRoutes'));

const PORT = process.env.PORT || 5000;

=======
app.use(express.json()); // Allows us to parse JSON in request bodies

// 3. Define Routes (We will fill these files in Day 2)
// For now, these lines are commented out so the server doesn't crash
// app.use('/api/auth', require('./auth/routes'));
// app.use('/api/jobs', require('./jobs/routes'));
// app.use('/api/applications', require('./applications/routes'));
// app.use('/api/admin', require('./admin/routes'));

const PORT = process.env.PORT || 5000;

// 3. Define Routes
const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));