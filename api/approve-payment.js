// api/approve-payment.js
const axios = require('axios');

module.exports = async (req, res) => {
    // إعدادات CORS للسماح بالاتصال من المحفظة
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!paymentId) {
        return res.status(400).json({ error: 'Missing paymentId' });
    }

    try {
        // إرسال أمر الموافقة المبدئية مباشرة إلى سيرفر باي
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error("خطأ الأبروفال:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Failed to approve payment', 
            details: error.response?.data || error.message 
        });
    }
};
