const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                message: 'Email is required' 
            });
        }

        // Check in donors table first
        const [donorResult] = await db.query(
            'SELECT donor_id, email FROM donors WHERE email = ?',
            [email]
        );

        if (donorResult.length > 0) {
            return res.status(200).json({ 
                role: 'donor',
                user_id: donorResult[0].donor_id,
                email: donorResult[0].email
            });
        }

        // Check in admins table
        const [adminResult] = await db.query(
            'SELECT admin_id, email FROM admins WHERE email = ?',
            [email]
        );

        if (adminResult.length > 0) {
            return res.status(200).json({ 
                role: 'admin',
                user_id: adminResult[0].admin_id,
                email: adminResult[0].email
            });
        }

        // User not found in either table
        return res.status(404).json({ 
            message: 'User not found' 
        });

    } catch (err) {
        console.error('❌ Error checking user role:', err);
        res.status(500).json({ 
            message: 'Internal server error while checking user role' 
        });
    }
});

module.exports = router;