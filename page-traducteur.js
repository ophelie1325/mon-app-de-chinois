/* =====================================================================
   TRADUCTEUR

   Deux régimes, et la page le dit toujours clairement :

     · sans clé — recherche dans le corpus de l’application. Ce n’est pas
       une traduction mais un dictionnaire : on ne montre que ce qui a
       été saisi et vérifié. Rien n’est inventé.
     · avec clé — traduction par le modèle choisi dans les Réglages.
       Le pinyin renvoyé passe par pinyinCheck : s’il ne correspond pas
       aux caractères, il n’est pas affiché du tout. Un pinyin faux
       mémorisé coûte plus cher qu’un pinyin absent.

   Le contenu propre du module viendra plus tard ; la mécanique est en
   place et n’invente jamais rien.
   ===================================================================== */

const TRADKEY='coach-chinois-trad';
function tradHist(){try{return JSON.parse(localStorage.getItem(TRADKEY)||'[]');}catch(e){return [];}}
function tradPush(e){try{const h=tradHist();h.unshift(e);localStorage.setItem(TRADKEY,JSON.stringify(h.slice(0,40)));}catch(e){}}
function tradWipe(){try{localStorage.removeItem(TRADKEY);}catch(e){}ctx.res=null;render();}
function tradSens(){return ctx.sens||'zh-fr';}
function setSens(s){ctx.sens=s;ctx.res=null;render();}
function tradGarde(){const t=document.getElementById('tin');if(t)ctx.q=t.value;}

/* --- Sans clé : le corpus sert de dictionnaire ----------------------- */
function tradLocal(q){
  const s=String(q||'').trim();
  if(!s)return [];
  const mots=DATA('WORDS'),bas=s.toLowerCase();
  const nu=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/ /g,'');
  let hits;
  if(/[\u4e00-\u9fff]/.test(s)){
    hits=mots.filter(w=>w.hz===s)
      .concat(mots.filter(w=>w.hz!==s&&w.hz.includes(s)))
      .concat(mots.filter(w=>!w.hz.includes(s)&&[...s].some(c=>w.hz.includes(c))));
  }else{
    hits=mots.filter(w=>w.fr.toLowerCase()===bas)
      .concat(mots.filter(w=>w.fr.toLowerCase()!==bas&&w.fr.toLowerCase().includes(bas)))
      .concat(mots.filter(w=>!w.fr.toLowerCase().includes(bas)&&nu(w.py).includes(nu(s))));
  }
  return hits.filter((w,i,t)=>t.indexOf(w)===i).slice(0,12);
}
function tradCherche(){tradGarde();ctx.res={local:tradLocal(ctx.q)};render();}

/* --- Avec clé -------------------------------------------------------- */
async function tradAsk(){
  tradGarde();
  const q=(ctx.q||'').trim();
  if(!q){toast('Rien à traduire.');return;}
  ctx.busy=true;ctx.res=null;render();
  const consigne=tradSens()==='zh-fr'
    ? `Traduis ce chinois en français, pour une apprenante de niveau HSK${S.settings.level}.`
    : `Traduis ce français en chinois simplifié, au niveau HSK${S.settings.level}, dans la langue la plus ordinaire possible.`;
  const prompt=`${consigne}
Texte :
${q}

Réponds uniquement par un objet JSON, sans balise ni commentaire :
{"hz":"la phrase en caractères chinois","py":"le pinyin syllabe par syllabe, tons marqués, séparés par des espaces","fr":"la traduction française","note":"une remarque brève de langue, ou une chaîne vide"}
Le pinyin doit comporter exactement autant de syllabes que de caractères chinois.`;
  try{
    const txt=await correct(q,prompt);
    let o=null;
    try{o=JSON.parse(String(txt).replace(/```json|```/g,'').trim());}catch(e){}
    if(!o)ctx.res={err:'Réponse illisible du modèle.'};
    else{
      let py=String(o.py||'').trim();
      if(py&&o.hz&&!pinyinCheck(o.hz,py).ok)py='';
      ctx.res={hz:o.hz||'',py:py,fr:o.fr||'',note:o.note||'',pyMasque:!!(o.py&&!py)};
      tradPush({q:q,hz:ctx.res.hz,fr:ctx.res.fr,t:Date.now()});
    }
  }catch(e){
    ctx.res={err:e.message==='aucune clé'
      ? 'Aucune clé enregistrée. Les Réglages permettent d’en ajouter une ; sans clé, la recherche dans le corpus reste disponible.'
      : 'La traduction a échoué : '+(e.message||e)};
  }
  ctx.busy=false;render();
}

/* --- Écran ----------------------------------------------------------- */
function vTrad(){
  const sens=tradSens(),r=ctx.res;
  const cle=S.settings.provider!=='none'&&!!(S.settings.apikey||'').trim();
  const h=tradHist();
  return `${header('Traducteur','Chercher dans le corpus, ou traduire')}
  ${speechNotice()}
  <div class="row">
    <button class="btn ${sens==='zh-fr'?'':'pale'}" onclick="setSens('zh-fr')">Chinois → français</button>
    <button class="btn ${sens==='fr-zh'?'':'pale'}" onclick="setSens('fr-zh')">Français → chinois</button>
  </div>
  <div class="box">
    <textarea id="tin" rows="3" oninput="tradGarde()"
      placeholder="${sens==='zh-fr'?'你叫什么名字？':'Comment t’appelles-tu ?'}">${esc(ctx.q||'')}</textarea>
    <button class="btn jade mt" onclick="tradCherche()">Chercher dans le corpus</button>
    <button class="btn mt" onclick="tradAsk()" ${ctx.busy?'disabled':''}>${ctx.busy?'Traduction en cours…':'Traduire'}</button>
    ${cle?'':`<p class="mut sm">Aucune clé n’est enregistrée : le bouton « Traduire » ne répondra pas.
      La recherche dans le corpus, elle, fonctionne toujours.</p>`}
  </div>
  ${r&&r.err?`<div class="box"><p class="mut sm">${esc(r.err)}</p></div>`:''}
  ${r&&r.local?(r.local.length
    ? `<div class="box"><h2>Dans le corpus</h2>
        ${r.local.map(w=>`<div class="box">
          <div class="hz">${esc(w.hz)}</div>
          <div class="py">${pinyin(w.py)}</div>
          <div class="fr">${esc(w.fr)}</div>
          <div class="sm">HSK ${w.hsk}${(w.th||[]).length?' · '+esc(themeName(w.th[0])):''}</div>
          <button class="btn pale sm mt" onclick="speak('${jq(w.hz)}')">Écouter</button>
        </div>`).join('')}</div>`
    : `<div class="box"><p class="mut sm">Rien dans le corpus pour cette recherche.
        C’est normal tant que les quinze thèmes ne sont pas remplis.</p></div>`):''}
  ${r&&!r.err&&!r.local?`<div class="box"><h2>Traduction</h2>
    ${r.hz?`<div class="hz">${esc(r.hz)}</div>`:''}
    ${r.py?`<div class="py">${pinyin(r.py)}</div>`:''}
    ${r.pyMasque?`<p class="mut sm">Le pinyin renvoyé ne correspondait pas aux caractères :
      il n’est pas affiché, plutôt que de risquer un ton faux en mémoire.</p>`:''}
    ${r.fr?`<div class="fr">${esc(r.fr)}</div>`:''}
    ${r.note?`<p class="sm">${esc(r.note)}</p>`:''}
    ${r.hz?`<button class="btn jade mt" onclick="speak('${jq(r.hz)}')">Écouter</button>
      <button class="btn pale sm mt" onclick="stopSpeech()">Arrêter</button>`:''}
  </div>`:''}
  ${h.length?`<div class="box"><h2>Dernières traductions</h2>
    ${h.slice(0,8).map(e=>`<div class="box">
      <div class="sm">${esc(e.q)}</div>
      ${e.hz?`<div class="hz" style="font-size:19px">${esc(e.hz)}</div>`:''}
      ${e.fr?`<div class="fr">${esc(e.fr)}</div>`:''}
    </div>`).join('')}
    <button class="btn pale sm mt" onclick="tradWipe()">Effacer l’historique</button>
  </div>`:''}`;
}
