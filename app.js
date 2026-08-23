const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('   Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Root route
app.get('/', (req, res) => {
    res.send('SMS Webhook Receiver is running! Use POST to /webhook/sms');
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        time: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ⭐ WEBHOOK ENDPOINT
app.post('/webhook/sms', (req, res) => {
    try {
        const payload = req.body;
        console.log('📩 Webhook received!');
        console.log('   Payload:', JSON.stringify(payload, null, 2));
        
        if (payload.event === 'sms:received' && payload.payload) {
            const { sender, message, receivedAt } = payload.payload;
            console.log(`   📱 From: ${sender}`);
            console.log(`   💬 Message: ${message}`);
            console.log(`   🕐 Received: ${receivedAt}`);
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Webhook server running on port ${port}`);
    console.log(`   Webhook URL: https://sms-webhook-receiver.onrender.com/webhook/sms`);
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});
