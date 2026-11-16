/* =====================================================================
   speech.js — synthèse vocale, et reconnaissance de la voix (« Dire »).
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
              beat:null,guard:null,polls:0,polling:false,speaking:false};

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
  if(typeof speechSynthesis==='undefined'||!speechSynthesis){SPEECH.polling=false;return;}
  if(readVoices()){SPEECH.polling=false;return;}
  if(SPEECH.polls++>60){SPEECH.polling=false;return;}   /* ~18 s puis on renonce */
  setTimeout(pollVoices,300);
}
/* Un seul train de sondages à la fois : sans ce garde-fou, chaque
   redessin de l’écran Réglages en lançait un nouveau, et ils
   s’accumulaient. */
function refreshVoices(){
  SPEECH.polls=0;
  if(SPEECH.polling)return;
  SPEECH.polling=true;
  pollVoices();
}

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
/* Trois tentatives, pas une seule : si la première énonciation muette
   n’a pas suffi à lier le service de synthèse, le geste suivant retente.
   Une fois une voix chinoise trouvée, on ne tente plus rien. */
function unlockSpeech(){
  if(typeof speechSynthesis==='undefined')return;
  if(zhVoices().length){SPEECH.unlocked=9;return;}
  if((SPEECH.unlocked|0)>=3)return;
  SPEECH.unlocked=(SPEECH.unlocked|0)+1;
  /* Le service de synthèse d’Android ne se lie qu’à la première demande,
     et la liste des voix n’existe pas avant cette liaison. On relit donc
     la liste quand l’énonciation muette démarre, finit ou échoue, et pas
     seulement au moment de la lancer : à cet instant-là, il est trop tôt. */
  try{
    const u=new SpeechSynthesisUtterance(' ');
    u.volume=0;
    u.onstart=u.onend=u.onerror=function(){SPEECH.polling=false;refreshVoices();};
    speechSynthesis.speak(u);
  }catch(e){}
  refreshVoices();
}

/* Relance manuelle, depuis les Réglages : on repart de zéro, y compris
   le déverrouillage, puisque le geste de l’utilisatrice le permet. */
function relanceVoix(){
  SPEECH.unlocked=0;
  SPEECH.polling=false;
  unlockSpeech();
  refreshVoices();
  if(typeof toast==='function')toast('Détection relancée. Patientez quelques secondes.');
}

/* La liste brute, telle que le navigateur la déclare. C’est le seul
   moyen de distinguer trois pannes qui se ressemblent : aucune voix du
   tout, des voix mais pas de chinois, ou du chinois que le filtre rate. */
function voiceDump(){
  let vs=[];
  try{vs=speechSynthesis.getVoices()||[];}catch(e){}
  const e=(typeof esc==='function')?esc:(x=>String(x));
  if(!vs.length)
    return `<p class="mut sm mt">Le navigateur ne déclare <b>aucune voix</b>, quelle que soit
      la langue. Le moteur de synthèse du téléphone n’est pas encore lié au navigateur.
      Touchez « Relancer la détection », puis patientez quelques secondes.</p>`;
  const zh=vs.filter(isZh).length;
  return `<details class="vdump"${zh?'':' open'}>
    <summary>${vs.length} voix déclarée${vs.length>1?'s':''} par le navigateur, dont ${zh} en chinois</summary>
    <ol>${vs.map(v=>`<li>${e(v.name||'sans nom')} — <code>${e(v.lang||'?')}</code>${
      v.default?' · par défaut':''}${isZh(v)?' · <b>chinoise</b>':''}</li>`).join('')}</ol>
    ${zh?'':`<p class="mut sm">Aucune de ces voix n’est chinoise. Le pack de langue est
      installé dans un moteur de synthèse différent de celui que le téléphone utilise par
      défaut. Paramètres → Système → Langues et saisie → Synthèse vocale : vérifiez quel
      moteur est sélectionné, et ajoutez-y le chinois.</p>`}
  </details>`;
}
['pointerdown','touchstart','keydown'].forEach(ev=>
  document.addEventListener(ev,unlockSpeech,{passive:true}));

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

/* =====================================================================
   RECONNAISSANCE DE LA VOIX — « Dire »
   La reconnaissance de Chrome (webkitSpeechRecognition, langue zh-CN)
   envoie le son aux serveurs de Google et renvoie des caractères, pas du
   pinyin. Elle ne juge pas les tons : elle devine le mot le plus probable.
   Elle prouve donc qu’on a été compris, pas que la prononciation est
   parfaite. Rien n’est enregistré, rien n’est noté.

     peutEcouter() · ecouterMoi({onresult, onerror, duree}) · ecouteAnnule()
     jugeOral({hz, py}, transcriptions) → verdict ok | son | ton | autre
   ===================================================================== */

const ECOUTE={rec:null,timer:null,token:0};

function peutEcouter(){
  return typeof window!=='undefined'&&!!(window.SpeechRecognition||window.webkitSpeechRecognition);
}
function ecouteAnnule(){
  ECOUTE.token++;
  if(ECOUTE.timer){clearTimeout(ECOUTE.timer);ECOUTE.timer=null;}
  try{if(ECOUTE.rec)ECOUTE.rec.abort();}catch(e){}
  ECOUTE.rec=null;
}
function ecouteStop(){try{if(ECOUTE.rec)ECOUTE.rec.stop();}catch(e){}}

/* Une seule réponse par appel : onresult(liste des transcriptions) ou
   onerror(code). Codes : absent, not-allowed, no-speech, audio-capture,
   network, language-not-supported, erreur. */
function ecouterMoi(o){
  o=o||{};
  ecouteAnnule();
  stopSpeech();                 /* ne pas transcrire la voix de l’appli */
  const R=peutEcouter()?(window.SpeechRecognition||window.webkitSpeechRecognition):null;
  const my=++ECOUTE.token;
  let fini=false;
  const fin=(fn,arg)=>{
    if(fini||my!==ECOUTE.token)return;
    fini=true;
    if(ECOUTE.timer){clearTimeout(ECOUTE.timer);ECOUTE.timer=null;}
    ECOUTE.rec=null;
    if(fn)try{fn(arg);}catch(e){}
  };
  if(!R){fin(o.onerror,'absent');return false;}
  let r;
  try{r=new R();}catch(e){fin(o.onerror,'absent');return false;}
  r.lang='zh-CN';r.interimResults=false;r.continuous=false;r.maxAlternatives=5;
  r.onresult=ev=>{
    const alts=[];
    try{
      for(let i=0;i<ev.results.length;i++){
        const res=ev.results[i];
        for(let j=0;j<res.length;j++){
          const t=String(res[j]&&res[j].transcript||'').trim();
          if(t&&alts.indexOf(t)<0)alts.push(t);
        }
      }
    }catch(e){}
    if(alts.length)fin(o.onresult,alts);else fin(o.onerror,'no-speech');
  };
  r.onerror=ev=>{
    const c=String(ev&&ev.error||'erreur');
    if(c==='aborted')return;
    fin(o.onerror,c);
  };
  r.onend=()=>fin(o.onerror,'no-speech');
  try{r.start();}catch(e){fin(o.onerror,'erreur');return false;}
  ECOUTE.rec=r;
  /* Filet : Chrome s’arrête seul après un silence, mais pas toujours. */
  ECOUTE.timer=setTimeout(ecouteStop,Math.max(3000,Number(o.duree)||6000));
  return true;
}

function ecouteErreur(code){
  return ({
    absent:'Ce navigateur ne propose pas la reconnaissance vocale. Essayez avec Chrome.',
    'not-allowed':'Le micro est refusé. Pour l’autoriser : cadenas à gauche de l’adresse, puis Autorisations, puis Micro.',
    'service-not-allowed':'Le micro est refusé. Pour l’autoriser : cadenas à gauche de l’adresse, puis Autorisations, puis Micro.',
    'no-speech':'Rien entendu. Parlez juste après avoir touché « Dire », près du micro.',
    'audio-capture':'Aucun micro trouvé sur cet appareil.',
    network:'La transcription demande une connexion internet.',
    'language-not-supported':'Ce navigateur ne reconnaît pas le chinois.'
  })[code]||'La reconnaissance n’a pas abouti. Réessayez.';
}

/* --- Chiffres : Chrome écrit souvent « 3 » pour 三, « 10 » pour 十 --- */
const HAN_CHIFFRES='零一二三四五六七八九';
function nombreEnHan(n){
  if(n<10)return HAN_CHIFFRES[n];
  const U=[[10000,'万'],[1000,'千'],[100,'百'],[10,'十']];
  let out='',reste=n,zero=false,debut=true;
  for(const [v,nom] of U){
    const q=Math.floor(reste/v);reste%=v;
    if(q){
      if(zero){out+='零';zero=false;}
      out+=(v===10&&q===1&&debut?'':HAN_CHIFFRES[q])+nom;debut=false;
    }else if(!debut)zero=true;
  }
  if(reste){if(zero)out+='零';out+=HAN_CHIFFRES[reste];}
  return out;
}
function chiffresEnHan(s){
  return String(s||'').replace(/\d+/g,(m,pos,all)=>{
    const an=all.charAt(pos+m.length)==='年';
    if(m.length>5||(an&&m.length>=3)||(m.length>1&&m[0]==='0'))
      return Array.from(m).map(c=>HAN_CHIFFRES[+c]).join('');
    return nombreEnHan(+m);
  });
}

/* Lectures connues d’un caractère, sous la forme « shi4 ». */
function lecturesDe(c){
  const r=new Set(typeof PYDICT!=='undefined'&&PYDICT[c]?Array.from(PYDICT[c]):[]);
  ['CHARS','WORDS'].forEach(n=>{
    const L=(typeof window!=='undefined'&&window[n])||[];
    for(const x of L)if(x&&x.hz===c&&x.py){const s=pySyls(x.py)[0];if(s)r.add(pyRead(s));}
  });
  return r;
}
const nuDe=k=>String(k).replace(/\d$/,'');
const tonDe=k=>+String(k).slice(-1)||0;

function jugeOral(cible,alts){
  const T=hanChars(cible.hz);
  /* Lectures attendues : celles du pinyin donné, syllabe par syllabe ;
     à défaut, toutes celles qu’on connaît au caractère. Le ton neutre
     attendu n’accepte n’importe quel ton que si le pinyin est sûr. */
  let attendu=null,sur=false;
  if(cible.py){
    const pc=pinyinCheck(cible.hz,cible.py,true);
    if(pc.ok&&pc.paires.length===T.length){attendu=pc.paires.map(p=>new Set([p.s.nu+p.s.ton]));sur=true;}
  }
  if(!attendu)attendu=T.map(lecturesDe);
  const tJoint=T.join('');
  const essais=[];
  (alts||[]).forEach(a=>{
    const h=chiffresEnHan(a);
    essais.push(h);
    if(tJoint.indexOf('两')>=0&&h.indexOf('二')>=0)essais.push(h.replace(/二/g,'两'));
  });
  const RANGV={ok:0,son:1,ton:2,autre:3};
  let best=null;
  essais.forEach(brut=>{
    const H=hanChars(brut),hJoint=H.join('');
    let v='autre';
    const L=H.map(lecturesDe);
    if(hJoint&&hJoint===tJoint)v='ok';
    else if(H.length&&H.length===T.length&&L.every(s=>s.size)){
      const memeSon=H.every((c,i)=>{
        if(c===T[i])return true;
        for(const a of attendu[i]){
          if(L[i].has(a))return true;
          for(const l of L[i])if(nuDe(l)===nuDe(a)&&((sur&&tonDe(a)===0)||'不一'.indexOf(T[i])>=0))return true;
        }
        return false;
      });
      if(memeSon)v='son';
      else if(H.every((c,i)=>c===T[i]||[...attendu[i]].some(a=>[...L[i]].some(l=>nuDe(l)===nuDe(a)))))v='ton';
    }
    /* Pinyin de ce qui a été entendu : seulement s’il est sûr partout. */
    const aligne=H.length===T.length;
    const syl=H.map((c,i)=>{
      if(aligne&&c===T[i]&&attendu[i].size===1)return [...attendu[i]][0];
      const l=[...L[i]];
      if(l.length===1)return l[0];
      if(aligne){
        const p=l.filter(x=>[...attendu[i]].some(a=>nuDe(a)===nuDe(x)));
        if(p.length===1)return p[0];
      }
      return null;
    });
    const py=H.length&&syl.every(Boolean)?syl.map(k=>setTone(nuDe(k),tonDe(k))).join(' '):'';
    const cand={v:v,hz:brut.replace(/[。，！？.,!?\s]+$/,''),py:py};
    if(!best||RANGV[v]<RANGV[best.v])best=cand;
  });
  return best||{v:'autre',hz:'',py:''};
}
