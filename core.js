/* =====================================================================
   core.js — socle commun à toutes les pages de l’application.
   Chargé avant les fichiers data-*.js et avant le script de page.
   Ne contient aucun contenu pédagogique : uniquement l’état, les
   tons, le son, les boîtes de Leitner et la coque de navigation.
   ===================================================================== */

/* =====================================================================
   1. PERSISTANCE
   ===================================================================== */
const KEY='coach-chinois-v2';
let memoryOnly=false;
function loadState(){
  const base={items:{},written:[],lessons:{},streak:{n:0,last:''},lastLesson:'',
    settings:{level:2,theme:'all',provider:'none',apikey:'',rate:.85,font:'sans',
      pause:.7,sfx:true,auto:false,flow:'decoupe',gmodel:'',chatTurns:7,chatDemote:true,
      voices:{d:'',A:'',B:'',C:''}}};
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return base;
    const p=JSON.parse(raw);
    return Object.assign(base,p,{settings:Object.assign(base.settings,p.settings||{})});
  }catch(e){memoryOnly=true;return base;}
}
function save(){
  if(memoryOnly)return;
  try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){memoryOnly=true;}
}
let S=loadState();


/* =====================================================================
   3. OUTILS
   ===================================================================== */
const TONES={'āēīōūǖ':1,'áéíóúǘ':2,'ǎěǐǒǔǚ':3,'àèìòùǜ':4};
function toneOf(syl){
  for(const c of syl.toLowerCase())
    for(const k in TONES) if(k.includes(c)) return TONES[k];
  return 0;
}
function pinyin(py){
  return py.split(/(\s+|[,，.。?？!！])/).map(p=>{
    if(!p.trim()||/^[,，.。?？!！]$/.test(p))return esc(p);
    return `<span class="s${toneOf(p)}">${esc(p)}</span>`;
  }).join('');
}
const VOW={a:'aāáǎà',e:'eēéěè',i:'iīíǐì',o:'oōóǒò',u:'uūúǔù','ü':'üǖǘǚǜ'};
function stripTone(sy){
  let r='';
  for(const c of sy){
    let hit=false;
    for(const k in VOW){const i=VOW[k].indexOf(c);if(i>=0){r+=(c===c.toUpperCase()&&c!==k?k.toUpperCase():k);hit=true;break;}}
    if(!hit)r+=c;
  }
  return r;
}
/* Repose une marque de ton sur la voyelle réglementaire : a et e priment,
   dans « ou » c’est le o, sinon c’est la dernière voyelle. */
function setTone(sy,n){
  const base=stripTone(sy),low=base.toLowerCase();
  if(n===0)return base;
  let pos=-1;
  if(low.includes('a'))pos=low.indexOf('a');
  else if(low.includes('e'))pos=low.indexOf('e');
  else if(low.includes('ou'))pos=low.indexOf('o');
  else for(let i=low.length-1;i>=0;i--){if('aeiouü'.includes(low[i])){pos=i;break;}}
  if(pos<0)return base;
  return base.slice(0,pos)+VOW[low[pos]][n]+base.slice(pos+1);
}
function tonVariants(py){
  const parts=py.split(' '),out=[py];
  let guard=0;
  while(out.length<4&&guard++<80){
    const i=Math.random()*parts.length|0,cur=toneOf(parts[i]),n=Math.random()*5|0;
    if(n===cur)continue;
    const c=parts.slice();c[i]=setTone(parts[i],n);
    const v=c.join(' ');
    if(!out.includes(v))out.push(v);
  }
  return out;
}
function normZh(t){return String(t||'').replace(/[\s，。？！、,.?!；;：:’'"“”（）()]/g,'');}
function diffZh(given,expect){
  const A=normZh(given),B=normZh(expect);
  let h=0;while(h<A.length&&h<B.length&&A[h]===B[h])h++;
  let t=0;while(t<A.length-h&&t<B.length-h&&A[A.length-1-t]===B[B.length-1-t])t++;
  const mark=x=>esc(x.slice(0,h))+(x.length-t>h?'<u>'+esc(x.slice(h,x.length-t))+'</u>':'')+esc(x.slice(x.length-t));
  return {you:mark(A),exp:mark(B)};
}
/* ---------------------------------------------------------------------
   CONTRÔLE DU PINYIN — garde-fou
   Vérifie qu’une chaîne de pinyin correspond bien, syllabe par syllabe,
   à sa chaîne de caractères. Sert à contrôler le corpus, et surtout à
   filtrer le pinyin renvoyé par un modèle externe : si le contrôle
   échoue, le pinyin n’est pas affiché du tout.
   Trois motifs de rejet : syllabe impossible en mandarin, marque de ton
   posée sur la mauvaise voyelle, nombre de syllabes différent du nombre
   de caractères. S’y ajoute un simple doute, non bloquant : le caractère
   est connu du corpus avec une seule lecture, et ce n’est pas celle-ci.
   --------------------------------------------------------------------- */
const SYL=new Set((
 'a ai an ang ao e ê ei en eng er o ou '+
 'yi ya yao ye you yan yin yang ying yong wu wa wo wai wei wan wen wang weng yu yue yuan yun '+
 'ba bo bai bei bao ban ben bang beng bi bie biao bian bin bing bu '+
 'pa po pai pei pao pou pan pen pang peng pi pie piao pian pin ping pu '+
 'ma mo me mai mei mao mou man men mang meng mi mie miao miu mian min ming mu '+
 'fa fo fei fou fan fen fang feng fu '+
 'da de dai dei dao dou dan dang deng dong di dia die diao diu dian ding du duo dui duan dun '+
 'ta te tai tei tao tou tan tang teng tong ti tie tiao tian ting tu tuo tui tuan tun '+
 'na ne nai nei nao nou nan nen nang neng nong ni nie niao niu nian nin niang ning nu nuo nuan nü nüe '+
 'la le lo lai lei lao lou lan lang leng long li lia lie liao liu lian lin liang ling lu luo luan lun lü lüe '+
 'ga ge gai gei gao gou gan gen gang geng gong gu gua guo guai gui guan gun guang '+
 'ka ke kai kei kao kou kan ken kang keng kong ku kua kuo kuai kui kuan kun kuang '+
 'ha he hai hei hao hou han hen hang heng hong hu hua huo huai hui huan hun huang '+
 'ji jia jie jiao jiu jian jin jiang jing jiong ju jue juan jun '+
 'qi qia qie qiao qiu qian qin qiang qing qiong qu que quan qun '+
 'xi xia xie xiao xiu xian xin xiang xing xiong xu xue xuan xun '+
 'zha zhe zhi zhai zhei zhao zhou zhan zhen zhang zheng zhong zhu zhua zhuo zhuai zhui zhuan zhun zhuang '+
 'cha che chi chai chao chou chan chen chang cheng chong chu chua chuo chuai chui chuan chun chuang '+
 'sha she shi shai shei shao shou shan shen shang sheng shu shua shuo shuai shui shuan shun shuang '+
 're ri rao rou ran ren rang reng rong ru rua ruo rui ruan run '+
 'za ze zi zai zei zao zou zan zen zang zeng zong zu zuo zui zuan zun '+
 'ca ce ci cai cao cou can cen cang ceng cong cu cuo cui cuan cun '+
 'sa se si sai sao sou san sen sang seng song su suo sui suan sun '+
 'ng hm hng m n yo').split(' '));

const HAN_RE=/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;
const PY_PONCT=/[\s,，.。、·？?！!;；:：""“”‘’'`()（）《》「」…—–\-]+/;

function hanChars(s){return Array.from(String(s||'')).filter(c=>HAN_RE.test(c));}
function pySyls(py){return String(py||'').split(PY_PONCT).map(t=>t.trim()).filter(Boolean);}
/* Forme nue d’une syllabe : minuscules, v noté ü, marques de ton retirées. */
function pyBare(s){return stripTone(String(s||'').toLowerCase()).replace(/v/g,'ü');}
/* Clé de lecture : la syllabe nue suivie de son ton, insensible à la
   place exacte de la marque. */
function pyRead(s){return pyBare(s)+toneOf(s);}

function pinyinCheck(hz,py,skipDict){
  const han=hanChars(hz),toks=pySyls(py);
  if(!han.length)return{ok:true,code:'',why:'',paires:[],doute:[]};
  if(!toks.length)return{ok:false,code:'vide',why:'Pinyin absent.',paires:[],doute:[]};
  const syls=[];
  for(const t of toks){
    /* Nom propre laissé en alphabet latin : il figure tel quel dans la
       chaîne de caractères et ne consomme aucune syllabe. */
    if(/^[A-Za-zÀ-ÿ'’-]+$/.test(t)&&!SYL.has(pyBare(t))
       &&String(hz).toLowerCase().includes(t.toLowerCase()))continue;
    /* Interjections nasales : 嗯 ǹg, 呣 ḿ, 哼 hng… la marque de ton ne
       porte pas sur une voyelle, on ne contrôle donc pas sa place. */
    const nu0=t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(/^(ng|hm|hng|m|n|ê)$/.test(nu0)){syls.push({raw:t,nu:nu0,ton:0,er:false});continue;}
    const n=pyBare(t);
    let er=false,val=SYL.has(n);
    if(!val&&n.length>2&&n.slice(-1)==='r'&&SYL.has(n.slice(0,-1))){val=true;er=true;}
    if(!val)return{ok:false,code:'syllabe',why:'Syllabe impossible en pinyin : '+t,paires:[],doute:[]};
    const ton=toneOf(t),nu=er?n.slice(0,-1):n;
    const attendu=setTone(nu,ton)+(er?'r':'');
    if(String(t).toLowerCase().replace(/v/g,'ü')!==attendu)
      return{ok:false,code:'marque',why:'Marque de ton mal placée : '+t+' — attendu '+attendu,paires:[],doute:[]};
    syls.push({raw:t,nu:nu,ton:ton,er:er});
  }
  const paires=[];let i=0;
  for(const s of syls){
    if(i>=han.length)break;
    paires.push({c:han[i],s:s});
    i+=(s.er&&han[i+1]==='儿')?2:1;
  }
  if(i!==han.length||paires.length!==syls.length)
    return{ok:false,code:'compte',
      why:han.length+' caractère'+(han.length>1?'s':'')+' pour '+syls.length+' syllabe'+(syls.length>1?'s':''),
      paires:[],doute:[]};
  const doute=[];
  if(!skipDict)paires.forEach((p,k)=>{
    const r=PYDICT[p.c];
    if(r&&r.size===1&&!r.has(p.s.nu+p.s.ton))
      doute.push({i:k,c:p.c,lu:p.s.raw,connu:Array.from(r)[0]});
  });
  return{ok:true,code:doute.length?'doute':'',why:'',paires:paires,doute:doute};
}

/* Dictionnaire des lectures, bâti sur le corpus au démarrage : un
   caractère, l’ensemble des lectures qu’on lui connaît ici. */
const PYDICT={};
function pyLearn(hz,py){
  const r=pinyinCheck(hz,py,true);
  if(!r.ok)return false;
  r.paires.forEach(p=>{(PYDICT[p.c]=PYDICT[p.c]||new Set()).add(p.s.nu+p.s.ton);});
  return true;
}
function buildPyDict(){
  /* Chaque page ne charge pas les mêmes fichiers de données : on ne
     lit que ce qui est effectivement présent. */
  const D=n=>(typeof window!=='undefined'&&window[n])||[];
  D('WORDS').forEach(w=>pyLearn(w.hz,w.py));
  D('CHARS').forEach(c=>pyLearn(c.hz,c.py));
  D('SENT').forEach(s=>{if(s.py)pyLearn(s.hz,s.py);});
}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function jq(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
function toast(m){
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const d=document.createElement('div');d.className='toast';d.textContent=m;
  document.body.appendChild(d);setTimeout(()=>d.remove(),3400);
}

/* --- Polices chinoises --- */
const FONTS={
  sans:{n:'Sans — heiti',ex:'La plus lisible sur écran',v:"'Noto Sans SC',sans-serif"},
  serif:{n:'Serif — songti',ex:'Celle des livres imprimés',v:"'Noto Serif SC',serif"},
  xiaowei:{n:'Élégante — XiaoWei',ex:'Traits fins, allure calligraphique',v:"'ZCOOL XiaoWei',serif"},
  kai:{n:'Manuscrite — kaiti',ex:'Proche de l’écriture à la main, si la police est sur l’appareil',
       v:"'Kaiti SC','STKaiti','KaiTi','TW-Kai','Noto Serif SC',serif"}
};
function applyFont(){
  const f=FONTS[S.settings.font]||FONTS.sans;
  if(document.documentElement&&document.documentElement.style)
    document.documentElement.style.setProperty('--han',f.v);
}

/* --- Effets sonores --- */
let AC=null;
function beep(kind){
  if(!S.settings.sfx)return;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(!Ctx)return;
    AC=AC||new Ctx();
    if(AC.state==='suspended')AC.resume();
    const t=AC.currentTime;
    const seq=kind==='ok'?[[587,0,.10],[880,.10,.26]]:[[311,0,.13],[233,.13,.30]];
    seq.forEach(([f,s,e])=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(.0001,t+s);
      g.gain.exponentialRampToValueAtTime(.14,t+s+.02);
      g.gain.exponentialRampToValueAtTime(.0001,t+e);
      o.connect(g);g.connect(AC.destination);
      o.start(t+s);o.stop(t+e+.03);
    });
  }catch(e){}
}

/* --- Série de jours --- */
function touchStreak(){
  const d=new Date().toDateString();
  if(S.streak.last===d)return;
  const y=new Date(Date.now()-864e5).toDateString();
  S.streak.n=(S.streak.last===y)?S.streak.n+1:1;
  S.streak.last=d;save();
}

/* --- Répétition espacée (Leitner) --- */
const BOXES=[0,1,3,7,21,60];
function rec(id){if(!S.items[id])S.items[id]={box:0,due:0,seen:0,ok:0,ko:0};return S.items[id];}
function boxOf(id){return (S.items[id]||{box:0}).box;}
function due(id){const r=S.items[id];return !r||r.due<=Date.now();}
function grade(id,g){
  const r=rec(id);r.seen++;
  if(g===0){r.box=0;r.ko++;}
  else if(g===1){r.box=Math.max(0,r.box-1);r.ko++;}
  else{r.box=Math.min(BOXES.length-1,r.box+1);r.ok++;}
  r.due=Date.now()+BOXES[r.box]*864e5;
  touchStreak();save();
}
function mastered(id){const r=S.items[id];return !!r&&r.box>=4;}

/* --- Filtres --- */
function fits(o){
  if(o.hsk!==S.settings.level)return false;
  const T=S.settings.theme;
  if(T!=='all'&&!(o.th||[]).includes(T))return false;
  return true;
}
/* Chaque page ne charge pas forcément tous les fichiers de données.
   Les accès passent par ces lectures tolérantes : une donnée absente
   rend un tableau vide au lieu de casser la page entière. */
function DATA(n){return (typeof window!=='undefined'&&window[n])||[];}
function pool(){return DATA('WORDS').filter(fits);}
function themeName(id){const t=DATA('THEMES').find(x=>x.id===id);return t?t.n:'';}
function lessonProgress(l){return (S.lessons[l.id]||[]).length;}

/* --- Deux compteurs séparés -----------------------------------------
   Le vocabulaire et la grammaire ne se révisent pas au même rythme :
   un mot se rejoue en trente secondes, une fiche demande dix minutes.
   Les mélanger dans un seul chiffre fausserait la lecture. */
function dueIn(list){return list.filter(o=>due(o.id)).length;}
function masteredIn(list){return list.filter(o=>mastered(o.id)).length;}
function vocabDue(){return dueIn(pool());}
function gramPool(){return DATA('GRAMMAR').filter(fits);}
function gramDue(){return dueIn(gramPool().filter(g=>S.items[g.id]));}
function gramSeen(g){return !!S.items[g.id];}
/* Parcours mis en avant sur l’accueil : le dernier ouvert s’il est en cours,
   sinon le premier commencé mais non terminé, sinon le premier non entamé. */
function currentLesson(){
  const lp=DATA('LESSONS').filter(l=>l.hsk===S.settings.level);
  if(!lp.length)return null;
  const running=lp.filter(l=>{const p=lessonProgress(l);return p>0&&p<l.steps.length;});
  if(running.length){
    const last=running.find(l=>l.id===S.lastLesson);
    return last||running[0];
  }
  return lp.find(l=>lessonProgress(l)===0)||lp[lp.length-1];
}

/* --- Voix : sélection, locuteurs, pauses --- */
let voices=[];
function loadVoices(){try{voices=speechSynthesis.getVoices()||[];}catch(e){voices=[];}}
if(typeof speechSynthesis!=='undefined'&&speechSynthesis){loadVoices();speechSynthesis.onvoiceschanged=loadVoices;}
function zhVoices(){return voices.filter(v=>/^zh/i.test(v.lang));}
function zhVoice(){return zhVoices()[0];}
function byName(n){return voices.find(v=>v.name===n);}
const PITCH={A:1,B:.72,C:1.28};
function voiceFor(who){
  const st=S.settings.voices||{};
  const dedicated=who&&st[who]?byName(st[who]):null;
  const v=dedicated||byName(st.d)||zhVoice();
  return {v:v,pitch:dedicated?1:(who?(PITCH[who]||1):1)};
}
let seqToken=0;
function stopSpeech(){seqToken++;try{speechSynthesis.cancel();}catch(e){}}
function canSpeak(){
  if(typeof speechSynthesis==='undefined'||!speechSynthesis){toast('Synthèse vocale indisponible.');return false;}
  if(!zhVoice()){toast('Aucune voix chinoise sur cet appareil. Ajoutez le pack de langue chinois dans les réglages du système.');return false;}
  return true;
}
function speak(txt,who){
  if(!canSpeak())return;
  stopSpeech();
  const {v,pitch}=voiceFor(who);
  const u=new SpeechSynthesisUtterance(txt);
  u.voice=v;u.lang=v.lang;u.rate=S.settings.rate;u.pitch=pitch;
  speechSynthesis.speak(u);
}
function speakSeq(items){
  if(!canSpeak())return;
  stopSpeech();
  const my=++seqToken;
  let i=0;
  const next=()=>{
    if(my!==seqToken||i>=items.length)return;
    const it=items[i++];
    const {v,pitch}=voiceFor(it.who);
    const u=new SpeechSynthesisUtterance(it.hz);
    u.voice=v;u.lang=v.lang;u.rate=S.settings.rate;u.pitch=pitch;
    u.onend=()=>{if(my===seqToken)setTimeout(next,(S.settings.pause||0)*1000);};
    u.onerror=()=>{};
    speechSynthesis.speak(u);
  };
  next();
}

/* --- Correction assistée (facultative) --- */
async function correct(text,consigne){
  const p=S.settings.provider,k=S.settings.apikey;
  if(p==='none'||!k)throw new Error('aucune clé');
  const prompt=`Tu es professeur de chinois pour une apprenante francophone de niveau HSK${S.settings.level}.
Consigne : ${consigne}
Texte de l’apprenante :
${text}

Réponds en français, brièvement :
1. Version corrigée en chinois, avec pinyin.
2. Les erreurs, une par ligne : écrit → attendu, puis la règle en une phrase.
3. Une reformulation plus naturelle si elle existe.
Pas de préambule ni de conclusion.`;
  if(p==='anthropic'){
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
      headers:{'content-type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01',
        'anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:1200,messages:[{role:'user',content:prompt}]})});
    if(!r.ok)throw new Error('erreur '+r.status);
    const d=await r.json();
    return d.content.filter(c=>c.type==='text').map(c=>c.text).join('\n');
  }
  const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+encodeURIComponent(S.settings.gmodel||'gemini-2.5-flash')+':generateContent?key='+encodeURIComponent(k),
    {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  if(!r.ok)throw new Error('erreur '+r.status);
  const d=await r.json();
  return ((d.candidates||[])[0]?.content?.parts||[]).map(x=>x.text||'').join('\n');
}


/* ---- Essai de la clé : dire précisément ce qui coince ---- */
async function testKey(){
  const p=S.settings.provider,k=(S.settings.apikey||'').trim();
  const fin=(ok,msg)=>{ctx.test={busy:false,ok:ok,msg:msg};render();};
  ctx.test={busy:true,msg:''};render();
  if(!k)return fin(false,'Aucune clé enregistrée. Collez-la dans le champ ci-dessus.');
  try{
    if(p==='gemini'){
      let r;
      try{r=await fetch('https://generativelanguage.googleapis.com/v1beta/models?key='+encodeURIComponent(k));}
      catch(e){return fin(false,'Impossible de joindre Google. Vérifiez la connexion, ou un blocage du navigateur.');}
      if(!r.ok)return fin(false,gemErr(r.status,'')+' La clé elle-même n’a pas été acceptée.');
      const d=await r.json();
      const noms=(d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes('generateContent'))
                 .map(m=>String(m.name||'').replace('models/',''));
      if(!noms.length)return fin(false,'Clé reconnue, mais aucun modèle de génération ne lui est ouvert. Activez l’API Generative Language sur votre projet Google.');
      const pref=['gemini-2.5-flash','gemini-flash-latest','gemini-2.0-flash','gemini-2.5-flash-lite','gemini-2.5-pro'];
      const choisi=pref.find(x=>noms.includes(x))||noms[0];
      S.settings.gmodel=choisi;save();
      const o=await gemJSON('Tu réponds en JSON.',[{role:'user',parts:[{text:'Écris « bonjour » en chinois.'}]}],
        {type:'object',properties:{hz:{type:'string'}},required:['hz']});
      return fin(true,'Tout fonctionne. Modèle retenu : '+choisi+'. Essai renvoyé : '+(o.hz||'—')+'. '+noms.length+' modèles accessibles à cette clé.');
    }
    let r;
    try{
      r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
        headers:{'content-type':'application/json','x-api-key':k,'anthropic-version':'2023-06-01',
                 'anthropic-dangerous-direct-browser-access':'true'},
        body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:16,messages:[{role:'user',content:'Réponds : ok'}]})});
    }catch(e){return fin(false,'Impossible de joindre Anthropic. Vérifiez la connexion, ou un blocage du navigateur.');}
    if(r.status===401)return fin(false,'Clé refusée (401). Vérifiez qu’elle est complète et active.');
    if(r.status===400)return fin(false,'Requête refusée (400). La clé est probablement mal collée.');
    if(r.status===429)return fin(false,'Quota épuisé (429), ou crédit insuffisant sur le compte.');
    if(!r.ok)return fin(false,'Erreur '+r.status+'.');
    return fin(true,'Tout fonctionne. La clé Anthropic répond.');
  }catch(e){fin(false,e.message||String(e));}
}


/* =====================================================================
   COQUE DE NAVIGATION
   Générique : chaque page déclare son propre objet VIEWS (nom de vue →
   fonction qui rend le HTML) et, si besoin, MOUNT (travaux à faire une
   fois le HTML posé dans le document, par exemple monter HanziWriter).
   ===================================================================== */
const HOME='index.html';
const PAGE=(location.pathname.split('/').pop()||'index.html').toLowerCase();
const ON_HOME=(PAGE===''||PAGE==='index.html');

const SVG={
  back:'<path d="M15 5l-7 7 7 7"/>',
  home:'<path d="M3.5 11L12 3.5 20.5 11"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-5.5h4V20"/>',
  cards:'<rect x="3" y="7.5" width="13" height="12.5" rx="2.5"/><path d="M7.5 7.5V6A2 2 0 0 1 9.5 4h9A2 2 0 0 1 20.5 6v9a2 2 0 0 1-2 2h-1.5"/>',
  flag:'<path d="M5.5 21V3.5"/><path d="M5.5 4.5h12l-2.4 4 2.4 4h-12"/>',
  chart:'<path d="M5 20.5V11"/><path d="M12 20.5V4"/><path d="M19 20.5v-6.5"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
  sound:'<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>',
  book:'<path d="M4 5.5A2 2 0 0 1 6 3.5h5v16H6a2 2 0 0 0-2 2z"/><path d="M20 5.5a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2z"/>',
  pen:'<path d="M4 20l1-4.5L16 4.5a2 2 0 0 1 3 3L8 18.5z"/><path d="M14 6.5l3 3"/>',
  redo:'<path d="M20 5.5v5h-5"/><path d="M19.5 10.5A8 8 0 1 0 20 14"/>'
};
function ico(k,cls){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" ${cls?`class="${cls}"`:''}>${SVG[k]||''}</svg>`;
}

let view='home',ctx={},stack=[];
function go(v,c){stopSpeech();stack.push([view,ctx]);view=v;ctx=c||{};render();scrollTo(0,0);}
function back(){
  stopSpeech();
  const p=stack.pop();
  if(p){view=p[0];ctx=p[1];}
  else if(!ON_HOME){location.href=HOME;return;}
  else{view='home';ctx={};}
  render();scrollTo(0,0);
}
/* Les onglets traversent les fichiers : depuis une page de module, on
   repart vers l’accueil en lui passant l’onglet visé. */
function tab(v){
  stopSpeech();
  if(!ON_HOME){location.href=HOME+(v==='home'?'':'?tab='+encodeURIComponent(v));return;}
  stack=[];view=v;ctx={};render();scrollTo(0,0);
}
function param(n){try{return new URLSearchParams(location.search).get(n);}catch(e){return null;}}

const TABS=[
  {id:'home',    k:'home', n:'Accueil'},
  {id:'vocab',   k:'cards',n:'Réviser'},
  {id:'parcours',k:'flag', n:'Parcours'},
  {id:'progres', k:'chart',n:'Progrès'},
  {id:'reglages',k:'gear', n:'Réglages'}
];

function render(){
  applyFont();
  const tb=document.getElementById('tabs');
  if(tb)tb.innerHTML=TABS.map(t=>
    `<button class="${view===t.id?'on':''}" onclick="tab('${t.id}')">${ico(t.k)}${t.n}</button>`).join('');
  const V=(typeof window!=='undefined'&&window.VIEWS)||{};
  const f=V[view]||V.home;
  document.getElementById('app').innerHTML=f?f():'';
  if(typeof window!=='undefined'&&typeof window.MOUNT==='function')window.MOUNT();
  if(ctx.scrollTo){
    const el=document.getElementById(ctx.scrollTo);
    ctx.scrollTo=null;
    if(el&&el.scrollIntoView)el.scrollIntoView({block:'center',behavior:'smooth'});
  }
}

/* --- Fragments partagés --- */
function header(title,sub){
  return `<div class="top">
    <button class="back" onclick="back()" aria-label="Retour">${ico('back')}</button>
    <div class="htitle">${esc(title)}${sub?`<small>${esc(sub)}</small>`:''}</div>
  </div>`;
}
function levelPills(count){
  const n=count||(l=>DATA('WORDS').filter(w=>w.hsk===l).length
                   +DATA('TEXTS').filter(t=>t.hsk===l).length
                   +DATA('GRAMMAR').filter(g=>g.hsk===l).length);
  return `<div class="pills">${[1,2,3,4,5,6].map(l=>
    `<button class="pill ${S.settings.level===l?'on':''} ${n(l)?'':'void'}" onclick="setLevel(${l})">HSK ${l}</button>`).join('')}</div>`;
}
function themeSelect(){
  return `<div class="selwrap"><select onchange="setTheme(this.value)">
    <option value="all">Tous les thèmes</option>
    ${DATA('THEMES').map((t,i)=>`<option value="${t.id}" ${S.settings.theme===t.id?'selected':''}>${i+1}. ${esc(t.n)}</option>`).join('')}
  </select></div>`;
}
function setLevel(l){S.settings.level=l;save();ctx=Object.assign({},ctx,{reset:1});render();}
function setTheme(t){S.settings.theme=t;save();ctx=Object.assign({},ctx,{reset:1});render();}
function nothing(msg){
  return `<div class="void"><span class="em">空</span>
    <p><b>Rien à ce filtre</b></p>
    <p class="sm">${esc(msg||'Changez de niveau ou de thème pour trouver du contenu.')}</p></div>`;
}
/* Bandeau de parcours. Depuis une page de module, « Terminé » renvoie
   à l’accueil en lui indiquant quelle étape valider. */
function ribbon(){
  if(!ctx.from)return '';
  const n=ctx.from.n||0;
  return `<div class="ribbon"><span class="rs">路</span>
    <span>Étape ${ctx.from.i+1}${n?' sur '+n:''}</span>
    <button onclick="finishStep()">Terminé</button></div>`;
}
function finishStep(){
  const {l,i}=ctx.from;
  S.lessons[l]=S.lessons[l]||[];
  if(!S.lessons[l].includes(i))S.lessons[l].push(i);
  S.lastLesson=l;touchStreak();save();stopSpeech();
  if(!ON_HOME){location.href=HOME+'?lecon='+encodeURIComponent(l);return;}
  view='lecon';ctx={l:l};render();scrollTo(0,0);
}
