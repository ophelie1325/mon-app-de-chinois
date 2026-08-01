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
