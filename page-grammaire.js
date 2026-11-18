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

/* Une fiche jamais ouverte commence par la découverte ; ensuite, on
   arrive directement sur la fiche complète, qui sert de référence. */
function ouvrir(id){
  const r=gRec(id);
  if(r.vu)go('fiche',{g:id});
  else go('decouv',{g:id,i:0});
}

/* Anciennes vues, gardées pour les liens : elles ouvrent l’accueil
   dans le bon réglage. */
function vIndex(){GF.mode='famille';GF.q='';view='home';return vGramHome();}
function vRevoir(){GF.pill='revoir';GF.mode='ordre';GF.q='';view='home';return vGramHome();}

/* =====================================================================
   2. DÉCOUVERTE — un emploi par écran
   ===================================================================== */
function vDecouv(){
  const g=gById(ctx.g); if(!g)return vGramHome();
  const n=g.steps.length, i=ctx.i||0;

  /* Dernier écran : le piège, puis le déverrouillage de la fiche. */
  if(i>=n)return ecranPiege(g);

  const st=g.steps[i];
  const rep=ctx.rep;
  return `${header(g.title,'Découverte — '+(i+1)+' sur '+(n+1))}
  ${ribbon()}
  <div class="gprog">${Array.from({length:n+1},(_,k)=>`<i class="${k<=i?'on':''}"></i>`).join('')}</div>
  ${i===0?`<div class="gres">${esc(g.resume)}</div>`:''}

  <div class="gsec">
    <h3>${esc(st.t)}${badgeReg(st.reg)}</h3>
    ${st.p.map(p=>`<p>${p}</p>`).join('')}
    ${(st.ex||[]).map(exBloc).join('')}
  </div>

  ${st.check?blocCheck(st.check,rep):''}

  ${(!st.check||rep!=null)?`<button class="btn" onclick="etapeSuivante()">${i+1<n?'Emploi suivant':'Dernier point'}</button>`:''}
  <button class="btn pale mt" onclick="go('fiche',{g:'${g.id}'})">Voir la fiche complète tout de suite</button>`;
}

/* Pastille de registre. Un contenu porte « reg » quand il relève d’un
   registre particulier : reg:'oral' pour ce qui se dit couramment mais
   ne s’écrit pas en langue soutenue. La pastille n’est qu’un repère
   d’usage : la forme reste enseignée, exigée et évaluée comme les autres. */
const REGN={oral:'oral',ecrit:'écrit',poli:'poli',fam:'familière'};
function badgeReg(r){return r?`<span class="reg">${esc(REGN[r]||r)}</span>`:'';}

function exBloc(e){
  return `<div class="gex">
    <div class="hz">${esc(e.hz)}${badgeReg(e.reg)}</div>
    <div class="py">${pinyin(e.py)}</div>
    <div class="fr">${esc(e.fr)}</div>
    ${e.note?`<div class="note">${esc(e.note)}</div>`:''}
  </div>`;
}

function blocCheck(c,rep){
  return `<div class="gchk">
    <div class="q">${esc(c.q)}</div>
    <div class="opts">${c.a.map((a,k)=>{
      let cl='';
      if(rep!=null)cl=k===c.ok?'ok':(k===rep?'no':'');
      return `<button class="opt han ${cl}" ${rep!=null?'disabled':''} onclick="repCheck(${k},${c.ok})">${esc(a)}</button>`;
    }).join('')}</div>
    ${rep!=null?`<div class="why">${esc(c.why)}</div>`:''}
  </div>`;
}
function repCheck(k,ok){
  ctx.rep=k; beep(k===ok?'ok':'no'); render();
}
function etapeSuivante(){
  ctx.i=(ctx.i||0)+1; ctx.rep=null; render(); scrollTo(0,0);
}

function ecranPiege(g){
  const n=g.steps.length;
  return `${header(g.title,'Découverte — '+(n+1)+' sur '+(n+1))}
  ${ribbon()}
  <div class="gprog">${Array.from({length:n+1},()=>`<i class="on"></i>`).join('')}</div>
  ${blocPiege(g)}
  <button class="btn" onclick="finirDecouverte('${g.id}')">J’ai compris — ouvrir la fiche</button>`;
}
function blocPiege(g){
  if(!g.piege)return '';
  return `<div class="gpiege">
    <div class="lb">Le piège du francophone</div>
    <div class="ln no">${esc(g.piege.bad.hz)}</div>
    <div class="gpy">${pinyin(g.piege.bad.py)}</div>
    <div class="ln oui">${esc(g.piege.good.hz)}</div>
    <div class="gpy">${pinyin(g.piege.good.py)}</div>
    <div class="why">${esc(g.piege.why)}</div>
  </div>`;
}
function finirDecouverte(id){
  const r=gRec(id); r.vu=1; save();
  view='fiche'; ctx={g:id,from:ctx.from}; render(); scrollTo(0,0);
}

/* =====================================================================
   3. FICHE COMPLÈTE — la page de référence, d’un seul tenant
   ===================================================================== */
function vFiche(){
  const g=gById(ctx.g); if(!g)return vGramHome();
  const f=famOf(g.fam), r=gRec(g.id);
  return `${header(g.title,'HSK '+g.hsk+' · '+f.n)}
  ${ribbon()}
  <div class="gres">${esc(g.resume)}</div>

  ${g.steps.map(st=>`<div class="gsec">
    <h3>${esc(st.t)}${badgeReg(st.reg)}</h3>
    ${st.p.map(p=>`<p>${p}</p>`).join('')}
    ${(st.ex||[]).map(exBloc).join('')}
  </div>`).join('')}

  ${g.tableau?`<div class="gsec">
    <h3>Récapitulatif</h3>
    <table class="gtab"><tr>${g.tableau.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>
    ${g.tableau.rows.map(rw=>`<tr>${rw.map(c=>`<td><div class="gc">${esc(c)}</div></td>`).join('')}</tr>`).join('')}
    </table></div>`:''}

  ${blocPiege(g)}

  ${etudieeDans(g)}

  ${(g.voir||[]).length?`<div class="gsec"><h3>Voir aussi</h3><div class="gvoir">
    ${g.voir.map(v=>{const o=gById(v);return o?`<button class="pill" onclick="ouvrir('${o.id}')">${esc(o.title)}</button>`:'';}).join('')}
  </div></div>`:''}

  <button class="btn" onclick="lancerExos('${g.id}')">
    ${r.essais?'Refaire les exercices':'Passer aux exercices'}
  </button>
  ${r.essais?`<p class="sm mt">Déjà tentés ${r.essais} fois, meilleur score ${r.best} %. Les phrases changent à chaque passage.</p>`:''}
  <button class="btn pale mt" onclick="go('decouv',{g:'${g.id}',i:0})">Revoir la découverte pas à pas</button>`;
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
