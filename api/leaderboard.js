const SUPABASE_URL=process.env.SUPABASE_URL;
const SUPABASE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY;
export default async function handler(req,res){
  if(!SUPABASE_URL||!SUPABASE_KEY)return res.status(503).json({error:'Supabase not configured'});
  const headers={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY,'Content-Type':'application/json'};
  try{
    if(req.method==='GET'){
      const r=await fetch(SUPABASE_URL+'/rest/v1/leaderboard?select=name,score,created_at&order=score.desc,created_at.asc&limit=10',{headers});
      const data=await r.json();
      if(!r.ok)return res.status(502).json({error:'Leaderboard read failed'});
      return res.status(200).json(data);
    }
    if(req.method==='POST'){
      const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body||{};
      const name=String(body.name||'Gracz').replace(/[^a-zA-Z0-9 _-]/g,'').trim().slice(0,16)||'Gracz';
      const score=Math.max(0,Math.floor(Number(body.score)||0));
      const r=await fetch(SUPABASE_URL+'/rest/v1/leaderboard',{method:'POST',headers:{...headers,Prefer:'return=minimal'},body:JSON.stringify({name,score})});
      if(!r.ok)return res.status(502).json({error:'Leaderboard write failed'});
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'Method not allowed'});
  }catch(e){return res.status(500).json({error:'Leaderboard error'});}
}
