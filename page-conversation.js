const REGISTERS=[
  {id:'reg2',n:'Courant — HSK 2',d:'Phrases très courtes, sujet souvent omis, 吧 呢 啊',
   consigne:'Registre courant et simple. Phrases très courtes. Le sujet peut être omis. Emploie les particules 吧, 呢, 啊.'},
  {id:'reg3',n:'Courant — HSK 3',d:'Un peu plus long, 嗯 行 没事儿, un peu de 儿化',
   consigne:'Registre courant et détendu. Tu peux employer 嗯, 行, 没事儿, et un peu de 儿化 : 这儿, 哪儿, 一点儿.'},
  {id:'regf',n:'Formel',        d:'您, 请问, 麻烦您, 打扰了',
   consigne:'Registre poli et formel. Tu vouvoies avec 您. Tu emploies 请问, 麻烦您, 打扰了.'}
];

const CHATROLE={
  presenter:'une personne que l’apprenante rencontre pour la première fois et qui cherche à faire connaissance',
  decrire:'une amie de l’apprenante qui veut savoir à quoi ressemble une personne qu’elles connaissent toutes les deux'
};

/* ---- Dialogues guidés, jouables sans aucune clé ---- */
const CHATSC=[
{theme:'presenter',hsk:2,titre:'À la bibliothèque',
 role:'Un étudiant chinois engage la conversation avec vous.',
 turns:[
  {hz:'你好！你叫什么名字？',py:'nǐ hǎo! nǐ jiào shén me míng zi',fr:'Bonjour ! Comment t’appelles-tu ?',
   a:[{hz:'我叫欧菲，你呢？',py:'wǒ jiào Ōu fēi, nǐ ne',fr:'Je m’appelle Ophélie, et toi ?',ok:1},
      {hz:'我很好，谢谢。',py:'wǒ hěn hǎo, xiè xie',fr:'Je vais bien, merci.',ok:0,why:'C’est la réponse à 你好吗，pas à une question sur le nom.'},
      {hz:'他是我的朋友。',py:'tā shì wǒ de péng you',fr:'C’est mon ami.',ok:0,why:'La question porte sur vous, pas sur quelqu’un d’autre.'}]},
  {hz:'我叫张明。你是哪国人？',py:'wǒ jiào Zhāng Míng. nǐ shì nǎ guó rén',fr:'Je m’appelle Zhang Ming. De quel pays viens-tu ?',
   a:[{hz:'我是法国人。',py:'wǒ shì Fǎ guó rén',fr:'Je suis française.',ok:1},
      {hz:'我今年三十岁。',py:'wǒ jīn nián sān shí suì',fr:'J’ai trente ans cette année.',ok:0,why:'C’est l’âge, pas la nationalité.'},
      {hz:'我住在北京。',py:'wǒ zhù zài Běi jīng',fr:'J’habite à Pékin.',ok:0,why:'C’est le lieu où l’on habite, pas le pays d’origine.'}]},
  {hz:'你在这儿做什么？',py:'nǐ zài zhèr zuò shén me',fr:'Que fais-tu ici ?',
   a:[{hz:'我是学生，我学汉语。',py:'wǒ shì xué sheng, wǒ xué Hàn yǔ',fr:'Je suis étudiante, j’apprends le chinois.',ok:1},
      {hz:'我很忙。',py:'wǒ hěn máng',fr:'Je suis très occupée.',ok:0,why:'Cela ne dit pas ce que vous faites ici.'},
      {hz:'我有一个朋友。',py:'wǒ yǒu yí ge péng you',fr:'J’ai un ami.',ok:0,why:'Hors sujet.'}]},
  {hz:'认识你很高兴！',py:'rèn shi nǐ hěn gāo xìng',fr:'Content de te connaître !',
   a:[{hz:'我也很高兴。',py:'wǒ yě hěn gāo xìng',fr:'Moi aussi.',ok:1},
      {hz:'我叫欧菲。',py:'wǒ jiào Ōu fēi',fr:'Je m’appelle Ophélie.',ok:0,why:'Le nom a déjà été donné au premier tour.'},
      {hz:'你是老师吗？',py:'nǐ shì lǎo shī ma',fr:'Es-tu professeur ?',ok:0,why:'On ne répond pas à la formule de politesse.'}]}]},

{theme:'presenter',hsk:3,titre:'Un nouveau collègue',
 role:'Un collègue vous accueille le premier jour, sur un ton professionnel.',
 turns:[
  {hz:'您好，请问您是新来的同事吗？',py:'nín hǎo, qǐng wèn nín shì xīn lái de tóng shì ma',fr:'Bonjour, êtes-vous la nouvelle collègue ?',
   a:[{hz:'是的，我是新来的。',py:'shì de, wǒ shì xīn lái de',fr:'Oui, je suis la nouvelle.',ok:1},
      {hz:'我很高兴认识您。',py:'wǒ hěn gāo xìng rèn shi nín',fr:'Je suis heureuse de vous connaître.',ok:0,why:'C’est poli, mais cela ne répond pas à la question posée.'},
      {hz:'我不是学生。',py:'wǒ bú shì xué sheng',fr:'Je ne suis pas étudiante.',ok:0,why:'Hors sujet.'}]},
  {hz:'您以前在哪儿工作？',py:'nín yǐ qián zài nǎr gōng zuò',fr:'Où travailliez-vous auparavant ?',
   a:[{hz:'我以前在上海工作。',py:'wǒ yǐ qián zài Shàng hǎi gōng zuò',fr:'Je travaillais à Shanghai.',ok:1},
      {hz:'我是去年结婚的。',py:'wǒ shì qù nián jié hūn de',fr:'Je me suis mariée l’an dernier.',ok:0,why:'C’est la date du mariage, pas le lieu de travail.'},
      {hz:'我在北京住了两年。',py:'wǒ zài Běi jīng zhù le liǎng nián',fr:'J’habite à Pékin depuis deux ans.',ok:0,why:'Cela parle du logement, pas du travail.'}]},
  {hz:'您是什么时候来北京的？',py:'nín shì shén me shí hou lái Běi jīng de',fr:'Quand êtes-vous venue à Pékin ?',
   a:[{hz:'我是去年来的。',py:'wǒ shì qù nián lái de',fr:'Je suis venue l’an dernier.',ok:1},
      {hz:'我来北京。',py:'wǒ lái Běi jīng',fr:'Je viens à Pékin.',ok:0,why:'La question appelle la structure 是…的 pour préciser le moment.'},
      {hz:'我去过法国。',py:'wǒ qù guo Fǎ guó',fr:'Je suis allée en France.',ok:0,why:'Hors sujet.'}]},
  {hz:'那您有什么爱好呢？',py:'nà nín yǒu shén me ài hào ne',fr:'Et quels sont vos centres d’intérêt ?',
   a:[{hz:'我特别喜欢跑步。',py:'wǒ tè bié xǐ huan pǎo bù',fr:'J’aime particulièrement courir.',ok:1},
      {hz:'我的工作很忙。',py:'wǒ de gōng zuò hěn máng',fr:'Mon travail est très prenant.',ok:0,why:'Cela parle du travail, pas des loisirs.'},
      {hz:'我没有朋友。',py:'wǒ méi yǒu péng you',fr:'Je n’ai pas d’amis.',ok:0,why:'Hors sujet.'}]}]},

{theme:'decrire',hsk:2,titre:'Ta nouvelle amie',
 role:'Une amie veut tout savoir de la personne que vous venez de rencontrer.',
 turns:[
  {hz:'你的新朋友叫什么名字？',py:'nǐ de xīn péng you jiào shén me míng zi',fr:'Comment s’appelle ta nouvelle amie ?',
   a:[{hz:'她叫小雨。',py:'tā jiào Xiǎo yǔ',fr:'Elle s’appelle Xiaoyu.',ok:1},
      {hz:'她很漂亮。',py:'tā hěn piào liang',fr:'Elle est très jolie.',ok:0,why:'C’est une description, la question portait sur le nom.'},
      {hz:'我有两个朋友。',py:'wǒ yǒu liǎng ge péng you',fr:'J’ai deux amis.',ok:0,why:'Cela ne donne pas le nom.'}]},
  {hz:'她高吗？',py:'tā gāo ma',fr:'Est-elle grande ?',
   a:[{hz:'她很高，也很漂亮。',py:'tā hěn gāo, yě hěn piào liang',fr:'Elle est grande, et jolie aussi.',ok:1},
      {hz:'她是高。',py:'tā shì gāo',fr:'Elle est grande.',ok:0,why:'Devant un adjectif on n’emploie pas 是 mais 很.'},
      {hz:'她不高吗？',py:'tā bù gāo ma',fr:'N’est-elle pas grande ?',ok:0,why:'C’est une question, pas une réponse.'}]},
  {hz:'她的性格怎么样？',py:'tā de xìng gé zěn me yàng',fr:'Quel est son caractère ?',
   a:[{hz:'她非常快乐，也很热情。',py:'tā fēi cháng kuài lè, yě hěn rè qíng',fr:'Elle est très gaie et très chaleureuse.',ok:1},
      {hz:'她穿白色的衣服。',py:'tā chuān bái sè de yī fu',fr:'Elle porte des vêtements blancs.',ok:0,why:'C’est le vêtement, pas le caractère.'},
      {hz:'她太快乐。',py:'tā tài kuài lè',fr:'Elle est trop gaie.',ok:0,why:'太 appelle 了 à la fin : 太快乐了.'}]},
  {hz:'你喜欢她吗？',py:'nǐ xǐ huan tā ma',fr:'Tu l’aimes bien ?',
   a:[{hz:'我很喜欢她。',py:'wǒ hěn xǐ huan tā',fr:'Je l’aime beaucoup.',ok:1},
      {hz:'我很高兴认识你。',py:'wǒ hěn gāo xìng rèn shi nǐ',fr:'Je suis heureuse de te connaître.',ok:0,why:'Cela ne répond pas à la question.'},
      {hz:'她喜欢我吗？',py:'tā xǐ huan wǒ ma',fr:'Est-ce qu’elle m’aime bien ?',ok:0,why:'La question est renvoyée au lieu d’être traitée.'}]}]},

{theme:'decrire',hsk:3,titre:'Reconnaître quelqu’un',
 role:'Une collègue doit aller chercher M. Zhang à l’aéroport et ne l’a jamais vu.',
 turns:[
  {hz:'你见过张老师吗？他长什么样？',py:'nǐ jiàn guo Zhāng lǎo shī ma? tā zhǎng shén me yàng',fr:'As-tu déjà vu M. Zhang ? À quoi ressemble-t-il ?',
   a:[{hz:'他长得很高，还戴眼镜。',py:'tā zhǎng de hěn gāo, hái dài yǎn jìng',fr:'Il est grand et porte des lunettes.',ok:1},
      {hz:'他很有名。',py:'tā hěn yǒu míng',fr:'Il est très connu.',ok:0,why:'Cela ne décrit pas son allure.'},
      {hz:'他长很高。',py:'tā zhǎng hěn gāo',fr:'Il est grand.',ok:0,why:'Après 长 il faut 得 devant le complément de degré : 长得很高.'}]},
  {hz:'他今年多大了？',py:'tā jīn nián duō dà le',fr:'Quel âge a-t-il ?',
   a:[{hz:'他五十多岁了。',py:'tā wǔ shí duō suì le',fr:'Il a une cinquantaine d’années.',ok:1},
      {hz:'他很年轻。',py:'tā hěn nián qīng',fr:'Il est jeune.',ok:0,why:'Cela ne donne pas l’âge demandé.'},
      {hz:'他今年多大？',py:'tā jīn nián duō dà',fr:'Quel âge a-t-il ?',ok:0,why:'La question est répétée au lieu d’être traitée.'}]},
  {hz:'他的性格怎么样？',py:'tā de xìng gé zěn me yàng',fr:'Quel est son caractère ?',
   a:[{hz:'他很热情，也很关心学生。',py:'tā hěn rè qíng, yě hěn guān xīn xué sheng',fr:'Il est chaleureux et attentif à ses étudiants.',ok:1},
      {hz:'他戴眼镜。',py:'tā dài yǎn jìng',fr:'Il porte des lunettes.',ok:0,why:'C’est l’apparence, pas le caractère.'},
      {hz:'他很安静吗？',py:'tā hěn ān jìng ma',fr:'Est-il calme ?',ok:0,why:'C’est une question, pas une réponse.'}]},
  {hz:'那我怎么找到他呢？',py:'nà wǒ zěn me zhǎo dào tā ne',fr:'Alors comment vais-je le trouver ?',
   a:[{hz:'别着急，他看过你的照片。',py:'bié zháo jí, tā kàn guo nǐ de zhào piàn',fr:'Ne t’inquiète pas, il a vu ta photo.',ok:1},
      {hz:'我也不认识他。',py:'wǒ yě bú rèn shi tā',fr:'Moi non plus je ne le connais pas.',ok:0,why:'Cela n’aide en rien.'},
      {hz:'他很帅。',py:'tā hěn shuài',fr:'Il est beau.',ok:0,why:'Hors sujet.'}]}]}
];

/* ---- Journal des conversations, clé séparée ---- */
const CHATKEY='coach-chinois-chats';

const CHAT_ITEM={type:'object',properties:{hz:{type:'string'},py:{type:'string'},fr:{type:'string'}},required:['hz','py','fr']};

const CHAT_SCHEMA={type:'object',properties:{
  hz:{type:'string'},py:{type:'string'},fr:{type:'string'},
  gloss:{type:'array',items:CHAT_ITEM},pistes:{type:'array',items:CHAT_ITEM}},
  required:['hz','py','fr','pistes']};

const DEB_SCHEMA={type:'object',properties:{
  bilan:{type:'string'},
  erreurs:{type:'array',items:{type:'object',properties:{
    ecrit:{type:'string'},attendu:{type:'string'},regle:{type:'string'},
    mots:{type:'array',items:{type:'string'}}},required:['ecrit','attendu','regle']}},
  reformulations:{type:'array',items:{type:'object',properties:{
    ecrit:{type:'string'},mieux:{type:'string'},py:{type:'string'},fr:{type:'string'}},required:['ecrit','mieux']}}},
  required:['bilan','erreurs']};

/* ---- Données et prompt ---- */
function chatWords(theme,hsk){return WORDS.filter(w=>w.hsk===hsk&&(w.th||[]).includes(theme));}

function chatGram(theme,hsk){return GRAMMAR.filter(g=>g.hsk===hsk&&(g.th||[]).includes(theme));}

function chatThemes(){
  const h=S.settings.level;
  return THEMES.filter(t=>chatWords(t.id,h).length>=6||CHATSC.some(c=>c.theme===t.id&&c.hsk===h));
}

function hasKey(){return S.settings.provider!=='none'&&!!(S.settings.apikey||'').trim();}

function chatSystem(c){
  const mots=chatWords(c.theme,c.hsk);
  const g=chatGram(c.theme,c.hsk)[0];
  const reg=REGISTERS.find(r=>r.id===c.reg)||REGISTERS[0];
  return `Tu es un partenaire de conversation chinois. Tu joues ce rôle : ${CHATROLE[c.theme]||'une personne qui bavarde avec l’apprenante'}.
Sujet de l’échange : ${themeName(c.theme)}. Niveau de l’apprenante : HSK ${c.hsk}.
${reg.consigne}

Vocabulaire autorisé. N’emploie aucun autre mot de contenu :
${mots.map(w=>w.hz+'  '+w.py+'  = '+w.fr).join('\n')}
Restent permis les outils grammaticaux de base : 的 了 吗 呢 吧 不 也 很 和 在 有 是 我 你 您 他 她 这 那 什么 谁 几 多少 怎么 可以 会 想 要 请.

${g?'Point de langue de la leçon, à faire apparaître naturellement dans tes questions : '+g.title+'.':''}

Règles absolues :
— Deux ou trois phrases courtes par tour, jamais davantage.
— Tu restes dans ton personnage. Aucune explication, aucune correction, aucune traduction à l’intérieur du message chinois.
${S.settings.chatOneQ===false
  ?'— Tu poses une ou deux questions par tour pour relancer l’échange.'
  :'— Tu poses UNE SEULE question par tour. Jamais deux, jamais trois. Une question, puis tu t’arrêtes.'}
— Le pinyin s’écrit SYLLABE PAR SYLLABE, séparées par des espaces, avec les marques de ton : « míng zi » et non « míngzi ». Exactement une syllabe par caractère chinois, ponctuation exclue.
— Tu réponds uniquement par un objet JSON conforme au schéma demandé.`;
}

function chatGuard(o){
  const r=pinyinCheck(o.hz||'',o.py||'');
  o.pyOk=r.ok;o.pyCode=r.code;o.doute=r.doute||[];
  ['pistes','gloss'].forEach(k=>(o[k]||[]).forEach(p=>{p.pyOk=pinyinCheck(p.hz||'',p.py||'').ok;}));
  return o;
}

function chatPiste(i){
  const c=ctx.chat,last=[...c.turns].reverse().find(t=>t.who==='them');
  if(!last||!last.pistes||!last.pistes[i])return;
  chatSend(last.pistes[i].hz);
}

function chatLog(c){
  try{
    const a=JSON.parse(localStorage.getItem(CHATKEY)||'[]');
    a.unshift({d:Date.now(),theme:c.theme,hsk:c.hsk,reg:c.reg,mode:c.mode,turns:c.turns,debrief:c.debrief||null});
    localStorage.setItem(CHATKEY,JSON.stringify(a.slice(0,10)));
  }catch(e){}
}

function chatLogRead(){try{return JSON.parse(localStorage.getItem(CHATKEY)||'[]');}catch(e){return [];}}

function chatLogWipe(){try{localStorage.removeItem(CHATKEY);}catch(e){}toast('Journal des conversations effacé.');render();}

function chatExport(){
  const b=new Blob([JSON.stringify(chatLogRead(),null,2)],{type:'application/json'});
  const u=URL.createObjectURL(b),a=document.createElement('a');
  a.href=u;a.download='conversations-chinois.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(u),2000);
}

function chatSetup(){
  const th=chatThemes(),h=S.settings.level;
  const dispo=th.filter(t=>chatWords(t.id,h).length>=6||CHATSC.some(x=>x.theme===t.id&&x.hsk===h));
  ctx.creg=ctx.creg||(h<=2?'reg2':'reg3');
  ctx.cth=ctx.cth||(dispo.some(t=>t.id===S.settings.theme)?S.settings.theme:(dispo[0]||{}).id);
  if(!dispo.length)return header('聊 — Conversation')+levelPills()+nothing();
  return header('聊 — Conversation','Dialoguer sur un thème, puis faire le point')+ribbon()+`
  ${levelPills()}
  <div class="box">
    <p class="u-mb2 mut sm">Thème</p>
    <div class="selwrap"><select onchange="ctx.cth=this.value;render()">
      ${dispo.map(t=>`<option value="${t.id}" ${ctx.cth===t.id?'selected':''}>${esc(t.n)}</option>`).join('')}
    </select></div>
    <p class="u-mv42 mut sm">Registre</p>
    ${REGISTERS.map(r=>`<button class="wrow" class="u-w-100pc u-ta-left ${ctx.creg===r.id?'choisi-jade':''}"
      onclick="ctx.creg='${r.id}';render()">
      <span class="m"><b class="${ctx.creg===r.id?'u-c-jade':''}">${esc(r.n)}</b><span class="mut">${esc(r.d)}</span></span>
      ${ctx.creg===r.id?'<span class="seal">选</span>':''}</button>`).join('')}
  </div>
  <div class="box">
    ${hasKey()
      ?`<p class="u-m0 sm"><b>Conversation libre.</b> <span class="mut">Votre partenaire s’en tient aux ${chatWords(ctx.cth,h).length} mots du thème. ${S.settings.chatTurns} tours, puis le point sur vos phrases.</span></p>`
      :`<p class="u-m0 sm"><b>Dialogue guidé.</b> <span class="mut">Sans clé, l’échange se fait à choix multiples, quatre répliques. Ajoutez une clé Gemini dans les Réglages pour la conversation libre.</span></p>`}
  </div>
  <button class="btn pale mt u-c-red" onclick="chatStart(ctx.cth,ctx.creg)">Commencer</button>`;
}

/* ---- Conduite de la conversation ---- */
function chatStart(theme,reg){
  const hsk=S.settings.level;
  const sc=CHATSC.find(x=>x.theme===theme&&x.hsk===hsk);
  ctx.chat={theme:theme,hsk:hsk,reg:reg,turns:[],draft:'',busy:false,done:false,
            mode:hasKey()?'live':'guide',sc:sc||null,step:0,picks:[],err:''};
  if(ctx.chat.mode==='live')chatNext('(La conversation commence. Salue-moi et pose ta première question.)');
  else render();
}

async function chatNext(msg){
  const c=ctx.chat;if(!c||c.busy)return;
  c.busy=true;c.err='';render();
  try{
    const o=chatGuard(await gemJSON(chatSystem(c),chatContents(c,msg),CHAT_SCHEMA));
    c.turns.push(Object.assign({who:'them'},o));
  }catch(e){c.err=e.message||String(e);}
  c.busy=false;render();
}

function chatSend(txt){
  const c=ctx.chat;if(!c||c.busy)return;
  const t=(txt!=null?txt:(c.draft||'')).trim();
  if(!t)return;
  c.turns.push({who:'me',hz:t});
  c.draft='';
  const n=c.turns.filter(x=>x.who==='me').length;
  chatNext(n>=(S.settings.chatTurns||7)?t+'\n(C’est mon dernier tour : conclus brièvement.)':t);
}

async function chatFinish(){
  const c=ctx.chat;if(!c||c.busy)return;
  c.busy=true;c.err='';render();
  const mots=chatWords(c.theme,c.hsk);
  const sys=`Tu es professeur de chinois pour une apprenante francophone de niveau HSK ${c.hsk}.
Tu reçois une conversation. Tu n’examines QUE les tours de l’apprenante.
Pour chaque erreur : ce qu’elle a écrit, ce qui était attendu, la règle en UNE phrase, en français.
Le champ « mots » liste les mots de cette liste directement concernés, en caractères chinois, tels quels :
${mots.map(w=>w.hz).join(' ')}
Ajoute des reformulations plus naturelles quand la phrase est correcte mais maladroite.
Termine par un bilan de deux phrases, encourageant et précis. Réponds en JSON.`;
  const trans=c.turns.map(t=>(t.who==='me'?'APPRENANTE : ':'PARTENAIRE : ')+t.hz).join('\n');
  try{
    const d=await gemJSON(sys,[{role:'user',parts:[{text:trans}]}],DEB_SCHEMA);
    (d.reformulations||[]).forEach(r=>{r.pyOk=pinyinCheck(r.mieux||'',r.py||'').ok;});
    c.debrief=d;c.done=true;
    c.retro=chatRetro(d,c);
    chatLog(c);
  }catch(e){c.err=e.message||String(e);}
  c.busy=false;render();
}

function chatRetro(d,c){
  if(!S.settings.chatDemote)return 0;
  const mots=chatWords(c.theme,c.hsk),vus={};
  (d.erreurs||[]).forEach(e=>(e.mots||[]).forEach(m=>{
    const w=mots.find(x=>x.hz===m)||mots.find(x=>m&&String(m).includes(x.hz));
    if(w&&!vus[w.id]){vus[w.id]=1;grade(w.id,1);}
  }));
  return Object.keys(vus).length;
}

/* ---- Écran ---- */
function chatShow(i,k){
  const t=ctx.chat&&ctx.chat.turns[i];if(!t)return;
  t[k]=!t[k];render();
}

function chatBubble(t,i){
  if(t.who==='me')return `<div class="bub me"><div class="sentence">${esc(t.hz)}</div></div>`;
  const py=t.pyOk!==false&&!!t.py;
  return `<div class="bub them">
    <div class="sentence">${esc(t.hz)}</div>
    <div class="u-mt3 row">
      <button class="btn pale tiny" onclick="speak('${jq(t.hz)}','A')">Écouter</button>
      ${py?`<button class="btn pale tiny" onclick="chatShow(${i},'vpy')">${t.vpy?'Cacher le pinyin':'Pinyin'}</button>`:''}
      <button class="btn pale tiny" onclick="chatShow(${i},'vfr')">${t.vfr?'Cacher la traduction':'Traduction'}</button>
    </div>
    ${t.pyOk===false?`<p class="u-mh2 mut sm">Pinyin écarté : ${pyMsg(t.pyCode)}.</p>`:''}
    ${t.vpy&&py?`<div class="u-mt2 py sm">${pinyin(t.py)}</div>
      ${t.doute&&t.doute.length?`<p class="u-mh1 mut sm">Lecture à vérifier sur : ${t.doute.map(d=>esc(d.c)).join(' ')}</p>`:''}`:''}
    ${t.vfr?`<p class="u-mh2 mut sm">${esc(t.fr||'')}</p>
      ${(t.gloss||[]).length?`<p class="u-mh2 mut sm">${t.gloss.map(g=>esc(g.hz+' — '+g.fr)).join(' · ')}</p>`:''}`:''}
  </div>`;
}

function chatContents(c,dernier){
  const out=[];
  c.turns.forEach(t=>{
    if(t.who==='them')out.push({role:'model',parts:[{text:JSON.stringify({hz:t.hz,py:t.py,fr:t.fr,pistes:t.pistes||[]})}]});
    else out.push({role:'user',parts:[{text:t.hz}]});
  });
  out.push({role:'user',parts:[{text:dernier}]});
  return out;
}

function chatDebriefBlock(c){
  const d=c.debrief||{};
  return `<h2 class="sec">Le point sur cet échange</h2>
  <div class="box"><p class="u-m0">${esc(d.bilan||'')}</p></div>
  ${(d.erreurs||[]).length?(d.erreurs||[]).map(e=>`<div class="box">
    <p class="u-mb1 hz"><b>${esc(e.ecrit||'')}</b></p>
    <p class="u-mb2 u-c-jade hz">${esc(e.attendu||'')}</p>
    <p class="u-m0 mut sm">${esc(e.regle||'')}</p></div>`).join('')
    :`<div class="box"><p class="u-m0 mut sm">Aucune erreur relevée.</p></div>`}
  ${(d.reformulations||[]).length?`<h2 class="sec">Plus naturel</h2>
  ${d.reformulations.map(r=>`<div class="box">
    <p class="u-mb1 mut sm">${esc(r.ecrit||'')}</p>
    <div class="sentence">${esc(r.mieux||'')}</div>
    ${r.pyOk&&r.py?`<div class="py sm">${pinyin(r.py)}</div>`:''}
    ${r.fr?`<p class="u-mh2 mut sm">${esc(r.fr)}</p>`:''}</div>`).join('')}`:''}
  ${c.retro?`<div class="box"><p class="u-m0 mut sm">${c.retro} mot${c.retro>1?'s':''} ${c.retro>1?'redescendus':'redescendu'} d’une boîte pour être revu${c.retro>1?'s':''} plus tôt.</p></div>`:''}
  <button class="btn pale mt" onclick="ctx.chat=null;render()">Nouvelle conversation</button>`;
}

function chatGuide(c){
  const t=c.sc.turns[c.step],pick=c.picks[c.step];
  const justes=c.picks.filter((p,i)=>p!=null&&c.sc.turns[i].a[p].ok).length;
  if(c.done)return header('聊 — '+esc(c.sc.titre),'Dialogue guidé')+ribbon()+`
    <div class="box"><p><b>Dialogue terminé.</b></p>
      <p class="mut sm">${justes} réponse${justes>1?'s':''} juste${justes>1?'s':''} sur ${c.sc.turns.length}.</p></div>
    ${c.sc.turns.map((x,i)=>`<div class="bub them"><div class="sentence">${esc(x.hz)}</div>
      <div class="u-mt2 py sm">${pinyin(x.py)}</div>
      <p class="u-mh2 mut sm">${esc(x.fr)}</p></div>
      <div class="bub me"><div class="sentence">${esc(x.a[c.picks[i]!=null?c.picks[i]:x.a.findIndex(a=>a.ok)].hz)}</div></div>`).join('')}
    <div class="box"><p class="u-m0 mut sm">Avec une clé Gemini dans les Réglages, cette étape devient une vraie conversation libre.</p></div>
    <button class="btn pale mt" onclick="ctx.chat=null;render()">Recommencer</button>`;
  return header('聊 — '+esc(c.sc.titre),'Dialogue guidé · réplique '+(c.step+1)+' sur '+c.sc.turns.length)+ribbon()+`
  <div class="box"><p class="u-m0 mut sm">${esc(c.sc.role)}</p></div>
  <div class="bub them">
    <div class="sentence">${esc(t.hz)}</div>
    <div class="u-mt3 row">
      <button class="btn pale tiny" onclick="speak('${jq(t.hz)}','A')">Écouter</button>
      <button class="btn pale tiny" onclick="ctx.gpy=!ctx.gpy;render()">${ctx.gpy?'Cacher le pinyin':'Pinyin'}</button>
      <button class="btn pale tiny" onclick="ctx.gfr=!ctx.gfr;render()">${ctx.gfr?'Cacher la traduction':'Traduction'}</button>
    </div>
    ${ctx.gpy?`<div class="u-mt2 py sm">${pinyin(t.py)}</div>`:''}
    ${ctx.gfr?`<p class="u-mh2 mut sm">${esc(t.fr)}</p>`:''}
  </div>
  <h2 class="sec">Que répondez-vous ?</h2>
  <div class="opts">${t.a.map((a,j)=>{
    let cl='';if(pick!=null)cl=a.ok?'ok':(j===pick?'no':'');
    return `<button class="opt han ${cl}" onclick="scPick(${j})">${esc(a.hz)}
      ${pick!=null?`<span class="mut sm"> — ${esc(a.fr)}</span>`:''}</button>`;}).join('')}</div>
  ${pick!=null?`<div class="verdict ${t.a[pick].ok?'ok':'no'}">${t.a[pick].ok?'Juste.':esc(t.a[pick].why||'Ce n’est pas la bonne réponse.')}</div>
    <button class="btn pale mt u-c-red" onclick="scNext()">${c.step+1<c.sc.turns.length?'Réplique suivante':'Terminer'}</button>`:''}`;
}

/* ---- Dialogue guidé, sans clé ---- */
function scPick(j){
  const c=ctx.chat,t=c.sc.turns[c.step];
  if(c.picks[c.step]!=null)return;
  c.picks[c.step]=j;
  beep(t.a[j].ok?'ok':'no');render();
}

function scNext(){
  const c=ctx.chat;
  if(c.step+1<c.sc.turns.length){c.step++;ctx.gpy=false;ctx.gfr=false;render();return;}
  c.done=true;c.turns=c.sc.turns.map((t,i)=>({who:'them',hz:t.hz,py:t.py,fr:t.fr}));
  chatLog(c);render();
}

function vChat(){
  const c=ctx.chat;
  if(!c)return chatSetup();
  const dernier=[...c.turns].reverse().find(t=>t.who==='them');
  const nMoi=c.turns.filter(t=>t.who==='me').length;
  const max=S.settings.chatTurns||7;
  if(c.mode==='guide')return chatGuide(c);
  return header('聊 — '+themeName(c.theme),'HSK '+c.hsk+' · tour '+Math.min(nMoi+1,max)+' sur '+max)+ribbon()+`
  ${c.turns.map(chatBubble).join('')}
  ${c.busy?`<div class="box"><p class="u-m0 mut sm">Votre interlocuteur écrit…</p></div>`:''}
  ${c.err?`<div class="verdict no">${esc(c.err)}</div>
    <button class="btn pale sm mt" onclick="chatNext('(Reprends.)')">Réessayer</button>`:''}
  ${c.done?chatDebriefBlock(c):`
  ${dernier&&(dernier.pistes||[]).length&&!c.busy?`<h2 class="sec">Pistes de réponse</h2>
    <div class="opts">${dernier.pistes.map((p,i)=>`<button class="opt han" onclick="chatPiste(${i})">
      ${esc(p.hz)}<span class="mut sm"> — ${esc(p.fr)}</span></button>`).join('')}</div>`:''}
  <h2 class="sec">Ma réponse</h2>
  <div class="box">
    <textarea rows="2" placeholder="Écrivez en chinois, au clavier" oninput="ctx.chat.draft=this.value">${esc(c.draft||'')}</textarea>
    <button class="btn pale mt u-c-red" onclick="chatSend()">Envoyer</button>
    ${nMoi>=4?`<button class="btn pale sm mt" onclick="chatFinish()">Terminer et faire le point</button>`:''}
  </div>`}`;
}
