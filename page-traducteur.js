/* =====================================================================
   TRADUCTEUR

   Un traducteur, au sens ordinaire du mot : on choisit le sens, on écrit
   ce qu’on veut — un caractère, un mot, un morceau de phrase, une phrase
   entière — et ça traduit.

   Ce qui le distingue d’un traducteur du commerce tient en deux choses.
   D’abord ce qu’il montre en plus de la traduction : les synonymes avec
   ce qui les sépare, et pour une phrase les autres formulations
   correctes avec leur registre. Ensuite ce qu’on peut en faire :
   l’étoile range n’importe quelle ligne dans le carnet, et l’entrée
   devient immédiatement révisable.

   Le point technique qui décide de tout : au moment où l’étoile est
   pressée, on enregistre avec le mot ce qui a été capté autour de lui —
   phrases d’exemple découpées, voisins confondables, version fautive,
   composition des caractères. C’est ce qui permet aux quatorze types
   d’exercice de se fabriquer ensuite indéfiniment, hors connexion, sans
   jamais rappeler le modèle.

   Le pinyin passe par pinyinCheck ligne par ligne. Un pinyin faux n’est
   pas affiché : une erreur de ton mémorisée coûte plus cher qu’un pinyin
   absent.
   ===================================================================== */

const TRADKEY='coach-chinois-trad';
/* Traduire n’est pas une tâche où l’on veut de la variété : à 0,8 le
   même mot rendait des résultats inégaux d’un essai à l’autre. */
const TRADTEMP=.3;

/* --- Sens de traduction, choisi explicitement ------------------------ */
function tradSens(){return ctx.sens==='fr-zh'?'fr-zh':'zh-fr';}
function setSens(s){ctx.sens=s;ctx.r=null;ctx.err='';render();}
function tradSwap(){tradGarde();setSens(tradSens()==='zh-fr'?'fr-zh':'zh-fr');}
function tradGarde(){const t=document.getElementById('tin');if(t)ctx.q=t.value;}
function tradVide(){ctx.q='';ctx.r=null;ctx.err='';render();}

/* --- Récents : simple commodité pour revenir en arrière -------------- */
function tradHist(){try{return JSON.parse(localStorage.getItem(TRADKEY)||'[]');}catch(e){return [];}}
function tradPush(e){try{const h=tradHist().filter(x=>x.q!==e.q);h.unshift(e);
  localStorage.setItem(TRADKEY,JSON.stringify(h.slice(0,12)));}catch(e){}}
function tradWipe(){try{localStorage.removeItem(TRADKEY);}catch(e){}render();}
function tradRappel(q,s){ctx.q=q;ctx.sens=s;ctx.r=null;ctx.err='';render();}

/* =====================================================================
   L’APPEL AU MODÈLE

   Un seul appel, qui rapporte tout. Passer par correct() était une
   erreur : cette fonction enrobe sa consigne dans un gabarit de
   correction de copie, si bien que le modèle recevait deux ordres
   contradictoires — ne réponds qu’en JSON, et rends une correction
   française en trois points. Il obéissait au second, la lecture du JSON
   échouait, et le bouton « Traduire » ne pouvait pas fonctionner.
   On appelle donc directement, avec un schéma.
   ===================================================================== */
/* Chaque objet imbriqué déclare ses champs obligatoires. Sans cela le
   modèle est libre de n’émettre que « hz » dans un synonyme et de rendre
   « ex » vide — ce qui arrivait, au hasard de la température, et privait
   silencieusement le carnet de quatre épreuves. */
const TXT={type:'STRING'};
const SEG={type:'ARRAY',items:TXT};
const VOISIN={type:'OBJECT',properties:{hz:TXT,py:TXT,fr:TXT,note:TXT},
  propertyOrdering:['hz','py','fr','note'],required:['hz','py','fr','note']};
const PHRASE={type:'OBJECT',properties:{hz:TXT,py:TXT,fr:TXT,seg:SEG},
  propertyOrdering:['hz','py','fr','seg'],required:['hz','py','fr','seg']};
const VARIANTE={type:'OBJECT',properties:{hz:TXT,py:TXT,fr:TXT,reg:TXT,note:TXT,seg:SEG},
  propertyOrdering:['hz','py','fr','reg','note','seg'],required:['hz','py','fr','reg','note','seg']};
const PART={type:'OBJECT',properties:{p:TXT,role:TXT,sens:TXT},
  propertyOrdering:['p','role','sens'],required:['p','role','sens']};
const CARACT={type:'OBJECT',properties:{c:TXT,parts:{type:'ARRAY',items:PART},note:TXT},
  propertyOrdering:['c','parts','note'],required:['c','parts','note']};
const FAUTE={type:'OBJECT',properties:{hz:TXT,note:TXT},
  propertyOrdering:['hz','note'],required:['hz','note']};
const TRADSCHEMA={type:'OBJECT',properties:{
  type:TXT,hz:TXT,py:TXT,fr:TXT,note:TXT,seg:SEG,
  syn:{type:'ARRAY',items:VOISIN},
  alts:{type:'ARRAY',items:VARIANTE},
  ex:{type:'ARRAY',items:PHRASE},
  vois:{type:'ARRAY',items:VOISIN},
  faute:FAUTE,
  decomp:{type:'ARRAY',items:CARACT}
},
propertyOrdering:['type','hz','py','fr','note','seg','syn','alts','ex','vois','faute','decomp'],
required:['type','hz','py','fr','note','seg','syn','alts','ex','vois','faute','decomp']};

/* Le complément : même forme, demandé seulement sur ce qui manque. */
const COMPSCHEMA={type:'OBJECT',properties:{
  py:TXT,
  syn:{type:'ARRAY',items:VOISIN},
  ex:{type:'ARRAY',items:PHRASE},
  vois:{type:'ARRAY',items:VOISIN},
  decomp:{type:'ARRAY',items:CARACT},
  faute:FAUTE
},propertyOrdering:['py','syn','ex','vois','decomp','faute'],
required:['py','syn','ex','vois','decomp','faute']};

function tradSys(){
  return `Tu es professeur de chinois pour une apprenante francophone de niveau HSK${S.settings.level}.
Tu traduis, et tu fournis en même temps de quoi fabriquer des exercices de mémorisation.

Règles absolues sur le pinyin :
— syllabe par syllabe, séparées par des espaces : « míng zi », jamais « míngzi » ;
— accents de ton, jamais de chiffres ; ton neutre non marqué ;
— exactement autant de syllabes que de caractères chinois, sans exception.
Si tu n’es pas certain d’un ton, laisse le champ pinyin vide plutôt que de deviner.

Le champ « seg » découpe une phrase chinoise en mots, dans l’ordre, sous forme
de tableau : ["我","很","喜欢","中国","菜"]. Recollés, ils doivent redonner la
phrase exactement, sans rien ajouter ni retrancher. Six à dix morceaux au plus.

Tout le français est rédigé avec des apostrophes typographiques (’).`;
}

function tradPrompt(q,sens){
  const dir=sens==='zh-fr'
    ? 'Traduis en français ce texte chinois.'
    : 'Traduis en chinois simplifié ce texte français, dans la langue la plus ordinaire.';
  return `${dir}

Texte :
${q}

Renseigne :
· type — « mot » si c’est une unité lexicale, « morceau » si c’est un bout de
  phrase ou une structure incomplète (一边…一边, 有点儿, 从…开始), « phrase » si
  c’est une phrase complète qui se suffit à elle-même. Ne compte pas les
  caractères : 中华人民共和国 est un mot, 我去 est une phrase.
· hz, py, fr — la traduction principale, sous sa forme la plus ordinaire.
· note — une remarque de langue brève, ou une chaîne vide.
· seg — le découpage de hz, si c’est une phrase ou un morceau.
· syn — deux à quatre synonymes ou équivalents proches. Pour chacun, « note »
  dit ce qui le sépare du mot principal et dans quel cas on le préfère. C’est
  la partie la plus utile : sois précis, pas décoratif.
· alts — si c’est une phrase : deux ou trois autres formulations correctes.
  « reg » donne le registre (courant, écrit, soutenu, oral familier) et « note »
  dit ce qui change. Tableau vide si c’est un mot.
· ex — deux ou trois phrases d’exemple courtes contenant exactement hz, avec
  leur pinyin, leur traduction et leur découpage. Indispensables : ce sont
  elles qui alimenteront les exercices. Tableau vide seulement si hz est
  lui-même une phrase complète.
· vois — deux mots réellement confondables avec hz par une francophone, qui se
  traduisent pareil en français mais ne s’emploient pas dans les mêmes cas
  (会/能/可以, 二/两, 才/就). « note » énonce la règle qui les sépare.
· faute — une version fautive mais plausible de la première phrase d’exemple,
  du genre d’erreur que fait une francophone, avec la note qui explique
  l’erreur. Le champ hz contient la phrase fautive entière.
· decomp — pour au plus trois caractères de hz : leurs composants, le rôle de
  chacun (clé sémantique, élément phonétique), et ce que le composant signifie.
  « note » dit comment la composition aide à retenir le caractère.`;
}

/* askJSON vit dans core.js : les Réglages s’en servent aussi. */

/* Le garde-fou du pinyin, appliqué ligne par ligne. Un pinyin faux sur un
   synonyme ne doit pas emporter tout le résultat : on masque cette
   ligne-là, et le reste tient. */
function pyOk(hz,py){
  if(!py||!hz)return '';
  try{return pinyinCheck(hz,py).ok?py:'';}catch(e){return '';}
}

function nettoie(o){
  if(!o||typeof o!=='object')return null;
  const seg=x=>Array.isArray(x)?x.map(y=>String(y||'')).filter(Boolean):null;
  const un=x=>(x&&x.hz)?{hz:String(x.hz),py:pyOk(String(x.hz),String(x.py||'')),
    fr:String(x.fr||''),note:String(x.note||''),reg:String(x.reg||''),seg:seg(x.seg)}:null;
  const r={
    type:['mot','morceau','phrase'].indexOf(o.type)>=0?o.type:'mot',
    hz:String(o.hz||''),fr:String(o.fr||''),note:String(o.note||''),
    seg:seg(o.seg),
    syn:(o.syn||[]).map(un).filter(Boolean),
    alts:(o.alts||[]).map(un).filter(Boolean),
    ex:(o.ex||[]).map(un).filter(Boolean),
    vois:(o.vois||[]).map(un).filter(Boolean),
    faute:(o.faute&&o.faute.hz)?{hz:String(o.faute.hz),note:String(o.faute.note||'')}:null,
    decomp:(o.decomp||[]).filter(c=>c&&c.c).map(c=>({c:String(c.c),note:String(c.note||''),
      parts:(c.parts||[]).filter(p=>p&&p.p)
        .map(p=>({p:String(p.p),role:String(p.role||''),sens:String(p.sens||'')}))}))
  };
  r.py=pyOk(r.hz,String(o.py||''));
  r.pyMasque=!!(o.py&&!r.py);
  /* Un découpage qui ne recolle pas à la phrase est inutilisable : il
     produirait une remise en ordre impossible à réussir. */
  if(r.seg&&r.seg.join('')!==r.hz)r.seg=null;
  r.ex.forEach(x=>{if(x.seg&&x.seg.join('')!==x.hz)x.seg=null;});
  r.alts.forEach(x=>{if(x.seg&&x.seg.join('')!==x.hz)x.seg=null;});
  return r.hz?r:null;
}

/* Ce qui manque réellement, du point de vue des exercices — pas du point
   de vue de l’affichage. Une ligne nue à l’écran est un symptôme ; ce qui
   compte, c’est qu’un favori pris maintenant serait amputé pour toujours. */
function lacunes(r){
  const m=[];
  if(!r)return m;
  const unite=(r.type!=='phrase');
  if(unite&&!r.ex.length)m.push('exemples');
  if(unite&&!r.syn.length)m.push('synonymes');
  if(r.syn.some(x=>!x.py||!x.fr||!x.note))m.push('synonymes');
  if(!r.vois.length||r.vois.some(x=>!x.py||!x.fr||!x.note))m.push('voisins');
  if(r.ex.some(x=>!x.py||!x.fr||!x.seg))m.push('exemples');
  if(unite&&!r.decomp.length)m.push('composition');
  if(!r.faute)m.push('version fautive');
  if(!r.py)m.push('pinyin');
  return [...new Set(m)];
}
const LACLABEL={exemples:'les phrases d’exemple',synonymes:'les synonymes complets',
  voisins:'les voisins confondables',composition:'la composition des caractères',
  'version fautive':'la version fautive',pinyin:'le pinyin'};

function compPrompt(r,m){
  return `Complète ce qui manque pour ${r.hz}${r.py?' ('+r.py+')':''} — ${r.fr}.

Il manque : ${m.map(x=>LACLABEL[x]||x).join(', ')}.

Renseigne tous les champs, sans exception :
· py — le pinyin de ${r.hz}, syllabe par syllabe, accents de ton.
· syn — deux à quatre synonymes, chacun avec hz, py, fr et une note qui dit
  précisément ce qui le sépare de ${r.hz} et dans quel cas on le préfère.
· ex — deux ou trois phrases courtes contenant exactement ${r.hz}, avec py, fr
  et seg. Tableau vide uniquement si ${r.hz} est déjà une phrase complète.
· vois — deux mots confondables avec ${r.hz} par une francophone, avec la règle
  qui les sépare.
· decomp — les composants d’un ou deux caractères de ${r.hz}.
· faute — une version fautive plausible de la première phrase d’exemple.`;
}

/* On ne remplace jamais ce qui est déjà bon : on ne comble que les trous. */
function fusionne(r,c){
  if(!c)return r;
  const un=x=>(x&&x.hz)?{hz:String(x.hz),py:pyOk(String(x.hz),String(x.py||'')),
    fr:String(x.fr||''),note:String(x.note||''),reg:String(x.reg||''),
    seg:(Array.isArray(x.seg)&&x.seg.join('')===String(x.hz))?x.seg.map(String):null}:null;
  const mieux=(vieux,neuf)=>{
    const n=(neuf||[]).map(un).filter(Boolean);
    if(!n.length)return vieux;
    const complet=x=>!!(x.py&&x.fr);
    if(!vieux.length||vieux.filter(complet).length<n.filter(complet).length)return n;
    return vieux;
  };
  if(!r.py&&c.py){r.py=pyOk(r.hz,String(c.py));if(r.py)r.pyMasque=false;}
  r.syn=mieux(r.syn,c.syn);
  r.ex=mieux(r.ex,c.ex);
  r.vois=mieux(r.vois,c.vois);
  if(!r.decomp.length&&Array.isArray(c.decomp))
    r.decomp=c.decomp.filter(x=>x&&x.c).map(x=>({c:String(x.c),note:String(x.note||''),
      parts:(x.parts||[]).filter(p=>p&&p.p).map(p=>({p:String(p.p),role:String(p.role||''),
        sens:String(p.sens||'')}))}));
  if(!r.faute&&c.faute&&c.faute.hz)r.faute={hz:String(c.faute.hz),note:String(c.faute.note||'')};
  return r;
}

/* Une relance, une seule. Si elle ne suffit pas, on le dit à l’écran plutôt
   que de laisser croire à un résultat complet. */
async function tradComplete(auto){
  const r=ctx.r;if(!r||ctx.busy)return;
  const m=lacunes(r);
  if(!m.length)return;
  ctx.busy=true;ctx.relance=true;if(!auto)render();
  try{
    const c=await askJSON(tradSys(),compPrompt(r,m),COMPSCHEMA,TRADTEMP);
    ctx.r=fusionne(r,c);
  }catch(e){
    if(!auto)ctx.err='Le complément a échoué : '+((e&&e.message)||e);
  }
  ctx.busy=false;
  if(!auto)render();
}

async function tradGo(){
  tradGarde();
  const q=(ctx.q||'').trim();
  if(!q)return toast('Rien à traduire.');
  if(ctx.busy)return;
  ctx.busy=true;ctx.r=null;ctx.err='';render();
  try{
    const r=nettoie(await askJSON(tradSys(),tradPrompt(q,tradSens()),TRADSCHEMA,TRADTEMP));
    if(!r)ctx.err='Le modèle n’a rien renvoyé d’exploitable. Réessayez.';
    else{
      ctx.r=r;ctx.src=q;ctx.relance=false;
      /* Une relance automatique si l’essentiel manque : elle épargne un
         aller-retour et évite qu’un favori soit pris amputé. */
      if(lacunes(r).length)await tradComplete(true);
      const f=ctx.r;
      tradPush({q:q,s:tradSens(),hz:f.hz,fr:f.fr,t:Date.now()});
    }
  }catch(e){
    ctx.err=(e&&e.message==='aucune clé')
      ? 'Aucune clé n’est enregistrée. Le traducteur ne peut pas fonctionner sans elle : les Réglages permettent d’en ajouter une.'
      : 'La traduction a échoué : '+((e&&e.message)||e);
  }
  ctx.busy=false;render();
}

/* =====================================================================
   LE CARNET

   L’étoile range une ligne. Ce qui compte, c’est qu’elle range aussi le
   contexte capté avec elle — phrases découpées, voisins, version fautive,
   composition — sans quoi les exercices ne seraient plus fabricables
   ensuite qu’en rappelant le modèle.
   ===================================================================== */
function favId(){return 'f'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);}
function favMeme(hz,fr){return (S.fav||[]).find(f=>f.hz===hz&&f.fr===fr)||null;}

function favBuild(o,type){
  const R=ctx.r||{};
  const hz=String(o.hz||''),phrase=(type==='phrase');
  /* Les exemples ne sont gardés que s’ils contiennent réellement l’unité :
     une phrase qui ne contient pas le mot ne peut servir ni au trou, ni à
     la saisie, et donnerait un exercice impossible. */
  const exs=phrase?[]:(R.ex||[]).filter(x=>x.hz&&x.hz.indexOf(hz)>=0)
    .map(x=>({hz:x.hz,py:x.py,fr:x.fr,seg:x.seg}));
  const principal=(hz===R.hz);
  return {
    id:favId(),hz:hz,py:o.py||'',fr:String(o.fr||''),type:type,
    seg:phrase?(o.seg||null):null,
    exs:exs,
    syn:principal?(R.syn||[]).map(x=>({hz:x.hz,py:x.py,fr:x.fr,note:x.note})):[],
    vois:principal?(R.vois||[]).map(x=>({hz:x.hz,py:x.py,fr:x.fr,note:x.note})):[],
    faute:principal?(R.faute||null):null,
    decomp:(R.decomp||[]).filter(c=>hz.indexOf(c.c)>=0),
    note:o.note||'',src:ctx.src||'',t:Date.now()
  };
}

/* Le type d’une ligne : la traduction principale hérite de l’étiquette
   posée par le modèle ; un synonyme est du même ordre que le mot ; une
   variante de registre et une phrase d’exemple sont des phrases. */
function favToggle(quoi,i){
  const R=ctx.r;if(!R)return;
  let o=null,type=R.type;
  if(quoi==='main')o={hz:R.hz,py:R.py,fr:R.fr,note:R.note,seg:R.seg};
  else if(quoi==='saisie'){
    const zh=(tradSens()==='zh-fr');
    o=zh?{hz:ctx.src,py:(ctx.src===R.hz?R.py:''),fr:R.fr}:{hz:R.hz,py:R.py,fr:ctx.src};
  }
  else if(quoi==='syn')o=R.syn[i];
  else if(quoi==='alt'){o=R.alts[i];type='phrase';}
  else if(quoi==='ex'){o=R.ex[i];type='phrase';}
  if(!o||!o.hz)return;
  const fr=String(o.fr||R.fr||'');
  const deja=favMeme(o.hz,fr);
  if(deja){
    S.fav=S.fav.filter(f=>f!==deja);
    delete S.items[deja.id];
    save();render();toast('Retiré du carnet.');
    return;
  }
  S.fav.unshift(favBuild(Object.assign({},o,{fr:fr}),type));
  save();render();
  toast('Au carnet — révisable dès maintenant.');
}

function etoile(quoi,i,hz,fr){
  const on=!!favMeme(hz,fr);
  const lbl=on?'Retirer du carnet':'Mettre au carnet';
  return `<button class="fav ${on?'on':''}" onclick="favToggle('${quoi}',${i})"
    aria-label="${lbl}" title="${lbl}">
    <svg viewBox="0 0 24 24" class="ico etoile">
      <path d="M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6.1L12 17.3 6.7 20.2l1.1-6.1L3.4 9.9l6-.8z"/></svg>
  </button>`;
}

/* =====================================================================
   ÉCRAN
   ===================================================================== */
function ligneZh(hz,py,fr,note,tag){
  return `<div class="tl">
    ${tag?`<div class="tg">${esc(tag)}</div>`:''}
    <div class="hz">${esc(hz)}</div>
    ${py?`<div class="py">${pinyin(py)}</div>`:''}
    ${fr?`<div class="fr">${esc(fr)}</div>`:''}
    ${note?`<p class="u-mh2 mut sm">${esc(note)}</p>`:''}
  </div>`;
}

function tradResultat(){
  const R=ctx.r;if(!R)return '';
  const phr=(R.type==='phrase');
  const dans=DATA('WORDS').filter(w=>w.hz===R.hz);
  const zh=(tradSens()==='zh-fr');
  return `
  <div class="box">
    <div class="trow">
      <div class="tl">
        <div class="u-tx4 u-fw-700 u-lh-125 hz">${esc(R.hz)}</div>
        ${R.py?`<div class="u-tx2 py">${pinyin(R.py)}</div>`:''}
        <div class="u-tx2 u-fw-700 u-mt1 fr">${esc(R.fr)}</div>
      </div>
      ${etoile('main',0,R.hz,R.fr)}
    </div>
    ${R.pyMasque?`<p class="mut sm mt">Le pinyin renvoyé ne correspondait pas aux caractères : il n’est pas affiché, plutôt que de risquer un ton faux en mémoire.</p>`:''}
    ${R.note?`<p class="u-mt2 sm">${esc(R.note)}</p>`:''}
    <div class="row mt">
      <button class="btn jade sm" onclick="speak('${jq(R.hz)}')">Écouter</button>
      <button class="btn pale sm" onclick="stopSpeech()">Arrêter</button>
    </div>
    ${dans.length?`<p class="mut sm mt">Déjà dans le corpus — HSK ${dans[0].hsk}${(dans[0].th||[]).length?' · '+esc(themeName(dans[0].th[0])):''}${mastered(dans[0].id)?' · acquis':''}.</p>`:''}
  </div>

  ${(function(){
    const m=lacunes(R);
    if(!m.length)return '';
    return `<div class="box lac">
      <p class="u-mb2 sm"><b>Résultat incomplet</b></p>
      <p class="mut sm">Le modèle n’a pas renvoyé ${m.map(x=>LACLABEL[x]||x).join(', ')}. ${ctx.relance?'La relance automatique n’a pas suffi.':''} Mis au carnet en l’état, ce mot n’aurait pas toutes ses épreuves : sans phrase d’exemple, la complétion, la remise en ordre et la saisie ne peuvent pas se construire.</p>
      <button class="btn pale sm mt" onclick="tradComplete(false)" ${ctx.busy?'disabled':''}>${ctx.busy?'Complément en cours…':'Compléter'}</button>
    </div>`;
  })()}
  ${(ctx.src&&ctx.src!==R.hz&&ctx.src!==R.fr)?`<div class="box">
    <div class="trow">
      <div class="tl"><div class="tg">Ma formulation de départ</div>
        <div class="u-tx2 ${zh?'hz':'fr'}">${esc(ctx.src)}</div></div>
      ${etoile('saisie',0,zh?ctx.src:R.hz,zh?R.fr:ctx.src)}
    </div>
  </div>`:''}

  ${(!phr&&R.syn.length)?`<h2 class="sec">Synonymes et voisins</h2>
    ${R.syn.map((x,i)=>`<div class="box">
      <div class="trow">${ligneZh(x.hz,x.py,x.fr,x.note,'')}${etoile('syn',i,x.hz,x.fr)}</div>
      <button class="btn pale tiny mt" onclick="speak('${jq(x.hz)}')">Écouter</button>
    </div>`).join('')}`:''}

  ${(phr&&R.alts.length)?`<h2 class="sec">Autres formulations correctes</h2>
    ${R.alts.map((x,i)=>`<div class="box">
      <div class="trow">${ligneZh(x.hz,x.py,x.fr,x.note,x.reg||'')}${etoile('alt',i,x.hz,x.fr||R.fr)}</div>
      <button class="btn pale tiny mt" onclick="speak('${jq(x.hz)}')">Écouter</button>
    </div>`).join('')}`:''}

  ${R.ex.length?`<h2 class="sec">En emploi</h2>
    ${R.ex.map((x,i)=>`<div class="box">
      <div class="trow">${ligneZh(x.hz,x.py,x.fr,'','')}${etoile('ex',i,x.hz,x.fr)}</div>
      <button class="btn pale tiny mt" onclick="speak('${jq(x.hz)}')">Écouter</button>
    </div>`).join('')}`:''}

  ${R.vois.length?`<h2 class="sec">À ne pas confondre</h2>
    <div class="box">${R.vois.map(v=>`<p class="u-mb2 sm">
      <b class="hz">${esc(v.hz)}</b>${v.py?' <span class="py">'+pinyin(v.py)+'</span>':''}${v.fr?' — '+esc(v.fr):''}<br>
      <span class="mut">${esc(v.note||'')}</span></p>`).join('')}
      <p class="u-m0 mut sm">Ces voisins servent aussi de leurres : mis au carnet, le mot donnera l’épreuve « le mot juste ».</p>
    </div>`:''}

  ${R.decomp.length?`<h2 class="sec">Composition</h2>
    <div class="box">${R.decomp.map(c=>`<p class="u-mb2 sm">
      <b class="u-tx3 hz">${esc(c.c)}</b> —
      ${(c.parts||[]).map(p=>`<b class="hz">${esc(p.p)}</b>${p.role?' <span class="mut">('+esc(p.role)+')</span>':''}${p.sens?' : '+esc(p.sens):''}`).join(' · ')}
      ${c.note?`<br><span class="mut">${esc(c.note)}</span>`:''}</p>`).join('')}
    </div>`:''}`;
}

function vTrad(){
  const sens=tradSens();
  const cle=S.settings.provider!=='none'&&!!(S.settings.apikey||'').trim();
  const h=tradHist(),nf=(S.fav||[]).length;
  return `${header('Traducteur','Traduire, puis garder ce qui compte')}
  ${speechNotice()}
  <div class="tsens">
    <button class="${sens==='zh-fr'?'on':''}" onclick="setSens('zh-fr')">Chinois</button>
    <button class="swap" onclick="tradSwap()" aria-label="Inverser le sens">
      <svg viewBox="0 0 24 24" class="ico">
        <path d="M7 4.5v14M7 18.5l-3-3M7 18.5l3-3"/><path d="M17 19.5v-14M17 5.5l-3 3M17 5.5l3 3"/></svg>
    </button>
    <button class="${sens==='fr-zh'?'on':''}" onclick="setSens('fr-zh')">Français</button>
  </div>
  <div class="box">
    <textarea id="tin" rows="3" oninput="tradGarde()"
      placeholder="${sens==='zh-fr'?'你叫什么名字？':'Comment t’appelles-tu ?'}">${esc(ctx.q||'')}</textarea>
    <button class="btn mt" onclick="tradGo()" ${ctx.busy?'disabled':''}>${ctx.busy?'Traduction en cours…':'Traduire'}</button>
    ${ctx.q?`<button class="btn pale sm mt" onclick="tradVide()">Effacer</button>`:''}
    ${cle?'':`<p class="mut sm mt">Aucune clé n’est enregistrée. Le traducteur ne peut pas fonctionner sans elle.</p>
      <button class="btn pale sm mt" onclick="nav('reglages')">Ouvrir les réglages</button>`}
  </div>
  ${ctx.err?`<div class="box"><p class="u-m0 mut sm">${esc(ctx.err)}</p></div>`:''}
  ${ctx.busy?`<div class="box"><p class="u-m0 mut sm">Traduction, synonymes, exemples, voisins et composition sont demandés en une seule fois. Quelques secondes.</p></div>`:''}
  ${tradResultat()}
  ${nf?`<h2 class="sec">Le carnet</h2>
    <div class="box">
      <p class="u-mb3 mut sm">${nf} entrée${nf>1?'s':''} · ${favDue()} à revoir maintenant.</p>
      <button class="btn jade sm" onclick="nav('vocab')">Réviser le carnet</button>
    </div>`:''}
  ${h.length?`<h2 class="sec">Récents</h2>
    <div class="box">
      ${h.slice(0,8).map(e=>`<button class="u-w-100pc u-ta-left wrow"
        onclick="tradRappel('${jq(e.q)}','${esc(e.s||'zh-fr')}')">
        <span class="m"><b>${esc(e.q)}</b><span class="mut">${esc(e.fr||e.hz||'')}</span></span>
      </button>`).join('')}
      <button class="btn pale sm mt" onclick="tradWipe()">Effacer les récents</button>
    </div>`:''}`;
}
