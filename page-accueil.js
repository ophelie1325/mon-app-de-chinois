/* Les deux lanternes suspendues du panneau d’accueil, telles que
   validées : corps vermillon, armature et franges or, la seconde plus
   petite et pendue plus bas. Ici, la géométrie seule — les teintes, les
   épaisseurs de trait, le balancement de 4,5° et le décalage entre les
   deux vivent dans core.css avec le reste de l’apparence. Les groupes
   c1 et c2 sont les points de pivot. */
const LANTERNES=`<svg class="lant" viewBox="0 0 60 92" aria-hidden="true">
      <g class="c1">
        <line x1="20" y1="0" x2="20" y2="16" class="l-fil"/>
        <path d="M12 16 H28 L26 21 H14 Z" class="l-armature"/>
        <ellipse cx="20" cy="35" rx="14" ry="14.5" class="l-corps"/>
        <path d="M13 24 Q10 35 13 46 M27 24 Q30 35 27 46" class="l-cotes"/>
        <path d="M14 49 H26 L28 54 H12 Z" class="l-armature"/>
        <path d="M16 55 L15 66 M20 56 L20 68 M24 55 L25 66" class="l-franges"/>
      </g>
      <g class="c2">
        <line x1="44" y1="0" x2="44" y2="30" class="l-fil"/>
        <path d="M37 30 H51 L49 35 H39 Z" class="l-armature"/>
        <ellipse cx="44" cy="48" rx="12.5" ry="13" class="l-corps"/>
        <path d="M38 38 Q35 48 38 58 M50 38 Q53 48 50 58" class="l-cotes"/>
        <path d="M38 60 H50 L52 65 H36 Z" class="l-armature"/>
        <path d="M40 66 L39 76 M44 67 L44 78 M48 66 L49 76" class="l-franges"/>
      </g>
    </svg>`;

function vHome(){
  const P=pool();
  /* Une seule tuile porte la cornière or : celle qui prolonge le
     travail en cours. Le parcours prime, sinon les mots à réviser. */
  const enCours=(function(){
    const l=currentLesson();
    if(l&&lessonProgress(l)<l.steps.length)return 'parcours';
    return P.filter(w=>due(w.id)).length?'vocab':'parcours';
  })();
  const todo=P.filter(w=>due(w.id)).length;
  const ma=P.filter(w=>mastered(w.id)).length;
  return `<div class="hero">
    <span class="mark">汉</span>
    ${LANTERNES}
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
        ${frac!==null?`<span class="u-mt2 bar"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}</span>
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
