function vVocab(){
  const P=pool();
  if(!P.length)return header('Vocabulaire')+levelPills()+nothing();
  if(!ctx.session)return vocabHome(P);
  if(ctx.session.done)return vocabScore();
  return ctx.session.quick?vocabFlash():vocabDrill();
}

function vocabHome(P){
  const q=P.filter(w=>due(w.id)),ma=P.filter(w=>mastered(w.id)).length;
  return header('Vocabulaire',`${q.length} à réviser · ${ma} acquis sur ${P.length}`)+ribbon()+`
  <div class="box">
    <p class="sm" style="margin:0 0 4px"><b>Une épreuve différente à chaque étage</b></p>
    <p class="mut sm">La boîte d’un mot ne décide plus seulement de la date à laquelle il revient, mais de ce qu’on vous demande d’en faire. Chaque réponse est jugée, plus rien n’est déclaratif.</p>
    ${LADDER.map((L,i)=>`<div class="ladder">
      <span class="bx ${P.some(w=>boxOf(w.id)===i)?'on':''}">${i}</span>
      <span class="tx"><b>${esc(L.n)}</b> — <span class="mut">${esc(L.d)}</span></span>
      <span class="st mut sm">${P.filter(w=>boxOf(w.id)===i).length}</span>
    </div>`).join('')}
  </div>
  <button class="btn" onclick="startVocab(0)">${q.length?`Séance — ${Math.min(q.length,12)} mot${Math.min(q.length,12)>1?'s':''}`:'Séance libre — 12 mots'}</button>
  <button class="btn pale mt" onclick="startVocab(1)">Révision rapide — cartes à retourner</button>
  ${exoAt('match').concat(exoAt('grid')).map(x=>`<button class="wrow" style="width:100%;text-align:left;margin-top:9px"
    onclick="openExo('${x.id}')">
    <span class="g" style="font-family:var(--han);font-size:23px;color:var(--clay)">${x.kind==='match'?'配':'表'}</span>
    <span class="m"><b>${esc(x.titre)}</b><span class="mut">${esc(x.consigne)}</span></span></button>`).join('')}
  <p class="mut sm mt">La révision rapide ne fait pas monter les boîtes : elle sert aux trajets, quand vous ne pouvez ni tracer ni taper.</p>
  <h2 class="sec">Les mots de ce filtre</h2>
  ${P.map(x=>`<div class="wrow">
    <span class="g">${esc(x.hz)}</span>
    <span class="m"><b>${esc(x.fr)}</b><span class="py">${pinyin(x.py)}</span></span>
    ${mastered(x.id)?'<span class="seal">印</span>':`<span class="st">boîte ${boxOf(x.id)}</span>`}
  </div>`).join('')}`;
}

function vocabProg(){
  const Z=ctx.session;
  return `<div class="qnum">Mot ${Z.i+1} sur ${Z.ids.length}${ctx.d?' · '+esc((LADDER.find(L=>L.k===ctx.d.kind)||{}).n||''):''}</div>
  <div class="qprog">${Z.ids.map((id,k)=>{
    const cl=k===Z.i?'now':(k<Z.i?'ok':'');
    return `<i class="${cl}"></i>`;}).join('')}</div>`;
}

function vocabDrill(){
  const d=ctx.d,w=d.w,rep=d.ans!=null;
  const fiche=`<div class="box" style="text-align:center">
      <div class="hz" style="font-size:44px;font-weight:700;line-height:1.2">${esc(w.hz)}</div>
      <div class="py" style="font-size:19px">${pinyin(w.py)}</div>
      <p class="mut" style="margin:4px 0 10px">${esc(w.fr)}</p>
      <button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button>
    </div>`;
  const suite=rep?`<button class="btn mt" onclick="vNext()">${ctx.session.i<ctx.session.ids.length-1?'Mot suivant':'Voir le bilan'}</button>`:'';

  /* --- QCM : reconnaître, produire, tons, phrase à trou --- */
  if(d.kind==='reco'||d.kind==='prod'||d.kind==='tons'||d.kind==='trou'){
    const consigne={reco:'Que signifie ce mot ?',prod:'Quel mot correspond ?',
      tons:'Quel pinyin est exact ? Les tons seuls diffèrent.',
      trou:'Complétez la phrase.'}[d.kind];
    return header('Vocabulaire',w.fr&&d.kind!=='reco'?'':' ')+vocabProg()+
    (d.neuf&&d.kind==='reco'&&!rep?`<div class="verdict ok">Premier passage sur ce mot — regardez-le, puis répondez.</div>`+fiche:'')+`
    <div class="box">
      <p class="mut sm" style="margin:0 0 6px">${esc(consigne)}</p>
      ${d.kind==='trou'
        ?`<div class="sentence">${esc(d.gap)}</div>
          <p class="mut sm" style="margin:6px 0 0">${esc(d.s.fr)}</p>`
        :`<div class="prompt"><div class="${d.promptHan?'big':'med'}">${esc(d.prompt)}</div></div>`}
      ${d.kind==='tons'?`<div style="text-align:center"><button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button></div>`:''}
      <div class="opts">${d.a.map((opt,j)=>{
        let cl='';if(rep)cl=(j===d.ok)?'ok':(j===d.ans?'no':'');
        return `<button class="opt ${d.han?'han':''} ${cl}" onclick="vAnswer(${j})">${d.kind==='tons'?pinyin(opt):esc(opt)}</button>`;
      }).join('')}</div>
      ${rep?`<div class="verdict ${d.ans===d.ok?'ok':'no'}">${d.ans===d.ok?'Juste.':'Réponse attendue : '+esc(d.a[d.ok])+'.'} ${esc(w.hz)} — ${esc(w.py)} — ${esc(w.fr)}</div>
        <button class="btn pale sm" onclick="speak('${jq(d.kind==='trou'?d.s.hz:w.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* --- Tracé de mémoire --- */
  if(d.kind==='trace'){
    const chars=hanOf(w.hz);
    const size=chars.length>2?102:(chars.length===2?138:196);
    return header('Vocabulaire',' ')+vocabProg()+`
    <div class="box" style="text-align:center">
      <p class="mut sm" style="margin:0 0 4px">Écrivez ce mot de mémoire. Aucun contour n’est affiché.</p>
      <div class="fr" style="font-size:20px;font-weight:700">${esc(w.fr)}</div>
      <div class="py" style="font-size:18px;margin-bottom:12px">${pinyin(w.py)}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        ${chars.map((c,k)=>`<div id="tw${k}" class="tbox" style="width:${size}px;height:${size}px"></div>`).join('')}
      </div>
      ${rep?`<div class="verdict ${d.ans===-1?'no':(d.mist===0?'ok':'no')} mt">${
          d.ans===-1?'Tracé révélé — le mot revient en boîte 0.'
          :(d.mist===0?'Sans une seule erreur de tracé.':d.mist+' erreur(s) de tracé.')
        } ${esc(w.hz)} — ${esc(w.py)}</div>`
       :`<button class="btn pale sm mt" onclick="vReveal()">Je ne m’en souviens pas — montrer</button>`}
    </div>
    ${suite}`;
  }

  /* --- Saisie au clavier chinois --- */
  const dz=rep?diffZh(d.txt||'',d.s.hz):null;
  return header('Vocabulaire',' ')+vocabProg()+`
  <div class="box">
    <p class="mut sm" style="margin:0 0 6px">Écrivez cette phrase en chinois, au clavier. Elle contient ${esc(w.hz)}.</p>
    <p style="font-size:18px;font-weight:700;margin:0 0 12px">${esc(d.s.fr)}</p>
    ${rep?'':`<textarea id="zi" rows="2" placeholder="汉字…"></textarea>
      <div class="row mt">
        <button class="btn jade sm" onclick="vSubmit()">Valider</button>
        <button class="btn pale sm" onclick="vSkip()">Je passe</button>
      </div>`}
    ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${d.ans===1?'Identique au modèle.':(d.ans===-1?'Phrase passée.':'Ce n’est pas tout à fait ça.')}</div>
      ${d.ans!==1?`<p class="mut sm" style="margin:0 0 2px">Vous avez écrit</p>
        <div class="diff" style="color:var(--red-d)">${dz.you||'—'}</div>
        <p class="mut sm" style="margin:10px 0 2px">Attendu</p>`:'<p class="mut sm" style="margin:0 0 2px">Modèle</p>'}
      <div class="diff" style="color:var(--jade-d)">${dz.exp}</div>
      ${d.s.py?`<p class="py sm" style="margin-top:6px">${pinyin(d.s.py)}</p>`:''}
      <button class="btn pale sm mt" onclick="speak('${jq(d.s.hz)}')">Écouter</button>`:''}
  </div>
  ${suite}`;
}

function vocabFlash(){
  const w=curWord();
  ctx.dir=ctx.dir||'hz-fr';
  const front=ctx.dir==='hz-fr'?`<div class="glyph">${esc(w.hz)}</div>`:`<div class="fr">${esc(w.fr)}</div>`;
  const rev=ctx.dir==='hz-fr'
    ?`<div class="py">${pinyin(w.py)}</div><div class="fr" style="margin-top:6px">${esc(w.fr)}</div>`
    :`<div class="glyph sm">${esc(w.hz)}</div><div class="py">${pinyin(w.py)}</div>`;
  return header('Révision rapide','Les boîtes ne bougent pas')+vocabProg()+`
  <div class="row" style="margin-bottom:12px">
    <button class="btn ${ctx.dir==='hz-fr'?'':'pale'} sm" onclick="ctx.dir='hz-fr';ctx.show=0;render()">汉字 → fr</button>
    <button class="btn ${ctx.dir==='fr-hz'?'':'pale'} sm" onclick="ctx.dir='fr-hz';ctx.show=0;render()">fr → 汉字</button>
  </div>
  <div class="card3d">
    ${front}
    ${ctx.show?`<hr>${rev}<button class="btn pale tiny mt" onclick="speak('${jq(w.hz)}')">Écouter</button>`:''}
  </div>
  ${ctx.show?`<button class="btn mt" onclick="vNext()">${ctx.session.i<ctx.session.ids.length-1?'Mot suivant':'Terminer'}</button>`
            :`<button class="btn mt" onclick="ctx.show=1;render()">Voir la réponse</button>`}`;
}

function vocabScore(){
  const Z=ctx.session,n=Z.ids.length;
  if(Z.quick)return header('Révision rapide')+`
    <div class="box"><div class="score"><div class="n">${n}</div><div class="lbl">mot${n>1?'s':''} passé${n>1?'s':''} en revue</div></div>
    <p class="mut sm">Aucune boîte n’a bougé : c’était une lecture, pas une épreuve.</p></div>
    <button class="btn" onclick="ctx.session=null;ctx.d=null;render()">Retour au vocabulaire</button>`;
  const pct=Math.round(Z.right/n*100);
  const monte=Z.ids.filter(id=>boxOf(id)>0).length;
  return header('Séance terminée')+`
  <div class="box">
    <div class="score"><div class="n">${Z.right}<small> / ${n}</small></div><div class="lbl">${pct}% de réussite</div></div>
    <div class="bar" style="margin:14px 0"><i style="width:${pct}%;background:${pct>=75?'var(--jade)':'var(--red)'}"></i></div>
    <p class="mut sm">${monte} mot${monte>1?'s':''} au-dessus de la boîte 0. Les mots ratés reviendront dès la prochaine séance, au même étage.</p>
  </div>
  <button class="btn" onclick="startVocab(0)">Nouvelle séance</button>
  <button class="btn pale mt" onclick="ctx.session=null;ctx.d=null;render()">Retour au vocabulaire</button>`;
}

function startVocab(quick){
  const P=pool();
  if(!P.length)return toast('Aucun mot à ce filtre.');
  const q=P.filter(w=>due(w.id));
  const src=(q.length?q:P).slice().sort((a,b)=>boxOf(a.id)-boxOf(b.id));
  const list=shuffle(src.slice(0,Math.min(src.length,12)));
  ctx.session={ids:list.map(x=>x.id),i:0,right:0,quick:!!quick,rappel:!q.length};
  ctx.show=0;
  ctx.d=quick?null:makeDrill(list[0]);
  render();scrollTo(0,0);
}

function curWord(){return WORDS.find(x=>x.id===ctx.session.ids[ctx.session.i]);}

function vNext(){
  const Z=ctx.session;
  if(Z.i<Z.ids.length-1){
    Z.i++;ctx.show=0;
    ctx.d=Z.quick?null:makeDrill(curWord());
  }else Z.done=true;
  render();scrollTo(0,0);
}

function vAnswer(j){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=j;
  const good=(j===d.ok);
  beep(good?'ok':'no');
  grade(d.w.id,good?2:0);
  if(good)ctx.session.right++;
  render();
}

function vSubmit(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez la phrase avant de valider.');
  d.txt=txt;
  const good=(normZh(txt)===normZh(d.s.hz));
  d.ans=good?1:0;
  beep(good?'ok':'no');
  grade(d.w.id,good?2:1);
  if(good)ctx.session.right++;
  render();
}

function vSkip(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=-1;d.txt=(document.getElementById('zi')||{}).value||'';
  beep('no');grade(d.w.id,0);render();
}

function vTraceDone(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=1;
  const good=(d.mist===0);
  beep(good?'ok':'no');
  grade(d.w.id,good?2:(d.mist<=2?1:0));
  if(good)ctx.session.right++;
  render();
}

/* Tracé de mémoire : un carré par caractère, enchaînés automatiquement. */
let TW=[];

function mountTrace(){
  const d=ctx.d;
  if(!d||d.kind!=='trace'||typeof HanziWriter==='undefined')return;
  /* Une séance de tracé déjà en cours et toujours à l’écran : ne pas la relancer. */
  if(d.ans==null&&d.mounted){
    const el0=document.getElementById('tw0');
    if(el0&&el0.childNodes.length)return;
  }
  const chars=hanOf(d.w.hz);
  const size=chars.length>2?102:(chars.length===2?138:196);
  TW=[];
  chars.forEach((c,k)=>{
    const el=document.getElementById('tw'+k);if(!el)return;
    el.innerHTML='';
    TW.push(HanziWriter.create(el,c,{width:size,height:size,padding:8,
      showCharacter:d.ans!=null,showOutline:d.ans!=null,delayBetweenStrokes:150,
      strokeColor:'#2C2723',outlineColor:'#E2D6C4',drawingColor:'#B8342E',highlightColor:'#3D7A69'}));
  });
  if(d.ans!=null)return;
  d.mounted=true;
  const run=k=>{
    if(k>=TW.length)return vTraceDone();
    TW[k].quiz({onComplete(r){
      d.mist+=r.totalMistakes;
      TW[k].showCharacter();TW[k].showOutline();
      const box=document.getElementById('tw'+k);if(box)box.className='tbox ok';
      setTimeout(()=>run(k+1),320);
    }});
  };
  run(0);
}

function vReveal(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=-1;beep('no');grade(d.w.id,0);render();
  setTimeout(()=>TW.forEach((t,i)=>setTimeout(()=>t.animateCharacter(),i*900)),120);
}
