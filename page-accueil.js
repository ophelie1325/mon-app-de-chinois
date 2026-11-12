/* Les trois lanternes du panneau d’accueil (maquette « 3D, version 4 ») :
   corps rouge en volume, coiffes et pompon dorés, 福 en or, et un halo
   qui vacille. Trois tailles, trois hauteurs, trois balancements
   décalés. Les dégradés sont déclarés dans la première et servent aux
   deux autres. Les positions et les rythmes vivent dans core.css. */
function lanterne(n,defs){
  return `<span class="lant3 l${n}" aria-hidden="true"><svg viewBox="0 0 60 120">${defs?`<defs>
    <radialGradient id="lantCorps" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#FF7A5C"/><stop offset=".55" stop-color="#E0402F"/><stop offset="1" stop-color="#9E1F1A"/></radialGradient>
    <linearGradient id="lantOr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FBE3A2"/><stop offset="1" stop-color="#C9922F"/></linearGradient></defs>`:''}
    <line x1="30" y1="0" x2="30" y2="16" stroke="#F0D08A" stroke-width="1.6"/>
    <ellipse class="halo" cx="30" cy="54" rx="34" ry="34" fill="#FFB25A"/>
    <rect x="18" y="14" width="24" height="8" rx="3" fill="url(#lantOr)"/>
    <ellipse cx="30" cy="54" rx="27" ry="31" fill="url(#lantCorps)"/>
    <path d="M30 23v62M19 26c-8 16-8 40 0 56M41 26c8 16 8 40 0 56" stroke="#F3C76A" stroke-width="1.3" fill="none" opacity=".75"/>
    <ellipse cx="22" cy="42" rx="6" ry="10" fill="#fff" opacity=".18"/>
    <text x="30" y="61" text-anchor="middle" font-family="Noto Serif SC, serif" font-weight="700" font-size="18" fill="#FBE3A2">福</text>
    <rect x="18" y="83" width="24" height="8" rx="3" fill="url(#lantOr)"/>
    <circle cx="30" cy="96" r="3.2" fill="#F0C04A"/>
    <path d="M25 99h10l-1.5 19h-7z" fill="#E8B64A"/>
    <path d="M27 100v17M30 100v18M33 100v17" stroke="#B98526" stroke-width=".8"/></svg></span>`;
}
const LANTERNES=lanterne(1,true)+lanterne(2)+lanterne(3);

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
  const lc=currentLesson(),lp=lc?lessonProgress(lc):0;
  /* Bànbàn salue, ou dort s’il ne s’est rien passé aujourd’hui. */
  const dort=!actifAujourdhui();
  return `<div class="hero">
    <span class="mark" aria-hidden="true">伴</span>
    ${LANTERNES}
    ${banban(dort?'dort':'salut',dort?'panda dort':'panda salue',1)}
    <span class="bulle" aria-hidden="true"><span class="hz"><span class="s1">加</span><span class="s2">油</span></span>\u202F!</span>
    <div class="col">
      <h1>Bonjour Ophélie</h1>
      <div class="sub">HSK ${S.settings.level}${S.settings.theme!=='all'?' · '+esc(themeName(S.settings.theme)):''}</div>
      ${lc?`<div class="prog"><div class="lb">${esc(themeName(lc.theme))} · étape ${Math.min(lp+1,lc.steps.length)} sur ${lc.steps.length}</div>
        <div class="tr"><i style="width:${Math.round(lp/lc.steps.length*100)}%"></i></div></div>`:''}
      <div class="figs">
        <div class="fig"><b>${todo}</b><span>à réviser</span></div>
        <div class="fig"><b>${ma}</b><span>acquis</span></div>
        <div class="fig"><b>${S.streak.n}</b><span>jour${S.streak.n>1?'s':''} de suite</span></div>
      </div>
    </div>
    <button class="cta" onclick="nav('vocab')">${todo?'Réviser '+todo+' mot'+(todo>1?'s':''):'Tout est à jour — réviser quand même'}</button>
  </div>
  ${levelPills()}
  ${themeSelect()}
  <h2 class="titre-acc"><span class="ink">Mes modules${encre()}</span></h2>
  <div class="grid">
  ${MODULES.map((m,k)=>{
    let sub=m.d,frac=null;
    if(m.id==='vocab'){sub=todo?todo+' à réviser':'À jour';frac=P.length?ma/P.length:0;}
    if(m.id==='parcours'){const l=currentLesson();const p=l?lessonProgress(l):0;
      sub=l?`${themeName(l.theme)} · ${p} / ${l.steps.length} étapes`:'Aucun parcours à ce niveau';
      frac=l?p/l.steps.length:0;}
    const cur=m.id===enCours?' cur':'';
    if(m.wide)return `<button class="mod wide c-${m.c}${cur}" style="--i:${k}" data-em="${m.em}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <span class="col"><b>${esc(m.n)}</b><span>${esc(sub)}</span>
        ${frac!==null?`<span class="u-mt2 bar"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}</span>
      </button>`;
    return `<button class="mod c-${m.c}${cur}" style="--i:${k}" data-em="${m.em}" onclick="nav('${m.id}')">
      <span class="emb">${m.em}</span>
      <b>${esc(m.n)}</b><span>${esc(sub)}</span>
      ${frac!==null?`<span class="bar"><i style="width:${Math.round(frac*100)}%"></i></span>`:''}
    </button>`;
  }).join('')}
  </div>
  ${memoryOnly?`<div class="box mt"><p><b>Sauvegarde inactive</b></p><p class="mut sm">Le navigateur bloque le stockage dans cet aperçu. Une fois publiée sur GitHub Pages, la progression sera conservée.</p></div>`:''}`;
}
