/* Les deux lanternes suspendues du panneau d’accueil. Le balancement
   et le décalage entre les deux sont dans core.css ; ici, seul le
   dessin. Les classes c1 et c2 sont les points d’accroche des cordes. */
const LANTERNES=`<svg class="lant" viewBox="0 0 60 92" fill="none" aria-hidden="true">
  <path d="M20 0v14M44 0v10" stroke="#F3D9A6" stroke-width="1.2" opacity=".55"/>
  <g class="c1">
    <ellipse cx="20" cy="26" rx="11" ry="12.5" fill="#C9302B" stroke="#F3D9A6" stroke-width="1.2"/>
    <path d="M13 20h14M13 32h14" stroke="#F3D9A6" stroke-width=".8" opacity=".5"/>
    <rect x="16" y="12.5" width="8" height="2.6" rx="1" fill="#F3D9A6"/>
    <rect x="16" y="37.5" width="8" height="2.6" rx="1" fill="#F3D9A6"/>
    <path d="M20 40v7" stroke="#F3D9A6" stroke-width="1.2"/>
  </g>
  <g class="c2">
    <ellipse cx="44" cy="21" rx="8.5" ry="9.8" fill="#C9302B" stroke="#F3D9A6" stroke-width="1.1"/>
    <path d="M38.5 16.5h11M38.5 25.5h11" stroke="#F3D9A6" stroke-width=".7" opacity=".5"/>
    <rect x="41" y="9.6" width="6" height="2.2" rx="1" fill="#F3D9A6"/>
    <rect x="41" y="30.2" width="6" height="2.2" rx="1" fill="#F3D9A6"/>
    <path d="M44 32.4v5.5" stroke="#F3D9A6" stroke-width="1.1"/>
  </g>
</svg>`;

function vHome(){
  const P=pool();
  /* Une seule tuile porte la cornière or : celle qui prolonge le
     travail en cours. Le parcours prime, sinon les mots à réviser. */
  const enCours=(function(){
    const l=currentLesson();
    if(l&&lessonProgress(l)>0&&lessonProgress(l)<l.steps.length)return 'parcours';
    return P.filter(w=>due(w.id)).length?'vocab':'parcours';
  })();
  const todo=P.filter(w=>due(w.id)).length;
  const ma=P.filter(w=>mastered(w.id)).length;
  return `<div class="hero">
    ${LANTERNES}
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
    const cur=m.id===enCours?' cur':'';
    if(m.wide)return `<button class="mod wide c-${m.c}${cur}" data-em="${m.em}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <span class="col"><b>${esc(m.n)}</b><span>${esc(sub)}</span>
        ${frac!==null?`<span class="bar" style="margin-top:7px"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}</span>
      </button>`;
    return `<button class="mod c-${m.c}${cur}" data-em="${m.em}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <b>${esc(m.n)}</b><span>${esc(sub)}</span>
      ${frac!==null?`<span class="bar"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}
    </button>`;
  }).join('')}
  </div>
  ${memoryOnly?`<div class="box mt"><p><b>Sauvegarde inactive</b></p><p class="mut sm">Le navigateur bloque le stockage dans cet aperçu. Une fois publiée sur GitHub Pages, la progression sera conservée.</p></div>`:''}`;
}
