/* ---------- Progrès ---------- */
function vProgres(){
  const all=motsActifs().concat(CHARS.filter(carActif));
  const seen=all.filter(w=>S.items[w.id]).length;
  const mast=all.filter(w=>mastered(w.id)).length;
  const todo=pool().filter(w=>due(w.id)).length;
  /* Les quatre états, comme dans Vocabulaire : les boîtes restent invisibles. */
  const etats=['su','cours','frag','neuf'].map(k=>[k,all.filter(w=>etatMot(w.id)===k).length]);
  const maxe=Math.max(1,...etats.map(e=>e[1]));
  const stepsAll=LESSONS.reduce((n,l)=>n+l.steps.length,0);
  const stepsDone=LESSONS.reduce((n,l)=>n+lessonProgress(l),0);
  const pcent=stepsAll?Math.round(stepsDone/stepsAll*100):0;
  return `<div class="top"><div class="htitle">Mes progrès<small>Tous niveaux confondus</small></div></div>
  <div class="grid2">
    <div class="kpi"><b class="u-c-red">${todo}</b><span>à réviser au filtre</span></div>
    <div class="kpi"><b class="u-c-gold-d">${seen}</b><span>mots rencontrés</span></div>
    <div class="kpi"><b class="u-c-jade">${mast}</b><span>mots acquis</span></div>
    <div class="kpi"><b class="u-c-indigo">${S.written.length}</b><span>écrits produits</span></div>
  </div>
  <h2 class="sec">Où en sont mes mots</h2>
  <div class="box">
    ${etats.map(([k,n])=>`<div class="u-d-flex u-ai-center u-gp3 u-mbo2">
      <span class="pg-et mut sm"><i style="background:${ETATS[k].c}"></i>${ETATS[k].n}</span>
      <span class="u-fx-1 bar"><i class="${k==='su'?'ok':k==='cours'?'mi':k==='frag'?'no':'gr'}" style="width:${n/maxe*100}%"></i></span>
      <span class="u-w-24 u-ta-right sm">${n}</span></div>`).join('')}
    <p class="u-mh3 mut sm">Mots et caractères rencontrés. Un mot réussi s’installe et revient de moins en moins souvent ; un mot raté devient fragile et revient vite, jusqu’à ce qu’il tienne.</p>
  </div>
  <h2 class="sec">Parcours</h2>
  <div class="box">
    <div class="bar"><i class="no" style="width:${pcent}%"></i></div>
    <p class="u-mh3 mut sm">${stepsDone} étape${stepsDone>1?'s':''} validée${stepsDone>1?'s':''} sur ${stepsAll}, tous parcours et tous niveaux confondus — ${pcent} %.</p>
  </div>
  ${LESSONS.map(l=>{const p=(S.lessons[l.id]||[]).length;
    return `<div class="wrow"><span class="u-ff-ui u-tx2 u-c-red g">${p>=l.steps.length?'成':'路'}</span>
    <span class="m"><b>${esc(l.title)}</b><span class="mut">${p} / ${l.steps.length} étapes</span>
    <span class="u-mt2 bar"><i class="no" style="width:${p/l.steps.length*100}%"></i></span></span></div>`;}).join('')}`;
}
