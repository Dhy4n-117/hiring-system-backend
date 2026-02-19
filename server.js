const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Routes
app.use('/admin', require('./routes/adminRoutes'));
app.use('/jobs', require('./routes/jobRoutes'));
app.use('/applications', require('./routes/applicationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));