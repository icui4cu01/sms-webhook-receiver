const express = require('express');
const app = express();

// This is the ONLY middleware you need
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// ⭐ THE WEBHOOK ENDPOINT - This MUST be EXACTLY this
app.post('/webhook/sms', (req, res) => {
    console.log('📩 Webhook received:', req.body);
    // Always respond with 200
    res.status(200).json({ success: true });
});

// Root route
app.get('/', (req, res) => {
    res.send('SMS Webhook Receiver is running! Use POST to /webhook/sms');
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Webhook server running on port ${port}`);
});
