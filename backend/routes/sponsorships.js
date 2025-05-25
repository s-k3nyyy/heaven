const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all sponsorships with related data
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT 
                s.sponsorship_id,
                s.start_date,
                s.end_date,
                s.status,
                s.sponsorship_type,
                s.amount,
                s.duration,
                d.name as sponsor_name,
                d.email as sponsor_email,
                c.name as child_name,
                c.age as child_age
            FROM sponsorships s
            LEFT JOIN donors d ON s.donor_id = d.donor_id
            LEFT JOIN children c ON s.child_id = c.child_id
            ORDER BY s.start_date DESC
        `;
        
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Get a specific sponsorship by ID
router.get("/:sponsorship_id", async (req, res) => {
    const { sponsorship_id } = req.params;
    try {
        const query = `
            SELECT 
                s.sponsorship_id,
                s.start_date,
                s.end_date,
                s.status,
                s.sponsorship_type,
                s.amount,
                s.duration,
                d.name as sponsor_name,
                d.email as sponsor_email,
                d.phone as sponsor_phone,
                c.name as child_name,
                c.age as child_age
            FROM sponsorships s
            LEFT JOIN donors d ON s.donor_id = d.donor_id
            LEFT JOIN children c ON s.child_id = c.child_id
            WHERE s.sponsorship_id = ?
        `;
        
        const [rows] = await db.query(query, [sponsorship_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Sponsorship not found" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Create a new sponsorship
router.post("/", async (req, res) => {
    const { donor_id, child_id, start_date, end_date, status, sponsorship_type, amount, duration } = req.body;
    
    // Validate required fields
    if (!donor_id || !child_id || !start_date || !status || !sponsorship_type || !amount || !duration) {
        return res.status(400).json({ 
            error: "Missing required fields", 
            required: ["donor_id", "child_id", "start_date", "status", "sponsorship_type", "amount", "duration"]
        });
    }
    
    try {
        const query = `
            INSERT INTO sponsorships 
            (donor_id, child_id, start_date, end_date, status, sponsorship_type, amount, duration) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [
            donor_id, child_id, start_date, end_date, status, sponsorship_type, amount, duration
        ]);
        
        res.status(201).json({ 
            sponsorship_id: result.insertId, 
            message: "Sponsorship created successfully" 
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Update a sponsorship
router.put("/:sponsorship_id", async (req, res) => {
    const { sponsorship_id } = req.params;
    const { donor_id, child_id, start_date, end_date, status, sponsorship_type, amount, duration } = req.body;
    
    try {
        const query = `
            UPDATE sponsorships 
            SET donor_id = ?, child_id = ?, start_date = ?, end_date = ?, 
                status = ?, sponsorship_type = ?, amount = ?, duration = ?
            WHERE sponsorship_id = ?
        `;
        
        const [result] = await db.query(query, [
            donor_id, child_id, start_date, end_date, status, sponsorship_type, amount, duration, sponsorship_id
        ]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sponsorship not found" });
        }
        
        res.json({ message: "Sponsorship updated successfully" });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
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
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Get sponsorships by donor
router.get("/donor/:donor_id", async (req, res) => {
    const { donor_id } = req.params;
    try {
        const query = `
            SELECT 
                s.sponsorship_id,
                s.start_date,
                s.end_date,
                s.status,
                s.sponsorship_type,
                s.amount,
                s.duration,
                c.name as child_name,
                c.age as child_age
            FROM sponsorships s
            LEFT JOIN children c ON s.child_id = c.child_id
            WHERE s.donor_id = ?
            ORDER BY s.start_date DESC
        `;
        
        const [rows] = await db.query(query, [donor_id]);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Get sponsorships by child
router.get("/child/:child_id", async (req, res) => {
    const { child_id } = req.params;
    try {
        const query = `
            SELECT 
                s.sponsorship_id,
                s.start_date,
                s.end_date,
                s.status,
                s.sponsorship_type,
                s.amount,
                s.duration,
                d.name as sponsor_name,
                d.email as sponsor_email
            FROM sponsorships s
            LEFT JOIN donors d ON s.donor_id = d.donor_id
            WHERE s.child_id = ?
            ORDER BY s.start_date DESC
        `;
        
        const [rows] = await db.query(query, [child_id]);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;