/* =====================================================================
   MODULE GRAMMAIRE

   Trois temps, dans cet ordre :
     découverte écran par écran → fiche complète → exercices.
   La découverte et la fiche complète lisent les mêmes données : une
   correction faite une fois vaut pour les deux rendus.
   ===================================================================== */


function gById(id){return GRAMMAR.find(g=>g.id===id);}
function famOf(k){return FAM.find(f=>f.k===k)||FAM[2];}
/* Progression propre à la grammaire. S.items[id] porte la boîte de
   Leitner (jamais affichée : seuls les quatre états se voient) ; S.gram[id] retient si la
   découverte a été faite et le meilleur score aux exercices. */
function gRec(id){
  S.gram=S.gram||{};
  S.gram[id]=Object.assign({vu:0,essais:0,best:0},S.gram[id]||{});
  return S.gram[id];
}

/* --- Assemblage de phrases à partir des jetons --- */
function segHz(seg){return seg.map(t=>t.h).join('');}
function segPy(seg){return seg.map(t=>t.p).filter(Boolean).join(' ');}
function segMots(seg){return seg.filter(t=>t.p);}   /* sans la ponctuation */

/* =====================================================================
   1. ACCUEIL DU MODULE — thème porcelaine bleu et blanc 青花
   (maquette « GrammairePorcelaine », validée le 18 novembre 2026)

   Carte du jour, recherche en français ou en chinois, pastilles
   rapides, panneau Filtres (famille, oral), et deux façons de parcourir
   les fiches : le chemin d’un niveau dans l’ordre du programme, ou les
   familles. Les boîtes de Leitner travaillent en coulisse : seuls les
   quatre états se voient.
   ===================================================================== */

/* ---- Les quatre états d’une fiche ---------------------------------
   Ceux des mots (etatMot, core.js), à une nuance près : une fiche dont
   la découverte est faite mais qu’on n’a pas encore exercée est déjà
   « en cours ». « À revoir » n’est pas un état : c’est une échéance,
   qui peut tomber sur une fiche sue comme sur une fiche fragile. */
function etatFiche(id){
  const r=S.items[id],vu=((S.gram||{})[id]||{}).vu;
  if(!r||!r.seen)return vu?'cours':'neuf';
  return etatMot(id);
}
function aRevoirFiche(id){const r=S.items[id];return !!(r&&r.seen&&due(id));}
/* Teintes de la maquette, propres au module. */
const GCOUL={su:'#3D8A46',cours:'#C9A23A',frag:'#C8553D',neuf:'#CFCBDB'};

/* L’ordre du programme : par niveau, les fiches numérotées dans l’ordre,
   puis la reprise orale du niveau. */
function ordreProg(){
  const pos=new Map(GRAMMAR.map((g,i)=>[g.id,i]));
  const oral=g=>/^gO/.test(g.id)?1:0;
  return GRAMMAR.slice().sort((a,b)=>a.hsk-b.hsk||oral(a)-oral(b)
    ||a.id.localeCompare(b.id,'fr',{numeric:true})||pos.get(a.id)-pos.get(b.id));
}
function niveauxGram(){return Array.from(new Set(GRAMMAR.map(g=>g.hsk))).sort((a,b)=>a-b);}
function prochaineFiche(){return ordreProg().find(g=>etatFiche(g.id)==='neuf')||null;}

/* Toutes les fiches ont un écran « À l’oral » : le filtre retient celles
   où l’oral occupe plusieurs écrans, et les reprises orales. */
function ficheOrale(g){return g.fam==='oral'||g.steps.filter(s=>s.reg==='oral').length>=2;}

/* Le nom court d’une fiche, pour la carte du jour : la partie du titre
   qui porte le chinois (« 了 : l’action accomplie » → 了). */
function nomCourt(g){
  const parts=g.title.split(/\s:\s/);
  const zh=parts.find(x=>HAN_RE.test(x));
  return (parts.length>1&&zh)?zh:g.title;
}

function gsa(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function gPlat(h){return String(h||'').replace(/<[^>]*>/g,'');}
/* Recherche : en chinois, dans les titres et les exemples ; en
   français, dans le titre, le résumé et les titres d’écrans. */
function gTrouve(g,q){
  q=String(q||'').trim();
  if(!q)return true;
  if(HAN_RE.test(q)){
    const zh=q.replace(/\s+/g,'');
    return [g.title].concat(g.steps.map(s=>s.t)).some(t=>String(t).replace(/\s+/g,'').indexOf(zh)>=0)
      ||g.steps.some(s=>(s.ex||[]).some(e=>String(e.hz).indexOf(zh)>=0));
  }
  const m=gsa(q);
  return [g.title,g.resume].concat(g.steps.map(s=>s.t)).some(t=>gsa(gPlat(t)).indexOf(m)>=0);
}

/* L’état de l’accueil vit le temps de la page. */
let GF={q:'',pill:'toutes',mode:'ordre',lvl:0,fam:'',oral:false,ouvert:false,anim:false};
function gNiveau(){
  const N=niveauxGram();
  if(N.indexOf(GF.lvl)>=0)return GF.lvl;
  const l=S.settings.level;
  if(N.indexOf(l)>=0)return l;
  return N.filter(x=>x<=l).pop()||N[0];
}
function gPasse(g){
  if(GF.fam&&g.fam!==GF.fam)return false;
  if(GF.oral&&!ficheOrale(g))return false;
  const e=etatFiche(g.id);
  if(GF.pill==='decouvrir'&&e!=='neuf')return false;
  if(GF.pill==='revoir'&&!aRevoirFiche(g.id))return false;
  if(GF.pill==='fragiles'&&e!=='frag')return false;
  return gTrouve(g,GF.q);
}

function pl2(n,s,p){return n+'\u00A0'+(n>1?(p||s+'s'):s);}
function listeEt2(l){return l.length>1?l.slice(0,-1).join(', ')+' et '+l[l.length-1]:(l[0]||'');}

/* ---- Fragments ---- */
const GR_C=119.4;   /* circonférence de l’anneau (r = 19) */
function gAnneau(frac,coul,label,fond){
  return `<span class="gr-ring"><svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
    <circle cx="22" cy="22" r="19" fill="none" stroke="${fond||'#E3E0EC'}" stroke-width="4"/>
    ${frac>0?`<circle cx="22" cy="22" r="19" fill="none" stroke="${coul}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(frac*GR_C).toFixed(1)} ${GR_C}"/>`:''}</svg><b>${label}</b></span>`;
}
function gEtiquette(g){
  const e=etatFiche(g.id),rv=aRevoirFiche(g.id);
  if(e==='frag')return `<span class="gr-etq e-frag">fragile${rv?' · à revoir':''}</span>`;
  if(rv)return `<span class="gr-etq e-due">à revoir</span>`;
  return `<span class="gr-etq e-${e==='neuf'?'pas':e}">${{su:'su',cours:'en cours',neuf:'pas encore vue'}[e]}</span>`;
}
function vague(id,h,op){
  return `<svg class="gr-motif" style="height:${h}px" viewBox="0 0 360 ${h}" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false"><defs><pattern id="${id}" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 12A12 12 0 0 1 24 12M4 12A8 8 0 0 1 20 12M8 12A4 4 0 0 1 16 12" fill="none" stroke="rgba(31,78,158,${op})" stroke-width="1.1"/></pattern></defs><rect width="360" height="${h}" fill="url(#${id})"/></svg>`;
}
function grChercherIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;}
function grFiltreIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>`;}

/* ---- L’accueil ---- */
function vGramHome(){
  const tout=ordreProg();
  const trav=tout.filter(g=>etatFiche(g.id)!=='neuf').length;
  const R=tout.filter(g=>aRevoirFiche(g.id));
  const nx=prochaineFiche();
  const noms=R.slice(0,4).map(nomCourt);
  const titre=R.length?(R.length>1?pl2(R.length,'point')+' reviennent':'Un point revient'):'Tout est à jour';
  const dit=(R.length?esc(listeEt2(noms))+(R.length>4?'…':'')+'. ':'')
    +(nx?'Prochaine fiche à découvrir\u202F: '+esc(nx.title)+'.':'Toutes les fiches sont découvertes.');
  const nf=(GF.fam?1:0)+(GF.oral?1:0);
  return `${header('Grammaire',pl2(GRAMMAR.length,'fiche')+' · '+trav+' travaillée'+(trav>1?'s':''))}
  ${ribbon()}
  <section class="vb-card gr-today">
    ${vague('gr-vagc',30,.13)}
    <div class="vb-tod">
      <div class="gr-num"><b>${R.length}</b><small>à revoir</small></div>
      <div class="vb-tx"><h2>${titre}</h2><p>${dit}</p></div>
      ${banban('pinceau','vb-lit',1)}
    </div>
  </section>
  ${R.length||nx?`<button class="btn gr-go" onclick="reviserGrammaire()">${R.length?'Réviser ma grammaire':'Découvrir la prochaine fiche'}</button>`:''}
  <div class="vb-search">
    <label class="vb-q">${grChercherIco()}<span class="vb-sr">Chercher une notion</span>
      <input type="search" value="${esc(GF.q)}" placeholder="把, 了, comparer, le temps…" oninput="grChercher(this.value)" autocomplete="off"></label>
    <button class="vb-fbtn gr-fbtn" onclick="grOuvrirFiltres()" aria-label="Filtres${nf?', '+nf+' actifs':''}">${grFiltreIco()}Filtres${nf?`<span class="vb-badge">${nf}</span>`:''}</button>
  </div>
  <div id="gr-res">${grResultats()}</div>
  ${GF.ouvert?grPanneau():''}`;
}

function grResultats(){
  const q=GF.q.trim();
  const lv=gNiveau();
  /* Avec une recherche, on cherche dans tous les niveaux. */
  const base=q?ordreProg():ordreProg().filter(g=>g.hsk===lv);
  const cnt={toutes:base.length,
    decouvrir:base.filter(g=>etatFiche(g.id)==='neuf').length,
    revoir:base.filter(g=>aRevoirFiche(g.id)).length,
    fragiles:base.filter(g=>etatFiche(g.id)==='frag').length};
  const P=[['toutes','Toutes'],['decouvrir','À découvrir'],['revoir','À revoir'],['fragiles','Fragiles']];
  const pills=`<div class="vb-pills gr-pills">${P.map(([k,l])=>`<button class="pill ${GF.pill===k?'on':''}" onclick="grPastille('${k}')">${l} · ${cnt[k]}</button>`).join('')}</div>`;
  const seg=`<div class="gr-seg" role="tablist">${[['ordre','Dans l’ordre'],['famille','Par famille']].map(([k,l])=>
    `<button role="tab" aria-selected="${GF.mode===k}" class="${GF.mode===k?'on':''}" onclick="grMode('${k}')">${l}</button>`).join('')}</div>`;
  if(GF.mode==='famille'&&!q)return pills+seg+grFamilles();
  return pills+seg+grChemin(base,lv,!!q);
}

function grChemin(base,lv,tous){
  const N=niveauxGram();
  const num=new Map();
  N.forEach(l=>ordreProg().filter(g=>g.hsk===l).forEach((g,i)=>num.set(g.id,i+1)));
  const L=base.filter(gPasse);
  const nx=ordreProg().filter(g=>g.hsk===lv).find(g=>etatFiche(g.id)==='neuf');
  const lvls=tous?`<div class="gr-lvl"><small>${pl2(L.length,'fiche')} dans tous les niveaux</small></div>`
    :`<div class="gr-lvl">${N.map(l=>`<button class="pill ${l===lv?'on':''}" onclick="grNiveau(${l})">HSK ${l}</button>`).join('')}
      <small>dans l’ordre du programme</small></div>`;
  const chip=GF.fam?`<button class="gr-chipf" onclick="grFamille('')">${esc(famOf(GF.fam).n)} <span aria-hidden="true">✕</span><span class="vb-sr">retirer ce filtre</span></button>`:'';
  if(!L.length)return lvls+chip+`<div class="void"><span class="em">空</span><p><b>Aucune fiche ne correspond</b></p>
    <p class="sm">Essayez un autre mot, en français ou en chinois, ou retirez un filtre.</p></div>`;
  return lvls+chip+`<div class="gr-path">${L.map(g=>{
    const e=etatFiche(g.id);
    const next=nx&&g.id===nx.id;
    return `<button class="gr-st${next?' next':''}" onclick="ouvrir('${g.id}')">
      ${gAnneau(ETATS[e].f,GCOUL[e],(tous?g.hsk+'·':'')+num.get(g.id))}
      <span class="tx"><b>${esc(g.title)}</b><small>${esc(famOf(g.fam).n)}${gEtiquette(g)}</small></span>
    </button>`;}).join('')}</div>`;
}

function grFamilles(){
  return `<div class="gr-fams">${FAM.map(f=>{
    const l=GRAMMAR.filter(g=>g.fam===f.k);
    if(!l.length)return '';
    const su=l.filter(g=>etatFiche(g.id)==='su').length;
    const p=Math.round(su/l.length*100);
    return `<button class="gr-fam" onclick="grFamille('${f.k}')">
      ${vague('gr-vagf-'+f.k,24,.35)}
      <span class="em" aria-hidden="true">${f.em}</span>
      ${gAnneau(p/100,'#1F4E9E',p+'\u00A0%','#D6E1F2')}
      <b>${esc(f.n)}</b><small>${pl2(l.length,'fiche')} · ${su} ${su>1?'sues':'sue'}</small>
    </button>`;}).join('')}</div>
  <p class="sm gr-note">Toucher une famille montre ses fiches, toujours dans l’ordre du programme.</p>`;
}

function grPanneau(){
  const anim=GF.anim;GF.anim=false;
  const lv=gNiveau(),q=GF.q.trim();
  const base=q?ordreProg():ordreProg().filter(g=>g.hsk===lv);
  const res=base.filter(gPasse).length;
  return `<button class="vb-veil" onclick="grFermerFiltres()" aria-label="Fermer les filtres"></button>
  <div class="vb-panel ${anim?'anim':''}" role="dialog" aria-label="Filtres">
    <div class="vb-grab"></div>
    <div class="vb-phead"><b>Filtres</b></div>
    <div class="vb-fsec"><h4>Famille</h4><div class="vb-opts">${FAM.map(f=>
      `<button class="vb-opt ${GF.fam===f.k?'on':''}" onclick="grFamilleP('${f.k}')">${esc(f.n)}<small>${GRAMMAR.filter(g=>g.fam===f.k).length}</small></button>`).join('')}</div></div>
    <div class="vb-fsec"><h4>Registre</h4>
      <button class="gr-sw" onclick="grOral()" role="switch" aria-checked="${GF.oral}">
        <span><b>Seulement les fiches centrées sur l’oral</b><small>Les reprises orales et les fiches où l’oral occupe plusieurs écrans. Chaque fiche a déjà son écran «\u00A0À l’oral\u00A0».</small></span>
        <span class="gr-tog ${GF.oral?'on':''}"><i></i></span></button></div>
    <div class="vb-fbar"><button class="vb-clear" onclick="grEffacer()">Tout effacer</button>
      <button class="btn" onclick="grFermerFiltres()">Voir ${pl2(res,'fiche')}</button></div>
  </div>`;
}

/* ---- Actions ---- */
function grChercher(v){GF.q=v;const r=document.getElementById('gr-res');if(r)r.innerHTML=grResultats();}
function grPastille(k){GF.pill=k;render();}
function grMode(k){GF.mode=k;render();}
function grNiveau(l){GF.lvl=l;render();}
function grFamille(k){GF.fam=k;GF.mode='ordre';render();}
function grFamilleP(k){GF.fam=GF.fam===k?'':k;render();}
function grOral(){GF.oral=!GF.oral;render();}
function grEffacer(){GF.fam='';GF.oral=false;render();}
function grOuvrirFiltres(){GF.ouvert=true;GF.anim=true;render();}
function grFermerFiltres(){GF.ouvert=false;render();}
/* En attendant le panneau de séance (lot 3) : la première fiche à
   revoir, dans l’ordre du programme, ou la prochaine à découvrir. */
function reviserGrammaire(){
  const R=ordreProg().filter(g=>aRevoirFiche(g.id));
  if(R.length)return lancerExos(R[0].id);
  const nx=prochaineFiche();
  if(nx)return ouvrir(nx.id);
  toast('Tout est à jour.');
}

/* Une fiche s’ouvre toujours sur sa première carte. */
function ouvrir(id){go('fiche',{g:id,c:0});}

/* Anciennes vues, gardées pour les liens : elles ouvrent l’accueil
   dans le bon réglage. */
function vIndex(){GF.mode='famille';GF.q='';view='home';return vGramHome();}
function vRevoir(){GF.pill='revoir';GF.mode='ordre';GF.q='';view='home';return vGramHome();}

/* =====================================================================
   2. LA FICHE EN CARTES (lot 2, maquette « GrammairePorcelaine »)

   Un bandeau, puis une carte par emploi qu’on fait glisser de droite à
   gauche, la carte du piège, et un récapitulatif qui mène aux
   exercices. Tout est tiré des données de la fiche : aucun contenu
   nouveau, aucune lecture inventée. Les animations sont générées :
   - la phrase qui se transforme (une transformation de la fiche dont la
     phrase de départ ou d’arrivée est un exemple de la carte) ;
   - le moule qui tourne (le gabarit le plus proche des exemples de la
     carte ; les listes liées sont tirées au même rang) ;
   - le piège qui se corrige (la phrase fautive devient la bonne) ;
   - le mot clé allumé (les caractères du titre et ceux que la carte met
     en gras).
   ===================================================================== */

const REGN={oral:'oral',ecrit:'écrit',poli:'poli',fam:'familière'};
function badgeReg(r){return r?`<span class="reg">${esc(REGN[r]||r)}</span>`:'';}

/* ---- Découpage d’une phrase en mots --------------------------------
   Plus long mot connu d’abord : WORDS, puis les éléments des listes et
   des cadres de la fiche. Le pinyin vient de la phrase elle-même, une
   syllabe par caractère : si le compte ne tombe pas juste, on renonce
   au découpage plutôt que de risquer un ton faux. */
const PONCT=/^[，。？！、；：“”‘’（）《》…—,.?!;:\s]+$/;
let DICO_W=null;
function dicoMots(){
  if(DICO_W)return DICO_W;
  DICO_W=new Map();
  DATA('WORDS').forEach(w=>{if(w.hz&&!DICO_W.has(w.hz))DICO_W.set(w.hz,w.id);});
  return DICO_W;
}
function dicoFiche(g){
  if(g._dico)return g._dico;
  const s=new Set();
  (g.gabarits||[]).forEach(ga=>{
    ga.cadre.forEach(t=>{if(t.h&&HAN_RE.test(t.h))s.add(t.h);});
    Object.values(ga.listes).forEach(l=>l.forEach(x=>{if(x.h&&HAN_RE.test(x.h))s.add(x.h);}));
  });
  (g.transfo||[]).forEach(t=>t.vers.seg.forEach(x=>{if(HAN_RE.test(x.h))s.add(x.h);}));
  Object.defineProperty(g,'_dico',{value:s,enumerable:false});
  return s;
}
function sylls(py){
  return String(py||'').split(/[\s,，.。?？!！;；:：、“”"«»…—]+/).filter(x=>/[a-zA-Zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]/.test(x));
}
function nbHan(s){return (String(s).match(/[\u3400-\u9fff]/g)||[]).length;}
/* hz + py → [{h,p,id}] ; null si le pinyin ne s’aligne pas. */
function decoupe(hz,py,g,prio){
  const sy=sylls(py);
  if(sy.length!==nbHan(hz))return null;
  const D=dicoMots(),F=g?dicoFiche(g):new Set(),P=prio||[];
  const out=[];let i=0,k=0;
  const chars=Array.from(hz);
  while(i<chars.length){
    const c=chars[i];
    if(!/[\u3400-\u9fff]/.test(c)){
      let j=i;while(j<chars.length&&!/[\u3400-\u9fff]/.test(chars[j]))j++;
      out.push({h:chars.slice(i,j).join(''),p:'',pon:1});i=j;continue;
    }
    let L=1;
    for(let n=Math.min(6,chars.length-i);n>1;n--){
      const m=chars.slice(i,i+n).join('');
      if(!/^[\u3400-\u9fff]+$/.test(m))continue;
      if(P.indexOf(m)>=0||D.has(m)||F.has(m)){L=n;break;}
    }
    const m=chars.slice(i,i+L).join('');
    out.push({h:m,p:sy.slice(k,k+L).join(' '),id:D.get(m)||''});
    i+=L;k+=L;
  }
  return out;
}

/* ---- Les mots clés ---- */
function hanRuns(s){return (String(s||'').match(/[\u3400-\u9fff]+/g)||[]);}
function clesFiche(g,st){
  const t=g.title.split(/\s:\s/);
  const zh=t.find(x=>HAN_RE.test(x))||'';
  const c=new Set(hanRuns(zh));
  if(st)(st.p||[]).forEach(p=>(p.match(/<b>([^<]*)<\/b>/g)||[]).forEach(b=>hanRuns(b).forEach(r=>c.add(r))));
  return c;
}
function estCle(tok,cles){
  if(!tok.h||tok.pon)return false;
  if(cles.has(tok.h))return true;
  for(const k of cles)if(k.length>1&&tok.h.indexOf(k)>=0)return true;
  return false;
}

/* ---- Un exemple : écouter, toucher un mot ---- */
const ICO_EAR='<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
const ICO_REJOUER='<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v5h5"/></svg>';
const ICO_TOURNE='<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M17 3l4 4-4 4"/><path d="M3 11V9a2 2 0 0 1 2-2h16"/><path d="M7 21l-4-4 4-4"/><path d="M21 13v2a2 2 0 0 1-2 2H3"/></svg>';
function motHtml(t,cles){
  if(t.pon)return `<span class="gr-w pon"><span class="h">${esc(t.h)}</span><span class="p">&nbsp;</span></span>`;
  const k=estCle(t,cles)?' k':'';
  const inner=`<span class="h">${esc(t.h)}</span><span class="p">${pinyin(t.p)}</span>`;
  return t.id
    ?`<button class="gr-w${k}" onclick="versMot('${jq(t.id)}')" aria-label="${esc(t.h)}\u202F: ouvrir sa fiche en Vocabulaire">${inner}</button>`
    :`<span class="gr-w${k}">${inner}</span>`;
}
function exCarte(e,g,cles){
  const toks=decoupe(e.hz,e.py,g);
  const corps=toks
    ?`<div class="gr-ws">${toks.map(t=>motHtml(t,cles)).join('')}</div>`
    :`<div class="hz">${esc(e.hz)}</div><div class="py">${pinyin(e.py)}</div>`;
  return `<div class="gr-ex">
    <button class="gr-ear" onclick="speak(${esc(JSON.stringify(e.hz))})" aria-label="Écouter">${ICO_EAR}</button>
    <div class="gr-exc">${corps}${badgeReg(e.reg)}
      <span class="fr">${esc(e.fr)}</span>${e.note?`<span class="nt">${esc(e.note)}</span>`:''}</div>
  </div>`;
}
/* Exemple en bloc simple (modèles des réemplois, dans les exercices). */
function exBloc(e){
  return `<div class="gex">
    <div class="hz">${esc(e.hz)}${badgeReg(e.reg)}</div>
    <div class="py">${pinyin(e.py)}</div>
    <div class="fr">${esc(e.fr)}</div>
    ${e.note?`<div class="note">${esc(e.note)}</div>`:''}
  </div>`;
}
function versMot(id){stopSpeech();location.href='vocabulaire.html?mot='+encodeURIComponent(id);}

/* ---- Animation 1 et 3 : une phrase qui devient une autre ----------
   A et B découpés en mots ; les mots communs (plus longue sous-suite
   commune) glissent de leur place dans A à leur place dans B ; ceux de
   A seulement sont barrés puis s’effacent ; ceux de B seulement
   apparaissent, allumés. Les positions sont mesurées au montage. */
function lcs(a,b){
  const n=a.length,m=b.length,T=Array.from({length:n+1},()=>new Array(m+1).fill(0));
  for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)T[i][j]=a[i].h===b[j].h?T[i+1][j+1]+1:Math.max(T[i+1][j],T[i][j+1]);
  const pairs=[];let i=0,j=0;
  while(i<n&&j<m){if(a[i].h===b[j].h){pairs.push([i,j]);i++;j++;}else if(T[i+1][j]>=T[i][j+1])i++;else j++;}
  return pairs;
}
/* Appariement : d’abord la sous-suite commune, puis les mots restants
   identiques (un mot qui change de place, comme l’objet devant 把). */
/* Un mot ne voyage que s’il garde la même lecture (un 不 ou un 一 qui
   change de ton selon son voisin n’est pas « le même mot » à l’écran). */
function memeMot(t,u){return t.h===u.h&&String(t.p).replace(/\s+/g,' ')===String(u.p).replace(/\s+/g,' ');}
function apparier(A,B){
  const pa=new Map(),pb=new Map();
  lcs(A,B).forEach(([i,j])=>{if(memeMot(A[i],B[j])){pa.set(i,j);pb.set(j,i);}});
  A.forEach((t,i)=>{if(pa.has(i)||t.pon)return;
    const j=B.findIndex((u,k)=>!pb.has(k)&&memeMot(t,u));if(j>=0){pa.set(i,j);pb.set(j,i);}});
  return {pa:pa,pb:pb};
}
function morphHtml(A,B,cles,mode){
  const {pa,pb}=apparier(A,B);
  const toks=[];
  A.forEach((t,i)=>{
    if(t.pon)return;
    const j=pa.has(i)?pa.get(i):-1;
    toks.push({t:t,a:i,b:j,cls:j<0?(mode==='piege'?'bad gone':'gone'):(estCle(t,cles)?'key':'')});
  });
  B.forEach((t,j)=>{
    if(t.pon||pb.has(j))return;
    toks.push({t:t,a:-1,b:j,cls:'new'+(mode==='piege'||estCle(t,cles)?' key':'')});
  });
  if(!toks.some(x=>x.a<0||x.b<0||x.a!==x.b))return '';
  return `<div class="gr-morph" data-na="${A.length}" data-nb="${B.length}">${toks.map(x=>
    `<span class="gr-tk ${x.cls}" data-a="${x.a}" data-b="${x.b}"><span class="h">${esc(x.t.h)}</span><span class="p">${pinyin(x.t.p)}</span></span>`).join('')}</div>`;
}
function segDe(seg){return seg.map(x=>({h:x.h,p:x.p,pon:!x.p&&!HAN_RE.test(x.h)?1:0}));}

function animTransfo(g,st,cles){
  const hzs=(st.ex||[]).map(e=>e.hz.replace(/[，。？！\s]/g,''));
  const net=s=>String(s).replace(/[，。？！\s]/g,'');
  const tr=(g.transfo||[]).find(t=>hzs.indexOf(net(t.de.hz))>=0||hzs.indexOf(net(t.vers.seg.map(x=>x.h).join('')))>=0);
  if(!tr)return '';
  const B=segDe(tr.vers.seg);
  const prio=B.filter(x=>!x.pon).map(x=>x.h);
  const A=decoupe(tr.de.hz,tr.de.py,g,prio);
  if(!A)return '';
  const m=morphHtml(A,B,cles,'transfo');
  if(!m)return '';
  return `<div class="gr-stage" data-anim="transfo">
    <span class="cap">${esc(tr.consigne)}</span>
    ${m}
    <div class="say"><span class="sa">${esc(tr.de.fr)}</span><span class="sb">${esc(tr.vers.fr)}</span></div>
    <button class="gr-replay" onclick="grRejouer(this)">${ICO_REJOUER}Rejouer</button>
  </div>`;
}

/* ---- Animation 2 : le moule ---- */
/* Le moule d’une carte : un gabarit du même registre, dont tous les
   mots fixes figurent dans les exemples de la carte, et dont au moins un
   est un mot clé de la carte (titre de la fiche ou gras de la carte). */
function gabaritDeCarte(g,st,pris,cles){
  const hz=(st.ex||[]).map(e=>e.hz).join('|');
  const oral=st.reg==='oral';
  let best=-1,score=0;
  (g.gabarits||[]).forEach((ga,k)=>{
    if(pris.has(k)||(ga.reg==='oral')!==oral)return;
    const fixes=ga.cadre.filter(t=>t.h&&HAN_RE.test(t.h));
    if(!fixes.length||!fixes.every(t=>hz.indexOf(t.h)>=0))return;
    if(!fixes.some(t=>estCle(t,cles)))return;
    const sc=fixes.length;
    if(sc>score){score=sc;best=k;}
  });
  return best;
}
function tirageMoule(ga,graine){
  const L=ga.listes,out={};
  let x=graine*9301+49297;
  const rnd=n=>{x=(x*9301+49297)%233280;return Math.floor(x/233280*n);};
  (ga.lie||[]).forEach(grp=>{const n=Math.min(...grp.map(k=>L[k].length));const r=rnd(n);grp.forEach(k=>out[k]=L[k][r]);});
  Object.keys(L).forEach(k=>{if(!out[k])out[k]=L[k][rnd(L[k].length)];});
  return out;
}
function mouleHtml(g,k,graine){
  const ga=g.gabarits[k],tir=tirageMoule(ga,graine);
  const slots=ga.cadre.filter(t=>!(t.h&&!t.p&&!HAN_RE.test(t.h)));
  return `<div class="gr-mould">${slots.map(t=>t.s
    ?`<div class="gr-slot var"><div class="in2"><span class="h">${esc(tir[t.s].h)}</span><span class="p">${pinyin(tir[t.s].p)}</span></div></div>`
    :`<div class="gr-slot ba"><span class="h">${esc(t.h)}</span><span class="p">${esc(t.p)}</span></div>`).join('')}</div>`;
}
function animMoule(g,c,k){
  const ga=g.gabarits[k];
  const graine=(ctx.moule&&ctx.moule[c])||1;
  return `<div class="gr-stage" data-anim="moule">
    <span class="cap">Le moule${ga.reg==='oral'?' · oral':''}</span>
    <div id="gr-moule-${c}">${mouleHtml(g,k,graine)}</div>
    <div class="say">Les cases pleines ne bougent pas\u202F; les cases en pointillé changent à chaque tour.</div>
    <button class="gr-replay" onclick="grTourner(${c},${k})">${ICO_TOURNE}Une autre phrase</button>
  </div>`;
}
function grTourner(c,k){
  const g=gById(ctx.g);if(!g)return;
  ctx.moule=ctx.moule||{};ctx.moule[c]=((ctx.moule[c]||1)+1);
  const el=document.getElementById('gr-moule-'+c);
  if(el)el.innerHTML=mouleHtml(g,k,ctx.moule[c]);
  grHauteur();
}

/* ---- Animation 3 : le piège qui se corrige ---- */
function animPiege(g){
  const p=g.piege;if(!p)return '';
  const B=decoupe(p.good.hz,p.good.py,g);
  if(!B)return '';
  const A=decoupe(p.bad.hz,p.bad.py,g,B.filter(x=>!x.pon).map(x=>x.h));
  if(!A)return '';
  const m=morphHtml(A,B,new Set(),'piege');
  if(!m)return '';
  return `<div class="gr-stage" data-anim="piege">
    <span class="cap">Ce que le français fait dire</span>
    ${m}
    <div class="say"><span class="sa verd no">✗ ${esc(p.bad.hz)}</span><span class="sb verd ok">✓ ${esc(p.good.hz)}</span></div>
    <button class="gr-replay" onclick="grRejouer(this)">${ICO_REJOUER}Rejouer</button>
  </div>`;
}

/* ---- Le filigrane d’une carte ---- */
function filigrane(g,st){
  if(st&&st.fil)return st.fil;
  if(st){
    for(const p of st.p||[]){const b=(p.match(/<b>([^<]*)<\/b>/g)||[]).map(x=>hanRuns(x)).flat();if(b.length)return Array.from(b[0])[0];}
    const r=hanRuns(st.t);if(r.length)return Array.from(r[0])[0];
  }
  const t=hanRuns(g.title);return t.length?Array.from(t[0])[0]:'文';
}

/* ---- Les cartes d’une fiche ---- */
function cartesFiche(g){
  const pris=new Set(),C=[];
  const n=g.steps.length;
  g.steps.forEach((st,i)=>{
    const cles=clesFiche(g,st);
    let anim=animTransfo(g,st,cles);
    if(!anim){const k=gabaritDeCarte(g,st,pris,cles);if(k>=0){pris.add(k);anim=animMoule(g,i,k);}}
    C.push({lab:st.t,fil:filigrane(g,st),html:`
      <span class="n">Emploi ${i+1} sur ${n}</span>
      <h2>${esc(st.t)}${badgeReg(st.reg)}</h2>
      ${anim}
      ${st.p.map(p=>`<p>${p}</p>`).join('')}
      <div class="gr-exs">${(st.ex||[]).map(e=>exCarte(e,g,cles)).join('')}</div>
      ${st.check?checkCarte(st.check,i):''}`});
  });
  if(g.piege)C.push({lab:'Le piège',fil:'坑',html:`
      <span class="n">Le piège du francophone</span>
      <h2>Ce qu’il ne faut pas dire</h2>
      ${animPiege(g)}
      <div class="gpiege">
        <div class="ln no">${esc(g.piege.bad.hz)}</div><div class="gpy">${pinyin(g.piege.bad.py)}</div>
        <div class="ln oui">${esc(g.piege.good.hz)}</div><div class="gpy">${pinyin(g.piege.good.py)}</div>
        <div class="why">${esc(g.piege.why)}</div>
      </div>`});
  const r=gRec(g.id);
  C.push({lab:'Récapitulatif',fil:'总',html:`
      <span class="n">Pour finir</span>
      <h2>Récapitulatif</h2>
      <div class="gres">${esc(g.resume)}</div>
      ${g.tableau?`<table class="gtab"><tr>${g.tableau.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>
        ${g.tableau.rows.map(rw=>`<tr>${rw.map(c=>`<td><div class="gc">${esc(c)}</div></td>`).join('')}</tr>`).join('')}</table>`:''}
      ${etudieeDans(g)}
      ${(g.voir||[]).length?`<div class="gsec gr-voir"><h3>Voir aussi</h3><div class="gvoir">
        ${g.voir.map(v=>{const o=gById(v);return o?`<button class="pill" onclick="ouvrir('${o.id}')">${esc(o.title)}</button>`:'';}).join('')}
      </div></div>`:''}
      <button class="btn" onclick="lancerExos('${g.id}')">M’entraîner sur cette fiche</button>
      ${r.essais?`<p class="sm mt">Déjà tentés ${r.essais} fois, meilleur score ${r.best}\u00A0%. Les phrases changent à chaque passage.</p>`:''}`});
  return C;
}

function checkCarte(c,i){
  const rep=(ctx.reps||{})[i];
  return `<div class="gchk">
    <div class="q">${esc(c.q)}</div>
    <div class="opts">${c.a.map((a,k)=>{
      let cl='';
      if(rep!=null)cl=k===c.ok?'ok':(k===rep?'no':'');
      return `<button class="opt ${HAN_RE.test(a)&&!/[a-zà-ÿ]{3}/i.test(a)?'han ':''}${cl}" ${rep!=null?'disabled':''} onclick="repCarte(${i},${k},${c.ok})">${esc(a)}</button>`;
    }).join('')}</div>
    ${rep!=null?`<div class="why">${esc(c.why)}</div>`:''}
  </div>`;
}
function repCarte(i,k,ok){ctx.reps=ctx.reps||{};ctx.reps[i]=k;beep(k===ok?'ok':'no');render();}

/* ---- Le bandeau ---- */
function bandeau(g,C){
  const lv=ordreProg().filter(x=>x.hsk===g.hsk);
  const rang=lv.findIndex(x=>x.id===g.id)+1;
  const L=DATA('LESSONS').find(l=>(g.th||[]).indexOf(l.theme)>=0&&l.hsk===g.hsk)
       ||DATA('LESSONS').find(l=>l.steps.some(s=>s.k==='gram'&&s.ref===g.id));
  const T=DATA('THEMES');
  return `<div class="gr-band">
    <svg class="gr-bvag" viewBox="0 0 200 130" aria-hidden="true" focusable="false"><defs><pattern id="gr-vagb" width="24" height="12" patternUnits="userSpaceOnUse"><path d="M0 12A12 12 0 0 1 24 12M4 12A8 8 0 0 1 20 12M8 12A4 4 0 0 1 16 12" fill="none" stroke="rgba(31,78,158,.16)" stroke-width="1.2"/></pattern><linearGradient id="gr-fdb" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><mask id="gr-mkb"><rect width="200" height="130" fill="url(#gr-fdb)"/></mask></defs><rect width="200" height="130" fill="url(#gr-vagb)" mask="url(#gr-mkb)"/></svg>
    <svg class="gr-hui" viewBox="0 0 390 12" preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false"><defs><pattern id="gr-huip" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M1 11V1H11V9H3V3H9V7H5" fill="none" stroke="#1F4E9E" stroke-width="1.4"/></pattern></defs><rect width="390" height="12" fill="url(#gr-huip)"/></svg>
    <span class="wm" id="gr-wm" aria-hidden="true">${esc(C[ctx.c||0].fil)}</span>
    <div class="top">
      <button class="x" aria-label="Fermer la fiche" onclick="back()"><svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <span class="kick">HSK ${g.hsk} · ${esc(famOf(g.fam).n)} · fiche ${rang} sur ${lv.length}</span>
    </div>
    <h1>${esc(g.title)}</h1>
    <div class="meta">${gEtiquette(g)}
      ${L?`<button class="lk" onclick="versLecon('${jq(L.id)}')">Leçon du thème ${esc((T.find(t=>t.id===L.theme)||{}).n||L.theme)} ›</button>`:''}</div>
  </div>`;
}

/* ---- La vue ---- */
function vFiche(){
  const g=gById(ctx.g); if(!g)return vGramHome();
  const C=cartesFiche(g);
  const c=Math.max(0,Math.min(C.length-1,ctx.c||0));ctx.c=c;
  if(c===C.length-1)marquerVue(g.id);
  return `${bandeau(g,C)}
  ${ribbon()}
  <div class="gr-nav">
    <button class="ar" aria-label="Carte précédente" onclick="grCarte(${c-1})" ${c===0?'disabled':''}><svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
    <div><div class="gr-dots">${C.map((x,k)=>`<button class="${k===c?'on':''}" aria-label="${esc(x.lab)}" aria-current="${k===c}" onclick="grCarte(${k})"></button>`).join('')}</div>
      <span class="lab" id="gr-lab">${esc(C[c].lab)}</span></div>
    <button class="ar" aria-label="Carte suivante" onclick="grCarte(${c+1})" ${c===C.length-1?'disabled':''}><svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
  </div>
  <div class="gr-view" id="gr-view">
    <div class="gr-track" id="gr-track" style="transform:translateX(${-c*100}%)">
      ${C.map((x,k)=>`<section class="gr-slide${k===c?' on':''}" aria-hidden="${k!==c}"><div class="gr-kc">
        <span class="fil" aria-hidden="true">${esc(x.fil)}</span>${x.html}</div></section>`).join('')}
    </div>
  </div>`;
}
function marquerVue(id){const r=gRec(id);if(!r.vu){r.vu=1;save();}}
/* Changer de carte sans tout redessiner : la piste glisse. */
function grCarte(k){
  const g=gById(ctx.g);if(!g)return;
  const C=cartesFiche(g);
  k=Math.max(0,Math.min(C.length-1,k));
  if(k===ctx.c)return;
  ctx.c=k;
  if(k===C.length-1)marquerVue(g.id);
  const tr=document.getElementById('gr-track');
  if(!tr){render();return;}
  tr.style.transform='translateX('+(-k*100)+'%)';
  document.querySelectorAll('.gr-slide').forEach((s,i)=>{s.classList.toggle('on',i===k);s.setAttribute('aria-hidden',String(i!==k));});
  document.querySelectorAll('.gr-dots button').forEach((b,i)=>{b.classList.toggle('on',i===k);b.setAttribute('aria-current',String(i===k));});
  const ars=document.querySelectorAll('.gr-nav .ar');
  if(ars[0])ars[0].disabled=k===0;
  if(ars[1])ars[1].disabled=k===C.length-1;
  const lab=document.getElementById('gr-lab');if(lab)lab.textContent=C[k].lab;
  const wm=document.getElementById('gr-wm');if(wm)wm.textContent=C[k].fil;
  stopSpeech();
  grHauteur();
  grMorphs();
  const v=document.getElementById('gr-view');
  if(v&&v.getBoundingClientRect().top<0)v.scrollIntoView({block:'start',behavior:'smooth'});
}

/* La piste a la hauteur de la carte visible. */
function grHauteur(){
  const v=document.getElementById('gr-view');if(!v)return;
  const s=v.querySelector('.gr-slide.on');if(!s)return;
  v.style.height=s.offsetHeight+'px';
}

/* Glisser du doigt ou de la souris : le geste doit être plus horizontal
   que vertical, et dépasser 50 px. */
function grGlisser(){
  const v=document.getElementById('gr-view');if(!v||v._gl)return;
  v._gl=1;
  let x0=null,y0=null;
  v.addEventListener('pointerdown',e=>{x0=e.clientX;y0=e.clientY;});
  v.addEventListener('pointerup',e=>{
    if(x0==null)return;
    const dx=e.clientX-x0,dy=e.clientY-y0;x0=null;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3)grCarte((ctx.c||0)+(dx<0?1:-1));
  });
  v.addEventListener('pointercancel',()=>{x0=null;});
}

/* ---- Les animations : placement mesuré, puis va-et-vient ---- */
const GR_MOINS=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function grPlacer(m){
  const tk=Array.from(m.querySelectorAll('.gr-tk'));
  if(!tk.length)return;
  const gap=6,W=tk.map(t=>t.offsetWidth||t.textContent.length*14);
  const pos=(cle)=>{
    const ordre=tk.map((t,i)=>({i:i,r:+t.dataset[cle]})).filter(o=>o.r>=0).sort((a,b)=>a.r-b.r);
    let x=0;const P={};
    ordre.forEach(o=>{P[o.i]=x;x+=W[o.i]+gap;});
    return {P:P,L:Math.max(0,x-gap)};
  };
  const A=pos('a'),B=pos('b');
  const L=Math.max(A.L,B.L);
  tk.forEach((t,i)=>{
    const xa=A.P[i]!=null?A.P[i]:B.P[i],xb=B.P[i]!=null?B.P[i]:A.P[i];
    t.style.setProperty('--xa',(xa+(L-A.L)/2)+'px');
    t.style.setProperty('--xb',(xb+(L-B.L)/2)+'px');
  });
  const dispo=(m.parentNode&&m.parentNode.clientWidth)||300;
  const k=Math.min(1,(dispo-8)/Math.max(1,L));
  m.style.width=L+'px';
  m.style.transform=k<1?`scale(${k.toFixed(3)})`:'';
  m.style.marginBottom=k<1?(-(1-k)*m.offsetHeight)+'px':'';
  m.classList.add('pret');
}
function grMorphs(){
  document.querySelectorAll('.gr-morph').forEach(m=>{if(!m.classList.contains('pret'))grPlacer(m);});
}
function grRejouer(b){
  const st=b.closest('.gr-stage');if(!st)return;
  st.classList.remove('ph');void st.offsetWidth;
  setTimeout(()=>st.classList.add('ph'),700);
}
let GR_TIC=null;
function grTic(){
  if(GR_TIC)return;
  GR_TIC=setInterval(()=>{
    if(view!=='fiche'){clearInterval(GR_TIC);GR_TIC=null;return;}
    if(GR_MOINS)return;
    const s=document.querySelector('.gr-slide.on');if(!s)return;
    s.querySelectorAll('.gr-stage[data-anim="transfo"],.gr-stage[data-anim="piege"]').forEach(st=>st.classList.toggle('ph'));
  },2600);
}
function grMonter(){
  if(view!=='fiche')return;
  grGlisser();grMorphs();
  if(GR_MOINS)document.querySelectorAll('.gr-stage').forEach(st=>st.classList.add('ph'));
  grHauteur();
  setTimeout(grHauteur,400);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{
    document.querySelectorAll('.gr-morph').forEach(m=>{m.classList.remove('pret');grPlacer(m);});grHauteur();});
  grTic();
}
addEventListener('resize',()=>{if(view==='fiche'){document.querySelectorAll('.gr-morph').forEach(m=>{m.classList.remove('pret');grPlacer(m);});grHauteur();}});

/* Ancienne découverte pas à pas : elle ouvre la fiche à la bonne carte. */
function vDecouv(){
  const g=gById(ctx.g);if(!g)return vGramHome();
  view='fiche';ctx.c=Math.min(ctx.i||0,g.steps.length);
  return vFiche();
}

/* « Étudiée dans… » : la leçon de chaque thème de la fiche, à son
   niveau. Tant que l’écran de leçon n’est pas refait, on la nomme
   « Leçon du thème X » ; si elle n’existe pas encore, on le dit. Une
   leçon qui appelle la fiche hors de ses thèmes s’ajoute à la liste. */
function etudieeDans(g){
  const L=DATA('LESSONS'),T=DATA('THEMES');
  const nomTh=id=>(T.find(t=>t.id===id)||{}).n||id;
  const vus={},items=[];
  (g.th||[]).forEach(th=>{
    const l=L.find(x=>x.theme===th&&x.hsk===g.hsk);
    if(l)vus[l.id]=1;
    items.push({l:l,th:th});
  });
  L.filter(l=>!vus[l.id]&&l.steps.some(s=>s.k==='gram'&&s.ref===g.id)).forEach(l=>items.push({l:l,th:l.theme}));
  if(!items.length)return '';
  return `<div class="gsec gr-etudiee"><h3>Étudiée dans…</h3>${items.map(o=>o.l
    ?`<button class="gr-lesson" onclick="versLecon('${jq(o.l.id)}')"><span class="sl" aria-hidden="true">课</span>
       <span><b>Leçon du thème ${esc(nomTh(o.th))}</b><small>HSK ${o.l.hsk}</small></span></button>`
    :`<div class="gr-lesson off"><span class="sl" aria-hidden="true">课</span>
       <span><b>Leçon du thème ${esc(nomTh(o.th))}</b><small>HSK ${g.hsk} · pas encore écrite</small></span></div>`).join('')}</div>`;
}
function versLecon(id){stopSpeech();location.href='parcours.html?l='+encodeURIComponent(id);}

/* =====================================================================
   4. EXERCICES DE SYSTÉMATISATION
   Six familles, du plus guidé au plus libre. Une session tire au sort
   dans les banques de la fiche : le fonctionnement ne change pas, les
   phrases si.
   ===================================================================== */
/* Un gabarit engendre une phrase en tirant un élément dans chacune de
   ses listes. Tant que les listes sont indépendantes — un verbe d'un
   côté, un adverbe de l'autre — le tirage libre produit tôt ou tard des
   phrases syntaxiquement justes mais absurdes (我汉字唱得不好).
   Le champ « lie » règle cela : il déclare des groupes de listes tirées
   au même index, donc appariées ligne à ligne. Les listes d'un même
   groupe doivent avoir la même longueur ; par sécurité on se cale sur la
   plus courte. Les listes hors groupe gardent le tirage libre. */
function fillGabarit(ga){
  const acc={}, lie={};
  (ga.lie||[]).forEach(grp=>{
    const n=Math.min.apply(null,grp.map(k=>(ga.listes[k]||[]).length));
    if(!n)return;
    const i=Math.floor(Math.random()*n);
    grp.forEach(k=>{acc[k]=ga.listes[k][i];lie[k]=1;});
  });
  Object.keys(ga.listes).forEach(k=>{if(!lie[k])acc[k]=shuffle(ga.listes[k])[0];});
  /* Le registre d’une phrase engendrée est celui du gabarit, ou celui
     du premier élément tiré qui en porte un : une liste peut mêler une
     forme orale à des formes neutres. */
  let reg=ga.reg||'';
  if(!reg)Object.keys(acc).forEach(k=>{if(!reg&&acc[k]&&acc[k].reg)reg=acc[k].reg;});
  return {seg:ga.cadre.map(t=>t.s?acc[t.s]:t),fr:ga.fr,reg:reg,
          mots:Object.keys(ga.listes).map(k=>acc[k].fr)};
}

function buildSession(g){
  const q=[], b=shuffle(g.banque);
  b.slice(0,2).forEach(s=>q.push({t:'rep',s}));
  shuffle(g.gabarits).slice(0,3).forEach(ga=>q.push({t:'sub',d:fillGabarit(ga)}));
  b.slice(2,4).forEach(s=>q.push({t:'comp',s,g:g}));
  shuffle(g.transfo).slice(0,2).forEach(t=>q.push({t:'tra',d:t}));
  shuffle(g.fixes).slice(0,2).forEach(f=>q.push({t:'fix',d:f}));
  q.push({t:'reu',d:shuffle(g.reemploi)[0]});
  return q;
}
function lancerExos(id){
  const g=gById(id);
  go('exos',{g:id,q:buildSession(g),i:0,res:[],pose:[],rep:null,from:ctx.from});
}

const NOMFAM={rep:'Repérage',sub:'Substitution',comp:'Complétion',
              tra:'Transformation',fix:'改错 — corriger la faute',reu:'Réemploi'};

function vExos(){
  const g=gById(ctx.g); if(!g)return vGramHome();
  if(ctx.i>=ctx.q.length)return vBilanExos(g);
  const q=ctx.q[ctx.i];
  const corps={rep:exRep,sub:exSub,comp:exComp,tra:exTra,fix:exFix,reu:exReu}[q.t];
  return `${header(g.title,'Exercices — '+(ctx.i+1)+' sur '+ctx.q.length)}
  <div class="qprog">${ctx.q.map((_,k)=>{
    const r=ctx.res[k];
    return `<i class="${r===1?'ok':(r===0?'no':'')}"></i>`;
  }).join('')}</div>
  <div class="gconsigne">${esc(NOMFAM[q.t])}</div>
  ${corps(q,g)}`;
}

function suite(){
  ctx.i++; ctx.rep=null; ctx.pose=[]; render(); scrollTo(0,0);
}
function noter(bon){
  ctx.res[ctx.i]=bon?1:0; beep(bon?'ok':'no'); render();
}
function boutonSuite(){
  return `<button class="btn mt" onclick="suite()">${ctx.i+1<ctx.q.length?'Question suivante':'Voir le bilan'}</button>`;
}

/* --- Repérage : toucher le mot qui porte la structure --- */
function exRep(q){
  const fait=ctx.res[ctx.i]!=null;
  return `<p>Touchez l’élément qui porte la structure étudiée.</p>
  <div class="tiles">${q.s.seg.map((t,k)=>{
    let cl='';
    if(fait)cl=k===q.s.cle?'bon':(k===ctx.rep?'mauvais':'');
    return t.p?`<button class="tile tok ${cl}" ${fait?'disabled':''} onclick="repRep(${k},${q.s.cle})">${esc(t.h)}</button>`
              :`<span class="u-bc-transparent u-bs-none tile">${esc(t.h)}</span>`;
  }).join('')}</div>
  <p class="sm mt">${esc(q.s.fr)}${badgeReg(q.s.reg)}</p>
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'Bien vu.':'L’élément attendu était '+esc(q.s.seg[q.s.cle].h)+'.'}
    <div class="gpy mt">${pinyin(segPy(q.s.seg))}</div></div>${boutonSuite()}`:''}`;
}
function repRep(k,cle){ctx.rep=k;noter(k===cle);}

/* --- Substitution : reconstruire la phrase engendrée par le gabarit --- */
function exSub(q){
  return assemblage(segMots(q.d.seg),q.d.seg,
    `Construisez la phrase : <b>${esc(q.d.fr)}</b>${badgeReg(q.d.reg)}${q.d.mots.length?' <span class="sm">('+q.d.mots.map(esc).join(', ')+')</span>':''}`);
}

/* --- Transformation : réécrire la phrase selon la consigne --- */
function exTra(q){
  return `<div class="gex"><div class="hz">${esc(q.d.de.hz)}</div>
    <div class="py">${pinyin(q.d.de.py)}</div><div class="fr">${esc(q.d.de.fr)}</div></div>
  ${assemblage(segMots(q.d.vers.seg),q.d.vers.seg,esc(q.d.consigne))}`;
}

/* Moteur commun aux deux : on pose des étiquettes dans l’ordre. */
function assemblage(mots,seg,consigne){
  const fait=ctx.res[ctx.i]!=null;
  ctx.melange=ctx.melange||{};
  if(!ctx.melange[ctx.i])ctx.melange[ctx.i]=shuffle(mots.map((m,k)=>({m,k})));
  const bac=ctx.pose||[];
  const reste=ctx.melange[ctx.i].filter(x=>!bac.some(y=>y.k===x.k));
  return `<p>${consigne}</p>
  <div class="drop">${bac.length?bac.map((x,p)=>
    `<button class="tile" ${fait?'disabled':''} onclick="retirer(${p})">${esc(x.m.h)}</button>`).join(''):
    '<span class="u-c-line2 sm">Touchez les étiquettes ci-dessous</span>'}</div>
  <div class="tiles mt">${reste.map(x=>
    `<button class="tile" ${fait?'disabled':''} onclick="poser(${x.k})">${esc(x.m.h)}</button>`).join('')}</div>
  ${!fait&&bac.length===mots.length?`<button class="btn mt" onclick="verifAssemblage()">Vérifier</button>`:''}
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'Exact.':'La phrase attendue était :'}
    <div class="u-tx2 hz mt">${esc(segHz(seg))}</div>
    <div class="gpy">${pinyin(segPy(seg))}</div></div>${boutonSuite()}`:''}`;
}
function poser(k){
  const src=ctx.melange[ctx.i].find(x=>x.k===k);
  ctx.pose=(ctx.pose||[]).concat([src]); render();
}
function retirer(p){ctx.pose.splice(p,1);render();}
function verifAssemblage(){
  const q=ctx.q[ctx.i];
  const seg=q.t==='sub'?q.d.seg:q.d.vers.seg;
  const attendu=segMots(seg).map(t=>t.h).join('');
  noter(ctx.pose.map(x=>x.m.h).join('')===attendu);
}

/* Deux formes de registres différents ne s’opposent pas : 什么 et 啥
   conviennent tous deux, 很好 et 挺好的 aussi. Proposer l’une comme
   leurre de l’autre reviendrait à compter fausse une réponse juste. Le
   champ « equiv » d’une fiche déclare ces classes, et l’on retire de la
   liste des leurres toute forme de la même classe que la bonne réponse.
   Sans « equiv », la classe se réduit à la bonne réponse elle-même et le
   comportement reste celui d’avant. */
function classeEquiv(g,x){
  const c=(g.equiv||[]).find(a=>a.indexOf(x)>=0);
  return c?c.slice():[x];
}

/* --- Complétion : replacer l’outil manquant --- */
function exComp(q,g){
  const fait=ctx.res[ctx.i]!=null;
  const bon=q.s.seg[q.s.cle].h;
  ctx.choix=ctx.choix||{};
  if(!ctx.choix[ctx.i]){
    const exclus=classeEquiv(g,bon);
    const autres=shuffle((g.leurres||[]).filter(x=>exclus.indexOf(x)<0)).slice(0,3);
    ctx.choix[ctx.i]=shuffle(autres.concat([bon]));
  }
  const opts=ctx.choix[ctx.i];
  return `<p>Complétez la phrase.</p>
  <div class="u-tx3 u-fw-700 u-lh-16 sentence">
    ${q.s.seg.map((t,k)=>k===q.s.cle
      ?`<span class="u-bb-3-solid-gold u-ph4">${fait?esc(bon):'&nbsp;'}</span>`
      :esc(t.h)).join('')}
  </div>
  <p class="sm">${esc(q.s.fr)}${badgeReg(q.s.reg)}</p>
  <div class="opts mt">${opts.map(o=>{
    let cl='';
    if(fait)cl=o===bon?'ok':(o===ctx.rep?'no':'');
    return `<button class="opt han ${cl}" ${fait?'disabled':''} onclick="repComp('${jq(o)}','${jq(bon)}')">${esc(o)}</button>`;
  }).join('')}</div>
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    <div class="gpy">${pinyin(segPy(q.s.seg))}</div></div>${boutonSuite()}`:''}`;
}
function repComp(o,bon){ctx.rep=o;noter(o===bon);}

/* --- 改错 : repérer puis corriger --- */
function exFix(q){
  const fait=ctx.res[ctx.i]!=null;
  return `<p>Cette phrase contient une faute. Touchez l’élément fautif.</p>
  <div class="tiles">${q.d.seg.map((t,k)=>{
    let cl='';
    if(fait&&k===q.d.bad)cl='mauvais';
    return t.p?`<button class="tile tok ${cl}" ${fait?'disabled':''} onclick="repFix(${k},${q.d.bad})">${esc(t.h)}</button>`
              :`<span class="u-bc-transparent u-bs-none tile">${esc(t.h)}</span>`;
  }).join('')}</div>
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'C’est bien là que ça coince.':'La faute portait sur '+esc(q.d.seg[q.d.bad].h)+'.'}
    <div class="u-tx2 u-c-jade-d hz mt">${esc(q.d.bon)}</div>
    <div class="sm mt">${esc(q.d.why)}</div></div>${boutonSuite()}`:''}`;
}
function repFix(k,bad){ctx.rep=k;noter(k===bad);}

/* --- Réemploi : réponse libre, contrôle de la structure --- */
function exReu(q){
  const fait=ctx.res[ctx.i]!=null;
  const r=q.d;
  return `<p>${esc(r.q)}</p>
  <textarea class="gta" id="reu" ${fait?'disabled':''} placeholder="Écrivez en caractères…">${esc(ctx.txt||'')}</textarea>
  ${!fait?`<button class="btn mt" onclick="verifReu()">Vérifier</button>`:''}
  ${fait?blocReu(r):''}`;
}
function verifReu(){
  const el=document.getElementById('reu');
  const txt=(el&&el.value||'').trim();
  ctx.txt=txt;
  const r=ctx.q[ctx.i].d;
  const t=normZh(txt);
  const manques=[];
  (r.verif||[]).forEach(v=>{
    if(v.type==='contient'&&t.indexOf(normZh(v.v))<0)manques.push(v.msg);
    if(v.type==='absent'&&t.indexOf(normZh(v.v))>=0)manques.push(v.msg);
    if(v.type==='finit'&&!new RegExp(normZh(v.v)+'$').test(t))manques.push(v.msg);
    if(v.type==='un_parmi'&&!v.v.some(x=>t.indexOf(normZh(x))>=0))manques.push(v.msg);
  });
  ctx.manques=manques;
  noter(txt.length>0&&!manques.length);
}
function blocReu(r){
  const m=ctx.manques||[];
  return `<div class="verdict ${m.length?'no':'ok'}">
    ${m.length?'<b>La structure n’y est pas encore :</b><br>'+m.map(esc).join('<br>')
              :'La structure étudiée est bien employée.'}
  </div>
  <div class="gsec">
    <h3>Réponses possibles</h3>
    <p class="sm">Il existe presque toujours plusieurs façons de dire la même chose. Ces modèles ne sont pas <i>la</i> réponse : comparez la vôtre point par point avec les critères qui suivent.</p>
    ${r.modeles.map(exBloc).join('')}
    <h3 class="u-mt4">À vérifier dans votre phrase</h3>
    <ul class="gcrit">${r.criteres.map(c=>`<li>${esc(c)}</li>`).join('')}</ul>
  </div>
  ${boutonSuite()}`;
}

/* --- Bilan de session : c’est lui qui note la fiche --- */
function vBilanExos(g){
  const n=ctx.q.length, ok=ctx.res.filter(x=>x===1).length;
  const pct=Math.round(ok/n*100);
  const reussi=pct>=75;
  if(!ctx.note){
    ctx.note=1;
    const r=gRec(g.id); r.essais++; r.best=Math.max(r.best,pct); r.vu=1;
    grade(g.id,reussi?2:0);
    save();
  }
  return `${header('Bilan',g.title)}
  <div class="score"><b>${pct} %</b><span>${ok} sur ${n}</span></div>
  <div class="verdict ${reussi?'ok':'no'}">
    ${reussi?`Fiche validée. Elle reviendra le moment venu, pour vérifier qu’elle tient.`
            :'Sous 75\u00A0%\u202F: la fiche reviendra bientôt, avec la pastille «\u00A0À revoir\u00A0».'}
  </div>
  <button class="btn" onclick="lancerExos('${g.id}')">Refaire, avec d’autres phrases</button>
  <button class="btn pale mt" onclick="go('fiche',{g:'${g.id}'})">Retourner à la fiche</button>
  <button class="btn pale mt" onclick="tab('home')">Revenir à l’accueil</button>`;
}
