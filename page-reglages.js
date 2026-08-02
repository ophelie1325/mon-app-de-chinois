function vReglages(){
  const vs=zhVoices();
  /* Revenir sur cet écran relance la détection : c’est le geste naturel
     après avoir installé un pack de langue. */
  if(!vs.length&&typeof refreshVoices==='function')refreshVoices();
  return `<div class="top"><div class="htitle">Réglages<small>Police, voix, sons, correction, sauvegarde</small></div></div>
  <h2 class="sec">Police des caractères chinois</h2>
  ${Object.keys(FONTS).map(k=>`<button class="wrow" style="width:100%;text-align:left;${S.settings.font===k?'border-color:var(--red)':''}"
    onclick="S.settings.font='${k}';save();render()">
    <span class="g" style="font-family:${FONTS[k].v.replace(/"/g,'&quot;')};font-size:27px">汉字</span>
    <span class="m"><b style="${S.settings.font===k?'color:var(--red)':''}">${esc(FONTS[k].n)}</b><span class="mut">${esc(FONTS[k].ex)}</span></span>
    ${S.settings.font===k?'<span class="seal">选</span>':''}
  </button>`).join('')}

  <h2 class="sec">Voix</h2>
  <div class="box">
    ${vs.length?`<p class="mut sm">${vs.length} voix chinoise${vs.length>1?'s':''} détectée${vs.length>1?'s':''} sur cet appareil.</p>
    ${voiceSelect('d','Par défaut')}
    ${voiceSelect('A','Locuteur A')}
    ${voiceSelect('B','Locuteur B')}
    ${voiceSelect('C','Locuteur C')}
    <p class="mut sm">Si vous n’avez qu’une seule voix, laissez « voix par défaut » sur les locuteurs : la hauteur sera décalée pour les distinguer.</p>`
    :`<p class="sm"><b>Aucune voix chinoise détectée.</b> Le détail ci-dessous dit pourquoi.</p>`}
    ${voiceDump()}
    <button class="btn pale sm mt" onclick="relanceVoix()">Relancer la détection</button>
    <p class="mut sm mt">Vitesse — ${S.settings.rate.toFixed(2)}×</p>
    <input type="range" min="0.5" max="1.2" step="0.05" value="${S.settings.rate}"
      oninput="S.settings.rate=parseFloat(this.value);save();render()">
    <p class="mut sm">Pause entre les répliques — ${S.settings.pause.toFixed(1)} s</p>
    <input type="range" min="0" max="2.5" step="0.1" value="${S.settings.pause}"
      oninput="S.settings.pause=parseFloat(this.value);save();render()">
    <button class="btn jade mt" onclick="speakSeq([{hz:'你好，我叫张明。',who:'A'},{hz:'你好，认识你很高兴。',who:'B'},{hz:'我也很高兴。',who:'C'}])">Tester un dialogue à trois voix</button>
    <button class="btn pale sm mt" onclick="stopSpeech()">Arrêter</button>
  </div>

  <h2 class="sec">Sons et rythme</h2>
  <div class="box">
    ${sw('sfx','Effets sonores','Un son court à chaque réponse juste ou fausse')}
    ${sw('auto','Passage automatique','Enchaîne la question suivante sans toucher « Suivant »')}
  </div>

  <h2 class="sec">Affichage des documents</h2>
  <div class="box">
    <p class="mut sm" style="margin:0 0 10px">Comment se présentent les textes et les dialogues en compréhension.</p>
    ${flowPills()}
    <p class="mut sm" style="margin:0">« Texte suivi » affiche le document d’un seul bloc, avec une seule écoute. « Découpé » place chaque phrase sur sa propre carte, avec son bouton d’écoute.</p>
  </div>

  <h2 class="sec">Correction et conversation</h2>
  <div class="box">
    <p class="mut sm">L’application fonctionne entièrement sans clé. Une clé ajoute la correction des écrits et la conversation libre du module 聊. Elle reste dans ce navigateur.</p>
    <div class="selwrap"><select onchange="S.settings.provider=this.value;S.settings.gmodel='';save();render()">
      <option value="none" ${S.settings.provider==='none'?'selected':''}>Aucune — modèle seul</option>
      <option value="gemini" ${S.settings.provider==='gemini'?'selected':''}>Google Gemini — gratuit</option>
      <option value="anthropic" ${S.settings.provider==='anthropic'?'selected':''}>Anthropic — payant à l’usage</option>
    </select></div>
    ${S.settings.provider!=='none'?`
      <input type="password" placeholder="Collez la clé ici" value="${esc(S.settings.apikey)}"
        oninput="S.settings.apikey=this.value.trim();save()" style="margin-top:10px">
      <p class="mut sm">${(S.settings.apikey||'').trim()
        ?`Clé enregistrée : ${(S.settings.apikey||'').trim().length} caractères, se termine par …${esc((S.settings.apikey||'').trim().slice(-4))}.`
        :'Aucune clé enregistrée pour l’instant.'}</p>
      <button class="btn jade mt" onclick="testKey()">Tester la clé</button>
      ${S.settings.gmodel?`<p class="mut sm mt">Modèle actuellement retenu : <b>${esc(S.settings.gmodel)}</b>${S.settings.gjson===false?' — sortie JSON simple':''}</p>`:''}
      <p class="mut sm mt">Si vous restreignez la clé aux sites web, l’adresse à autoriser est celle d’où vous ouvrez cette page : <b>${esc((typeof location!=='undefined'&&location.origin)||'—')}</b></p>
      ${ctx.test?`<div class="verdict ${ctx.test.busy?'':(ctx.test.ok?'ok':'no')}" style="margin-top:11px">${
        ctx.test.busy?'Essai en cours…':esc(ctx.test.msg)}</div>
        ${(ctx.test.det||[]).length?`<div class="box" style="margin-top:10px">
          <p class="mut sm" style="margin:0 0 6px"><b>Détail des essais</b> — à me recopier si besoin</p>
          ${ctx.test.det.map(d=>`<p class="mut sm" style="margin:0 0 4px">${esc(d)}</p>`).join('')}</div>`:''}`:''}
      <p class="mut sm mt">${S.settings.provider==='gemini'
        ?'Clé gratuite via Google AI Studio. Sur le palier gratuit, les données envoyées peuvent servir à entraîner le modèle.'
        :'Clé via la console Anthropic. Facturation à la consommation, indépendante de l’abonnement Claude.'}</p>`:''}
  </div>

  <h2 class="sec">Module 聊</h2>
  <div class="box">
    <p class="mut sm" style="margin:0 0 6px">Longueur d’un échange — ${S.settings.chatTurns} tours</p>
    <input type="range" min="4" max="10" step="1" value="${S.settings.chatTurns}"
      oninput="S.settings.chatTurns=parseInt(this.value,10);save();render()">
    ${sw('chatOneQ','Une seule question par tour','Décochez si vous préférez que le partenaire enchaîne deux questions, plus exigeant')}
    ${sw('chatDemote','Rétrograder les mots fautifs','Les mots relevés au débriefing redescendent d’une boîte et reviennent plus tôt en révision')}
    <button class="btn pale mt" onclick="chatExport()">Exporter mes conversations</button>
    <button class="btn pale sm mt" style="color:var(--red)" onclick="chatLogWipe()">Effacer le journal des conversations</button>
    <p class="mut sm mt">Les dix derniers échanges sont conservés à part, hors de la sauvegarde de progression.</p>
  </div>

  <h2 class="sec">Données d’exercice</h2>
  <div class="box">
    ${(function(){
      const P=DATA('WORDS'),faits=P.filter(w=>S.enrich&&S.enrich[w.id]).length;
      const cle=S.settings.provider!=='none'&&!!(S.settings.apikey||'').trim();
      return `<p class="sm" style="margin:0 0 6px"><b>Compléter le corpus</b></p>
      <p class="mut sm">Quatre épreuves — le mot juste, repérer la faute, la composition du caractère, la complétion à l’aveugle — ont besoin de données que les mots du corpus ne portent pas : voisins confondables, version fautive, décomposition, phrases d’exemple découpées. Le carnet les capte tout seul à la mise en favori. Pour les ${P.length} mots déjà en place, il faut les demander une fois.</p>
      <p class="mut sm"><b>${faits}</b> mot${faits>1?'s':''} sur ${P.length} déjà complété${faits>1?'s':''}.</p>
      ${ctx.enr&&ctx.enr.busy
        ?`<div class="bar" style="margin:10px 0"><i style="width:${Math.round(ctx.enr.fait/Math.max(1,ctx.enr.total)*100)}%"></i></div>
          <p class="mut sm">${ctx.enr.fait} sur ${ctx.enr.total}… ${esc(ctx.enr.mot||'')}</p>
          <button class="btn pale sm" onclick="enrStop()">Arrêter</button>`
        :`<button class="btn pale mt" onclick="enrGo()" ${cle?'':'disabled'}>${faits?'Reprendre':'Lancer'} — par lots de dix</button>
          ${cle?'':'<p class="mut sm mt">Une clé est nécessaire.</p>'}
          ${faits?`<button class="btn pale sm mt" onclick="enrWipe()">Effacer ces données</button>`:''}`}
      ${ctx.enr&&ctx.enr.msg?`<p class="mut sm mt">${esc(ctx.enr.msg)}</p>`:''}`;
    })()}
  </div>

  <h2 class="sec">Le carnet</h2>
  <div class="box">
    <p class="mut sm" style="margin:0 0 10px">${(S.fav||[]).length} entrée${(S.fav||[]).length>1?'s':''} mise${(S.fav||[]).length>1?'s':''} de côté depuis le traducteur. Elles voyagent dans l’export avec le reste, et « Tout effacer » ne les touche pas : c’est du contenu, pas de la progression.</p>
    ${(S.fav||[]).length?`<button class="btn pale sm" onclick="favWipe()" style="color:var(--red)">Vider le carnet</button>`:''}
  </div>

  <h2 class="sec">Ma progression</h2>
  <div class="box">
    <button class="btn pale" onclick="exportJSON()">Exporter dans un fichier</button>
    <button class="btn pale mt" onclick="document.getElementById('imp').click()">Importer un fichier</button>
    <button class="btn pale mt" style="color:var(--red)" onclick="wipe()">Tout effacer</button>
    <input type="file" id="imp" accept="application/json" class="hidden" onchange="importJSON(this)">
    <p class="mut sm mt">Exportez avant de changer d’appareil : la progression est stockée dans ce navigateur uniquement.</p>
  </div>

  <h2 class="sec">Version</h2>
  <div class="box">
    ${(function(){
      const v=buildsVus();
      return v.length<=1
        ? `<p class="mut sm">Livraison <b>${esc(v[0]||BUILD)}</b>. Les marqueurs de core.js,
           de core.css et des balises de la page concordent.</p>`
        : `<p class="sm"><b>Versions mélangées :</b> ${v.map(esc).join(' · ')}. Le navigateur
           sert des fichiers de livraisons différentes ; certains correctifs resteront invisibles.</p>`;
    })()}
    <button class="btn pale sm mt" onclick="location.replace(location.pathname+'?r='+Date.now())">Forcer le rechargement</button>
  </div>`;
}

/* ---------- Réglages ---------- */
function voiceSelect(key,label){
  const vs=zhVoices();
  const cur=(S.settings.voices||{})[key]||'';
  return `<div class="vsel"><span class="who">${esc(label)}</span>
    <div class="selwrap"><select onchange="setVoice('${key}',this.value)">
      <option value="">${key==='d'?'Première voix disponible':'Voix par défaut, hauteur décalée'}</option>
      ${vs.map(v=>`<option value="${esc(v.name)}" ${cur===v.name?'selected':''}>${esc(v.name)} — ${esc(v.lang)}</option>`).join('')}
    </select></div></div>`;
}

function setVoice(k,v){S.settings.voices=S.settings.voices||{};S.settings.voices[k]=v;save();render();}

function toggle(k){S.settings[k]=!S.settings[k];save();render();}

function sw(k,label,help){
  return `<div class="sw ${S.settings[k]?'on':''}" onclick="toggle('${k}')" role="button">
    <span class="lb">${esc(label)}${help?`<br><span class="mut sm">${esc(help)}</span>`:''}</span>
    <span class="kn"></span></div>`;
}


/* =====================================================================
   COMPLÉTER LES DONNÉES DU CORPUS

   Les mots saisis avant que ces épreuves n’existent ne portent ni
   voisins confondables, ni version fautive, ni décomposition. Sans ces
   données, les épreuves correspondantes ne sont tout simplement pas
   proposées — il n’y a jamais d’exercice à vide — mais le corpus reste
   alors sur les anciens types. On les demande donc une fois, par lots
   de dix, et on les garde. Ensuite ça ne dépend plus de la connexion.
   ===================================================================== */
/* Même leçon que pour le traducteur : sans « required » à chaque niveau,
   le modèle n’émet que le strict minimum et les données arrivent creuses. */
const T_={type:'STRING'};
const SEG_={type:'ARRAY',items:T_};
const EX_={type:'OBJECT',properties:{hz:T_,py:T_,fr:T_,seg:SEG_},
  propertyOrdering:['hz','py','fr','seg'],required:['hz','py','fr','seg']};
const VOIS_={type:'OBJECT',properties:{hz:T_,py:T_,fr:T_,note:T_},
  propertyOrdering:['hz','py','fr','note'],required:['hz','py','fr','note']};
const PART_={type:'OBJECT',properties:{p:T_,role:T_,sens:T_},
  propertyOrdering:['p','role','sens'],required:['p','role','sens']};
const DEC_={type:'OBJECT',properties:{c:T_,parts:{type:'ARRAY',items:PART_},note:T_},
  propertyOrdering:['c','parts','note'],required:['c','parts','note']};
const FAU_={type:'OBJECT',properties:{hz:T_,note:T_},
  propertyOrdering:['hz','note'],required:['hz','note']};
const MOT_={type:'OBJECT',properties:{
  hz:T_,exs:{type:'ARRAY',items:EX_},vois:{type:'ARRAY',items:VOIS_},
  faute:FAU_,decomp:{type:'ARRAY',items:DEC_}},
  propertyOrdering:['hz','exs','vois','faute','decomp'],
  required:['hz','exs','vois','faute','decomp']};
const ENRSCHEMA={type:'OBJECT',properties:{mots:{type:'ARRAY',items:MOT_}},
  propertyOrdering:['mots'],required:['mots']};

function enrStop(){if(ctx.enr)ctx.enr.stop=true;}

function enrWipe(){
  if(!confirm('Effacer les données complémentaires du corpus ? Les épreuves qui en dépendent ne seront plus proposées.'))return;
  S.enrich={};save();ctx.enr=null;render();toast('Données effacées.');
}

function favWipe(){
  if(!confirm('Vider le carnet ? Les favoris et leur progression seront perdus.'))return;
  (S.fav||[]).forEach(f=>{delete S.items[f.id];});
  S.fav=[];save();render();toast('Carnet vidé.');
}

async function enrGo(){
  if(ctx.enr&&ctx.enr.busy)return;
  const reste=DATA('WORDS').filter(w=>!(S.enrich&&S.enrich[w.id]));
  if(!reste.length){ctx.enr={msg:'Tout est déjà complété.'};return render();}
  ctx.enr={busy:true,fait:0,total:reste.length,stop:false,msg:'',mot:''};
  render();
  for(let i=0;i<reste.length;i+=10){
    if(ctx.enr.stop)break;
    const lot=reste.slice(i,i+10);
    ctx.enr.mot=lot[0].hz;render();
    try{
      const o=await askJSON(enrSys(),enrPrompt(lot),ENRSCHEMA,.3);
      ((o&&o.mots)||[]).forEach(m=>{
        const w=lot.find(x=>x.hz===m.hz);if(!w)return;
        S.enrich[w.id]=enrNettoie(m);
      });
      save();
    }catch(e){
      ctx.enr.busy=false;
      ctx.enr.msg='Interrompu : '+((e&&e.message)||e)+' — ce qui a déjà été obtenu est conservé.';
      return render();
    }
    ctx.enr.fait=Math.min(reste.length,i+10);render();
  }
  ctx.enr.busy=false;
  ctx.enr.msg=ctx.enr.stop?'Arrêté. Reprenez quand vous voulez.':'Corpus complété.';
  render();
}

function enrSys(){
  return `Tu es professeur de chinois pour une apprenante francophone de niveau HSK${S.settings.level}.

Règles absolues sur le pinyin : syllabe par syllabe, séparées par des espaces
(« míng zi », jamais « míngzi ») ; accents de ton, jamais de chiffres ; ton
neutre non marqué ; exactement autant de syllabes que de caractères. Si tu
n’es pas certain d’un ton, laisse le pinyin vide plutôt que de deviner.

Le champ « seg » découpe la phrase en mots : recollés, ils la redonnent
exactement. Apostrophes typographiques dans tout le français.`;
}

function enrPrompt(lot){
  return `Pour chacun de ces mots, fournis de quoi fabriquer des exercices.

${lot.map(w=>'· '+w.hz+' — '+w.py+' — '+w.fr).join('\n')}

Pour chaque mot :
· exs — deux phrases courtes contenant exactement le mot, avec pinyin,
  traduction française et découpage.
· vois — deux mots réellement confondables avec lui par une francophone,
  qui se traduisent pareil en français mais ne s’emploient pas dans les
  mêmes cas. « note » énonce la règle qui les sépare. Tableau vide s’il
  n’en existe pas de vraiment confondable : ne force pas.
· faute — une version fautive mais plausible de la première phrase, du
  genre d’erreur que fait une francophone, et la note qui l’explique.
· decomp — pour un ou deux caractères du mot : leurs composants, le rôle
  de chacun, ce que le composant signifie, et comment cela aide à retenir.

Renvoie le champ hz exactement tel qu’il est écrit ci-dessus.`;
}

function enrNettoie(m){
  const pyv=(hz,py)=>{try{return (py&&pinyinCheck(hz,py).ok)?py:'';}catch(e){return '';}};
  const seg=(x,hz)=>(Array.isArray(x)&&x.join('')===hz)?x.map(String):null;
  return {
    exs:(m.exs||[]).filter(x=>x&&x.hz).map(x=>({hz:String(x.hz),py:pyv(String(x.hz),String(x.py||'')),
      fr:String(x.fr||''),seg:seg(x.seg,String(x.hz))})),
    vois:(m.vois||[]).filter(x=>x&&x.hz).map(x=>({hz:String(x.hz),py:pyv(String(x.hz),String(x.py||'')),
      fr:String(x.fr||''),note:String(x.note||'')})),
    faute:(m.faute&&m.faute.hz)?{hz:String(m.faute.hz),note:String(m.faute.note||'')}:null,
    decomp:(m.decomp||[]).filter(c=>c&&c.c).map(c=>({c:String(c.c),note:String(c.note||''),
      parts:(c.parts||[]).filter(p=>p&&p.p).map(p=>({p:String(p.p),role:String(p.role||''),
        sens:String(p.sens||'')}))}))
  };
}
