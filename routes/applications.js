// routes/applications.js  –  Public Application Routes (Role 2)
const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path     = require('path');
const { submitApplication } = require('../controllers/applicationController');

// ─── Multer config (resume upload) ───────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/resumes/'),
  filename:    (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF and Word documents are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }   // 5 MB max
});

// POST /applications/apply
router.post('/apply', upload.single('resume'), submitApplication);

module.exports = router;
