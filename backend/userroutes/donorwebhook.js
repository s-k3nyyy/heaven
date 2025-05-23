const express = require('express');
const router = express.Router();
const db = require('../dbconnector/index');

router.post('/', async (req, res) => {
    try {
        const webhookEvent = req.body;
        console.log("Donor Webhook Event:", webhookEvent);

        if (webhookEvent.type === 'user.created' || webhookEvent.type === 'user.updated') {
            const user = webhookEvent.data;
            const donor_id = user.id;
            const email = user.email_addresses?.[0]?.email_address || null;
            const first_name = user.first_name || '';
            const last_name = user.last_name || '';
            const role = user.public_metadata?.role || '';

            // ✅ Only proceed if the role is 'donor'
            if (role !== 'donor') {
                console.log('❌ User role is not donor. Skipping insert.');
                return res.status(200).send('User role not donor, ignoring.');
            }

            // Check if donor already exists
            const [existing] = await db.query(
                'SELECT donor_id FROM donors WHERE donor_id = ? OR email = ?',
                [donor_id, email]
            );

            if (existing.length === 0) {
                const insertQuery = `
                    INSERT INTO donors (donor_id, email, first_name, last_name)
                    VALUES (?, ?, ?, ?)
                `;
                await db.query(insertQuery, [donor_id, email,  first_name, last_name]); 

                console.log('✅ Donor saved');
                res.status(200).send('Donor created and stored in database');
            } else {
                console.log('⚠️ Donor already exists');
                res.status(200).send('Donor already exists');
            }
        } else {
            res.status(200).send('Ignored event type');
        }
    } catch (err) {
        console.error('❌ Error in donor webhook:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
