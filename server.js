import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chat} from './ai.js';

const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));

app.get('/api/status',(req,res)=>res.json({name:'chatSI',status:'online',mode:process.env.AI_API_URL?'ai':'local'}));
app.post('/api/chat',async(req,res)=>{
  try{const reply=await chat(req.body?.message);res.json({reply});}
  catch(error){res.status(500).json({error:error.message||'Błąd silnika AI'});}
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`chatSI działa na porcie ${PORT}`));
