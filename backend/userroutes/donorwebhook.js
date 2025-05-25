const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    console.log('📥 Donor webhook called with body:', req.body);
    
    try {
        const { donor_id, email, first_name, last_name } = req.body;
        
        // Validate required fields
        if (!donor_id || !email || !first_name || !last_name) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                message: 'Missing required fields: donor_id, email, first_name, last_name' 
            });
        }

        // Test database connection
        try {
            await db.query('SELECT 1');
            console.log('✅ Database connection successful');
        } catch (dbError) {
            console.error('❌ Database connection failed:', dbError);
            return res.status(500).json({ 
                message: 'Database connection failed' 
            });
        }

        // Check if donor already exists
        const [existing] = await db.query(
            'SELECT donor_id FROM donors WHERE donor_id = ? OR email = ?',
            [donor_id, email]
        );

        if (existing.length > 0) {
            console.log('⚠️ Donor already exists');
            return res.status(409).json({ 
                message: 'Donor already exists with this ID or email' 
            });
        }

        // Insert new donor
        const insertQuery = `
            INSERT INTO donors (donor_id, email, first_name, last_name)
            VALUES (?, ?, ?, ?)
        `;
        
        const result = await db.query(insertQuery, [donor_id, email, first_name, last_name]);
        
        console.log('✅ Donor created successfully:', email);
        res.status(201).json({ 
            message: 'Donor created successfully',
            donor_id: donor_id,
            insertId: result.insertId
        });

    } catch (err) {
        console.error('❌ Error creating donor:', err);
        
        // Send more specific error information
        if (err.code) {
            return res.status(500).json({ 
                message: `Database error: ${err.code}`,
                detail: err.message
            });
        }
        
        res.status(500).json({ 
            message: 'Internal server error while creating donor',
            error: err.message
        });
    }
});

module.exports = router;