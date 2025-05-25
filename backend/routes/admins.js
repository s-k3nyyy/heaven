const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    try {
        const webhookEvent = req.body;
        console.log("Admin Webhook Event:", webhookEvent);

        if (webhookEvent.type === 'user.created') {
            const user = webhookEvent.data;
            const admin_id = user.id;
            const email = user.email_addresses?.[0]?.email_address || null;
            const first_name = user.first_name || '';
            const last_name = user.last_name || '';
            const role = user.public_metadata?.role || '';

            // ✅ Only proceed if the role is 'admin'
            if (role !== 'admin') {
                console.log('❌ User role is not admin. Skipping insert.');
                return res.status(200).send('User role not admin, ignoring.');
            }

            // Check if admin already exists
            const [existing] = await db.query(
                'SELECT admin_id FROM admins WHERE admin_id = ? OR email = ?',
                [admin_id, email]
            );

            if (existing.length === 0) {
                const insertQuery = `
                    INSERT INTO admins (admin_id, email, first_name, last_name)
                    VALUES (?, ?, ?, ?)
                `;
                await db.query(insertQuery, [admin_id, email, first_name, last_name]);

                console.log('✅ Admin saved');
                res.status(200).send('Admin created and stored in database');
            } else {
                console.log('⚠️ Admin already exists');
                res.status(200).send('Admin already exists');
            }
        } else {
            res.status(200).send('Ignored event type');
        }
    } catch (err) {
        console.error('❌ Error in admin webhook:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
