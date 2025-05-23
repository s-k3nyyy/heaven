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

// Create a new donor
router.post("/", async (req, res) => {
    const { donor_id, first_name, last_name, email, phone } = req.body;

    // Basic email format check
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO donors (donor_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)',
            [donor_id, first_name, last_name, email, phone]
        );
        res.status(201).json({ donor_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a donor
router.put("/:donor_id", async (req, res) => {
    const { donor_id } = req.params;
    const { first_name, last_name, email, phone } = req.body;

    // Basic email format check
    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const [result] = await db.query(
            'UPDATE donors SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE donor_id = ?',
            [first_name, last_name, email, phone, donor_id]
        );
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
