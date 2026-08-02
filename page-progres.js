/* ---------- Progrès ---------- */
function vProgres(){
  const all=WORDS.concat(CHARS);
  const seen=all.filter(w=>S.items[w.id]).length;
  const mast=all.filter(w=>mastered(w.id)).length;
  const todo=pool().filter(w=>due(w.id)).length;
  const boxes=[0,1,2,3,4,5].map(b=>all.filter(w=>S.items[w.id]&&S.items[w.id].box===b).length);
  const maxb=Math.max(1,...boxes);
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
  <h2 class="sec">Répartition par boîte</h2>
  <div class="box">
    ${boxes.map((n,b)=>`<div class="u-d-flex u-ai-center u-gp3 u-mbo2">
      <span class="u-w-56 u-fx-none mut sm">Boîte ${b}</span>
      <span class="u-fx-1 bar"><i class="${b>=4?'ok':b>=2?'mi':'no'}" style="width:${n/maxb*100}%"></i></span>
      <span class="u-w-24 u-ta-right sm">${n}</span></div>`).join('')}
    <p class="u-mh3 mut sm">Un mot monte d’une boîte à chaque réussite. Boîte 4 ou 5 = acquis. Un échec le renvoie en boîte 0. Les mots des boîtes basses sortent en priorité dans les exercices des parcours.</p>
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
