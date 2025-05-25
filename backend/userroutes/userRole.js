// Inside your main file or a new route file like ./userroutes/userRole.js
const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if donor
    const [donor] = await db.query('SELECT donor_id FROM donors WHERE email = ?', [email]);
    if (donor.length > 0) {
      return res.json({ role: 'donor' });
    }

    // Check if admin
    const [admin] = await db.query('SELECT admin_id FROM admins WHERE email = ?', [email]);
    if (admin.length > 0) {
      return res.json({ role: 'admin' });
    }

    // Not found
    return res.status(404).json({ message: 'User not found' });

  } catch (err) {
    console.error('❌ Error fetching user role:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
