// donationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

// Helper function to check if admin exists
const checkAdminExists = async (admin_id) => {
    try {
        console.log(`Checking if admin exists with admin_id: ${admin_id}`);
        const [rows] = await db.query('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);
        return rows.length > 0;
    } catch (err) {
        console.error("Error checking admin existence:", err);
        return false;
    }
};

// Get all donations
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM donations');
        res.json(rows);
    } catch (err) {
        console.error("Error fetching donations:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Create a new donation
router.post("/", async (req, res) => {
    const { donor_id, admin_id, amount, date } = req.body;

    // Check if admin_id exists
    const adminExists = await checkAdminExists(admin_id);
    if (!adminExists) {
        return res.status(400).json({ error: "Admin ID does not exist" });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO donations (donor_id, admin_id, amount, date) VALUES (?, ?, ?, ?)', 
            [donor_id, admin_id, amount, date]
        );
        res.status(201).json({ donation_id: result.insertId });
    } catch (err) {
        console.error("Error inserting donation:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// Update a donation
router.put("/:donation_id/admin/:admin_id", async (req, res) => {
    const { donation_id, admin_id } = req.params;
    const { amount } = req.body;

    // Validate amount
    if (amount == null || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. Must be a positive number." });
    }

    // Validate admin_id
    if (!admin_id || typeof admin_id !== "string" || admin_id.trim() === "") {
        return res.status(400).json({ error: "Invalid admin_id. Must be a non-empty string." });
    }

    try {
        // Check if the donation exists
        const [donationRows] = await db.query(
            'SELECT * FROM donations WHERE donation_id = ?',
            [donation_id]
        );

        if (donationRows.length === 0) {
            return res.status(404).json({ error: "Donation not found" });
        }

        // Update donation
        const [result] = await db.query(
            'UPDATE donations SET amount = ?, admin_id = ? WHERE donation_id = ?',
            [amount, admin_id, donation_id]
        );

        res.json({ message: "Donation updated successfully" });
    } catch (err) {
        console.error("Error updating donation:", err);
        res.status(500).json({ error: "Database error" });
    }
});



// Delete a donation
router.delete("/:donation_id", async (req, res) => {
    const { donation_id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM donations WHERE donation_id = ?', [donation_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Donation not found" });
        }
        res.json({ message: "Donation deleted successfully" });
    } catch (err) {
        console.error("Error deleting donation:", err);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router; 
