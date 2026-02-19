const mongoose = require('mongoose');
<<<<<<< HEAD
const bcrypt = require('bcryptjs');
=======
>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
<<<<<<< HEAD
  role: { type: String, default: 'admin' },
});

// Hash password before saving
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
=======
  role: { type: String, default: "admin" } // [cite: 80]
>>>>>>> 826601a2bf445dfa02ec4ef5905ad47b38749bab
});

module.exports = mongoose.model('Admin', AdminSchema);