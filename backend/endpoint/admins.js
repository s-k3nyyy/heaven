const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');  // Assuming dbconnector is correctly configured

// Get all admins
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM admins');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Get a specific admin by ID
router.get("/:admin_id", async (req, res) => {
    const { admin_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new admin
router.post("/", async (req, res) => {
    const { admin_id, email, created_at, first_name, last_name } = req.body;
    try {
        const [result] = await db.query('INSERT INTO admins (admin_id, email, created_at, first_name, last_name) VALUES (?, ?, ?, ?, ?)', 
            [admin_id, email, created_at, first_name, last_name]);
        res.status(201).json({ admin_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update an admin
router.put("/:admin_id", async (req, res) => {
    const { admin_id } = req.params;
    const { email, created_at, first_name, last_name } = req.body;
    try {
        const [result] = await db.query('UPDATE admins SET email = ?, created_at = ?, first_name = ?, last_name = ? WHERE admin_id = ?', 
            [email, created_at, first_name, last_name, admin_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ message: "Admin updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete an admin
router.delete("/:admin_id", async (req, res) => {
    const { admin_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM admins WHERE admin_id = ?', [admin_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
