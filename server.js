import express from 'express';
import { chat } from './ai.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json({ limit: '1mb' }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/api/status',(req,res)=>res.json({name:'chatSI',status:'online'}));
app.post('/api/chat',async(req,res)=>{
 try {
  if(!req.body || typeof req.body.message!=='string' || !req.body.message.trim()) return res.status(400).json({error:'Brak wiadomości'});
  res.json({reply:await chat(req.body.message.trim())});
 } catch(error) {
  console.error(error);
  res.status(500).json({error:'Błąd AI'});
 }
});
export default app;
