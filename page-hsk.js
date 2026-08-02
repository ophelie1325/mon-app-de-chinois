/* ---------- Entraînement HSK ---------- */
function vHSK(){
  const P=HSKX.filter(fits);
  if(!P.length)return header('Entraînement HSK')+levelPills()+nothing();
  ctx.h=ctx.h||P[0].id;
  const h=P.find(x=>x.id===ctx.h)||P[0];
  ctx.ans=ctx.ans||{};
  const answered=h.items.filter((_,i)=>ctx.ans[h.id+':'+i]!=null).length;
  const right=h.items.filter((it,i)=>ctx.ans[h.id+':'+i]===it.ok).length;
  return header('Entraînement HSK',h.format)+ribbon()+`
  ${P.length>1?`<div class="pills">${P.map(x=>`<button class="pill ${x.id===h.id?'on':''}"
    onclick="ctx.h='${x.id}';ctx.ans={};render()">${esc(x.section)}</button>`).join('')}</div>`:''}
  <div class="box"><p class="u-m0 sm"><b>${esc(h.consigne)}</b></p></div>
  ${h.items.map((it,i)=>{
    const key=h.id+':'+i,ch=ctx.ans[key];
    return `<div class="box" id="q-${h.id}-${i}">
      ${it.audio?`<button class="btn jade sm" onclick="speak('${jq(it.audio)}')">Écouter l’énoncé ${i+1}</button><div class="u-h-11"></div>`:''}
      <p class="u-tx2 u-fw-700 hz">${esc(it.q)}</p>
      ${opts(key,it,true,i+1<h.items.length?`q-${h.id}-${i+1}`:null)}
      ${ch!=null&&it.audio?`<p class="mut sm">Énoncé : <span class="hz">${esc(it.audio)}</span></p>`:''}
    </div>`;
  }).join('')}
  ${answered===h.items.length?`<div class="box"><div class="score">
    <div class="n">${right}<small> / ${h.items.length}</small></div><div class="lbl">réponses justes</div></div>
    <div class="u-mv33 bar"><i class="ok" style="width:${right/h.items.length*100}%"></i></div>
    <button class="btn pale" onclick="ctx.ans={};render()">Recommencer</button></div>`:''}`;
}
