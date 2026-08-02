/* Deux réserves, jamais mélangées : le corpus, filtré par niveau et par
   thème, et le carnet, qui ne l’est par rien. En révision le niveau et le
   thème ne servent à rien de toute façon — seule la boîte compte — mais
   les mélanger fausserait les compteurs de progression par thème. */
function vocabSrc(){return ctx.src==='fav'?'fav':'corpus';}
function setVocabSrc(v){ctx={src:v};render();}
function vocabPool(){return vocabSrc()==='fav'?favPool():pool();}

function vVocab(){
  if(ctx.session){
    if(ctx.session.done)return vocabScore();
    return ctx.session.quick?vocabFlash():vocabDrill();
  }
  return vocabHome(vocabPool());
}

function srcPills(){
  const v=vocabSrc(),nf=favPool().length;
  return `<div class="pills">
    <button class="pill ${v==='corpus'?'on':''}" onclick="setVocabSrc('corpus')">Corpus</button>
    <button class="pill ${v==='fav'?'on':''}" onclick="setVocabSrc('fav')">Mes favoris${nf?' · '+nf:''}</button>
  </div>`;
}

/* Les quatre paliers, et ce qui se trouve dans chacun. C’est la carte de
   la progression : on voit d’un coup ce qui s’installe, ce qui s’affermit
   et ce qui n’est plus là que pour vérification. */
function palierTable(P){
  return PALIERS.map(pa=>{
    const dedans=P.filter(w=>pa.b.indexOf(boxOf(w.id))>=0);
    const types=pa.mot.map(k=>typeOf(k).n).join(' · ');
    return `<div class="ladder">
      <span class="bx ${dedans.length?'on':''}">${pa.b.join('–')}</span>
      <span class="tx"><b>${esc(pa.n)}</b><br><span class="mut sm">${esc(types)}</span></span>
      <span class="st mut sm">${dedans.length}</span>
    </div>`;
  }).join('');
}

function vocabHome(P){
  const src=vocabSrc();
  if(src==='corpus'&&!P.length)return header('Vocabulaire')+srcPills()+levelPills()+nothing();
  if(src==='fav'&&!P.length)return header('Vocabulaire','Le carnet est vide')+srcPills()+`
    <div class="void"><span class="em">星</span>
    <p><b>Aucun favori pour l’instant</b></p>
    <p class="sm">L’étoile, dans le Traducteur, range ici ce que vous voulez retenir. Chaque favori devient révisable immédiatement.</p></div>
    <button class="btn" onclick="nav('trad')">Ouvrir le traducteur</button>`;
  const q=P.filter(w=>due(w.id)),ma=P.filter(w=>mastered(w.id)).length;
  const n=Math.min(q.length||12,12);
  return header('Vocabulaire',`${q.length} à réviser · ${ma} acquis sur ${P.length}`)+srcPills()+ribbon()+`
  <div class="box">
    <p class="u-mb1 sm"><b>Quatre paliers, et une réserve d’épreuves à chacun</b></p>
    <p class="mut sm">La boîte d’un mot ne décide plus seulement de la date à laquelle il revient, mais de ce qu’on vous demande d’en faire. Le type d’épreuve est tiré dans le palier, jamais deux fois le même d’affilée sur un même mot.</p>
    ${palierTable(P)}
  </div>
  <button class="btn" onclick="startVocab(0)">${q.length?`Séance — ${n} mot${n>1?'s':''}`:'Séance libre — 12 mots'}</button>
  <button class="btn pale mt" onclick="startVocab(1)">Révision rapide — cartes à retourner</button>
  ${src==='corpus'?exoAt('match').concat(exoAt('grid')).map(x=>`<button class="u-w-100pc u-ta-left u-mt2 wrow"
    onclick="openExo('${x.id}')">
    <span class="u-ff-han u-tx3 u-c-clay g">${x.kind==='match'?'配':'表'}</span>
    <span class="m"><b>${esc(x.titre)}</b><span class="mut">${esc(x.consigne)}</span></span></button>`).join(''):''}
  <p class="mut sm mt">Un mot raté revient dans la séance même, quelques items plus loin, puis une dernière fois à la fin. Il ne recule que d’une boîte — de deux si c’est le second échec de suite.</p>
  <h2 class="sec">${src==='fav'?'Le carnet':'Les mots de ce filtre'}</h2>
  ${P.map(x=>`<div class="wrow">
    <span class="g">${esc(x.hz)}</span>
    <span class="m"><b>${esc(x.fr)}</b><span class="py">${pinyin(x.py)}</span></span>
    <span class="st">${mastered(x.id)?'acquis':'boîte '+boxOf(x.id)}</span>
    <span class="dot ${etatDot(x.id)}"></span>
  </div>`).join('')}
  ${src==='fav'?`<button class="btn pale sm mt" onclick="nav('trad')">Ajouter au carnet</button>`:''}`;
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
  const T=typeOf(d.kind);
  const fiche=`<div class="u-ta-center box">
      <div class="hz ${d.unit==='phr'?'u-tx3':'u-tx5'} u-fw-700 u-lh-12">${esc(w.hz)}</div>
      <div class="u-tx2 py">${pinyin(w.py)}</div>
      <p class="u-mv13 mut">${esc(w.fr)}</p>
      <button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button>
    </div>`;
  const suite=rep?`<button class="btn mt" onclick="vNext()">${ctx.session.i<ctx.session.ids.length-1?'Suivant':'Voir le bilan'}</button>`:'';
  /* Le rappel de la réponse, identique partout : c’est le moment où la
     mémoire se fixe, il ne doit jamais manquer. */
  const rappel=`${esc(w.hz)}${w.py?' — '+esc(w.py):''} — ${esc(w.fr)}`;
  const tete=(sub)=>header('Vocabulaire',sub||' ')+vocabProg();

  /* ---------- Les épreuves à quatre propositions ---------- */
  if(d.a&&['reco','prod','tons','trou','ecoute','mjuste','decomp'].indexOf(d.kind)>=0){
    const consigne={
      reco:'Que signifie ce mot ?',
      prod:'Quel mot correspond ?',
      tons:'Quel pinyin est exact ? Les tons seuls diffèrent.',
      trou:'Complétez la phrase.',
      ecoute:'Écoutez, puis reconnaissez ce qui a été dit.',
      mjuste:'Lequel des trois convient ici ? Ils se traduisent pareil en français.',
      decomp:'Que signifie cet élément du caractère ?'
    }[d.kind];
    return tete(w.fr&&d.kind!=='reco'?'':' ')+
    (d.neuf&&d.kind==='reco'&&!rep?`<div class="verdict ok">Premier passage sur ce mot — regardez-le, puis répondez.</div>`+fiche:'')+`
    <div class="box">
      <p class="u-mb2 mut sm">${esc(consigne)}</p>
      ${d.kind==='trou'||d.kind==='mjuste'
        ?`<div class="sentence">${esc(d.gap)}</div>
          ${d.s&&d.s.fr?`<p class="u-mh2 mut sm">${esc(d.s.fr)}</p>`:''}`
        :d.kind==='ecoute'
        ?`<div class="u-ta-center u-pv20">
            <button class="btn jade" onclick="speak('${jq(d.audio)}')">Écouter</button>
            <p class="mut sm mt">Rien n’est affiché : tout se joue à l’oreille.</p>
          </div>`
        :d.kind==='decomp'
        ?`<div class="prompt"><div class="big">${esc(d.dc.c)}</div></div>
          ${d.part?`<p class="u-ta-center u-mh2 mut sm">Élément : <b class="hz">${esc(d.part.p||'')}</b>${d.part.role?' — '+esc(d.part.role):''}</p>`:''}`
        :`<div class="prompt"><div class="${d.promptHan?'big':'med'}">${esc(d.prompt)}</div></div>`}
      ${d.kind==='tons'?`<div class="u-ta-center"><button class="btn pale tiny" onclick="speak('${jq(w.hz)}')">Écouter</button></div>`:''}
      <div class="opts">${d.a.map((opt,j)=>{
        let cl='';if(rep)cl=(j===d.ok)?'ok':(j===d.ans?'no':'');
        return `<button class="opt ${d.han?'han':''} ${cl}" onclick="vAnswer(${j})">${d.kind==='tons'?pinyin(opt):esc(opt)}</button>`;
      }).join('')}</div>
      ${rep?`<div class="verdict ${d.ans===d.ok?'ok':'no'}">${d.ans===d.ok?'Juste.':'Réponse attendue : '+esc(d.a[d.ok])+'.'} ${rappel}</div>
        ${d.kind==='mjuste'&&d.notes&&d.notes.length?`<div class="u-mt3 box">
          <p class="u-mb2 mut sm"><b>Ce qui les sépare</b></p>
          ${d.notes.map(v=>`<p class="u-mb1 sm"><b class="hz">${esc(v.hz)}</b>${v.py?' <span class="py">'+pinyin(v.py)+'</span>':''} — ${esc(v.note||v.fr||'')}</p>`).join('')}
        </div>`:''}
        ${d.kind==='decomp'&&d.dc.note?`<p class="sm mt">${esc(d.dc.note)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.kind==='trou'||d.kind==='mjuste'?d.s.hz:w.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Repérer la faute : deux phrases, une seule tient ---------- */
  if(d.kind==='faute'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Laquelle des deux est correcte ?</p>
      <div class="opts">${d.a2.map((o,j)=>{
        let cl='';if(rep)cl=(j===d.ok)?'ok':(j===d.ans?'no':'');
        return `<button class="opt han long ${cl}" onclick="vFaute(${j})">${esc(o.hz)}</button>`;
      }).join('')}</div>
      ${rep?`<div class="verdict ${d.ans===d.ok?'ok':'no'}">${d.ans===d.ok?'Juste.':'C’est l’autre qui est correcte.'}</div>
        ${d.note?`<p class="sm">${esc(d.note)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.a2[d.ok].hz)}')">Écouter la bonne</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Écrire le pinyin, tons chiffrés ---------- */
  if(d.kind==='pyw'){
    const att=pySyls(w.py).map(pyRead).join(' ');
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Écrivez le pinyin de ce mot. Les tons se notent en chiffres : <b>hao3</b>, <b>ma5</b> pour le ton neutre.</p>
      <div class="prompt"><div class="big">${esc(w.hz)}</div></div>
      ${rep?'':`<input id="pyin" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="ni3 hao3">
        <div class="row mt">
          <button class="btn jade sm" onclick="vPy()">Valider</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${
          d.ans===1?'Exact, tons compris.'
          :(d.memeSyl?'Les syllabes sont bonnes, mais pas les tons.':'Ce n’est pas ça.')}</div>
        ${d.txt?`<p class="u-mb0 mut sm">Vous avez écrit</p>
          <div class="u-c-red-d diff">${esc(d.txt)}</div>`:''}
        <p class="u-mv30 mut sm">Attendu</p>
        <div class="u-tx2 py">${pinyin(w.py)}</div>
        <p class="mut sm">soit <b>${esc(att)}</b> — ${esc(w.fr)}</p>
        <button class="btn pale sm mt" onclick="speak('${jq(w.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Complétion à l’aveugle ---------- */
  if(d.kind==='trouw'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Complétez, sans proposition. Clavier chinois.</p>
      <div class="sentence">${esc(d.gap)}</div>
      ${d.s&&d.s.fr?`<p class="u-mv23 mut sm">${esc(d.s.fr)}</p>`:''}
      ${rep?'':`<textarea id="zi" rows="1" placeholder="汉字…"></textarea>
        <div class="row mt">
          <button class="btn jade sm" onclick="vTrouW()">Valider</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${d.ans===1?'Juste.':'Attendu : '+esc(d.cible.hz)+'.'}</div>
        ${d.txt&&d.ans!==1?`<p class="u-mb0 mut sm">Vous avez écrit</p>
          <div class="u-c-red-d diff">${esc(d.txt)}</div>`:''}
        <p class="u-mv30 mut sm">Phrase complète</p>
        <div class="u-c-jade-d diff">${esc(d.s.hz)}</div>
        ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.s.hz)}')">Écouter</button>`:''}
    </div>
    ${suite}`;
  }

  /* ---------- Remise en ordre ---------- */
  if(d.kind==='ordre'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">Remettez la phrase dans l’ordre. En chinois, l’ordre est la grammaire.</p>
      ${d.s.fr?`<p class="u-tx1 u-fw-700 u-mb3">${esc(d.s.fr)}</p>`:''}
      <div class="drop">${d.built.map((t,i)=>`<button class="tile" onclick="vOrdBack(${i})">${esc(t)}</button>`).join('')
        ||'<span class="u-ph2 mut sm">Touchez les mots dans l’ordre</span>'}</div>
      ${d.bag.length?`<div class="tiles mt">${d.bag.map((t,i)=>`<button class="tile" onclick="vOrdTap(${i})">${esc(t)}</button>`).join('')}</div>`:''}
      ${rep?`<div class="verdict ${d.ans===1?'ok':'no'} mt">${d.ans===1?'Phrase juste !':'Ordre incorrect.'}</div>
        <p class="u-mv30 mut sm">Phrase attendue</p>
        <div class="u-c-jade-d diff">${esc(d.seg.join(''))}</div>
        ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
        <button class="btn pale sm mt" onclick="speak('${jq(d.seg.join(''))}')">Écouter</button>`
       :`<button class="btn pale sm mt" onclick="vOrdReset()">Recommencer</button>`}
    </div>
    ${suite}`;
  }

  /* ---------- Tracé de mémoire ---------- */
  if(d.kind==='trace'){
    const chars=hanOf(w.hz);
    const cadre=chars.length>2?'tw3':(chars.length===2?'tw2':'tw1');
    return tete(' ')+`
    <div class="u-ta-center box">
      <p class="u-mb1 mut sm">Écrivez ce mot de mémoire. Aucun contour n’est affiché.</p>
      <div class="u-tx2 u-fw-700 fr">${esc(w.fr)}</div>
      <div class="u-tx2 u-mbo3 py">${pinyin(w.py)}</div>
      <div class="u-d-flex u-gp3 u-jc-center u-fwr-wrap">
        ${chars.map((c,k)=>`<div id="tw${k}" class="tbox ${cadre}"></div>`).join('')}
      </div>
      ${rep?`<div class="verdict ${d.ans===-1?'no':(d.mist===0?'ok':'no')} mt">${
          d.ans===-1?'Tracé révélé — le mot recule d’un cran.'
          :(d.mist===0?'Sans une seule erreur de tracé.':d.mist+' erreur(s) de tracé.')
        } ${rappel}</div>`
       :`<button class="btn pale sm mt" onclick="vReveal()">Je ne m’en souviens pas — montrer</button>`}
    </div>
    ${suite}`;
  }

  /* ---------- Réemploi corrigé ---------- */
  if(d.kind==='remploi'){
    return tete(' ')+`
    <div class="box">
      <p class="u-mb2 mut sm">À vous. Le modèle corrigera ensuite.</p>
      <p class="u-tx2 u-fw-700 u-mb1">${esc(d.consigne)}</p>
      <p class="u-mb3 mut sm">${esc(w.hz)}${w.py?' — '+esc(w.py):''} — ${esc(w.fr)}</p>
      ${rep?'':`<textarea id="zi" rows="2" placeholder="汉字…"></textarea>
        <div class="row mt">
          <button class="btn jade sm" onclick="vRemploi()" ${d.busy?'disabled':''}>${d.busy?'Correction en cours…':'Valider'}</button>
          <button class="btn pale sm" onclick="vSkip()">Je passe</button>
        </div>`}
      ${rep?`<p class="u-mb0 mut sm">Votre phrase</p>
        <div class="u-tx2 sentence">${esc(d.txt||'')}</div>
        ${d.err?`<p class="mut sm mt">${esc(d.err)}</p>`:''}
        ${d.corr?`<p class="u-ws-pre-wrap u-bt-2-dashed-line u-pt3 u-mt3 sm">${esc(d.corr)}</p>`:''}
        <p class="mut sm mt">Vous seule pouvez trancher : la correction lue, le mot est-il acquis ?</p>
        <div class="row mt">
          <button class="btn pale sm" onclick="vRemploiJuge(0)">Non</button>
          <button class="btn jade sm" onclick="vRemploiJuge(2)">Oui</button>
        </div>`:''}
    </div>`;
  }

  /* ---------- Dictée, et saisie au clavier ---------- */
  const dictee=(d.kind==='dictee');
  const dz=rep?diffZh(d.txt||'',d.s.hz):null;
  return tete(' ')+`
  <div class="box">
    ${dictee
      ?`<p class="u-mb2 mut sm">Écoutez, puis écrivez ce que vous entendez. Rien n’est affiché.</p>
        <button class="btn jade" onclick="speak('${jq(d.s.hz)}')">Écouter</button>
        <div class="mt"></div>`
      :`<p class="u-mb2 mut sm">Écrivez cette phrase en chinois, au clavier.${d.unit==='mot'?' Elle contient '+esc(w.hz)+'.':''}</p>
        <p class="u-tx2 u-fw-700 u-mb3">${esc(d.s.fr||w.fr)}</p>`}
    ${rep?'':`<textarea id="zi" rows="2" placeholder="汉字…"></textarea>
      <div class="row mt">
        <button class="btn jade sm" onclick="vSubmit()">Valider</button>
        <button class="btn pale sm" onclick="vSkip()">Je passe</button>
      </div>`}
    ${rep?`<div class="verdict ${d.ans===1?'ok':'no'}">${d.ans===1?'Identique au modèle.':(d.ans===-1?'Phrase passée.':'Ce n’est pas tout à fait ça.')}</div>
      ${d.ans!==1?`<p class="u-mb0 mut sm">Vous avez écrit</p>
        <div class="u-c-red-d diff">${dz.you||'—'}</div>
        <p class="u-mv30 mut sm">Attendu</p>`:'<p class="u-mb0 mut sm">Modèle</p>'}
      <div class="u-c-jade-d diff">${dz.exp}</div>
      ${d.s.py?`<p class="u-mt2 py sm">${pinyin(d.s.py)}</p>`:''}
      ${d.s.fr?`<p class="mut sm">${esc(d.s.fr)}</p>`:''}
      <button class="btn pale sm mt" onclick="speak('${jq(d.s.hz)}')">Écouter</button>`:''}
  </div>
  ${suite}`;
}

function vocabFlash(){
  const w=curWord();
  ctx.dir=ctx.dir||'hz-fr';
  const front=ctx.dir==='hz-fr'?`<div class="glyph">${esc(w.hz)}</div>`:`<div class="fr">${esc(w.fr)}</div>`;
  const rev=ctx.dir==='hz-fr'
    ?`<div class="py">${pinyin(w.py)}</div><div class="u-mt2 fr">${esc(w.fr)}</div>`
    :`<div class="glyph sm">${esc(w.hz)}</div><div class="py">${pinyin(w.py)}</div>`;
  return header('Révision rapide','Auto-évaluation, boîte par boîte')+vocabProg()+`
  <div class="u-mbo3 row">
    <button class="btn ${ctx.dir==='hz-fr'?'':'pale'} sm" onclick="ctx.dir='hz-fr';ctx.show=0;render()">汉字 → fr</button>
    <button class="btn ${ctx.dir==='fr-hz'?'':'pale'} sm" onclick="ctx.dir='fr-hz';ctx.show=0;render()">fr → 汉字</button>
  </div>
  <div class="card3d">
    ${front}
    ${ctx.show?`<hr>${rev}<button class="btn pale tiny mt" onclick="speak('${jq(w.hz)}')">Écouter</button>`:''}
  </div>
  ${ctx.show?`<div class="judge">
      <button class="btn pale" onclick="vJudge(0)">Oublié</button>
      <button class="btn gold" onclick="vJudge(1)">Hésité</button>
      <button class="btn jade" onclick="vJudge(2)">Su</button>
    </div>`
            :`<button class="btn mt" onclick="ctx.show=1;render()">Voir la réponse</button>`}`;
}

function vocabScore(){
  const Z=ctx.session,n=Z.ids.length;
  if(Z.quick)return header('Révision rapide')+`
    <div class="box"><div class="score"><div class="n">${Z.right}<small> / ${n}</small></div><div class="lbl">mot${n>1?'s':''} jugé${n>1?'s':''} su</div></div>
    <p class="mut sm">Les boîtes ont suivi vos jugements. Ce que vous avez déclaré oublié revient dès la prochaine séance.</p></div>
    <button class="btn" onclick="back()">Retour au vocabulaire</button>`;
  const pct=Math.round(Z.right/n*100);
  const monte=Z.ids.filter(id=>boxOf(id)>0).length;
  return header('Séance terminée')+`
  <div class="box">
    <div class="score"><div class="n">${Z.right}<small> / ${n}</small></div><div class="lbl">${pct}% de réussite</div></div>
    <div class="u-mv44 bar"><i class="${pct>=75?'ok':'no'}" style="width:${pct}%"></i></div>
    <p class="mut sm">${monte} mot${monte>1?'s':''} au-dessus de la boîte 0. Les mots ratés reviendront dès la prochaine séance, au même étage.</p>
  </div>
  <button class="btn" onclick="back();startVocab(0)">Nouvelle séance</button>
  <button class="btn pale mt" onclick="back()">Retour au vocabulaire</button>`;
}

function startVocab(quick){
  const P=vocabPool(),origine=vocabSrc();
  if(!P.length)return toast(origine==='fav'?'Le carnet est vide.':'Aucun mot à ce filtre.');
  const q=P.filter(w=>due(w.id));
  const lot=(q.length?q:P).slice().sort((a,b)=>boxOf(a.id)-boxOf(b.id));
  const list=shuffle(lot.slice(0,Math.min(lot.length,12)));
  /* La séance est empilée comme une vue à part entière : la croix de
     fermeture ramène ainsi à la liste, et non à l’accueil. */
  go('vocab',{
    src:origine,
    session:{ids:list.map(x=>x.id),i:0,right:0,vus:0,quick:!!quick,rappel:!q.length,repush:{}},
    show:0,
    d:quick?null:makeDrill(list[0])
  });
}

function curWord(){return anyWord(ctx.session.ids[ctx.session.i]);}

/* ---- Rappel espacé à l’intérieur de la séance ----------------------
   Un mot raté qui disparaît jusqu’au lendemain n’est pas retravaillé : il
   est renvoyé au moment où il sera déjà oublié. On le réinsère donc
   quelques items plus loin, puis une dernière fois en fin de séance. Au
   plus deux retours, sans quoi une séance ratée ne finirait jamais. */
function replanifie(id,ok){
  const Z=ctx.session;
  if(ok||!Z)return;
  Z.repush=Z.repush||{};
  const déjà=Z.repush[id]||0;
  if(déjà>=2)return;
  Z.repush[id]=déjà+1;
  const pos=déjà===0?Math.min(Z.ids.length,Z.i+3+(Math.random()*2|0)):Z.ids.length;
  Z.ids.splice(pos,0,id);
}

/* Une seule porte pour noter, quel que soit le type d’épreuve : elle
   retient aussi le type servi, pour ne pas le resservir aussitôt. */
function vGrade(g){
  const d=ctx.d;if(!d)return;
  grade(d.w.id,g);
  const r=S.items[d.w.id];if(r){r.last=d.kind;save();}
  if(g===2)ctx.session.right++;
  ctx.session.vus=(ctx.session.vus||0)+1;
  replanifie(d.w.id,g===2);
  beep(g===2?'ok':'no');
}

/* L’auto-évaluation appelle directement l’échelle à trois niveaux de
   grade() : 0 oublié, 1 hésité, 2 su. */
function vJudge(g){
  const w=curWord();
  if(w)grade(w.id,g);
  if(g===2)ctx.session.right++;
  beep(g===0?'no':'ok');
  vNext();
}

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
  vGrade(j===d.ok?2:0);
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
  vGrade(good?2:1);
  render();
}

function vSkip(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=-1;d.txt=(document.getElementById('zi')||{}).value||'';
  vGrade(0);render();
}

function vTraceDone(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=1;
  vGrade(d.mist===0?2:(d.mist<=2?1:0));
  render();
}

/* ---- Pinyin écrit au clavier, tons chiffrés ------------------------
   Le seul exercice qui force à produire le ton au lieu de le reconnaître.
   On accepte les chiffres comme les accents, et le u tréma écrit « v ». */
function pyNorm(t){
  return String(t||'').trim().toLowerCase()
    .replace(/([a-zü]+)\s*([0-5])/g,'$1$2 ')
    .split(/[\s,’']+/).filter(Boolean)
    .map(x=>{
      const m=x.match(/^([a-züv]+)([0-5])$/);
      if(m)return pyBare(m[1])+(m[2]==='5'?0:Number(m[2]));
      return pyRead(x);
    }).join(' ');
}
function vPy(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('pyin');
  const txt=el?el.value:'';
  if(!txt.trim())return toast('Écrivez le pinyin avant de valider.');
  d.txt=txt;
  const att=pySyls(d.w.py).map(pyRead).join(' ');
  const don=pyNorm(txt);
  const bon=(don===att);
  /* Bonnes syllabes, mauvais tons : c’est une hésitation, pas un échec. */
  const memeSyl=don.replace(/[0-9]/g,'')===att.replace(/[0-9]/g,'');
  d.ans=bon?1:0;d.memeSyl=memeSyl;
  vGrade(bon?2:(memeSyl?1:0));
  render();
}

/* ---- Complétion à l’aveugle : même trou, mais rien à choisir ------- */
function vTrouW(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez le mot manquant.');
  d.txt=txt;
  const bon=(normZh(txt)===normZh(d.cible.hz));
  d.ans=bon?1:0;
  vGrade(bon?2:0);
  render();
}

/* ---- Remise en ordre ------------------------------------------------- */
function vOrdTap(i){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.built.push(d.bag[i]);d.bag.splice(i,1);
  if(!d.bag.length)vOrdCheck();else render();
}
function vOrdBack(i){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.bag.push(d.built[i]);d.built.splice(i,1);render();
}
function vOrdCheck(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  const bon=(d.built.join('')===d.seg.join(''));
  d.ans=bon?1:0;
  vGrade(bon?2:0);
  render();
}
function vOrdReset(){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.bag=shuffle(d.seg);d.built=[];render();
}

/* ---- Repérer la faute ------------------------------------------------ */
function vFaute(j){
  const d=ctx.d;if(!d||d.ans!=null)return;
  d.ans=j;
  vGrade(j===d.ok?2:0);
  render();
}

/* ---- Réemploi corrigé par le modèle ---------------------------------- */
async function vRemploi(){
  const d=ctx.d;if(!d||d.ans!=null||d.busy)return;
  const el=document.getElementById('zi');
  const txt=el?el.value:'';
  if(!normZh(txt))return toast('Écrivez votre phrase avant de valider.');
  d.txt=txt;d.busy=true;render();
  try{
    d.corr=await correct(txt,'La phrase doit employer '+d.w.hz+' ('+d.w.fr+'). Dites si l’emploi est juste.');
    d.ans=1;
  }catch(e){
    d.corr='';d.err=(e&&e.message==='aucune clé')
      ?'Aucune clé enregistrée : la phrase n’a pas pu être corrigée. Elle compte tout de même comme un réemploi.'
      :'La correction a échoué : '+((e&&e.message)||e);
    d.ans=1;
  }
  d.busy=false;
  /* On ne peut pas juger à la place du modèle : le réemploi vaut une
     hésitation, jamais un échec. La lecture de la correction fait le
     reste du travail. */
  vGrade(1);
  render();
}
function vRemploiJuge(g){
  const d=ctx.d;if(!d)return;
  grade(d.w.id,g);
  if(g===2)ctx.session.right++;
  beep(g===2?'ok':'no');
  vNext();
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
  TW=[];
  chars.forEach((c,k)=>{
    const el=document.getElementById('tw'+k);if(!el)return;
    el.innerHTML='';
    /* La taille de la case est fixee par la feuille de style : on la
       mesure au lieu de la redire ici, sans quoi les deux valeurs
       finiraient par diverger. */
    const size=el.clientWidth||el.offsetWidth||138;
    TW.push(HanziWriter.create(el,c,{width:size,height:size,padding:8,
      showCharacter:d.ans!=null,showOutline:d.ans!=null,delayBetweenStrokes:150,
      ...teintesTrace()}));
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
