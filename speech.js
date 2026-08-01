/* =====================================================================
   speech.js — synthèse vocale.
   Chargé après core.js, avant les fichiers data-*.js.

   Ce fichier existe parce que la synthèse vocale des navigateurs, et
   particulièrement celle de Chrome sur Android, se comporte mal de six
   façons connues. Chacune est traitée ici, une fois pour toutes.

     1. Les voix arrivent après le chargement de la page, parfois
        plusieurs secondes après. On sonde jusqu’à les trouver.
     2. Elles disparaissent quand l’application passe en arrière-plan
        puis revient. On resonde à chaque retour au premier plan.
     3. Une énonciation de plus d’une quinzaine de secondes est coupée
        net, sans erreur ni fin. On découpe le texte en fragments courts.
     4. Le moteur se met en pause tout seul. Un battement de cœur
        appelle resume() en continu.
     5. onend n’est parfois jamais appelé : la lecture s’arrête et rien
        ne repart. Une minuterie de secours relance la suite.
     6. Sur certains appareils, rien ne sort tant qu’une première
        énonciation n’a pas suivi un geste de l’utilisatrice. On
        déverrouille silencieusement au premier contact.

   Trois fonctions pour toutes les pages :
     speak(texte, locuteur) · speakSeq([{hz,who}, …]) · stopSpeech()
   ===================================================================== */

const SPEECH={voices:[],ready:false,unlocked:false,token:0,
              beat:null,guard:null,polls:0,speaking:false};

/* --- 1 et 2. Trouver les voix, et les retrouver ---------------------
   On accepte toutes les étiquettes du chinois : zh, cmn (mandarin),
   yue (cantonais), nan, hak, et les voix qui ne se signalent que par
   leur nom. Ne chercher que « zh » laissait des appareils muets. */
const ZH_LANG=/^(zh|cmn|yue|nan|hak)\b/i;
const ZH_NAME=/(chinese|mandarin|中文|普通话|國語|国语|粤|廣東|广东)/i;

function isZh(v){
  if(!v)return false;
  const lang=String(v.lang||'').replace(/_/g,'-');
  return ZH_LANG.test(lang)||ZH_NAME.test(String(v.name||''));
}
function readVoices(){
  try{SPEECH.voices=speechSynthesis.getVoices()||[];}catch(e){SPEECH.voices=[];}
  const had=SPEECH.ready;
  SPEECH.ready=zhVoices().length>0;
  /* On ne redessine que si l’état a changé : sinon un sondage toutes
     les 300 ms ferait clignoter l’écran. */
  if(SPEECH.ready!==had&&typeof render==='function'&&document.getElementById('app'))
    try{render();}catch(e){}
  return SPEECH.ready;
}
function zhVoices(){return (SPEECH.voices||[]).filter(isZh);}
function zhVoice(){
  const l=zhVoices();
  if(!l.length)return null;
  return l.find(v=>/^(zh[-_]?cn|zh[-_]?hans|cmn)/i.test(v.lang))||l[0];
}
function byName(n){return (SPEECH.voices||[]).find(v=>v.name===n);}
function pollVoices(){
  if(typeof speechSynthesis==='undefined'||!speechSynthesis)return;
  if(readVoices())return;
  if(SPEECH.polls++>60)return;              /* ~18 s puis on renonce */
  setTimeout(pollVoices,300);
}
function refreshVoices(){SPEECH.polls=0;pollVoices();}

if(typeof speechSynthesis!=='undefined'&&speechSynthesis){
  readVoices();
  try{speechSynthesis.addEventListener('voiceschanged',readVoices);}
  catch(e){speechSynthesis.onvoiceschanged=readVoices;}
  refreshVoices();
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible')refreshVoices();
    else stopSpeech();                      /* jamais de voix orpheline */
  });
  window.addEventListener('pageshow',refreshVoices);
  /* Quitter la page ne doit jamais laisser le moteur en marche : c’est
     ce qui rendait la lecture folle en changeant d’écran. */
  window.addEventListener('pagehide',stopSpeech);
  window.addEventListener('beforeunload',stopSpeech);
}

/* --- 6. Déverrouillage au premier geste ---------------------------- */
function unlockSpeech(){
  if(SPEECH.unlocked||typeof speechSynthesis==='undefined')return;
  SPEECH.unlocked=true;
  try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u);}catch(e){}
  refreshVoices();
}
['pointerdown','touchstart','keydown'].forEach(ev=>
  document.addEventListener(ev,unlockSpeech,{once:true,passive:true}));

/* --- Voix et timbre par locuteur ------------------------------------ */
const PITCH={A:1,B:.72,C:1.28};
function voiceFor(who){
  const st=(S.settings&&S.settings.voices)||{};
  const dedicated=who&&st[who]?byName(st[who]):null;
  const v=dedicated||byName(st.d)||zhVoice();
  return {v:v,pitch:dedicated?1:(who?(PITCH[who]||1):1)};
}

/* --- 3. Découpage ---------------------------------------------------
   Ponctuation forte d’abord, ponctuation faible ensuite, coupe sèche en
   dernier recours. Aucun fragment au-delà de 60 caractères. */
const CHUNK=60;
function chunk(txt){
  const t=String(txt||'').trim();
  if(!t)return [];
  if(t.length<=CHUNK)return [t];
  const out=[];let buf='';
  const pousse=s=>{
    while(s.length>CHUNK){
      if(buf){out.push(buf);buf='';}
      out.push(s.slice(0,CHUNK));s=s.slice(CHUNK);
    }
    if(!s)return;
    if((buf+s).length>CHUNK){if(buf)out.push(buf);buf=s;}else buf+=s;
  };
  for(let p of t.split(/(?<=[。！？!?\n])/)){
    p=p.trim();if(!p)continue;
    if(p.length>CHUNK){for(let s of p.split(/(?<=[，、；,;：:])/)){s=s.trim();if(s)pousse(s);}}
    else pousse(p);
  }
  if(buf)out.push(buf);
  return out.filter(Boolean);
}

/* --- 4. Battement de cœur contre la pause spontanée ----------------- */
function startBeat(){
  stopBeat();
  SPEECH.beat=setInterval(()=>{
    try{
      if(!speechSynthesis.speaking){stopBeat();return;}
      if(speechSynthesis.paused)speechSynthesis.resume();
      else{speechSynthesis.pause();speechSynthesis.resume();}
    }catch(e){stopBeat();}
  },5000);
}
function stopBeat(){if(SPEECH.beat){clearInterval(SPEECH.beat);SPEECH.beat=null;}}
function clearGuard(){if(SPEECH.guard){clearTimeout(SPEECH.guard);SPEECH.guard=null;}}

function stopSpeech(){
  SPEECH.token++;SPEECH.speaking=false;
  stopBeat();clearGuard();
  try{speechSynthesis.cancel();}catch(e){}
}

/* --- Disponibilité --------------------------------------------------- */
function canSpeak(silent){
  if(typeof speechSynthesis==='undefined'||!speechSynthesis){
    if(!silent)toast('Ce navigateur ne sait pas lire à voix haute.');
    return false;
  }
  if(!zhVoices().length){
    refreshVoices();
    if(!silent)toast('Aucune voix chinoise installée. Réglages du téléphone → Langues → Synthèse vocale → ajouter le chinois.');
    return false;
  }
  return true;
}
/* Bandeau discret, plutôt qu’un silence inexpliqué. Chaîne vide si tout va bien. */
function speechNotice(){
  if(typeof speechSynthesis==='undefined')
    return `<div class="mut sm">Ce navigateur ne propose pas de lecture à voix haute.</div>`;
  if(zhVoices().length)return '';
  return `<div class="mut sm">Aucune voix chinoise détectée pour l’instant.
    Si vous venez d’installer le pack de langue, revenez à cet écran.
    Sinon : Réglages du téléphone → Langues et saisie → Synthèse vocale → ajouter le chinois.</div>`;
}

/* --- Lecture d’une suite --------------------------------------------
   Tout passe par ici, y compris speak() : un seul chemin, donc un seul
   endroit où les défauts sont corrigés. */
function speakSeq(items,opts){
  if(!canSpeak())return;
  unlockSpeech();
  stopSpeech();
  const my=++SPEECH.token,o=opts||{};
  const list=(items||[]).filter(it=>it&&String(it.hz||'').trim());
  if(!list.length)return;
  const frags=[];
  list.forEach(it=>{
    const cs=chunk(it.hz);
    cs.forEach((c,i)=>frags.push({t:c,who:it.who||null,last:i===cs.length-1}));
  });
  SPEECH.speaking=true;
  let i=0;
  const next=()=>{
    if(my!==SPEECH.token)return;
    clearGuard();
    if(i>=frags.length){
      SPEECH.speaking=false;stopBeat();
      if(o.onend)try{o.onend();}catch(e){}
      return;
    }
    const f=frags[i++],{v,pitch}=voiceFor(f.who);
    let u;
    try{u=new SpeechSynthesisUtterance(f.t);}catch(e){SPEECH.speaking=false;return;}
    if(v){u.voice=v;u.lang=v.lang;}else u.lang='zh-CN';
    u.rate=Math.min(2,Math.max(.5,Number(S.settings.rate)||.85));
    u.pitch=Math.min(2,Math.max(0,pitch));
    let done=false;
    const advance=()=>{
      if(done||my!==SPEECH.token)return;
      done=true;
      setTimeout(next,f.last?Math.max(0,Number(S.settings.pause)||0)*1000:0);
    };
    u.onend=advance;
    u.onerror=advance;      /* une erreur ne doit jamais figer la suite */
    /* 5. Filet : si ni onend ni onerror n’arrive, on avance quand même.
       Budget large pour ne jamais couper une lecture qui se déroule bien. */
    const budget=4000+f.t.length*900/Math.max(.5,u.rate);
    const watch=()=>{
      if(my!==SPEECH.token||done)return;
      let busy=false;
      try{busy=speechSynthesis.speaking&&!speechSynthesis.paused;}catch(e){}
      if(busy){SPEECH.guard=setTimeout(watch,budget);return;}
      advance();
    };
    SPEECH.guard=setTimeout(watch,budget);
    try{speechSynthesis.speak(u);startBeat();}catch(e){advance();}
  };
  next();
}
function speak(txt,who){speakSeq([{hz:txt,who:who}]);}
function speaking(){return !!SPEECH.speaking;}
