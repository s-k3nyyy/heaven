const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all reports
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM reports');
        res.json(rows);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new report
router.post("/", async (req, res) => {
    const {
        admin_id,
        report_name,
        donor_name,
        amount,
        usage_details,
        used_on
    } = req.body;

    try {
        const [result] = await db.query(
            'INSERT INTO reports (admin_id, report_name, donor_name, amount, usage_details, used_on) VALUES (?, ?, ?, ?, ?, ?)',
            [admin_id, report_name, donor_name, amount, usage_details, used_on]
        );
        res.status(201).json({ report_id: result.insertId });
    } catch (err) {
        console.error("Error inserting report:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a report
router.put("/:report_id", async (req, res) => {
    const { report_id } = req.params;
    const {
        admin_id,
        report_name,
        donor_name,
        amount,
        usage_details,
        used_on
    } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE reports SET admin_id = ?, report_name = ?, donor_name = ?, amount = ?, usage_details = ?, used_on = ? WHERE report_id = ?',
            [admin_id, report_name, donor_name, amount, usage_details, used_on, report_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.json({ message: "Report updated successfully" });
    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a report
router.delete("/:report_id", async (req, res) => {
    const { report_id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM reports WHERE report_id = ?',
            [report_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        res.json({ message: "Report deleted successfully" });
    } catch (err) {
        console.error("Error deleting report:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;

