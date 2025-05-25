// successStoryRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Get all success stories
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM success_stories');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new success story
router.post("/", async (req, res) => {
    const { orphanage_id, title, content, date } = req.body;
    try {
        const [result] = await db.query('INSERT INTO success_stories (orphanage_id, title, content, date) VALUES (?, ?, ?, ?)', [orphanage_id, title, content, date]);
        res.status(201).json({ story_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a success story
router.put("/:story_id", async (req, res) => {
    const { story_id } = req.params;
    const { orphanage_id, title, content, date } = req.body;
    try {
        const [result] = await db.query('UPDATE success_stories SET orphanage_id = ?, title = ?, content = ?, date = ? WHERE story_id = ?', [orphanage_id, title, content, date, story_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.json({ message: "Story updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

// Delete a success story
router.delete("/:story_id", async (req, res) => {
    const { story_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM success_stories WHERE story_id = ?', [story_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Story not found" });
        }
        res.json({ message: "Story deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
