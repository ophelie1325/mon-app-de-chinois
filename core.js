/* =====================================================================
   core.js — socle commun à toutes les pages.
   Chargé en premier, avant speech.js, les fichiers data-*.js et le
   script propre à chaque page.

   Il ne contient aucun contenu pédagogique : uniquement l’état, les
   tons, le son, les boîtes de Leitner, la coque de navigation et le
   dessin d’écran. Une correction faite ici vaut pour toutes les pages.
   ===================================================================== */
const BUILD='20261113a';

/* --- Modèle d’IA -------------------------------------------------------
   Retenu après le banc d’essai du 7 novembre 2026 (page test-ia.html) :
   gemini-3.8-flash a été juste aux trois épreuves, deux essais sur deux.
   Le modèle est nommé en clair : l’alias « gemini-flash-latest » change
   de cible sans prévenir. La réflexion se règle par fonction :
   low quand on attend la réponse pour continuer (conversation,
   traducteur), medium pour la correction et le bilan, high pour
   l’enrichissement en lot, où le temps ne compte pas. */
const GMODEL='gemini-3.8-flash';
const DSMODEL='deepseek-flash';
const AMODEL='claude-haiku-4-5-20251001';
const IA_NOM={gemini:'Gemini',anthropic:'Anthropic',deepseek:'DeepSeek'};

/* --- Cohérence de la livraison ---------------------------------------
   Le marqueur figure à trois endroits : la constante ci-dessus, la
   variable --build de core.css, et la chaîne ?v= des balises de la page.
   Servis depuis le cache, ces trois-là peuvent diverger : l’application
   tourne alors sur un mélange de deux livraisons, des correctifs livrés
   restent invisibles, et rien ne le signale. C’est ce qui a fait chercher
   une panne de voix là où il n’y en avait plus.
   ===================================================================== */
function buildsVus(){
  const l=[BUILD];
  try{
    const c=getComputedStyle(document.documentElement)
      .getPropertyValue('--build').replace(/["'\s]/g,'');
    if(c)l.push(c);
  }catch(e){}
  const n=document.querySelectorAll('script[src],link[href]');
  for(let i=0;i<n.length;i++){
    const u=n[i].getAttribute('src')||n[i].getAttribute('href')||'';
    const m=u.match(/[?&]v=([^&]+)/);
    if(m)l.push(m[1]);
  }
  const u=[];
  for(let i=0;i<l.length;i++) if(l[i]&&u.indexOf(l[i])<0) u.push(l[i]);
  return u;
}
/* Renvoie 'reload' quand la page se recharge : l’appelant s’arrête là. */
function buildCheck(){
  const vus=buildsVus();
  if(vus.length<=1)return 'ok';
  const cle='coach-build-recharge';
  let deja='';
  try{deja=sessionStorage.getItem(cle)||'';}catch(e){}
  if(!deja){
    /* C’est le plus souvent la page HTML elle-même qui est périmée et
       réclame d’anciens fichiers : on la redemande hors cache. */
    try{sessionStorage.setItem(cle,vus.join(' '));}catch(e){}
    location.replace(location.pathname+'?r='+Date.now());
    return 'reload';
  }
  const d=document.createElement('div');
  d.className='bwarn';
  d.innerHTML='<b>Versions mélangées</b> — '+vus.join(' · ')+
    '. Le rechargement n’a pas suffi : videz le cache du navigateur, ou '+
    'supprimez puis réinstallez le raccourci de l’écran d’accueil.';
  if(document.body)document.body.insertBefore(d,document.body.firstChild);
  return 'warn';
}


const KEY='coach-chinois-v2';

let memoryOnly=false;

function loadState(){
  const base={items:{},written:[],lessons:{},streak:{n:0,last:''},lastLesson:'',fav:[],enrich:{},
    settings:{level:2,theme:'all',provider:'none',apikey:'',rate:.85,font:'sans',
      pause:.7,sfx:true,auto:false,flow:'decoupe',gmodel:'',gver:'v1beta',gauth:'query',gjson:true,backup:'none',backupKey:'',chatOneQ:true,chatTurns:7,chatDemote:true,
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
   silencieusement, plutôt que de faire confiance à ce qu’on relit. */
function normState(S){
  const obj=v=>(v&&typeof v==='object'&&!Array.isArray(v))?v:{};
  S.items=obj(S.items);
  for(const k in S.items){
    const r=S.items[k];
    if(!r||typeof r!=='object'){delete S.items[k];continue;}
    r.box=Math.min(5,Math.max(0,Number(r.box)||0));
    r.due=Number(r.due)||0;
    r.seen=Number(r.seen)||0;r.ok=Number(r.ok)||0;r.ko=Number(r.ko)||0;
    r.kos=Number(r.kos)||0;
    r.last=typeof r.last==='string'?r.last:'';
  }
  /* Les favoris du traducteur. Ils sont du contenu, pas de la
     progression : wipe() ne doit pas y toucher, l’export les emporte. */
  S.fav=Array.isArray(S.fav)?S.fav.filter(f=>f&&typeof f==='object'&&f.id&&f.hz):[];
  S.fav.forEach(f=>{
    f.py=String(f.py||'');f.fr=String(f.fr||'');
    if(['mot','morceau','phrase'].indexOf(f.type)<0)f.type='mot';
    f.exs=Array.isArray(f.exs)?f.exs.filter(x=>x&&x.hz):[];
    f.syn=Array.isArray(f.syn)?f.syn.filter(x=>x&&x.hz):[];
    f.vois=Array.isArray(f.vois)?f.vois.filter(x=>x&&x.hz):[];
    f.decomp=Array.isArray(f.decomp)?f.decomp.filter(x=>x&&x.c):[];
    if(!f.faute||typeof f.faute!=='object'||!f.faute.hz)f.faute=null;
    f.t=Number(f.t)||0;
  });
  /* Données d’exercice ajoutées après coup aux mots du corpus. */
  S.enrich=obj(S.enrich);
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
  if(['none','deepseek','anthropic'].indexOf(S.settings.backup)<0)S.settings.backup='none';
  S.settings.backupKey=String(S.settings.backupKey||'');
  /* Anciens choix de modèle (alias « latest », génération 2) : on passe
     au modèle retenu. Un modèle de génération 3 choisi exprès est gardé. */
  const gm=String(S.settings.gmodel||'');
  if(!gm||/latest|^gemini-[0-2]\./.test(gm)){S.settings.gmodel=GMODEL;S.settings.gjson=true;}
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

const HAN_RE=/[㐀-䶿一-鿿豈-﫿]/;

const PY_PONCT=/[\s,，.。、·？?！!;；:："“”‘’'`()（）《》「」…—–\-]+/;

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
    const nu0=t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
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

/* ---- Réparation du pinyin renvoyé par l’IA ----------------------------
   Trois défauts relevés au banc d’essai, dont la bonne forme est certaine :
   · erhua détaché après 哪 这 那 点 会 玩 : « nǎ er », « zhè r » → nǎr, zhèr
     (le 儿 de 儿子, 女儿 n’est pas touché) ;
   · erhua sans 儿 dans les caractères : 有点 « diǎnr » → diǎn ;
   · ton changé de 一 et de 不 devant un autre ton : yī ge → yí ge,
     bù shì → bú shì, yí qǐ → yì qǐ. 一 reste yī quand il compte ou
     numérote : fin de mot, 第一, 星期一, 十一, 一月, 一号, 一年级 ;
     celui du verbe redoublé (看一看) n’est pas touché non plus.
   Si l’alignement caractères ↔ syllabes échoue, rien n’est touché :
   pinyinCheck tranchera ensuite, comme avant. */
const ER_BASE='哪这那点会玩';
const PY_SEP=new RegExp('('+PY_PONCT.source+')');
function pyRepair(hz,py){
  hz=String(hz||'');py=String(py||'');
  if(!py||!HAN_RE.test(hz))return py;
  const han=[];Array.from(hz).forEach((c,i)=>{if(HAN_RE.test(c))han.push({c:c,i:i});});
  const parts=py.split(PY_SEP),toks=[];
  parts.forEach((t,pi)=>{if(pi%2===0&&t)toks.push({pi:pi,t:t});});
  let i=0;
  for(const T of toks){
    const t=T.t,n=pyBare(t);
    if(n==='r'){if(han[i]&&han[i].c==='儿'){T.h=i;T.rSeul=true;T.ton=0;i++;continue;}return py;}
    if(/^[A-Za-zÀ-ÿ'’-]+$/.test(t)&&!SYL.has(n)&&hz.toLowerCase().includes(t.toLowerCase())){T.h=-1;continue;}
    const nu0=t.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
    if(/^(ng|hm|hng|m|n|ê)$/.test(nu0)){T.h=i;T.ton=0;T.nu=nu0;i++;continue;}
    let er=false;
    if(!SYL.has(n)){if(n.length>2&&n.slice(-1)==='r'&&SYL.has(n.slice(0,-1)))er=true;else return py;}
    if(i>=han.length)return py;
    T.h=i;T.er=er;T.ton=toneOf(t);T.nu=er?n.slice(0,-1):n;
    T.er2=er&&!!han[i+1]&&han[i+1].c==='儿';
    i+=T.er2?2:1;
  }
  if(i!==han.length)return py;
  const colle=(a,b)=>han[b]&&han[a]&&han[b].i===han[a].i+1;
  const suivant=k=>{for(let j=k+1;j<toks.length;j++)if(!toks[j].del&&toks[j].h>=0)return toks[j];return null;};
  for(let k=0;k<toks.length;k++){
    const T=toks[k];
    if(T.h<0)continue;
    const c=han[T.h].c,P=k>0?toks[k-1]:null;
    /* 1. erhua détaché */
    if(c==='儿'&&P&&!P.del&&P.h===T.h-1&&!P.er&&colle(T.h-1,T.h)&&
       (T.rSeul||(T.nu==='er'&&ER_BASE.includes(han[T.h-1].c)))){
      P.t+='r';T.del=true;continue;
    }
    /* 2. erhua sans 儿 */
    if(T.er&&!T.er2){T.t=T.t.slice(0,-1);T.er=false;continue;}
    /* 3. 一 */
    /* 看一看, 商量一商量 : le 一 du verbe redoublé n’est pas touché. */
    const redouble=c==='一'&&[1,2].some(n=>{const z=Array.from(hz),j=han[T.h].i;
      return j-n>=0&&z.slice(j-n,j).join('')===z.slice(j+1,j+1+n).join('');});
    if(c==='一'&&T.nu==='yi'&&T.ton!==0&&!redouble){
      const pc=colle(T.h-1,T.h)?han[T.h-1].c:'';
      const nx=colle(T.h,T.h+1)?han[T.h+1].c:'';
      const nx2=colle(T.h+1,T.h+2)?han[T.h+2].c:'';
      const S2=suivant(k);
      let v=0;
      if(!nx||(pc&&'第期零〇一二三四五六七八九十'.includes(pc))||
         '零〇一二三四五六七八九十月号'.includes(nx)||(nx==='年'&&nx2==='级'))v=1;
      else if(S2&&S2.h===T.h+1){
        if(S2.ton===4||(S2.ton===0&&nx==='个'))v=2;
        else if(S2.ton>=1&&S2.ton<=3)v=4;
      }
      if(v&&v!==T.ton)T.t=setTone(T.t,v);
      continue;
    }
    /* 4. 不 */
    if(c==='不'&&T.nu==='bu'&&T.ton!==0){
      const S2=suivant(k);
      if(colle(T.h,T.h+1)&&S2&&S2.h===T.h+1){
        if(S2.ton===4&&T.ton!==2)T.t=setTone(T.t,2);
        else if(S2.ton>=1&&S2.ton<=3&&T.ton===2)T.t=setTone(T.t,4);
      }
    }
  }
  toks.forEach(T=>{
    if(T.del){parts[T.pi]='';if(T.pi>0&&/^\s+$/.test(parts[T.pi-1]))parts[T.pi-1]='';}
    else parts[T.pi]=T.t;
  });
  return parts.join('');
}
/* Répare tout pinyin d’un objet renvoyé par l’IA : chaque objet qui porte
   un champ py à côté de son chinois (hz, ou mieux pour les reformulations). */
function pyRepairDeep(o){
  if(Array.isArray(o)){o.forEach(pyRepairDeep);return o;}
  if(!o||typeof o!=='object')return o;
  if(typeof o.py==='string'){
    const z=typeof o.hz==='string'?o.hz:(typeof o.mieux==='string'?o.mieux:null);
    if(z)try{o.py=pyRepair(z,o.py);}catch(e){}
  }
  for(const k in o)if(o[k]&&typeof o[k]==='object')pyRepairDeep(o[k]);
  return o;
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

/* =====================================================================
   BÀNBÀN 伴伴, LA MASCOTTE
   Huit poses détourées, dans img/. Une pose a toujours un rôle : on ne
   pose pas le panda pour décorer, il dit quelque chose de l’écran.
   ===================================================================== */
const POSES={
  salut:'fait signe de la patte',saut:'saute de joie',encourage:'lève la patte pour encourager',
  pense:'réfléchit, la patte au menton',pinceau:'tient un pinceau',lit:'lit un livre',
  lanterne:'tient une lanterne allumée',dort:'dort, roulé en boule'
};
function banban(p,cl,tout){
  return `<img class="bb ${cl||''}" src="img/banban-${p}.webp" alt="Bànbàn ${POSES[p]||''}"`+
    `${tout?'':' loading="lazy"'} decoding="async">`;
}
/* Le panda qui parle : la pose à gauche, la bulle à droite. */
function coach(p,html){
  return `<div class="coach">${banban(p,'bob',1)}<div class="say">${html}</div></div>`;
}
/* Une activité aujourd’hui, c’est ce que touchStreak a déjà noté. */
function actifAujourdhui(){return !!(S.streak&&S.streak.last===new Date().toDateString());}

/* ---------- Le trait d’encre sous les titres ----------
   Une touche d’encre de Chine qui bave un peu : un aplat dont les bords
   sont dérangés par un bruit fractal, en dégradé rouge laque → ocre.
   Le SVG est étiré à la largeur exacte du titre ; le filtre et le
   dégradé sont déclarés une seule fois dans la page, au démarrage. */
const ENCRE_DEFS=`<svg class="encre-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="encreGrad" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="#B8342E"/><stop offset=".5" stop-color="#B4482C"/><stop offset="1" stop-color="#C08A2E"/>
  </linearGradient>
  <filter id="encreBave" x="-3%" y="-90%" width="106%" height="280%">
    <feTurbulence type="fractalNoise" baseFrequency="0.045 0.6" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation=".22"/>
  </filter>
</defs></svg>`;
function encre(){
  return `<svg class="encre" viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <g filter="url(#encreBave)" fill="url(#encreGrad)">
      <path d="M2 8.2C18 5.6 46 4.6 78 5.2S150 4.4 186 5.6C193 5.9 198 6.6 198 7.6C198 8.6 193 8.9 186 9.1C150 9.9 112 9.4 80 10.1S24 11.6 7 11.3C3 11.2 1 10.4 1.2 9.4C1.3 8.9 1.6 8.5 2 8.2Z"/>
      <circle cx="4.6" cy="9.3" r="2.6"/>
      <path d="M116 5.4C146 4.6 172 4.8 191 5.8" stroke="url(#encreGrad)" stroke-width=".7" fill="none" stroke-dasharray="22 3 10 4 26 2" opacity=".75"/>
      <path d="M104 10.6C136 10.4 160 10 181 9.6" stroke="url(#encreGrad)" stroke-width=".6" fill="none" stroke-dasharray="14 5 20 3" opacity=".6"/>
    </g></svg>`;
}
/* Les titres de section reçoivent leur trait après l’affichage : il y en
   a dans toutes les pages, inutile de toucher chaque gabarit. */
function encrerTitres(racine){
  (racine||document).querySelectorAll('h2.sec:not(.enc)').forEach(h=>{
    h.classList.add('enc');
    h.innerHTML=`<span class="ink">${h.innerHTML}${encre()}</span>`;
  });
}

/* ---------- Le tremblement sur une réponse fausse ----------
   beep('no') est appelé partout où une réponse est fausse : c’est le
   seul point d’entrée. On secoue le bouton touché s’il porte la marque
   d’erreur, sinon le verdict d’erreur du même bloc. Le bouton est
   retrouvé par son rang, puisque render() a refait le DOM entre-temps. */
let DERNIER_BTN=-1,A_SECOUER=false;
document.addEventListener('click',e=>{
  const b=e.target&&e.target.closest?e.target.closest('#app button'):null;
  DERNIER_BTN=b?[...document.querySelectorAll('#app button')].indexOf(b):-1;
},true);
function secoue(){
  if(!A_SECOUER)return;
  A_SECOUER=false;
  const bs=document.querySelectorAll('#app button');
  const b=bs[DERNIER_BTN];
  let el=null;
  if(b&&/(^|\s)(no|mauvais)(\s|$)/.test(b.className))el=b;
  else{
    const bloc=b&&b.closest('.box');
    el=bloc&&bloc.querySelector('.verdict.no');
    if(!el){const v=document.querySelectorAll('#app .verdict.no');if(v.length===1)el=v[0];}
  }
  if(!el)return;
  el.classList.remove('secoue');void el.offsetWidth;el.classList.add('secoue');
}

/* ---------- Le bandeau Bravo ----------
   Il monte du bas, Bànbàn saute deux fois, des confettis tombent. Il vit
   hors de #app : un render() ne l’efface pas. */
function bravo(o){
  o=o||{};
  fermeBravo();
  const couleurs=['#D9483C','#B8342E','#F3D9A6','#E8B64A','#3D7A69'];
  let conf='';
  for(let k=0;k<22;k++){
    const x=Math.round(Math.random()*300-150),y=Math.round(-90-Math.random()*70);
    conf+=`<i style="left:${x}px;top:${y}px;background:${couleurs[k%5]};--dx:${Math.round(Math.random()*320-160)}px;`+
      `--r:${Math.round(Math.random()*1000-500)}deg;animation-delay:${(.25+Math.random()*.45).toFixed(2)}s"></i>`;
  }
  const d=document.createElement('div');
  d.className='bravo-voile';
  d.innerHTML=`<div class="bravo" role="dialog" aria-modal="true" aria-label="Bravo">
    <div class="fx" aria-hidden="true">${conf}</div>
    <div class="row">${banban(o.pose||'saut','saute',1)}
      <div><h3><span class="hz">太棒了！</span>${esc(o.titre||'Bravo\u202F!')}</h3>
        <p class="py"><span class="s4">tài</span> <span class="s4">bàng</span> <span class="s0">le</span></p>
        ${o.texte?`<p>${esc(o.texte)}</p>`:''}</div></div>
    <button class="btn jade" onclick="fermeBravo()">Continuer</button></div>`;
  d.addEventListener('click',e=>{if(e.target===d)fermeBravo();});
  document.body.appendChild(d);
  try{d.querySelector('button').focus({preventScroll:true});}catch(e){}
}
function fermeBravo(){document.querySelectorAll('.bravo-voile').forEach(x=>x.remove());}
document.addEventListener('keydown',e=>{if(e.key==='Escape')fermeBravo();});

function beep(kind){
  if(kind==='no'){A_SECOUER=true;setTimeout(secoue,0);}
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
/* Intervalles en jours. Le démarrage est volontairement serré : un mot
   neuf doit revenir le jour même, puis le lendemain. La queue reste
   longue pour ne pas encombrer les séances une fois le mot installé. */
const BOXES=[0,0.25,1,4,14,45];

function rec(id){if(!S.items[id])S.items[id]={box:0,due:0,seen:0,ok:0,ko:0};return S.items[id];}

function boxOf(id){return (S.items[id]||{box:0}).box;}

function due(id){const r=S.items[id];return !r||r.due<=Date.now();}

/* Trois verdicts : 0 raté ou oublié, 1 hésité ou approximatif, 2 su.
   Un raté fait reculer d’un seul cran. Renvoyer à la boîte 0 un mot
   acquis depuis des semaines parce qu’il a été manqué une fois est
   punitif et faux : rater n’est pas n’avoir jamais su. Deux échecs
   consécutifs font en revanche reculer de deux crans, parce que là
   c’est bien le mot qui n’est pas installé. */
function grade(id,g){
  const r=rec(id);r.seen++;
  if(g===0){
    const chaine=(r.kos||0)+1;
    r.kos=chaine;
    r.box=Math.max(0,r.box-(chaine>=2?2:1));
    r.ko++;
  }else if(g===1){
    r.kos=0;r.ko++;
    /* L’hésitation ne fait pas reculer, mais ne fait pas monter non
       plus : le mot revient à l’échéance qu’il avait déjà. */
  }else{
    r.kos=0;
    r.box=Math.min(BOXES.length-1,r.box+1);r.ok++;
  }
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

/* ---- Les quatre états d’un mot --------------------------------------
   Seul endroit où ils sont définis (Vocabulaire, Progrès).
     pas encore vu : jamais présenté ;
     fragile       : boîte 0 ou 1 après au moins une erreur ;
     su            : boîte 4 ou 5 ;
     en cours      : tout le reste. */
function etatMot(id){
  const r=S.items[id];
  if(!r||!r.seen)return 'neuf';
  if(r.box>=4)return 'su';
  if(r.box<=1&&r.ko>0)return 'frag';
  return 'cours';
}
const ETATS={
  su:   {n:'Su',           p:'sus',            c:'#3D7A69',f:1,  t:'il revient de loin en loin, pour vérifier'},
  cours:{n:'En cours',     p:'en cours',       c:'#D9A441',f:.6, t:'bien parti, encore quelques révisions'},
  frag: {n:'Fragile',      p:'fragiles',       c:'#B8342E',f:.25,t:'il revient souvent, jusqu’à ce qu’il tienne'},
  neuf: {n:'Pas encore vu',p:'pas encore vus', c:'#DCCFBD',f:0,  t:'il arrivera dans une prochaine séance'}
};
/* Du plus fragile au plus sûr : sert au tri et au choix de la séance. */
const RANG={frag:0,cours:1,neuf:2,su:3};


/* --- Filtres --- */
function fits(o){
  if(o.hsk!==S.settings.level)return false;
  const T=S.settings.theme;
  if(T!=='all'&&!(o.th||[]).includes(T))return false;
  return true;
}

/* Un mot n’entre dans les séances qu’une fois rencontré : dans une
   leçon commencée de son niveau et de son thème (mots des leçons), ou
   dans une fiche de grammaire découverte (champ g), que la fiche ait
   été ouverte seule ou par l’étape « Point de langue » d’une leçon. Un
   mot déjà travaillé ne se rendort jamais. Les leçons, textes et 聊
   continuent de puiser dans tous les mots des leçons (motsLecon). */
function deLecon(w){return !w.src||w.src.indexOf('lecon')>=0;}
function lecVue(l){return ((S.lessons||{})[l.id]||[]).length>0;}
function ficheVue(id){
  const g=S.gram||{};
  if(g[id]&&g[id].vu)return true;
  return DATA('LESSONS').some(l=>l.steps.some((st,i)=>st.k==='gram'&&st.ref===id&&((S.lessons||{})[l.id]||[]).indexOf(i)>=0));
}
function motActif(w){
  if(S.items[w.id])return true;
  if(deLecon(w)){
    const L=DATA('LESSONS');
    if(!L.length)return true;   /* page sans les leçons : lecture tolérante */
    if(L.some(l=>l.hsk===w.hsk&&(w.th||[]).indexOf(l.theme)>=0&&lecVue(l)))return true;
  }
  return (w.g||[]).some(ficheVue);
}
/* Un caractère se montre dès qu’un mot actif le contient. */
function carActif(c){
  if(S.items[c.id])return true;
  return motsActifs().some(w=>w.hz.indexOf(c.hz)>=0);
}
function motsLecon(){return DATA('WORDS').filter(deLecon);}
function motsActifs(){return DATA('WORDS').filter(motActif);}

function pool(){return DATA('WORDS').filter(w=>fits(w)&&motActif(w));}

/* Les favoris ne portent ni niveau ni thème : ils ne passent donc pas
   par fits(). C’est voulu — en révision, le niveau et le thème ne
   servent à rien, seule la boîte compte. Ils sortent toujours. */
function favPool(){return (S.fav||[]).slice().sort((a,b)=>b.t-a.t);}
function favFind(id){return (S.fav||[]).find(f=>f.id===id)||null;}
/* Un mot, d’où qu’il vienne : corpus ou carnet. */
function anyWord(id){
  return DATA('WORDS').find(w=>w.id===id)||favFind(id)||null;
}
/* Les données d’exercice d’un mot du corpus, ajoutées après coup. */
function enrichOf(w){return (S.enrich&&S.enrich[w.id])||{};}
function favDue(){return favPool().filter(f=>due(f.id)).length;}

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


/* --- Correction assistée (facultative) ---
   Réflexion « medium » : c’est là qu’une erreur coûte le plus cher, et
   une dizaine de secondes reste acceptable pour une correction. */
async function correct(text,consigne){
  const p=S.settings.provider,k=(S.settings.apikey||'').trim();
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
  const msgs=[{role:'user',text:prompt}];
  let err;
  try{return await iaTexte(p,k,null,msgs,'medium',false);}catch(e){err=e;}
  const b=secours();
  if(!b)throw err;
  try{
    const t=await iaTexte(b,S.settings.backupKey.trim(),null,msgs,'medium',false);
    viaSecours(b,err);return t;
  }catch(e2){throw new Error(err.message+' — secours '+IA_NOM[b]+' : '+e2.message);}
}

/* ---- Teintes du tracé -----------------------------------------------
   HanziWriter attend des couleurs en paramètres JavaScript, pas en CSS.
   Plutôt que de les recopier ici — où elles ne suivraient pas un
   changement de palette —, on lit les variables de la feuille au moment
   du montage. core.css reste seul maître de l’apparence. */
function cssVar(nom){
  try{return getComputedStyle(document.documentElement).getPropertyValue(nom).trim();}
  catch(e){return '';}
}
/* Aucune couleur de repli n’est écrite ici : ce serait une seconde
   source de vérité, et elle finirait par diverger. Si une variable
   manque, la clé n’est pas transmise et HanziWriter garde la sienne. */
function teintesTrace(){
  const t={},m={strokeColor:'--ink',outlineColor:'--trace-guide',
    drawingColor:'--red',highlightColor:'--jade'};
  Object.keys(m).forEach(k=>{const v=cssVar(m[k]);if(v)t[k]=v;});
  return t;
}

/* ---- Un appel qui rapporte un objet, quel que soit le fournisseur ----
   correct() n’est pas un tuyau neutre : elle enrobe sa consigne dans un
   gabarit de correction de copie. Lui demander du JSON revenait à donner
   au modèle deux ordres contradictoires, et la lecture échouait presque
   toujours. Tout ce qui attend une structure passe donc par ici.
   niveau : réflexion demandée (low par défaut). */
async function askJSON(sys,user,schema,temp,niveau){
  return await iaJSON(sys,[{role:'user',parts:[{text:user}]}],schema,temp,niveau);
}
/* Même chose avec un historique au format Gemini (module 聊). Le nom est
   resté ; depuis novembre 2026 l’appel suit le fournisseur choisi et
   passe au secours en cas d’échec, comme le reste. */
async function gemJSON(sys,contents,schema,temp,niveau){
  return await iaJSON(sys,contents,schema,temp,niveau);
}

/* ---- Le circuit commun : fournisseur principal, puis secours ---- */
function secours(){
  const b=S.settings.backup,k=(S.settings.backupKey||'').trim();
  return (b&&b!=='none'&&b!==S.settings.provider&&k)?b:null;
}
function viaSecours(b,err){
  const why=String((err&&err.message)||'').slice(0,80);
  try{toast(IA_NOM[S.settings.provider]+' indisponible'+(why?' ('+why+')':'')+' : réponse fournie par le secours, '+IA_NOM[b]+'.');}catch(e){}
}
function versMsgs(contents){
  return (contents||[]).map(c=>({role:c.role==='model'?'assistant':'user',
    text:((c.parts||[]).map(x=>x.text||'').join(''))}));
}
function litObjet(txt){
  let t=String(txt||'').replace(/```json|```/g,'').trim();
  const a=t.indexOf('{'),b=t.lastIndexOf('}');
  if((a>0||b<t.length-1)&&a>=0&&b>a)t=t.slice(a,b+1);
  try{return JSON.parse(t);}catch(e){throw new Error('Réponse illisible du modèle.');}
}
async function iaJSON(sys,contents,schema,temp,niveau){
  const p=S.settings.provider,k=(S.settings.apikey||'').trim(),lv=niveau||'low';
  if(p==='none'||!k)throw new Error('aucune clé');
  let err;
  try{
    const o=(p==='gemini')?await gemObjet(sys,contents,schema,temp,lv)
                          :litObjet(await iaTexte(p,k,sys,versMsgs(contents),lv,true));
    return pyRepairDeep(o);
  }catch(e){err=e;}
  const b=secours();
  if(!b)throw err;
  try{
    const o=litObjet(await iaTexte(b,S.settings.backupKey.trim(),sys,versMsgs(contents),lv,true));
    viaSecours(b,err);
    return pyRepairDeep(o);
  }catch(e2){throw new Error(err.message+' — secours '+IA_NOM[b]+' : '+e2.message);}
}

const JSON_SEUL='\n\nRéponds UNIQUEMENT par un objet JSON brut, sans balise de code ni commentaire.';

/* Un appel texte vers n’importe quel fournisseur. msgs : [{role,text}].
   json : la réponse attendue est un objet. */
async function iaTexte(fournisseur,cle,sys,msgs,niveau,json){
  if(fournisseur==='gemini'){
    const contents=msgs.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.text}]}));
    const r=await gemCall(S.settings.gmodel||GMODEL,sys?sys+(json?JSON_SEUL:''):(json?JSON_SEUL.trim():null),contents,null,undefined,niveau);
    if(!r.ok)throw new Error(r.msg+(r.status?' ('+r.status+')':''));
    return r.txt;
  }
  if(fournisseur==='anthropic'){
    const body={model:AMODEL,max_tokens:4000,messages:msgs.map(m=>({role:m.role,content:m.text}))};
    if(sys||json)body.system=(sys||'')+(json?JSON_SEUL:'');
    let r;
    try{
      r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
        headers:{'content-type':'application/json','x-api-key':cle,'anthropic-version':'2023-06-01',
          'anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify(body)});
    }catch(e){throw new Error('réseau injoignable, ou requête bloquée par le navigateur');}
    if(!r.ok)throw new Error('erreur '+r.status);
    const d=await r.json();
    const t=(d.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n');
    if(!t)throw new Error('réponse vide');
    return t;
  }
  if(fournisseur==='deepseek'){
    /* Sans réflexion il répond en deux secondes ; avec, il est juste mais
       lent : on ne la demande que pour la correction et les lots. Il lui
       arrive d’expliquer en chinois : la consigne le lui interdit. */
    const pense=niveau==='medium'||niveau==='high';
    const consigne=(sys?sys+'\n\n':'')+'Rédige toutes les explications et notes en français.'+(json?JSON_SEUL:'');
    const body={model:DSMODEL,messages:[{role:'system',content:consigne}].concat(msgs.map(m=>({role:m.role,content:m.text}))),
      thinking:{type:pense?'enabled':'disabled'}};
    if(json)body.response_format={type:'json_object'};
    let r;
    try{
      r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',
        headers:{'content-type':'application/json',Authorization:'Bearer '+cle},body:JSON.stringify(body)});
    }catch(e){throw new Error('réseau injoignable, ou requête bloquée par le navigateur');}
    if(!r.ok){let m='';try{const d=await r.json();m=(d.error&&d.error.message)||'';}catch(e){}
      throw new Error('erreur '+r.status+(m?' : '+String(m).slice(0,120):''));}
    const d=await r.json();
    const t=(((d.choices||[])[0]||{}).message||{}).content;
    if(!t)throw new Error('réponse vide');
    return String(t);
  }
  throw new Error('fournisseur inconnu');
}

/* Essai du secours, depuis les Réglages. */
async function testSecours(){
  const b=S.settings.backup,k=(S.settings.backupKey||'').trim();
  ctx.testB={busy:true};render();
  try{
    const t=await iaTexte(b,k,null,[{role:'user',text:'Écris « bonjour » en chinois, sans rien d’autre.'}],'low',false);
    ctx.testB={ok:true,msg:'Le secours répond ('+IA_NOM[b]+') : '+String(t).trim().slice(0,30)};
  }catch(e){ctx.testB={ok:false,msg:'Le secours ne répond pas : '+(e.message||e)};}
  render();
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
  /* Modèle retenu en premier, puis la génération précédente en repli. */
  const pref=[GMODEL,'gemini-3.6-flash','gemini-3.5-flash-lite','gemini-flash-latest'];
  const cands=pref.filter(x=>noms.indexOf(x)>=0)
    .concat(noms.filter(x=>pref.indexOf(x)<0&&!/tts|image|embedding|vision|live|native-audio/.test(x)));
  S.settings.gver=bon[0];S.settings.gauth=bon[1];save();
  const SCH={type:'object',properties:{hz:{type:'string'}},required:['hz']};
  const MSG=[{role:'user',parts:[{text:'Écris « bonjour » en chinois.'}]}];
  for(const m of cands.slice(0,6)){
    let r=await gemCall(m,'Tu réponds en JSON.',MSG,SCH,undefined,'low');
    if(r.ok){
      S.settings.gmodel=m;S.settings.gjson=true;save();
      return fin(true,'Tout fonctionne. Modèle retenu : '+m+', en '+bon[0]+', clé dans l’'+authNom(bon[1])+
        ', sortie JSON structurée. Essai renvoyé : '+String(r.txt).slice(0,40),
        essais.concat(noms.length+' modèles accessibles'));
    }
    essais.push(m+' · JSON structuré → '+r.status+' : '+r.msg);
    r=await gemCall(m,'Tu réponds uniquement par un objet JSON brut.',MSG,null,undefined,'low');
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

async function gemObjet(sys,contents,schema,temp,niveau){
  const m=S.settings.gmodel||GMODEL;
  const strict=S.settings.gjson!==false;
  const sys2=strict?sys:sys+'\n\nRéponds UNIQUEMENT par un objet JSON brut, sans balises de code ni commentaire.';
  const r=await gemCall(m,sys2,contents,strict?schema:null,temp,niveau);
  if(!r.ok)throw new Error(r.msg+(r.status?' ('+r.status+')':''));
  return litObjet(r.txt);
}

/* ---- Un appel de génération, avec le message d’erreur de Google ----
   Génération 3 : la température est abandonnée par Google (ignorée, et
   refusée à terme) ; on règle la réflexion à la place. Les générations
   antérieures gardent la température : le traducteur descend à 0,3. */
async function gemCall(model,sys,contents,schema,temp,niveau){
  const g3=/^gemini-(?:[3-9]|\d\d)/.test(model);
  const body={contents:contents};
  if(sys)body.systemInstruction={parts:[{text:sys}]};
  const gc={};
  if(!g3)gc.temperature=(typeof temp==='number')?temp:.8;
  if(g3&&niveau)gc.thinkingConfig={thinkingLevel:niveau};
  if(schema){gc.responseMimeType='application/json';gc.responseSchema=schema;}
  body.generationConfig=gc;
  const envoi=async()=>{
    try{return await fetch(gURL('models/'+model+':generateContent'),{method:'POST',headers:gHead(),body:JSON.stringify(body)});}
    catch(e){return null;}
  };
  let r=await envoi();
  /* Un modèle qui refuse ce niveau de réflexion : on réessaie sans. */
  if(r&&r.status===400&&gc.thinkingConfig){delete gc.thinkingConfig;r=await envoi();}
  if(!r)return {ok:false,status:0,msg:'réseau injoignable, ou requête bloquée par le navigateur'};
  if(!r.ok){const e=await gErrMsg(r);
    return {ok:false,status:e.status,gstatus:e.gstatus,msg:(e.message||gemErr(e.status,'')).slice(0,220)};}
  let d={};try{d=await r.json();}catch(e){return {ok:false,status:200,msg:'réponse illisible'};}
  const txt=((d.candidates||[])[0]&&(d.candidates||[])[0].content&&(d.candidates||[])[0].content.parts||[])
            .filter(x=>!x.thought).map(x=>x.text||'').join('');
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
      body:JSON.stringify({model:AMODEL,max_tokens:16,messages:[{role:'user',content:'Réponds : ok'}]})});
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
  {id:'trad',    em:'译',c:'gold',  n:'Traducteur',          d:'Traduire, puis garder au carnet'},
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
  /* L’icône ne porte que son tracé. Teinte, épaisseur et jointures
     sont décidées dans core.css, pour toutes les icônes à la fois. */
  return `<svg viewBox="0 0 24 24" class="ico ${cls||''}">${SVG[k]}</svg>`;
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
let PREMIER_RENDU=false;
/* Les vues où l’on est en train de faire quelque chose, par opposition à
   celles où l’on consulte : la barre d’onglets s’y efface et le bouton
   de tête devient une croix de fermeture. */
const EXOVIEWS=['exo','mots','bilan'];
function isExoView(){
  if(EXOVIEWS.indexOf(view)>=0)return true;
  if(view==='vocab'&&ctx&&ctx.session)return true;
  /* Les vues plein écran d’une page (fiche d’un mot, tracé) : la page
     les déclare dans window.PLEINVIEWS. */
  if((window.PLEINVIEWS||[]).indexOf(view)>=0)return true;
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
  /* Les entrées en cascade ne jouent qu’à l’arrivée sur un écran, pas à
     chaque réponse : render() refait tout le DOM à chaque clic. */
  app.classList.toggle('fresh',!!NAVDIR||!PREMIER_RENDU);
  PREMIER_RENDU=true;
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
  encrerTitres(app);
  if(typeof window.MOUNT==='function'){try{window.MOUNT();}catch(e){}}
  if(ctx.scrollTo){
    const el=document.getElementById(ctx.scrollTo);
    ctx.scrollTo=null;
    if(el&&el.scrollIntoView)el.scrollIntoView({block:'center',behavior:'smooth'});
  }
}
/* Démarrage commun : la page n’a plus qu’à publier VIEWS. */
/* La barre système d’Android prend la couleur du papier. Elle ne peut
   pas être déclarée en CSS — c’est une balise meta — mais elle n’a pas à
   être recopiée dans les treize pages pour autant : on la pose au
   démarrage depuis la variable de la feuille. */
function poseBarre(){
  const m=document.querySelector('meta[name="theme-color"]');
  const c=cssVar('--bg');
  if(m&&c)m.setAttribute('content',c);
}

function boot(){
  poseBarre();
  if(!document.querySelector('.encre-defs'))document.body.insertAdjacentHTML('afterbegin',ENCRE_DEFS);
  if(buildCheck()==='reload')return;
  try{buildPyDict();}catch(e){}
  render();
}
document.addEventListener('DOMContentLoaded',boot);


/* --- Fragments --- */
function header(title,sub){
  const x=isExoView();
  return `<div class="top">
    <button class="${x?'xclose':'back'}" onclick="back()" aria-label="${x?'Fermer':'Retour'}">${ico(x?'close':'back')}</button>
    <div class="htitle"><span class="ink">${esc(title)}${encre()}</span>${sub?`<small>${esc(sub)}</small>`:''}</div>
  </div>`;
}

/* Six sceaux carrés : actif en rouge plein, disponible en contour or,
   vide en pointillé pâle. La variante compacte sert sur les écrans de
   module, où le panneau d’accueil n’est pas là pour donner le contexte.
   Lecture tolérante : une page qui ne charge pas tous les fichiers de
   données compte les absents pour zéro. */
function levelPills(mini){
  const n=l=>motsActifs().filter(w=>w.hsk===l).length
            +DATA('TEXTS').filter(t=>t.hsk===l).length
            +DATA('GRAMMAR').filter(g=>g.hsk===l).length;
  return `<div class="hsk${mini?' mini':''}">${[1,2,3,4,5,6].map(l=>{
    const vide=!n(l);
    return `<button class="sk ${S.settings.level===l?'on':vide?'off':''}" onclick="setLevel(${l})">
      ${l}<span class="sub">HSK</span></button>`;
  }).join('')}</div>`;
}

/* Le sélecteur de thème de l’accueil porte la classe « theme » : le
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

/* Ce que le contenu couvre réellement, lu dans les données plutôt
   qu’écrit en dur : la phrase suit d’elle-même l’ajout d’une fiche,
   d’un texte ou d’une liste de mots. */
function couverture(sources){
  const arrs=(sources||['WORDS','GRAMMAR','TEXTS','PROD','HSKX']).map(n=>n==='WORDS'?motsActifs():DATA(n));
  const th=new Set(),lv=new Set();
  arrs.forEach(a=>a.forEach(o=>{
    (o.th||[]).forEach(t=>th.add(t));
    if(o.hsk)lv.add(o.hsk);
  }));
  if(!th.size)return '';
  const noms=DATA('THEMES').filter(t=>th.has(t.id)).map(t=>'« '+t.n+' »');
  const niv=Array.from(lv).sort().map(n=>'HSK '+n);
  const liste=l=>l.length>1?l.slice(0,-1).join(', ')+' et '+l[l.length-1]:l[0];
  return 'Le contenu couvre pour l’instant '+liste(noms)+', en '+liste(niv)+'.';
}

function nothing(msg){
  return `<div class="void"><span class="em">空</span>
    <p><b>Rien à ce filtre</b></p>
    <p class="sm">${esc(msg||couverture())} Changez de niveau ou de thème.</p></div>`;
}

function ribbon(){
  if(!ctx.from)return '';
  const l=DATA('LESSONS').find(x=>x.id===ctx.from.l);if(!l)return '';
  return `<div class="ribbon"><span class="rs">路</span>
    <span>Étape ${ctx.from.i+1} sur ${l.steps.length}</span>
    <button onclick="finishStep()">Terminé</button></div>`;
}

/* L’étape qui vient d’être validée : son sceau se tamponne une fois,
   au retour sur le chemin, et pas à chaque affichage. */
let TAMPON=null;
function finishStep(){
  const {l,i}=ctx.from;
  S.lessons[l]=S.lessons[l]||[];
  const neuf=!S.lessons[l].includes(i);
  if(neuf)S.lessons[l].push(i);
  touchStreak();save();stopSpeech();
  if(neuf)TAMPON={l:l,i:i};
  view='lecon';ctx={l:l};NAVDIR='in-l';render();scrollTo(0,0);
  const L=DATA('LESSONS').find(x=>x.id===l);
  if(neuf&&L&&S.lessons[l].length===L.steps.length)
    setTimeout(()=>bravo({pose:'lanterne',titre:'Thème validé\u202F!',
      texte:L.title+'\u202F: les '+L.steps.length+' étapes sont faites.'}),650);
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
