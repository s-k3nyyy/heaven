const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all children
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM children');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Get a single child by ID
router.get("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM children WHERE child_id = ?', [child_id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Child not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new child
router.post("/", async (req, res) => {
    const { admin_id, name, age, gender, bio } = req.body;

    // Basic validation
    if (!admin_id || !name || typeof age !== 'number' || !gender) {
        return res.status(400).json({ error: "Missing or invalid required fields" });
    }

    // Optional: Check if admin exists
    /*
    const [admin] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);
    if (admin.length === 0) {
        return res.status(400).json({ error: "Admin ID does not exist" });
    }
    */

    try {
        const [result] = await db.query(
            'INSERT INTO children (admin_id, name, age, gender, bio) VALUES (?, ?, ?, ?, ?)', 
            [admin_id, name, age, gender, bio]
        );

        res.status(201).json({
            message: "Child created successfully",
            child: {
                child_id: result.insertId,
                admin_id,
                name,
                age,
                gender,
                bio,
                is_sponsored: false
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a child's information
router.put("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    const updates = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM children WHERE child_id = ?', [child_id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Child not found" });
        }

        const currentChild = rows[0];

        const updatedChild = {
            name: updates.name !== undefined ? updates.name : currentChild.name,
            age: updates.age !== undefined ? updates.age : currentChild.age,
            gender: updates.gender !== undefined ? updates.gender : currentChild.gender,
            bio: updates.bio !== undefined ? updates.bio : currentChild.bio,
            is_sponsored: updates.is_sponsored !== undefined ? updates.is_sponsored : currentChild.is_sponsored
        };

        const [result] = await db.query(
            'UPDATE children SET name = ?, age = ?, gender = ?, bio = ?, is_sponsored = ? WHERE child_id = ?',
            [updatedChild.name, updatedChild.age, updatedChild.gender, updatedChild.bio, updatedChild.is_sponsored, child_id]
        );

        res.json({ message: "Child updated successfully", updated: updatedChild });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a child
router.delete("/:child_id", async (req, res) => {
    const { child_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM children WHERE child_id = ?', [child_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Child not found" });
        }
        res.json({ message: "Child deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;

