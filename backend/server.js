const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./dbconnector');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;
  


// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const donorWebhook = require('./userroutes/donorwebhook');
const adminWebhook = require('./userroutes/adminwebhook');
const donationRoutes = require('./endpoint/donations');
const childrenRoutes = require('./endpoint/children');
const sponsorshipRoutes = require('./endpoint/sponsorships');
const needsRoutes = require('./endpoint/needs');
const reportRoutes = require('./endpoint/reports');
const successStoriesRoutes = require('./endpoint/sucessfulstories');

// Route Setup
app.use('/webhook/donors', donorWebhook);
app.use('/webhook/admins', adminWebhook);
app.use('/api/donations', donationRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/needs', needsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/successstories', successStoriesRoutes);

// Server Start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
