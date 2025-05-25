const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all donors
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM donors');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new donor or return existing one
router.post("/", async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        // Check if donor already exists
        const [existingDonor] = await db.query('SELECT * FROM donors WHERE email = ?', [email]);
        
        if (existingDonor.length > 0) {
            // Update existing donor information
            await db.query('UPDATE donors SET name = ?, phone = ? WHERE email = ?', [name, phone, email]);
            return res.json({ donor_id: existingDonor[0].donor_id, message: "Donor updated" });
        }
        
        // Create new donor
        const [result] = await db.query('INSERT INTO donors (name, email, phone) VALUES (?, ?, ?)', [name, email, phone]);
        res.status(201).json({ donor_id: result.insertId, message: "Donor created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a donor
router.put("/:donor_id", async (req, res) => {
    const { donor_id } = req.params;
    const { name, email, phone } = req.body;
    try {
        const [result] = await db.query('UPDATE donors SET name = ?, email = ?, phone = ? WHERE donor_id = ?', [name, email, phone, donor_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Donor not found" });
        }
        res.json({ message: "Donor updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a donor
router.delete("/:donor_id", async (req, res) => {
    const { donor_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM donors WHERE donor_id = ?', [donor_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Donor not found" });
        }
        res.json({ message: "Donor deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;