/* =====================================================================
   MODULE GRAMMAIRE

   Trois temps, dans cet ordre :
     découverte écran par écran → fiche complète → exercices.
   La découverte et la fiche complète lisent les mêmes données : une
   correction faite une fois vaut pour les deux rendus.
   ===================================================================== */

const FAMCLASS={nom:'c-indigo',verbe:'c-jade',phrase:'c-plum'};

function gById(id){return GRAMMAR.find(g=>g.id===id);}
function famOf(k){return FAM.find(f=>f.k===k)||FAM[2];}
/* Progression propre à la grammaire, distincte des boîtes de vocabulaire.
   S.items[id] porte la boîte de Leitner ; S.gram[id] retient si la
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
   1. SOMMAIRE DU MODULE
   ===================================================================== */
function vGramHome(){
  const dispo=GRAMMAR.filter(fits);
  const revoir=GRAMMAR.filter(g=>S.items[g.id]&&due(g.id));
  return `${header('Grammaire','Fiches, découverte et systématisation')}
  ${levelPills(l=>GRAMMAR.filter(g=>g.hsk===l).length)}
  ${themeSelect()}

  <div class="gsub">Les fiches de mon niveau</div>
  ${dispo.length?dispo.map(ligneFiche).join(''):nothing('Aucune fiche de grammaire à ce niveau et sur ce thème. Les quatre fiches écrites couvrent « Se présenter » et « Présenter et décrire quelqu’un », en HSK 2 et HSK 3.')}

  <div class="gsub">Explorer</div>
  <button class="grow c-indigo" onclick="go('index')">
    <span class="em">目</span>
    <span class="tx"><b>Index grammatical</b><small>Les ${GRAMMAR.length} fiches par famille, tous niveaux</small></span>
  </button>
  <button class="grow ${revoir.length?'c-plum':''}" onclick="go('revoir')">
    <span class="em">复</span>
    <span class="tx"><b>Points à revoir</b><small>${revoir.length?revoir.length+' fiche'+(revoir.length>1?'s':'')+' à reprendre':'Rien à reprendre pour l’instant'}</small></span>
    ${revoir.length?`<span class="st due">${revoir.length}</span>`:''}
  </button>`;
}

function ligneFiche(g){
  const f=famOf(g.fam), r=gRec(g.id), b=boxOf(g.id);
  let etat='', cls='';
  if(!r.vu){etat='À découvrir';}
  else if(S.items[g.id]&&due(g.id)){etat='À revoir';cls='due';}
  else if(mastered(g.id)){etat='Acquis';cls='ok';}
  else{etat='Boîte '+b;}
  return `<button class="grow ${FAMCLASS[g.fam]||''}" onclick="ouvrir('${g.id}')">
    <span class="em">${f.em}</span>
    <span class="tx"><b>${esc(g.title)}</b><small>HSK ${g.hsk} · ${esc(f.n.toLowerCase())}</small></span>
    <span class="st ${cls}">${etat}</span>
  </button>`;
}

/* Une fiche jamais ouverte commence par la découverte ; ensuite, on
   arrive directement sur la fiche complète, qui sert de référence. */
function ouvrir(id){
  const r=gRec(id);
  if(r.vu)go('fiche',{g:id});
  else go('decouv',{g:id,i:0});
}

function vIndex(){
  return `${header('Index grammatical','Toutes les fiches, tous niveaux')}
  ${FAM.map(f=>{
    const l=GRAMMAR.filter(g=>g.fam===f.k).sort((a,b)=>a.hsk-b.hsk);
    if(!l.length)return '';
    return `<div class="gsub">${esc(f.n)}</div>${l.map(ligneFiche).join('')}`;
  }).join('')}
  <p class="sm mt">Trente-deux fiches restent à écrire pour couvrir le programme jusqu’au HSK 6.</p>`;
}

function vRevoir(){
  const l=GRAMMAR.filter(g=>S.items[g.id]&&due(g.id));
  return `${header('Points à revoir','Les fiches dont les exercices ont échoué')}
  ${l.length?l.map(ligneFiche).join(''):
    `<div class="void"><span class="em">净</span><p><b>Rien à reprendre</b></p>
     <p class="sm">Une fiche revient ici quand ses exercices tombent sous 75 %, puis à chaque échéance de sa boîte.</p></div>`}`;
}

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
    <h3>${esc(st.t)}</h3>
    ${st.p.map(p=>`<p>${p}</p>`).join('')}
    ${(st.ex||[]).map(exBloc).join('')}
  </div>

  ${st.check?blocCheck(st.check,rep):''}

  ${(!st.check||rep!=null)?`<button class="btn" onclick="etapeSuivante()">${i+1<n?'Emploi suivant':'Dernier point'}</button>`:''}
  <button class="btn pale mt" onclick="go('fiche',{g:'${g.id}'})">Voir la fiche complète tout de suite</button>`;
}

function exBloc(e){
  return `<div class="gex">
    <div class="hz">${esc(e.hz)}</div>
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
    <h3>${esc(st.t)}</h3>
    ${st.p.map(p=>`<p>${p}</p>`).join('')}
    ${(st.ex||[]).map(exBloc).join('')}
  </div>`).join('')}

  ${g.tableau?`<div class="gsec">
    <h3>Récapitulatif</h3>
    <table class="gtab"><tr>${g.tableau.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>
    ${g.tableau.rows.map(rw=>`<tr>${rw.map(c=>`<td><div class="gc">${esc(c)}</div></td>`).join('')}</tr>`).join('')}
    </table></div>`:''}

  ${blocPiege(g)}

  ${(g.voir||[]).length?`<div class="gsec"><h3>Voir aussi</h3><div class="gvoir">
    ${g.voir.map(v=>{const o=gById(v);return o?`<button class="pill" onclick="ouvrir('${o.id}')">${esc(o.title)}</button>`:'';}).join('')}
  </div></div>`:''}

  <button class="btn" onclick="lancerExos('${g.id}')">
    ${r.essais?'Refaire les exercices':'Passer aux exercices'}
  </button>
  ${r.essais?`<p class="sm mt">Déjà tentés ${r.essais} fois, meilleur score ${r.best} %. Les phrases changent à chaque passage.</p>`:''}
  <button class="btn pale mt" onclick="go('decouv',{g:'${g.id}',i:0})">Revoir la découverte pas à pas</button>`;
}

/* =====================================================================
   4. EXERCICES DE SYSTÉMATISATION
   Six familles, du plus guidé au plus libre. Une session tire au sort
   dans les banques de la fiche : le fonctionnement ne change pas, les
   phrases si.
   ===================================================================== */
function fillGabarit(ga){
  const acc={};
  Object.keys(ga.listes).forEach(k=>{acc[k]=shuffle(ga.listes[k])[0];});
  return {seg:ga.cadre.map(t=>t.s?acc[t.s]:t),fr:ga.fr,mots:Object.keys(acc).map(k=>acc[k].fr)};
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
              :`<span class="tile" style="border-color:transparent;box-shadow:none">${esc(t.h)}</span>`;
  }).join('')}</div>
  <p class="sm mt">${esc(q.s.fr)}</p>
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'Bien vu.':'L’élément attendu était '+esc(q.s.seg[q.s.cle].h)+'.'}
    <div class="gpy mt">${pinyin(segPy(q.s.seg))}</div></div>${boutonSuite()}`:''}`;
}
function repRep(k,cle){ctx.rep=k;noter(k===cle);}

/* --- Substitution : reconstruire la phrase engendrée par le gabarit --- */
function exSub(q){
  return assemblage(segMots(q.d.seg),q.d.seg,
    `Construisez la phrase : <b>${esc(q.d.fr)}</b>${q.d.mots.length?' <span class="sm">('+q.d.mots.map(esc).join(', ')+')</span>':''}`);
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
    '<span class="sm" style="color:var(--line2)">Touchez les étiquettes ci-dessous</span>'}</div>
  <div class="tiles mt">${reste.map(x=>
    `<button class="tile" ${fait?'disabled':''} onclick="poser(${x.k})">${esc(x.m.h)}</button>`).join('')}</div>
  ${!fait&&bac.length===mots.length?`<button class="btn mt" onclick="verifAssemblage()">Vérifier</button>`:''}
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'Exact.':'La phrase attendue était :'}
    <div class="hz mt" style="font-size:20px">${esc(segHz(seg))}</div>
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

/* --- Complétion : replacer l’outil manquant --- */
function exComp(q,g){
  const fait=ctx.res[ctx.i]!=null;
  const bon=q.s.seg[q.s.cle].h;
  ctx.choix=ctx.choix||{};
  if(!ctx.choix[ctx.i]){
    const autres=shuffle((g.leurres||[]).filter(x=>x!==bon)).slice(0,3);
    ctx.choix[ctx.i]=shuffle(autres.concat([bon]));
  }
  const opts=ctx.choix[ctx.i];
  return `<p>Complétez la phrase.</p>
  <div class="sentence" style="font-size:23px;font-weight:700;line-height:1.6">
    ${q.s.seg.map((t,k)=>k===q.s.cle
      ?`<span style="border-bottom:3px solid var(--gold);padding:0 14px">${fait?esc(bon):'&nbsp;'}</span>`
      :esc(t.h)).join('')}
  </div>
  <p class="sm">${esc(q.s.fr)}</p>
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
              :`<span class="tile" style="border-color:transparent;box-shadow:none">${esc(t.h)}</span>`;
  }).join('')}</div>
  ${fait?`<div class="verdict ${ctx.res[ctx.i]?'ok':'no'}">
    ${ctx.res[ctx.i]?'C’est bien là que ça coince.':'La faute portait sur '+esc(q.d.seg[q.d.bad].h)+'.'}
    <div class="hz mt" style="font-size:20px;color:var(--jade-d)">${esc(q.d.bon)}</div>
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
    <h3 style="margin-top:14px">À vérifier dans votre phrase</h3>
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
    ${reussi?`Fiche validée. Elle passe en boîte ${boxOf(g.id)} et reviendra le moment venu.`
            :'Sous 75 % : la fiche retourne en boîte 0 et réapparaît dans « Points à revoir ».'}
  </div>
  <button class="btn" onclick="lancerExos('${g.id}')">Refaire, avec d’autres phrases</button>
  <button class="btn pale mt" onclick="go('fiche',{g:'${g.id}'})">Retourner à la fiche</button>
  <button class="btn pale mt" onclick="tab('home')">Revenir à l’accueil</button>`;
}
