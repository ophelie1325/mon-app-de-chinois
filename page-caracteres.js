/* =====================================================================
   page-caracteres.js — l’écran Caractères.

   Refonte de novembre 2026 (maquette « Caractères », version lavis) :
     · l’accueil : carte « Séance d’écriture », recherche, pastilles, et
       trois façons de parcourir (par clé, par son, tous) ;
     · la fiche d’un caractère, plein écran : la clé peinte trait par
       trait, le pinyin cerclé au pinceau, le ton, le type, « Comment il
       s’écrit », « D’où il vient », les mots, la famille de son ;
     · le tracé (guidé, ou de mémoire).
   Caractères = la forme (construction, écriture) ; Vocabulaire = le sens
   et l’usage. Les 505 caractères (et les suivants) sont tous affichés,
   ceux déjà rencontrés en tête.
   Ce fichier s’appuie sur page-vocabulaire.js (recherche, courbes de
   ton, « Dire », chargement de HanziWriter), chargé avant lui.
   ===================================================================== */

let CF={q:'',pill:'tous',mode:'cle'};

/* Les caractères rencontrés : un mot actif les contient, ou ils ont déjà
   été tracés. Calculé une fois par rendu. */
function crVus(){
  const A=motsActifs().map(w=>w.hz).join('');
  const V=new Set();
  DATA('CHARS').forEach(c=>{if(S.items[c.id]||A.indexOf(c.hz)>=0)V.add(c.id);});
  return V;
}
function crEtat(c,V){return V.has(c.id)?etatMot(c.id):'pas';}
function crCar(id){return DATA('CHARS').find(c=>c.id===id)||null;}
function crMaj(s){s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1);}
/* Le premier sens seulement, pour les titres de groupe. */
function crSens1(s){return String(s||'').split(/[;；,]/)[0].trim();}

/* ---- Types de caractères ---------------------------------------------
   « indic » arrivera avec le chantier CHARS : il est déjà prévu ici. */
const CR_TYPES={
  picto:['pictogramme','À l’origine, le dessin de ce qu’il désigne.'],
  indic:['caractère indicatif','Un signe abstrait, seul ou posé sur un dessin, montre l’idée.'],
  ideo:['idéogramme composé','Des éléments qui s’additionnent pour donner le sens.'],
  phono:['idéo-phonogramme','Un élément pour le sens, un élément pour le son.']
};
function crExpl(c){
  const T=CR_TYPES[c.type];if(!T)return '';
  if(c.type==='phono'&&c.son){
    const s=c.sens||c.cle;
    return `Un élément pour le sens, un pour le son : <span class="hz cr-v">${esc(s.hz)}</span>${s.fr?' '+esc(s.fr):''}, et <span class="hz">${esc(c.son.hz)}</span> ${c.son.py?pinyin(c.son.py):''}, qui donne la prononciation.`;
  }
  return esc(T[1]);
}

/* ---- Fiabilité du son -------------------------------------------------
   Une valeur des données (meme, ton, proche, perdu) l’emporte ; sinon on
   la calcule en comparant le pinyin du caractère et celui de l’élément
   de son. */
const CR_FIAB={
  meme:{n:3,t:'même syllabe, même ton'},
  ton:{n:2,t:'même syllabe, autre ton'},
  proche:{n:1,t:'son proche : initiale ou finale commune'},
  perdu:{n:0,t:'le lien ne s’entend plus aujourd’hui'}
};
function crDecoupe(s){
  const b=pyBare(s).replace(/[^a-zü]/g,'');
  const m=b.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(.*)$/);
  return {b:b,i:m[1]||'',f:m[2]||''};
}
function crFiab(c){
  if(!c.son||!c.son.py)return null;
  const e=c.son.ecart;
  if(typeof e==='string'&&CR_FIAB[e])return e;
  const a=crDecoupe(c.py),b=crDecoupe(c.son.py);
  if(a.b===b.b)return toneOf(c.py)===toneOf(c.son.py)?'meme':'ton';
  if((a.i&&a.i===b.i)||(a.f&&a.f===b.f))return 'proche';
  return 'perdu';
}

/* ---- Recherche : caractère, pinyin avec ou sans tons, français ------ */
function crTrouve(c,q){
  q=String(q||'').trim();
  if(!q)return true;
  if(/[㐀-鿿]/.test(q))return q.indexOf(c.hz)>=0||(c.cle&&c.cle.hz===q);
  return trouve(c,q);
}
function crPasse(c,V){
  const e=crEtat(c,V);
  if(CF.pill==='vus')return e!=='pas';
  if(CF.pill==='tracer')return e!=='pas'&&due(c.id);
  if(CF.pill==='frag')return e==='frag';
  return true;
}
function crPastille(p){CF.pill=p;render();}
function crMode(m){CF.mode=m;render();}
function crChercher(v){
  CF.q=v;
  const r=document.getElementById('cr-res');
  if(r)r.innerHTML=crResultats(crVus());
}

/* Rencontrés d’abord, du plus fragile au plus sûr ; puis le reste, par
   niveau. */
function crOrdre(V){
  return (a,b)=>{
    const ea=crEtat(a,V),eb=crEtat(b,V);
    if((ea==='pas')!==(eb==='pas'))return ea==='pas'?1:-1;
    if(ea!=='pas'&&RANG[ea]!==RANG[eb])return RANG[ea]-RANG[eb];
    return (a.hsk||9)-(b.hsk||9);
  };
}

/* ---- Un carreau ------------------------------------------------------ */
const CR_ETATNOM={su:'su',cours:'en cours',frag:'fragile',neuf:'rencontré, pas encore tracé',pas:'pas encore rencontré'};
function crCarreau(c,V,avecPy){
  const e=crEtat(c,V);
  const dot=e==='su'||e==='cours'||e==='frag'?`<i class="d" style="background:${ETATS[e].c}"></i>`:'';
  return `<button class="cr-ct${e==='pas'?' vu':''}" onclick="crOuvrir('${jq(c.id)}')" aria-label="${esc(c.hz)}, ${CR_ETATNOM[e]}">${esc(c.hz)}${dot}${avecPy?`<small>${esc(c.py)}</small>`:''}</button>`;
}
function crOuvrir(id){direFin();tonFin();go('car',{id:id});}

function crLegende(){
  return `<div class="cr-leg"><span><i style="background:${ETATS.su.c}"></i>su</span><span><i style="background:${ETATS.cours.c}"></i>en cours</span><span><i style="background:${ETATS.frag.c}"></i>fragile</span><span><i class="pas"></i>pas encore rencontré</span></div>`;
}

/* =====================================================================
   L’accueil
   ===================================================================== */
function vChars(){
  const C=DATA('CHARS'),V=crVus();
  const nVus=C.filter(c=>V.has(c.id)).length;
  const aTracer=C.filter(c=>V.has(c.id)&&due(c.id)).length;
  const cnt={tous:C.length,vus:nVus,tracer:aTracer,frag:C.filter(c=>crEtat(c,V)==='frag').length};
  const P=[['tous','Tous'],['vus','Rencontrés'],['tracer','À tracer'],['frag','Fragiles']];
  const M=[['cle','Par clé'],['son','Par son'],['tous','Tous']];
  return header('Caractères',pl(C.length,'caractère')+' · '+pl(nVus,'rencontré'))+`
  <section class="vb-card vb-today">
    <div class="vb-tod">
      <div class="vb-num cr-num"><b>${aTracer}</b><small>à tracer</small></div>
      <div class="vb-tx"><h2>Séance d’écriture</h2><p>Tracé, clés, composants</p></div>
      ${banban('pinceau','vb-lit',1)}
    </div>
    ${nVus?`<button class="btn cr-btn" onclick="crSeance()">Commencer la séance</button>`
      :`<button class="btn cr-btn" disabled aria-disabled="true">Rencontrez d’abord des caractères</button>`}
  </section>
  <div class="vb-search">
    <label class="vb-q">${chercherIco()}<span class="vb-sr">Chercher un caractère</span>
      <input type="search" value="${esc(CF.q)}" placeholder="好, hao, bien, 女…" oninput="crChercher(this.value)" autocomplete="off"></label>
  </div>
  <div class="vb-pills cr-pills">${P.map(([k,l])=>`<button class="pill ${CF.pill===k?'on':''}" onclick="crPastille('${k}')">${l} · ${cnt[k]}</button>`).join('')}</div>
  <div class="cr-seg" role="tablist">${M.map(([k,l])=>`<button role="tab" aria-selected="${CF.mode===k}" class="${CF.mode===k?'on':''}" onclick="crMode('${k}')">${l}</button>`).join('')}</div>
  ${crLegende()}
  <div id="cr-res">${crResultats(V)}</div>`;
}

function crResultats(V){
  const C=DATA('CHARS');
  if(CF.q.trim()){
    const L=C.filter(c=>crTrouve(c,CF.q)&&crPasse(c,V)).sort(crOrdre(V));
    if(!L.length)return `<div class="void"><span class="em">空</span><p><b>Aucun caractère ne correspond</b></p>
      <p class="sm">Essayez sans les tons, ou un autre sens.</p></div>`;
    return `<div class="vb-sech"><h3>${pl(L.length,'caractère')}</h3></div>
      <div class="vb-list">${L.slice(0,80).map(c=>crLigne(c,V)).join('')}</div>`;
  }
  const L=C.filter(c=>crPasse(c,V));
  if(!L.length)return `<div class="void"><span class="em">空</span><p><b>Rien ici pour l’instant</b></p>
    <p class="sm">${CF.pill==='frag'?'Aucun caractère fragile : bravo.':'Les caractères arrivent dès qu’un mot qui les contient est rencontré.'}</p></div>`;
  if(CF.mode==='son')return crParSon(L,V);
  if(CF.mode==='tous')return crGroupe('','Les plus fragiles d’abord',pl(L.length,'caractère'),L.sort(crOrdre(V)),V,false);
  return crParCle(L,V);
}

function crLigne(c,V){
  const e=crEtat(c,V);
  return `<button class="vb-row" onclick="crOuvrir('${jq(c.id)}')">
    <span class="hz">${esc(c.hz)}</span>
    <span class="mid"><span class="py">${pinyin(c.py||'')}</span><span class="fr">${esc(c.fr)}</span></span>
    ${e==='pas'?'<span class="cr-pas">pas encore rencontré</span>':anneauMot(c.id,26)}
  </button>`;
}

function crGroupe(cle,titre,sous,L,V,avecPy,pyCle){
  return `<div class="cr-grp">
    <div class="cr-gh">${cle?`<span class="k">${esc(cle)}</span>`:''}<span><b>${titre}</b><small>${esc(sous)}</small></span></div>
    <div class="cr-tiles">${L.map(c=>crCarreau(c,V,avecPy)).join('')}</div>
  </div>`;
}

/* Par clé : un groupe par clé, les plus fournies en caractères
   rencontrés d’abord. */
function crParCle(L,V){
  const G={};
  L.forEach(c=>{const k=(c.cle&&c.cle.hz)||'?';(G[k]=G[k]||{k:k,fr:(c.cle&&c.cle.fr)||'',L:[]}).L.push(c);});
  const tot={};DATA('CHARS').forEach(c=>{const k=(c.cle&&c.cle.hz)||'?';tot[k]=tot[k]||{n:0,v:0};tot[k].n++;if(V.has(c.id))tot[k].v++;});
  return Object.values(G).sort((a,b)=>tot[b.k].v-tot[a.k].v||tot[b.k].n-tot[a.k].n).map(g=>
    crGroupe(g.k,esc(crMaj(crSens1(g.fr))||'Clé'),`clé de ${pl(tot[g.k].n,'caractère')} · ${tot[g.k].v} rencontré${tot[g.k].v>1?'s':''}`,
      g.L.sort(crOrdre(V)),V,false)).join('');
}

/* Par son : les familles construites sur l’élément de son. Le caractère
   qui donne le son, s’il est dans la liste, ouvre sa famille. */
function crFamille(hz){
  const C=DATA('CHARS');
  const L=C.filter(c=>c.son&&c.son.hz===hz);
  const src=C.find(c=>c.hz===hz);
  return src?[src].concat(L.filter(c=>c.id!==src.id)):L;
}
function crParSon(L,V){
  const ids=new Set(L.map(c=>c.id));
  const F={};
  DATA('CHARS').forEach(c=>{if(c.son&&c.son.hz)F[c.son.hz]=F[c.son.hz]||{k:c.son.hz,py:c.son.py||''};});
  const fams=Object.values(F).map(f=>{
    const tout=crFamille(f.k);
    return {k:f.k,py:f.py,tout:tout,L:tout.filter(c=>ids.has(c.id))};
  }).filter(f=>f.tout.length>1&&f.L.length);
  const dans=new Set();fams.forEach(f=>f.L.forEach(c=>dans.add(c.id)));
  fams.sort((a,b)=>b.L.filter(c=>V.has(c.id)).length-a.L.filter(c=>V.has(c.id)).length||b.tout.length-a.tout.length);
  const seuls=L.filter(c=>c.type==='phono'&&c.son&&!dans.has(c.id)).sort(crOrdre(V));
  const sensDe=hz=>{const x=carDe(hz);return x?crSens1(x.fr):'';};
  return fams.map(f=>{
    const s=sensDe(f.k);
    const n=f.tout.filter(c=>c.hz!==f.k).length;
    return crGroupe(f.k,`${f.py?pinyin(f.py):''}${s?' — '+esc(s):''}`,`son donné à ${pl(n,'caractère')}`,f.L,V,true);
  }).join('')+(seuls.length?crGroupe('','Seuls de leur famille pour l’instant','leur élément de son ne revient pas ailleurs dans l’appli',seuls,V,true):'')+
  `<p class="cr-note">Les pictogrammes et les idéogrammes n’ont pas d’élément de son : ils sont dans « Par clé » et « Tous ».</p>`;
}

/* =====================================================================
   La fiche d’un caractère
   ===================================================================== */
/* Le cercle du pinyin, tracé au pinceau : trait épais puis fin, ouvert,
   bords qui bavent. Tracé calculé une fois pour toutes (maquette,
   ring(80,36,70,27,7.5)). */
const CR_ANNEAU='M56.2 10.8L59.3 9.8L62.6 9.2L65.9 8.6L69.2 8.1L72.6 7.6L76.1 7.2L79.6 6.9L83.2 6.6L86.8 6.5L90.4 6.4L94.1 6.4L97.7 6.5L101.3 6.7L104.8 6.9L108.3 7.3L111.7 7.8L115 8.4L118.1 9.1L121.1 9.9L123.9 10.7L126.6 11.6L129.1 12.6L131.5 13.7L133.7 14.8L135.7 15.9L137.6 17.1L139.4 18.3L141 19.5L142.5 20.8L144 22.1L145.3 23.5L146.6 24.9L147.7 26.3L148.8 27.8L149.7 29.3L150.6 30.9L151.2 32.5L151.8 34.2L152.1 35.9L152.2 37.6L152.1 39.3L151.8 41L151.2 42.6L150.4 44.1L149.4 45.6L148.2 47.1L146.8 48.4L145.2 49.8L143.3 51L141.3 52.2L139.2 53.3L136.8 54.3L134.4 55.3L131.8 56.2L129.2 57.1L126.5 57.9L123.7 58.6L120.8 59.3L117.9 60L115 60.6L112.1 61.2L109.1 61.8L106.1 62.4L103 62.9L99.9 63.4L96.8 63.9L93.6 64.3L90.3 64.8L86.9 65.1L83.5 65.4L80 65.7L76.5 65.9L72.9 66L69.3 66L65.6 66L62 65.8L58.4 65.5L54.9 65.2L51.4 64.7L48 64.1L44.8 63.4L41.7 62.6L38.8 61.7L36.1 60.7L33.6 59.7L31.2 58.6L29 57.4L27 56.2L25.2 55L23.6 53.7L22.1 52.4L20.7 51.1L19.4 49.8L18.2 48.5L17.1 47.1L16.1 45.7L15.2 44.4L14.4 43L13.6 41.6L12.9 40.2L12.4 38.7L12 37.3L11.7 35.9L11.8 34.6L11.9 33.4L11.8 32L12 30.7L12.3 29.4L12.9 28.1L13.7 26.8L14.7 25.5L15.9 24.2L17.4 23L19 21.8L20.9 20.7L23 19.6L25.2 18.6L27.7 17.6L30.2 16.7L32.9 15.8L30.2 16.7L27.7 17.6L25.2 18.6L23 19.6L20.9 20.7L19 21.8L17.4 23L15.9 24.2L14.7 25.5L13.7 26.8L12.9 28.1L12.3 29.4L12 30.7L11.8 32L11.9 33.4L12.3 34.7L12.9 35.9L13.5 37.1L14.2 38.3L15 39.4L15.8 40.5L16.6 41.5L17.5 42.6L18.4 43.7L19.3 44.8L20.4 45.9L21.5 47L22.6 48.1L23.9 49.2L25.3 50.3L26.9 51.4L28.6 52.5L30.5 53.6L32.6 54.7L34.8 55.7L37.3 56.6L39.9 57.5L42.7 58.4L45.7 59.1L48.8 59.8L52.1 60.3L55.5 60.8L58.9 61.1L62.4 61.4L66 61.5L69.5 61.6L73.1 61.6L76.6 61.4L80 61.2L83.4 61L86.8 60.6L90 60.3L93.2 59.8L96.3 59.4L99.4 58.9L102.4 58.4L105.4 57.8L108.3 57.3L111.1 56.7L114 56.1L116.8 55.4L119.5 54.8L122.2 54.1L124.9 53.3L127.4 52.5L129.9 51.7L132.3 50.8L134.5 49.8L136.6 48.9L138.5 47.8L140.3 46.8L141.8 45.7L143.2 44.6L144.3 43.4L145.2 42.3L145.8 41.2L146.3 40.1L146.6 39L146.6 38L146.6 36.9L146.4 35.9L146.1 35L145.7 34L145.2 33L144.6 32L144 30.9L143.2 29.9L142.4 28.8L141.4 27.7L140.4 26.6L139.2 25.4L138 24.3L136.6 23.1L135.1 22L133.4 20.8L131.6 19.7L129.6 18.6L127.4 17.5L125.1 16.5L122.6 15.5L119.9 14.5L117.1 13.7L114.1 12.9L110.9 12.1L107.7 11.5L104.3 11L100.9 10.5L97.4 10.1L93.8 9.9L90.3 9.7L86.7 9.5L83.2 9.5L79.6 9.5L76.2 9.6L72.7 9.8L69.3 9.9L66 10.2L62.7 10.4L59.4 10.7L56.2 10.8Z';
function crAnneau(c,e){
  const col=e==='pas'||e==='neuf'?'#C9B9A3':ETATS[e].c;
  return `<div class="cr-pyring" role="img" aria-label="${esc(c.py)}, ${CR_ETATNOM[e]}"><svg viewBox="0 0 160 72" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs><filter id="cr-bave" x="-10%" y="-20%" width="120%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="0.35"/></filter></defs>
    <path d="${CR_ANNEAU}" fill="${col}" opacity=".92" filter="url(#cr-bave)"/></svg><span>${pinyin(c.py||'')}</span></div>`;
}

/* La structure : un petit schéma par valeur de struct. */
const CR_STRUCT={
  gd:['gauche-droite','<path d="M13 3V27"/>'],
  ghd:['gauche-milieu-droite','<path d="M11 3V27M19 3V27"/>'],
  hb:['haut-bas','<path d="M3 13H27"/>'],
  hmb:['haut-milieu-bas','<path d="M3 11H27M3 19H27"/>'],
  env:['enveloppant','<rect x="9" y="9" width="12" height="12" rx="1.5"/>'],
  env3:['enveloppant sur trois côtés','<path d="M9 27V9H21V27"/>'],
  env2:['enveloppant sur deux côtés','<path d="M9 27V9H27"/>'],
  seul:['d’un seul tenant','']
};
function crStruct(s){
  const S=CR_STRUCT[s];if(!S)return '';
  return `<div class="cr-idc"><svg viewBox="0 0 30 30" aria-hidden="true" focusable="false"><g fill="none" stroke="#2C2723" stroke-width="2"><rect x="2" y="2" width="26" height="26" rx="4"/>${S[1]}</g></svg><small>${S[0]}</small></div>`;
}

/* Les formes anciennes : formes/index.js (window.FORMES). Une forme
   absente est dite absente ; rien n’est dessiné à la place. */
const CR_EPOQUES=[['o','Os','vers −1200'],['b','Bronze','vers −1000'],['s','Sceau','vers −200']];
function crFrise(c){
  const F=window.FORMES;
  if(!F||!F[c.hz])return '';
  const f=F[c.hz];
  const auteurs=new Set();
  const vig=CR_EPOQUES.map(([k,n,d])=>{
    const fic=f[k];
    if(fic&&f.a&&f.a[k])auteurs.add(f.a[k]);
    return `<div class="cr-vig"><div class="cr-vbox${fic?' img':' non'}">${fic?`<img src="formes/${esc(fic)}" alt="${esc(c.hz)}, forme sur ${n==='Os'?'os':n==='Bronze'?'bronze':'sceau'}" loading="lazy">`:'pas de forme connue'}</div><span class="cr-rail"><span class="pt"></span></span><b>${n}</b><small>${fic?d:''}</small></div>`;
  }).join('');
  const mod=`<div class="cr-vig"><div class="cr-vbox actu">${esc(c.hz)}</div><span class="cr-rail"><span class="pt"></span></span><b>Aujourd’hui</b><small>${f.t?'simplifié ('+esc(f.t)+')':'forme actuelle'}</small></div>`;
  const credit='Formes anciennes : projet Ancient Chinese Characters (Wikimedia Commons), domaine public ou CC0'+
    (auteurs.size?' ; dessins de '+esc(Array.from(auteurs).join(', '))+', licence GPL':'')+'.';
  return `<div class="vb-lab">D’où il vient</div>
  <div class="cr-tl">
    <div class="cr-ans"><span>il y a 3 200 ans</span><span>aujourd’hui</span></div>
    <div class="cr-frise">${vig}${mod}</div>
  </div>
  <p class="cr-note">${credit} Quand une forme n’existe pas, la case le dit.</p>`;
}

function vCar(){
  const c=crCar(ctx.id);
  if(!c)return header('Caractères')+nothing('Ce caractère est introuvable.');
  const V=crVus(),e=crEtat(c,V);
  const kick=[c.hsk?'HSK '+c.hsk:'',CR_ETATNOM[e]].filter(Boolean).join(' · ');
  const T=CR_TYPES[c.type];
  const R=c.py?tonsReels([c.py]):[];
  const cle=c.cle&&c.cle.hz?c.cle:null;
  const lui=cle&&cle.hz===c.hz;
  /* Composants */
  const comps=[];
  if(cle)comps.push(`<div class="cr-crow"><span class="c cr-v">${esc(cle.hz)}</span><span>${esc(cle.fr||'')}<em>${lui?'ce caractère est lui-même une clé':'la clé, pour le sens'}</em></span></div>`);
  if(c.sens&&c.sens.hz&&(!cle||c.sens.hz!==cle.hz))
    comps.push(`<div class="cr-crow"><span class="c">${esc(c.sens.hz)}</span><span>${esc(c.sens.fr||'')}<em>autre élément de sens</em></span></div>`);
  const fi=crFiab(c);
  if(c.son&&c.son.hz){
    const F=fi?CR_FIAB[fi]:null;
    comps.push(`<div class="cr-crow"><span class="c">${esc(c.son.hz)}</span><span>${c.son.py?pinyin(c.son.py):''}<em>pour le son</em>${F?`
      <span class="cr-fiab" role="img" aria-label="Fiabilité du son : ${F.t}">${[1,2,3].map(k=>`<i class="${k<=F.n?'on':''}"></i>`).join('')}</span>
      <small class="cr-ft">${F.t}${c.son.py&&c.py?' ('+esc(c.son.py)+' → '+esc(c.py)+')':''}</small>`:''}</span></div>`);
  }
  /* Mots et famille */
  const actifs=new Set(motsActifs().map(w=>w.id));
  const mots=DATA('WORDS').filter(w=>w.hz.indexOf(c.hz)>=0)
    .sort((a,b)=>(actifs.has(b.id)-actifs.has(a.id))||a.hz.length-b.hz.length).slice(0,10);
  let fam=[],famTitre='';
  if(c.son&&c.son.hz){fam=crFamille(c.son.hz).filter(x=>x.id!==c.id);famTitre='La même famille de son';}
  else{const f=crFamille(c.hz).filter(x=>x.id!==c.id);if(f.length){fam=f;famTitre='Il donne le son à';}}
  const nTraits=c.traits||'';
  return `<div class="vb-mot cr-car">
  <div class="vb-top cr-top">
    <div class="vb-th"><button class="vb-back" onclick="back()" aria-label="Retour">${ico('back')}</button><span>${esc(kick)}</span></div>
    <div class="cr-tian" aria-hidden="true"><svg viewBox="0 0 196 196" focusable="false"><path d="M98 0V196M0 98H196" stroke="rgba(245,225,180,.65)" stroke-width="1.5" stroke-dasharray="6 7"/><path d="M0 0L196 196M196 0L0 196" stroke="rgba(245,225,180,.35)" stroke-width="1.2" stroke-dasharray="4 8"/></svg></div>
    <div class="cr-glyph" id="cr-glyph" role="img" aria-label="${esc(c.hz)}${cle?', la clé '+esc(cle.hz):''}"><span>${esc(c.hz)}</span></div>
  </div>
  ${banban('pinceau','vb-bb cr-bb',1)}
  <div class="vb-sheet">
    <div class="vb-pron cr-pron">
      ${crAnneau(c,e)}
      ${R.length?`<div class="vb-tones">${R.map(courbe).join('')}</div>`:''}
      ${T?`<span class="cr-type">${T[0]}</span>`:''}
    </div>
    <div class="vb-fr">${esc(c.fr)}</div>
    ${T?`<div class="cr-expl">${crExpl(c)}</div>`:''}
    <div class="vb-acts">
      <button class="vb-act on cr-on" onclick="speak('${jq(c.hz)}')">${ico('sound')}Écouter</button>
      ${direBouton({hz:c.hz,py:c.py},'vb-act').replace('onclick="direGo()"','onclick="tonFin();direGo()"')}
      ${tonBouton(c)}
      <button class="vb-act" onclick="crTracer('${jq(c.id)}',0)">${pinceauIco()}Tracer</button>
    </div>
    ${direPanneau()}
    ${tonPanneau(c)}

    <div class="vb-lab">Comment il s’écrit</div>
    <div class="cr-ident">
      ${cle?`<div class="cr-idc"><div class="v hz cr-v">${esc(cle.hz)}</div><small>clé${cle.fr?' · '+esc(crSens1(cle.fr)):''}</small></div>`:''}
      ${c.struct?crStruct(c.struct):''}
      <div class="cr-idc" id="cr-tr"${nTraits?'':' hidden'}><div class="v" id="cr-trn">${nTraits}</div><small>traits</small></div>
    </div>
    <p class="cr-note">Un caractère n’a qu’une seule clé : celle sous laquelle on le range dans le dictionnaire.${cle&&!lui&&c.sens&&c.sens.hz&&c.sens.hz!==cle.hz?` Ici, c’est <span class="hz cr-v">${esc(cle.hz)}</span> ; <span class="hz">${esc(c.sens.hz)}</span> porte aussi du sens, mais ce n’est pas la clé.`:''}</p>
    ${comps.length?`<div class="cr-comp">${comps.join('')}</div>`:''}

    ${crFrise(c)}

    ${mots.length?`<div class="vb-lab">Les mots qui le contiennent</div>
    <div class="vb-chips">${mots.map(w=>`<a class="vb-chip${actifs.has(w.id)?'':' cr-dim'}" href="vocabulaire.html?mot=${encodeURIComponent(w.id)}"><span class="hz">${esc(w.hz)}</span><span>${pinyin(w.py||'')}</span><span class="cr-go">· ${esc(crSens1(w.fr))} ›</span></a>`).join('')}</div>`:''}

    ${fam.length?`<div class="vb-lab">${famTitre}</div>
    <div class="vb-chips">${fam.map(x=>`<button class="vb-chip" onclick="crOuvrir('${jq(x.id)}')"><span class="hz">${esc(x.hz)}</span>${pinyin(x.py||'')}</button>`).join('')}</div>`:''}
  </div>
  <div class="vb-foot"><button class="vb-go" onclick="crTracer('${jq(c.id)}',1)">Tracer de mémoire</button></div>
  </div>`;
}

/* ---- La clé peinte trait par trait ----------------------------------
   Données HanziWriter (hanzi-writer-data) : strokes, et radStrokes pour
   les traits de la clé. Si ces données manquent, le caractère reste en
   texte, sans couleur. Si la clé est le caractère lui-même, tout est
   peint. Si radStrokes couvre tout le caractère alors que la clé est
   autre, on ne colore rien plutôt que de colorer faux. */
const CR_HW={};
function crDonnees(hz,fait){
  if(CR_HW[hz]!==undefined)return fait(CR_HW[hz]);
  if(typeof fetch!=='function')return fait(null);
  fetch('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/'+encodeURIComponent(hz)+'.json')
    .then(r=>r.ok?r.json():null).catch(()=>null)
    .then(d=>{CR_HW[hz]=d&&d.strokes?d:null;fait(CR_HW[hz]);});
}
function crPeindre(){
  const c=crCar(ctx.id);if(!c)return;
  crDonnees(c.hz,d=>{
    if(view!=='car'||ctx.id!==c.id||!d)return;
    const g=document.getElementById('cr-glyph');if(!g)return;
    const tout=c.cle&&c.cle.hz===c.hz;
    const rad=new Set(d.radStrokes||[]);
    const fiable=tout||(rad.size&&rad.size<d.strokes.length);
    g.innerHTML=`<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><g transform="translate(0,900) scale(1,-1)">${
      d.strokes.map((p,i)=>`<path d="${p}" fill="${fiable&&(tout||rad.has(i))?'#FF8A63':'#FBF6EE'}"/>`).join('')}</g></svg>`;
    const t=document.getElementById('cr-tr'),n=document.getElementById('cr-trn');
    if(t&&n&&!c.traits){n.textContent=d.strokes.length;t.hidden=false;}
  });
}

/* =====================================================================
   Le tracé : guidé (contour visible, non noté) ou de mémoire (noté)
   ===================================================================== */
let CRW=null;
function crTracer(id,memoire){direFin();tonFin();go('trace',{id:id,memoire:!!memoire});}
function vTrace(){
  const c=crCar(ctx.id);
  if(!c)return header('Tracer')+nothing('Ce caractère est introuvable.');
  const m=ctx.memoire;
  return header(m?'Tracer de mémoire':'Tracer',m?'':c.hz+' · '+c.py)+`
  <div class="box u-ta-center">
    ${m?`<p class="cr-cons">Tracez de mémoire le caractère qui veut dire « ${esc(crSens1(c.fr))} ». Aucun contour n’est affiché.</p>
      <div class="cr-ind"><span class="u-tx2 py">${pinyin(c.py||'')}</span><button class="btn pale sm" onclick="speak('${jq(c.hz)}')">${ico('sound')} Écouter</button></div>`:''}
    <div id="cr-pad" class="cr-pad"></div>
    ${m?'':`<div class="u-tx2 py mt">${pinyin(c.py||'')}</div><p class="u-mt0 mut">${esc(c.fr)}</p>`}
    <p class="mut sm" id="cr-st">Chargement des tracés…</p>
    <div class="row mt">${m?
      `<button class="btn pale" onclick="crMontrer()">Je ne m’en souviens pas</button>`:
      `<button class="btn pale" onclick="crAnimer()">Animer</button><button class="btn" onclick="crQuiz()">Tracer</button>`}</div>
  </div>`;
}
function crMonterTrace(){
  const c=crCar(ctx.id);if(!c)return;
  chargerHW(()=>{
    if(view!=='trace')return;
    const el=document.getElementById('cr-pad');if(!el)return;
    el.innerHTML='';
    const t=el.clientWidth||232,m=ctx.memoire;
    CRW=HanziWriter.create(el,c.hz,{width:t,height:t,padding:14,
      showCharacter:!m,showOutline:!m,delayBetweenStrokes:170,...teintesTrace()});
    const st=document.getElementById('cr-st');
    if(st)st.textContent=m?'Tracez au doigt, trait par trait. Après trois erreurs sur un trait, un indice apparaît.':'« Animer » montre l’ordre des traits. « Tracer » vous fait écrire au doigt.';
    if(m)crQuiz();
  });
}
function crAnimer(){if(CRW)CRW.animateCharacter();}
function crQuiz(){
  if(!CRW)return;
  const c=crCar(ctx.id),m=ctx.memoire;
  if(!m)CRW.hideCharacter();
  CRW.quiz({showHintAfterMisses:3,onComplete(d){
    const st=document.getElementById('cr-st');
    if(m){
      const g=ctx.montre?0:d.totalMistakes===0?2:d.totalMistakes<=2?1:0;
      grade(c.id,g);beep(g===2?'ok':'no');
      if(st)st.textContent=g===2?'Tracé de mémoire, sans erreur.':ctx.montre?'Montré : il reviendra bientôt.':pl(d.totalMistakes,'erreur')+' de tracé : il reviendra bientôt.';
    }else{
      beep(d.totalMistakes===0?'ok':'no');
      if(st)st.textContent=d.totalMistakes===0?'Tracé juste, sans erreur.':pl(d.totalMistakes,'erreur')+' de tracé.';
    }
    CRW.showCharacter();
  }});
}
function crMontrer(){
  if(!CRW)return;
  ctx.montre=true;
  CRW.cancelQuiz&&CRW.cancelQuiz();
  CRW.showOutline();
  CRW.animateCharacter({onComplete(){crQuiz();}});
  const st=document.getElementById('cr-st');if(st)st.textContent='Regardez l’ordre des traits, puis tracez-le à votre tour.';
}

function crMount(){
  if(view==='car')crPeindre();
  if(view==='trace')crMonterTrace();
  if(view==='seance')crMonterSeance();
}

/* =====================================================================
   La séance d’écriture (lot 2)
   Dix épreuves, les caractères fragiles et dus d’abord, puis ceux en
   cours. Six sortes d’épreuves, mêlées :
     trace  le tracé de mémoire (d’après le sens, le pinyin ou le son) ;
     ass    assembler : l’élément de sens et l’élément de son ;
     cle    retrouver la clé parmi quatre ;
     cs     une clé seule : son sens ;
     sem    des caractères qui se ressemblent ;
     son    deviner le son, sans proposition.
   Seules les épreuves sur des caractères rencontrés font bouger les
   états. Le tracé de mémoire est noté pleinement (grade) ; les autres
   comptent comme une révision légère (crLeger) ; « une clé seule » teste
   la clé, pas le caractère, et ne note rien. Hors ligne, HanziWriter
   manque : il n’y a pas de tracé, les autres épreuves prennent la place.
   ===================================================================== */
const CR_N=10;
const CR_NOMS={trace:'Tracé de mémoire',ass:'Assembler',cle:'Retrouver la clé',cs:'Les clés',sem:'Ils se ressemblent',son:'Deviner le son'};
const CR_POIDS={trace:4,ass:2,cle:2,cs:1,sem:2,son:2};

/* Les formes d’une même clé, et deux clés qu’on ne distingue pas d’un
   coup d’œil : jamais l’une comme leurre de l’autre. */
const CR_VAR=[['讠','言'],['氵','水','氺'],['亻','人'],['扌','手'],['忄','心'],['钅','金'],['饣','食'],
  ['纟','糸'],['犭','犬'],['礻','示'],['衤','衣'],['月','⺼','肉'],['艹','草'],['刂','刀'],['灬','火'],
  ['罒','网'],['冫','⺀','冰'],['⺌','小'],['爫','爪'],['王','玉'],['曰','日'],['囗','口'],['冖','宀'],['亠','十']];

/* Caractères qui se ressemblent. Ceux de CHARS sont repris des données ;
   les autres sont écrits ici : « hz:pinyin:sens ». Seul un caractère
   rencontré peut être la bonne réponse ; les autres servent de leurres. */
const CR_SEMBL=[
  ['人','入:rù:entrer','八'],
  ['己','已'],
  ['大','太','天','夫:fū:homme adulte ; mari'],
  ['日','白','百','目:mù:œil'],
  ['千','干','于'],
  ['休','体'],
  ['问','间','闻:wén:entendre ; sentir (une odeur)'],
  ['买','卖'],
  ['士','土:tǔ:terre'],
  ['主','王:wáng:roi','玉:yù:jade'],
  ['找','我'],
  ['今','令:lìng:ordre ; faire que'],
  ['见','贝:bèi:coquillage'],
  ['力','刀:dāo:couteau'],
  ['往','住'],
  ['话','活:huó:vivre ; vivant'],
  ['喝','渴:kě:avoir soif'],
  ['请','清','情','睛','晴:qíng:beau temps'],
  ['东','车'],
  ['了','子'],
  ['几','九','儿'],
  ['左','右'],
  ['比','北','此']
];

/* ---- Outils ------------------------------------------------------------ */
function crHWOk(){return typeof HanziWriter!=='undefined';}
let CR_CLES=null;
function crCles(){
  if(CR_CLES)return CR_CLES;
  CR_CLES={};
  DATA('CHARS').forEach(c=>{if(c.cle&&c.cle.hz&&!(c.cle.hz in CR_CLES))CR_CLES[c.cle.hz]=c.cle.fr||'';});
  return CR_CLES;
}
/* Les racines des mots d’un sens : deux sens qui en partagent une sont
   trop proches pour servir de leurre (« main » et « main ; encore »). */
function crRacines(fr){
  return sansAccent(fr).split(/[;,()…/]|\s+/).map(t=>t.trim()).filter(t=>t.length>=3&&['les','des','une','pour','qui'].indexOf(t)<0).map(t=>t.slice(0,5));
}
function crMemeSens(a,b){const A=crRacines(a);return crRacines(b).some(t=>A.indexOf(t)>=0);}
function crVar(h){return CR_VAR.findIndex(g=>g.indexOf(h)>=0);}
function crProche(h1,f1,h2,f2){
  if(h1===h2)return true;
  const v=crVar(h1);if(v>=0&&v===crVar(h2))return true;
  return !!(f1&&f2&&crMemeSens(f1,f2));
}
function crPick(L,n,ok){const R=[];shuffle(L).forEach(x=>{if(R.length<n&&ok(x,R))R.push(x);});return R;}

/* Une révision légère : elle compte comme vue, l’échec compte comme une
   erreur, mais la boîte et l’échéance ne bougent pas. Seul le tracé de
   mémoire fait monter un caractère. */
function crLeger(id,ok){
  const r=rec(id);r.seen++;
  if(ok){r.ok++;r.kos=0;}else r.ko++;
  touchStreak();save();
}

/* Les membres d’un groupe de ressemblance, lus dans les données. */
function crMembre(s){
  const p=s.split(':');
  if(p.length===3)return {hz:p[0],py:p[1],fr:p[2],c:null};
  const c=carDe(s);
  return c?{hz:c.hz,py:c.py||'',fr:c.fr||'',c:c}:null;
}
function crGroupeDe(c){
  const g=CR_SEMBL.find(G=>G.some(s=>s.split(':')[0]===c.hz));
  if(!g)return null;
  const M=g.map(crMembre).filter(Boolean);
  return M.length>1&&M.some(m=>m.hz===c.hz)?M:null;
}

/* Les éléments de sens et de son de tous les idéo-phonogrammes. */
function crElements(){
  const sens={},son={};
  DATA('CHARS').forEach(c=>{
    if(c.sens&&c.sens.hz&&!sens[c.sens.hz])sens[c.sens.hz]={hz:c.sens.hz,fr:c.sens.fr||''};
    if(c.son&&c.son.hz&&c.son.py&&!son[c.son.hz])son[c.son.hz]={hz:c.son.hz,py:c.son.py};
  });
  return {sens:Object.values(sens),son:Object.values(son)};
}

/* Deux caractères qu’on ne départage ni par le pinyin ni par la clé. */
function crHomophone(c){
  const k=c.cle&&c.cle.hz;
  return DATA('CHARS').some(x=>x.id!==c.id&&pyRead(x.py||'')===pyRead(c.py||'')&&(x.cle&&x.cle.hz)===k);
}
function crSensPartage(c){
  const s=sansAccent(crSens1(c.fr));
  return DATA('CHARS').some(x=>x.id!==c.id&&sansAccent(crSens1(x.fr))===s);
}

/* ---- Les épreuves possibles pour un caractère ------------------------- */
function crEligibles(c){
  const K=[];
  if(crHWOk())K.push('trace');
  if(c.type==='phono'&&c.sens&&c.sens.hz&&c.son&&c.son.hz&&c.son.py&&c.sens.hz!==c.son.hz)K.push('ass');
  if(c.cle&&c.cle.hz&&c.cle.hz!==c.hz)K.push('cle');
  if(c.cle&&c.cle.hz&&crCles()[c.cle.hz])K.push('cs');
  if(crGroupeDe(c))K.push('sem');
  if(c.son&&c.son.hz&&c.son.py&&(c.cle||c.sens))K.push('son');
  return K;
}

function crEpreuve(k,c,neuf){
  const ep={kind:k,id:c.id,ans:null,ok:null,neuf:!!neuf};
  if(k==='trace'){
    const V=['sens','py'];
    if(typeof speechSynthesis!=='undefined')V.push('audio');
    ep.v=V[Math.random()*V.length|0];
    ep.mist=0;
  }
  if(k==='ass'){
    const E=crElements();
    const s1=crPick(E.sens,2,x=>!crProche(x.hz,x.fr,c.sens.hz,c.sens.fr)&&x.hz!==c.son.hz&&x.hz!==c.hz);
    const s2=crPick(E.son,2,(x,R)=>x.hz!==c.sens.hz&&x.hz!==c.son.hz&&x.hz!==c.hz&&s1.every(y=>y.hz!==x.hz)&&
      pyBare(x.py)!==pyBare(c.son.py)&&R.every(y=>pyBare(y.py)!==pyBare(x.py)));
    ep.tuiles=shuffle([c.sens.hz,c.son.hz].concat(s1.map(x=>x.hz),s2.map(x=>x.hz)));
    ep.pris=[];
  }
  if(k==='cle'){
    const C=crCles(),bon=c.cle.hz;
    const dans=[c.sens&&c.sens.hz,c.son&&c.son.hz].filter(h=>h&&h!==bon&&h!==c.hz&&!crProche(h,'',bon,''));
    const autres=crPick(Object.keys(C),3-Math.min(2,dans.length),(h,R)=>h!==c.hz&&dans.indexOf(h)<0&&
      !crProche(h,C[h],bon,C[bon])&&R.every(y=>!crProche(y,C[y],h,C[h]))&&dans.every(y=>!crProche(y,'',h,'')));
    ep.opts=shuffle([bon].concat(dans.slice(0,2),autres)).slice(0,4);
    if(ep.opts.indexOf(bon)<0)ep.opts[0]=bon;
    ep.bon=ep.opts.indexOf(bon);
  }
  if(k==='cs'){
    const C=crCles(),h=c.cle.hz;
    const autres=crPick(Object.keys(C).filter(x=>C[x]),3,(x,R)=>!crProche(x,C[x],h,C[h])&&R.every(y=>!crMemeSens(C[y],C[x])));
    ep.cle=h;
    ep.opts=shuffle([h].concat(autres));
    ep.bon=ep.opts.indexOf(h);
  }
  if(k==='sem'){
    const M=crGroupeDe(c);
    const moi=M.find(m=>m.hz===c.hz);
    const O=shuffle([moi].concat(shuffle(M.filter(m=>m!==moi)).slice(0,3)));
    const pyU=O.filter(m=>pyRead(m.py)===pyRead(moi.py)).length===1;
    const frU=O.filter(m=>sansAccent(crSens1(m.fr))===sansAccent(crSens1(moi.fr))).length===1;
    ep.mode=pyU&&(!frU||Math.random()<.5)?'py':'sens';
    ep.opts=O;ep.bon=O.indexOf(moi);
  }
  if(k==='son'){
    const T=[];
    const ajoute=(hz,role)=>{if(!hz)return;const t=T.find(x=>x.hz===hz);if(t){if(t.role!=='son')t.role=role==='son'?'son':t.role;return;}T.push({hz:hz,role:role});};
    ajoute(c.son.hz,'son');
    if(c.cle&&c.cle.hz)ajoute(c.cle.hz,'cle');
    if(c.sens&&c.sens.hz)ajoute(c.sens.hz,'sens');
    ep.tuiles=shuffle(T);
    ep.etape=1;ep.essais=0;ep.mauvais=[];
  }
  return ep;
}

/* L’épreuve du son sur un caractère jamais rencontré : de préférence un
   caractère dont l’élément de son est lui-même un caractère rencontré. */
function crSonNeuf(V){
  const C=DATA('CHARS');
  const vus=new Set(C.filter(c=>V.has(c.id)).map(c=>c.hz));
  const L=C.filter(c=>!V.has(c.id)&&c.type==='phono'&&c.son&&c.son.hz&&c.son.py&&(c.cle||c.sens));
  const mieux=L.filter(c=>vus.has(c.son.hz));
  const P=mieux.length?mieux:L;
  return P.length?P[Math.random()*P.length|0]:null;
}

function crPrio(c){
  const e=etatMot(c.id),d=due(c.id),r=S.items[c.id];
  if(e==='frag')return d?0:3;
  if(!r||!r.seen)return 2;
  if(d)return 1;
  return e==='cours'?4:5;
}

function crComposer(V){
  const L=DATA('CHARS').filter(c=>V.has(c.id));
  if(!L.length)return [];
  const tri=shuffle(L).sort((a,b)=>crPrio(a)-crPrio(b)||boxOf(a.id)-boxOf(b.id));
  const base=tri.slice(0,CR_N);
  const n=Math.min(CR_N,L.length*2);
  const eps=[],cnt={},deja={};
  let prev='';
  for(let i=0;i<n;i++){
    const c=base[i%base.length];
    let K=crEligibles(c).filter(k=>(deja[c.id]||[]).indexOf(k)<0);
    if(!K.length)continue;
    const K2=K.filter(k=>k!==prev);if(K2.length)K=K2;
    K=shuffle(K).sort((a,b)=>(cnt[a]||0)/CR_POIDS[a]-(cnt[b]||0)/CR_POIDS[b]||CR_POIDS[b]-CR_POIDS[a]);
    const k=K[0];
    cnt[k]=(cnt[k]||0)+1;prev=k;(deja[c.id]=deja[c.id]||[]).push(k);
    eps.push(crEpreuve(k,c,false));
  }
  /* Une épreuve du son sur un caractère jamais vu, au milieu de la
     séance : elle ne note rien. */
  const nv=eps.length>=4?crSonNeuf(V):null;
  if(nv){
    const ep=crEpreuve('son',nv,true);
    const pos=2+(Math.random()*(eps.length-3)|0);
    if(eps.length>=CR_N){
      let j=eps.findIndex((e,x)=>x>=pos&&e.kind==='cs');
      if(j<0)j=eps.findIndex((e,x)=>x>=pos&&e.kind!=='trace');
      if(j<0)j=pos;
      eps[j]=ep;
    }else eps.splice(pos,0,ep);
  }
  return eps;
}

function crSeance(){
  direFin();
  const V=crVus();
  const eps=crComposer(V);
  if(!eps.length)return toast('Aucun caractère rencontré pour l’instant : ils arrivent avec les mots des leçons.');
  go('seance',{seance:{eps:eps,i:0,done:false}});
}
function crEp(){const Z=ctx.seance;return Z&&!Z.done?Z.eps[Z.i]:null;}

/* Toute réponse passe par ici : note la première tentative, puis l’état
   du caractère selon le poids de l’épreuve. */
function crNoter(ep,ok,g){
  if(ep.ok!==null)return;
  ep.ok=!!ok;
  beep(ok?'ok':'no');
  if(ep.neuf||ep.kind==='cs')return;
  if(ep.kind==='trace')grade(ep.id,g);
  else crLeger(ep.id,ok);
}

function crSuivant(){
  direFin();
  if(typeof ecouteAnnule==='function')ecouteAnnule();
  CRW=null;
  const Z=ctx.seance;
  if(Z.i<Z.eps.length-1)Z.i++;
  else Z.done=true;
  render();scrollTo(0,0);
}

/* ---- L’affichage --------------------------------------------------------- */
function crProg(){
  const Z=ctx.seance,ep=crEp();
  return `<div class="qnum">Épreuve ${Z.i+1} sur ${Z.eps.length} · ${esc(CR_NOMS[ep.kind])}${ep.neuf?' · caractère jamais vu':''}</div>
  <div class="qprog">${Z.eps.map((e,k)=>`<i class="${k===Z.i&&e.ok===null?'now':e.ok===true?'ok':e.ok===false?'no':''}"></i>`).join('')}</div>`;
}
function crRappel(c){
  return `<span class="hz">${esc(c.hz)}</span> ${pinyin(c.py||'')} — ${esc(c.fr)}`;
}
function crPied(fini){
  if(!fini)return '';
  const Z=ctx.seance;
  return `<div class="vb-foot"><button class="vb-go" onclick="crSuivant()">${Z.i<Z.eps.length-1?'Suivant':'Voir le bilan'}</button></div>`;
}
function crCleTxt(c){
  if(!c.cle||!c.cle.hz||c.cle.hz===c.hz)return '';
  return `Sa clé : <span class="hz cr-v">${esc(c.cle.hz)}</span>${c.cle.fr?' '+esc(crSens1(c.cle.fr)):''}`;
}

function vSeance(){
  const Z=ctx.seance;
  if(!Z)return header('Séance d’écriture')+nothing('Aucune séance en cours.');
  if(Z.done)return crBilan();
  const ep=crEp(),c=crCar(ep.id);
  if(!c){Z.eps.splice(Z.i,1);if(Z.i>=Z.eps.length)Z.done=true;return vSeance();}
  const corps={trace:crVTrace,ass:crVAss,cle:crVCle,cs:crVCs,sem:crVSem,son:crVSon}[ep.kind](ep,c);
  return `<div class="cr-seance">${header('Séance d’écriture',' ')}${crProg()}${corps}</div>${crPied(ep.ans!==null)}`;
}

/* ---- Tracé de mémoire -------------------------------------------------- */
function crVTrace(ep,c){
  const rep=ep.ans!==null;
  const cleTx=crCleTxt(c);
  let cons='',ind='';
  if(ep.v==='sens'){
    cons=`Tracez le caractère qui veut dire « ${esc(crSens1(c.fr))} ».`;
    if(crSensPartage(c))ind=`<span class="py">${pinyin(c.py||'')}</span>`;
  }else if(ep.v==='py'){
    cons=`Tracez le caractère qui se lit <span class="py">${pinyin(c.py||'')}</span>.`;
    ind=cleTx||`« ${esc(crSens1(c.fr))} »`;
    if(cleTx&&crHomophone(c))ind+=` · « ${esc(crSens1(c.fr))} »`;
  }else{
    cons='Écoutez, puis tracez le caractère.';
    ind=`<button class="btn pale sm" onclick="speak('${jq(c.hz)}')">${ico('sound')} Écouter</button>`+
      (ep.voirPy?` <span class="py">${pinyin(c.py||'')}</span>`:` <button class="btn pale sm" onclick="crVoirPy()">Pas de son ? Voir le pinyin</button>`)+
      `<span class="cr-indl">${cleTx||'« '+esc(crSens1(c.fr))+' »'}${cleTx&&crHomophone(c)?' · « '+esc(crSens1(c.fr))+' »':''}</span>`;
  }
  return `<div class="box u-ta-center">
    <p class="cr-cons">${cons} Aucun contour n’est affiché.</p>
    ${ind?`<div class="cr-ind">${ep.v==='audio'?ind:'<span class="cr-indl">'+ind+'</span>'}</div>`:''}
    <div id="cr-pad" class="cr-pad"></div>
    ${rep?`<div class="verdict ${ep.ok?'ok':'no'} mt">${ep.ans===-1?'Montré : il reviendra bientôt.':ep.mist===0?'Tracé de mémoire, sans erreur.':pl(ep.mist,'erreur')+' de tracé : il reviendra bientôt.'} ${crRappel(c)}</div>`
      :`<p class="mut sm" id="cr-st">Chargement des tracés…</p>
      <button class="btn pale sm mt" onclick="crTraceMontrer()">Je ne m’en souviens pas</button>`}
  </div>`;
}
function crVoirPy(){const ep=crEp();if(ep){ep.voirPy=true;render();}}

/* HanziWriter est monté après chaque rendu. Un tracé déjà en cours n’est
   pas relancé ; une fois la réponse donnée, le caractère reste affiché. */
function crMonterSeance(){
  const ep=crEp();
  if(!ep||ep.kind!=='trace'||!ctx.seance||ctx.seance.done)return;
  const el=document.getElementById('cr-pad');if(!el)return;
  if(ep.ans===null&&ep.monte&&el.childNodes.length)return;
  if(!crHWOk())return crTraceRemplacer();
  const c=crCar(ep.id);
  el.innerHTML='';
  const t=el.clientWidth||232,rep=ep.ans!==null;
  const moi=ep;
  CRW=HanziWriter.create(el,c.hz,{width:t,height:t,padding:14,showCharacter:rep,showOutline:rep,delayBetweenStrokes:170,
    onLoadCharDataError(){if(crEp()===moi&&moi.ans===null)crTraceRemplacer();},
    ...teintesTrace()});
  if(rep){if(ep.ans===-1)CRW.animateCharacter();return;}
  ep.monte=true;
  const st=document.getElementById('cr-st');
  if(st)st.textContent='Tracez au doigt, trait par trait. Après trois erreurs sur un trait, un indice apparaît.';
  CRW.quiz({showHintAfterMisses:3,onComplete(d){
    if(crEp()!==moi||moi.ans!==null)return;
    moi.ans=1;moi.mist=d.totalMistakes;
    const g=d.totalMistakes===0?2:d.totalMistakes<=2?1:0;
    crNoter(moi,g===2,g);
    render();
  }});
}
function crTraceMontrer(){
  const ep=crEp();if(!ep||ep.ans!==null)return;
  if(CRW&&CRW.cancelQuiz)try{CRW.cancelQuiz();}catch(e){}
  ep.ans=-1;
  crNoter(ep,false,0);
  render();
}
/* Les données du tracé n’arrivent pas (hors ligne) : une autre épreuve
   sur le même caractère prend la place, sans rien noter. */
function crTraceRemplacer(){
  const Z=ctx.seance,ep=crEp();if(!ep||ep.kind!=='trace')return;
  const c=crCar(ep.id);
  const fait=Z.eps.filter(e=>e.id===ep.id).map(e=>e.kind);
  const K=crEligibles(c).filter(k=>k!=='trace');
  const k=K.find(x=>fait.indexOf(x)<0)||K[0];
  CRW=null;
  if(!k){Z.eps.splice(Z.i,1);if(Z.i>=Z.eps.length)Z.done=true;}
  else Z.eps[Z.i]=crEpreuve(k,c,ep.neuf);
  toast('Le tracé n’a pas pu se charger : une autre épreuve le remplace.');
  render();
}

/* ---- Assembler ------------------------------------------------------------ */
function crVAss(ep,c){
  const rep=ep.ans!==null;
  const slot=(k,nom)=>{
    const h=ep.pris[k];
    const cl=rep?(k===0?(h===c.sens.hz?'ok':'no'):(h===c.son.hz?'ok':'no')):'';
    return `<button class="cr-slot ${h?'plein':''} ${cl}" ${rep||!h?'disabled':''} onclick="crAssRetire(${k})"><span class="hz">${h?esc(h):''}</span><small>${nom}</small></button>`;
  };
  const F=CR_FIAB[crFiab(c)];
  return `<div class="box">
    <p class="u-mb2 mut sm">Assemblez le caractère : touchez d’abord l’élément de sens, puis celui du son.</p>
    <div class="cr-quoi"><b>« ${esc(crSens1(c.fr))} »</b><span class="py">${pinyin(c.py||'')}</span>
      <button class="btn pale tiny" onclick="speak('${jq(c.hz)}')">Écouter</button></div>
    <div class="cr-slots">${slot(0,'sens')}<span class="cr-plus">+</span>${slot(1,'son')}<span class="cr-plus">=</span>
      <span class="cr-slot res"><span class="hz">${rep?esc(c.hz):'?'}</span><small>${rep?'':'caractère'}</small></span></div>
    <div class="cr-tuiles">${ep.tuiles.map((h,j)=>`<button class="cr-tuile hz" ${rep||ep.pris.indexOf(h)>=0?'disabled':''} onclick="crAssPrend(${j})">${esc(h)}</button>`).join('')}</div>
    ${rep?`<div class="verdict ${ep.ok?'ok':'no'} mt">${ep.ok?'Juste.':ep.ans==='inv'?'Les bons éléments, mais inversés.':'Pas tout à fait.'}
      <span class="hz">${esc(c.sens.hz)}</span> ${esc(crSens1(c.sens.fr||''))}, pour le sens, et <span class="hz">${esc(c.son.hz)}</span> ${pinyin(c.son.py)}, pour le son : ${crRappel(c)}.</div>
      ${F?`<p class="sm">Le son : ${esc(F.t)} (${esc(c.son.py)} → ${esc(c.py)}).</p>`:''}`:''}
  </div>`;
}
function crAssPrend(j){
  const ep=crEp();if(!ep||ep.ans!==null)return;
  const h=ep.tuiles[j];if(ep.pris.indexOf(h)>=0)return;
  const k=ep.pris[0]?1:0;ep.pris[k]=h;
  if(ep.pris[0]&&ep.pris[1]){
    const c=crCar(ep.id);
    const ok=ep.pris[0]===c.sens.hz&&ep.pris[1]===c.son.hz;
    ep.ans=ok?'ok':(ep.pris[0]===c.son.hz&&ep.pris[1]===c.sens.hz?'inv':'non');
    crNoter(ep,ok);
  }
  render();
}
function crAssRetire(k){const ep=crEp();if(!ep||ep.ans!==null)return;ep.pris[k]=null;render();}

/* ---- Retrouver la clé ------------------------------------------------------ */
function crVCle(ep,c){
  const rep=ep.ans!==null,C=crCles();
  const choisi=rep?ep.opts[ep.ans]:'';
  const dans=choisi&&choisi!==c.cle.hz&&((c.sens&&c.sens.hz===choisi)||(c.son&&c.son.hz===choisi));
  return `<div class="box">
    <p class="u-mb2 mut sm">Quelle est la clé de ce caractère ? Celle sous laquelle on le range dans le dictionnaire.</p>
    <div class="prompt"><div class="big">${esc(c.hz)}</div></div>
    <p class="u-ta-center mut sm">${esc(c.fr)}</p>
    <div class="cr-q4">${ep.opts.map((h,j)=>{
      const cl=rep?(j===ep.bon?'ok':j===ep.ans?'no':''):'';
      return `<button class="opt han ${cl}" onclick="crRepond(${j})">${esc(h)}</button>`;}).join('')}</div>
    ${rep?`<div class="verdict ${ep.ok?'ok':'no'}">${ep.ok?'Juste.':''} La clé de <span class="hz">${esc(c.hz)}</span> est <span class="hz cr-v">${esc(c.cle.hz)}</span>${C[c.cle.hz]?', '+esc(C[c.cle.hz]):''}.
      ${dans?` <span class="hz">${esc(choisi)}</span> est bien dans le caractère, mais ce n’est pas sa clé.`:''}</div>`:''}
  </div>`;
}
function crRepond(j){
  const ep=crEp();if(!ep||ep.ans!==null)return;
  ep.ans=j;crNoter(ep,j===ep.bon);render();
}

/* ---- Une clé seule ----------------------------------------------------------- */
function crVCs(ep,c){
  const rep=ep.ans!==null,C=crCles();
  const V=crVus();
  const ex=DATA('CHARS').filter(x=>x.cle&&x.cle.hz===ep.cle&&V.has(x.id)&&x.hz!==ep.cle).slice(0,5);
  return `<div class="box">
    <p class="u-mb2 mut sm">Que signifie cette clé ?</p>
    <div class="prompt"><div class="big cr-v">${esc(ep.cle)}</div></div>
    <div class="opts">${ep.opts.map((h,j)=>{
      const cl=rep?(j===ep.bon?'ok':j===ep.ans?'no':''):'';
      return `<button class="opt ${cl}" onclick="crRepond(${j})">${esc(C[h])}</button>`;}).join('')}</div>
    ${rep?`<div class="verdict ${ep.ok?'ok':'no'}">${ep.ok?'Juste.':'C’est'} <span class="hz cr-v">${esc(ep.cle)}</span> : ${esc(C[ep.cle])}.${ex.length?` On la trouve dans ${ex.map(x=>`<span class="hz">${esc(x.hz)}</span>`).join(', ')}.`:''}</div>`:''}
  </div>`;
}

/* ---- Ils se ressemblent --------------------------------------------------- */
function crVSem(ep,c){
  const rep=ep.ans!==null,m=ep.opts[ep.bon];
  const q=ep.mode==='py'?`Lequel se lit <span class="py">${pinyin(m.py)}</span> ?`:`Lequel veut dire « ${esc(crSens1(m.fr))} » ?`;
  return `<div class="box">
    <p class="u-mb2 mut sm">Ils se ressemblent. Regardez bien chaque trait.</p>
    <p class="cr-q">${q}</p>
    <div class="cr-q4">${ep.opts.map((o,j)=>{
      const cl=rep?(j===ep.bon?'ok':j===ep.ans?'no':''):'';
      return `<button class="opt han ${cl}" onclick="crRepond(${j})">${esc(o.hz)}</button>`;}).join('')}</div>
    ${rep?`<div class="verdict ${ep.ok?'ok':'no'}">${ep.ok?'Juste.':'C’était '+'<span class="hz">'+esc(m.hz)+'</span>.'}</div>
      <div class="cr-comp">${ep.opts.map(o=>`<div class="cr-crow"><span class="c">${esc(o.hz)}</span><span>${pinyin(o.py)} — ${esc(o.fr)}</span></div>`).join('')}</div>
      <button class="btn pale sm mt" onclick="speak('${jq(m.hz)}')">Écouter</button>`:''}
  </div>`;
}

/* ---- Deviner le son, sans proposition ---------------------------------
   1. toucher l’élément qui donne le son ; 2. dire ou écrire sa
   prononciation ; 3. dire ou écrire celle qu’on suppose au caractère ;
   4. le verdict, avec la fiabilité du lien. Réussi = l’élément trouvé du
   premier coup et sa prononciation juste ; la supposition n’est pas
   notée : le son n’est qu’un indice. */
function crVSon(ep,c){
  const T=ep.tuiles;
  const e1=ep.etape>1;
  const att=pinyin(c.son.py);
  let h=`<div class="box">
    <p class="u-mb2 mut sm">${ep.neuf?'Un caractère que vous n’avez jamais rencontré. ':''}Devinez sa prononciation à partir de ses éléments.</p>
    <div class="prompt"><div class="big">${esc(c.hz)}</div></div>
    <p class="u-ta-center mut sm">${esc(c.fr)}</p>
    <p class="cr-q">1. Quel élément donne le son ?</p>
    <div class="cr-tuiles">${T.map((t,j)=>{
      const cl=t.role==='son'&&e1?'ok':ep.mauvais.indexOf(j)>=0?'no':'';
      return `<button class="cr-tuile hz ${cl}" ${e1?'disabled':''} onclick="crSonTouche(${j})">${esc(t.hz)}</button>`;}).join('')}</div>
    ${ep.msg1&&!e1?`<div class="verdict no">${ep.msg1}</div>`:''}`;
  if(e1){
    const s=T.find(t=>t.role==='son');
    h+=`<div class="verdict ok">${ep.essais?'':'Juste. '}<span class="hz">${esc(s.hz)}</span> donne le son${s.hz===(c.cle&&c.cle.hz)?' ; ici, c’est aussi la clé':''}.</div>
      <p class="cr-q">2. Comment se lit <span class="hz">${esc(c.son.hz)}</span> ?</p>`;
    if(ep.etape===2)h+=crSaisie('Je ne sais pas');
    else h+=`<div class="verdict ${ep.r2.bon?'ok':'no'}">${ep.r2.vu?ep.r2.vu+' — ':''}${ep.r2.bon?'Juste : ':ep.r2.passe?'':ep.r2.syl?'Bonne syllabe, autre ton : ':'Non : '}<span class="hz">${esc(c.son.hz)}</span> se lit ${att}.</div>`;
  }
  if(ep.etape>=3){
    h+=`<p class="cr-q">3. Alors, comment supposez-vous que se lit <span class="hz">${esc(c.hz)}</span> ?</p>`;
    if(ep.etape===3)h+=crSaisie('Je passe');
    else h+=crSonVerdict(ep,c);
  }
  return h+'</div>';
}
function crSaisie(passe){
  const ep=crEp();
  const micro=peutEcouter()?`<button class="btn pale sm dire${ep.ecoute?' ecoute':''}" onclick="crSonDire()" aria-pressed="${!!ep.ecoute}">${micIco()}${ep.ecoute?'J’écoute…':'Dire'}</button>`:'';
  return `<div class="cr-saisie">
    <input id="cr-pyin" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="ma3 ou mǎ" onkeydown="if(event.key==='Enter')crSonEcrit()">
    <div class="row mt"><button class="btn jade sm" onclick="crSonEcrit()">Valider</button>${micro}<button class="btn pale sm" onclick="crSonPasse()">${passe}</button></div>
    ${ep.err?`<p class="mut sm">${esc(ep.err)}</p>`:''}
    <p class="mut sm">Une syllabe, avec son ton : un chiffre (ma3) ou un accent (mǎ).</p>
  </div>`;
}
function crSonTouche(j){
  const ep=crEp();if(!ep||ep.etape!==1)return;
  const t=ep.tuiles[j];
  if(t.role==='son'){ep.etape=2;ep.msg1='';render();return;}
  if(ep.mauvais.indexOf(j)<0)ep.mauvais.push(j);
  ep.essais++;beep('no');
  ep.msg1=t.role==='cle'?`<span class="hz">${esc(t.hz)}</span>, c’est la clé : elle donne le sens, pas le son.`
    :`<span class="hz">${esc(t.hz)}</span> donne le sens, pas le son.`;
  render();
}
/* Une syllabe tapée : chiffres ou accents, ü écrit v. Renvoie « ma3 ». */
function crLirePy(txt){
  txt=String(txt||'').trim();
  if(!txt)return {err:'Écrivez une syllabe avant de valider.'};
  if(!/[0-5]\s*$/.test(txt)&&!MARQUES.test(txt))return {err:'Ajoutez le ton : un chiffre (ma3) ou un accent (mǎ).'};
  const n=pyNorm(txt);
  if(!n||n.indexOf(' ')>=0)return {err:'Une seule syllabe, s’il vous plaît.'};
  const b=n.replace(/[0-9]$/,'');
  if(!SYL.has(b))return {err:'« '+txt+' » n’est pas une syllabe du pinyin.'};
  return {k:n};
}
function crPyLisible(k){return setTone(k.replace(/[0-9]$/,''),+k.slice(-1)||0);}
function crSonEcrit(){
  const ep=crEp();if(!ep||(ep.etape!==2&&ep.etape!==3))return;
  const el=document.getElementById('cr-pyin');
  const r=crLirePy(el?el.value:'');
  if(r.err)return toast(r.err);
  crSonRep(ep,r.k,'');
}
function crSonPasse(){
  const ep=crEp();if(!ep)return;
  if(ep.etape===2){ep.r2={bon:false,passe:true};ep.etape=3;crSonFin2(ep);render();}
  else if(ep.etape===3){ep.r3={passe:true};ep.etape=4;crSonFin(ep);render();}
}
/* k : la lecture proposée (« ma3 ») ; vu : ce que Chrome a entendu. */
function crSonRep(ep,k,vu){
  const c=crCar(ep.id);
  const cible=ep.etape===2?c.son.py:c.py;
  const a=pyRead(cible);
  const r={k:k,bon:k===a,syl:!!k&&k.replace(/[0-9]$/,'')===a.replace(/[0-9]$/,''),vu:vu};
  ep.err='';ep.ecoute=false;
  if(ep.etape===2){ep.r2=r;ep.etape=3;crSonFin2(ep);}
  else{ep.r3=r;ep.etape=4;crSonFin(ep);}
  render();
}
/* Fin de l’étape 2 : la note se décide ici (élément trouvé du premier
   coup, prononciation juste). */
function crSonFin2(ep){crNoter(ep,ep.essais===0&&!!ep.r2.bon);}
function crSonFin(ep){ep.ans=1;}

/* Le micro : Chrome écrit des caractères ; on garde les lectures connues
   de chacun (lecturesDe) et on retient la meilleure. */
function crSonDire(){
  const ep=crEp();if(!ep||(ep.etape!==2&&ep.etape!==3))return;
  if(ep.ecoute){ecouteStop();return;}
  const c=crCar(ep.id);
  const a=pyRead(ep.etape===2?c.son.py:c.py);
  ep.ecoute=true;ep.err='';render();
  ecouterMoi({duree:5000,
    onresult:alts=>{
      if(crEp()!==ep||!ep.ecoute)return;
      let best=null;
      alts.forEach(t=>{
        const H=hanChars(chiffresEnHan(t));
        if(H.length!==1)return;
        const L=Array.from(lecturesDe(H[0]));
        const k=L.indexOf(a)>=0?a:(L.find(l=>nuDe(l)===nuDe(a))||(L.length===1?L[0]:''));
        const sc=k===a?0:k&&nuDe(k)===nuDe(a)?1:k?2:3;
        if(!best||sc<best.sc)best={sc:sc,k:k,hz:H[0]};
      });
      if(!best||best.sc===3){
        ep.ecoute=false;
        ep.err=best?`Entendu « ${best.hz} », dont la lecture est incertaine. Écrivez plutôt la syllabe.`:'Entendu : '+(alts[0]||'—')+'. Dites une seule syllabe, ou écrivez-la.';
        render();return;
      }
      crSonRep(ep,best.k,`Entendu <span class="hz">${esc(best.hz)}</span> ${pinyin(crPyLisible(best.k))}`);
    },
    onerror:code=>{if(crEp()!==ep)return;ep.ecoute=false;ep.err=ecouteErreur(code);render();}
  });
}

function crSonVerdict(ep,c){
  const fi=crFiab(c),F=CR_FIAB[fi];
  const r=ep.r3||{};
  const vrai=pinyin(c.py||'');
  let sup='';
  if(r.passe)sup=`<span class="hz">${esc(c.hz)}</span> se lit ${vrai}.`;
  else{
    const dit=r.vu||('Vous avez proposé '+pinyin(crPyLisible(r.k)));
    sup=`${dit}. ${r.bon?'C’est exactement ça !':r.syl?'Bonne syllabe, mais le ton diffère :':'Ce n’est pas ça :'} <span class="hz">${esc(c.hz)}</span> se lit ${vrai}.`;
  }
  const lien={
    meme:'Ici, le son passe tel quel : même syllabe, même ton.',
    ton:'Même syllabe, autre ton : l’élément donne la syllabe, pas le ton.',
    proche:'Le son est seulement proche : l’élément donne un indice, pas la prononciation.',
    perdu:'Le lien ne s’entend plus aujourd’hui : la prononciation a changé depuis la création du caractère.'
  }[fi]||'';
  return `<div class="verdict ${r.bon?'ok':'no'}">${sup}</div>
    ${F?`<div class="cr-crow"><span class="c">${esc(c.son.hz)}</span><span>${pinyin(c.son.py)} → <span class="hz">${esc(c.hz)}</span> ${vrai}
      <span class="cr-fiab" role="img" aria-label="Fiabilité du son : ${esc(F.t)}">${[1,2,3].map(k=>`<i class="${k<=F.n?'on':''}"></i>`).join('')}</span>
      <small class="cr-ft">${esc(lien)}</small></span></div>`:''}
    <p class="sm mt">${crRappel(c)}${ep.neuf?' · Caractère jamais rencontré : cette épreuve ne compte pas.':''}</p>
    <button class="btn pale sm mt" onclick="speak('${jq(c.hz)}')">Écouter</button>`;
}

/* ---- Le bilan ----------------------------------------------------------------- */
function crBilan(){
  const Z=ctx.seance;
  const E=Z.eps.filter(e=>!e.neuf&&e.ok!==null);
  const n=E.length,k=E.filter(e=>e.ok).length;
  const pct=n?Math.round(k/n*100):0,bien=pct>=75;
  const V=crVus();
  const ids=[];E.filter(e=>!e.ok).forEach(e=>{if(ids.indexOf(e.id)<0)ids.push(e.id);});
  const rates=ids.map(crCar).filter(Boolean);
  const neuf=Z.eps.find(e=>e.neuf);
  return header('Séance terminée')+`
  <div class="box vb-fin">
    <div class="score"><div class="n">${k}<small> sur ${n}</small></div><div class="lbl">du premier coup</div></div>
    <div class="u-mv44 bar"><i class="${bien?'ok':pct>=50?'mi':'no'}" style="width:${pct}%"></i></div>
  </div>
  ${coach(bien?'saut':'encourage',bien?'Belle séance ! Les tracés réussis reviennent de moins en moins souvent.'
    :(rates.length?'Les caractères ratés reviendront dès la prochaine séance, jusqu’à ce qu’ils tiennent.':'On continue : ça s’installe.'))}
  ${neuf&&neuf.ok!==null?`<p class="cr-note">En plus : une épreuve du son sur un caractère jamais vu, <span class="hz">${esc((crCar(neuf.id)||{}).hz||'')}</span>, qui ne compte pas.</p>`:''}
  ${rates.length?`<h2 class="sec">À retravailler</h2><div class="vb-list">${rates.map(c=>crLigne(c,V)).join('')}</div>`:''}
  <button class="btn mt" onclick="back();crSeance()">Nouvelle séance</button>
  <button class="btn pale mt" onclick="back()">Retour aux caractères</button>`;
}

/* =====================================================================
   « Mon ton » : la courbe de la voix (lot 3)
   Sur la fiche d’un caractère. Le micro passe par Web Audio ; la hauteur
   de la voix est calculée sur l’appareil (autocorrélation normalisée,
   toutes les 10 ms, entre 70 et 500 Hz) : rien n’est envoyé ni gardé,
   et cela marche hors ligne. La courbe est ramenée à l’échelle de Chao
   (1 à 5) d’après le registre de la voix (S.settings.voix : deux
   nombres, la note basse et la note haute), appris au fil des essais
   ou réglé une fois (« mā má mǎ mà »). Rien n’est noté.
   ===================================================================== */
let TON={id:'',etat:'',res:null,err:'',note:''};
let TON_REC=null;

function tonPossible(){
  return typeof navigator!=='undefined'&&!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)&&
    typeof window!=='undefined'&&!!(window.AudioContext||window.webkitAudioContext);
}
function tonFin(){
  if(TON_REC)TON_REC.stop(true);
  TON={id:'',etat:'',res:null,err:'',note:''};
}

/* ---- L’enregistrement --------------------------------------------------
   o.max : durée maximale (ms) ; o.silence : arrêt après ce silence (ms),
   une fois la voix entendue ; o.fin(échantillons, fréquence) ; o.err(code). */
function tonEnregistrer(o){
  const R={actif:true,tm:null};
  let ac=null,flux=null,proc=null,src=null,fond=0,nb=0,vu=false,calme=0;
  const bufs=[];
  R.stop=annule=>{
    if(!R.actif)return;
    R.actif=false;clearTimeout(R.tm);
    try{if(proc)proc.disconnect();if(src)src.disconnect();}catch(e){}
    try{if(flux)flux.getTracks().forEach(t=>t.stop());}catch(e){}
    const sr=ac?ac.sampleRate:48000;
    try{if(ac)ac.close();}catch(e){}
    if(TON_REC===R)TON_REC=null;
    if(annule)return;
    let n=0;bufs.forEach(b=>{n+=b.length;});
    const x=new Float32Array(n);let k=0;
    bufs.forEach(b=>{x.set(b,k);k+=b.length;});
    o.fin(x,sr);
  };
  TON_REC=R;
  navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}}).then(s=>{
    if(!R.actif){s.getTracks().forEach(t=>t.stop());return;}
    flux=s;
    const AC=window.AudioContext||window.webkitAudioContext;
    ac=new AC();
    if(ac.state==='suspended'&&ac.resume)ac.resume();
    src=ac.createMediaStreamSource(s);
    proc=ac.createScriptProcessor(2048,1,1);
    const dt=2048/ac.sampleRate*1000;
    proc.onaudioprocess=ev=>{
      if(!R.actif)return;
      const d=new Float32Array(ev.inputBuffer.getChannelData(0));
      bufs.push(d);
      let e=0;for(let i=0;i<d.length;i++)e+=d[i]*d[i];
      const r=Math.sqrt(e/d.length);
      /* Le bruit de fond : le plus faible des premiers blocs. */
      if(nb<4)fond=nb?Math.min(fond,r):r;
      nb++;
      if(r>Math.max(0.008,fond*4)){vu=true;calme=0;}
      else if(vu){calme+=dt;if(o.silence&&calme>=o.silence)R.stop(false);}
    };
    src.connect(proc);proc.connect(ac.destination);
    R.tm=setTimeout(()=>R.stop(false),o.max);
  }).catch(e=>{
    R.actif=false;if(TON_REC===R)TON_REC=null;
    const n=e&&e.name;
    o.err(n==='NotAllowedError'||n==='SecurityError'?'not-allowed':n==='NotFoundError'||n==='NotReadableError'?'audio-capture':'erreur');
  });
  return R;
}

/* ---- La hauteur de la voix ---------------------------------------------
   Le signal est ramené vers 16 kHz, puis, toutes les 10 ms, une fenêtre de
   40 ms passe par la fonction de différence normalisée (McLeod) : le
   premier sommet qui atteint 85 % du plus haut donne la période. Renvoie
   une hauteur en Hz par tranche de 10 ms (0 : pas de voix). */
function tonHauteurs(x0,sr0){
  const q=Math.max(1,Math.round(sr0/16000)),sr=sr0/q;
  const n=Math.floor(x0.length/q),x=new Float32Array(n);
  for(let i=0;i<n;i++){let a=0;for(let j=0;j<q;j++)a+=x0[i*q+j];x[i]=a/q;}
  const hop=Math.round(sr*0.01),win=Math.round(sr*0.04);
  const minL=Math.floor(sr/500),maxL=Math.ceil(sr/70);
  const E=[];let maxE=0;
  for(let s=0;s+win+maxL<=n;s+=hop){
    let e=0;for(let i=0;i<win;i++)e+=x[s+i]*x[s+i];
    const r=Math.sqrt(e/win);E.push(r);if(r>maxE)maxE=r;
  }
  const seuil=Math.max(0.003,maxE*0.1);
  const F=[],C=[],ns=new Float32Array(maxL+2);
  E.forEach((r,j)=>{
    if(r<seuil){F.push(0);C.push(0);return;}
    const s=j*hop;
    for(let L=minL-1;L<=maxL+1;L++){
      let ac=0,m=0;
      for(let i=0;i<win;i++){const a=x[s+i],b=x[s+i+L]||0;ac+=a*b;m+=a*a+b*b;}
      ns[L]=m>0?2*ac/m:0;
    }
    let L=minL;
    while(L<=maxL&&ns[L]>0)L++;
    const pics=[];let cur=null;
    for(;L<=maxL;L++){
      if(ns[L]>0){if(!cur||ns[L]>cur.v)cur={L:L,v:ns[L]};}
      else if(cur){pics.push(cur);cur=null;}
    }
    if(cur)pics.push(cur);
    let M=0;pics.forEach(p=>{if(p.v>M)M=p.v;});
    const p=pics.find(p=>p.v>=0.85*M);
    if(!p||M<0.55){F.push(0);C.push(M);return;}
    const a=ns[p.L-1],b=ns[p.L],c=ns[p.L+1],den=a-2*b+c;
    const dl=den?0.5*(a-c)/den:0;
    F.push(sr/(p.L+(Math.abs(dl)<1?dl:0)));C.push(M);
  });
  return F;
}
function tonMediane(L){const s=L.slice().sort((a,b)=>a-b);return s.length?s[s.length>>1]:0;}

/* Le segment voisé le plus long (trous de 40 ms au plus, comblés), corrigé
   des sauts d’octave, lissé, rogné de ses bords. */
function tonSegment(F){
  let best=null,deb=-1,trou=0;
  for(let i=0;i<=F.length;i++){
    const v=i<F.length&&F[i]>0;
    if(v){if(deb<0)deb=i;trou=0;}
    else if(deb>=0){
      trou++;
      if(trou>4||i===F.length){
        const fin=i-trou;
        if(!best||fin-deb>best[1]-best[0])best=[deb,fin];
        deb=-1;trou=0;
      }
    }
  }
  if(!best)return [];
  let S=F.slice(best[0],best[1]+1);
  for(let i=0;i<S.length;i++)if(!S[i]){
    let a=i-1,b=i;while(b<S.length&&!S[b])b++;
    for(let k=i;k<b;k++)S[k]=S[a]+(S[b]-S[a])*(k-a)/(b-a);
    i=b;
  }
  const med=tonMediane(S);
  S=S.map(f=>{while(f>med*1.8)f/=2;while(f<med/1.8)f*=2;return f;});
  S=S.map((f,i)=>tonMediane(S.slice(Math.max(0,i-2),i+3)));
  if(S.length>20)S=S.slice(2,-2);
  return S;
}

const TON_ERR={
  court:'Trop bref : dites la syllabe un peu plus longuement.',
  mal:'Je vous entends mal : rapprochez-vous du micro, dans un endroit calme.',
  rien:'Rien entendu. Parlez juste après avoir touché « Mon ton ».'
};
function tonAnalyse(x,sr){
  const F=tonHauteurs(x,sr);
  const nv=F.filter(f=>f>0).length;
  if(!nv)return {err:'rien'};
  const S=tonSegment(F);
  if(S.length<12)return {err:nv<12?'court':'mal'};
  return {f:S};
}

/* ---- Le registre de la voix --------------------------------------------- */
function tonVoix(f){
  const V=S.settings.voix;
  if(V&&V.lo>0&&V.hi>V.lo)return V;
  const m=tonMediane(f);
  return m>=160?{lo:160,hi:320,src:'defaut'}:{lo:85,hi:170,src:'defaut'};
}
function tonChao(f,V){
  const a=Math.log2(V.lo),b=Math.log2(V.hi);
  return f.map(h=>1+4*(Math.log2(h)-a)/(b-a));
}
function tonPct(L,p){const s=L.slice().sort((a,b)=>a-b);return s[Math.min(s.length-1,Math.max(0,Math.round(p*(s.length-1))))];}
/* Après chaque essai : le registre s’élargit vite quand la voix en sort,
   se resserre lentement. Un registre réglé ne fait que s’élargir. */
function tonApprendre(f,V){
  const lo=tonPct(f,.05),hi=tonPct(f,.95);
  const L=x=>Math.log2(x);
  let a=L(V.lo),b=L(V.hi);
  const etal=V.src==='etal';
  if(L(lo)<a)a+=(etal?.3:.5)*(L(lo)-a);else if(!etal)a+=.08*(L(lo)-a);
  if(L(hi)>b)b+=(etal?.3:.5)*(L(hi)-b);else if(!etal)b+=.08*(L(hi)-b);
  if(b-a<5/12){const m=(a+b)/2;a=m-2.5/12;b=m+2.5/12;}
  S.settings.voix={lo:Math.round(2**a*10)/10,hi:Math.round(2**b*10)/10,src:etal?'etal':'auto'};
  save();
}

/* ---- Le jugement ------------------------------------------------------------
   v : la courbe en unités de Chao. On la ramène à 20 points, puis quatre
   repères : départ, arrivée, point le plus bas (et où il tombe), moyenne. */
function tonReperes(v){
  const N=20,P=[];
  for(let i=0;i<N;i++){const t=i*(v.length-1)/(N-1),k=Math.floor(t),r=t-k;P.push(v[k]+(v[Math.min(v.length-1,k+1)]-v[k])*r);}
  const moy=a=>a.reduce((x,y)=>x+y,0)/a.length;
  let mn=Infinity,pmn=0,mx=-Infinity;
  P.forEach((y,i)=>{if(y<mn){mn=y;pmn=i/(N-1);}if(y>mx)mx=y;});
  return {P:P,s:moy(P.slice(0,3)),e:moy(P.slice(-3)),mn:mn,pmn:pmn,mx:mx,moy:moy(P)};
}
const TON_MODELES={1:[[0,5],[1,5]],2:[[0,3],[1,5]],3:[[0,2],[.5,1],[1,3]],4:[[0,5],[1,1]]};
function tonModele(t,x){
  const M=TON_MODELES[t];
  for(let i=1;i<M.length;i++)if(x<=M[i][0])return M[i-1][1]+(M[i][1]-M[i-1][1])*(x-M[i-1][0])/(M[i][0]-M[i-1][0]);
  return M[M.length-1][1];
}
/* Le ton le plus proche de ce qui a été dit : la forme compte, le niveau
   un peu. */
function tonRessemble(R){
  let best=0,d0=Infinity;
  [1,2,3,4].forEach(t=>{
    const m=R.P.map((y,i)=>tonModele(t,i/(R.P.length-1)));
    const mm=m.reduce((a,b)=>a+b,0)/m.length;
    let d=0;R.P.forEach((y,i)=>{d+=((y-R.moy)-(m[i]-mm))**2;});
    d=Math.sqrt(d/R.P.length)+0.35*Math.abs(R.moy-mm);
    if(d<d0){d0=d;best=t;}
  });
  return best;
}
/* forme : registre encore inconnu (premier essai, sans réglage) : seule
   la forme est jugée, pas la hauteur. */
function tonJuge(v,t,forme){
  const R=tonReperes(v);
  const monte=R.e-R.s,creux=R.s-R.mn;
  let n='non',c='';
  if(t===1){
    const plat=Math.abs(monte)<=0.9&&R.mx-R.mn<=1.4,haut=forme||R.moy>=3.5;
    if(plat&&haut){n='ok';c='Beau 1ᵉʳ ton : haut et tenu.';}
    else{
      if(plat&&R.moy>=2.8||haut&&Math.abs(monte)<=1.4)n='proche';
      c=!haut?'Le 1ᵉʳ ton se tient dans le haut de votre voix : partez plus haut.'
        :monte>0.9?'Votre voix monte : gardez-la au même niveau, comme une note chantée.'
        :'Votre voix retombe : tenez la note jusqu’au bout.';
    }
  }else if(t===2){
    if(monte>=1.3&&(forme||R.e>=3.6)&&creux<=0.7){n='ok';c='Beau 2ᵉ ton : la voix monte franchement.';}
    else{
      if(monte>=0.8&&creux<=1)n='proche';
      c=creux>0.7&&R.pmn>0.15&&R.pmn<0.8?'Votre voix descend avant de monter : c’est le geste du 3ᵉ ton. Partez du milieu et montez tout de suite.'
        :monte<1.3?'Montez davantage, comme dans une question étonnée : « ah ? »'
        :'Finissez plus haut.';
    }
  }else if(t===3){
    if((forme?creux>=0.8:R.mn<=2&&R.s<=3.3)&&creux>=0.6&&R.pmn>=0.2&&!(forme&&R.s-R.e>=1.5&&R.pmn>0.85)){
      n='ok';
      c=R.e-R.mn>=1?'Beau 3ᵉ ton : bien descendu, puis remonté.'
        :'Bien descendu. Seul, le 3ᵉ ton remonte un peu à la fin ; dans une phrase, on reste souvent en bas.';
    }else{
      if(R.mn<=2.5&&creux>=0.4)n='proche';
      c=R.s>3.3&&R.s-R.e>=1.5?'Votre voix tombe de haut : on entend un 4ᵉ ton. Partez du milieu de votre voix et descendez jusqu’au fond.'
        :creux<0.6&&monte>=0.8?'Votre voix monte sans descendre d’abord : on entend un 2ᵉ ton. Commencez par plonger.'
        :R.mn>2?'Descendez plus bas, jusqu’au fond de votre voix : c’est ce creux qu’on entend.'
        :'Descendez d’abord, puis remontez un peu : le creux doit venir après le début.';
    }
  }else{
    const chute=R.s-R.e;
    if(chute>=2&&(forme||R.s>=3.8)){n='ok';c='Beau 4ᵉ ton : il tombe de haut, d’un coup.';}
    else{
      if(chute>=1.2)n='proche';
      c=monte>0.8?'Votre voix monte au lieu de tomber : partez du haut de votre voix et laissez-la tomber d’un coup.'
        :R.s<3.8?'Partez de plus haut : le 4ᵉ ton tombe du sommet de votre voix.'
        :'Tombez franchement, d’un coup, comme un ordre sec : « non ! »';
    }
  }
  const r=tonRessemble(R);
  return {n:n,c:c,r:r,R:R};
}

/* ---- Le bouton, l’essai, le réglage ----------------------------------------- */
function tonCourbeIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M3 17c3 0 4-9 7-9s3 8 6 8 3-5 5-5"/></svg>`;}
function tonBouton(c){
  if(!toneOf(c.py||''))return '';
  if(!tonPossible())return `<button class="vb-act" disabled aria-disabled="true" title="Pas sur ce navigateur">${tonCourbeIco()}Mon ton</button>`;
  const on=TON.id===c.id&&TON.etat==='ecoute';
  return `<button class="vb-act ton${on?' ecoute':''}" onclick="tonGo('${jq(c.id)}')" aria-pressed="${on}">${tonCourbeIco()}${on?'J’écoute…':'Mon ton'}</button>`;
}
function tonGo(id){
  if(TON.id===id&&(TON.etat==='ecoute'||TON.etat==='etal')){if(TON_REC)TON_REC.stop(false);return;}
  direFin();
  if(TON_REC)TON_REC.stop(true);
  TON={id:id,etat:'ecoute',res:null,err:'',note:''};
  render();
  tonEnregistrer({max:2500,silence:450,
    fin:(x,sr)=>tonApres(id,x,sr),
    err:code=>{if(TON.id!==id)return;TON.etat='err';TON.err=ecouteErreur(code);render();}});
}
function tonApres(id,x,sr){
  if(TON.id!==id||view!=='car'||ctx.id!==id)return;
  const c=crCar(id);
  const A=tonAnalyse(x,sr);
  if(A.err){TON.etat='err';TON.err=TON_ERR[A.err];render();return;}
  const V=tonVoix(A.f);
  const v=tonChao(A.f,V);
  const t=toneOf(c.py);
  TON.res={v:v,t:t,j:tonJuge(v,t,V.src==='defaut'),regle:V.src==='etal'};
  tonApprendre(A.f,V);
  TON.etat='fini';
  render();
}
function tonEtal(id){
  direFin();
  if(TON_REC)TON_REC.stop(true);
  TON={id:id,etat:'etal',res:null,err:'',note:''};
  render();
  tonEnregistrer({max:7000,silence:1500,
    fin:(x,sr)=>{
      if(TON.id!==id||view!=='car')return;
      const F=tonHauteurs(x,sr).filter(f=>f>0);
      if(F.length<40){TON.etat='err';TON.err='Je n’ai pas assez entendu votre voix. Dites les quatre syllabes, lentement, près du micro.';render();return;}
      const med=tonMediane(F);
      const G=F.map(f=>{while(f>med*1.8)f/=2;while(f<med/1.8)f*=2;return f;});
      const lo=tonPct(G,.05),hi=tonPct(G,.95);
      if(Math.log2(hi/lo)<5/12){TON.etat='err';TON.err='Votre voix n’a pas assez varié : exagérez les tons, du plus bas au plus haut.';render();return;}
      S.settings.voix={lo:Math.round(lo*0.97*10)/10,hi:Math.round(hi*10)/10,src:'etal'};save();
      TON.etat='';TON.note='Réglé sur votre voix. Dites maintenant la syllabe avec « Mon ton ».';
      render();
    },
    err:code=>{if(TON.id!==id)return;TON.etat='err';TON.err=ecouteErreur(code);render();}});
}

/* ---- Le dessin --------------------------------------------------------------- */
function tonDessin(res){
  const X=x=>34+x*252,Y=v=>122-(Math.max(.6,Math.min(5.4,v))-1)*25;
  const grille=[1,2,3,4,5].map(k=>`<path d="M30 ${Y(k)}H290" class="g"/><text x="14" y="${Y(k)+4}">${k}</text>`).join('');
  const M=TON_MODELES[res.t];
  let att=`M${X(M[0][0])} ${Y(M[0][1])}`;
  if(M.length===3)att+=` Q${X(M[1][0])} ${Y(M[1][1]-1.05)} ${X(M[2][0])} ${Y(M[2][1])}`;
  else att+=` L${X(M[1][0])} ${Y(M[1][1])}`;
  const v=res.v,n=Math.min(40,v.length);
  const pts=[];for(let i=0;i<n;i++){const k=Math.round(i*(v.length-1)/(n-1));pts.push(X(i/(n-1)).toFixed(1)+' '+Y(v[k]).toFixed(1));}
  return `<svg class="ton-svg" viewBox="0 0 300 140" role="img" aria-label="Votre courbe de voix sur la courbe attendue">
    <g class="ton-gr">${grille}</g>
    <path d="${att}" class="att"/>
    <path d="M${pts.join(' L')}" class="moi"/>
  </svg>
  <div class="ton-leg"><span><i class="att"></i>attendu</span><span><i class="moi"></i>votre voix</span></div>`;
}
const TON_NOMS={1:'1ᵉʳ ton',2:'2ᵉ ton',3:'3ᵉ ton',4:'4ᵉ ton'};
function tonPanneau(c){
  if(TON.id!==c.id||!tonPossible())return '';
  let note='';
  if(!S.settings.tonVu&&TON.etat){
    note=`<p class="dire-note">Le son reste sur votre appareil : il n’est ni envoyé ni gardé.</p>`;
    S.settings.tonVu=true;save();
  }
  const reg=`<button class="btn pale sm" onclick="tonEtal('${jq(c.id)}')">${S.settings.voix&&S.settings.voix.src==='etal'?'Régler à nouveau sur ma voix':'Régler sur ma voix (5 s)'}</button>`;
  if(TON.etat==='ecoute')return `<div class="dire-res v-ecoute" aria-live="polite"><p>Dites <span class="hz">${esc(c.hz)}</span> ${pinyin(c.py||'')} maintenant.</p>${note}</div>`;
  if(TON.etat==='etal')return `<div class="dire-res v-ecoute" aria-live="polite"><p>Dites lentement, en exagérant les tons : <b class="py">${pinyin('mā má mǎ mà')}</b></p>
    <div class="dire-row"><button class="btn pale sm" onclick="tonGo('${jq(c.id)}')">J’ai fini</button></div>${note}</div>`;
  if(TON.etat==='err')return `<div class="dire-res v-err" aria-live="polite"><p>${esc(TON.err)}</p>
    <div class="dire-row"><button class="btn pale sm" onclick="tonGo('${jq(c.id)}')">Réessayer</button></div>${note}</div>`;
  if(TON.etat==='fini'){
    const r=TON.res,j=r.j;
    const cl=j.n==='ok'?'v-ok':j.n==='proche'?'v-ton':'v-autre';
    const tete=j.n==='ok'?'':j.n==='proche'?'Presque. ':'';
    const sembl=j.n!=='ok'&&j.r&&j.r!==r.t?` On dirait plutôt un ${TON_NOMS[j.r]}.`:'';
    return `<div class="dire-res ton-res ${cl}" aria-live="polite">
      ${tonDessin(r)}
      <p>${tete}${esc(j.c)}${sembl}</p>
      ${r.regle?'':`<p class="mut sm">Courbe approchée : l’appli apprend le registre de votre voix au fil des essais. Pour plus de justesse, réglez-la sur votre voix.</p>`}
      <div class="dire-row"><button class="btn pale sm" onclick="tonGo('${jq(c.id)}')">Réessayer</button>
        <button class="btn pale sm" onclick="speak('${jq(c.hz)}')">Écouter le modèle</button></div>
      <div class="dire-row">${reg}</div>${note}</div>`;
  }
  if(TON.note)return `<div class="dire-res v-ok" aria-live="polite"><p>${esc(TON.note)}</p></div>`;
  return '';
}
