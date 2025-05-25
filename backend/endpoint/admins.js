const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Create a new admin
router.post('/', async (req, res) => {
    try {
        const { id, email, first_name, last_name, role } = req.body;
        
        console.log('Creating admin:', { id, email, first_name, last_name });

        // Check if admin already exists
        const [existing] = await db.query(
            'SELECT admin_id FROM admins WHERE admin_id = ? OR email = ?',
            [id, email]
        );

        if (existing.length > 0) {
            console.log('Admin already exists');
            return res.status(200).json({ message: 'Admin already exists' });
        }

        // Insert new admin
        const insertQuery = `
            INSERT INTO admins (admin_id, email, first_name, last_name)
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(insertQuery, [id, email, first_name, last_name]);
        
        console.log('✅ Admin created successfully');
        res.status(201).json({ message: 'Admin created successfully' });

    } catch (error) {
        console.error('❌ Error creating admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all admins
router.get('/', async (req, res) => {
    try {
        const [admins] = await db.query('SELECT * FROM admins');
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get admin by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [admin] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [id]);
        
        if (admin.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        
        res.status(200).json(admin[0]);
    } catch (error) {
        console.error('Error fetching admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;