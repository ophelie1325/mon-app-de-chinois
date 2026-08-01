/* =====================================================================
   data-gram.js — les fiches de grammaire.

   Une fiche est une source unique, rendue de deux façons : écran par
   écran en découverte, puis d’un seul tenant en fiche complète.

   Conventions de pinyin, identiques au reste de l’application :
     — une syllabe par mot, séparées par une espace ;
     — ton neutre sans marque (péng you, shén me, míng zi) ;
     — sandhi de 一 et de 不 noté (yí ge, yì qǐ, bú shì, bù hǎo) ;
     — erhua soudé (nǎr, zhèr, diǎnr) ;
     — noms propres avec majuscule (Běi jīng, Fǎ guó).

   Les phrases sont découpées en jetons {h:caractères, p:pinyin} pour
   que les exercices puissent les manipuler morceau par morceau et que
   le pinyin d’une phrase engendrée reste toujours exact.
   ===================================================================== */

const FAM=[
  {k:'nom',   em:'名', n:'Autour du nom'},
  {k:'verbe', em:'动', n:'Autour du verbe'},
  {k:'phrase',em:'句', n:'Autour de la phrase'}
];

/* Jeton de ponctuation : pas de pinyin. */
function P(h){return {h:h,p:''};}

const GRAMMAR=[

/* ------------------------------------------------------------------ */
{
  id:'g201', hsk:2, fam:'phrase', th:['presenter'],
  title:'Poser une question : 吗, 呢, 什么, 几, 多大',
  resume:'Le chinois n’inverse rien. La phrase garde son ordre, et le mot interrogatif se place exactement là où se trouvera la réponse.',

  steps:[
    {
      t:'吗 — transformer une affirmation en question',
      p:[
        'On prend une phrase affirmative complète, on ne touche à rien, et on pose <b>吗</b> à la fin. C’est tout : aucun mot ne se déplace, aucun ton ne change.',
        'La réponse ne se fait pas par un mot qui voudrait dire « oui ». On reprend le verbe de la question. Pour dire non, on met <b>不</b> devant ce même verbe.'
      ],
      ex:[
        {hz:'你是学生吗？',py:'nǐ shì xué shēng ma',fr:'Es-tu étudiante ?',
         note:'L’affirmative 你是学生 reste intacte. 吗 s’ajoute, rien d’autre ne bouge.'},
        {hz:'他喝茶吗？',py:'tā hē chá ma',fr:'Boit-il du thé ?',
         note:'Réponse possible : 喝 pour oui, 不喝 pour non.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['你吗是老师？','你是老师吗？'],ok:1,
             why:'吗 se pose à la toute fin de la phrase, jamais à l’intérieur.'}
    },
    {
      t:'呢 — renvoyer la question',
      p:[
        '<b>呢</b> se place après le mot dont on parle et suffit à retourner la question sans la répéter en entier.',
        'Employé après un nom seul, il demande où se trouve la chose.'
      ],
      ex:[
        {hz:'我很好，你呢？',py:'wǒ hěn hǎo, nǐ ne',fr:'Je vais bien, et toi ?'},
        {hz:'我的手机呢？',py:'wǒ de shǒu jī ne',fr:'Où est mon téléphone ?',
         note:'Sans verbe : 呢 suffit à poser la question de l’endroit.'}
      ],
      check:{q:'我是法国人，你___？',a:['吗','呢'],ok:1,
             why:'吗 attend oui ou non. Ici on renvoie la question : c’est 呢.'}
    },
    {
      t:'Le mot interrogatif reste à la place de la réponse',
      p:[
        'C’est le point qui résiste le plus au français. Nous déplaçons : « Tu t’appelles comment ? » devient « Comment t’appelles-tu ? ». En chinois, rien ne bouge.',
        '<b>什么</b> (quoi), <b>谁</b> (qui), <b>哪儿</b> (où), <b>怎么样</b> (comment) occupent exactement la case où l’on attend la réponse.'
      ],
      ex:[
        {hz:'你叫什么名字？',py:'nǐ jiào shén me míng zi',fr:'Comment t’appelles-tu ?',
         note:'Réponse : 我叫 Marie。 什么名字 et Marie occupent la même case.'},
        {hz:'他是谁？',py:'tā shì shéi',fr:'Qui est-il ?'},
        {hz:'你住在哪儿？',py:'nǐ zhù zài nǎr',fr:'Où habites-tu ?'}
      ],
      check:{q:'Pour demander « Que bois-tu ? » :',a:['什么你喝？','你喝什么？'],ok:1,
             why:'La réponse serait 我喝茶。 什么 prend donc la place de 茶, à la fin.'}
    },
    {
      t:'几 ou 多少',
      p:[
        '<b>几</b> attend un petit nombre, en général moins de dix, et demande un classificateur derrière lui.',
        '<b>多少</b> ne présuppose aucune quantité et se passe de classificateur.'
      ],
      ex:[
        {hz:'你家有几口人？',py:'nǐ jiā yǒu jǐ kǒu rén',fr:'Combien de personnes dans ta famille ?',
         note:'口 est le classificateur des membres d’une famille.'},
        {hz:'这个多少钱？',py:'zhè ge duō shao qián',fr:'Combien coûte celui-ci ?'}
      ],
      check:{q:'Pour demander un prix, on emploie :',a:['几钱','多少钱'],ok:1,
             why:'Un prix n’est pas un petit nombre attendu : 多少, et sans classificateur.'}
    },
    {
      t:'多 + adjectif — demander une mesure',
      p:[
        '<b>多</b> suivi d’un adjectif demande une mesure : <b>多大</b> pour l’âge ou la taille, <b>多长</b> pour la longueur, <b>多远</b> pour la distance.',
        'Pour un enfant, on préfère <b>几岁</b>.'
      ],
      ex:[
        {hz:'你今年多大？',py:'nǐ jīn nián duō dà',fr:'Quel âge as-tu cette année ?'},
        {hz:'你女儿几岁？',py:'nǐ nǚ ér jǐ suì',fr:'Quel âge a ta fille ?'}
      ],
      check:{q:'À une collègue adulte, on demande :',a:['你几岁？','你多大？'],ok:1,
             why:'几岁 s’adresse aux enfants. À une adulte, 多大.'}
    },
    {
      t:'La question alternative V 不 V',
      p:[
        'On juxtapose le verbe affirmatif et le verbe nié : <b>是不是</b>, <b>去不去</b>, <b>好不好</b>. Le sens est celui de 吗.',
        'On ne met jamais 吗 en plus : les deux outils font le même travail, les cumuler est une faute.'
      ],
      ex:[
        {hz:'你是不是老师？',py:'nǐ shì bu shì lǎo shī',fr:'Es-tu professeur ?',
         note:'Dans V不V, 不 perd son ton et se prononce léger.'},
        {hz:'我们明天去，好不好？',py:'wǒ men míng tiān qù, hǎo bu hǎo',fr:'On y va demain, d’accord ?'}
      ],
      check:{q:'Laquelle est correcte ?',a:['你去不去吗？','你去不去？'],ok:1,
             why:'V不V remplace 吗. Les employer ensemble est une faute.'}
    }
  ],

  tableau:{
    cols:['Outil','Ce qu’il demande','Exemple'],
    rows:[
      ['吗','oui ou non','你忙吗？'],
      ['呢','et toi ? où est… ?','你呢？'],
      ['什么','quoi','你喝什么？'],
      ['谁','qui','他是谁？'],
      ['哪儿','où','你去哪儿？'],
      ['几','combien, petit nombre','几个人？'],
      ['多少','combien, quantité','多少钱？'],
      ['多大','quel âge','你多大？'],
      ['怎么样','comment c’est','这个怎么样？']
    ]
  },

  piege:{
    bad:{hz:'你叫什么名字吗？',py:'nǐ jiào shén me míng zi ma'},
    good:{hz:'你叫什么名字？',py:'nǐ jiào shén me míng zi'},
    why:'Un mot interrogatif pose déjà la question à lui seul. 吗 ne sert qu’aux questions fermées : mettre les deux revient à demander « Comment t’appelles-tu, oui ou non ? »'
  },

  voir:['g301'],

  banque:[
    {seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'学生',p:'xué shēng'},{h:'吗',p:'ma'},P('？')],cle:3,fr:'Es-tu étudiante ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'明天',p:'míng tiān'},{h:'来',p:'lái'},{h:'吗',p:'ma'},P('？')],cle:3,fr:'Viens-tu demain ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'妈妈',p:'mā ma'},{h:'好',p:'hǎo'},{h:'吗',p:'ma'},P('？')],cle:3,fr:'Ta mère va-t-elle bien ?'},
    {seg:[{h:'他',p:'tā'},{h:'喝',p:'hē'},{h:'什么',p:'shén me'},P('？')],cle:2,fr:'Que boit-il ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'叫',p:'jiào'},{h:'什么',p:'shén me'},{h:'名字',p:'míng zi'},P('？')],cle:2,fr:'Comment t’appelles-tu ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'买',p:'mǎi'},{h:'什么',p:'shén me'},P('？')],cle:2,fr:'Qu’achètes-tu ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('，'),{h:'你',p:'nǐ'},{h:'呢',p:'ne'},P('？')],cle:5,fr:'Je vais bien, et toi ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'手机',p:'shǒu jī'},{h:'呢',p:'ne'},P('？')],cle:3,fr:'Où est mon téléphone ?'},
    {seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'谁',p:'shéi'},P('？')],cle:2,fr:'Qui est-il ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'住',p:'zhù'},{h:'在',p:'zài'},{h:'哪儿',p:'nǎr'},P('？')],cle:3,fr:'Où habites-tu ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'家',p:'jiā'},{h:'有',p:'yǒu'},{h:'几',p:'jǐ'},{h:'口',p:'kǒu'},{h:'人',p:'rén'},P('？')],cle:3,fr:'Combien de personnes dans ta famille ?'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'多少',p:'duō shao'},{h:'钱',p:'qián'},P('？')],cle:1,fr:'Combien coûte celui-ci ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'今年',p:'jīn nián'},{h:'多大',p:'duō dà'},P('？')],cle:2,fr:'Quel âge as-tu cette année ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'女儿',p:'nǚ ér'},{h:'几',p:'jǐ'},{h:'岁',p:'suì'},P('？')],cle:2,fr:'Quel âge a ta fille ?'},
    {seg:[{h:'你',p:'nǐ'},{h:'去',p:'qù'},{h:'哪儿',p:'nǎr'},P('？')],cle:2,fr:'Où vas-tu ?'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'菜',p:'cài'},{h:'怎么样',p:'zěn me yàng'},P('？')],cle:2,fr:'Comment est ce plat ?'}
  ],
  leurres:['吗','呢','什么','谁','哪儿','几','多少','多大','怎么样'],

  gabarits:[
    {cadre:[{h:'你',p:'nǐ'},{s:'v'},{h:'什么',p:'shén me'},P('？')],
     fr:'Que … -tu ?',
     listes:{v:[{h:'喝',p:'hē',fr:'boire'},{h:'吃',p:'chī',fr:'manger'},{h:'看',p:'kàn',fr:'regarder'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'学',p:'xué',fr:'apprendre'},{h:'写',p:'xiě',fr:'écrire'}]}},
    {cadre:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'不',p:'bu'},{h:'是',p:'shì'},{s:'n'},P('？')],
     fr:'Es-tu … ?',
     listes:{n:[{h:'老师',p:'lǎo shī',fr:'professeur'},{h:'学生',p:'xué shēng',fr:'étudiant'},
                {h:'医生',p:'yī shēng',fr:'médecin'},{h:'中国人',p:'Zhōng guó rén',fr:'Chinois'},
                {h:'法国人',p:'Fǎ guó rén',fr:'Français'}]}},
    {cadre:[{h:'他',p:'tā'},{h:'的',p:'de'},{s:'n'},{h:'呢',p:'ne'},P('？')],
     fr:'Et son / sa … ?',
     listes:{n:[{h:'书',p:'shū',fr:'livre'},{h:'手机',p:'shǒu jī',fr:'téléphone'},
                {h:'照片',p:'zhào piàn',fr:'photo'},{h:'车',p:'chē',fr:'voiture'}]}}
  ],

  transfo:[
    {consigne:'Transformez en question avec 吗',
     de:{hz:'他是老师。',py:'tā shì lǎo shī',fr:'Il est professeur.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'老师',p:'lǎo shī'},{h:'吗',p:'ma'},P('？')],fr:'Est-il professeur ?'}},
    {consigne:'Transformez en question avec 吗',
     de:{hz:'你妈妈很忙。',py:'nǐ mā ma hěn máng',fr:'Ta mère est très occupée.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'妈妈',p:'mā ma'},{h:'忙',p:'máng'},{h:'吗',p:'ma'},P('？')],fr:'Ta mère est-elle occupée ?'}},
    {consigne:'Transformez en question alternative V 不 V',
     de:{hz:'你是学生吗？',py:'nǐ shì xué shēng ma',fr:'Es-tu étudiante ?'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'不',p:'bu'},{h:'是',p:'shì'},{h:'学生',p:'xué shēng'},P('？')],fr:'Es-tu étudiante ?'}},
    {consigne:'Posez la question à laquelle cette phrase répond',
     de:{hz:'我叫王明。',py:'wǒ jiào Wáng Míng',fr:'Je m’appelle Wang Ming.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'叫',p:'jiào'},{h:'什么',p:'shén me'},{h:'名字',p:'míng zi'},P('？')],fr:'Comment t’appelles-tu ?'}},
    {consigne:'Posez la question à laquelle cette phrase répond',
     de:{hz:'我住在北京。',py:'wǒ zhù zài Běi jīng',fr:'J’habite à Pékin.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'住',p:'zhù'},{h:'在',p:'zài'},{h:'哪儿',p:'nǎr'},P('？')],fr:'Où habites-tu ?'}},
    {consigne:'Posez la question à laquelle cette phrase répond',
     de:{hz:'我家有四口人。',py:'wǒ jiā yǒu sì kǒu rén',fr:'Nous sommes quatre dans ma famille.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'家',p:'jiā'},{h:'有',p:'yǒu'},{h:'几',p:'jǐ'},{h:'口',p:'kǒu'},{h:'人',p:'rén'},P('？')],fr:'Combien de personnes dans ta famille ?'}}
  ],

  fixes:[
    {seg:[{h:'你',p:'nǐ'},{h:'吗',p:'ma'},{h:'是',p:'shì'},{h:'老师',p:'lǎo shī'},P('？')],bad:1,
     bon:'你是老师吗？',why:'吗 se place à la fin de la phrase, jamais au milieu.'},
    {seg:[{h:'什么',p:'shén me'},{h:'你',p:'nǐ'},{h:'喝',p:'hē'},P('？')],bad:0,
     bon:'你喝什么？',why:'什么 occupe la place de la réponse : après le verbe, comme 茶 dans 我喝茶。'},
    {seg:[{h:'你',p:'nǐ'},{h:'叫',p:'jiào'},{h:'什么',p:'shén me'},{h:'名字',p:'míng zi'},{h:'吗',p:'ma'},P('？')],bad:4,
     bon:'你叫什么名字？',why:'什么 pose déjà la question. 吗 est de trop.'},
    {seg:[{h:'你',p:'nǐ'},{h:'去',p:'qù'},{h:'不',p:'bu'},{h:'去',p:'qù'},{h:'吗',p:'ma'},P('？')],bad:4,
     bon:'你去不去？',why:'V不V et 吗 font le même travail. On choisit l’un ou l’autre.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'几',p:'jǐ'},{h:'钱',p:'qián'},P('？')],bad:1,
     bon:'这个多少钱？',why:'Un prix se demande avec 多少, qui n’attend aucun nombre précis.'},
    {seg:[{h:'他',p:'tā'},{h:'谁',p:'shéi'},{h:'是',p:'shì'},P('？')],bad:1,
     bon:'他是谁？',why:'谁 prend la place de la réponse, après 是.'}
  ],

  reemploi:[
    {q:'Votre nouvelle voisine est chinoise. Posez-lui trois questions pour faire connaissance.',
     verif:[{type:'un_parmi',v:['吗','呢','什么','谁','哪儿','几','多少','多大'],msg:'Aucun outil interrogatif repéré dans votre réponse.'}],
     modeles:[
       {hz:'你叫什么名字？',py:'nǐ jiào shén me míng zi',fr:'Comment vous appelez-vous ?'},
       {hz:'你是哪国人？',py:'nǐ shì nǎ guó rén',fr:'De quel pays êtes-vous ?'},
       {hz:'你在哪儿工作？',py:'nǐ zài nǎr gōng zuò',fr:'Où travaillez-vous ?'}
     ],
     criteres:['Chaque phrase se termine par ？','Aucune phrase ne cumule un mot interrogatif et 吗','Le mot interrogatif est à la place de la réponse, pas en tête']},
    {q:'Un ami vous dit 我很好。 Renvoyez-lui la question, le plus brièvement possible.',
     verif:[{type:'contient',v:'呢',msg:'On attend 呢 : c’est l’outil du renvoi.'}],
     modeles:[{hz:'你呢？',py:'nǐ ne',fr:'Et toi ?'}],
     criteres:['Deux caractères suffisent','Pas de 吗']},
    {q:'Demandez à quelqu’un son âge, puis combien de personnes composent sa famille.',
     verif:[{type:'contient',v:'多大',msg:'Pour l’âge d’un adulte, on attend 多大.'},
            {type:'contient',v:'几',msg:'Pour un petit nombre attendu, on emploie 几 avec son classificateur.'}],
     modeles:[
       {hz:'你今年多大？',py:'nǐ jīn nián duō dà',fr:'Quel âge avez-vous cette année ?'},
       {hz:'你家有几口人？',py:'nǐ jiā yǒu jǐ kǒu rén',fr:'Combien de personnes dans votre famille ?'}
     ],
     criteres:['几 est suivi du classificateur 口','Aucune phrase ne contient 吗']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g202', hsk:2, fam:'verbe', th:['decrire'],
  title:'Décrire : 很, 不, 太…了, et le 的 qui qualifie',
  resume:'Un adjectif chinois se comporte comme un verbe : il se passe de 是. Devant lui, 很 ne dit pas « très », il sert de support à la phrase.',

  steps:[
    {
      t:'L’adjectif est déjà un verbe',
      p:[
        'En français, « elle est belle » demande le verbe être. En chinois, l’adjectif joue lui-même le rôle du verbe : <b>她很漂亮</b>, sans 是.',
        'Mettre 是 devant un adjectif est la faute la plus fréquente chez les francophones, et elle s’entend immédiatement.'
      ],
      ex:[
        {hz:'她很漂亮。',py:'tā hěn piào liang',fr:'Elle est belle.',
         note:'Pas de 是 : 漂亮 est le verbe de la phrase.'},
        {hz:'我的老师很忙。',py:'wǒ de lǎo shī hěn máng',fr:'Mon professeur est très occupé.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他是高。','他很高。'],ok:1,
             why:'L’adjectif se passe de 是. On le fait précéder d’un adverbe, ici 很.'}
    },
    {
      t:'很 n’est pas vraiment « très »',
      p:[
        'Un adjectif seul, sans rien devant, prend un sens de comparaison implicite : <b>她漂亮</b> laisse entendre « elle, elle est belle — les autres moins ».',
        'Pour dire simplement qu’une chose est ainsi, on pose <b>很</b>, qui ne pèse presque rien. Il devient un vrai « très » seulement quand on l’accentue à l’oral.',
        'Pour insister réellement, on emploie <b>非常</b> ou <b>特别</b>.'
      ],
      ex:[
        {hz:'今天很热。',py:'jīn tiān hěn rè',fr:'Il fait chaud aujourd’hui.',
         note:'很 ne se traduit pas ici : la phrase dit simplement qu’il fait chaud.'},
        {hz:'今天非常热。',py:'jīn tiān fēi cháng rè',fr:'Il fait extrêmement chaud aujourd’hui.'}
      ],
      check:{q:'Pour dire « Il fait beau aujourd’hui », sans insister :',a:['今天好。','今天很好。'],ok:1,
             why:'L’adjectif nu suggère une comparaison. 很 rend la phrase neutre.'}
    },
    {
      t:'La négation : 不 devant l’adjectif',
      p:[
        'On nie avec <b>不</b>, placé devant l’adjectif, et <b>很 disparaît</b> : 很 et 不 ne cohabitent pas dans une phrase simple.',
        'Devant un adjectif de quatrième ton, 不 se prononce au deuxième ton : bú, comme dans 不贵.'
      ],
      ex:[
        {hz:'这个不贵。',py:'zhè ge bú guì',fr:'Ce n’est pas cher.'},
        {hz:'我朋友不高。',py:'wǒ péng you bù gāo',fr:'Mon ami n’est pas grand.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他不很忙。','他不忙。'],ok:1,
             why:'On enlève 很 quand on nie. 不很 existe mais dit « pas très », ce qui est un autre sens.'}
    },
    {
      t:'太…了 — le degré excessif',
      p:[
        '<b>太</b> précède l’adjectif et <b>了</b> ferme la phrase. Les deux vont ensemble.',
        'Le sens est celui d’un excès, en bien comme en mal : trop cher, mais aussi formidable.'
      ],
      ex:[
        {hz:'这件衣服太贵了。',py:'zhè jiàn yī fu tài guì le',fr:'Ce vêtement est trop cher.'},
        {hz:'太好了！',py:'tài hǎo le',fr:'Formidable !'}
      ],
      check:{q:'Complétez : 这个菜太辣___。',a:['了','吗'],ok:0,
             why:'太 appelle 了 en fin de phrase. C’est un couple.'}
    },
    {
      t:'的 — qualifier un nom',
      p:[
        'Pour placer l’adjectif devant le nom, on intercale <b>的</b> : 漂亮<b>的</b>照片.',
        'Avec un adjectif d’une seule syllabe très courant, 的 tombe : 好人, 大城市.',
        'Attention à ne pas confondre les deux constructions : 她很漂亮 est une phrase complète ; 漂亮的姑娘 n’est qu’un groupe de mots.'
      ],
      ex:[
        {hz:'这是一张很漂亮的照片。',py:'zhè shì yì zhāng hěn piào liang de zhào piàn',fr:'C’est une très belle photo.'},
        {hz:'他是一个好人。',py:'tā shì yí ge hǎo rén',fr:'C’est quelqu’un de bien.',
         note:'好 est monosyllabique et courant : 的 disparaît.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['一个漂亮姑娘','一个漂亮的姑娘'],ok:1,
             why:'漂亮 a deux syllabes : 的 est nécessaire.'}
    }
  ],

  tableau:{
    cols:['Ce qu’on veut dire','Construction','Exemple'],
    rows:[
      ['C’est ainsi, neutre','很 + adjectif','她很高'],
      ['C’est vraiment ainsi','非常 / 特别 + adjectif','她非常高'],
      ['Ce n’est pas ainsi','不 + adjectif','她不高'],
      ['C’est excessif','太 + adjectif + 了','太高了'],
      ['Qualifier un nom','adjectif + 的 + nom','漂亮的照片'],
      ['Adjectif court et courant','adjectif + nom','好人']
    ]
  },

  piege:{
    bad:{hz:'她是漂亮。',py:'tā shì piào liang'},
    good:{hz:'她很漂亮。',py:'tā hěn piào liang'},
    why:'Le français fait passer l’adjectif par le verbe être ; le chinois non. L’adjectif est le verbe. 是 ne s’emploie qu’avec un nom : 她是老师.'
  },

  voir:['g302'],

  banque:[
    {seg:[{h:'她',p:'tā'},{h:'很',p:'hěn'},{h:'漂亮',p:'piào liang'},P('。')],cle:1,fr:'Elle est belle.'},
    {seg:[{h:'今天',p:'jīn tiān'},{h:'很',p:'hěn'},{h:'热',p:'rè'},P('。')],cle:1,fr:'Il fait chaud aujourd’hui.'},
    {seg:[{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'老师',p:'lǎo shī'},{h:'很',p:'hěn'},{h:'忙',p:'máng'},P('。')],cle:3,fr:'Mon professeur est très occupé.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'不',p:'bú'},{h:'贵',p:'guì'},P('。')],cle:1,fr:'Ce n’est pas cher.'},
    {seg:[{h:'我',p:'wǒ'},{h:'朋友',p:'péng you'},{h:'不',p:'bù'},{h:'高',p:'gāo'},P('。')],cle:2,fr:'Mon ami n’est pas grand.'},
    {seg:[{h:'他',p:'tā'},{h:'不',p:'bù'},{h:'忙',p:'máng'},P('。')],cle:1,fr:'Il n’est pas occupé.'},
    {seg:[{h:'这件',p:'zhè jiàn'},{h:'衣服',p:'yī fu'},{h:'太',p:'tài'},{h:'贵',p:'guì'},{h:'了',p:'le'},P('。')],cle:2,fr:'Ce vêtement est trop cher.'},
    {seg:[{h:'太',p:'tài'},{h:'好',p:'hǎo'},{h:'了',p:'le'},P('！')],cle:0,fr:'Formidable !'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'菜',p:'cài'},{h:'太',p:'tài'},{h:'辣',p:'là'},{h:'了',p:'le'},P('。')],cle:2,fr:'Ce plat est trop épicé.'},
    {seg:[{h:'今天',p:'jīn tiān'},{h:'非常',p:'fēi cháng'},{h:'冷',p:'lěng'},P('。')],cle:1,fr:'Il fait extrêmement froid aujourd’hui.'},
    {seg:[{h:'她',p:'tā'},{h:'特别',p:'tè bié'},{h:'高兴',p:'gāo xìng'},P('。')],cle:1,fr:'Elle est particulièrement contente.'},
    {seg:[{h:'这',p:'zhè'},{h:'是',p:'shì'},{h:'一张',p:'yì zhāng'},{h:'漂亮',p:'piào liang'},{h:'的',p:'de'},{h:'照片',p:'zhào piàn'},P('。')],cle:4,fr:'C’est une belle photo.'},
    {seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'一个',p:'yí ge'},{h:'好',p:'hǎo'},{h:'人',p:'rén'},P('。')],cle:3,fr:'C’est quelqu’un de bien.'},
    {seg:[{h:'北京',p:'Běi jīng'},{h:'是',p:'shì'},{h:'一个',p:'yí ge'},{h:'很',p:'hěn'},{h:'大',p:'dà'},{h:'的',p:'de'},{h:'城市',p:'chéng shì'},P('。')],cle:5,fr:'Pékin est une très grande ville.'},
    {seg:[{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'房间',p:'fáng jiān'},{h:'不',p:'bú'},{h:'大',p:'dà'},P('。')],cle:3,fr:'Ma chambre n’est pas grande.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'城市',p:'chéng shì'},{h:'很',p:'hěn'},{h:'安静',p:'ān jìng'},P('。')],cle:2,fr:'Cette ville est calme.'}
  ],
  leurres:['很','不','太','了','的','非常','是'],

  gabarits:[
    {cadre:[{h:'我',p:'wǒ'},{h:'的',p:'de'},{s:'n'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'Mon / ma … est …',
     listes:{n:[{h:'老师',p:'lǎo shī',fr:'professeur'},{h:'房间',p:'fáng jiān',fr:'chambre'},
                {h:'朋友',p:'péng you',fr:'ami'},{h:'工作',p:'gōng zuò',fr:'travail'}],
             a:[{h:'忙',p:'máng',fr:'occupé'},{h:'大',p:'dà',fr:'grand'},
                {h:'新',p:'xīn',fr:'neuf'},{h:'安静',p:'ān jìng',fr:'calme'}]}},
    {cadre:[{h:'这个',p:'zhè ge'},{s:'n'},{h:'太',p:'tài'},{s:'a'},{h:'了',p:'le'},P('。')],
     fr:'Ce / cette … est trop …',
     listes:{n:[{h:'菜',p:'cài',fr:'plat'},{h:'房间',p:'fáng jiān',fr:'chambre'},
                {h:'城市',p:'chéng shì',fr:'ville'}],
             a:[{h:'贵',p:'guì',fr:'cher'},{h:'辣',p:'là',fr:'épicé'},
                {h:'小',p:'xiǎo',fr:'petit'},{h:'吵',p:'chǎo',fr:'bruyant'}]}},
    {cadre:[{h:'他',p:'tā'},{h:'不',p:'bù'},{s:'a'},P('。')],
     fr:'Il n’est pas …',
     listes:{a:[{h:'高',p:'gāo',fr:'grand'},{h:'忙',p:'máng',fr:'occupé'},
                {h:'胖',p:'pàng',fr:'gros'},{h:'年轻',p:'nián qīng',fr:'jeune'}]}}
  ],

  transfo:[
    {consigne:'Mettez à la forme négative',
     de:{hz:'她很高。',py:'tā hěn gāo',fr:'Elle est grande.'},
     vers:{seg:[{h:'她',p:'tā'},{h:'不',p:'bù'},{h:'高',p:'gāo'},P('。')],fr:'Elle n’est pas grande.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'这个很贵。',py:'zhè ge hěn guì',fr:'C’est cher.'},
     vers:{seg:[{h:'这个',p:'zhè ge'},{h:'不',p:'bú'},{h:'贵',p:'guì'},P('。')],fr:'Ce n’est pas cher.'}},
    {consigne:'Exprimez l’excès avec 太…了',
     de:{hz:'这个菜很辣。',py:'zhè ge cài hěn là',fr:'Ce plat est épicé.'},
     vers:{seg:[{h:'这个',p:'zhè ge'},{h:'菜',p:'cài'},{h:'太',p:'tài'},{h:'辣',p:'là'},{h:'了',p:'le'},P('。')],fr:'Ce plat est trop épicé.'}},
    {consigne:'Renforcez avec 非常',
     de:{hz:'今天很冷。',py:'jīn tiān hěn lěng',fr:'Il fait froid aujourd’hui.'},
     vers:{seg:[{h:'今天',p:'jīn tiān'},{h:'非常',p:'fēi cháng'},{h:'冷',p:'lěng'},P('。')],fr:'Il fait extrêmement froid aujourd’hui.'}},
    {consigne:'Faites de l’adjectif une épithète, avec 的',
     de:{hz:'这张照片很漂亮。',py:'zhè zhāng zhào piàn hěn piào liang',fr:'Cette photo est belle.'},
     vers:{seg:[{h:'一张',p:'yì zhāng'},{h:'漂亮',p:'piào liang'},{h:'的',p:'de'},{h:'照片',p:'zhào piàn'}],fr:'une belle photo'}},
    {consigne:'Faites de l’adjectif une épithète, avec 的',
     de:{hz:'这个城市很大。',py:'zhè ge chéng shì hěn dà',fr:'Cette ville est grande.'},
     vers:{seg:[{h:'一个',p:'yí ge'},{h:'很',p:'hěn'},{h:'大',p:'dà'},{h:'的',p:'de'},{h:'城市',p:'chéng shì'}],fr:'une très grande ville'}}
  ],

  fixes:[
    {seg:[{h:'她',p:'tā'},{h:'是',p:'shì'},{h:'漂亮',p:'piào liang'},P('。')],bad:1,
     bon:'她很漂亮。',why:'L’adjectif est déjà le verbe. 是 ne s’emploie que devant un nom.'},
    {seg:[{h:'他',p:'tā'},{h:'不',p:'bù'},{h:'很',p:'hěn'},{h:'忙',p:'máng'},P('。')],bad:2,
     bon:'他不忙。',why:'很 disparaît à la forme négative.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'很',p:'hěn'},{h:'贵',p:'guì'},{h:'了',p:'le'},P('。')],bad:1,
     bon:'这个太贵了。',why:'Le 了 final appelle 太, pas 很. 很 et 了 ne vont pas ensemble.'},
    {seg:[{h:'一个',p:'yí ge'},{h:'漂亮',p:'piào liang'},{h:'姑娘',p:'gū niang'}],bad:2,
     bon:'一个漂亮的姑娘',why:'漂亮 a deux syllabes : il faut 的 avant le nom.'},
    {seg:[{h:'今天',p:'jīn tiān'},{h:'是',p:'shì'},{h:'很',p:'hěn'},{h:'热',p:'rè'},P('。')],bad:1,
     bon:'今天很热。',why:'是 est de trop devant un adjectif.'},
    {seg:[{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'房间',p:'fáng jiān'},{h:'很',p:'hěn'},{h:'不',p:'bú'},{h:'大',p:'dà'},P('。')],bad:3,
     bon:'我的房间不大。',why:'很 et 不 ne se suivent pas : on garde seulement 不.'}
  ],

  reemploi:[
    {q:'Décrivez votre professeur de chinois en deux phrases : une qualité, puis une chose qu’il ou elle n’est pas.',
     verif:[{type:'contient',v:'不',msg:'La seconde phrase doit être négative : on attend 不.'},
            {type:'absent',v:'是很',msg:'是 ne s’emploie pas devant un adjectif.'}],
     modeles:[
       {hz:'我的老师很好，他不忙。',py:'wǒ de lǎo shī hěn hǎo, tā bù máng',fr:'Mon professeur est très bien, il n’est pas occupé.'},
       {hz:'她非常年轻，可是她不高。',py:'tā fēi cháng nián qīng, kě shì tā bù gāo',fr:'Elle est très jeune, mais elle n’est pas grande.'}
     ],
     criteres:['Aucun 是 devant un adjectif','很 a disparu dans la phrase négative','Chaque phrase a bien un adverbe devant l’adjectif affirmatif']},
    {q:'Vous êtes au marché et le prix vous paraît excessif. Réagissez en une phrase.',
     verif:[{type:'contient',v:'太',msg:'On attend 太 pour marquer l’excès.'},
            {type:'contient',v:'了',msg:'太 appelle 了 en fin de phrase.'}],
     modeles:[{hz:'太贵了！',py:'tài guì le',fr:'C’est trop cher !'},
              {hz:'这个太贵了，我不买。',py:'zhè ge tài guì le, wǒ bù mǎi',fr:'C’est trop cher, je n’achète pas.'}],
     criteres:['太 et 了 sont tous les deux présents','L’adjectif est entre les deux']},
    {q:'Présentez la ville où vous habitez avec un groupe « adjectif + 的 + nom ».',
     verif:[{type:'contient',v:'的',msg:'On attend 的 entre l’adjectif et le nom.'}],
     modeles:[{hz:'我住在一个很安静的城市。',py:'wǒ zhù zài yí ge hěn ān jìng de chéng shì',fr:'J’habite dans une ville très calme.'},
              {hz:'这是一个非常大的城市。',py:'zhè shì yí ge fēi cháng dà de chéng shì',fr:'C’est une très grande ville.'}],
     criteres:['的 sépare l’adjectif du nom','Le classificateur 个 est présent après 一','Pas de 是 devant l’adjectif']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g301', hsk:3, fam:'phrase', th:['presenter','passe'],
  title:'La structure 是…的 : préciser les circonstances',
  resume:'On ne raconte plus l’action : on la tient pour acquise et on met en relief l’une de ses circonstances — quand, où, comment, avec qui.',

  steps:[
    {
      t:'Quand l’employer',
      p:[
        'Les deux interlocuteurs savent déjà que l’action a eu lieu. Ce qui reste à dire, c’est <b>dans quelles conditions</b>.',
        'Comparez : 我来了 annonce l’arrivée, c’est une information neuve. 我是昨天来的 suppose que l’arrivée est connue et n’apporte que la date.'
      ],
      ex:[
        {hz:'我是去年来的。',py:'wǒ shì qù nián lái de',fr:'C’est l’an dernier que je suis venue.',
         note:'Le fait de venir est acquis ; la phrase ne sert qu’à dater.'},
        {hz:'你是怎么来的？',py:'nǐ shì zěn me lái de',fr:'Comment es-tu venu ?'}
      ],
      check:{q:'Votre ami sait que vous êtes rentrée de Chine et demande la date. Vous répondez :',
             a:['我八月回来了。','我是八月回来的。'],ok:1,
             why:'Le retour est déjà connu : on met en relief la date, donc 是…的.'}
    },
    {
      t:'Comment la construire',
      p:[
        '<b>是</b> se place juste devant l’élément mis en relief. <b>的</b> ferme la phrase, après le verbe.',
        'Ce qui est encadré par 是 et 的, c’est la circonstance : le moment, le lieu, le moyen, la compagnie.'
      ],
      ex:[
        {hz:'我是坐飞机来的。',py:'wǒ shì zuò fēi jī lái de',fr:'Je suis venue en avion.',
         note:'坐飞机 est encadré : c’est le moyen qui compte.'},
        {hz:'我是跟我妻子一起来的。',py:'wǒ shì gēn wǒ qī zi yì qǐ lái de',fr:'Je suis venu avec ma femme.'},
        {hz:'他是在北京学的中文。',py:'tā shì zài Běi jīng xué de Zhōng wén',fr:'C’est à Pékin qu’il a appris le chinois.'}
      ],
      check:{q:'Où se place 的 ?',a:['juste après 是','après le verbe, en fin de phrase'],ok:1,
             why:'是 ouvre devant la circonstance, 的 ferme après le verbe.'}
    },
    {
      t:'是 peut tomber — mais jamais 的',
      p:[
        'À la forme affirmative, <b>是</b> s’omet très souvent : 你什么时候到的？',
        'À la forme négative, en revanche, il est obligatoire, et c’est lui que 不 vient nier : <b>不是</b>…的.',
        '的 ne disparaît jamais : c’est lui qui porte toute la construction.'
      ],
      ex:[
        {hz:'你什么时候到的？',py:'nǐ shén me shí hou dào de',fr:'Quand es-tu arrivé ?',
         note:'是 est sous-entendu. La phrase reste parfaitement correcte.'},
        {hz:'我不是一个人来的。',py:'wǒ bú shì yí ge rén lái de',fr:'Je ne suis pas venue seule.',
         note:'À la négative, 是 revient obligatoirement.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我不一个人来的。','我不是一个人来的。'],ok:1,
             why:'La négation porte sur 是, qui redevient obligatoire.'}
    },
    {
      t:'Où mettre l’objet',
      p:[
        'Quand le verbe a un objet, <b>的</b> se glisse de préférence entre le verbe et l’objet : 学<b>的</b>中文.',
        'La place en toute fin reste possible : 学中文<b>的</b>. Les deux s’entendent ; la première est plus courante à l’oral.',
        'Si l’objet est un pronom, 的 se met obligatoirement à la fin.'
      ],
      ex:[
        {hz:'我是在大学学的汉语。',py:'wǒ shì zài dà xué xué de Hàn yǔ',fr:'C’est à l’université que j’ai appris le chinois.'},
        {hz:'我是昨天认识他的。',py:'wǒ shì zuó tiān rèn shi tā de',fr:'C’est hier que je l’ai rencontré.',
         note:'L’objet est le pronom 他 : 的 passe après lui.'}
      ],
      check:{q:'Avec un pronom objet, 的 se place :',a:['avant le pronom','après le pronom, en fin de phrase'],ok:1,
             why:'On ne sépare pas le verbe de son pronom objet : 认识他的.'}
    },
    {
      t:'Ne pas confondre avec 了',
      p:[
        '<b>了</b> annonce que l’action a eu lieu : c’est l’information principale.',
        '<b>是…的</b> tient l’action pour connue et commente ses circonstances.',
        'Une bonne façon de trancher : si la question porte sur « quand, où, comment, avec qui », la réponse veut 是…的.'
      ],
      ex:[
        {hz:'我买了一件衣服。',py:'wǒ mǎi le yí jiàn yī fu',fr:'J’ai acheté un vêtement.',
         note:'Information neuve : l’achat lui-même.'},
        {hz:'我是在网上买的。',py:'wǒ shì zài wǎng shàng mǎi de',fr:'Je l’ai acheté sur internet.',
         note:'L’achat est connu ; seul le lieu est neuf.'}
      ],
      check:{q:'— 你去过中国吗？ — 去过。— 你___去的？',a:['什么时候','了'],ok:0,
             why:'Le voyage est acquis. On demande la circonstance : 什么时候…的.'}
    }
  ],

  tableau:{
    cols:['Circonstance mise en relief','Exemple','Traduction'],
    rows:[
      ['Le moment','我是昨天来的','C’est hier que je suis venue'],
      ['Le lieu','我是在北京学的','C’est à Pékin que j’ai appris'],
      ['Le moyen','我是坐飞机来的','Je suis venue en avion'],
      ['La compagnie','我是跟朋友一起去的','J’y suis allée avec un ami'],
      ['La personne','是他告诉我的','C’est lui qui me l’a dit'],
      ['La négation','我不是一个人来的','Je ne suis pas venue seule']
    ]
  },

  piege:{
    bad:{hz:'我是昨天来了。',py:'wǒ shì zuó tiān lái le'},
    good:{hz:'我是昨天来的。',py:'wǒ shì zuó tiān lái de'},
    why:'是…的 et 了 ne se cumulent pas : ils répondent à deux besoins opposés. 了 annonce l’action, 是…的 la suppose connue et n’en commente que les circonstances.'
  },

  voir:['g201'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'去年',p:'qù nián'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],cle:4,fr:'C’est l’an dernier que je suis venue.'},
    {seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'怎么',p:'zěn me'},{h:'来',p:'lái'},{h:'的',p:'de'},P('？')],cle:2,fr:'Comment es-tu venu ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'坐',p:'zuò'},{h:'飞机',p:'fēi jī'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],cle:5,fr:'Je suis venue en avion.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'跟',p:'gēn'},{h:'我',p:'wǒ'},{h:'妻子',p:'qī zi'},{h:'一起',p:'yì qǐ'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],cle:7,fr:'Je suis venu avec ma femme.'},
    {seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'在',p:'zài'},{h:'北京',p:'Běi jīng'},{h:'学',p:'xué'},{h:'的',p:'de'},{h:'中文',p:'Zhōng wén'},P('。')],cle:5,fr:'C’est à Pékin qu’il a appris le chinois.'},
    {seg:[{h:'你',p:'nǐ'},{h:'什么时候',p:'shén me shí hou'},{h:'到',p:'dào'},{h:'的',p:'de'},P('？')],cle:1,fr:'Quand es-tu arrivé ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bú'},{h:'是',p:'shì'},{h:'一个人',p:'yí ge rén'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],cle:1,fr:'Je ne suis pas venue seule.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'在',p:'zài'},{h:'大学',p:'dà xué'},{h:'学',p:'xué'},{h:'的',p:'de'},{h:'汉语',p:'Hàn yǔ'},P('。')],cle:2,fr:'C’est à l’université que j’ai appris le chinois.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'昨天',p:'zuó tiān'},{h:'认识',p:'rèn shi'},{h:'他',p:'tā'},{h:'的',p:'de'},P('。')],cle:5,fr:'C’est hier que je l’ai rencontré.'},
    {seg:[{h:'是',p:'shì'},{h:'他',p:'tā'},{h:'告诉',p:'gào su'},{h:'我',p:'wǒ'},{h:'的',p:'de'},P('。')],cle:0,fr:'C’est lui qui me l’a dit.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'在',p:'zài'},{h:'网上',p:'wǎng shàng'},{h:'买',p:'mǎi'},{h:'的',p:'de'},P('。')],cle:3,fr:'Je l’ai acheté sur internet.'},
    {seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'跟',p:'gēn'},{h:'谁',p:'shéi'},{h:'一起',p:'yì qǐ'},{h:'去',p:'qù'},{h:'的',p:'de'},P('？')],cle:3,fr:'Avec qui y es-tu allé ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'二零二零年',p:'èr líng èr líng nián'},{h:'结婚',p:'jié hūn'},{h:'的',p:'de'},P('。')],cle:2,fr:'Je me suis mariée en 2020.'},
    {seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'从',p:'cóng'},{h:'上海',p:'Shàng hǎi'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],cle:2,fr:'Il vient de Shanghai.'}
  ],
  leurres:['是','的','了','在','跟','从','怎么'],

  gabarits:[
    {cadre:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{s:'q'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],
     fr:'C’est … que je suis venue.',
     listes:{q:[{h:'昨天',p:'zuó tiān',fr:'hier'},{h:'去年',p:'qù nián',fr:'l’an dernier'},
                {h:'上个月',p:'shàng ge yuè',fr:'le mois dernier'},{h:'今天早上',p:'jīn tiān zǎo shang',fr:'ce matin'}]}},
    {cadre:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'坐',p:'zuò'},{s:'t'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],
     fr:'Je suis venue en …',
     listes:{t:[{h:'飞机',p:'fēi jī',fr:'avion'},{h:'火车',p:'huǒ chē',fr:'train'},
                {h:'地铁',p:'dì tiě',fr:'métro'},{h:'出租车',p:'chū zū chē',fr:'taxi'}]}},
    {cadre:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'在',p:'zài'},{s:'l'},{h:'工作',p:'gōng zuò'},{h:'的',p:'de'},P('。')],
     fr:'C’est à … qu’il travaillait.',
     listes:{l:[{h:'北京',p:'Běi jīng',fr:'Pékin'},{h:'上海',p:'Shàng hǎi',fr:'Shanghai'},
                {h:'法国',p:'Fǎ guó',fr:'France'},{h:'大学',p:'dà xué',fr:'l’université'}]}}
  ],

  transfo:[
    {consigne:'Mettez en relief la circonstance avec 是…的',
     de:{hz:'我昨天来了。',py:'wǒ zuó tiān lái le',fr:'Je suis venue hier.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'昨天',p:'zuó tiān'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],fr:'C’est hier que je suis venue.'}},
    {consigne:'Mettez en relief la circonstance avec 是…的',
     de:{hz:'他坐火车去了上海。',py:'tā zuò huǒ chē qù le Shàng hǎi',fr:'Il est allé à Shanghai en train.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'是',p:'shì'},{h:'坐',p:'zuò'},{h:'火车',p:'huǒ chē'},{h:'去',p:'qù'},{h:'的',p:'de'},P('。')],fr:'C’est en train qu’il y est allé.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'我是一个人来的。',py:'wǒ shì yí ge rén lái de',fr:'Je suis venue seule.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'不',p:'bú'},{h:'是',p:'shì'},{h:'一个人',p:'yí ge rén'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],fr:'Je ne suis pas venue seule.'}},
    {consigne:'Posez la question sur le moyen de transport',
     de:{hz:'我是坐飞机来的。',py:'wǒ shì zuò fēi jī lái de',fr:'Je suis venue en avion.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'怎么',p:'zěn me'},{h:'来',p:'lái'},{h:'的',p:'de'},P('？')],fr:'Comment es-tu venue ?'}},
    {consigne:'Posez la question sur le lieu',
     de:{hz:'我是在北京学的中文。',py:'wǒ shì zài Běi jīng xué de Zhōng wén',fr:'C’est à Pékin que j’ai appris le chinois.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'是',p:'shì'},{h:'在',p:'zài'},{h:'哪儿',p:'nǎr'},{h:'学',p:'xué'},{h:'的',p:'de'},P('？')],fr:'Où l’as-tu appris ?'}},
    {consigne:'Omettez 是, la phrase restant correcte',
     de:{hz:'你是什么时候到的？',py:'nǐ shì shén me shí hou dào de',fr:'Quand es-tu arrivé ?'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'什么时候',p:'shén me shí hou'},{h:'到',p:'dào'},{h:'的',p:'de'},P('？')],fr:'Quand es-tu arrivé ?'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'昨天',p:'zuó tiān'},{h:'来',p:'lái'},{h:'了',p:'le'},P('。')],bad:4,
     bon:'我是昨天来的。',why:'是 appelle 的, pas 了. Les deux constructions ne se cumulent pas.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bù'},{h:'一个人',p:'yí ge rén'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],bad:1,
     bon:'我不是一个人来的。',why:'À la négative, 是 redevient obligatoire : c’est lui que 不 nie.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'的',p:'de'},{h:'去年',p:'qù nián'},{h:'来',p:'lái'},P('。')],bad:2,
     bon:'我是去年来的。',why:'的 ferme la phrase après le verbe, il ne suit pas 是.'},
    {seg:[{h:'你',p:'nǐ'},{h:'怎么',p:'zěn me'},{h:'是',p:'shì'},{h:'来',p:'lái'},{h:'的',p:'de'},P('？')],bad:2,
     bon:'你是怎么来的？',why:'是 se place devant la circonstance mise en relief, donc devant 怎么.'},
    {seg:[{h:'我',p:'wǒ'},{h:'是',p:'shì'},{h:'昨天',p:'zuó tiān'},{h:'认识',p:'rèn shi'},{h:'的',p:'de'},{h:'他',p:'tā'},P('。')],bad:4,
     bon:'我是昨天认识他的。',why:'Avec un pronom objet, 的 passe après lui, en fin de phrase.'}
  ],

  reemploi:[
    {q:'On vous demande 你是怎么来法国的？ Répondez en précisant le moyen de transport.',
     verif:[{type:'contient',v:'是',msg:'On attend 是 devant la circonstance.'},
            {type:'finit',v:'的',msg:'的 doit fermer la phrase.'}],
     modeles:[{hz:'我是坐飞机来的。',py:'wǒ shì zuò fēi jī lái de',fr:'Je suis venue en avion.'},
              {hz:'我是坐火车来的。',py:'wǒ shì zuò huǒ chē lái de',fr:'Je suis venue en train.'}],
     criteres:['是 précède le moyen de transport','的 est en fin de phrase','Aucun 了 dans la phrase']},
    {q:'Votre interlocuteur sait que vous avez appris le chinois. Dites-lui où et quand, en deux phrases.',
     verif:[{type:'contient',v:'的',msg:'La construction 是…的 exige 的.'},
            {type:'absent',v:'了',msg:'了 ne se cumule pas avec 是…的.'}],
     modeles:[{hz:'我是在大学学的汉语。',py:'wǒ shì zài dà xué xué de Hàn yǔ',fr:'C’est à l’université que j’ai appris le chinois.'},
              {hz:'我是二零一八年开始学的。',py:'wǒ shì èr líng yī bā nián kāi shǐ xué de',fr:'J’ai commencé à l’apprendre en 2018.'}],
     criteres:['是 encadre bien la circonstance','的 se place après le verbe','Aucune phrase ne contient 了']},
    {q:'Corrigez quelqu’un qui croit que vous êtes venue seule. Employez la forme négative.',
     verif:[{type:'contient',v:'不是',msg:'À la négative, on attend 不是…的.'},
            {type:'contient',v:'的',msg:'的 ne disparaît jamais.'}],
     modeles:[{hz:'我不是一个人来的，我是跟我朋友一起来的。',py:'wǒ bú shì yí ge rén lái de, wǒ shì gēn wǒ péng you yì qǐ lái de',fr:'Je ne suis pas venue seule, je suis venue avec mon amie.'}],
     criteres:['不 porte sur 是, pas sur le verbe','的 termine chaque proposition']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g302', hsk:3, fam:'verbe', th:['decrire'],
  title:'Le complément de degré : verbe + 得',
  resume:'得 relie l’action à un jugement sur la façon dont elle se déroule : non pas ce qu’on fait, mais comment on le fait.',

  steps:[
    {
      t:'À quoi sert 得',
      p:[
        'Le complément de degré ne raconte pas une action ponctuelle : il porte un jugement sur la manière dont elle se déroule, habituellement ou dans l’ensemble.',
        'La structure est simple : <b>verbe + 得 + jugement</b>. Le jugement se construit comme n’importe quelle phrase d’adjectif, avec 很 devant.'
      ],
      ex:[
        {hz:'他跑得很快。',py:'tā pǎo de hěn kuài',fr:'Il court vite.',
         note:'很 est là pour la même raison que dans 他很快 : il rend le jugement neutre.'},
        {hz:'你说得太快了。',py:'nǐ shuō de tài kuài le',fr:'Tu parles trop vite.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他跑很快。','他跑得很快。'],ok:1,
             why:'Sans 得, on ne peut pas raccrocher un jugement au verbe.'}
    },
    {
      t:'La négation porte sur le jugement',
      p:[
        '<b>不</b> ne se met pas devant le verbe, mais après 得, devant l’adjectif : 说<b>得不</b>好.',
        'Dire 不说得好 serait une faute : ce n’est pas l’action qu’on nie, c’est la qualité de son exécution.'
      ],
      ex:[
        {hz:'我写得不好。',py:'wǒ xiě de bù hǎo',fr:'J’écris mal.'},
        {hz:'他昨天睡得不好。',py:'tā zuó tiān shuì de bù hǎo',fr:'Il a mal dormi hier.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我不写得好。','我写得不好。'],ok:1,
             why:'不 se place après 得, devant l’adjectif jugé.'}
    },
    {
      t:'Interroger sur la manière',
      p:[
        'On emploie <b>得怎么样</b> pour demander comment se passe l’action.',
        'La forme alternative est aussi possible : 得好不好, 得快不快.'
      ],
      ex:[
        {hz:'你昨天睡得怎么样？',py:'nǐ zuó tiān shuì de zěn me yàng',fr:'Comment as-tu dormi hier ?'},
        {hz:'他汉语说得好不好？',py:'tā Hàn yǔ shuō de hǎo bu hǎo',fr:'Parle-t-il bien chinois ?'}
      ],
      check:{q:'Pour demander « Comment chante-t-elle ? » :',a:['她唱得怎么样？','她怎么样唱得？'],ok:0,
             why:'怎么样 prend la place du jugement, donc juste après 得.'}
    },
    {
      t:'Quand le verbe a un objet : on répète le verbe',
      p:[
        'Un objet ne peut pas s’intercaler entre le verbe et 得. Il faut donc <b>répéter le verbe</b> : 说汉语<b>说</b>得很好.',
        'On peut aussi placer l’objet en tête et ne garder qu’un verbe : 汉语说得很好. Cette forme est plus légère et très courante.',
        'Ce qu’on ne peut pas faire : 说得汉语很好.'
      ],
      ex:[
        {hz:'他说汉语说得很好。',py:'tā shuō Hàn yǔ shuō de hěn hǎo',fr:'Il parle très bien chinois.',
         note:'Le verbe 说 apparaît deux fois : une fois avec l’objet, une fois avec 得.'},
        {hz:'她唱歌唱得很好听。',py:'tā chàng gē chàng de hěn hǎo tīng',fr:'Elle chante très bien.'},
        {hz:'我汉字写得不好。',py:'wǒ Hàn zì xiě de bù hǎo',fr:'J’écris mal les caractères.',
         note:'L’objet est passé en tête : un seul verbe suffit.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他说得汉语很好。','他汉语说得很好。'],ok:1,
             why:'L’objet ne peut pas se glisser après 得. On le met en tête ou on répète le verbe.'}
    },
    {
      t:'Ne pas confondre les deux 得',
      p:[
        'Le 得 du complément de degré se prononce <b>de</b>, ton neutre, et suit toujours un verbe.',
        'Il ne faut pas le confondre avec 的, qui relie un qualifiant à un nom, ni avec 地, qui introduit la manière avant le verbe.',
        'Une règle sûre : 的 devant un nom, 得 après un verbe.'
      ],
      ex:[
        {hz:'她是一个唱得很好的歌手。',py:'tā shì yí ge chàng de hěn hǎo de gē shǒu',fr:'C’est une chanteuse qui chante très bien.',
         note:'Les deux dans la même phrase : 得 après 唱, 的 devant 歌手.'}
      ],
      check:{q:'我跑___很快。',a:['的','得'],ok:1,
             why:'Après un verbe, c’est 得.'}
    }
  ],

  tableau:{
    cols:['Forme','Construction','Exemple'],
    rows:[
      ['Affirmative','V + 得 + 很 + adjectif','他跑得很快'],
      ['Négative','V + 得 + 不 + adjectif','他跑得不快'],
      ['Interrogative','V + 得 + 怎么样','他跑得怎么样？'],
      ['Alternative','V + 得 + A 不 A','他跑得快不快？'],
      ['Avec objet, verbe répété','V + objet + V + 得 +…','他说汉语说得很好'],
      ['Avec objet en tête','objet + V + 得 +…','他汉语说得很好']
    ]
  },

  piege:{
    bad:{hz:'他说得汉语很好。',py:'tā shuō de Hàn yǔ hěn hǎo'},
    good:{hz:'他汉语说得很好。',py:'tā Hàn yǔ shuō de hěn hǎo'},
    why:'Après 得, on n’attend qu’un jugement — jamais un objet. Si le verbe a un objet, on le passe en tête ou on répète le verbe.'
  },

  voir:['g202'],

  banque:[
    {seg:[{h:'他',p:'tā'},{h:'跑',p:'pǎo'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'快',p:'kuài'},P('。')],cle:2,fr:'Il court vite.'},
    {seg:[{h:'你',p:'nǐ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'太',p:'tài'},{h:'快',p:'kuài'},{h:'了',p:'le'},P('。')],cle:2,fr:'Tu parles trop vite.'},
    {seg:[{h:'我',p:'wǒ'},{h:'写',p:'xiě'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好',p:'hǎo'},P('。')],cle:3,fr:'J’écris mal.'},
    {seg:[{h:'他',p:'tā'},{h:'昨天',p:'zuó tiān'},{h:'睡',p:'shuì'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好',p:'hǎo'},P('。')],cle:4,fr:'Il a mal dormi hier.'},
    {seg:[{h:'你',p:'nǐ'},{h:'昨天',p:'zuó tiān'},{h:'睡',p:'shuì'},{h:'得',p:'de'},{h:'怎么样',p:'zěn me yàng'},P('？')],cle:4,fr:'Comment as-tu dormi hier ?'},
    {seg:[{h:'他',p:'tā'},{h:'说',p:'shuō'},{h:'汉语',p:'Hàn yǔ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('。')],cle:4,fr:'Il parle très bien chinois.'},
    {seg:[{h:'她',p:'tā'},{h:'唱歌',p:'chàng gē'},{h:'唱',p:'chàng'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'好听',p:'hǎo tīng'},P('。')],cle:3,fr:'Elle chante très bien.'},
    {seg:[{h:'我',p:'wǒ'},{h:'汉字',p:'Hàn zì'},{h:'写',p:'xiě'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好',p:'hǎo'},P('。')],cle:3,fr:'J’écris mal les caractères.'},
    {seg:[{h:'他',p:'tā'},{h:'来',p:'lái'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'早',p:'zǎo'},P('。')],cle:2,fr:'Il arrive tôt.'},
    {seg:[{h:'她',p:'tā'},{h:'吃',p:'chī'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'少',p:'shǎo'},P('。')],cle:2,fr:'Elle mange peu.'},
    {seg:[{h:'你',p:'nǐ'},{h:'今天',p:'jīn tiān'},{h:'起',p:'qǐ'},{h:'得',p:'de'},{h:'太',p:'tài'},{h:'晚',p:'wǎn'},{h:'了',p:'le'},P('。')],cle:3,fr:'Tu t’es levée trop tard aujourd’hui.'},
    {seg:[{h:'他',p:'tā'},{h:'汉语',p:'Hàn yǔ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'好',p:'hǎo'},{h:'不',p:'bu'},{h:'好',p:'hǎo'},P('？')],cle:3,fr:'Parle-t-il bien chinois ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'跑',p:'pǎo'},{h:'得',p:'de'},{h:'没有',p:'méi yǒu'},{h:'他',p:'tā'},{h:'快',p:'kuài'},P('。')],cle:2,fr:'Je cours moins vite que lui.'},
    {seg:[{h:'她',p:'tā'},{h:'是',p:'shì'},{h:'一个',p:'yí ge'},{h:'唱',p:'chàng'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},{h:'的',p:'de'},{h:'歌手',p:'gē shǒu'},P('。')],cle:4,fr:'C’est une chanteuse qui chante très bien.'}
  ],
  leurres:['得','的','地','很','不','太'],

  gabarits:[
    {cadre:[{h:'他',p:'tā'},{s:'v'},{h:'得',p:'de'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'Il … très …',
     listes:{v:[{h:'跑',p:'pǎo',fr:'courir'},{h:'走',p:'zǒu',fr:'marcher'},
                {h:'来',p:'lái',fr:'venir'},{h:'吃',p:'chī',fr:'manger'},{h:'睡',p:'shuì',fr:'dormir'}],
             a:[{h:'快',p:'kuài',fr:'vite'},{h:'慢',p:'màn',fr:'lentement'},
                {h:'早',p:'zǎo',fr:'tôt'},{h:'晚',p:'wǎn',fr:'tard'},{h:'少',p:'shǎo',fr:'peu'}]}},
    {cadre:[{h:'我',p:'wǒ'},{s:'o'},{s:'v'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好',p:'hǎo'},P('。')],
     fr:'Je … mal …',
     listes:{o:[{h:'汉字',p:'Hàn zì',fr:'les caractères'},{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},
                {h:'歌',p:'gē',fr:'les chansons'}],
             v:[{h:'写',p:'xiě',fr:'écrire'},{h:'说',p:'shuō',fr:'parler'},{h:'唱',p:'chàng',fr:'chanter'}]}},
    {cadre:[{h:'你',p:'nǐ'},{s:'v'},{h:'得',p:'de'},{h:'怎么样',p:'zěn me yàng'},P('？')],
     fr:'Comment … -tu ?',
     listes:{v:[{h:'睡',p:'shuì',fr:'dormir'},{h:'吃',p:'chī',fr:'manger'},
                {h:'唱',p:'chàng',fr:'chanter'},{h:'写',p:'xiě',fr:'écrire'}]}}
  ],

  transfo:[
    {consigne:'Mettez à la forme négative',
     de:{hz:'他跑得很快。',py:'tā pǎo de hěn kuài',fr:'Il court vite.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'跑',p:'pǎo'},{h:'得',p:'de'},{h:'不',p:'bú'},{h:'快',p:'kuài'},P('。')],fr:'Il ne court pas vite.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'她唱得很好听。',py:'tā chàng de hěn hǎo tīng',fr:'Elle chante très bien.'},
     vers:{seg:[{h:'她',p:'tā'},{h:'唱',p:'chàng'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好听',p:'hǎo tīng'},P('。')],fr:'Elle ne chante pas bien.'}},
    {consigne:'Posez la question avec 怎么样',
     de:{hz:'我昨天睡得很好。',py:'wǒ zuó tiān shuì de hěn hǎo',fr:'J’ai bien dormi hier.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'昨天',p:'zuó tiān'},{h:'睡',p:'shuì'},{h:'得',p:'de'},{h:'怎么样',p:'zěn me yàng'},P('？')],fr:'Comment as-tu dormi hier ?'}},
    {consigne:'Ajoutez l’objet 汉语, en répétant le verbe',
     de:{hz:'他说得很好。',py:'tā shuō de hěn hǎo',fr:'Il parle très bien.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'说',p:'shuō'},{h:'汉语',p:'Hàn yǔ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('。')],fr:'Il parle très bien chinois.'}},
    {consigne:'Reprenez la même phrase en plaçant l’objet en tête',
     de:{hz:'他说汉语说得很好。',py:'tā shuō Hàn yǔ shuō de hěn hǎo',fr:'Il parle très bien chinois.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'汉语',p:'Hàn yǔ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('。')],fr:'Il parle très bien chinois.'}},
    {consigne:'Exprimez l’excès avec 太…了',
     de:{hz:'你说得很快。',py:'nǐ shuō de hěn kuài',fr:'Tu parles vite.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'太',p:'tài'},{h:'快',p:'kuài'},{h:'了',p:'le'},P('。')],fr:'Tu parles trop vite.'}}
  ],

  fixes:[
    {seg:[{h:'他',p:'tā'},{h:'跑',p:'pǎo'},{h:'很',p:'hěn'},{h:'快',p:'kuài'},P('。')],bad:2,
     bon:'他跑得很快。',why:'Sans 得, le jugement ne peut pas se raccrocher au verbe.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bù'},{h:'写',p:'xiě'},{h:'得',p:'de'},{h:'好',p:'hǎo'},P('。')],bad:1,
     bon:'我写得不好。',why:'不 se place après 得 : ce n’est pas l’action qu’on nie, c’est sa qualité.'},
    {seg:[{h:'他',p:'tā'},{h:'说',p:'shuō'},{h:'得',p:'de'},{h:'汉语',p:'Hàn yǔ'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('。')],bad:3,
     bon:'他汉语说得很好。',why:'Après 得 on n’attend qu’un jugement, jamais un objet.'},
    {seg:[{h:'我',p:'wǒ'},{h:'跑',p:'pǎo'},{h:'的',p:'de'},{h:'很',p:'hěn'},{h:'快',p:'kuài'},P('。')],bad:2,
     bon:'我跑得很快。',why:'的 relie à un nom ; après un verbe, c’est 得.'},
    {seg:[{h:'她',p:'tā'},{h:'唱',p:'chàng'},{h:'得',p:'de'},{h:'好',p:'hǎo'},P('。')],bad:3,
     bon:'她唱得很好。',why:'Comme pour tout adjectif attribut, il faut un adverbe : 很.'}
  ],

  reemploi:[
    {q:'Comment parlez-vous chinois, et comment écrivez-vous les caractères ? Répondez en deux phrases.',
     verif:[{type:'contient',v:'得',msg:'On attend le complément de degré, donc 得.'},
            {type:'absent',v:'得汉',msg:'L’objet ne peut pas suivre 得.'}],
     modeles:[{hz:'我汉语说得不太好。',py:'wǒ Hàn yǔ shuō de bú tài hǎo',fr:'Je ne parle pas très bien chinois.'},
              {hz:'我写汉字写得很慢。',py:'wǒ xiě Hàn zì xiě de hěn màn',fr:'J’écris les caractères très lentement.'}],
     criteres:['得 suit immédiatement le verbe','L’objet est en tête, ou le verbe est répété','Le jugement a un adverbe : 很, 太, 不']},
    {q:'Demandez à un ami comment il a dormi cette nuit, puis répondez à sa place.',
     verif:[{type:'contient',v:'得',msg:'La question sur la manière passe par 得.'},
            {type:'un_parmi',v:['怎么样','好不好'],msg:'On attend 怎么样 ou la forme alternative.'}],
     modeles:[{hz:'你昨天晚上睡得怎么样？',py:'nǐ zuó tiān wǎn shang shuì de zěn me yàng',fr:'Comment as-tu dormi hier soir ?'},
              {hz:'我睡得很好，谢谢。',py:'wǒ shuì de hěn hǎo, xiè xie',fr:'J’ai très bien dormi, merci.'}],
     criteres:['怎么样 vient juste après 得','La réponse garde 得 devant le jugement']},
    {q:'Dites une chose que vous faites bien et une chose que vous faites mal.',
     verif:[{type:'contient',v:'得',msg:'Le complément de degré exige 得.'},
            {type:'contient',v:'不',msg:'La seconde phrase doit être négative.'}],
     modeles:[{hz:'我跑得很快，可是我唱歌唱得不好。',py:'wǒ pǎo de hěn kuài, kě shì wǒ chàng gē chàng de bù hǎo',fr:'Je cours vite, mais je chante mal.'}],
     criteres:['不 est après 得, pas devant le verbe','Chaque verbe est suivi de 得']}
  ]
}

];

/* Publication explicite : les scripts sont classiques, une déclaration
   const ne rejoint pas window. */
window.GRAMMAR=GRAMMAR;
