// api/approve-payment.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY; // يقرأ المفتاح السري تلقائياً من Vercel

    try {
        // إرسال أمر الموافقة المبدئية لخوادم باي لكي تسمح للمستخدم بفتح محفظته وتوقيع المعاملة
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {}, // جسم الطلب فارغ حسب توثيق Pi SDK
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json({ success: true, data: response.data });

    } catch (error) {
        console.error("Payment Approval Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            error: 'Failed to approve payment', 
            details: error.response?.data || error.message 
        });
    }
}
