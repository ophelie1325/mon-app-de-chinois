function vHome(){
  const P=pool();
  const todo=P.filter(w=>due(w.id)).length;
  const ma=P.filter(w=>mastered(w.id)).length;
  return `<div class="hero">
    <span class="mark">汉</span>
    <h1>Bonjour Ophélie</h1>
    <div class="sub">HSK ${S.settings.level}${S.settings.theme!=='all'?' · '+esc(themeName(S.settings.theme)):''}</div>
    <div class="rule"></div>
    <div class="figs">
      <div class="fig"><b>${todo}</b><span>À RÉVISER</span></div>
      <div class="fig"><b>${ma}</b><span>ACQUIS</span></div>
      <div class="fig"><b>${S.streak.n}</b><span>JOURS DE SUITE</span></div>
    </div>
    <button class="cta" onclick="nav('vocab')">${todo?'Réviser '+todo+' mot'+(todo>1?'s':''):'Tout est à jour — réviser quand même'}</button>
  </div>
  ${levelPills()}
  ${themeSelect()}
  <div class="grid">
  ${MODULES.map(m=>{
    let sub=m.d,frac=null;
    if(m.id==='vocab'){sub=todo?todo+' à réviser':'À jour';frac=P.length?ma/P.length:0;}
    if(m.id==='parcours'){const l=currentLesson();const p=l?lessonProgress(l):0;
      sub=l?`${themeName(l.theme)} · ${p} / ${l.steps.length} étapes`:'Aucun parcours à ce niveau';
      frac=l?p/l.steps.length:0;}
    if(m.wide)return `<button class="mod wide c-${m.c}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <span class="col"><b>${esc(m.n)}</b><span>${esc(sub)}</span>
        ${frac!==null?`<span class="bar" style="margin-top:7px"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}</span>
      </button>`;
    return `<button class="mod c-${m.c}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <b>${esc(m.n)}</b><span>${esc(sub)}</span>
      ${frac!==null?`<span class="bar"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}
    </button>`;
  }).join('')}
  </div>
  ${memoryOnly?`<div class="box mt"><p><b>Sauvegarde inactive</b></p><p class="mut sm">Le navigateur bloque le stockage dans cet aperçu. Une fois publiée sur GitHub Pages, la progression sera conservée.</p></div>`:''}`;
}
