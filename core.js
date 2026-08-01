/* =====================================================================
   core.js — socle commun à toutes les pages.
   Chargé en premier, avant speech.js, les fichiers data-*.js et le
   script propre à chaque page.

   Il ne contient aucun contenu pédagogique : uniquement l’état, les
   tons, le son, les boîtes de Leitner, la coque de navigation et le
   dessin d’écran. Une correction faite ici vaut pour toutes les pages.
   ===================================================================== */
const BUILD='20260731d';


const KEY='coach-chinois-v2';

let memoryOnly=false;

function loadState(){
  const base={items:{},written:[],lessons:{},streak:{n:0,last:''},lastLesson:'',
    settings:{level:2,theme:'all',provider:'none',apikey:'',rate:.85,font:'sans',
      pause:.7,sfx:true,auto:false,flow:'decoupe',gmodel:'',gver:'v1beta',gauth:'query',gjson:true,chatOneQ:true,chatTurns:7,chatDemote:true,
      voices:{d:'',A:'',B:'',C:''}}};
  try{
    const raw=localStorage.getItem(KEY);
    if(!raw)return base;
    const p=JSON.parse(raw);
    if(!p||typeof p!=='object'||Array.isArray(p))return base;
    return normState(Object.assign(base,p,{settings:Object.assign(base.settings,p.settings||{})}));
  }catch(e){memoryOnly=true;return base;}
}

/* Un état enregistré par une version antérieure, ou abîmé, ne doit
   jamais faire tomber un écran : on le remet en forme au chargement,
   silencieusement, plutôt que de faire confiance à ce qu'on relit. */
function normState(S){
  const obj=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
  S.items=obj(S.items);
  for(const k in S.items){
    const r=S.items[k];
    if(!r||typeof r!=='object'){delete S.items[k];continue;}
    r.box=Math.min(5,Math.max(0,Number(r.box)||0));
    r.due=Number(r.due)||0;
    r.seen=Number(r.seen)||0;r.ok=Number(r.ok)||0;r.ko=Number(r.ko)||0;
  }
  /* Les étapes franchies ont été enregistrées en objet par une version
     ancienne : les méthodes de tableau cassaient dessus. */
  S.lessons=obj(S.lessons);
  for(const k in S.lessons){
    const v=S.lessons[k];
    S.lessons[k]=Array.isArray(v)?v.filter(x=>typeof x==='number')
                : (v&&typeof v==='object')?Object.keys(v).map(Number).filter(n=>!isNaN(n))
                : [];
  }
  S.written=Array.isArray(S.written)?S.written:[];
  S.streak=obj(S.streak);
  S.streak.n=Number(S.streak.n)||0;
  S.streak.last=String(S.streak.last||'');
  S.settings=obj(S.settings);
  const lv=Number(S.settings.level);
  S.settings.level=(lv>=1&&lv<=6)?Math.round(lv):2;
  S.settings.rate=Math.min(2,Math.max(.5,Number(S.settings.rate)||.85));
  S.settings.pause=Math.min(5,Math.max(0,Number(S.settings.pause)||0));
  S.settings.voices=obj(S.settings.voices);
  if(['none','gemini','anthropic'].indexOf(S.settings.provider)<0)S.settings.provider='none';
  return S;
}
function save(){
  if(memoryOnly)return;
  try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){memoryOnly=true;}
}

let S=loadState();

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
  DATA('WORDS').forEach(w=>pyLearn(w.hz,w.py));
  DATA('CHARS').forEach(c=>pyLearn(c.hz,c.py));
  DATA('SENT').forEach(s=>{if(s.py)pyLearn(s.hz,s.py);});
}

/* ---- Garde-fou : le pinyin non conforme n’est pas affiché ---- */
function pyMsg(code){
  return code==='compte'?'il ne compte pas autant de syllabes que de caractères'
    :code==='syllabe'?'il contient une syllabe qui n’existe pas en mandarin'
    :code==='marque' ?'une marque de ton y est mal placée'
    :code==='vide'   ?'il est absent'
    :'il n’a pas passé le contrôle';
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

/* Rouge : l’échéance est passée. Jade : la boîte 4 ou plus, donc acquis.
   Ocre : en cours d’installation. Neutre : jamais vu. */
function etatDot(id){
  if(due(id))return 'due';
  const b=boxOf(id);
  if(b>=4)return 'ok';
  return b>=1?'mid':'';
}

function mastered(id){const r=S.items[id];return !!r&&r.box>=4;}

/* --- Filtres --- */
function fits(o){
  if(o.hsk!==S.settings.level)return false;
  const T=S.settings.theme;
  if(T!=='all'&&!(o.th||[]).includes(T))return false;
  return true;
}

function pool(){return DATA('WORDS').filter(fits);}

function themeName(id){const t=THEMES.find(x=>x.id===id);return t?t.n:'';}

function lessonProgress(l){return (S.lessons[l.id]||[]).length;}

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


/* Lecture tolérante des tableaux de données : une page qui ne charge pas
   data-corpus.js doit rendre un tableau vide, pas casser. */
function param(n){try{return new URLSearchParams(location.search).get(n);}catch(e){return null;}}
function DATA(n){return (typeof window!=='undefined'&&window[n])||[];}
function dueIn(list){return list.filter(o=>due(o.id)).length;}
function masteredIn(list){return list.filter(o=>mastered(o.id)).length;}
function vocabDue(){return dueIn(pool());}
function gramPool(){return DATA('GRAMMAR').filter(fits);}
function gramDue(){return dueIn(gramPool().filter(g=>S.items[g.id]));}
function gramSeen(g){return !!S.items[g.id];}


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
  const r=await fetch(gURL('models/'+encodeURIComponent(S.settings.gmodel||'gemini-flash-latest')+':generateContent'),
    {method:'POST',headers:gHead(),body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  if(!r.ok)throw new Error('erreur '+r.status);
  const d=await r.json();
  return ((d.candidates||[])[0]?.content?.parts||[]).map(x=>x.text||'').join('\n');
}

/* ---- Essai de la clé : sonder les quatre combinaisons et tout rapporter ---- */
async function testKey(){
  const p=S.settings.provider,k=(S.settings.apikey||'').trim();
  const fin=(ok,msg,det)=>{ctx.test={busy:false,ok:ok,msg:msg,det:det||[]};render();};
  ctx.test={busy:true,msg:'',det:[]};render();
  if(!k)return fin(false,'Aucune clé enregistrée. Collez-la dans le champ ci-dessus.');
  if(p==='anthropic')return testAnthropic(k,fin);

  const combos=[['v1beta','query'],['v1beta','header'],['v1','query'],['v1','header']];
  const essais=[];let bon=null,noms=[];
  for(const c of combos){
    const ver=c[0],auth=c[1];
    let r;
    try{r=await fetch(gURL('models',ver,auth),{headers:gHead(auth)});}
    catch(e){essais.push(ver+' · clé dans l’'+authNom(auth)+
      (auth==='header'?' → refusé avant l’envoi : le navigateur exige un contrôle CORS que ce service n’accorde pas. Depuis une page web, la clé doit passer par l’URL.'
                      :' → serveur injoignable'));continue;}
    if(r.ok){
      let d={};try{d=await r.json();}catch(e){}
      noms=(d.models||[]).filter(m=>(m.supportedGenerationMethods||[]).indexOf('generateContent')>=0)
           .map(m=>String(m.name||'').replace('models/',''));
      essais.push(ver+' · clé dans l’'+authNom(auth)+' → répond, '+noms.length+' modèle'+(noms.length>1?'s':''));
      if(noms.length){bon=c;break;}
      continue;
    }
    const e=await gErrMsg(r);
    essais.push(ver+' · clé dans l’'+authNom(auth)+' → '+e.status+(e.gstatus?' '+e.gstatus:'')+
                (e.message?' : '+e.message.slice(0,160):''));
  }
  if(!bon){
    const t=essais.join(' | ');
    const tousMuets=essais.every(x=>/injoignable|avant l’envoi/.test(x));
    let cause='Aucune des quatre combinaisons ne répond.';
    if(/API key not valid|API_KEY_INVALID/i.test(t))
      cause='Google reçoit bien la clé mais la refuse. Dans neuf cas sur dix ce n’est pas la clé elle-même : '+
            'c’est une restriction posée dessus. Ouvrez la console Google Cloud, Identifiants, puis la clé. '+
            'Si « Restrictions relatives aux applications » est sur « Sites web », ajoutez-y '+
            (location&&location.origin&&location.origin.indexOf('http')===0?location.origin+'/*':'l’adresse de votre site')+
            ' — sinon mettez « Aucune ». Vérifiez aussi que l’API Generative Language est activée sur ce projet.';
    else if(/401|ACCESS_TOKEN_TYPE_UNSUPPORTED|invalid authentication/i.test(t))
      cause='La clé est refusée à l’authentification. C’est le symptôme connu des clés au préfixe AQ. : créez une clé et restreignez-la explicitement à l’API Generative Language.';
    else if(/403|SERVICE_DISABLED|PERMISSION_DENIED/i.test(t))
      cause='L’API Generative Language n’est pas activée sur le projet de cette clé, ou la clé n’a pas ce droit.';
    else if(/404/.test(t))
      cause='Le service ne reconnaît aucune des deux versions d’API avec cette clé. La clé n’est probablement pas rattachée à un projet où l’API Generative Language est activée.';
    else if(tousMuets)
      cause='Le réseau ou le navigateur bloque tous les appels.';
    return fin(false,cause,essais);
  }
  /* gemini-2.5-flash est fermé aux nouveaux comptes depuis 2026 : les alias
     « latest » suivent le modèle courant et ne se périment pas. */
  const pref=['gemini-flash-latest','gemini-2.5-flash-lite','gemini-flash-lite-latest',
              'gemini-2.0-flash','gemini-2.5-flash','gemini-2.5-pro'];
  const cands=pref.filter(x=>noms.indexOf(x)>=0)
    .concat(noms.filter(x=>pref.indexOf(x)<0&&!/tts|image|embedding|vision|live|native-audio/.test(x)));
  S.settings.gver=bon[0];S.settings.gauth=bon[1];save();
  const SCH={type:'object',properties:{hz:{type:'string'}},required:['hz']};
  const MSG=[{role:'user',parts:[{text:'Écris « bonjour » en chinois.'}]}];
  for(const m of cands.slice(0,6)){
    let r=await gemCall(m,'Tu réponds en JSON.',MSG,SCH);
    if(r.ok){
      S.settings.gmodel=m;S.settings.gjson=true;save();
      return fin(true,'Tout fonctionne. Modèle retenu : '+m+', en '+bon[0]+', clé dans l’'+authNom(bon[1])+
        ', sortie JSON structurée. Essai renvoyé : '+String(r.txt).slice(0,40),
        essais.concat(noms.length+' modèles accessibles'));
    }
    essais.push(m+' · JSON structuré → '+r.status+' : '+r.msg);
    r=await gemCall(m,'Tu réponds uniquement par un objet JSON brut.',MSG,null);
    if(r.ok){
      S.settings.gmodel=m;S.settings.gjson=false;save();
      return fin(true,'Fonctionne avec '+m+', mais ce modèle refuse la sortie JSON structurée : '+
        'l’application repasse en JSON simple, sans perte pour vous.',
        essais.concat(noms.length+' modèles accessibles'));
    }
    essais.push(m+' · JSON simple → '+r.status+' : '+r.msg);
  }
  return fin(false,'La clé est reconnue et '+noms.length+' modèles sont listés, mais aucun n’accepte l’appel de '+
    'génération. Le détail ci-dessous donne la raison exacte renvoyée par Google.',essais);
}

/* ---- Appel Gemini, sortie structurée ---- */
function gemErr(st,txt){
  if(st===400)return 'Requête refusée (400). La clé est probablement invalide ou incomplète.';
  if(st===401)return 'Clé non acceptée (401). Les clés récentes au préfixe AQ. sont souvent rejetées par cette API ; essayez une clé restreinte à l’API Generative Language.';
  if(st===403)return 'Accès refusé (403). L’API Generative Language n’est pas activée sur le projet, ou la clé n’a pas ce droit.';
  if(st===404)return 'Adresse ou modèle introuvable (404). Relancez « Tester la clé » : la sonde essaie les quatre combinaisons et dit laquelle répond.';
  if(st===429)return 'Quota épuisé (429). Réessayez plus tard.';
  if(st>=500)return 'Panne côté Google ('+st+'). Réessayez dans un moment.';
  return 'Erreur '+st+'.';
}

async function gErrMsg(r){
  let d=null;try{d=await r.json();}catch(e){}
  const e=(d&&d.error)||{};
  return {status:r.status,gstatus:e.status||'',message:e.message||''};
}

async function gemJSON(sys,contents,schema){
  const m=S.settings.gmodel||'gemini-flash-latest';
  const strict=S.settings.gjson!==false;
  const sys2=strict?sys:sys+'\n\nRéponds UNIQUEMENT par un objet JSON brut, sans balises de code ni commentaire.';
  const r=await gemCall(m,sys2,contents,strict?schema:null);
  if(!r.ok)throw new Error(r.msg+(r.status?' ('+r.status+')':''));
  try{return JSON.parse(String(r.txt).replace(/```json|```/g,'').trim());}
  catch(e){throw new Error('Réponse illisible du modèle.');}
}

/* ---- Un appel de génération, avec le message d’erreur de Google ---- */
async function gemCall(model,sys,contents,schema){
  const body={contents:contents};
  if(sys)body.systemInstruction={parts:[{text:sys}]};
  body.generationConfig=schema
    ?{responseMimeType:'application/json',responseSchema:schema,temperature:.8}
    :{temperature:.8};
  let r;
  try{r=await fetch(gURL('models/'+model+':generateContent'),{method:'POST',headers:gHead(),body:JSON.stringify(body)});}
  catch(e){return {ok:false,status:0,msg:'réseau injoignable, ou requête bloquée par le navigateur'};}
  if(!r.ok){const e=await gErrMsg(r);
    return {ok:false,status:e.status,gstatus:e.gstatus,msg:(e.message||gemErr(e.status,'')).slice(0,220)};}
  let d={};try{d=await r.json();}catch(e){return {ok:false,status:200,msg:'réponse illisible'};}
  const txt=((d.candidates||[])[0]&&(d.candidates||[])[0].content&&(d.candidates||[])[0].content.parts||[])
            .map(x=>x.text||'').join('');
  if(!txt)return {ok:false,status:200,msg:'réponse vide — contenu peut-être bloqué par les filtres'};
  return {ok:true,txt:txt};
}

/* ---- Appels Gemini : version d’API et mode d’authentification retenus ----
   Les clés récentes au préfixe AQ. n’acceptent pas toujours la clé dans
   l’URL. On mémorise la combinaison qui répond réellement. ---------------- */
function gURL(path,ver,auth){
  const k=(S.settings.apikey||'').trim();
  return 'https://generativelanguage.googleapis.com/'+(ver||S.settings.gver||'v1beta')+'/'+path+
    ((auth||S.settings.gauth||'query')==='query'?(path.indexOf('?')>=0?'&':'?')+'key='+encodeURIComponent(k):'');
}

function gHead(auth){
  const h={'content-type':'application/json'};
  if((auth||S.settings.gauth||'query')==='header')h['x-goog-api-key']=(S.settings.apikey||'').trim();
  return h;
}

function authNom(a){return a==='header'?'en-tête':'URL';}

async function testAnthropic(k,fin){
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
}

const MODULES=[
  {id:'parcours',em:'路',c:'red',   n:'Parcours par thème',  d:'Une leçon complète, du début à la fin',wide:1},
  {id:'vocab',   em:'词',c:'clay',  n:'Vocabulaire',         d:'Révision espacée'},
  {id:'chars',   em:'字',c:'indigo',n:'Caractères',          d:'Ordre des traits'},
  {id:'gram',    em:'法',c:'jade',  n:'Grammaire',           d:'Fiches et exercices'},
  {id:'co',      em:'听',c:'plum',  n:'Compréhension orale', d:'Écouter puis répondre'},
  {id:'ce',      em:'读',c:'gold',  n:'Compréhension écrite',d:'Lire puis répondre'},
  {id:'prod',    em:'写',c:'clay',  n:'Production écrite',   d:'Guidée, puis libre'},
  {id:'hsk',     em:'考',c:'indigo',n:'Entraînement HSK',    d:'Au format de l’examen'},
  {id:'chat',    em:'聊',c:'jade',  n:'Conversation',         d:'Dialoguer sur un thème',wide:1}
];

const STEPMARK={text:'读',qcm:'问',mots:'词',gram:'法',prod:'写',chat:'聊',bilan:'考'};

const SVG={
  back:'<path d="M15 5l-7 7 7 7"/>',
  close:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  home:'<path d="M3.5 11L12 3.5 20.5 11"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-5.5h4V20"/>',
  cards:'<rect x="3" y="7.5" width="13" height="12.5" rx="2.5"/><path d="M7.5 7.5V6A2 2 0 0 1 9.5 4h9A2 2 0 0 1 20.5 6v9a2 2 0 0 1-2 2h-1.5"/>',
  flag:'<path d="M5.5 21V3.5"/><path d="M5.5 4.5h12l-2.4 4 2.4 4h-12"/>',
  chart:'<path d="M5 20.5V11"/><path d="M12 20.5V4"/><path d="M19 20.5v-6.5"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/>',
  sound:'<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>'
};

function ico(k,cls){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" ${cls?`class="${cls}"`:''}>${SVG[k]}</svg>`;
}


/* =====================================================================
   COQUE DE NAVIGATION
   L’application est en pages séparées : chaque module a son fichier.
   nav() change de page, go()/back() circulent à l’intérieur d’une page.
   ===================================================================== */
const PAGES={
  home:'index.html', vocab:'vocabulaire.html', chars:'caracteres.html',
  gram:'grammaire.html', co:'ecoute.html', ce:'lecture.html',
  prod:'production.html', hsk:'hsk.html', parcours:'parcours.html',
  chat:'conversation.html', trad:'traducteur.html',
  progres:'progres.html', reglages:'reglages.html'
};
/* Quelle page est ouverte : sert à allumer le bon onglet. */
const PAGE=(function(){
  const f=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  for(const k in PAGES) if(PAGES[k].toLowerCase()===f) return k;
  return 'home';
})();
function nav(id){
  stopSpeech();
  const t=PAGES[id];
  if(!t){toast('Écran inconnu.');return;}
  location.href=t;
}

const TABS=[
  {id:'home',    k:'home', n:'Accueil'},
  {id:'vocab',   k:'cards',n:'Réviser'},
  {id:'parcours',k:'flag', n:'Parcours'},
  {id:'progres', k:'chart',n:'Progrès'},
  {id:'reglages',k:'gear', n:'Réglages'}
];

/* Vue courante à l’intérieur de la page. Chaque page publie son propre
   registre window.VIEWS, et éventuellement window.MOUNT pour ce qui doit
   être branché après le dessin (HanziWriter, zones de tracé). */
let view='',ctx={},stack=[];
/* Le sens d’entrée de la prochaine vue. Vide : aucune animation, ce qui
   évite de faire clignoter l’écran à chaque redessin d’un exercice. */
let NAVDIR='';
/* Les vues où l’on est en train de faire quelque chose, par opposition à
   celles où l’on consulte : la barre d’onglets s’y efface et le bouton
   de tête devient une croix de fermeture. */
const EXOVIEWS=['exo','mots','bilan'];
function isExoView(){
  if(EXOVIEWS.indexOf(view)>=0)return true;
  if(view==='vocab'&&ctx&&ctx.session)return true;
  return false;
}
function go(v,c){stopSpeech();stack.push([view,ctx]);view=v;ctx=c||{};NAVDIR='in-r';render();scrollTo(0,0);}
function back(){
  stopSpeech();
  const p=stack.pop();
  if(p){view=p[0];ctx=p[1];NAVDIR='in-l';render();scrollTo(0,0);return;}
  nav('home');
}
function tab(id){nav(id);}

function render(){
  applyFont();
  const tb=document.getElementById('tabs');
  if(tb)tb.innerHTML=TABS.map(t=>
    `<button class="${PAGE===t.id?'on':''}" onclick="nav('${t.id}')">${ico(t.k)}${t.n}</button>`).join('');
  const app=document.getElementById('app');
  if(!app)return;
  const V=window.VIEWS||{};
  if(!view||!V[view])view=window.HOMEVIEW||Object.keys(V)[0]||'';
  const f=V[view];
  document.body.classList.toggle('exo',isExoView());
  try{app.innerHTML=f?f():'';}
  catch(e){
    app.innerHTML=`<div class="box"><h2>Cet écran n’a pas pu s’afficher</h2>
      <p class="mut sm">${esc(e.message||String(e))}</p>
      <button class="btn" onclick="nav('home')">Revenir à l’accueil</button></div>`;
    try{console.error(e);}catch(_){}
  }
  if(NAVDIR){
    const d=NAVDIR;NAVDIR='';
    app.classList.remove('in','in-r','in-l');
    void app.offsetWidth;
    app.classList.add(d);
  }
  if(typeof window.MOUNT==='function'){try{window.MOUNT();}catch(e){}}
  if(ctx.scrollTo){
    const el=document.getElementById(ctx.scrollTo);
    ctx.scrollTo=null;
    if(el&&el.scrollIntoView)el.scrollIntoView({block:'center',behavior:'smooth'});
  }
}
/* Démarrage commun : la page n’a plus qu’à publier VIEWS. */
function boot(){
  try{buildPyDict();}catch(e){}
  render();
}
document.addEventListener('DOMContentLoaded',boot);


/* --- Fragments --- */
function header(title,sub){
  const x=isExoView();
  return `<div class="top">
    <button class="${x?'xclose':'back'}" onclick="back()" aria-label="${x?'Fermer':'Retour'}">${ico(x?'close':'back')}</button>
    <div class="htitle">${esc(title)}${sub?`<small>${esc(sub)}</small>`:''}</div>
  </div>`;
}

/* Six sceaux carrés : actif en rouge plein, disponible en contour or,
   vide en pointillé pâle. La variante compacte sert sur les écrans de
   module, où le panneau d'accueil n'est pas là pour donner le contexte.
   Lecture tolérante : une page qui ne charge pas tous les fichiers de
   données compte les absents pour zéro. */
function levelPills(mini){
  const n=l=>DATA('WORDS').filter(w=>w.hsk===l).length
            +DATA('TEXTS').filter(t=>t.hsk===l).length
            +DATA('GRAMMAR').filter(g=>g.hsk===l).length;
  return `<div class="hsk${mini?' mini':''}">${[1,2,3,4,5,6].map(l=>{
    const vide=!n(l);
    return `<button class="sk ${S.settings.level===l?'on':vide?'off':''}" onclick="setLevel(${l})">
      ${l}<span class="sub">HSK</span></button>`;
  }).join('')}</div>`;
}

/* Le sélecteur de thème de l'accueil porte la classe « theme » : le
   caractère 题 en rouge, le chevron or, le filet dégradé en soulignement.
   Ailleurs, un selwrap nu suffit. */
function themeSelect(nu){
  return `<div class="selwrap${nu?'':' theme'}"><select onchange="setTheme(this.value)">
    <option value="all">Tous les thèmes</option>
    ${DATA('THEMES').map((t,i)=>`<option value="${t.id}" ${S.settings.theme===t.id?'selected':''}>${i+1}. ${esc(t.n)}</option>`).join('')}
  </select></div>`;
}

function setLevel(l){S.settings.level=l;save();ctx={};render();}

function setTheme(t){S.settings.theme=t;save();ctx={};render();}

function nothing(){
  return `<div class="void"><span class="em">空</span>
    <p><b>Rien à ce filtre</b></p>
    <p class="sm">Le contenu couvre pour l’instant « Se présenter » et « Présenter et décrire quelqu’un », en HSK 2 et HSK 3. Changez de niveau ou de thème.</p></div>`;
}

function ribbon(){
  if(!ctx.from)return '';
  const l=DATA('LESSONS').find(x=>x.id===ctx.from.l);if(!l)return '';
  return `<div class="ribbon"><span class="rs">路</span>
    <span>Étape ${ctx.from.i+1} sur ${l.steps.length}</span>
    <button onclick="finishStep()">Terminé</button></div>`;
}

function finishStep(){
  const {l,i}=ctx.from;
  S.lessons[l]=S.lessons[l]||[];
  if(!S.lessons[l].includes(i))S.lessons[l].push(i);
  touchStreak();save();stopSpeech();
  view='lecon';ctx={l:l};render();scrollTo(0,0);
}

function exportJSON(){
  const b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);
  a.download='coach-chinois-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}

function importJSON(inp){
  const f=inp.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{try{S=Object.assign(S,JSON.parse(r.result));save();render();toast('Progression importée.');}
    catch(e){toast('Fichier illisible.');}};
  r.readAsText(f);
}

function wipe(){
  if(!confirm('Effacer toute la progression ? Cette action est définitive.'))return;
  S.items={};S.written=[];S.lessons={};S.streak={n:0,last:''};save();render();toast('Progression effacée.');
}
