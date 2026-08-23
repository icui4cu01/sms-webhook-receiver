const express = require('express');
const app = express();

// ============================================
// MIDDLEWARE
// ============================================
// Parse JSON bodies (required for webhooks)
app.use(express.json());

// Log all incoming requests (helps with debugging)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('   Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// ============================================
// ROUTES
// ============================================

// 1. Root route - shows the service is running
app.get('/', (req, res) => {
    res.send(`
        <h1>✅ SMS Webhook Receiver is running!</h1>
        <p>Use POST to <code>/webhook/sms</code></p>
        <p>Health check: <a href="/health">/health</a></p>
    `);
});

// 2. Health check - for Render and testing
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        time: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 3. ⭐ THE WEBHOOK ENDPOINT ⭐
// This is what SMS Gate will call when you receive an SMS
app.post('/webhook/sms', (req, res) => {
    try {
        const payload = req.body;
        
        console.log('📩 Webhook received!');
        console.log('   Event:', payload.event || 'unknown');
        console.log('   Device:', payload.deviceId || 'unknown');
        console.log('   Payload:', JSON.stringify(payload, null, 2));
        
        // If it's an SMS received event, log the important parts
        if (payload.event === 'sms:received' && payload.payload) {
            const { sender, message, receivedAt, messageId } = payload.payload;
            console.log(`   📱 From: ${sender}`);
            console.log(`   💬 Message: ${message}`);
            console.log(`   🕐 Received: ${receivedAt}`);
            console.log(`   🆔 Message ID: ${messageId}`);
        }
        
        // Always respond with 200 within 30 seconds (SMS Gate requirement)
        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Error processing webhook:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 4. Catch-all for undefined routes (returns 404)
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.url}`,
        available: {
            root: 'GET /',
            health: 'GET /health',
            webhook: 'POST /webhook/sms'
        }
    });
});

// ============================================
// START SERVER
// ============================================
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
    console.log('========================================');
    console.log('✅ Webhook server is running!');
    console.log(`   Port: ${port}`);
    console.log(`   URL: https://sms-webhook-receiver.onrender.com`);
    console.log('========================================');
    console.log('');
    console.log('📋 Available endpoints:');
    console.log(`   GET  /           - Root (this page)`);
    console.log(`   GET  /health     - Health check`);
    console.log(`   POST /webhook/sms - Webhook endpoint (for SMS Gate)`);
    console.log('');
    console.log('📱 To test, send a POST to:');
    console.log(`   https://sms-webhook-receiver.onrender.com/webhook/sms`);
    console.log('========================================');
});

// ============================================
// ERROR HANDLING (optional but good practice)
// ============================================

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled Rejection:', error);
});
