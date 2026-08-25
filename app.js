const chat=document.querySelector('#chat');
const form=document.querySelector('#form');
const input=document.querySelector('#input');
const clearBtn=document.querySelector('#clearBtn');

function addMessage(text,who='bot'){
  const row=document.createElement('div');
  row.className=`message ${who}`;
  const avatar=document.createElement('div');
  avatar.className='avatar';
  avatar.textContent=who==='bot'?'S':'Ty';
  const body=document.createElement('div');
  const name=document.createElement('strong');
  name.textContent=who==='bot'?'chatSI':'Ty';
  const p=document.createElement('p');
  p.textContent=text;
  body.append(name,p);
  row.append(avatar,body);
  chat.appendChild(row);
  chat.scrollTop=chat.scrollHeight;
}

async function askAI(text){
  const response=await fetch('/api/chat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({message:text})
  });

  const raw=await response.text();
  let data;
  try{data=JSON.parse(raw)}catch{
    throw new Error(`API zwróciło nieprawidłową odpowiedź (${response.status}).`);
  }
  if(!response.ok)throw new Error(data.error||'Błąd serwera');
  if(!data.reply)throw new Error('API nie zwróciło odpowiedzi AI.');
  return data.reply;
}

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const text=input.value.trim();
  if(!text)return;
  addMessage(text,'user');
  input.value='';
  input.disabled=true;
  try{addMessage(await askAI(text),'bot')}
  catch(err){addMessage(`Błąd: ${err.message}`,'bot')}
  finally{input.disabled=false;input.focus()}
});

clearBtn.addEventListener('click',()=>{
  chat.innerHTML='';
  addMessage('Nowa rozmowa rozpoczęta. 🚀','bot');
  input.focus();
});
