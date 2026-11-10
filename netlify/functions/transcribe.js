// Authenticated forwarding to an operator-owned transcription service.
// SPEECH_ENDPOINT must accept raw audio and return {text}; no audio is persisted.
const {verify}=require('node:crypto');
const reply=(statusCode,data)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'},body:JSON.stringify(data)});
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'Yalnız POST desteklenir.'});
 const endpoint=process.env.SPEECH_ENDPOINT;
 if(!endpoint)return reply(503,{error:'Ses çözümleme sunucusu henüz yapılandırılmadı.'});
 try {
  const url=new URL(endpoint);if(url.protocol!=='https:')throw Error('config');
  const token=(event.headers.authorization||'').replace(/^Bearer /,'');
  const parts=token.split('.');if(parts.length!==3)return reply(401,{error:'Yeniden oturum açınız.'});
  const header=JSON.parse(Buffer.from(parts[0],'base64url'));
  const claims=JSON.parse(Buffer.from(parts[1],'base64url'));
  const project='gelirgideruygulamasi-8c121';const now=Date.now()/1000;
  if(header.alg!=='RS256'||claims.aud!==project||claims.iss!==`https://securetoken.google.com/${project}`||!claims.sub||claims.exp<=now||claims.iat>now+60)return reply(401,{error:'Oturum geçerli değil.'});
  const certResponse=await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',{signal:AbortSignal.timeout(10000)});
  if(!certResponse.ok)throw Error('auth');const certs=await certResponse.json();
  if(!certs[header.kid]||!verify('RSA-SHA256',Buffer.from(parts.slice(0,2).join('.')),certs[header.kid],Buffer.from(parts[2],'base64url')))return reply(401,{error:'Oturum geçerli değil.'});
  const mime=event.headers['content-type']||'';
  if(!/^audio\/(webm|mp4|ogg)(;|$)/i.test(mime))return reply(415,{error:'Ses biçimi desteklenmiyor.'});
  if(!event.isBase64Encoded)return reply(400,{error:'Ses verisi geçersiz.'});
  let audio=Buffer.from(event.body||'','base64');
  try {
   if(!audio.length||audio.length>4*1024*1024)return reply(413,{error:'Ses kaydı çok büyük veya boş.'});
   const response=await fetch(url,{method:'POST',redirect:'error',headers:{'Content-Type':mime,...(process.env.SPEECH_SERVICE_TOKEN?{Authorization:`Bearer ${process.env.SPEECH_SERVICE_TOKEN}`}:{})},body:audio,signal:AbortSignal.timeout(45000)});
   if(!response.ok)return reply(503,{error:'Ses hizmeti şu an kullanılamıyor.'});
   const result=await response.json();return reply(200,{text:String(result.text||'').slice(0,12000)});
  }finally{audio.fill(0);audio=null;event.body='';}
 }catch{return reply(503,{error:'Ses çözümleme tamamlanamadı. Yeniden deneyebilirsiniz.'});}
};
