export default function handler(req, res) {
  res.status(200).json({
    name: 'chatSI',
    status: 'online',
    mode: process.env.OPENAI_API_KEY ? 'ai' : 'missing-key'
  });
}
