const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Create a new donor
router.post('/', async (req, res) => {
    try {
        const { id, email, first_name, last_name, role } = req.body;
        
        console.log('Creating donor:', { id, email, first_name, last_name });

        // Check if donor already exists
        const [existing] = await db.query(
            'SELECT donor_id FROM donors WHERE donor_id = ? OR email = ?',
            [id, email]
        );

        if (existing.length > 0) {
            console.log('Donor already exists');
            return res.status(200).json({ message: 'Donor already exists' });
        }

        // Insert new donor
        const insertQuery = `
            INSERT INTO donors (donor_id, email, first_name, last_name)
            VALUES (?, ?, ?, ?)
        `;
        
        await db.query(insertQuery, [id, email, first_name, last_name]);
        
        console.log('✅ Donor created successfully');
        res.status(201).json({ message: 'Donor created successfully' });

    } catch (error) {
        console.error('❌ Error creating donor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all donors
router.get('/', async (req, res) => {
    try {
        const [donors] = await db.query('SELECT * FROM donors');
        res.status(200).json(donors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [donor] = await db.query('SELECT * FROM donors WHERE donor_id = ?', [id]);
        
        if (donor.length === 0) {
            return res.status(404).json({ error: 'Donor not found' });
        }
        
        res.status(200).json(donor[0]);
    } catch (error) {
        console.error('Error fetching donor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;