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
    <div class="kpi"><b style="color:var(--red)">${todo}</b><span>à réviser au filtre</span></div>
    <div class="kpi"><b style="color:var(--gold-d)">${seen}</b><span>mots rencontrés</span></div>
    <div class="kpi"><b style="color:var(--jade)">${mast}</b><span>mots acquis</span></div>
    <div class="kpi"><b style="color:var(--indigo)">${S.written.length}</b><span>écrits produits</span></div>
  </div>
  <h2 class="sec">Répartition par boîte</h2>
  <div class="box">
    ${boxes.map((n,b)=>`<div style="display:flex;align-items:center;gap:10px;margin-bottom:9px">
      <span class="mut sm" style="width:56px;flex:none">Boîte ${b}</span>
      <span class="bar" style="flex:1"><i style="width:${n/maxb*100}%;background:${b>=4?'var(--jade)':b>=2?'var(--gold)':'var(--red)'}"></i></span>
      <span class="sm" style="width:24px;text-align:right">${n}</span></div>`).join('')}
    <p class="mut sm" style="margin:10px 0 0">Un mot monte d’une boîte à chaque réussite. Boîte 4 ou 5 = acquis. Un échec le renvoie en boîte 0. Les mots des boîtes basses sortent en priorité dans les exercices des parcours.</p>
  </div>
  <h2 class="sec">Parcours</h2>
  <div class="box">
    <div class="bar"><i style="width:${pcent}%;background:var(--red)"></i></div>
    <p class="mut sm" style="margin:10px 0 0">${stepsDone} étape${stepsDone>1?'s':''} validée${stepsDone>1?'s':''} sur ${stepsAll}, tous parcours et tous niveaux confondus — ${pcent} %.</p>
  </div>
  ${LESSONS.map(l=>{const p=(S.lessons[l.id]||[]).length;
    return `<div class="wrow"><span class="g" style="font-family:var(--ui);font-size:19px;color:var(--red)">${p>=l.steps.length?'成':'路'}</span>
    <span class="m"><b>${esc(l.title)}</b><span class="mut">${p} / ${l.steps.length} étapes</span>
    <span class="bar" style="margin-top:6px"><i style="width:${p/l.steps.length*100}%;background:var(--red)"></i></span></span></div>`;}).join('')}`;
}
