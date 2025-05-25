const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        console.log('Checking user role for email:', email);

        // Check in donors table first
        const [donorResult] = await db.query(
            'SELECT donor_id, email FROM donors WHERE email = ?',
            [email]
        );

        if (donorResult.length > 0) {
            console.log('User found in donors table');
            return res.status(200).json({ role: 'donor', userId: donorResult[0].donor_id });
        }

        // Check in admins table
        const [adminResult] = await db.query(
            'SELECT admin_id, email FROM admins WHERE email = ?',
            [email]
        );

        if (adminResult.length > 0) {
            console.log('User found in admins table');
            return res.status(200).json({ role: 'admin', userId: adminResult[0].admin_id });
        }

        // User not found in database
        console.log('User not found in database');
        return res.status(404).json({ error: 'User not found in database' });

    } catch (error) {
        console.error('Error checking user role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;module.exports = router;