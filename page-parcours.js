/* ---------- Parcours ---------- */
function vParcours(){
  return `<div class="top"><div class="htitle">Parcours<small>Une leçon complète par thème et par niveau</small></div></div>
  ${levelPills()}
  <div class="grid" style="grid-template-columns:1fr">
  ${THEMES.map((th,i)=>{
    const l=LESSONS.find(x=>x.theme===th.id&&x.hsk===S.settings.level);
    const p=l?(S.lessons[l.id]||[]).length:0;
    const c=['red','gold','jade','indigo','plum','clay'][i%6];
    const num=String(i+1).padStart(2,'0');
    if(!l)return `<button class="mod wide" style="opacity:.5"
      onclick="toast('Ce thème sera ajouté après validation du format.')">
      <span class="emb" style="color:var(--line2);font-family:var(--ui)">${num}</span>
      <span class="col"><b style="color:var(--muted)">${esc(th.n)}</b><span>Bientôt disponible</span></span></button>`;
    return `<button class="mod wide c-${c}" onclick="openLesson('${l.id}')">
      <span class="emb" style="font-family:var(--ui)">${num}</span>
      <span class="col"><b>${esc(th.n)}</b><span>${p} / ${l.steps.length} étapes</span>
        <span class="bar" style="margin-top:7px"><i style="width:${p/l.steps.length*100}%"></i></span></span>
    </button>`;
  }).join('')}
  </div>`;
}

function openLesson(id){S.lastLesson=id;save();go('lecon',{l:id});}

function vLecon(){
  const l=LESSONS.find(x=>x.id===ctx.l);
  if(!l)return vParcours();
  const done=S.lessons[l.id]||[];
  const words=WORDS.filter(w=>w.hsk===l.hsk&&w.th.includes(l.theme));
  const m=words.filter(w=>mastered(w.id)).length;
  const steps=l.steps.map((s,i)=>{
    const isDone=done.includes(i);
    const open=isDone||i===0||done.includes(i-1);
    const state=isDone?'Terminé':open?'À faire':'Verrouillé';
    return `<button class="pstep ${isDone?'done':open?'open':''}"
      onclick="${open?`openStep('${l.id}',${i})`:`toast('Terminez d’abord l’étape précédente.')`}">
      <span class="pseal">${isDone?'✓':STEPMARK[s.k]||'·'}</span>
      <span class="lab"><b>${esc(s.label)}</b><span>${state}</span></span>
    </button>`;
  }).join('');
  return header(l.title,l.intro)+`
  <div class="box">
    <div class="bar"><i style="width:${done.length/l.steps.length*100}%;background:var(--red)"></i></div>
    <p class="mut sm" style="margin:10px 0 0">${done.length} / ${l.steps.length} étapes · ${m} mot${m>1?'s':''} acquis sur ${words.length}</p>
  </div>
  <div class="path">${steps}</div>
  ${done.length===l.steps.length?`<div class="box" style="text-align:center">
    <p class="hz" style="font-size:42px;margin:0;color:var(--red);font-weight:700">成</p>
    <p><b>Thème terminé</b></p>
    <p class="mut sm">Passez au niveau supérieur pour reprendre le même thème avec plus de moyens.</p></div>`:''}`;
}

function openStep(lid,i){
  const l=LESSONS.find(x=>x.id===lid),s=l.steps[i];
  const from={l:lid,i:i};
  if(s.k==='mots')return startQuiz(lid,'mots',i);
  if(s.k==='bilan')return startQuiz(lid,'bilan',i);
  if(s.k==='gram')return go('gram',{g:s.ref,from:from});
  if(s.k==='prod')return go('prod',{p:s.ref,from:from});
  if(s.k==='chat')return go('chat',{from:from,lesson:lid});
  const t=TEXTS.find(x=>x.id===s.ref);
  if(s.k==='text')return go('decouv',{t:s.ref,from:from});
  return go(t.mode==='CO'?'co':'ce',{t:s.ref,from:from,doc:false});
}

function vDecouv(){
  const t=TEXTS.find(x=>x.id===ctx.t);
  if(!t)return header('Découverte')+nothing();
  const co=t.mode==='CO';
  ctx.mode=t.mode;
  if(!ctx.rep)ctx.rep=makeRep(t);
  const seq=seqOf(t);
  const montre=co?!!ctx.hz:true;
  const nbLoc=new Set(t.lines.map(l=>l.who).filter(Boolean)).size;
  const glob=(t.glob||[]).slice();
  if(co&&nbLoc>1)glob.unshift({q:'Combien de personnes parlent ?',
    a:['Une','Deux','Trois'],ok:Math.min(nbLoc,3)-1});
  return header('Découverte — '+(co?'j’écoute':'je lis'),esc(t.fr))+ribbon()+`
  <div class="box">
    <p><b>${esc(t.title)}</b></p>
    <p class="mut sm">${co
      ?'Écoutez une ou deux fois sans lire. Vous n’avez pas à tout comprendre : cherchez seulement de quoi il s’agit.'
      :'Lisez une première fois sans traduire. Cherchez seulement de quoi il s’agit.'}</p>
    <button class="btn jade mt" onclick='speakSeq(${seq})'>Écouter en entier</button>
    <button class="btn pale sm mt" onclick="stopSpeech()">Arrêter</button>
    ${docTools(t,t.mode)}
  </div>
  ${montre?flowPills()+docBody(t)
    :`<div class="void"><span class="em">听</span><p class="sm">Texte caché — c’est le moment d’écouter, pas de lire.</p></div>`}
  ${repBlock()}
  ${glob.length?`<h2 class="sec">De quoi s’agit-il ?</h2>
  ${glob.map((q,i)=>`<div class="box" id="q-gl-${i}"><p><b>${esc(q.q)}</b></p>
    ${opts('gl:'+t.id+':'+i,q,false,i+1<glob.length?`q-gl-${i+1}`:null)}</div>`).join('')}`:''}
  <button class="btn red mt" onclick="versQuestions()">Passer aux questions de détail</button>
  <p class="mut sm">Les questions précises sur le document sont à l’étape suivante.</p>`;
}

function versQuestions(){
  const t=TEXTS.find(x=>x.id===ctx.t);if(!t)return;
  go(t.mode==='CO'?'co':'ce',{t:t.id,from:ctx.from,doc:false});
}


/* ---------- Production écrite ---------- */
function vProd(){
  const P=PROD.filter(fits);
  if(!P.length)return header('Production écrite')+levelPills()+nothing();
  ctx.p=ctx.p||P[0].id;
  const p=P.find(x=>x.id===ctx.p)||P[0];
  const lbl={ordre:'Remettre en ordre',trad:'Traduire',libre:'Écrire librement'};
  return header('Production écrite',lbl[p.type])+ribbon()+`
  <div class="pills">${P.map((x,i)=>`<button class="pill ${x.id===p.id?'on':''}"
    onclick="ctx.p='${x.id}';ctx.built=[];ctx.res=null;ctx.aiout=null;render()">${i+1}. ${lbl[x.type]}</button>`).join('')}</div>
  ${p.type==='ordre'?pOrdre(p):p.type==='trad'?pTrad(p):pLibre(p)}
  ${S.written.length?`<h2 class="sec">Mon carnet</h2>
    ${S.written.slice().reverse().slice(0,6).map(e=>`<div class="box">
      <p class="mut sm" style="margin:0 0 6px">${new Date(e.t).toLocaleDateString('fr-FR')}</p>
      <div class="sentence" style="font-size:19px">${esc(e.txt)}</div>
      ${e.corr?`<p class="sm" style="white-space:pre-wrap;border-top:2px dashed var(--line);padding-top:10px;margin-top:10px">${esc(e.corr)}</p>`:''}
    </div>`).join('')}`:''}`;
}

const shuffled={};

function bagOf(p,built){
  const used=(built||[]).slice(),rest=[];
  p.words.forEach(w=>{const k=used.indexOf(w);if(k>=0)used.splice(k,1);else rest.push(w);});
  if(!shuffled[p.id])shuffled[p.id]=shuffle(p.words);
  const bag=[],tmp=rest.slice();
  shuffled[p.id].forEach(w=>{const k=tmp.indexOf(w);if(k>=0){bag.push(w);tmp.splice(k,1);}});
  tmp.forEach(w=>bag.push(w));
  return bag;
}

function pOrdre(p){
  ctx.built=ctx.built||[];
  const bag=bagOf(p,ctx.built);
  const done=ctx.built.join('')===p.ok;
  if(!bag.length&&!ctx.rang){ctx.rang=1;beep(done?'ok':'no');}
  if(bag.length)ctx.rang=0;
  return `<div class="box">
    <p><b>${esc(p.consigne)}</b></p>
    <p class="mut sm">${esc(p.fr)}</p>
    <div class="drop">${ctx.built.map((w,i)=>`<button class="tile" onclick="unbuild(${i})">${esc(w)}</button>`).join('')
      ||'<span class="mut sm" style="padding:0 6px">Touchez les mots dans l’ordre</span>'}</div>
    <div class="tiles mt">${bag.map((w,i)=>`<button class="tile" onclick="build(${i},'${jq(p.id)}')">${esc(w)}</button>`).join('')}</div>
    ${!bag.length?`<div class="verdict ${done?'ok':'no'} mt">${done?'Phrase juste !':'Ordre incorrect. Réponse : '+esc(p.ok)}</div>
      ${done?`<button class="btn jade mt" onclick="speakSeq([{hz:'${jq(p.ok)}'}])">Écouter la phrase</button>`:''}`:''}
    <button class="btn pale mt" onclick="ctx.built=[];ctx.rang=0;render()">Recommencer</button>
  </div>`;
}

function build(i,pid){
  const p=PROD.find(x=>x.id===pid);
  const bag=bagOf(p,ctx.built);
  ctx.built=(ctx.built||[]).concat(bag[i]);
  if(ctx.built.length===p.words.length)touchStreak();
  render();
}

function unbuild(i){ctx.built.splice(i,1);ctx.rang=0;render();}

function pTrad(p){
  return `<div class="box">
    <p><b>${esc(p.consigne)}</b></p>
    <p class="mut">${esc(p.fr)}</p>
    <textarea id="ta" rows="3" placeholder="Écrivez en chinois…">${esc(ctx.txt||'')}</textarea>
    <div class="row mt">
      <button class="btn gold sm" onclick="keepTxt();ctx.res='m';render()">Voir le modèle</button>
      <button class="btn jade sm" onclick="askAI('${p.id}')">Corriger</button>
    </div>
    <button class="btn pale sm mt" onclick="keep('${p.id}')">Garder dans mon carnet</button>
    ${ctx.res==='m'?`<div class="verdict ok mt"><div class="sentence" style="font-size:20px">${esc(p.ok)}</div>
      <p class="sm" style="margin:6px 0 0">Comparez structure par structure : plusieurs formulations sont justes.</p></div>
      <button class="btn pale sm" onclick="speakSeq([{hz:'${jq(p.ok)}'}])">Écouter le modèle</button>`:''}
    ${ctx.aiout?`<div class="verdict ok mt" style="white-space:pre-wrap">${esc(ctx.aiout)}</div>`:''}
  </div>`;
}

function pLibre(p){
  return `<div class="box">
    <p><b>${esc(p.consigne)}</b></p>
    <textarea id="ta" rows="7" placeholder="Écrivez librement…">${esc(ctx.txt||'')}</textarea>
    <div class="row mt">
      <button class="btn gold sm" onclick="keepTxt();ctx.res='m';render()">Voir un modèle</button>
      <button class="btn jade sm" onclick="askAI('${p.id}')">Corriger</button>
    </div>
    <button class="btn pale sm mt" onclick="keep('${p.id}')">Garder dans mon carnet</button>
    <p class="mut sm mt">Sans clé de correction, écrivez quand même : le texte est conservé et pourra être corrigé plus tard.</p>
    ${ctx.res==='m'&&p.modele?`<div class="verdict ok mt"><div class="sentence" style="font-size:19px">${esc(p.modele)}</div></div>
      <button class="btn pale sm" onclick="speakSeq([{hz:'${jq(p.modele||'')}'}])">Écouter le modèle</button>`:''}
    ${ctx.aiout?`<div class="verdict ok mt" style="white-space:pre-wrap">${esc(ctx.aiout)}</div>`:''}
  </div>`;
}

function keepTxt(){const t=document.getElementById('ta');if(t)ctx.txt=t.value;}

function keep(pid){
  keepTxt();
  if(!ctx.txt||!ctx.txt.trim())return toast('Rien à garder pour le moment.');
  const p=PROD.find(x=>x.id===pid);
  S.written.push({t:Date.now(),c:p.consigne,txt:ctx.txt.trim(),corr:ctx.aiout||''});
  touchStreak();save();ctx.txt='';ctx.aiout=null;render();toast('Ajouté à votre carnet.');
}

async function askAI(pid){
  keepTxt();
  if(!ctx.txt||!ctx.txt.trim())return toast('Écrivez d’abord quelque chose.');
  if(S.settings.provider==='none'||!S.settings.apikey)
    return toast('Aucune clé configurée. Voir Réglages, ou utilisez le modèle.');
  ctx.aiout='Correction en cours…';render();
  try{
    const p=PROD.find(x=>x.id===pid);
    ctx.aiout=await correct(ctx.txt,p.consigne);
    touchStreak();
  }catch(e){ctx.aiout='La correction a échoué ('+e.message+'). Vérifiez la clé dans Réglages.';}
  render();
}


/* ---------- Compréhension ---------- */
function vCO(){return comp('CO','Compréhension orale','Écoutez d’abord, le texte reste caché');}


function vCE(){return comp('CE','Compréhension écrite','Lisez, puis répondez');}
