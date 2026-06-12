// api/complete-payment.js
const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentId, txid } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    if (!paymentId || !txid) {
        return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    try {
        // إرسال أمر الإغلاق النهائي للمعاملة
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid: txid },
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error("خطأ الكومبليت:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Failed to complete payment', 
            details: error.response?.data || error.message 
        });
    }
};
