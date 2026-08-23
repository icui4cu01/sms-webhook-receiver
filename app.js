app.post('/webhook/sms', (req, res) => {
    try {
        const payload = req.body;
        console.log('📩 Webhook received:', payload.event);

        if (payload.event === 'sms:received') {
            const { sender, message, messageId, receivedAt } = payload.payload;
            
            console.log(`📱 From: ${sender}`);
            console.log(`💬 Message: ${message}`);
            
            // ---- ADD YOUR PROCESSING LOGIC HERE ----
            // 1. Look up applicant by phone number (sender)
            // 2. If found, check if message is "YES", "NO", or an email
            // 3. Update applicant state accordingly
            // 4. Trigger email or SMS Stage 2
            
            // Example (pseudo-code):
            // const applicant = await findApplicantByPhone(sender);
            // if (applicant) {
            //     if (message.toLowerCase() === 'yes') {
            //         await updateApplicantState(applicant.ref_id, 'EMAIL_SENT');
            //         await sendEmail(applicant.email, 'Your Invitation...');
            //     }
            // }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: error.message });
    }
});
