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
