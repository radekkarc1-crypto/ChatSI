export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(503).json({error:'Leaderboard not configured'});
  const key='zombie-escape-global';
  try {
    if (req.method === 'GET') {
      const r=await fetch(url+'/zrange/'+encodeURIComponent(key)+'/0/9/REV/WITHSCORES',{headers:{Authorization:'Bearer '+token}});
      const j=await r.json();
      const result=[]; const a=j.result||[];
      for(let i=0;i<a.length;i+=2) result.push({name:a[i],score:Number(a[i+1])});
      return res.status(200).json(result);
    }
    if (req.method === 'POST') {
      const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body||{};
      const name=String(body.name||'Gracz').replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,16)||'Gracz';
      const score=Math.max(0,Math.floor(Number(body.score)||0));
      const r=await fetch(url+'/zadd/'+encodeURIComponent(key)+'/'+score+'/'+encodeURIComponent(name),{headers:{Authorization:'Bearer '+token}});
      if(!r.ok) return res.status(502).json({error:'Leaderboard write failed'});
      await fetch(url+'/zremrangebyrank/'+encodeURIComponent(key)+'/0/-21',{headers:{Authorization:'Bearer '+token}});
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(e){ return res.status(500).json({error:'Leaderboard error'}); }
}
