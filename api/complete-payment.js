// api/complete-payment.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentId, txid } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY; // المفتاح السري المحفوظ في Vercel

    try {
        // 1. إرسال معرف المعاملة (txid) إلى خوادم باي لإكمال الدفع وتأكيده من طرف الخادم
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

        // 2. إذا تمت العملية بنجاح، نرجع استجابة للعبة لتحديث الرصيد أو فتح الطائرة
        return res.status(200).json({ success: true, payment: response.data });

    } catch (error) {
        console.error("Payment Completion Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Failed to complete payment', 
            details: error.response?.data || error.message 
        });
    }
}
