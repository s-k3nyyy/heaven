const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    try {
        const { admin_id, email, first_name, last_name } = req.body;
        
        // Validate required fields
        if (!admin_id || !email || !first_name || !last_name) {
            return res.status(400).json({ 
                message: 'Missing required fields: admin_id, email, first_name, last_name' 
            });
        }

        // Check if admin already exists
        const [existing] = await db.query(
            'SELECT admin_id FROM admins WHERE admin_id = ? OR email = ?',
            [admin_id, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ 
                message: 'Admin already exists with this ID or email' 
            });
        }

        // Insert new admin
        const insertQuery = `
            INSERT INTO admins (admin_id, email, first_name, last_name)
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(insertQuery, [admin_id, email, first_name, last_name]);
        
        console.log('✅ Admin created successfully:', email);
        res.status(201).json({ 
            message: 'Admin created successfully',
            admin_id: admin_id 
        });

    } catch (err) {
        console.error('❌ Error creating admin:', err);
        res.status(500).json({ 
            message: 'Internal server error while creating admin' 
        });
    }
});

module.exports = router;