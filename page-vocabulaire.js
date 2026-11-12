/* =====================================================================
   page-vocabulaire.js — l’écran Vocabulaire.

   Refonte de novembre 2026 (maquette « Vocabulaire » du canevas) :
     · l’accueil : carte du jour, recherche, pastilles, panneau Filtres,
       grille des thèmes avec leurs anneaux ;
     · l’écran d’un thème : grand anneau, niveaux, quatre regroupements ;
     · la fiche d’un mot : zone rouge laque, pinyin cerclé, dessin des
       tons, API, Écouter / Dire / Tracer, puis le détail ;
     · le tracé d’un mot.
   Les boîtes de Leitner restent invisibles : on ne montre que l’état.
   La séance (épreuves par palier) est inchangée, plus bas.
   ===================================================================== */

/* « À revoir » : ce qui entre dans la prochaine séance, c’est-à-dire
   l’échéance passée, ou le mot rencontré mais jamais présenté. */
function aRevoir(w){return due(w.id);}
/* Un mot du carnet (étoile du Traducteur) ou venu du Traducteur. */
function trouvaille(w){return !!favFind(w.id)||(w.src||[]).indexOf('trad')>=0;}
function origines(w){
  const o=(w.src||[]).slice();
  if(favFind(w.id)&&o.indexOf('trad')<0)o.push('trad');
  return o;
}

/* Tous les mots de l’écran : les mots rencontrés et le carnet. Un favori
   identique à un mot du corpus n’est pas montré deux fois. */
function motsVocab(){
  const W=motsActifs();
  const vus=new Set(W.map(w=>w.hz+'|'+w.fr));
  return W.concat(favPool().filter(f=>!vus.has(f.hz+'|'+f.fr)));
}

function pl(n,s,p){return n+' '+(n>1?(p||s+'s'):s);}
function listeEt(l){return l.length>1?l.slice(0,-1).join(', ')+' et '+l[l.length-1]:(l[0]||'');}
function sansAccent(s){return String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();}

/* ---- Natures, caractères ------------------------------------------ */
const NATURES={
  nom:['nom','Noms'],verbe:['verbe','Verbes'],adj:['adjectif','Adjectifs'],adv:['adverbe','Adverbes'],
  expr:['expression','Expressions'],pron:['pronom','Pronoms'],num:['nombre','Nombres'],
  cl:['classificateur','Classificateurs'],part:['particule','Particules'],prep:['préposition','Prépositions'],
  conj:['conjonction','Conjonctions'],loc:['localisateur','Localisateurs']
};
function natNom(k,plur){const n=NATURES[k];return n?n[plur?1:0]:k;}
function carDe(c){return DATA('CHARS').find(x=>x.hz===c)||null;}
/* Le sens d’un caractère seul : sa fiche de caractère, sinon le mot
   d’un seul caractère qui lui correspond. */
function sensCar(c){
  const x=carDe(c);if(x&&x.fr)return x.fr;
  const w=DATA('WORDS').find(m=>m.hz===c);
  return w?w.fr:'';
}
function cleDe(c){const x=carDe(c);return x&&x.cle&&x.cle.hz?x.cle:null;}
function aDesCles(){return DATA('CHARS').some(x=>x.cle&&x.cle.hz);}

/* ---- Recherche : caractères, pinyin avec ou sans tons, français ---- */
const MARQUES=/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i;
function trouve(w,q){
  q=String(q||'').trim();
  if(!q)return true;
  if(/[㐀-鿿]/.test(q))return w.hz.indexOf(q)>=0;
  const plat=sansAccent(q).replace(/[\s’'\-0-9]/g,'');
  if(!plat)return true;
  if(sansAccent(w.fr).indexOf(sansAccent(q))>=0)return true;
  const py=w.py||'';
  if(sansAccent(py).replace(/[\s’'\-]/g,'').indexOf(plat)<0)return false;
  /* Tons tapés : ils doivent correspondre. */
  if(MARQUES.test(q))return py.toLowerCase().replace(/[\s’'\-]/g,'').indexOf(q.toLowerCase().replace(/[\s’'\-]/g,''))>=0;
  return true;
}

/* ---- Filtres -------------------------------------------------------
   Une pastille rapide, une recherche, et le panneau : dans une même
   section les choix s’additionnent, d’une section à l’autre ils se
   cumulent. L’état vit le temps de la page. */
let VF={q:'',pill:'tous',sel:{},tri:'theme',ouvert:false,anim:false,plus:{}};

function nbFiltres(){return Object.keys(VF.sel).filter(k=>VF.sel[k]).length;}
function filtreActif(){return !!VF.q.trim()||VF.pill!=='tous'||nbFiltres()>0;}

function valeurs(w,g){
  if(g==='etat')return [etatMot(w.id)].concat(aRevoir(w)?['revoir']:[]);
  if(g==='src')return origines(w);
  if(g==='hsk')return w.hsk?[String(w.hsk)]:[];
  if(g==='nat')return w.nat||[];
  if(g==='cl')return w.cl||[];
  if(g==='cle')return hanOf(w.hz).map(cleDe).filter(Boolean).map(k=>k.hz);
  return [];
}
function passeFiltres(w){
  if(VF.pill==='revoir'&&!aRevoir(w))return false;
  if(VF.pill==='frag'&&etatMot(w.id)!=='frag')return false;
  if(VF.pill==='trouv'&&!trouvaille(w))return false;
  const parGroupe={};
  Object.keys(VF.sel).forEach(k=>{if(!VF.sel[k])return;const i=k.indexOf(':');(parGroupe[k.slice(0,i)]=parGroupe[k.slice(0,i)]||[]).push(k.slice(i+1));});
  for(const g in parGroupe){
    const v=valeurs(w,g);
    if(!parGroupe[g].some(x=>v.indexOf(x)>=0))return false;
  }
  return trouve(w,VF.q);
}
function ordreTheme(w){
  const T=DATA('THEMES'),i=T.findIndex(t=>(w.th||[]).indexOf(t.id)>=0);
  return i<0?99:i;
}
function trier(L){
  const A=L.slice();
  if(VF.tri==='frag')return A.sort((a,b)=>RANG[etatMot(a.id)]-RANG[etatMot(b.id)]||boxOf(a.id)-boxOf(b.id));
  if(VF.tri==='recent'){
    const t=w=>{const f=favFind(w.id);return f?f.t:0;};
    const pos=new Map(DATA('WORDS').map((w,i)=>[w.id,i]));
    return A.sort((a,b)=>t(b)-t(a)||(pos.get(b.id)||0)-(pos.get(a.id)||0));
  }
  if(VF.tri==='py')return A.sort((a,b)=>sansAccent(a.py).localeCompare(sansAccent(b.py)));
  return A.sort((a,b)=>ordreTheme(a)-ordreTheme(b)||(a.hsk||9)-(b.hsk||9));
}
function choisir(k){VF.sel[k]=!VF.sel[k];render();}
function trierPar(t){VF.tri=t;render();}
function pastille(p){VF.pill=p;render();}
function ouvrirFiltres(){VF.ouvert=true;VF.anim=true;render();}
function fermerFiltres(){VF.ouvert=false;render();}
function effacerFiltres(){VF.sel={};VF.tri='theme';render();}
function deplier(g){VF.plus[g]=!VF.plus[g];render();}
function chercher(v){
  VF.q=v;
  const r=document.getElementById('vb-res');
  if(r)r.innerHTML=vbResultats(motsVocab());
}

/* ---- Les anneaux ---------------------------------------------------- */
function statsDe(L){
  const s={su:0,cours:0,frag:0,neuf:0,due:0,n:L.length};
  L.forEach(w=>{s[etatMot(w.id)]++;if(aRevoir(w))s.due++;});
  return s;
}
function anneau(s,taille,label,ep){
  const C=2*Math.PI*22;let pos=0;
  const arc=k=>{
    const l=s.n?C*s[k]/s.n:0;
    const r=l?`<circle cx="26" cy="26" r="22" fill="none" stroke="${ETATS[k].c}" stroke-width="${ep}" stroke-dasharray="${l.toFixed(1)} ${(C-l+.01).toFixed(1)}" stroke-dashoffset="${(-pos).toFixed(1)}"/>`:'';
    pos+=l;return r;
  };
  return `<span class="vb-ring" style="width:${taille}px;height:${taille}px"><svg viewBox="0 0 52 52" aria-hidden="true" focusable="false">
    <circle cx="26" cy="26" r="22" fill="none" stroke="#EFE6D8" stroke-width="${ep}"/>${arc('su')}${arc('cours')}${arc('frag')}</svg><span>${label}</span></span>`;
}
function anneauMot(id,taille){
  const e=ETATS[etatMot(id)],L=2*Math.PI*20,len=e.f?Math.max(e.f*L,6):0;
  return `<span class="vb-ring" style="width:${taille}px;height:${taille}px"><svg viewBox="0 0 52 52" role="img" aria-label="${e.n}">
    <circle cx="26" cy="26" r="20" fill="none" stroke="#EFE6D8" stroke-width="9"/>${len?`<circle cx="26" cy="26" r="20" fill="none" stroke="${e.c}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${len.toFixed(1)} ${(L-len+.01).toFixed(1)}"/>`:''}</svg></span>`;
}
function legende(){
  return `<div class="vb-leg">${['su','cours','frag'].map(k=>`<span><i style="background:${ETATS[k].c}"></i>${ETATS[k].p}</span>`).join('')}</div>`;
}

/* ---- Une ligne de mot ---------------------------------------------- */
function ligneMot(w){
  const e=etatMot(w.id);
  return `<button class="vb-row" onclick="ouvrirMot('${jq(w.id)}')">
    <span class="hz">${esc(w.hz)}</span>
    <span class="mid"><span class="py">${pinyin(w.py||'')}</span><span class="fr">${esc(w.fr)}</span></span>
    ${e!=='neuf'&&aRevoir(w)?'<span class="rv">à revoir</span>':''}
    ${anneauMot(w.id,26)}
  </button>`;
}
function ouvrirMot(id){go('mot',{id:id});}

/* =====================================================================
   L’accueil du vocabulaire
   ===================================================================== */
function vVocab(){
  if(ctx.session){
    if(ctx.session.done)return vocabScore();
    if(ctx.session.asso&&!ctx.session.asso.fini)return vocabAsso();
    return vocabDrill();
  }
  return vocabAccueil();
}

function vocabAccueil(){
  const M=motsVocab();
  if(!M.length)return header('Vocabulaire')+ribbon()+`
    <div class="void"><span class="em">词</span>
    <p><b>Aucun mot pour l’instant</b></p>
    <p class="sm">Les mots arrivent ici dès que vous commencez une leçon ou découvrez une fiche de grammaire. L’étoile du Traducteur en ajoute aussi.</p></div>
    <button class="btn" onclick="nav('parcours')">Ouvrir le parcours</button>`;
  const niv=Array.from(new Set(M.map(w=>w.hsk).filter(Boolean))).sort((a,b)=>a-b);
  const Q=M.filter(aRevoir),libre=!Q.length;
  const n=Math.min(Q.length,12),min=Math.max(1,Math.round(n*25/60));
  const nf=nbFiltres();
  const cnt={tous:M.length,revoir:Q.length,frag:M.filter(w=>etatMot(w.id)==='frag').length,trouv:M.filter(trouvaille).length};
  const P=[['tous','Tous'],['revoir','À revoir'],['frag','Fragiles'],['trouv','Mes trouvailles']];
  return header('Vocabulaire',pl(M.length,'mot')+(niv.length?' · HSK '+listeEt(niv.map(String)):''))+ribbon()+`
  <section class="vb-card vb-today">
    <div class="vb-tod">
      <div class="vb-num"><b>${Q.length}</b><small>${Q.length>1?'mots':'mot'}</small></div>
      <div class="vb-tx"><h2>${libre?'Tout est à jour':'À revoir aujourd’hui'}</h2>
        <p>${libre?'Révision libre des plus fragiles':'Environ '+pl(min,'minute')}</p></div>
      ${banban('lit','vb-lit',1)}
    </div>
    <button class="btn" onclick="startSeance()">${libre?'Réviser les plus fragiles':'Commencer la séance'}</button>
  </section>
  <div class="vb-search">
    <label class="vb-q">${chercherIco()}<span class="vb-sr">Chercher un mot</span>
      <input type="search" value="${esc(VF.q)}" placeholder="名字, mingzi, prénom…" oninput="chercher(this.value)" autocomplete="off"></label>
    <button class="vb-fbtn" onclick="ouvrirFiltres()" aria-label="Filtres${nf?', '+nf+' actifs':''}">${filtreIco()}Filtres${nf?`<span class="vb-badge">${nf}</span>`:''}</button>
  </div>
  <div class="vb-pills">${P.map(([k,l])=>`<button class="pill ${VF.pill===k?'on':''}" onclick="pastille('${k}')">${l} · ${cnt[k]}</button>`).join('')}</div>
  <div id="vb-res">${vbResultats(M)}</div>
  ${VF.ouvert?panneauFiltres(M):''}`;
}

function filtreIco(){
  return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`;
}

/* Sans recherche ni filtre : la grille des thèmes. Sinon, la liste. */
function vbResultats(M){
  if(!filtreActif())return grilleThemes(M);
  const L=trier(M.filter(passeFiltres));
  if(!L.length)return `<div class="void"><span class="em">空</span><p><b>Aucun mot ne correspond</b></p>
    <p class="sm">Essayez une autre orthographe, sans les tons, ou retirez un filtre.</p></div>`;
  return `<div class="vb-sech"><h3>${pl(L.length,'mot')}</h3>${legende()}</div>
    <div class="vb-list">${L.map(ligneMot).join('')}</div>`;
}

function grilleThemes(M){
  const T=DATA('THEMES');
  const tuiles=T.map((t,i)=>({id:t.id,n:String(i+1).padStart(2,'0'),titre:t.n,L:M.filter(w=>(w.th||[]).indexOf(t.id)>=0)}));
  const autres=M.filter(w=>!(w.th||[]).length);
  if(autres.length)tuiles.push({id:'_',n:'+',titre:'Autres mots',L:autres,sous:'fiches, traducteur'});
  return `<div class="vb-sech"><h3>Par thème</h3>${legende()}</div>
  <div class="vb-grid">${tuiles.map(t=>{
    const s=statsDe(t.L);
    return `<button class="vb-tile ${s.n?'':'off'}" ${s.n?`onclick="go('theme',{th:'${t.id}'})"`:'disabled'}>
      <span class="top">${anneau(s,46,t.n,7)}<b>${esc(t.titre)}</b></span>
      <small>${s.n?pl(s.n,'mot')+(t.sous?' · '+t.sous:''):'Pas encore commencé'}</small>
      ${s.due?`<span class="vb-due">${s.due} à revoir</span>`:''}
    </button>`;}).join('')}</div>`;
}

/* ---- Le panneau Filtres -------------------------------------------- */
function panneauFiltres(M){
  const anim=VF.anim;VF.anim=false;
  const compte=(g,v)=>M.filter(w=>valeurs(w,g).indexOf(v)>=0).length;
  const sec=(titre,g,opts,han)=>{
    if(!opts.length)return '';
    const long=han&&opts.length>6,ouvert=!!VF.plus[g];
    return `<div class="vb-fsec"><h4>${titre}</h4><div class="vb-frow">
      <div class="vb-opts ${long&&!ouvert?'one':''}">${opts.map(([v,l,n])=>`<button class="vb-opt ${VF.sel[g+':'+v]?'on':''}" onclick="choisir('${g}:${jq(v)}')"><span class="${han?'hz':''}">${esc(l)}</span>${n!=null?`<small>${n}</small>`:''}</button>`).join('')}</div>
      ${long?`<button class="vb-more ${ouvert?'open':''}" onclick="deplier('${g}')" aria-label="${ouvert?'Replier':'Voir tout'}">${chevIco()}</button>`:''}
    </div></div>`;
  };
  const parCompte=(g,liste)=>liste.map(v=>[v,v,compte(g,v)]).filter(o=>o[2]).sort((a,b)=>b[2]-a[2]);
  const etats=[['revoir','À revoir'],['frag','Fragiles'],['cours','En cours'],['su','Sus'],['neuf','Pas encore vus']].map(([v,l])=>[v,l,compte('etat',v)]);
  const srcs=[['lecon','Leçons'],['fiche','Fiches de grammaire'],['trad','Traducteur']].map(([v,l])=>[v,l,compte('src',v)]).filter(o=>o[2]);
  const niv=[1,2,3,4,5,6].map(String).map(v=>[v,'HSK '+v,compte('hsk',v)]).filter(o=>o[2]);
  const nats=Object.keys(NATURES).map(v=>[v,natNom(v,1),compte('nat',v)]).filter(o=>o[2]).sort((a,b)=>b[2]-a[2]);
  const cls=parCompte('cl',Array.from(new Set([].concat(...M.map(w=>w.cl||[])))));
  const cles=parCompte('cle',Array.from(new Set([].concat(...M.map(w=>valeurs(w,'cle'))))));
  const tris=[['theme','Thème'],['frag','Fragiles d’abord'],['recent','Ajoutés récemment'],['py','Pinyin A → Z']];
  const res=M.filter(passeFiltres).length;
  return `<button class="vb-veil" onclick="fermerFiltres()" aria-label="Fermer les filtres"></button>
  <div class="vb-panel ${anim?'anim':''}" role="dialog" aria-label="Filtres">
    <div class="vb-grab"></div>
    <div class="vb-phead"><b>Filtres</b><small>Plusieurs choix possibles</small></div>
    ${sec('État','etat',etats)}${sec('Origine','src',srcs)}${sec('Niveau','hsk',niv)}
    ${sec('Nature','nat',nats)}${sec('Classificateur','cl',cls,1)}${sec('Clé','cle',cles,1)}
    <div class="vb-fsec"><h4>Trier par</h4><div class="vb-opts">${tris.map(([v,l])=>`<button class="vb-opt ${VF.tri===v?'on':''}" onclick="trierPar('${v}')">${l}</button>`).join('')}</div></div>
    <div class="vb-fbar"><button class="vb-clear" onclick="effacerFiltres()">Tout effacer</button>
      <button class="btn" onclick="fermerFiltres()">Voir ${pl(res,'mot')}</button></div>
  </div>`;
}

/* =====================================================================
   L’écran d’un thème
   ===================================================================== */
function motsDuTheme(M,th){return th==='_'?M.filter(w=>!(w.th||[]).length):M.filter(w=>(w.th||[]).indexOf(th)>=0);}

function vTheme(){
  const M=motsVocab(),T=DATA('THEMES'),i=T.findIndex(t=>t.id===ctx.th);
  const nom=ctx.th==='_'?'Autres mots':(T[i]||{}).n||'Thème';
  const tout=motsDuTheme(M,ctx.th);
  if(!tout.length)return header(nom)+nothing('Aucun mot rencontré dans ce thème pour l’instant.');
  const niv=Array.from(new Set(tout.map(w=>w.hsk).filter(Boolean))).sort((a,b)=>a-b);
  const L=ctx.hsk?tout.filter(w=>w.hsk===ctx.hsk):tout;
  const s=statsDe(L);
  const grp=ctx.grp||'famille';
  const choix=[['famille','Par famille'],['cle','Par clé'],['nature','Par nature'],['frag','Fragiles d’abord']]
    .filter(([k])=>k!=='cle'||aDesCles()).filter(([k])=>k!=='nature'||tout.some(w=>(w.nat||[]).length));
  const etats=`<i style="background:${ETATS.su.c}"></i>${s.su} ${s.su>1?'sus':'su'} · <i style="background:${ETATS.cours.c}"></i>${s.cours} en cours<br><i style="background:${ETATS.frag.c}"></i>${pl(s.frag,'fragile')} · <i style="background:${ETATS.neuf.c}"></i>${s.neuf} pas encore ${s.neuf>1?'vus':'vu'}`;
  return header(nom,ctx.th==='_'?'Fiches de grammaire et traducteur':'Thème '+(i+1))+`
  <section class="vb-card">
    <div class="vb-big">${anneau(s,96,`<span>${s.n}<small>${s.n>1?'mots':'mot'}</small></span>`,5.5)}
      <div><div class="vb-kick">${ctx.th==='_'?'Hors thème':'Thème '+(i+1)}${niv.length?' · HSK '+listeEt(niv.map(String)):''}</div>
        <h2>${esc(nom)}</h2><div class="vb-states">${etats}</div></div>
    </div>
    ${niv.length>1?`<div class="vb-pills">
      <button class="pill ${!ctx.hsk?'on':''}" onclick="ctx.hsk=0;render()">Tous · ${tout.length}</button>
      ${niv.map(l=>`<button class="pill ${ctx.hsk===l?'on':''}" onclick="ctx.hsk=${l};render()">HSK ${l} · ${tout.filter(w=>w.hsk===l).length}</button>`).join('')}
    </div>`:''}
    <button class="btn" onclick="startTheme()">Réviser ce thème${s.due?' · '+s.due+' à revoir':''}</button>
  </section>
  <div class="vb-pills">${choix.map(([k,l])=>`<button class="pill ${grp===k?'on':''}" onclick="ctx.grp='${k}';render()">${l}</button>`).join('')}</div>
  ${groupes(L,M,grp).map(g=>`<div class="vb-grp">
    <div class="gh"><b>${g.k?`<span class="hz">${esc(g.k)}</span>`:''}${esc(g.t)}</b><small>${g.sub}</small></div>
    <div class="vb-list">${g.w.map(ligneMot).join('')}</div>
  </div>`).join('')}`;
}

function sousGroupe(W,ailleurs){
  const d=W.filter(aRevoir).length;
  return pl(W.length,'mot')+(ailleurs?' · '+ailleurs+' ailleurs':'')+(d?' · '+d+' à revoir':'');
}
function groupes(L,M,grp){
  if(grp==='frag'){
    const W=L.slice().sort((a,b)=>RANG[etatMot(a.id)]-RANG[etatMot(b.id)]||boxOf(a.id)-boxOf(b.id));
    return [{k:'',t:'Les plus fragiles d’abord',sub:pl(W.length,'mot'),w:W}];
  }
  if(grp==='nature'){
    const G={};L.forEach(w=>{const k=(w.nat||[])[0]||'_';(G[k]=G[k]||[]).push(w);});
    return Object.keys(G).sort((a,b)=>(a==='_')-(b==='_')||G[b].length-G[a].length)
      .map(k=>({k:'',t:k==='_'?'Nature pas encore indiquée':natNom(k,1),sub:sousGroupe(G[k]),w:G[k]}));
  }
  if(grp==='cle'){
    const G={},sens={};
    L.forEach(w=>{const ks=Array.from(new Set(hanOf(w.hz).map(cleDe).filter(Boolean).map(k=>{sens[k.hz]=k.fr;return k.hz;})));
      (ks.length?ks:['_']).forEach(k=>(G[k]=G[k]||[]).push(w));});
    return Object.keys(G).sort((a,b)=>(a==='_')-(b==='_')||G[b].length-G[a].length)
      .map(k=>({k:k==='_'?'':k,t:k==='_'?'Clé pas encore indiquée':(sens[k]?' '+sens[k]:''),sub:sousGroupe(G[k]),w:G[k]}));
  }
  /* Par famille : les mots qui partagent un caractère. Une famille
     compte dès qu’elle a deux mots ici, ou un mot ici et d’autres
     ailleurs. Le reste est regroupé à la fin. */
  const cars=[];L.forEach(w=>hanOf(w.hz).forEach(c=>{if(cars.indexOf(c)<0)cars.push(c);}));
  const G=[],places=new Set();
  cars.forEach(c=>{
    const ici=L.filter(w=>w.hz.indexOf(c)>=0);
    const ail=M.filter(w=>w.hz.indexOf(c)>=0&&L.indexOf(w)<0).length;
    if(ici.length>=2||(ici.length&&ail)){
      const s=sensCar(c);
      G.push({k:c,t:s?' — '+s:'',sub:sousGroupe(ici,ail),w:ici});
      ici.forEach(w=>places.add(w.id));
    }
  });
  G.sort((a,b)=>b.w.length-a.w.length);
  const reste=L.filter(w=>!places.has(w.id));
  if(reste.length)G.push({k:'',t:'Sans famille pour l’instant',sub:sousGroupe(reste),w:reste});
  return G;
}

/* =====================================================================
   Les tons et l’API
   ===================================================================== */
/* Le ton réellement prononcé, syllabe par syllabe, en chiffres de Chao.
   Le pinyin des données porte déjà le sandhi de 不 et de 一. Reste celui
   du 3e ton : devant un autre 3e ton il se dit comme un 2e, ailleurs
   qu’en fin de mot il ne remonte pas. Le ton neutre prend une hauteur
   qui dépend du ton qui le précède. */
function tonsReels(syl){
  const T=syl.map(toneOf);
  return T.map((t,i)=>{
    if(t===1)return {t:1,c:'55'};
    if(t===2)return {t:2,c:'35'};
    if(t===4)return {t:4,c:'51'};
    if(t===3){
      if(T[i+1]===3)return {t:3,c:'35',sandhi:1};
      return {t:3,c:i<T.length-1?'21':'214'};
    }
    const p=i?T[i-1]:0;
    return {t:0,c:({1:'2',2:'3',3:'4',4:'1'})[p]||'3'};
  });
}
const CHAO={'1':'˩','2':'˨','3':'˧','4':'˦','5':'˥'};
function chao(c){return c==='55'?'˥':c.split('').map(d=>CHAO[d]).join('');}

const TON_NOM={1:'1ᵉʳ ton',2:'2ᵉ ton',3:'3ᵉ ton',4:'4ᵉ ton',0:'neutre'};
const TON_DIT={
  55:'Premier ton : haut et tenu',35:'Deuxième ton : la voix monte',214:'Troisième ton : la voix descend puis remonte',
  21:'Troisième ton : la voix descend, sans remonter',51:'Quatrième ton : la voix tombe'
};
function courbe(r){
  const y=d=>23-(d-1)*5;
  let trait;
  if(r.c.length===1)trait=`<circle cx="18" cy="${y(+r.c)}" r="3.5" fill="currentColor"/>`;
  else{
    const d=r.c.split('').map(Number);
    const xs=d.length===2?[5,31]:[5,15,31];
    trait=`<path d="M${d.map((v,k)=>xs[k]+' '+y(v)).join(' L')}" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  const dit=r.sandhi?'Troisième ton prononcé comme un deuxième, devant un autre troisième ton':(r.t===0?'Ton neutre : bref et léger':TON_DIT[r.c]);
  return `<span class="vb-tone s${r.t}"><svg viewBox="0 0 36 26" role="img" aria-label="${dit}"><path class="tg" d="M2 3h32M2 23h32"/>${trait}</svg><small>${r.sandhi?'3ᵉ → 2ᵉ':TON_NOM[r.t]}</small></span>`;
}

/* API : la table de conversion du pinyin. Rien n’est saisi mot par mot.
   Une syllabe qu’on ne sait pas convertir (érhua, interjection) fait
   disparaître la ligne : mieux vaut rien qu’une transcription fausse. */
const API_INI={b:'p',p:'pʰ',m:'m',f:'f',d:'t',t:'tʰ',n:'n',l:'l',g:'k',k:'kʰ',h:'x',
  j:'tɕ',q:'tɕʰ',x:'ɕ',zh:'ʈʂ',ch:'ʈʂʰ',sh:'ʂ',r:'ʐ',z:'ts',c:'tsʰ',s:'s'};
const API_FIN={a:'a',o:'o',e:'ɤ',ai:'aɪ',ei:'eɪ',ao:'ɑʊ',ou:'oʊ',an:'an',en:'ən',ang:'ɑŋ',eng:'ɤŋ',ong:'ʊŋ',er:'ɚ',
  i:'i',ia:'ja',ie:'jɛ',iao:'jɑʊ',iu:'joʊ',ian:'jɛn',in:'in',iang:'jɑŋ',ing:'iŋ',iong:'jʊŋ',
  u:'u',ua:'wa',uo:'wo',uai:'waɪ',ui:'weɪ',uan:'wan',un:'wən',uang:'wɑŋ',ueng:'wɤŋ',
  'ü':'y','üe':'ɥɛ','üan':'ɥɛn','ün':'yn'};
const API_ZERO={yi:'i',ya:'ia',ye:'ie',yao:'iao',you:'iu',yan:'ian',yin:'in',yang:'iang',ying:'ing',yong:'iong',
  yu:'ü',yue:'üe',yuan:'üan',yun:'ün',wu:'u',wa:'ua',wo:'uo',wai:'uai',wei:'ui',wan:'uan',wen:'un',wang:'uang',weng:'ueng'};
function apiSyllabe(s){
  s=stripTone(s).toLowerCase().replace(/v/g,'ü');
  if(!/^[a-zü]+$/.test(s))return null;
  if(/r$/.test(s)&&s!=='er')return null;
  if(API_ZERO[s])return API_FIN[API_ZERO[s]];
  if(s==='er'||/^[aoe]/.test(s))return API_FIN[s]||null;
  const m=s.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcs])(.+)$/);
  if(!m)return null;
  const ini=m[1];let fin=m[2];
  if(/^[jqx]$/.test(ini))fin=fin.replace(/^u/,'ü');
  if(fin==='i'&&/^(z|c|s|zh|ch|sh|r)$/.test(ini))return API_INI[ini]+'ɨ';
  if(fin==='o'&&/^[bpmf]$/.test(ini))fin='uo';
  return API_FIN[fin]?API_INI[ini]+API_FIN[fin]:null;
}
function syllabes(py){return String(py||'').trim().split(/[\s’'\-]+/).map(s=>s.replace(/[,.?!，。？！]/g,'')).filter(Boolean);}
function apiMot(py){
  const syl=syllabes(py);if(!syl.length)return null;
  const R=tonsReels(syl),out=[];
  for(let i=0;i<syl.length;i++){
    const a=apiSyllabe(syl[i]);if(!a)return null;
    out.push(a+chao(R[i].c));
  }
  return '['+out.join(' ')+']';
}

/* =====================================================================
   La fiche d’un mot
   ===================================================================== */
const TYPES_CAR={picto:'pictogramme',ideo:'idéogramme composé',phono:'idéo-phonogramme'};
function pyDe(hz){const w=DATA('WORDS').find(m=>m.hz===hz);return w?w.py:'';}

function vMot(){
  const w=anyWord(ctx.id);
  if(!w)return header('Vocabulaire')+nothing('Ce mot est introuvable.');
  const e=etatMot(w.id),E=ETATS[e],cars=hanOf(w.hz),syl=syllabes(w.py);
  const kick=[w.hsk?'HSK '+w.hsk:'',(w.nat||[])[0]?natNom(w.nat[0]):'',favFind(w.id)?'trouvaille':''].filter(Boolean).join(' · ');
  const api=apiMot(w.py);
  const tons=syl.length&&syl.length<=6?tonsReels(syl).map(courbe).join(''):'';
  const taille=w.hz.length<=2?'':w.hz.length<=3?'l3':w.hz.length<=5?'l5':'lx';
  const D=dataOf(w),ex=(D.exs||[])[0];
  const M=motsVocab();
  const fam=M.filter(m=>m.id!==w.id&&cars.some(c=>m.hz.indexOf(c)>=0)).slice(0,8);
  const dec=cars.map(carDe).filter(c=>c&&(c.cle||c.type));
  const cls=(w.cl||[]);
  return `<div class="vb-mot">
  <div class="vb-top">
    <div class="vb-th"><button class="vb-back" onclick="back()" aria-label="Retour">${ico('back')}</button><span>${esc(kick)}</span></div>
    ${cars[0]?`<span class="vb-wm" aria-hidden="true">${esc(cars[0])}</span>`:''}
    <div class="vb-glyph ${taille}">${esc(w.hz)}</div>
  </div>
  ${banban('pinceau','vb-bb',1)}
  <div class="vb-sheet">
    <div class="vb-pron">
      <div class="vb-pyring" style="border-color:${E.c}" role="img" aria-label="${esc(w.py)}, ${E.n.toLowerCase()}">${pinyin(w.py||'')}</div>
      ${tons?`<div class="vb-tones">${tons}</div>`:''}
    </div>
    <div class="vb-fr">${esc(w.fr)}</div>
    ${api?`<div class="vb-api">API : ${api}</div>`:''}
    <div class="vb-acts">
      <button class="vb-act on" onclick="speak('${jq(w.hz)}')">${ico('sound')}Écouter</button>
      <button class="vb-act" disabled aria-disabled="true" title="Bientôt disponible">${micIco()}Dire<small>bientôt</small></button>
      <button class="vb-act" onclick="go('tracer',{id:'${jq(w.id)}'})">${pinceauIco()}Tracer</button>
    </div>

    <div class="vb-lab">Où j’en suis</div>
    <div class="vb-state">${anneauMot(w.id,34)}<span><b style="color:${e==='neuf'?'#776E66':e==='cours'?'#8E651A':E.c}">${E.n}</b> · ${E.t}${e!=='neuf'&&aRevoir(w)?' · à revoir aujourd’hui':''}</span></div>

    ${cls.length?`<div class="vb-lab">Classificateur</div>
    <div class="vb-chips">${cls.map(c=>`<span class="vb-chip"><span class="hz">${esc(c)}</span>${pyDe(c)?`<span>${pinyin(pyDe(c))}</span>`:''} · <span class="hz vb-cl">一${esc(c)}${esc(w.hz)}</span></span>`).join('')}</div>`:''}

    ${ex?`<div class="vb-lab">Exemple</div>
    <div class="vb-ex"><div class="h">${esc(ex.hz)}</div>${ex.py?`<div class="p">${pinyin(ex.py)}</div>`:''}${ex.fr?`<div class="f">${esc(ex.fr)}</div>`:''}
      <button class="vb-exs" onclick="speak('${jq(ex.hz)}')" aria-label="Écouter l’exemple">${ico('sound')}</button></div>`:''}

    ${dec.length?`<div class="vb-lab">${dec.length>1?'Les caractères':'Le caractère'}</div>
    <div class="vb-dec">${dec.map(c=>`<div class="vb-decrow"><span class="c">${esc(c.hz)}</span><span class="t">${c.cle?`Clé <span class="hz">${esc(c.cle.hz)}</span>${c.cle.fr?' '+esc(c.cle.fr):''}`:''}${c.type&&TYPES_CAR[c.type]?`<em>${TYPES_CAR[c.type]}</em>`:''}
      ${c.sens||c.son?`<br>${c.sens?`<span class="hz">${esc(c.sens.hz)}</span> ${esc(c.sens.fr||'')}, pour le sens`:''}${c.sens&&c.son?' + ':''}${c.son?`<span class="hz">${esc(c.son.hz)}</span> ${c.son.py?pinyin(c.son.py):''}, pour le son${c.son.ecart?' ('+esc(c.son.ecart)+')':''}`:''}`:''}</span></div>`).join('')}</div>`:''}

    ${fam.length?`<div class="vb-lab">La même famille</div>
    <div class="vb-chips">${fam.map(m=>`<button class="vb-chip" onclick="ouvrirMot('${jq(m.id)}')"><span class="hz">${esc(m.hz)}</span><span>${pinyin(m.py||'')}</span> · ${esc(m.fr)}</button>`).join('')}</div>`:''}
  </div>
  <div class="vb-foot"><button class="vb-go" onclick="startIds(['${jq(w.id)}'])">Réviser ce mot maintenant</button></div>
  </div>`;
}
function chercherIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>`;}
function chevIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;}
function micIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`;}
function pinceauIco(){return `<svg viewBox="0 0 24 24" class="ico" aria-hidden="true"><path d="M4 20c4-1 6-3 9-6l5-5-3-3-5 5c-3 3-5 5-6 9z"/><path d="M14 6l3 3"/></svg>`;}

/* =====================================================================
   Le tracé d’un mot (bouton « Tracer » de la fiche)
   HanziWriter n’est chargé qu’à la demande.
   ===================================================================== */
let VT=[];
function vTracer(){
  const w=anyWord(ctx.id);
  if(!w)return header('Tracer')+nothing('Ce mot est introuvable.');
  const ch=hanOf(w.hz).slice(0,4),cl=ch.length===1?'tw1':ch.length===2?'tw2':'tw3';
  return header('Tracer',w.hz+(w.py?' · '+w.py:''))+`
  <div class="box u-ta-center">
    <div class="vb-tr">${ch.map((c,k)=>`<div class="tbox ${cl}" id="vt${k}"></div>`).join('')}</div>
    <div class="u-tx2 py mt">${pinyin(w.py||'')}</div>
    <p class="u-mt0 mut">${esc(w.fr)}</p>
    <p class="mut sm" id="vtst">Chargement des tracés…</p>
    <div class="row mt">
      <button class="btn pale" onclick="vtAnimer()">Animer</button>
      <button class="btn" onclick="vtTracer()">Tracer</button>
    </div>
  </div>`;
}
function chargerHW(fait){
  if(typeof HanziWriter!=='undefined')return fait();
  let s=document.getElementById('hw-js');
  if(!s){
    s=document.createElement('script');s.id='hw-js';
    s.src='https://cdn.jsdelivr.net/npm/hanzi-writer@3/dist/hanzi-writer.min.js';
    document.head.appendChild(s);
  }
  s.addEventListener('load',fait);
  s.addEventListener('error',()=>{const st=document.getElementById('vtst');
    if(st)st.textContent='Les tracés n’ont pas pu se charger. Vérifiez la connexion.';});
}
function mountTracer(){
  const w=anyWord(ctx.id);if(!w)return;
  chargerHW(()=>{
    if(view!=='tracer')return;
    VT=[];
    hanOf(w.hz).slice(0,4).forEach((c,k)=>{
      const el=document.getElementById('vt'+k);if(!el)return;
      el.innerHTML='';
      const t=el.clientWidth||138;
      VT.push(HanziWriter.create(el,c,{width:t,height:t,padding:8,delayBetweenStrokes:150,...teintesTrace()}));
    });
    const st=document.getElementById('vtst');
    if(st)st.textContent='« Animer » montre l’ordre des traits. « Tracer » vous fait écrire au doigt.';
  });
}
function vtAnimer(){
  const run=k=>{if(k<VT.length)VT[k].animateCharacter({onComplete:()=>setTimeout(()=>run(k+1),250)});};
  run(0);
}
function vtTracer(){
  const run=k=>{
    if(k>=VT.length){beep('ok');return;}
    const el=document.getElementById('vt'+k);if(el)el.className=el.className.replace(' ok','');
    VT[k].quiz({onComplete(){
      const b=document.getElementById('vt'+k);if(b)b.className+=' ok';
      setTimeout(()=>run(k+1),320);
    }});
  };
  run(0);
}

/* =====================================================================
   Lancer une séance
   ===================================================================== */
/* La carte du jour : ce qui est à revoir ; s’il n’y a rien, la révision
   libre des plus fragiles. */
function startSeance(){
  const M=motsVocab();
  if(!M.length)return toast('Aucun mot pour l’instant.');
  lancer(M);
}
function startTheme(){
  const M=motsVocab(),L=motsDuTheme(M,ctx.th);
  lancer(ctx.hsk?L.filter(w=>w.hsk===ctx.hsk):L);
}
function lancer(L){
  const q=L.filter(aRevoir);
  const lot=(q.length?q:L).slice().sort((a,b)=>
    q.length?boxOf(a.id)-boxOf(b.id):RANG[etatMot(a.id)]-RANG[etatMot(b.id)]||boxOf(a.id)-boxOf(b.id));
  startIds(shuffle(lot.slice(0,Math.min(lot.length,12)).map(w=>w.id)),!q.length);
}
function startIds(ids,rappel){
  ids=ids.filter(id=>anyWord(id));
  if(!ids.length)return toast('Aucun mot à réviser.');
  /* La séance est empilée comme une vue à part entière : la croix de
     fermeture ramène ainsi à l’écran d’où l’on vient. */
  /* Au moins 4 mots fragiles : la séance s’ouvre par un jeu
     d’association sur ces mots (6 au plus), pour les remettre en tête
     avant les épreuves. Il ne note rien. */
  const frag=ids.filter(id=>etatMot(id)==='frag').slice(0,6);
  const asso=frag.length>=4?{ids:frag,g:shuffle(frag),d:shuffle(frag),sel:null,faits:[],rate:null}:null;
  go('vocab',{
    session:{ids:ids,i:0,right:0,vus:0,quick:false,rappel:!!rappel,repush:{},premier:{},asso:asso},
    show:0,
    d:makeDrill(anyWord(ids[0]))
  });
}

function vocabProg(){
  const Z=ctx.session;
  return `<div class="qnum">Mot ${Z.i+1} sur ${Z.ids.length}${ctx.d?' · '+esc((LADDER.find(L=>L.k===ctx.d.kind)||{}).n||''):''}</div>
  <div class="qprog">${Z.ids.map((id,k)=>{
    const cl=k===Z.i?'now':(k<Z.i?'ok':'');
    return `<i class="${cl}"></i>`;}).join('')}</div>`;
}

function vocabDrill(){
  const d=ctx.d,w=d.w,rep=d.ans!=null;
  const T=typeOf(d.kind);
  const fiche=`<div class="u-ta-center box">
      <div class="hz ${d.unit==='phr'?'u-tx3':'u-tx5'} u-fw-700 u-lh-12">${esc(w.hz)}</div>
      <div class="u-tx2 py">${pinyin(w.py)}</div>
      <p class="u-mv13 mut">${esc(w.fr)}</p>
      <button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button>
    </div>`;
  const suite=rep?`<button class="btn mt" onclick="vNext()">${ctx.session.i<ctx.session.ids.length-1?'Suivant':'Voir le bilan'}</button>`:'';
  /* Le rappel de la réponse, identique partout : c’est le moment où la
     mémoire se fixe, il ne doit jamais manquer. */
  const rappel=`${esc(w.hz)}${w.py?' — '+esc(w.py):''} — ${esc(w.fr)}`;
  const tete=(sub)=>header('Vocabulaire',sub||' ')+vocabProg();

  /* ---------- Les épreuves à quatre propositions ---------- */
  if(d.a&&['reco','prod','tons','trou','ecoute','mjuste','decomp'].indexOf(d.kind)>=0){
    const consigne={
      reco:'Que signifie ce mot ?',
      prod:'Quel mot correspond ?',
      tons:'Quel pinyin est exact ? Les tons seuls diffèrent.',
      trou:'Complétez la phrase.',
      ecoute:'Écoutez, puis reconnaissez ce qui a été dit.',
      mjuste:'Lequel des trois convient ici ? Ils se traduisent pareil en français.',
      decomp:'Que signifie cet élément du caractère ?'
    }[d.kind];
    return tete(w.fr&&d.kind!=='reco'?'':' ')+
    (d.neuf&&d.kind==='reco'&&!rep?`<div class="verdict ok">Premier passage sur ce mot — regardez-le, puis répondez.</div>`+fiche:'')+`
    <div class="box">
      <p class="u-mb2 mut sm">${esc(consigne)}</p>
      ${d.kind==='trou'||d.kind==='mjuste'
        ?`<div class="sentence">${esc(d.gap)}</div>
          ${d.s&&d.s.fr?`<p class="u-mh2 mut sm">${esc(d.s.fr)}</p>`:''}`
        :d.kind==='ecoute'
        ?`<div class="u-ta-center u-pv20">
            <button class="btn jade" onclick="speak('${jq(d.audio)}')">Écouter</button>
            <p class="mut sm mt">Rien n’est affiché : tout se joue à l’oreille.</p>
          </div>`
        :d.kind==='decomp'
        ?`<div class="prompt"><div class="big">${esc(d.dc.c)}</div></div>
          ${d.part?`<p class="u-ta-center u-mh2 mut sm">Élément : <b class="hz">${esc(d.part.p||'')}</b>${d.part.role?' — '+esc(d.part.role):''}</p>`:''}`
        :`<div class="prompt"><div class="${d.promptHan?'big':'med'}">${esc(d.prompt)}</div></div>`}
      ${d.kind==='tons'?`<div class="u-ta-center"><button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button></div>`:''}
      <div class="opts">${d.a.map((opt,j)=>{
        let cl='';if(rep)cl=(j===d.ok)?'ok':(j===d.ans?'no':'');
        return `<button class="opt ${d.han?'han':''} ${cl}" onclick="vAnswer(${j})">${d.kind==='tons'?pinyin(opt):esc(opt)}</button>`;
      }).join('')}</div>
      ${rep?`<div class="verdict ${d.ans===d.ok?'ok':'no'}">${d.ans===d.ok?'Juste.':'Réponse attendue : '+esc(d.a[d.ok])+'.'} ${rappel}</div>
        ${d.kind==='mjuste'&&d.notes&&d.notes.length?`<div class="u-mt3 box">
          <p class="u-mb2 mut sm"><b>Ce qui les sépare</b></p>
          ${d.notes.map(v=>`<p class="u-mb1 sm"><b class="hz">${esc(v.hz)}</b>${v.py?' <span class="py">'+pinyin(v.py)+'</span>':''} — ${esc(v.note||v.fr||'')}</p>`).join('')}
        </div>`:''}
        ${d.kind==='decomp'&&d.dc.note?`<p class="sm mt">${esc(d.dc.note)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.kind==='trou'||d.kind==='mjuste'?d.s.hz:w.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Repérer la faute : deux phrases, une seule tient ---------- */
  if(d.kind==='faute'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Laquelle des deux est correcte ?</p>
      <div class="opts">${d.a2.map((o,j)=>{
        let cl='';if(rep)cl=(j===d.ok)?'ok':(j===d.ans?'no':'');
        return `<button class="opt han long ${cl}" onclick="vFaute(${j})">${esc(o.hz)}</button>`;
      }).join('')}</div>
      ${rep?`<div class="verdict ${d.ans===d.ok?'ok':'no'}">${d.ans===d.ok?'Juste.':'C’est l’autre qui est correcte.'}</div>
        ${d.note?`<p class="sm">${esc(d.note)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.a2[d.ok].hz)}')">Écouter la bonne</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Écrire le pinyin, tons chiffrés ---------- */
  if(d.kind==='pyw'){
    const att=pySyls(w.py).map(pyRead).join(' ');
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Écrivez le pinyin de ce mot. Les tons se notent en chiffres : <b>hao3</b>, <b>ma5</b> pour le ton neutre.</p>
      <div class="prompt"><div class="big">${esc(w.hz)}</div></div>
      ${rep?'':`<input id="pyin" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="ni3 hao3">
        <div class="row mt">
          <button class="btn jade sm" onclick="vPy()">Valider</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${
          d.ans===1?'Exact, tons compris.'
          :(d.memeSyl?'Les syllabes sont bonnes, mais pas les tons.':'Ce n’est pas ça.')}</div>
        ${d.txt?`<p class="u-mb0 mut sm">Vous avez écrit</p>
          <div class="u-c-red-d diff">${esc(d.txt)}</div>`:''}
        <p class="u-mv30 mut sm">Attendu</p>
        <div class="u-tx2 py">${pinyin(w.py)}</div>
        <p class="mut sm">soit <b>${esc(att)}</b> — ${esc(w.fr)}</p>
        <button class="btn pale sm mt" onclick="speak('${jq(w.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Complétion à l’aveugle ---------- */
  if(d.kind==='trouw'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Complétez, sans proposition. Clavier chinois.</p>
      <div class="sentence">${esc(d.gap)}</div>
      ${d.s&&d.s.fr?`<p class="u-mv23 mut sm">${esc(d.s.fr)}</p>`:''}
      ${rep?'':`<textarea id="zi" rows="1" placeholder="汉字…"></textarea>
        <div class="row mt">
          <button class="btn jade sm" onclick="vTrouW()">Valider</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${d.ans===1?'Juste.':'Attendu : '+esc(d.cible.hz)+'.'}</div>
        ${d.txt&&d.ans!==1?`<p class="u-mb0 mut sm">Vous avez écrit</p>
          <div class="u-c-red-d diff">${esc(d.txt)}</div>`:''}
        <p class="u-mv30 mut sm">Phrase complète</p>
        <div class="u-c-jade-d diff">${esc(d.s.hz)}</div>
        ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.s.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Remise en ordre ---------- */
  if(d.kind==='ordre'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Remettez la phrase dans l’ordre. En chinois, l’ordre est la grammaire.</p>
      ${d.s.fr?`<p class="u-tx1 u-fw-700 u-mb3">${esc(d.s.fr)}</p>`:''}
      <div class="drop">${d.built.map((t,i)=>`<button class="tile" onclick="vOrdBack(${i})">${esc(t)}</button>`).join('')
        ||'<span class="u-ph2 mut sm">Touchez les mots dans l’ordre</span>'}</div>
      ${d.bag.length?`<div class="tiles mt">${d.bag.map((t,i)=>`<button class="tile" onclick="vOrdTap(${i})">${esc(t)}</button>`).join('')}</div>`:''}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'} mt">${d.ans===1?'Phrase juste !':'Ordre incorrect.'}</div>
        <p class="u-mv30 mut sm">Phrase attendue</p>
        <div class="u-c-jade-d diff">${esc(d.seg.join(''))}</div>
        ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.seg.join(''))}')">Écouter</button>`
       :`<button class="btn pale sm mt" onclick="vOrdReset()">Recommencer</button>`}
    </div>
    ${suite}`;
  }

  /* ---------- Tracé de mémoire ---------- */
  if(d.kind==='trace'){
    const chars=hanOf(w.hz);
    const cadre=chars.length>2?'tw3':(chars.length===2?'tw2':'tw1');
    return tete(' ')+`
    <div class="u-ta-center box">
      <p class="u-mb1 mut sm">Écrivez ce mot de mémoire. Aucun contour n’est affiché.</p>
      <div class="u-tx2 u-fw-700 fr">${esc(w.fr)}</div>
      <div class="u-tx2 u-mbo3 py">${pinyin(w.py)}</div>
      <div class="u-d-flex u-gp3 u-jc-center u-fwr-wrap">
        ${chars.map((c,k)=>`<div id="tw${k}" class="tbox ${cadre}"></div>`).join('')}
      </div>
      ${rep?`<div class="verdict ${d.ans===-1?'no':(d.mist===0?'ok':'no')} mt">${
          d.ans===-1?'Tracé révélé — le mot recule d’un cran.'
          :(d.mist===0?'Sans une seule erreur de tracé.':d.mist+' erreur(s) de tracé.')
        } ${rappel}</div>`
       :`<button class="btn pale sm mt" onclick="vReveal()">Je ne m’en souviens pas — montrer</button>`}
    </div>
    ${suite}`;
  }

  /* ---------- Réemploi corrigé ---------- */
  if(d.kind==='remploi'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">À vous. Le modèle corrigera ensuite.</p>
      <p class="u-tx2 u-fw-700 u-mb1">${esc(d.consigne)}</p>
      <p class="u-mb3 mut sm">${esc(w.hz)}${w.py?' — '+esc(w.py):''} — ${esc(w.fr)}</p>
      ${rep?'':`<textarea id="zi" rows="2" placeholder="汉字…"></textarea>
        <div class="row mt">
          <button class="btn jade sm" onclick="vRemploi()" ${d.busy?'disabled':''}>${d.busy?'Correction en cours…':'Valider'}</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<p class="u-mb0 mut sm">Votre phrase</p>
        <div class="u-tx2 sentence">${esc(d.txt||'')}</div>
        ${d.err?`<p class="mut sm mt">${esc(d.err)}</p>`:''}
        ${d.corr?`<p class="u-ws-pre-wrap u-bt-2-dashed-line u-pt3 u-mt3 sm">${esc(d.corr)}</p>`:''}
        <p class="mut sm mt">Vous seule pouvez trancher : la correction lue, le mot est-il acquis ?</p>
        <div class="row mt">
          <button class="btn pale sm" onclick="vRemploiJuge(0)">Non</button>
          <button class="btn jade sm" onclick="vRemploiJuge(2)">Oui</button>
        </div>`:''}
    </div>`;
  }

  /* ---------- Dictée, et saisie au clavier ---------- */
  const dictee=(d.kind==='dictee');
  const dz=rep?diffZh(d.txt||'',d.s.hz):null;
  return tete(' ')+`
  <div class="box">
    ${dictee
      ?`<p class="u-mb2 mut sm">Écoutez, puis écrivez ce que vous entendez. Rien n’est affiché.</p>
        <button class="btn jade" onclick="speak('${jq(d.s.hz)}')">Écouter</button>
        <div class="mt"></div>`
      :`<p class="u-mb2 mut sm">Écrivez cette phrase en chinois, au clavier.${d.unit==='mot'?' Elle contient '+esc(w.hz)+'.':''}</p>
        <p class="u-tx2 u-fw-700 u-mb3">${esc(d.s.fr||w.fr)}</p>`}
    ${rep?'':`<textarea id="zi" rows="2" placeholder="汉字…"></textarea>
      <div class="row mt">
        <button class="btn jade sm" onclick="vSubmit()">Valider</button>
        <button class="btn pale sm" onclick="vSkip()">Je passe</button>
      </div>`}
    ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${d.ans===1?'Identique au modèle.':(d.ans===-1?'Phrase passée.':'Ce n’est pas tout à fait ça.')}</div>
      ${d.ans!==1?`<p class="u-mb0 mut sm">Vous avez écrit</p>
        <div class="u-c-red-d diff">${dz.you||'—'}</div>
        <p class="u-mv30 mut sm">Attendu</p>`:'<p class="u-mb0 mut sm">Modèle</p>'}
      <div class="u-c-jade-d diff">${dz.exp}</div>
      ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
      ${d.s.fr?`<p class="mut sm">${esc(d.s.fr)}</p>`:''}
      <button class="btn pale sm mt" onclick="speak('${jq(d.s.hz)}')">Écouter</button>`:''}
  </div>
  ${suite}`;
}

function vocabScore(){
  const Z=ctx.session,P=Z.premier||{};
  const ids=Object.keys(P),n=ids.length,k=ids.filter(id=>P[id]).length;
  const rates=ids.filter(id=>!P[id]).map(anyWord).filter(Boolean);
  const pct=n?Math.round(k/n*100):0;
  const bien=pct>=75;
  return header('Séance terminée')+`
  <div class="box vb-fin">
    <div class="score"><div class="n">${k}<small> sur ${n}</small></div><div class="lbl">du premier coup</div></div>
    <div class="u-mv44 bar"><i class="${bien?'ok':pct>=50?'mi':'no'}" style="width:${pct}%"></i></div>
  </div>
  ${coach(bien?'saut':'encourage',bien?'Belle séance\u202F! Ce qui est su revient de moins en moins souvent.'
    :(rates.length?'Les mots ratés reviendront dès la prochaine séance, jusqu’à ce qu’ils tiennent.':'On continue\u202F: ça s’installe.'))}
  ${rates.length?`<h2 class="sec">À retravailler</h2><div class="vb-list">${rates.map(ligneMot).join('')}</div>`:''}
  <button class="btn mt" onclick="back();startSeance()">Nouvelle séance</button>
  <button class="btn pale mt" onclick="back()">Retour au vocabulaire</button>`;
}

/* ---- Le jeu d’association d’ouverture ------------------------------ */
function sensCourt(w){return String(w.fr||'').split(/[;；]/)[0].trim();}
function vocabAsso(){
  const A=ctx.session.asso;
  const W=id=>anyWord(id)||{hz:'',fr:''};
  const fini=A.faits.length===A.ids.length;
  const cl=(id,cote)=>A.faits.indexOf(id)>=0?'fait':(A.sel===id&&cote==='g'?'sel':(A.rate&&A.rate[cote]===id?'rate':''));
  return header('Échauffement',A.ids.length+' mots fragiles de la séance')+`
  ${coach('pense',fini?'C’est fait. On passe aux épreuves\u202F!':'Retrouvez les paires\u202F: touchez un mot, puis son sens.')}
  <div class="vb-asso">
    <div class="col">${A.g.map(id=>`<button class="vb-ap hz ${cl(id,'g')}" ${A.faits.indexOf(id)>=0?'disabled':''} onclick="assoG('${jq(id)}')">${esc(W(id).hz)}</button>`).join('')}</div>
    <div class="col">${A.d.map(id=>`<button class="vb-ap ${cl(id,'d')}" ${A.faits.indexOf(id)>=0?'disabled':''} onclick="assoD('${jq(id)}')">${esc(sensCourt(W(id)))}</button>`).join('')}</div>
  </div>
  <button class="btn ${fini?'':'pale'} mt" onclick="assoFin()">${fini?'Commencer les épreuves':'Passer l’échauffement'}</button>`;
}
function assoG(id){const A=ctx.session.asso;A.sel=id;A.rate=null;render();}
function assoD(id){
  const A=ctx.session.asso;
  if(!A.sel){toast('Touchez d’abord un mot en chinois.');return;}
  if(A.sel===id){A.faits.push(id);A.sel=null;A.rate=null;beep('ok');}
  else{A.rate={g:A.sel,d:id};A.sel=null;beep('no');}
  render();
  if(A.faits.length===A.ids.length)setTimeout(()=>{if(ctx.session&&ctx.session.asso===A&&!A.fini)assoFin();},900);
}
function assoFin(){const A=ctx.session.asso;if(A)A.fini=true;render();scrollTo(0,0);}

function curWord(){return anyWord(ctx.session.ids[ctx.session.i]);}

/* ---- Rappel espacé à l’intérieur de la séance ----------------------
   Un mot raté qui disparaît jusqu’au lendemain n’est pas retravaillé : il
   est renvoyé au moment où il sera déjà oublié. On le réinsère donc
   quelques items plus loin, puis une dernière fois en fin de séance. Au
   plus deux retours, sans quoi une séance ratée ne finirait jamais. */
function replanifie(id,ok){
  const Z=ctx.session;
  if(ok||!Z)return;
  Z.repush=Z.repush||{};
  const déjà=Z.repush[id]||0;
  if(déjà>=2)return;
  Z.repush[id]=déjà+1;
  const pos=déjà===0?Math.min(Z.ids.length,Z.i+3+(Math.random()*2|0)):Z.ids.length;
  Z.ids.splice(pos,0,id);
}

/* Une seule porte pour noter, quel que soit le type d’épreuve : elle
   retient aussi le type servi, pour ne pas le resservir aussitôt. */
/* Premier essai de chaque mot dans la séance : c’est lui que compte
   l’écran de fin (« 7 sur 10 du premier coup »). Le réemploi, jugé par
   le modèle, vaut une réussite dès qu’il n’est pas un échec. */
function notePremier(id,g,kind){
  const Z=ctx.session;if(!Z)return;
  Z.premier=Z.premier||{};
  if(!(id in Z.premier))Z.premier[id]=(g===2||(kind==='remploi'&&g>=1));
}
function vGrade(g){
  const d=ctx.d;if(!d)return;
  notePremier(d.w.id,g,d.kind);
  grade(d.w.id,g);
  const r=S.items[d.w.id];if(r){r.last=d.kind;save();}
  if(g===2)ctx.session.right++;
  ctx.session.vus=(ctx.session.vus||0)+1;
  replanifie(d.w.id,g===2);
  beep(g===2?'ok':'no');
}

function vNext(){
  const Z=ctx.session;
  if(Z.i<Z.ids.length-1){
    Z.i++;ctx.show=0;
    ctx.d=makeDrill(curWord());
  }else Z.done=true;
  render();scrollTo(0,0);
}

function vAnswer(j){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=j;
  vGrade(j===d.ok?2:0);
  render();
}

function vSubmit(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez la phrase avant de valider.');
  d.txt=txt;
  const good=(normZh(txt)===normZh(d.s.hz));
  d.ans=good?1:0;
  vGrade(good?2:1);
  render();
}

function vSkip(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=-1;d.txt=(document.getElementById('zi')||{}).value||'';
  vGrade(0);render();
}

function vTraceDone(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=1;
  vGrade(d.mist===0?2:(d.mist<=2?1:0));
  render();
}

/* ---- Pinyin écrit au clavier, tons chiffrés ------------------------
   Le seul exercice qui force à produire le ton au lieu de le reconnaître.
   On accepte les chiffres comme les accents, et le u tréma écrit « v ». */
function pyNorm(t){
  return String(t||'').trim().toLowerCase()
    .replace(/([a-zü]+)\s*([0-5])/g,'$1$2 ')
    .split(/[\s,’']+/).filter(Boolean)
    .map(x=>{
      const m=x.match(/^([a-züv]+)([0-5])$/);
      if(m)return pyBare(m[1])+(m[2]==='5'?0:Number(m[2]));
      return pyRead(x);
    }).join(' ');
}
function vPy(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('pyin');
  const txt=el?el.value:'';
  if(!txt.trim())return toast('Écrivez le pinyin avant de valider.');
  d.txt=txt;
  const att=pySyls(d.w.py).map(pyRead).join(' ');
  const don=pyNorm(txt);
  const bon=(don===att);
  /* Bonnes syllabes, mauvais tons : c’est une hésitation, pas un échec. */
  const memeSyl=don.replace(/[0-9]/g,'')===att.replace(/[0-9]/g,'');
  d.ans=bon?1:0;d.memeSyl=memeSyl;
  vGrade(bon?2:(memeSyl?1:0));
  render();
}

/* ---- Complétion à l’aveugle : même trou, mais rien à choisir ------- */
function vTrouW(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez le mot manquant.');
  d.txt=txt;
  const bon=(normZh(txt)===normZh(d.cible.hz));
  d.ans=bon?1:0;
  vGrade(bon?2:0);
  render();
}

/* ---- Remise en ordre ------------------------------------------------- */
function vOrdTap(i){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.built.push(d.bag[i]);d.bag.splice(i,1);
  if(!d.bag.length)vOrdCheck();else render();
}
function vOrdBack(i){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.bag.push(d.built[i]);d.built.splice(i,1);render();
}
function vOrdCheck(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const bon=(d.built.join('')===d.seg.join(''));
  d.ans=bon?1:0;
  vGrade(bon?2:0);
  render();
}
function vOrdReset(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.bag=shuffle(d.seg);d.built=[];render();
}

/* ---- Repérer la faute ------------------------------------------------ */
function vFaute(j){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=j;
  vGrade(j===d.ok?2:0);
  render();
}

/* ---- Réemploi corrigé par le modèle ---------------------------------- */
async function vRemploi(){
  const d=ctx.d;if(!d||d.ans!=null||d.busy)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez votre phrase avant de valider.');
  d.txt=txt;d.busy=true;render();
  try{
    d.corr=await correct(txt,'La phrase doit employer '+d.w.hz+' ('+d.w.fr+'). Dites si l’emploi est juste.');
    d.ans=1;
  }catch(e){
    d.corr='';d.err=(e&&e.message==='aucune clé')
      ?'Aucune clé enregistrée : la phrase n’a pas pu être corrigée. Elle compte tout de même comme un réemploi.'
      :'La correction a échoué : '+((e&&e.message)||e);
    d.ans=1;
  }
  d.busy=false;
  /* On ne peut pas juger à la place du modèle : le réemploi vaut une
     hésitation, jamais un échec. La lecture de la correction fait le
     reste du travail. */
  vGrade(1);
  render();
}
function vRemploiJuge(g){
  const d=ctx.d;if(!d)return;
  notePremier(d.w.id,g,d.kind);
  grade(d.w.id,g);
  if(g===2)ctx.session.right++;
  beep(g===2?'ok':'no');
  vNext();
}

/* Tracé de mémoire : un carré par caractère, enchaînés automatiquement. */
let TW=[];

function mountTrace(){
  const d=ctx.d;
  if(!d||d.kind!=='trace'||typeof HanziWriter==='undefined')return;
  /* Une séance de tracé déjà en cours et toujours à l’écran : ne pas la relancer. */
  if(d.ans==null&&d.mounted){
    const el0=document.getElementById('tw0');
    if(el0&&el0.childNodes.length)return;
  }
  const chars=hanOf(d.w.hz);
  TW=[];
  chars.forEach((c,k)=>{
    const el=document.getElementById('tw'+k);if(!el)return;
    el.innerHTML='';
    /* La taille de la case est fixee par la feuille de style : on la
       mesure au lieu de la redire ici, sans quoi les deux valeurs
       finiraient par diverger. */
    const size=el.clientWidth||el.offsetWidth||138;
    TW.push(HanziWriter.create(el,c,{width:size,height:size,padding:8,
      showCharacter:d.ans!=null,showOutline:d.ans!=null,delayBetweenStrokes:150,
      ...teintesTrace()}));
  });
  if(d.ans!=null)return;
  d.mounted=true;
  const run=k=>{
    if(k>=TW.length)return vTraceDone();
    TW[k].quiz({onComplete(r){
      d.mist+=r.totalMistakes;
      TW[k].showCharacter();TW[k].showOutline();
      const box=document.getElementById('tw'+k);if(box)box.className='tbox ok';
      setTimeout(()=>run(k+1),320);
    }});
  };
  run(0);
}

function vReveal(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=-1;beep('no');notePremier(d.w.id,0,d.kind);grade(d.w.id,0);render();
  setTimeout(()=>TW.forEach((t,i)=>setTimeout(()=>t.animateCharacter(),i*900)),120);
}
