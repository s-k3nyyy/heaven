const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Server is running', 
        timestamp: new Date().toISOString(),
        message: 'Signup webhooks are working!'
    });
});

// Load webhook routes
console.log('Loading webhook routes...');
const donorWebhook = require('./userroutes/donorwebhook');
const adminWebhook = require('./userroutes/adminwebhook');
const userRoleRoute = require('./userroutes/userRole');

// Load API routes
const sponsorshipsRoutes = require('./routes/sponsorships');
const donorsRoutes = require('./routes/donors');

// Register webhook routes
app.use('/webhook/donors', donorWebhook);
app.use('/webhook/admins', adminWebhook);
console.log('✅ Webhook routes loaded successfully');

// Register working API routes
app.use('/api/userrole', userRoleRoute);
app.use('/api/sponsorships', sponsorshipsRoutes);
app.use('/api/donors', donorsRoutes);

// Temporary message for other API endpoints
const tempHandler = (routeName) => (req, res) => {
    res.status(200).json({ 
        message: `${routeName} API is temporarily offline while fixing route issues`,
        note: 'Signup functionality is working fine!'
    });
};

// Register temporary handlers for other routes
app.use('/api/donations', tempHandler('Donations'));
app.use('/api/children', tempHandler('Children'));
app.use('/api/needs', tempHandler('Needs'));
app.use('/api/reports', tempHandler('Reports'));
app.use('/api/successstories', tempHandler('Success Stories'));

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log('✅ Signup functionality is ready!');
    console.log('✅ Sponsorships and Donors API routes are active!');
});