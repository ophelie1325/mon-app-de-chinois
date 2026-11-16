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
function crOuvrir(id){direFin();go('car',{id:id});}

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
    <button class="btn cr-btn" disabled aria-disabled="true">Bientôt : la séance d’écriture</button>
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
      ${direBouton({hz:c.hz,py:c.py},'vb-act')}
      <button class="vb-act" onclick="crTracer('${jq(c.id)}',0)">${pinceauIco()}Tracer</button>
    </div>
    ${direPanneau()}

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
function crTracer(id,memoire){direFin();go('trace',{id:id,memoire:!!memoire});}
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
}
