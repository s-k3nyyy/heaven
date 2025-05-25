const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all children
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM children ORDER BY name');
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Get a specific child by ID
router.get("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM children WHERE child_id = ?', [child_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: "Child not found" });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Create a new child record
router.post("/", async (req, res) => {
    const { name, age, gender, location, story, needs, image_url } = req.body;
    
    if (!name || !age) {
        return res.status(400).json({ 
            error: "Missing required fields", 
            required: ["name", "age"]
        });
    }
    
    try {
        const query = `
            INSERT INTO children (name, age, gender, location, story, needs, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await db.query(query, [name, age, gender, location, story, needs, image_url]);
        
        res.status(201).json({ 
            child_id: result.insertId, 
            message: "Child record created successfully" 
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Update a child record
router.put("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    const { name, age, gender, location, story, needs, image_url } = req.body;
    
    try {
        const query = `
            UPDATE children 
            SET name = ?, age = ?, gender = ?, location = ?, story = ?, needs = ?, image_url = ?
            WHERE child_id = ?
        `;
        
        const [result] = await db.query(query, [name, age, gender, location, story, needs, image_url, child_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Child not found" });
        }
        
        res.json({ message: "Child record updated successfully" });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

// Delete a child record
router.delete("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM children WHERE child_id = ?', [child_id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Child not found" });
        }
        
        res.json({ message: "Child record deleted successfully" });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

module.exports = router;