import express from 'express';
import { chat } from './ai.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json({ limit: '1mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({ name: 'chatSI', status: 'online' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const reply = await chat(req.body?.message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Błąd AI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zombie Escape działa na porcie ${PORT}`));
