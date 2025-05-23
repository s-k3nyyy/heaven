const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all sponsorships
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM sponsorships');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new sponsorship
router.post("/", async (req, res) => {
    const { donor_id, child_id, start_date, end_date, status } = req.body;
    try {
        const [result] = await db.query('INSERT INTO sponsorships (donor_id, child_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)', [donor_id, child_id, start_date, end_date, status]);
        res.status(201).json({ sponsorship_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a sponsorship
router.put("/:sponsorship_id", async (req, res) => {
    const { sponsorship_id } = req.params;
    const { donor_id, child_id, start_date, end_date, status } = req.body;
    try {
        const [result] = await db.query('UPDATE sponsorships SET donor_id = ?, child_id = ?, start_date = ?, end_date = ?, status = ? WHERE sponsorship_id = ?', [donor_id, child_id, start_date, end_date, status, sponsorship_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sponsorship not found" });
        }
        res.json({ message: "Sponsorship updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a sponsorship
router.delete("/:sponsorship_id", async (req, res) => {
    const { sponsorship_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM sponsorships WHERE sponsorship_id = ?', [sponsorship_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sponsorship not found" });
        }
        res.json({ message: "Sponsorship deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
