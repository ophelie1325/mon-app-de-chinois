
/* =====================================================================
   ADAPTATEURS — le module de grammaire a changé de format.
   Les fiches ne portent plus « ex » ni « qcm » mais « banque », « fixes »
   et « transfo ». Le vocabulaire et les parcours continuent d’avoir
   besoin de phrases d’exemple et de questions : on les fabrique ici,
   à partir des données neuves, plutôt que de garder l’ancien tableau.
   ===================================================================== */
function segHZ(seg){return (seg||[]).map(s=>s.h||'').join('');}
function segPY(seg){return (seg||[]).map(s=>s.p||'').filter(Boolean).join(' ');}

/* Phrases d’exemple : sert au vocabulaire pour la « phrase à trou ». */
function buildSENT(){
  const out=[];
  DATA('GRAMMAR').forEach(g=>{
    (g.banque||[]).forEach(b=>{
      const hz=segHZ(b.seg);
      if(!hz)return;
      out.push({hz:hz,py:segPY(b.seg),fr:b.fr||'',hsk:g.hsk,th:g.th||[]});
    });
    (g.transfo||[]).forEach(t=>{
      const s=t.vers&&t.vers.seg;
      if(!s)return;
      const hz=segHZ(s);
      if(hz)out.push({hz:hz,py:segPY(s),fr:(t.vers&&t.vers.fr)||'',hsk:g.hsk,th:g.th||[]});
    });
  });
  /* On ne remplace pas le tableau : d’autres scripts en tiennent la
     référence. On le vide et on le recharge. */
  /* La page ne charge pas forcément data-corpus.js : dans ce cas il n’y
     a pas de tableau SENT, et il n’y a rien à reconstruire. */
  if(typeof SENT==='undefined')return 0;
  SENT.length=0;
  out.forEach(x=>SENT.push(x));
  return SENT.length;
}

/* Questions de grammaire pour le bilan d’un parcours.
   Deux gisements sûrs : les phrases fautives (改错) et les
   transformations. Chacune donne une question à quatre propositions. */
function gramQuiz(g,n){
  if(!g)return [];
  const qs=[];
  (g.fixes||[]).forEach(f=>{
    const bon=f.bon||segHZ(f.seg);
    if(!bon)return;
    const faux=segHZ(f.seg);
    if(!faux||faux===bon)return;
    const leurres=(g.leurres||[]).slice(0,2);
    const a=[bon,faux].concat((g.banque||[]).slice(0,2).map(b=>segHZ(b.seg)))
              .filter((x,i,t)=>x&&t.indexOf(x)===i).slice(0,4);
    if(a.length<2)return;
    qs.push({q:'Quelle phrase est correcte ?',a:shuffle(a),ok:bon,why:f.why||''});
  });
  (g.transfo||[]).forEach(t=>{
    const bon=t.vers&&segHZ(t.vers.seg);
    if(!bon||!t.de)return;
    const a=[bon].concat((g.banque||[]).map(b=>segHZ(b.seg)).filter(x=>x&&x!==bon).slice(0,3));
    if(a.length<2)return;
    qs.push({q:(t.consigne||'Transformez')+' — « '+(t.de.hz||'')+' »',
             a:shuffle(a),ok:bon,why:''});
  });
  return shuffle(qs).slice(0,n||2);
}

/* =====================================================================
   exos.js — machinerie commune des exercices et des documents.
   Utilisée par le vocabulaire, la grammaire, les deux compréhensions,
   l’entraînement HSK et les parcours. Un seul exemplaire.
   ===================================================================== */


const LADDER=[
  {k:'reco',  n:'Reconnaître', d:'汉字 → français'},
  {k:'prod',  n:'Produire',    d:'français → 汉字'},
  {k:'tons',  n:'Tons',        d:'retrouver le pinyin exact'},
  {k:'trou',  n:'En contexte', d:'compléter la phrase'},
  {k:'trace', n:'Tracer',      d:'écrire de mémoire, sans modèle'},
  {k:'saisie',n:'Traduire',    d:'au clavier chinois'}
];

function sentsFor(w){
  const c=(w.ex?[{hz:w.ex.hz,py:w.ex.py||'',fr:w.ex.fr,hsk:w.hsk,th:w.th}]:[]).concat(SENT);
  return c.filter(x=>x.hz.indexOf(w.hz)>=0)
          .sort((a,b)=>((a.hsk===w.hsk?0:1)-(b.hsk===w.hsk?0:1))||(a.hz.length-b.hz.length));
}

function distract(w,n){
  let c=pool().filter(x=>x.id!==w.id&&x.fr!==w.fr&&x.hz!==w.hz);
  if(c.length<n)c=DATA('WORDS').filter(x=>x.hsk===w.hsk&&x.id!==w.id&&x.fr!==w.fr&&x.hz!==w.hz);
  if(c.length<n)c=DATA('WORDS').filter(x=>x.id!==w.id&&x.fr!==w.fr&&x.hz!==w.hz);
  return shuffle(c).slice(0,n);
}

function hanOf(t){return [...String(t)].filter(c=>/[\u4e00-\u9fff]/.test(c));}

function makeDrill(w){
  const ss=sentsFor(w);
  let kind=LADDER[Math.min(boxOf(w.id),LADDER.length-1)].k;
  if((kind==='trou'||kind==='saisie')&&!ss.length)kind='prod';
  if(kind==='trace'&&typeof HanziWriter==='undefined')kind='prod';
  const d={kind:kind,w:w,ans:null,mist:0,neuf:!S.items[w.id]};
  if(kind==='reco'||kind==='prod'){
    const hz=(kind==='prod'),good=hz?w.hz:w.fr;
    d.a=shuffle([good].concat(distract(w,3).map(x=>hz?x.hz:x.fr)));
    d.ok=d.a.indexOf(good);d.han=hz;
    d.prompt=hz?w.fr:w.hz;d.promptHan=!hz;
  }
  if(kind==='tons'){
    d.a=shuffle(tonVariants(w.py));d.ok=d.a.indexOf(w.py);
    d.prompt=w.hz;d.promptHan=true;d.han=false;
  }
  if(kind==='trou'){
    /* on préfère une phrase où le mot n’apparaît qu’une fois ; sinon on masque
       toutes ses occurrences, sans quoi la réponse resterait lisible. */
    const uniq=ss.filter(x=>x.hz.split(w.hz).length===2);
    d.s=uniq[0]||ss[0];
    d.a=shuffle([w.hz].concat(distract(w,3).map(x=>x.hz)));
    d.ok=d.a.indexOf(w.hz);d.han=true;
    d.gap=d.s.hz.split(w.hz).join('（\u3000）');
  }
  if(kind==='saisie')d.s=ss[0];
  return d;
}

function exoAt(kind,ref){
  return DATA('EXOS').filter(x=>x.kind===kind&&fits(x)&&(!ref||x.ref===ref));
}

/* ---- Vrai ou faux : en ligne dans les écrans de compréhension ---- */
function vfBlock(x){
  ctx.ans=ctx.ans||{};
  const L=['对 — vrai','错 — faux'];
  return `<h2 class="sec">${esc(x.titre)}</h2>
  <div class="box"><p class="sm" style="margin:0"><b>${esc(x.consigne)}</b></p></div>
  ${x.items.map((it,i)=>{
    const key=x.id+':'+i,ch=ctx.ans[key];
    const nx=i+1<x.items.length?`'q-${x.id}-${i+1}'`:'null';
    return `<div class="box" id="q-${x.id}-${i}">
      <p class="hz" style="font-size:19.5px;font-weight:700;margin:0 0 11px">${esc(it.q)}</p>
      <div class="row">${[0,1].map(j=>{
        let cl='';if(ch!=null)cl=(j===it.ok)?'ok':(j===ch?'no':'');
        return `<button class="opt ${cl}" style="text-align:center" onclick="pick('${key}',${j},${it.ok},${nx})">${L[j]}</button>`;
      }).join('')}</div>
      ${ch!=null?`<div class="verdict ${ch===it.ok?'ok':'no'}" style="margin-top:11px">${ch===it.ok?'Juste.':'Non.'}${it.why?' <span class="hz">'+esc(it.why)+'</span>':''}</div>`:''}
    </div>`;
  }).join('')}`;
}

/* ---- 改错 : en ligne dans la Grammaire ---- */
function fixBlock(x){
  ctx.fx=ctx.fx||{};
  return `<h2 class="sec">${esc(x.titre)}</h2>
  <div class="box"><p class="sm" style="margin:0"><b>${esc(x.consigne)}</b></p></div>
  ${x.items.map((it,i)=>{
    const key=x.id+':'+i,st=ctx.fx[key]||{t:null,f:null};
    return `<div class="box" id="q-${x.id}-${i}">
      <div class="tiles">${it.t.map((tk,k)=>{
        let cl='';
        if(st.t!=null)cl=(k===it.bad)?'bon':(k===st.t?'mauvais':'');
        return `<button class="tile tok ${cl}" onclick="fixTap('${key}',${k},${it.bad})">${esc(tk)}</button>`;
      }).join('')}</div>
      ${st.t!=null?`<div class="verdict ${st.t===it.bad?'ok':'no'} mt">${
          st.t===it.bad?'C’est bien là que ça cloche.':'Le mot fautif était '+esc(it.t[it.bad])+'.'}</div>
        <p class="mut sm">Par quoi le remplacer ?</p>
        <div class="opts">${it.fix.map((f,j)=>{
          let c2='';if(st.f!=null)c2=(j===it.ok)?'ok':(j===st.f?'no':'');
          return `<button class="opt ${c2}" onclick="fixPick('${key}',${j},${it.ok})">${esc(f)}</button>`;
        }).join('')}
        </div>
        ${st.f!=null?`<div class="verdict ${st.f===it.ok?'ok':'no'}">${
            st.f===it.ok?'Juste.':'Il fallait : '+esc(it.fix[it.ok])+'.'}${it.why?' '+esc(it.why):''}</div>
          <div class="sentence">${esc(it.bonne)}</div>
          <button class="btn pale tiny mt" onclick="speak('${jq(it.bonne)}')">Écouter la phrase juste</button>`:''}`:''}
    </div>`;
  }).join('')}`;
}

function fixTap(key,k,bad){
  ctx.fx=ctx.fx||{};
  if(ctx.fx[key]&&ctx.fx[key].t!=null)return;
  ctx.fx[key]={t:k,f:null};
  beep(k===bad?'ok':'no');touchStreak();save();render();
}

function fixPick(key,j,ok){
  const st=(ctx.fx||{})[key];
  if(!st||st.t==null||st.f!=null)return;
  st.f=j;beep(j===ok?'ok':'no');save();render();
}

/* ---- Appariement et tableau : écran dédié ---- */
function gridGaps(x){
  const o=[];x.rows.forEach(r=>r.forEach(c=>{if(c&&typeof c==='object'&&c.g)o.push(c.g);}));return o;
}

function openExo(id){
  const x=DATA('EXOS').find(e=>e.id===id);if(!x)return;
  const st={id:id};
  if(x.kind==='match'){st.order=shuffle(x.pairs.map((p,i)=>i));st.sel=null;st.done=[];st.ko=0;st.bad=null;}
  if(x.kind==='grid'){st.cell=null;st.fill={};st.checked=false;st.bank=shuffle(gridGaps(x).concat(x.extra||[]));}
  go('exo',{exo:st});
}

function mTap(side,i){
  const st=ctx.exo;if(!st)return;
  if(side==='l'){
    if(st.done.indexOf(i)>=0)return;
    st.sel=(st.sel===i?null:i);st.bad=null;return render();
  }
  const pi=st.order[i];
  if(st.done.indexOf(pi)>=0)return;
  if(st.sel==null)return toast('Choisissez d’abord un mot dans la colonne de gauche.');
  if(pi===st.sel){st.done.push(pi);beep('ok');st.bad=null;}
  else{st.ko++;beep('no');st.bad=i;}
  st.sel=null;touchStreak();save();render();
}

function gTapCell(k){
  const st=ctx.exo;if(!st||st.checked)return;
  if(st.fill[k]!=null){st.bank.push(st.fill[k]);delete st.fill[k];st.cell=null;return render();}
  st.cell=(st.cell===k?null:k);render();
}

function gTapBank(i){
  const st=ctx.exo;if(!st||st.checked)return;
  if(st.cell==null)return toast('Touchez d’abord une case vide du tableau.');
  st.fill[st.cell]=st.bank[i];st.bank.splice(i,1);st.cell=null;render();
}

function gCheck(){
  const st=ctx.exo;if(!st)return;
  st.checked=true;st.cell=null;touchStreak();save();render();scrollTo(0,0);
}

function vExo(){
  /* Ces écrans sont partagés : la vue de repli ne peut pas être celle
     d'un module en particulier, qui n'existe pas sur toutes les pages. */
  const perdu=()=>`${header('Exercice introuvable')}
    <div class="card"><p class="note">Cet exercice n’est plus disponible.</p>
    <button class="btn" onclick="back()">Revenir</button></div>`;
  const st=ctx.exo;if(!st)return perdu();
  const x=DATA('EXOS').find(e=>e.id===st.id);if(!x)return perdu();
  return x.kind==='match'?exoMatch(x,st):exoGrid(x,st);
}

function exoMatch(x,st){
  const n=x.pairs.length,fini=st.done.length===n;
  return header(x.titre,`${st.done.length} / ${n} paires`)+`
  <div class="box"><p class="sm" style="margin:0"><b>${esc(x.consigne)}</b></p></div>
  <div class="mgrid">
    <div>${x.pairs.map((pr,i)=>{
      const d=st.done.indexOf(i)>=0;
      return `<button class="mit ${x.han&&x.han.l?'hz':''} ${d?'ok':(st.sel===i?'sel':'')}" onclick="mTap('l',${i})">${esc(pr[0])}</button>`;
    }).join('')}</div>
    <div>${st.order.map((pi,i)=>{
      const d=st.done.indexOf(pi)>=0,lab=x.pairs[pi][1];
      return `<button class="mit ${d?'ok':(st.bad===i?'no':'')}" onclick="mTap('r',${i})">${x.py?pinyin(lab):esc(lab)}</button>`;
    }).join('')}</div>
  </div>
  ${fini
    ?`<div class="verdict ${st.ko?'no':'ok'} mt">${st.ko?st.ko+' erreur'+(st.ko>1?'s':'')+' avant d’arriver au bout.':'Toutes les paires du premier coup.'}</div>
      <button class="btn pale" onclick="openExo('${x.id}')">Recommencer</button>`
    :`<p class="mut sm mt">Touchez un mot à gauche, puis son correspondant à droite. Les paires justes se verrouillent.</p>`}`;
}

function exoGrid(x,st){
  let tot=0,bon=0;
  const corps=x.rows.map((r,ri)=>`<tr>${r.map((c,ci)=>{
    const k=ri+'-'+ci;
    if(!(c&&typeof c==='object'&&c.g))return `<td><div class="gc">${esc(c)}</div></td>`;
    tot++;
    const v=st.fill[k];
    let cl=v!=null?'fill':'gap',txt=(v!=null?v:'?');
    if(st.checked){
      const juste=(v===c.g);if(juste)bon++;
      cl=juste?'ok':'no';txt=c.g;
    }else if(st.cell===k)cl='sel';
    return `<td><button class="gc ${cl}" onclick="gTapCell('${k}')">${esc(txt)}</button></td>`;
  }).join('')}</tr>`).join('');
  const reste=Object.keys(st.fill).length;
  return header(x.titre,`${reste} / ${tot} cases remplies`)+`
  <div class="box"><p class="sm" style="margin:0"><b>${esc(x.consigne)}</b></p></div>
  <div class="box">
    <table class="gtab"><thead><tr>${x.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${corps}</tbody></table>
  </div>
  ${st.checked
    ?`<div class="box"><div class="score"><div class="n">${bon}<small> / ${tot}</small></div>
        <div class="lbl">cases justes</div></div>
      <div class="bar" style="margin:12px 0"><i style="width:${Math.round(bon/tot*100)}%;background:${bon===tot?'var(--jade)':'var(--red)'}"></i></div>
      <p class="mut sm">Les cases en rouge affichent la réponse attendue.</p>
      <button class="btn pale" onclick="openExo('${x.id}')">Recommencer</button></div>`
    :`<h2 class="sec">Étiquettes</h2>
      <div class="tiles">${st.bank.map((b,i)=>`<button class="tile" onclick="gTapBank(${i})">${esc(b)}</button>`).join('')}</div>
      <button class="btn jade mt" onclick="gCheck()">Vérifier</button>
      <p class="mut sm mt">Touchez une case vide, puis l’étiquette. Touchez une case remplie pour la vider.</p>`}`;
}

/* ---------- Choix multiples en liste (fiches d’étude) ---------- */
function opts(key,q,han,nextKey){
  ctx.ans=ctx.ans||{};
  const ch=ctx.ans[key];
  return `<div class="opts">${q.a.map((a,j)=>{
    let cl='';if(ch!=null)cl=(j===q.ok)?'ok':(j===ch?'no':'');
    return `<button class="opt ${han?'han':''} ${cl}" onclick="pick('${key}',${j},${q.ok},${nextKey?`'${nextKey}'`:'null'})">${esc(a)}</button>`;
  }).join('')}</div>
  ${ch!=null?`<div class="verdict ${ch===q.ok?'ok':'no'}">${ch===q.ok?'Juste.':'Ce n’est pas la bonne réponse.'}${q.why?' '+q.why:''}</div>`:''}`;
}

function pick(key,j,ok,nextKey){
  ctx.ans=ctx.ans||{};
  if(ctx.ans[key]!=null)return;
  ctx.ans[key]=j;
  beep(j===ok?'ok':'no');
  touchStreak();save();
  if(S.settings.auto&&nextKey)ctx.scrollTo=nextKey;
  render();
}

/* ---- Affichage du document : suivi d’un bloc, ou découpé phrase à phrase ---- */
function setFlow(f){S.settings.flow=f;save();render();}

function flowPills(){
  const f=S.settings.flow==='suivi'?'suivi':'decoupe';
  return `<div class="pills" style="margin-bottom:12px">
    <button class="pill ${f==='suivi'?'on':''}" onclick="setFlow('suivi')">Texte suivi</button>
    <button class="pill ${f==='decoupe'?'on':''}" onclick="setFlow('decoupe')">Découpé</button>
  </div>`;
}

function seqOf(t){return JSON.stringify(t.lines.map(l=>({hz:l.hz,who:l.who||null}))).replace(/'/g,'&#39;');}

function docBody(t){
  const dial=t.lines.some(l=>l.who);
  if(S.settings.flow==='suivi'){
    const bloc=k=>dial
      ? t.lines.map(l=>`<div style="margin:0 0 8px"><span class="mut sm">${esc(l.who)} — </span>${k==='py'?pinyin(l.py):esc(l[k])}</div>`).join('')
      : (k==='py'?t.lines.map(l=>pinyin(l.py)).join(' ')
                 :esc(t.lines.map(l=>l[k]).join(k==='hz'?'':' ')));
    return `<div class="box">
      <div class="sentence" style="line-height:1.95">${bloc('hz')}</div>
      ${ctx.py?`<div class="py sm" style="margin-top:10px">${bloc('py')}</div>`:''}
      ${ctx.fr?`<p class="mut sm" style="margin-top:10px">${bloc('fr')}</p>`:''}
    </div>`;
  }
  return t.lines.map(l=>`<div class="box">
    ${l.who?`<p class="mut sm" style="margin:0 0 4px">Locuteur ${esc(l.who)}</p>`:''}
    <div class="sentence">${esc(l.hz)}</div>
    ${ctx.py?`<div class="py sm">${pinyin(l.py)}</div>`:''}
    ${ctx.fr?`<p class="mut sm" style="margin:6px 0 0">${esc(l.fr)}</p>`:''}
    <button class="btn pale tiny mt" onclick="speak('${jq(l.hz)}'${l.who?`,'${l.who}'`:''})">Écouter</button>
  </div>`).join('');
}

function docTools(t,mode){
  return `<div class="row mt">
    <button class="btn pale sm" onclick="ctx.py=!ctx.py;render()">${ctx.py?'Cacher':'Voir'} pinyin</button>
    <button class="btn pale sm" onclick="ctx.fr=!ctx.fr;render()">${ctx.fr?'Cacher':'Voir'} traduction</button>
    ${mode==='CO'?`<button class="btn pale sm" onclick="ctx.hz=!ctx.hz;render()">${ctx.hz?'Cacher':'Voir'} texte</button>`:''}
  </div>`;
}

function makeRep(t){
  const txt=t.lines.map(l=>l.hz).join('');
  const dansTh=DATA('WORDS').filter(w=>w.hsk===t.hsk&&(w.th||[]).some(x=>(t.th||[]).includes(x))&&txt.includes(w.hz));
  const dansTout=DATA('WORDS').filter(w=>w.hsk===t.hsk&&txt.includes(w.hz));
  const dedans=shuffle(dansTh.length>=5?dansTh:dansTout).slice(0,5);
  const dehors=shuffle(DATA('WORDS').filter(w=>w.hsk===t.hsk&&!txt.includes(w.hz))).slice(0,3);
  return {items:shuffle(dedans.concat(dehors)).map(w=>({hz:w.hz,py:w.py,fr:w.fr,dans:txt.includes(w.hz)})),
          sel:{},checked:false};
}

function repPick(i){
  const r=ctx.rep;if(!r||r.checked)return;
  r.sel[i]=!r.sel[i];render();
}

function repCheck(){
  const r=ctx.rep;if(!r||r.checked)return;
  r.checked=true;
  const juste=r.items.every((it,i)=>!!r.sel[i]===it.dans);
  beep(juste?'ok':'no');render();
}

function repBlock(){
  const r=ctx.rep,co=ctx.mode==='CO';
  const bons=r.items.filter(it=>it.dans).length;
  const trouves=r.items.filter((it,i)=>it.dans&&r.sel[i]).length;
  const faux=r.items.filter((it,i)=>!it.dans&&r.sel[i]).length;
  return `<h2 class="sec">Repérage</h2>
  <div class="box"><p class="sm" style="margin:0"><b>${co?'Quels mots avez-vous entendus ?':'Quels mots trouvez-vous dans le texte ?'}</b>
    <br><span class="mut">Il y en a ${bons} sur ${r.items.length}. Trois sont des intrus.</span></p></div>
  <div class="opts">${r.items.map((it,i)=>{
    let cl='';
    if(r.checked)cl=it.dans?'ok':(r.sel[i]?'no':'');
    else if(r.sel[i])cl='pick';
    return `<button class="opt han ${cl}" onclick="repPick(${i})">${esc(it.hz)}
      ${r.checked?`<span class="mut sm"> — ${esc(it.fr)}</span>`:''}</button>`;
  }).join('')}</div>
  ${r.checked
    ?`<div class="verdict ${trouves===bons&&!faux?'ok':'no'}">${trouves} mot${trouves>1?'s':''} sur ${bons} repéré${trouves>1?'s':''}${faux?`, ${faux} intrus retenu${faux>1?'s':''}`:''}.</div>`
    :`<button class="btn jade mt" onclick="repCheck()">Vérifier</button>`}`;
}

function comp(mode,titre,sub){
  const P=DATA('TEXTS').filter(t=>fits(t)&&t.mode===mode);
  if(!P.length)return header(titre)+levelPills()+nothing();
  ctx.t=ctx.t||P[0].id;
  const t=P.find(x=>x.id===ctx.t)||P[0];
  const masked=(mode==='CO'&&!ctx.hz);
  const dialogue=t.lines.some(l=>l.who);
  const replie=ctx.doc===false;
  const seq=seqOf(t);
  return header(titre,sub)+ribbon()+`
  <div class="box">
    <p><b>${esc(t.title)}</b> <span class="mut sm">${esc(t.fr)}</span></p>
    <button class="btn jade" onclick='speakSeq(${seq})'>Écouter en entier</button>
    <button class="btn pale sm mt" onclick="stopSpeech()">Arrêter</button>
    ${dialogue?`<p class="mut sm mt">Chaque locuteur a sa voix, avec une pause entre les répliques. Réglable dans Réglages.</p>`:''}
    ${replie
      ?`<button class="btn pale sm mt" onclick="ctx.doc=true;render()">Revoir le document</button>`
      :docTools(t,mode)}
  </div>
  ${replie?''
    :masked?`<div class="void"><span class="em">听</span><p class="sm">Texte caché. Répondez à l’oreille, puis affichez-le pour vérifier.</p></div>`
    :flowPills()+docBody(t)}
  <h2 class="sec">Questions</h2>
  ${t.qcm.map((q,i)=>`<div class="box" id="q-${t.id}-${i}"><p class="hz" style="font-size:19px;font-weight:700">${esc(q.q)}</p>
    ${opts(t.id+':'+i,q,true,i+1<t.qcm.length?`q-${t.id}-${i+1}`:null)}</div>`).join('')}
  ${exoAt('vf',t.id).map(vfBlock).join('')}`;
}

function vocabQuestions(words,n){
  if(!words.length)return [];
  const ranked=words.slice().sort((a,b)=>boxOf(a.id)-boxOf(b.id));
  const picked=shuffle(ranked.slice(0,Math.min(words.length,Math.max(n,Math.ceil(n*1.6))))).slice(0,Math.min(n,words.length));
  return picked.map((w,k)=>{
    const others=shuffle(words.filter(x=>x.id!==w.id)).slice(0,3);
    const toHz=(k%2===1)&&others.length===3;
    const good=toHz?w.hz:w.fr;
    const a=shuffle([good].concat(others.map(o=>toHz?o.hz:o.fr)));
    return {kind:'vocab',wid:w.id,audio:w.hz,
      prompt:toHz?w.fr:w.hz,promptHan:!toHz,
      hint:toHz?null:null,
      a:a,ok:a.indexOf(good),han:toHz,
      why:`${w.hz} — ${w.py} — ${w.fr}`};
  });
}

function lessonQuiz(l,mode){
  const words=DATA('WORDS').filter(w=>w.hsk===l.hsk&&(w.th||[]).includes(l.theme));
  if(mode==='mots')return vocabQuestions(words,Math.min(8,words.length));
  const qs=vocabQuestions(words,4);
  const g=DATA('GRAMMAR').find(x=>l.steps.some(s=>s.k==='gram'&&s.ref===x.id));
  if(g)gramQuiz(g,2).forEach(q=>qs.push({kind:'gram',prompt:q.q,promptHan:false,a:q.a,ok:q.ok,han:true,why:q.why}));
  const t=TEXTS.find(x=>l.steps.some(s=>s.k==='text'&&s.ref===x.id));
  if(t)shuffle(t.qcm).slice(0,2).forEach(q=>qs.push({kind:'texte',prompt:q.q,promptHan:true,a:q.a,ok:q.ok,han:true,
    audio:t.lines.map(x=>x.hz).join(''),why:null}));
  return shuffle(qs);
}

function startQuiz(lid,mode,stepIndex){
  const l=DATA('LESSONS').find(x=>x.id===lid);
  const qs=lessonQuiz(l,mode);
  if(!qs.length){toast('Pas assez de contenu pour cet exercice à ce niveau.');return;}
  go(mode,{quiz:{lid:lid,mode:mode,qs:qs,i:0,ans:[]},from:{l:lid,i:stepIndex}});
}

function qAnswer(j){
  const Q=ctx.quiz,q=Q.qs[Q.i];
  if(Q.ans[Q.i]!=null)return;
  const good=j===q.ok;
  Q.ans[Q.i]=j;
  beep(good?'ok':'no');
  if(q.kind==='vocab'&&q.wid)grade(q.wid,good?2:0);
  touchStreak();save();
  render();
  if(S.settings.auto)setTimeout(()=>{if(ctx.quiz===Q&&Q.ans[Q.i]!=null)qNext();},1300);
}

function qNext(){
  const Q=ctx.quiz;
  if(Q.i<Q.qs.length-1){Q.i++;render();scrollTo(0,0);}
  else{Q.done=true;render();scrollTo(0,0);}
}

function qRestart(){
  const Q=ctx.quiz;
  const l=DATA('LESSONS').find(x=>x.id===Q.lid);
  ctx.quiz={lid:Q.lid,mode:Q.mode,qs:lessonQuiz(l,Q.mode),i:0,ans:[]};
  render();scrollTo(0,0);
}

function vQuiz(){
  const Q=ctx.quiz;
  if(!Q)return `${header('Série terminée')}
    <div class="card"><p class="note">Il n’y a plus de question à afficher.</p>
    <button class="btn" onclick="back()">Revenir</button></div>`;
  const l=DATA('LESSONS').find(x=>x.id===Q.lid);
  const titre=Q.mode==='mots'?'Les mots du texte':'Bilan noté';
  const right=Q.ans.filter((a,k)=>a===Q.qs[k].ok).length;

  if(Q.done){
    const total=Q.qs.length,pct=Math.round(right/total*100);
    const seuil=Q.mode==='bilan'?Math.ceil(total*.75):Math.ceil(total*.6);
    const pass=right>=seuil;
    const faibles=Q.qs.map((q,k)=>[q,Q.ans[k]]).filter(([q,a])=>a!==q.ok);
    const parType=k=>faibles.filter(([q])=>q.kind===k).length;
    return header(titre,l.title)+`
    <div class="box">
      <div class="score"><div class="n">${right}<small> / ${total}</small></div>
        <div class="lbl">${pct}% de réponses justes</div></div>
      <div class="bar" style="margin:14px 0"><i style="width:${pct}%;background:${pass?'var(--jade)':'var(--red)'}"></i></div>
      <div class="verdict ${pass?'ok':'no'}">${pass
        ?(Q.mode==='bilan'?'Bilan réussi. Le thème est validé à ce niveau.':'Bien joué, les mots sont en place.')
        :`Il faut ${seuil} bonnes réponses sur ${total} pour valider. Reprenez et recommencez.`}</div>
      ${faibles.length?`<p class="mut sm">À revoir : ${[
        parType('vocab')?parType('vocab')+' sur le vocabulaire':'',
        parType('gram')?parType('gram')+' sur la grammaire':'',
        parType('texte')?parType('texte')+' sur la compréhension':''
      ].filter(Boolean).join(', ')}.</p>`:''}
    </div>
    ${faibles.length?`<h2 class="sec">Les erreurs</h2>
      ${faibles.map(([q,a])=>`<div class="box">
        <p class="${q.promptHan?'hz':''}" style="${q.promptHan?'font-size:21px;font-weight:700;':''}margin:0 0 6px">${esc(q.prompt)}</p>
        <p class="sm" style="margin:0"><span style="color:var(--red)">Votre réponse : ${esc(q.a[a])}</span></p>
        <p class="sm" style="margin:2px 0 0;color:var(--jade-d)">Attendu : ${esc(q.a[q.ok])}</p>
        ${q.why?`<p class="mut sm" style="margin:6px 0 0">${esc(q.why)}</p>`:''}
      </div>`).join('')}`:''}
    <button class="btn pale" onclick="qRestart()">Recommencer l’exercice</button>
    ${pass?`<button class="btn mt" onclick="finishStep()">Valider l’étape</button>`
          :`<button class="btn pale mt" onclick="back()">Revenir au parcours</button>`}`;
  }

  const q=Q.qs[Q.i],a=Q.ans[Q.i];
  const label={vocab:'Vocabulaire',gram:'Grammaire',texte:'Compréhension'}[q.kind];
  return header(titre,l.title)+`
  <div class="qnum">Question ${Q.i+1} sur ${Q.qs.length} · ${label}</div>
  <div class="qprog">${Q.qs.map((x,k)=>{
    const cl=k===Q.i?'now':(Q.ans[k]==null?'':(Q.ans[k]===x.ok?'ok':'no'));
    return `<i class="${cl}"></i>`;}).join('')}</div>
  <div class="box">
    <div class="prompt">
      <div class="${q.promptHan?'big':'med'}">${esc(q.prompt)}</div>
    </div>
    ${q.audio?`<button class="btn pale sm" onclick="speak('${jq(q.audio)}')">Écouter</button>`:''}
    <div class="opts">${q.a.map((opt,j)=>{
      let cl='';if(a!=null)cl=(j===q.ok)?'ok':(j===a?'no':'');
      return `<button class="opt ${q.han?'han':''} ${cl}" onclick="qAnswer(${j})">${esc(opt)}</button>`;
    }).join('')}</div>
    ${a!=null?`<div class="verdict ${a===q.ok?'ok':'no'}">${a===q.ok?'Juste.':'Réponse attendue : '+esc(q.a[q.ok])+'.'}${q.why?' '+esc(q.why):''}</div>
      <button class="btn" onclick="qNext()">${Q.i<Q.qs.length-1?'Suivant':'Voir le résultat'}</button>`:''}
  </div>`;
}
