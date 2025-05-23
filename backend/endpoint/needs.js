const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all needs
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM needs');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new need
router.post("/", async (req, res) => {
    const {
        admin_id,
        category,
        title,
        description,
        amount_needed,
        amount_received = 0.00,
        is_urgent = 0,
        is_fulfilled = 0
    } = req.body;

    try {
        const [result] = await db.query(`
            INSERT INTO needs (
                admin_id, category, title, description,
                amount_needed, amount_received, is_urgent, is_fulfilled, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `, [admin_id, category, title, description, amount_needed, amount_received, is_urgent, is_fulfilled]);

        res.status(201).json({ need_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a need
router.put("/:need_id", async (req, res) => {
    const { need_id } = req.params;
    const {
        admin_id,
        category,
        title,
        description,
        amount_needed,
        amount_received,
        is_urgent,
        is_fulfilled
    } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE needs SET
                admin_id = ?, category = ?, title = ?, description = ?,
                amount_needed = ?, amount_received = ?, is_urgent = ?, is_fulfilled = ?
            WHERE need_id = ?
        `, [admin_id, category, title, description, amount_needed, amount_received, is_urgent, is_fulfilled, need_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Need not found" });
        }
        res.json({ message: "Need updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a need
router.delete("/:need_id", async (req, res) => {
    const { need_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM needs WHERE need_id = ?', [need_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Need not found" });
        }
        res.json({ message: "Need deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
