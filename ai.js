import {addMemory,getMemory} from './memory.js';

const SYSTEM_PROMPT='Jesteś chatSI, własnym asystentem AI. Odpowiadaj po polsku, jasno i pomocnie. Nie udawaj dostępu do funkcji, których nie masz.';

export async function chat(message){
  const text=String(message||'').trim();
  if(!text) throw new Error('Brak wiadomości');
  addMemory('user',text);

  // Adapter jest celowo oddzielony od interfejsu. Po ustawieniu AI_API_URL
  // możemy podłączyć dowolny kompatybilny serwer modelu bez przebudowy frontendu.
  if(process.env.AI_API_URL){
    const response=await fetch(process.env.AI_API_URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':process.env.AI_API_KEY?`Bearer ${process.env.AI_API_KEY}`:undefined},body:JSON.stringify({system:SYSTEM_PROMPT,messages:getMemory()})});
    if(!response.ok) throw new Error(`AI provider HTTP ${response.status}`);
    const data=await response.json();
    const reply=data.reply??data.output??data.message?.content;
    if(!reply) throw new Error('Nieprawidłowa odpowiedź dostawcy AI');
    addMemory('assistant',reply);return reply;
  }

  const lower=text.toLowerCase();
  let reply='Jestem chatSI. Silnik modelu nie został jeszcze skonfigurowany. Interfejs, backend i pamięć są już gotowe.';
  if(lower.includes('cześć')||lower.includes('hej')) reply='Cześć! 👋 Tu chatSI. Pamiętam wiadomości z bieżącej rozmowy.';
  if(lower.includes('kim jesteś')) reply='Jestem chatSI, projektem własnego asystenta AI. Aktualnie działam w trybie lokalnym, a silnik modelu można podłączyć przez AI_API_URL.';
  addMemory('assistant',reply);return reply;
}
