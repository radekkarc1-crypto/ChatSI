import { chat } from '../ai.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const reply = await chat(req.body?.message);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('chatSI API error:', error);
    return res.status(500).json({
      error: error?.message || 'Błąd silnika AI'
    });
  }
}
