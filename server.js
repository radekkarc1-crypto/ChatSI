import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const app=express();
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/status',(req,res)=>res.json({name:'chatSI',status:'online',mode:'demo'}));
app.post('/api/chat',(req,res)=>{
  const message=String(req.body?.message||'').trim();
  if(!message)return res.status(400).json({error:'Brak wiadomości'});
  res.json({reply:`chatSI odebrał: ${message}`});
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`chatSI działa na porcie ${PORT}`));
