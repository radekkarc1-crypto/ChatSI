const MAX_MESSAGES=40;
const history=[];
export function addMemory(role,content){history.push({role,content:String(content),time:Date.now()});if(history.length>MAX_MESSAGES)history.shift();}
export function getMemory(){return [...history];}
export function clearMemory(){history.length=0;}
