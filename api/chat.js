export default async function handler(req, res) {
    // Sirf POST request allow karenge
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { message } = req.body;

        // Vercel ke environment variables se key nikalenge (Code mein nahi likhenge)
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an elite Health & Customer Support Assistant for IceBug Private Fitness Estate in Kanpur. You are knowledgeable about HIIT, strength training, and nutrition. Keep answers under 3-4 sentences. If a user asks about memberships, explain the Standard (₹1,499), Elite Bespoke (₹2,999), and Executive (₹4,999) plans. If they ask about health, give safe, science-based advice but always include a short disclaimer to consult a doctor." 
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        
        // AI ka reply website ko wapas bhejenge
        res.status(200).json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
