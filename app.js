const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

// Health check - this is working ✅
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// ✅ THIS IS THE MISSING ENDPOINT - The POST handler for webhooks
app.post('/webhook/sms', (req, res) => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    console.log(`\n📩 Webhook received at ${timestamp}`);
    console.log('Payload:', JSON.stringify(req.body, null, 2));
    
    // Always respond with 200 within 30 seconds (SMS Gate requirement)
    res.status(200).json({ success: true });
});

// Root route
app.get('/', (req, res) => {
    res.send('SMS Webhook Receiver is running! Use POST to /webhook/sms');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Webhook server running on port ${port}`);
});
