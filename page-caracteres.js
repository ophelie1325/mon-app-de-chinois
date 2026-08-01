/* ---------- Caractères ---------- */
function vChars(){
  const P=CHARS.filter(fits);
  if(!P.length)return header('Caractères')+levelPills()+nothing();
  ctx.c=ctx.c||P[0].id;
  const c=P.find(x=>x.id===ctx.c)||P[0];
  return header('Caractères','Ordre des traits et tracé')+ribbon()+`
  <div class="box" style="text-align:center">
    <div id="tian" style="width:232px;height:232px;margin:0 auto;border-radius:20px;background:#FEFCF8;border:2px solid var(--line)"></div>
    <div class="hz" style="font-size:29px;font-weight:700;margin-top:12px">${esc(c.hz)}</div>
    <div class="py" style="font-size:18px">${pinyin(c.py)}</div>
    <p class="mut" style="margin-top:2px">${esc(c.fr)}</p>
    <p class="mut sm" id="wstatus">Chargement des tracés…</p>
    <div class="row mt">
      <button class="btn pale" onclick="anim()">Animer</button>
      <button class="btn" onclick="quiz()">Tracer</button>
    </div>
  </div>
  <h2 class="sec">Choisir un caractère</h2>
  <div class="tiles">${P.map(x=>`<button class="tile" onclick="ctx.c='${x.id}';render()"
    style="${x.id===c.id?'border-color:var(--indigo);color:var(--indigo)':''}">${esc(x.hz)}</button>`).join('')}</div>`;
}

let W=null;

function mountWriter(){
  const el=document.getElementById('tian');if(!el)return;
  const st=document.getElementById('wstatus');
  const c=CHARS.find(x=>x.id===ctx.c);
  if(typeof HanziWriter==='undefined'){
    if(st)st.textContent='Tracés indisponibles : la bibliothèque n’a pas pu être chargée. Vérifiez la connexion.';
    return;
  }
  el.innerHTML='';
  W=HanziWriter.create(el,c.hz,{width:232,height:232,padding:14,
    showCharacter:true,showOutline:true,delayBetweenStrokes:170,
    strokeColor:'#2C2723',outlineColor:'#E2D6C4',drawingColor:'#B8342E',highlightColor:'#3D7A69'});
  if(st)st.textContent='« Animer » montre l’ordre des traits. « Tracer » vous fait écrire au doigt.';
}

function anim(){if(W)W.animateCharacter();}

function quiz(){
  if(!W)return;
  const c=CHARS.find(x=>x.id===ctx.c);
  W.hideCharacter();
  W.quiz({onComplete(d){
    const good=d.totalMistakes===0;
    beep(good?'ok':'no');
    grade(c.id,good?2:(d.totalMistakes<=2?1:0));
    toast(good?'Tracé juste, sans erreur !':d.totalMistakes+' erreur(s) de tracé.');
    W.showCharacter();render();
  }});
}
