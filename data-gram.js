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

   Gabarits — règle impérative : dès qu’un gabarit porte plus d’une
   liste, il doit déclarer un champ « lie » qui apparie les listes dont
   le choix n’est pas indépendant. lie:[['o','v']] tire le même index
   dans les deux listes, ligne à ligne ; sans lui, le tirage croisé
   engendre des phrases correctes mais absurdes. Les listes appariées
   ont donc la même longueur, et l’on répète un élément autant de fois
   qu’il entre dans des couples différents.

   Corollaire : un gabarit qui porte plus d’une liste déclare aussi
   « libre », qui nomme les listes dont le tirage reste indépendant.
   L’union de « lie » et de « libre » doit couvrir exactement toutes les
   listes du gabarit. La liberté d’une liste devient ainsi une décision
   écrite et vérifiée, jamais un oubli silencieux.
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
    {cadre:[{s:'s'},{s:'v'},{h:'什么',p:'shén me'},P('？')],
     fr:'Que … -tu ?', lie:[], libre:['s','v'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'老师',p:'lǎo shī',fr:'le professeur'}],v:[{h:'喝',p:'hē',fr:'boire'},{h:'吃',p:'chī',fr:'manger'},{h:'看',p:'kàn',fr:'regarder'},{h:'买',p:'mǎi',fr:'acheter'},{h:'学',p:'xué',fr:'apprendre'},{h:'写',p:'xiě',fr:'écrire'},{h:'做',p:'zuò',fr:'faire'},{h:'听',p:'tīng',fr:'écouter'},{h:'说',p:'shuō',fr:'dire'},{h:'找',p:'zhǎo',fr:'chercher'},{h:'带',p:'dài',fr:'apporter'},{h:'唱',p:'chàng',fr:'chanter'}]}},

    {cadre:[{s:'s'},{h:'是',p:'shì'},{h:'不',p:'bu'},{h:'是',p:'shì'},{s:'n'},P('？')],
     fr:'Es-tu … ?', lie:[], libre:['s','n'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'}],n:[{h:'老师',p:'lǎo shī',fr:'professeur'},{h:'学生',p:'xué sheng',fr:'étudiant'},{h:'医生',p:'yī shēng',fr:'médecin'},{h:'中国人',p:'Zhōng guó rén',fr:'chinois'},{h:'法国人',p:'Fǎ guó rén',fr:'français'},{h:'英国人',p:'Yīng guó rén',fr:'anglais'},{h:'日本人',p:'Rì běn rén',fr:'japonais'},{h:'大学生',p:'dà xué shēng',fr:'étudiant à l’université'},{h:'服务员',p:'fú wù yuán',fr:'serveur'},{h:'韩国人',p:'Hán guó rén',fr:'coréen'},{h:'经理',p:'jīng lǐ',fr:'directeur'},{h:'司机',p:'sī jī',fr:'chauffeur'}]}},

    {cadre:[{s:'s'},{h:'的',p:'de'},{s:'n'},{h:'呢',p:'ne'},P('？')],
     fr:'Et son / ton … ?', lie:[], libre:['s','n'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'你',p:'nǐ',fr:'tu'},{h:'老师',p:'lǎo shī',fr:'le professeur'}],n:[{h:'书',p:'shū',fr:'livre'},{h:'手机',p:'shǒu jī',fr:'téléphone'},{h:'照片',p:'zhào piàn',fr:'photo'},{h:'车',p:'chē',fr:'voiture'},{h:'电脑',p:'diàn nǎo',fr:'ordinateur'},{h:'钱',p:'qián',fr:'argent'},{h:'衣服',p:'yī fu',fr:'vêtements'},{h:'词典',p:'cí diǎn',fr:'dictionnaire'},{h:'作业',p:'zuò yè',fr:'devoirs'},{h:'咖啡',p:'kā fēi',fr:'café'},{h:'礼物',p:'lǐ wù',fr:'cadeau'},{h:'房间',p:'fáng jiān',fr:'chambre'}]}}
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
    {cadre:[{s:'p'},{h:'的',p:'de'},{s:'n'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'Mon / son … est …', lie:[['n','a']], libre:['p'],
     listes:{p:[{h:'我',p:'wǒ',fr:'mon'},{h:'他',p:'tā',fr:'son à lui'},{h:'她',p:'tā',fr:'son à elle'},{h:'你',p:'nǐ',fr:'ton'}],n:[{h:'老师',p:'lǎo shī',fr:'professeur'},{h:'房间',p:'fáng jiān',fr:'chambre'},{h:'朋友',p:'péng you',fr:'ami'},{h:'工作',p:'gōng zuò',fr:'travail'},{h:'手机',p:'shǒu jī',fr:'téléphone'},{h:'房间',p:'fáng jiān',fr:'chambre'},{h:'老师',p:'lǎo shī',fr:'professeur'},{h:'朋友',p:'péng you',fr:'ami'},{h:'工作',p:'gōng zuò',fr:'travail'},{h:'手机',p:'shǒu jī',fr:'téléphone'},{h:'朋友',p:'péng you',fr:'ami'},{h:'房间',p:'fáng jiān',fr:'chambre'}],a:[{h:'忙',p:'máng',fr:'occupé'},{h:'大',p:'dà',fr:'grand'},{h:'高',p:'gāo',fr:'grand de taille'},{h:'忙',p:'máng',fr:'prenant'},{h:'新',p:'xīn',fr:'neuf'},{h:'安静',p:'ān jìng',fr:'calme'},{h:'好',p:'hǎo',fr:'bien'},{h:'年轻',p:'nián qīng',fr:'jeune'},{h:'累',p:'lèi',fr:'fatigant'},{h:'贵',p:'guì',fr:'cher'},{h:'忙',p:'máng',fr:'occupé'},{h:'干净',p:'gān jìng',fr:'propre'}]}},

    {cadre:[{s:'d'},{s:'n'},{h:'太',p:'tài'},{s:'a'},{h:'了',p:'le'},P('。')],
     fr:'Ce / cette … est trop …', lie:[['n','a']], libre:['d'],
     listes:{d:[{h:'这个',p:'zhè ge',fr:'ce'},{h:'那个',p:'nà ge',fr:'ce … là'}],n:[{h:'菜',p:'cài',fr:'plat'},{h:'菜',p:'cài',fr:'plat'},{h:'房间',p:'fáng jiān',fr:'chambre'},{h:'房间',p:'fáng jiān',fr:'chambre'},{h:'城市',p:'chéng shì',fr:'ville'},{h:'城市',p:'chéng shì',fr:'ville'},{h:'手机',p:'shǒu jī',fr:'téléphone'},{h:'工作',p:'gōng zuò',fr:'travail'},{h:'问题',p:'wèn tí',fr:'problème'},{h:'地方',p:'dì fang',fr:'endroit'},{h:'东西',p:'dōng xi',fr:'objet'},{h:'字',p:'zì',fr:'caractère'}],a:[{h:'辣',p:'là',fr:'épicé'},{h:'贵',p:'guì',fr:'cher'},{h:'小',p:'xiǎo',fr:'petit'},{h:'吵',p:'chǎo',fr:'bruyant'},{h:'大',p:'dà',fr:'grand'},{h:'吵',p:'chǎo',fr:'bruyant'},{h:'贵',p:'guì',fr:'cher'},{h:'忙',p:'máng',fr:'prenant'},{h:'难',p:'nán',fr:'difficile'},{h:'远',p:'yuǎn',fr:'loin'},{h:'贵',p:'guì',fr:'cher'},{h:'难',p:'nán',fr:'difficile'}]}},

    {cadre:[{s:'s'},{s:'b'},{s:'a'},P('。')],
     fr:'… n’est pas …', lie:[['b','a']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],b:[{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bú',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bú',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bú',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bú',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'},{h:'不',p:'bù',fr:'ne … pas'}],a:[{h:'高',p:'gāo',fr:'grand'},{h:'忙',p:'máng',fr:'occupé'},{h:'胖',p:'pàng',fr:'gros'},{h:'年轻',p:'nián qīng',fr:'jeune'},{h:'累',p:'lèi',fr:'fatigué'},{h:'好',p:'hǎo',fr:'bien'},{h:'聪明',p:'cōng ming',fr:'intelligent'},{h:'认真',p:'rèn zhēn',fr:'sérieux'},{h:'安静',p:'ān jìng',fr:'calme'},{h:'快乐',p:'kuài lè',fr:'joyeux'},{h:'生气',p:'shēng qì',fr:'fâché'},{h:'舒服',p:'shū fu',fr:'à l’aise'}]}}
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
    {cadre:[{s:'s'},{h:'是',p:'shì'},{s:'q'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],
     fr:'C’est … que … est venu.', lie:[], libre:['s','q'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],q:[{h:'昨天',p:'zuó tiān',fr:'hier'},{h:'去年',p:'qù nián',fr:'l’an dernier'},{h:'上个月',p:'shàng ge yuè',fr:'le mois dernier'},{h:'今天早上',p:'jīn tiān zǎo shang',fr:'ce matin'},{h:'前天',p:'qián tiān',fr:'avant-hier'},{h:'上个星期',p:'shàng ge xīng qī',fr:'la semaine dernière'},{h:'二零二零年',p:'èr líng èr líng nián',fr:'en 2020'},{h:'昨天晚上',p:'zuó tiān wǎn shang',fr:'hier soir'},{h:'今天下午',p:'jīn tiān xià wǔ',fr:'cet après-midi'},{h:'去年九月',p:'qù nián jiǔ yuè',fr:'en septembre dernier'},{h:'星期一',p:'xīng qī yī',fr:'lundi'},{h:'今年',p:'jīn nián',fr:'cette année'}]}},

    {cadre:[{s:'s'},{h:'是',p:'shì'},{h:'坐',p:'zuò'},{s:'t'},{h:'来',p:'lái'},{h:'的',p:'de'},P('。')],
     fr:'… est venu en …', lie:[], libre:['s','t'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],t:[{h:'飞机',p:'fēi jī',fr:'avion'},{h:'火车',p:'huǒ chē',fr:'train'},{h:'地铁',p:'dì tiě',fr:'métro'},{h:'出租车',p:'chū zū chē',fr:'taxi'},{h:'公共汽车',p:'gōng gòng qì chē',fr:'bus'},{h:'船',p:'chuán',fr:'bateau'},{h:'汽车',p:'qì chē',fr:'voiture'}]}},

    {cadre:[{s:'s'},{h:'是',p:'shì'},{h:'在',p:'zài'},{s:'l'},{h:'工作',p:'gōng zuò'},{h:'的',p:'de'},P('。')],
     fr:'C’est à … que … travaillait.', lie:[], libre:['s','l'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],l:[{h:'北京',p:'Běi jīng',fr:'Pékin'},{h:'上海',p:'Shàng hǎi',fr:'Shanghai'},{h:'法国',p:'Fǎ guó',fr:'France'},{h:'中国',p:'Zhōng guó',fr:'Chine'},{h:'大学',p:'dà xué',fr:'l’université'},{h:'学校',p:'xué xiào',fr:'l’école'},{h:'医院',p:'yī yuàn',fr:'l’hôpital'},{h:'银行',p:'yín háng',fr:'la banque'},{h:'公司',p:'gōng sī',fr:'l’entreprise'},{h:'那个城市',p:'nà ge chéng shì',fr:'cette ville'},{h:'巴黎',p:'Bā lí',fr:'Paris'},{h:'家',p:'jiā',fr:'la maison'}]}}
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
    {cadre:[{s:'s'},{s:'v'},{h:'得',p:'de'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'… … très …', lie:[['v','a']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'跑',p:'pǎo',fr:'courir'},{h:'走',p:'zǒu',fr:'marcher'},{h:'来',p:'lái',fr:'arriver'},{h:'来',p:'lái',fr:'arriver'},{h:'吃',p:'chī',fr:'manger'},{h:'吃',p:'chī',fr:'manger'},{h:'睡',p:'shuì',fr:'dormir'},{h:'睡',p:'shuì',fr:'dormir'},{h:'说',p:'shuō',fr:'parler'},{h:'说',p:'shuō',fr:'parler'},{h:'写',p:'xiě',fr:'écrire'},{h:'走',p:'zǒu',fr:'marcher'}],a:[{h:'快',p:'kuài',fr:'vite'},{h:'慢',p:'màn',fr:'lentement'},{h:'早',p:'zǎo',fr:'tôt'},{h:'晚',p:'wǎn',fr:'tard'},{h:'少',p:'shǎo',fr:'peu'},{h:'快',p:'kuài',fr:'vite'},{h:'早',p:'zǎo',fr:'tôt'},{h:'晚',p:'wǎn',fr:'tard'},{h:'快',p:'kuài',fr:'vite'},{h:'慢',p:'màn',fr:'lentement'},{h:'慢',p:'màn',fr:'lentement'},{h:'快',p:'kuài',fr:'vite'}]}},

    {cadre:[{s:'s'},{s:'o'},{s:'v'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'好',p:'hǎo'},P('。')],
     fr:'… … mal …', lie:[['o','v']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],o:[{h:'汉字',p:'Hàn zì',fr:'les caractères'},{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},{h:'歌',p:'gē',fr:'les chansons'},{h:'中国菜',p:'Zhōng guó cài',fr:'la cuisine chinoise'},{h:'英语',p:'Yīng yǔ',fr:'l’anglais'},{h:'法语',p:'Fǎ yǔ',fr:'le français'},{h:'这个词',p:'zhè ge cí',fr:'ce mot'},{h:'这个字',p:'zhè ge zì',fr:'ce caractère'},{h:'这首歌',p:'zhè shǒu gē',fr:'cette chanson'},{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'饭',p:'fàn',fr:'la cuisine'},{h:'中文',p:'Zhōng wén',fr:'le chinois'}],v:[{h:'写',p:'xiě',fr:'écrire'},{h:'说',p:'shuō',fr:'parler'},{h:'唱',p:'chàng',fr:'chanter'},{h:'做',p:'zuò',fr:'préparer'},{h:'说',p:'shuō',fr:'parler'},{h:'说',p:'shuō',fr:'parler'},{h:'说',p:'shuō',fr:'prononcer'},{h:'写',p:'xiě',fr:'écrire'},{h:'唱',p:'chàng',fr:'chanter'},{h:'做',p:'zuò',fr:'faire'},{h:'做',p:'zuò',fr:'préparer'},{h:'说',p:'shuō',fr:'parler'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'得',p:'de'},{h:'怎么样',p:'zěn me yàng'},P('？')],
     fr:'Comment … -tu ?', lie:[], libre:['s','v'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'}],v:[{h:'睡',p:'shuì',fr:'dormir'},{h:'吃',p:'chī',fr:'manger'},{h:'唱',p:'chàng',fr:'chanter'},{h:'写',p:'xiě',fr:'écrire'},{h:'说',p:'shuō',fr:'parler'},{h:'跑',p:'pǎo',fr:'courir'},{h:'走',p:'zǒu',fr:'marcher'},{h:'做',p:'zuò',fr:'faire'},{h:'学',p:'xué',fr:'apprendre'},{h:'玩',p:'wán',fr:'s’amuser'},{h:'看',p:'kàn',fr:'lire'},{h:'考',p:'kǎo',fr:'passer l’examen'}]}}
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
},
/* ------------------------------------------------------------------ */
{
  id:'g303', hsk:3, fam:'verbe', th:['passe','quotidien'],
  title:'了 : l’action accomplie et le changement d’état',
  resume:'了 ne marque pas le passé, mais l’achèvement. Posé après le verbe, il clôt une action ; posé en fin de phrase, il annonce que la situation a changé.',

  steps:[
    {
      t:'了 après le verbe — l’action est menée à son terme',
      p:[
        'Placé juste après le verbe, <b>了</b> dit que l’action est allée jusqu’au bout. Il ne dit rien du moment : hier, tout à l’heure ou demain, cela ne le regarde pas.',
        'L’objet porte alors presque toujours une précision — un nombre avec son classificateur, ou un démonstratif — sans quoi la phrase reste en suspens et l’auditeur attend la suite.'
      ],
      ex:[
        {hz:'我买了一件衣服。',py:'wǒ mǎi le yí jiàn yī fu',fr:'J’ai acheté un vêtement.',
         note:'一件 précise l’objet. Sans lui, la phrase paraît inachevée.'},
        {hz:'他喝了三杯茶。',py:'tā hē le sān bēi chá',fr:'Il a bu trois tasses de thé.'}
      ],
      check:{q:'Laquelle des deux est complète ?',a:['我买了衣服。','我买了一件衣服。'],ok:1,
             why:'Après 了, l’objet demande une précision : un nombre et son classificateur, ou un démonstratif.'}
    },
    {
      t:'La négation — 没有, et 了 disparaît',
      p:[
        'On ne nie pas un accompli avec 不. On emploie <b>没</b> ou <b>没有</b>, et <b>了 tombe</b>.',
        '不 sert à nier une habitude, une volonté, un refus. 没 sert à dire que l’action n’a pas eu lieu. Les deux ne sont pas interchangeables.'
      ],
      ex:[
        {hz:'我没买衣服。',py:'wǒ méi mǎi yī fu',fr:'Je n’ai pas acheté de vêtement.',
         note:'没 prend la place de 了 : les deux ne cohabitent jamais.'},
        {hz:'我不买衣服。',py:'wǒ bù mǎi yī fu',fr:'Je n’achète pas de vêtements.',
         note:'Avec 不, ce n’est plus un fait constaté mais une habitude ou un refus.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我没买了衣服。','我没买衣服。'],ok:1,
             why:'没 et 了 s’excluent : dès que 没 nie l’action, 了 disparaît.'}
    },
    {
      t:'了 en fin de phrase — quelque chose a changé',
      p:[
        'À la toute fin, <b>了</b> ne clôt aucune action : il signale un <b>état nouveau</b>, différent de celui d’avant.',
        'Avec un adjectif ou un groupe nominal, c’est même son seul emploi possible : la phrase dit que la situation a basculé.'
      ],
      ex:[
        {hz:'天气冷了。',py:'tiān qì lěng le',fr:'Il fait froid, maintenant.',
         note:'Sous-entendu : il ne faisait pas froid avant.'},
        {hz:'我知道了。',py:'wǒ zhī dào le',fr:'Ça y est, j’ai compris.'},
        {hz:'他二十岁了。',py:'tā èr shí suì le',fr:'Il a vingt ans, désormais.'}
      ],
      check:{q:'天气冷了 veut dire :',a:['Il faisait froid.','Il s’est mis à faire froid.'],ok:1,
             why:'了 en fin de phrase marque le basculement : la situation n’est plus celle d’avant.'}
    },
    {
      t:'Les deux 了 dans la même phrase',
      p:[
        'Les deux emplois se cumulent très bien. Le premier ferme l’action, le second dit que la situation ainsi créée <b>dure encore</b>.',
        'C’est la façon habituelle de rendre notre « depuis » : 我学了两年了 — j’étudie depuis deux ans, et je continue.'
      ],
      ex:[
        {hz:'我学了两年汉语了。',py:'wǒ xué le liǎng nián Hàn yǔ le',fr:'J’apprends le chinois depuis deux ans.',
         note:'Le second 了 dit que cela continue aujourd’hui.'},
        {hz:'我学了两年汉语。',py:'wǒ xué le liǎng nián Hàn yǔ',fr:'J’ai étudié le chinois pendant deux ans.',
         note:'Un seul 了 : la période est close, je n’étudie plus.'}
      ],
      check:{q:'Vous apprenez le chinois depuis deux ans et vous continuez :',
             a:['我学了两年汉语。','我学了两年汉语了。'],ok:1,
             why:'Seul le second 了 dit que la situation dure encore.'}
    },
    {
      t:'Le piège — 了 n’est pas le passé',
      p:[
        'Le réflexe francophone consiste à traduire tout passé composé par 了. C’est faux une fois sur deux.',
        'Une habitude passée, un état, une description ne prennent <b>pas</b> 了 : rien n’y est achevé, rien n’y a changé.',
        'À l’inverse, 了 s’emploie très bien au futur, dès qu’une action doit être achevée avant qu’une autre commence.'
      ],
      ex:[
        {hz:'我以前每天喝咖啡。',py:'wǒ yǐ qián měi tiān hē kā fēi',fr:'Avant, je buvais du café tous les jours.',
         note:'Habitude passée : aucun 了. C’est 以前 qui situe la scène.'},
        {hz:'明天我吃了饭就去。',py:'míng tiān wǒ chī le fàn jiù qù',fr:'Demain, j’irai dès que j’aurai mangé.',
         note:'了 dans une phrase au futur : il marque l’achèvement, pas le passé.'}
      ],
      check:{q:'« Avant, j’habitais à Pékin » se dit :',
             a:['我以前住在北京了。','我以前住在北京。'],ok:1,
             why:'C’est une situation qui durait, non une action achevée : pas de 了.'}
    }
  ],

  tableau:{
    cols:['Emploi','Exemple','Ce que cela dit'],
    rows:[
      ['了 après le verbe','我买了一件衣服','L’action est menée à son terme'],
      ['Négation','我没买衣服','L’action n’a pas eu lieu, 了 tombe'],
      ['了 en fin de phrase','天气冷了','La situation a changé'],
      ['Les deux 了','我学了两年汉语了','L’action dure encore aujourd’hui'],
      ['Habitude passée','我以前每天喝咖啡','Aucun 了 : rien n’est achevé'],
      ['了 au futur','明天我吃了饭就去','Achèvement à venir, non passé']
    ]
  },

  piege:{
    bad:{hz:'我以前住在北京了。',py:'wǒ yǐ qián zhù zài Běi jīng le'},
    good:{hz:'我以前住在北京。',py:'wǒ yǐ qián zhù zài Běi jīng'},
    why:'了 n’est pas la marque du passé français. Une situation qui durait ne s’achève pas et ne bascule pas : elle ne prend pas 了. C’est 以前 qui situe la scène dans le passé.'
  },

  voir:['g304','g301'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'买',p:'mǎi'},{h:'了',p:'le'},{h:'一件',p:'yí jiàn'},{h:'衣服',p:'yī fu'},P('。')],cle:2,fr:'J’ai acheté un vêtement.'},
    {seg:[{h:'他',p:'tā'},{h:'喝',p:'hē'},{h:'了',p:'le'},{h:'三杯',p:'sān bēi'},{h:'茶',p:'chá'},P('。')],cle:2,fr:'Il a bu trois tasses de thé.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'买',p:'mǎi'},{h:'衣服',p:'yī fu'},P('。')],cle:1,fr:'Je n’ai pas acheté de vêtement.'},
    {seg:[{h:'天气',p:'tiān qì'},{h:'冷',p:'lěng'},{h:'了',p:'le'},P('。')],cle:2,fr:'Il fait froid, maintenant.'},
    {seg:[{h:'我',p:'wǒ'},{h:'知道',p:'zhī dào'},{h:'了',p:'le'},P('。')],cle:2,fr:'Ça y est, j’ai compris.'},
    {seg:[{h:'他',p:'tā'},{h:'二十',p:'èr shí'},{h:'岁',p:'suì'},{h:'了',p:'le'},P('。')],cle:3,fr:'Il a vingt ans, désormais.'},
    {seg:[{h:'我',p:'wǒ'},{h:'学',p:'xué'},{h:'了',p:'le'},{h:'两年',p:'liǎng nián'},{h:'汉语',p:'Hàn yǔ'},{h:'了',p:'le'},P('。')],cle:5,fr:'J’apprends le chinois depuis deux ans.'},
    {seg:[{h:'下',p:'xià'},{h:'雨',p:'yǔ'},{h:'了',p:'le'},P('。')],cle:2,fr:'Il s’est mis à pleuvoir.'},
    {seg:[{h:'我',p:'wǒ'},{h:'吃',p:'chī'},{h:'了',p:'le'},{h:'饭',p:'fàn'},{h:'再',p:'zài'},{h:'去',p:'qù'},P('。')],cle:2,fr:'J’irai après avoir mangé.'},
    {seg:[{h:'你',p:'nǐ'},{h:'吃',p:'chī'},{h:'了',p:'le'},{h:'吗',p:'ma'},P('？')],cle:2,fr:'As-tu mangé ?'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'来',p:'lái'},P('。')],cle:1,fr:'Il n’est pas venu.'},
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'了',p:'le'},{h:'两本',p:'liǎng běn'},{h:'书',p:'shū'},P('。')],cle:2,fr:'J’ai lu deux livres.'},
    {seg:[{h:'现在',p:'xiàn zài'},{h:'几',p:'jǐ'},{h:'点',p:'diǎn'},{h:'了',p:'le'},P('？')],cle:3,fr:'Quelle heure est-il, maintenant ?'},
    {seg:[{h:'她',p:'tā'},{h:'去',p:'qù'},{h:'了',p:'le'},{h:'上海',p:'Shàng hǎi'},P('。')],cle:2,fr:'Elle est partie à Shanghai.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没有',p:'méi yǒu'},{h:'看',p:'kàn'},{h:'那个',p:'nà ge'},{h:'电影',p:'diàn yǐng'},P('。')],cle:1,fr:'Je n’ai pas vu ce film.'}
  ],
  leurres:['了','没','过','在','不','得','很'],

  gabarits:[
    {cadre:[{s:'s'},{s:'v'},{h:'了',p:'le'},{s:'o'},P('。')],
     fr:'… a …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'买',p:'mǎi',fr:'acheter'},{h:'喝',p:'hē',fr:'boire'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'学',p:'xué',fr:'apprendre'},{h:'买',p:'mǎi',fr:'acheter'},{h:'喝',p:'hē',fr:'boire'},{h:'看',p:'kàn',fr:'voir'},{h:'吃',p:'chī',fr:'manger'},{h:'学',p:'xué',fr:'apprendre'},{h:'买',p:'mǎi',fr:'acheter'},{h:'写',p:'xiě',fr:'écrire'}],o:[{h:'一件衣服',p:'yí jiàn yī fu',fr:'un vêtement'},{h:'三杯茶',p:'sān bēi chá',fr:'trois thés'},{h:'两本书',p:'liǎng běn shū',fr:'deux livres'},{h:'一个面包',p:'yí ge miàn bāo',fr:'un pain'},{h:'两年汉语',p:'liǎng nián Hàn yǔ',fr:'deux ans de chinois'},{h:'一个手机',p:'yí ge shǒu jī',fr:'un téléphone'},{h:'一杯咖啡',p:'yì bēi kā fēi',fr:'un café'},{h:'那个电影',p:'nà ge diàn yǐng',fr:'ce film'},{h:'一些水果',p:'yì xiē shuǐ guǒ',fr:'des fruits'},{h:'三年英语',p:'sān nián Yīng yǔ',fr:'trois ans d’anglais'},{h:'两本书',p:'liǎng běn shū',fr:'deux livres'},{h:'一些汉字',p:'yì xiē Hàn zì',fr:'des caractères'}]}},

    {cadre:[{s:'n'},{s:'a'},{h:'了',p:'le'},P('。')],
     fr:'… est devenu …', lie:[['n','a']],
     listes:{n:[{h:'天气',p:'tiān qì',fr:'le temps'},{h:'天气',p:'tiān qì',fr:'le temps'},{h:'他',p:'tā',fr:'il'},{h:'我',p:'wǒ',fr:'je'},{h:'孩子',p:'hái zi',fr:'l’enfant'},{h:'菜',p:'cài',fr:'le plat'},{h:'天',p:'tiān',fr:'le ciel'},{h:'他',p:'tā',fr:'il'},{h:'我',p:'wǒ',fr:'je'},{h:'房间',p:'fáng jiān',fr:'la chambre'},{h:'咖啡',p:'kā fēi',fr:'le café'},{h:'她',p:'tā',fr:'elle'}],a:[{h:'冷',p:'lěng',fr:'froid'},{h:'热',p:'rè',fr:'chaud'},{h:'高',p:'gāo',fr:'grand'},{h:'累',p:'lèi',fr:'fatigué'},{h:'大',p:'dà',fr:'grand'},{h:'凉',p:'liáng',fr:'tiède'},{h:'黑',p:'hēi',fr:'sombre'},{h:'胖',p:'pàng',fr:'gros'},{h:'忙',p:'máng',fr:'occupé'},{h:'干净',p:'gān jìng',fr:'propre'},{h:'凉',p:'liáng',fr:'froid'},{h:'累',p:'lèi',fr:'fatiguée'}]}},

    {cadre:[{s:'s'},{h:'没',p:'méi'},{s:'v'},{s:'o'},P('。')],
     fr:'… n’a pas …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'买',p:'mǎi',fr:'acheter'},{h:'看',p:'kàn',fr:'voir'},{h:'吃',p:'chī',fr:'manger'},{h:'喝',p:'hē',fr:'boire'},{h:'买',p:'mǎi',fr:'acheter'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'喝',p:'hē',fr:'boire'},{h:'做',p:'zuò',fr:'faire'},{h:'学',p:'xué',fr:'apprendre'},{h:'写',p:'xiě',fr:'écrire'},{h:'听',p:'tīng',fr:'écouter'}],o:[{h:'衣服',p:'yī fu',fr:'de vêtements'},{h:'那个电影',p:'nà ge diàn yǐng',fr:'ce film'},{h:'早饭',p:'zǎo fàn',fr:'de petit-déjeuner'},{h:'咖啡',p:'kā fēi',fr:'de café'},{h:'手机',p:'shǒu jī',fr:'de téléphone'},{h:'那本书',p:'nà běn shū',fr:'ce livre'},{h:'晚饭',p:'wǎn fàn',fr:'de dîner'},{h:'茶',p:'chá',fr:'de thé'},{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},{h:'汉字',p:'Hàn zì',fr:'de caractères'},{h:'音乐',p:'yīn yuè',fr:'de musique'}]}}
  ],

  transfo:[
    {consigne:'Mettez à la forme négative',
     de:{hz:'我买了一件衣服。',py:'wǒ mǎi le yí jiàn yī fu',fr:'J’ai acheté un vêtement.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'买',p:'mǎi'},{h:'衣服',p:'yī fu'},P('。')],fr:'Je n’ai pas acheté de vêtement.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'他来了。',py:'tā lái le',fr:'Il est venu.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'来',p:'lái'},P('。')],fr:'Il n’est pas venu.'}},
    {consigne:'Dites que la situation dure encore, avec le second 了',
     de:{hz:'我学了两年汉语。',py:'wǒ xué le liǎng nián Hàn yǔ',fr:'J’ai étudié le chinois pendant deux ans.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'学',p:'xué'},{h:'了',p:'le'},{h:'两年',p:'liǎng nián'},{h:'汉语',p:'Hàn yǔ'},{h:'了',p:'le'},P('。')],fr:'J’apprends le chinois depuis deux ans.'}},
    {consigne:'Posez la question avec 吗',
     de:{hz:'我吃了。',py:'wǒ chī le',fr:'J’ai mangé.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'吃',p:'chī'},{h:'了',p:'le'},{h:'吗',p:'ma'},P('？')],fr:'As-tu mangé ?'}},
    {consigne:'Dites que la situation a changé, avec 了 en fin de phrase',
     de:{hz:'天气很冷。',py:'tiān qì hěn lěng',fr:'Il fait froid.'},
     vers:{seg:[{h:'天气',p:'tiān qì'},{h:'冷',p:'lěng'},{h:'了',p:'le'},P('。')],fr:'Il s’est mis à faire froid.'}},
    {consigne:'Faites-en une habitude passée avec 以前, sans 了',
     de:{hz:'我每天喝咖啡。',py:'wǒ měi tiān hē kā fēi',fr:'Je bois du café tous les jours.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'以前',p:'yǐ qián'},{h:'每天',p:'měi tiān'},{h:'喝',p:'hē'},{h:'咖啡',p:'kā fēi'},P('。')],fr:'Avant, je buvais du café tous les jours.'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'买',p:'mǎi'},{h:'了',p:'le'},{h:'衣服',p:'yī fu'},P('。')],bad:3,
     bon:'我没买衣服。',why:'没 et 了 ne cohabitent pas : dès que 没 nie l’action, 了 disparaît.'},
    {seg:[{h:'我',p:'wǒ'},{h:'昨天',p:'zuó tiān'},{h:'不',p:'bú'},{h:'去',p:'qù'},P('。')],bad:2,
     bon:'我昨天没去。',why:'Pour dire qu’une action n’a pas eu lieu, on emploie 没, non 不.'},
    {seg:[{h:'我',p:'wǒ'},{h:'以前',p:'yǐ qián'},{h:'住',p:'zhù'},{h:'在',p:'zài'},{h:'北京',p:'Běi jīng'},{h:'了',p:'le'},P('。')],bad:5,
     bon:'我以前住在北京。',why:'Une situation qui durait n’est ni achevée ni nouvelle : elle ne prend pas 了.'},
    {seg:[{h:'我',p:'wǒ'},{h:'了',p:'le'},{h:'买',p:'mǎi'},{h:'一件',p:'yí jiàn'},{h:'衣服',p:'yī fu'},P('。')],bad:1,
     bon:'我买了一件衣服。',why:'了 suit le verbe, il ne le précède jamais.'},
    {seg:[{h:'我',p:'wǒ'},{h:'买',p:'mǎi'},{h:'了',p:'le'},{h:'衣服',p:'yī fu'},P('。')],bad:3,
     bon:'我买了一件衣服。',why:'Après 了, l’objet demande une précision : un nombre et son classificateur, ou un démonstratif.'},
    {seg:[{h:'我',p:'wǒ'},{h:'学',p:'xué'},{h:'了',p:'le'},{h:'两年',p:'liǎng nián'},{h:'了',p:'le'},{h:'汉语',p:'Hàn yǔ'},P('。')],bad:4,
     bon:'我学了两年汉语了。',why:'Le second 了 se pose à la toute fin, après l’objet.'}
  ],

  reemploi:[
    {q:'Racontez un achat récent, en une phrase, avec un objet précisé.',
     verif:[{type:'contient',v:'了',msg:'On attend 了 après le verbe pour marquer l’achèvement.'},
            {type:'absent',v:'没',msg:'La phrase est affirmative : 没 n’y a pas sa place.'}],
     modeles:[{hz:'我买了一件新衣服。',py:'wǒ mǎi le yí jiàn xīn yī fu',fr:'J’ai acheté un vêtement neuf.'},
              {hz:'昨天我买了两本书。',py:'zuó tiān wǒ mǎi le liǎng běn shū',fr:'Hier, j’ai acheté deux livres.'}],
     criteres:['了 suit immédiatement le verbe','L’objet porte un nombre et son classificateur, ou un démonstratif','La date, si elle est là, se place avant le verbe']},
    {q:'Dites depuis combien de temps vous apprenez le chinois, en marquant que vous continuez.',
     verif:[{type:'contient',v:'了',msg:'La durée qui continue demande 了.'},
            {type:'finit',v:'了',msg:'Le second 了 ferme la phrase : c’est lui qui dit que cela dure encore.'}],
     modeles:[{hz:'我学了两年汉语了。',py:'wǒ xué le liǎng nián Hàn yǔ le',fr:'J’apprends le chinois depuis deux ans.'},
              {hz:'我学汉语学了三年了。',py:'wǒ xué Hàn yǔ xué le sān nián le',fr:'J’apprends le chinois depuis trois ans.'}],
     criteres:['Deux 了 : un après le verbe, un en fin de phrase','La durée est placée après le verbe','Le second 了 est le dernier mot avant la ponctuation']},
    {q:'Répondez à 你昨天做什么了？ en disant une chose que vous avez faite et une chose que vous n’avez pas faite.',
     verif:[{type:'contient',v:'了',msg:'La phrase affirmative attend 了 après le verbe.'},
            {type:'contient',v:'没',msg:'La phrase négative attend 没.'}],
     modeles:[{hz:'我看了一个电影，没做饭。',py:'wǒ kàn le yí ge diàn yǐng, méi zuò fàn',fr:'J’ai vu un film et je n’ai pas fait la cuisine.'},
              {hz:'昨天我喝了两杯咖啡，没吃早饭。',py:'zuó tiān wǒ hē le liǎng bēi kā fēi, méi chī zǎo fàn',fr:'Hier, j’ai bu deux cafés et je n’ai pas pris de petit-déjeuner.'}],
     criteres:['了 est présent dans la phrase affirmative','La négation emploie 没, et 了 y disparaît','L’objet de la phrase affirmative est précisé']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g304', hsk:3, fam:'verbe', th:['voyage','passe'],
  title:'过 : l’expérience déjà vécue',
  resume:'过 ne raconte aucun événement : il verse une action au compte de l’expérience. On l’a déjà faite au moins une fois dans sa vie, et on en est revenu.',

  steps:[
    {
      t:'过 après le verbe — « j’ai déjà… »',
      p:[
        'Posé juste après le verbe, <b>过</b> dit que l’action figure au moins une fois dans l’expérience de la personne. Le moment n’a aucune importance et n’est presque jamais donné.',
        'C’est notre « déjà » : 你吃过北京烤鸭吗？ — as-tu déjà mangé du canard laqué ?'
      ],
      ex:[
        {hz:'我去过中国。',py:'wǒ qù guo Zhōng guó',fr:'Je suis déjà allée en Chine.',
         note:'Après le verbe, 过 se prononce au ton neutre : guo.'},
        {hz:'你吃过北京烤鸭吗？',py:'nǐ chī guo Běi jīng kǎo yā ma',fr:'As-tu déjà mangé du canard laqué ?'}
      ],
      check:{q:'我去过中国 signifie :',a:['Je pars pour la Chine.','Je suis déjà allée en Chine.'],ok:1,
             why:'过 verse l’action au compte de l’expérience vécue.'}
    },
    {
      t:'La négation — 没…过, et 过 reste',
      p:[
        'La négation se fait avec <b>没</b> ou <b>没有</b>, comme pour 了. Mais ici, <b>过 ne disparaît pas</b>.',
        'C’est l’écart le plus facile à retenir entre les deux particules : 没买了 est faux, 没买过 est juste.'
      ],
      ex:[
        {hz:'我没去过中国。',py:'wǒ méi qù guo Zhōng guó',fr:'Je ne suis jamais allée en Chine.'},
        {hz:'他没看过这个电影。',py:'tā méi kàn guo zhè ge diàn yǐng',fr:'Il n’a jamais vu ce film.'}
      ],
      check:{q:'« Je ne suis jamais allée en Chine » se dit :',
             a:['我没去中国。','我没去过中国。'],ok:1,
             why:'C’est l’expérience de toute une vie qui est niée : 过 reste après le verbe.'}
    },
    {
      t:'Compter les fois',
      p:[
        'Le nombre de fois se place <b>après 过</b>, avec le classificateur <b>次</b>.',
        'Si le verbe a un objet, le compte se glisse entre 过 et cet objet : 去过三次北京.',
        'Autre tournure très courante : mettre l’objet en tête et laisser le compte fermer la phrase.'
      ],
      ex:[
        {hz:'我去过三次北京。',py:'wǒ qù guo sān cì Běi jīng',fr:'Je suis allée trois fois à Pékin.'},
        {hz:'这个电影我看过两次。',py:'zhè ge diàn yǐng wǒ kàn guo liǎng cì',fr:'Ce film, je l’ai vu deux fois.',
         note:'L’objet est en tête, le compte ferme la phrase.'}
      ],
      check:{q:'Où se place 三次 ?',a:['我三次去过北京。','我去过三次北京。'],ok:1,
             why:'Le compte suit 过 et précède l’objet.'}
    },
    {
      t:'了 face à 过',
      p:[
        '<b>了</b> clôt une action précise et laisse souvent la situation en place : 我去了北京 — je suis partie à Pékin, j’y suis peut-être encore.',
        '<b>过</b> verse l’action à l’expérience et suppose qu’on en est revenu : 我去过北京 — j’y suis allée, c’est du passé révolu.',
        'Second écart, tout aussi net : à la négative, 了 disparaît, 过 reste.'
      ],
      ex:[
        {hz:'我去了北京。',py:'wǒ qù le Běi jīng',fr:'Je suis partie à Pékin.',
         note:'Un fait daté. Je peux encore y être.'},
        {hz:'我去过北京。',py:'wǒ qù guo Běi jīng',fr:'Je suis déjà allée à Pékin.',
         note:'Une expérience close. J’en suis revenue.'}
      ],
      check:{q:'Votre amie demande si vous connaissez Shanghai. Vous répondez :',
             a:['我去了上海。','我去过上海。'],ok:1,
             why:'La question porte sur l’expérience, non sur un départ précis : 过.'}
    }
  ],

  tableau:{
    cols:['Emploi','Exemple','Ce que cela dit'],
    rows:[
      ['Expérience vécue','我去过中国','J’y suis déjà allée'],
      ['Négation','我没去过中国','Je n’y suis jamais allée, 过 reste'],
      ['Compte de fois','我去过三次北京','Trois fois dans ma vie'],
      ['Objet en tête','这个电影我看过两次','Ce film, je l’ai vu deux fois'],
      ['Question','你吃过烤鸭吗？','En as-tu déjà mangé ?'],
      ['Face à 了','我去了北京','Un départ précis, j’y suis peut-être encore']
    ]
  },

  piege:{
    bad:{hz:'我没去过了中国。',py:'wǒ méi qù guo le Zhōng guó'},
    good:{hz:'我没去过中国。',py:'wǒ méi qù guo Zhōng guó'},
    why:'过 et 了 ne se superposent jamais. À la négative, 了 disparaît de toute façon ; 过, lui, demeure — c’est précisément lui qui porte l’idée d’expérience.'
  },

  voir:['g303'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'中国',p:'Zhōng guó'},P('。')],cle:2,fr:'Je suis déjà allée en Chine.'},
    {seg:[{h:'你',p:'nǐ'},{h:'吃',p:'chī'},{h:'过',p:'guo'},{h:'北京',p:'Běi jīng'},{h:'烤鸭',p:'kǎo yā'},{h:'吗',p:'ma'},P('？')],cle:2,fr:'As-tu déjà mangé du canard laqué ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'中国',p:'Zhōng guó'},P('。')],cle:3,fr:'Je ne suis jamais allée en Chine.'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'看',p:'kàn'},{h:'过',p:'guo'},{h:'这个',p:'zhè ge'},{h:'电影',p:'diàn yǐng'},P('。')],cle:3,fr:'Il n’a jamais vu ce film.'},
    {seg:[{h:'我',p:'wǒ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'三次',p:'sān cì'},{h:'北京',p:'Běi jīng'},P('。')],cle:2,fr:'Je suis allée trois fois à Pékin.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'电影',p:'diàn yǐng'},{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'过',p:'guo'},{h:'两次',p:'liǎng cì'},P('。')],cle:4,fr:'Ce film, je l’ai vu deux fois.'},
    {seg:[{h:'我',p:'wǒ'},{h:'去',p:'qù'},{h:'了',p:'le'},{h:'北京',p:'Běi jīng'},P('。')],cle:2,fr:'Je suis partie à Pékin.'},
    {seg:[{h:'我',p:'wǒ'},{h:'学',p:'xué'},{h:'过',p:'guo'},{h:'一年',p:'yì nián'},{h:'日语',p:'Rì yǔ'},P('。')],cle:2,fr:'J’ai étudié le japonais pendant un an.'},
    {seg:[{h:'你',p:'nǐ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'几次',p:'jǐ cì'},{h:'上海',p:'Shàng hǎi'},P('？')],cle:2,fr:'Combien de fois es-tu allé à Shanghai ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'喝',p:'hē'},{h:'过',p:'guo'},{h:'中国',p:'Zhōng guó'},{h:'茶',p:'chá'},P('。')],cle:3,fr:'Je n’ai jamais bu de thé chinois.'},
    {seg:[{h:'他',p:'tā'},{h:'来',p:'lái'},{h:'过',p:'guo'},{h:'我',p:'wǒ'},{h:'家',p:'jiā'},P('。')],cle:2,fr:'Il est déjà venu chez moi.'},
    {seg:[{h:'我',p:'wǒ'},{h:'吃',p:'chī'},{h:'过',p:'guo'},{h:'一次',p:'yí cì'},{h:'日本菜',p:'Rì běn cài'},P('。')],cle:2,fr:'J’ai mangé japonais une fois.'},
    {seg:[{h:'你',p:'nǐ'},{h:'看',p:'kàn'},{h:'过',p:'guo'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'吗',p:'ma'},P('？')],cle:2,fr:'As-tu déjà lu ce livre ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'坐',p:'zuò'},{h:'过',p:'guo'},{h:'飞机',p:'fēi jī'},P('。')],cle:3,fr:'Je n’ai jamais pris l’avion.'}
  ],
  leurres:['过','了','没','在','次','不','得'],

  gabarits:[
    {cadre:[{s:'s'},{s:'v'},{h:'过',p:'guo'},{s:'o'},P('。')],
     fr:'… a déjà …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'去',p:'qù',fr:'aller'},{h:'吃',p:'chī',fr:'manger'},{h:'看',p:'kàn',fr:'voir'},{h:'喝',p:'hē',fr:'boire'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'}],o:[{h:'中国',p:'Zhōng guó',fr:'en Chine'},{h:'北京烤鸭',p:'Běi jīng kǎo yā',fr:'du canard laqué'},{h:'这个电影',p:'zhè ge diàn yǐng',fr:'ce film'},{h:'中国茶',p:'Zhōng guó chá',fr:'du thé chinois'},{h:'日语',p:'Rì yǔ',fr:'le japonais'},{h:'上海',p:'Shàng hǎi',fr:'à Shanghai'},{h:'飞机',p:'fēi jī',fr:'l’avion'},{h:'那本书',p:'nà běn shū',fr:'ce livre'},{h:'中国菜',p:'Zhōng guó cài',fr:'de la cuisine chinoise'},{h:'法语',p:'Fǎ yǔ',fr:'le français'},{h:'法国',p:'Fǎ guó',fr:'en France'},{h:'火车',p:'huǒ chē',fr:'le train'}]}},

    {cadre:[{s:'s'},{h:'没',p:'méi'},{s:'v'},{h:'过',p:'guo'},{s:'o'},P('。')],
     fr:'… n’a jamais …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'去',p:'qù',fr:'aller'},{h:'吃',p:'chī',fr:'manger'},{h:'看',p:'kàn',fr:'voir'},{h:'喝',p:'hē',fr:'boire'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'}],o:[{h:'中国',p:'Zhōng guó',fr:'en Chine'},{h:'北京烤鸭',p:'Běi jīng kǎo yā',fr:'du canard laqué'},{h:'这个电影',p:'zhè ge diàn yǐng',fr:'ce film'},{h:'中国茶',p:'Zhōng guó chá',fr:'du thé chinois'},{h:'日语',p:'Rì yǔ',fr:'le japonais'},{h:'上海',p:'Shàng hǎi',fr:'à Shanghai'},{h:'飞机',p:'fēi jī',fr:'l’avion'},{h:'那本书',p:'nà běn shū',fr:'ce livre'},{h:'中国菜',p:'Zhōng guó cài',fr:'de la cuisine chinoise'},{h:'法语',p:'Fǎ yǔ',fr:'le français'},{h:'法国',p:'Fǎ guó',fr:'en France'},{h:'火车',p:'huǒ chē',fr:'le train'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'过',p:'guo'},{s:'o'},{h:'吗',p:'ma'},P('？')],
     fr:'As-tu déjà … ?', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'}],v:[{h:'去',p:'qù',fr:'aller'},{h:'吃',p:'chī',fr:'manger'},{h:'看',p:'kàn',fr:'voir'},{h:'喝',p:'hē',fr:'boire'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'学',p:'xué',fr:'apprendre'},{h:'去',p:'qù',fr:'aller'},{h:'坐',p:'zuò',fr:'prendre'}],o:[{h:'中国',p:'Zhōng guó',fr:'en Chine'},{h:'北京烤鸭',p:'Běi jīng kǎo yā',fr:'du canard laqué'},{h:'这个电影',p:'zhè ge diàn yǐng',fr:'ce film'},{h:'中国茶',p:'Zhōng guó chá',fr:'du thé chinois'},{h:'日语',p:'Rì yǔ',fr:'le japonais'},{h:'上海',p:'Shàng hǎi',fr:'à Shanghai'},{h:'飞机',p:'fēi jī',fr:'l’avion'},{h:'那本书',p:'nà běn shū',fr:'ce livre'},{h:'中国菜',p:'Zhōng guó cài',fr:'de la cuisine chinoise'},{h:'法语',p:'Fǎ yǔ',fr:'le français'},{h:'法国',p:'Fǎ guó',fr:'en France'},{h:'火车',p:'huǒ chē',fr:'le train'}]}},

    {cadre:[{s:'s'},{h:'去',p:'qù'},{h:'过',p:'guo'},{s:'n'},{h:'次',p:'cì'},{s:'l'},P('。')],
     fr:'… est allé … fois à …', lie:[], libre:['s','n','l'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],n:[{h:'一',p:'yí',fr:'une'},{h:'两',p:'liǎng',fr:'deux'},{h:'三',p:'sān',fr:'trois'},{h:'四',p:'sì',fr:'quatre'},{h:'五',p:'wǔ',fr:'cinq'},{h:'很多',p:'hěn duō',fr:'beaucoup de'}],l:[{h:'北京',p:'Běi jīng',fr:'Pékin'},{h:'上海',p:'Shàng hǎi',fr:'Shanghai'},{h:'中国',p:'Zhōng guó',fr:'Chine'},{h:'法国',p:'Fǎ guó',fr:'France'},{h:'那个城市',p:'nà ge chéng shì',fr:'cette ville'},{h:'那个地方',p:'nà ge dì fang',fr:'cet endroit'}]}}
  ],

  transfo:[
    {consigne:'Mettez à la forme négative',
     de:{hz:'我去过中国。',py:'wǒ qù guo Zhōng guó',fr:'Je suis déjà allée en Chine.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'中国',p:'Zhōng guó'},P('。')],fr:'Je ne suis jamais allée en Chine.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'他看过这个电影。',py:'tā kàn guo zhè ge diàn yǐng',fr:'Il a déjà vu ce film.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'看',p:'kàn'},{h:'过',p:'guo'},{h:'这个',p:'zhè ge'},{h:'电影',p:'diàn yǐng'},P('。')],fr:'Il n’a jamais vu ce film.'}},
    {consigne:'Posez la question avec 吗',
     de:{hz:'我吃过北京烤鸭。',py:'wǒ chī guo Běi jīng kǎo yā',fr:'J’ai déjà mangé du canard laqué.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'吃',p:'chī'},{h:'过',p:'guo'},{h:'北京',p:'Běi jīng'},{h:'烤鸭',p:'kǎo yā'},{h:'吗',p:'ma'},P('？')],fr:'As-tu déjà mangé du canard laqué ?'}},
    {consigne:'Ajoutez le compte : trois fois',
     de:{hz:'我去过北京。',py:'wǒ qù guo Běi jīng',fr:'Je suis déjà allée à Pékin.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'三次',p:'sān cì'},{h:'北京',p:'Běi jīng'},P('。')],fr:'Je suis allée trois fois à Pékin.'}},
    {consigne:'Demandez combien de fois',
     de:{hz:'我去过三次上海。',py:'wǒ qù guo sān cì Shàng hǎi',fr:'Je suis allée trois fois à Shanghai.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'几次',p:'jǐ cì'},{h:'上海',p:'Shàng hǎi'},P('？')],fr:'Combien de fois y es-tu allé ?'}},
    {consigne:'Passez de l’événement daté à l’expérience vécue',
     de:{hz:'我昨天去了北京。',py:'wǒ zuó tiān qù le Běi jīng',fr:'Hier, je suis partie à Pékin.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'北京',p:'Běi jīng'},P('。')],fr:'Je suis déjà allée à Pékin.'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'了',p:'le'},{h:'中国',p:'Zhōng guó'},P('。')],bad:4,
     bon:'我没去过中国。',why:'过 et 了 ne se superposent pas ; à la négative, 了 disparaît de toute façon.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'去',p:'qù'},{h:'中国',p:'Zhōng guó'},{h:'过',p:'guo'},P('。')],bad:4,
     bon:'我没去过中国。',why:'过 se colle au verbe ; il ne se rejette pas derrière l’objet.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bú'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'中国',p:'Zhōng guó'},P('。')],bad:1,
     bon:'我没去过中国。',why:'Une expérience qui n’a pas eu lieu se nie avec 没, jamais avec 不.'},
    {seg:[{h:'我',p:'wǒ'},{h:'三次',p:'sān cì'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'北京',p:'Běi jīng'},P('。')],bad:1,
     bon:'我去过三次北京。',why:'Le compte de fois suit 过 et précède l’objet.'},
    {seg:[{h:'你',p:'nǐ'},{h:'去',p:'qù'},{h:'过',p:'guo'},{h:'几',p:'jǐ'},{h:'北京',p:'Běi jīng'},P('？')],bad:3,
     bon:'你去过几次北京？',why:'Le compte de fois exige son classificateur : 次.'},
    {seg:[{h:'他',p:'tā'},{h:'来',p:'lái'},{h:'过',p:'guo'},{h:'了',p:'le'},{h:'我',p:'wǒ'},{h:'家',p:'jiā'},P('。')],bad:3,
     bon:'他来过我家。',why:'过 suffit à dire l’expérience ; ajouter 了 brouille les deux valeurs.'}
  ],

  reemploi:[
    {q:'Nommez deux endroits où vous êtes déjà allée, et un endroit où vous n’êtes jamais allée.',
     verif:[{type:'contient',v:'过',msg:'L’expérience vécue demande 过 après le verbe.'},
            {type:'contient',v:'没',msg:'La partie négative attend 没.'}],
     modeles:[{hz:'我去过中国和日本，没去过美国。',py:'wǒ qù guo Zhōng guó hé Rì běn, méi qù guo Měi guó',fr:'Je suis déjà allée en Chine et au Japon, jamais aux États-Unis.'},
              {hz:'我去过北京，可是没去过上海。',py:'wǒ qù guo Běi jīng, kě shì méi qù guo Shàng hǎi',fr:'Je suis déjà allée à Pékin, mais jamais à Shanghai.'}],
     criteres:['过 suit immédiatement le verbe','La négation emploie 没 et conserve 过','Aucun 了 dans la phrase']},
    {q:'On vous demande 你吃过中国菜吗？ Répondez, puis dites combien de fois.',
     verif:[{type:'contient',v:'过',msg:'La réponse reprend le verbe suivi de 过.'},
            {type:'contient',v:'次',msg:'Le compte de fois demande le classificateur 次.'}],
     modeles:[{hz:'吃过，我吃过很多次。',py:'chī guo, wǒ chī guo hěn duō cì',fr:'Oui, j’en ai mangé beaucoup de fois.'},
              {hz:'我吃过三次中国菜。',py:'wǒ chī guo sān cì Zhōng guó cài',fr:'J’ai mangé chinois trois fois.'}],
     criteres:['La réponse reprend le verbe, sans mot qui voudrait dire « oui »','次 accompagne le nombre','Le compte suit 过']},
    {q:'Dites une chose que vous avez faite hier, et une chose que vous avez déjà faite dans votre vie. Faites sentir l’écart entre 了 et 过.',
     verif:[{type:'contient',v:'了',msg:'L’action d’hier, datée et achevée, demande 了.'},
            {type:'contient',v:'过',msg:'L’expérience de toute une vie demande 过.'}],
     modeles:[{hz:'昨天我看了一个电影，我看过很多中国电影。',py:'zuó tiān wǒ kàn le yí ge diàn yǐng, wǒ kàn guo hěn duō Zhōng guó diàn yǐng',fr:'Hier j’ai vu un film ; j’ai déjà vu beaucoup de films chinois.'}],
     criteres:['了 pour l’action d’hier, datée et achevée','过 pour l’expérience, sans date','Chaque particule est collée à son verbe']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g305', hsk:3, fam:'verbe', th:['quotidien','decrire'],
  title:'L’action en cours : 在, 正在, 呢 — et 着',
  resume:'Le chinois ne conjugue pas, mais il sait dire qu’une action se déroule : 在 devant le verbe suffit, 正在 insiste, 呢 adoucit. 着 est tout autre chose : un état installé qui dure.',

  steps:[
    {
      t:'在 devant le verbe',
      p:[
        'Pour dire qu’une action est en cours, on place <b>在</b> juste devant le verbe. Rien d’autre ne change dans la phrase.',
        'Attention à ne pas le confondre avec le 在 de localisation : celui-là est suivi d’un lieu, non d’un verbe.'
      ],
      ex:[
        {hz:'我在看书。',py:'wǒ zài kàn shū',fr:'Je suis en train de lire.',
         note:'在 précède un verbe : action en cours.'},
        {hz:'我在家。',py:'wǒ zài jiā',fr:'Je suis à la maison.',
         note:'在 précède un lieu : localisation.'}
      ],
      check:{q:'我在看书 signifie :',a:['Je lis, en ce moment même.','Je lis des livres à la maison.'],ok:0,
             why:'在 suivi d’un verbe marque l’action en cours.'}
    },
    {
      t:'正在 — insister sur l’instant précis',
      p:[
        '<b>正在</b> renforce : l’action se déroule à l’instant même, souvent au moment où quelque chose d’autre survient.',
        'C’est la forme qu’on emploie pour dire « j’étais justement en train de… quand… ».'
      ],
      ex:[
        {hz:'我正在做饭。',py:'wǒ zhèng zài zuò fàn',fr:'Je suis justement en train de faire la cuisine.'},
        {hz:'你来的时候，我正在打电话。',py:'nǐ lái de shí hou, wǒ zhèng zài dǎ diàn huà',fr:'Quand tu es arrivé, j’étais justement au téléphone.'}
      ],
      check:{q:'Lequel insiste le plus sur l’instant précis ?',a:['我在做饭。','我正在做饭。'],ok:1,
             why:'正 ajoute l’idée d’un moment précis, souvent interrompu.'}
    },
    {
      t:'呢 en fin de phrase',
      p:[
        '<b>呢</b> posé à la toute fin adoucit la phrase et souligne que l’action se poursuit. Il accompagne 在 ou tient tout seul.',
        'C’est la forme la plus courante à l’oral, celle qu’on entend au téléphone.'
      ],
      ex:[
        {hz:'他在睡觉呢。',py:'tā zài shuì jiào ne',fr:'Il est en train de dormir.'},
        {hz:'他吃饭呢。',py:'tā chī fàn ne',fr:'Il est en train de manger.',
         note:'在 est sous-entendu : 呢 suffit à dire que l’action se déroule.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他呢在睡觉。','他在睡觉呢。'],ok:1,
             why:'呢 se pose en toute fin de phrase, jamais à l’intérieur.'}
    },
    {
      t:'La négation — 没在',
      p:[
        'On nie avec <b>没</b> ou <b>没有</b> placé devant 在 : l’action n’est pas en train de se dérouler.',
        'Le 呢 final tombe alors, et l’on enchaîne volontiers sur ce qu’on fait à la place.'
      ],
      ex:[
        {hz:'我没在看电视。',py:'wǒ méi zài kàn diàn shì',fr:'Je ne suis pas en train de regarder la télévision.'},
        {hz:'他没在睡觉，他在工作。',py:'tā méi zài shuì jiào, tā zài gōng zuò',fr:'Il ne dort pas, il travaille.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我不在看电视。','我没在看电视。'],ok:1,
             why:'L’action en cours est un fait constaté : elle se nie avec 没.'}
    },
    {
      t:'着 — un état qui dure, non une action qui se déroule',
      p:[
        '<b>着</b> se pose <b>après</b> le verbe et décrit un état installé, résultat d’une action déjà faite.',
        'Comparez : 他在开门 — il est en train d’ouvrir la porte ; 门开着 — la porte est ouverte, et elle le reste.',
        'On l’emploie beaucoup pour décrire : ce que quelqu’un porte, ce qui est posé quelque part, l’état d’une pièce.'
      ],
      ex:[
        {hz:'他在开门。',py:'tā zài kāi mén',fr:'Il est en train d’ouvrir la porte.',
         note:'L’action se déroule.'},
        {hz:'门开着。',py:'mén kāi zhe',fr:'La porte est ouverte.',
         note:'L’état dure. 着 se prononce zhe, au ton neutre.'},
        {hz:'她穿着一件红色的衣服。',py:'tā chuān zhe yí jiàn hóng sè de yī fu',fr:'Elle porte un vêtement rouge.'}
      ],
      check:{q:'« La fenêtre est ouverte » se dit :',a:['窗户在开。','窗户开着。'],ok:1,
             why:'C’est un état qui dure, non une action qui se déroule : 着 après le verbe.'}
    }
  ],

  tableau:{
    cols:['Forme','Exemple','Ce que cela dit'],
    rows:[
      ['在 + verbe','我在看书','L’action est en cours'],
      ['正在 + verbe','我正在做饭','À l’instant précis'],
      ['… 呢','他吃饭呢','En cours, ton parlé'],
      ['没在 + verbe','我没在看电视','L’action n’est pas en cours'],
      ['verbe + 着','门开着','Un état installé qui dure'],
      ['在 + lieu','我在家','Localisation, non action']
    ]
  },

  piege:{
    bad:{hz:'我在看书着。',py:'wǒ zài kàn shū zhe'},
    good:{hz:'我在看书。',py:'wǒ zài kàn shū'},
    why:'在 et 着 ne disent pas la même chose et ne se cumulent pas. 在 précède le verbe et décrit une action qui se déroule ; 着 le suit et décrit un état qui dure.'
  },

  voir:['g303','g304'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'书',p:'shū'},P('。')],cle:1,fr:'Je suis en train de lire.'},
    {seg:[{h:'我',p:'wǒ'},{h:'在',p:'zài'},{h:'家',p:'jiā'},P('。')],cle:1,fr:'Je suis à la maison.'},
    {seg:[{h:'我',p:'wǒ'},{h:'正在',p:'zhèng zài'},{h:'做',p:'zuò'},{h:'饭',p:'fàn'},P('。')],cle:1,fr:'Je suis justement en train de faire la cuisine.'},
    {seg:[{h:'他',p:'tā'},{h:'在',p:'zài'},{h:'睡觉',p:'shuì jiào'},{h:'呢',p:'ne'},P('。')],cle:1,fr:'Il est en train de dormir.'},
    {seg:[{h:'他',p:'tā'},{h:'吃',p:'chī'},{h:'饭',p:'fàn'},{h:'呢',p:'ne'},P('。')],cle:3,fr:'Il est en train de manger.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'电视',p:'diàn shì'},P('。')],cle:2,fr:'Je ne suis pas en train de regarder la télévision.'},
    {seg:[{h:'门',p:'mén'},{h:'开',p:'kāi'},{h:'着',p:'zhe'},P('。')],cle:2,fr:'La porte est ouverte.'},
    {seg:[{h:'她',p:'tā'},{h:'穿',p:'chuān'},{h:'着',p:'zhe'},{h:'一件',p:'yí jiàn'},{h:'红色',p:'hóng sè'},{h:'的',p:'de'},{h:'衣服',p:'yī fu'},P('。')],cle:2,fr:'Elle porte un vêtement rouge.'},
    {seg:[{h:'他',p:'tā'},{h:'在',p:'zài'},{h:'开',p:'kāi'},{h:'门',p:'mén'},P('。')],cle:1,fr:'Il est en train d’ouvrir la porte.'},
    {seg:[{h:'你',p:'nǐ'},{h:'来',p:'lái'},{h:'的',p:'de'},{h:'时候',p:'shí hou'},P('，'),{h:'我',p:'wǒ'},{h:'正在',p:'zhèng zài'},{h:'打',p:'dǎ'},{h:'电话',p:'diàn huà'},P('。')],cle:6,fr:'Quand tu es arrivé, j’étais justement au téléphone.'},
    {seg:[{h:'窗户',p:'chuāng hu'},{h:'开',p:'kāi'},{h:'着',p:'zhe'},P('。')],cle:2,fr:'La fenêtre est ouverte.'},
    {seg:[{h:'妈妈',p:'mā ma'},{h:'在',p:'zài'},{h:'做',p:'zuò'},{h:'饭',p:'fàn'},{h:'呢',p:'ne'},P('。')],cle:1,fr:'Maman est en train de faire la cuisine.'},
    {seg:[{h:'他们',p:'tā men'},{h:'在',p:'zài'},{h:'学',p:'xué'},{h:'汉语',p:'Hàn yǔ'},P('。')],cle:1,fr:'Ils sont en train d’apprendre le chinois.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'在',p:'zài'},{h:'工作',p:'gōng zuò'},P('，'),{h:'我',p:'wǒ'},{h:'在',p:'zài'},{h:'休息',p:'xiū xi'},P('。')],cle:2,fr:'Je ne travaille pas, je me repose.'},
    {seg:[{h:'桌子',p:'zhuō zi'},{h:'上',p:'shang'},{h:'放',p:'fàng'},{h:'着',p:'zhe'},{h:'一本',p:'yì běn'},{h:'书',p:'shū'},P('。')],cle:3,fr:'Sur la table est posé un livre.'}
  ],
  leurres:['在','正在','着','呢','了','没','过'],

  gabarits:[
    {cadre:[{s:'s'},{h:'在',p:'zài'},{s:'v'},{s:'o'},P('。')],
     fr:'… est en train de …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'看',p:'kàn',fr:'lire'},{h:'做',p:'zuò',fr:'préparer'},{h:'学',p:'xué',fr:'apprendre'},{h:'打',p:'dǎ',fr:'passer'},{h:'喝',p:'hē',fr:'boire'},{h:'看',p:'kàn',fr:'regarder'},{h:'写',p:'xiě',fr:'écrire'},{h:'吃',p:'chī',fr:'manger'},{h:'听',p:'tīng',fr:'écouter'},{h:'做',p:'zuò',fr:'faire'},{h:'看',p:'kàn',fr:'voir'},{h:'学',p:'xué',fr:'apprendre'}],o:[{h:'书',p:'shū',fr:'un livre'},{h:'饭',p:'fàn',fr:'le repas'},{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},{h:'电话',p:'diàn huà',fr:'un coup de fil'},{h:'咖啡',p:'kā fēi',fr:'un café'},{h:'电视',p:'diàn shì',fr:'la télévision'},{h:'汉字',p:'Hàn zì',fr:'des caractères'},{h:'饭',p:'fàn',fr:'le repas'},{h:'音乐',p:'yīn yuè',fr:'de la musique'},{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'电影',p:'diàn yǐng',fr:'un film'},{h:'英语',p:'Yīng yǔ',fr:'l’anglais'}]}},

    {cadre:[{s:'s'},{s:'v'},{s:'o'},{h:'呢',p:'ne'},P('。')],
     fr:'… est en train de …', lie:[['v','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'看',p:'kàn',fr:'lire'},{h:'做',p:'zuò',fr:'préparer'},{h:'学',p:'xué',fr:'apprendre'},{h:'打',p:'dǎ',fr:'passer'},{h:'喝',p:'hē',fr:'boire'},{h:'看',p:'kàn',fr:'regarder'},{h:'写',p:'xiě',fr:'écrire'},{h:'吃',p:'chī',fr:'manger'},{h:'听',p:'tīng',fr:'écouter'},{h:'做',p:'zuò',fr:'faire'},{h:'看',p:'kàn',fr:'voir'},{h:'学',p:'xué',fr:'apprendre'}],o:[{h:'书',p:'shū',fr:'un livre'},{h:'饭',p:'fàn',fr:'le repas'},{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},{h:'电话',p:'diàn huà',fr:'un coup de fil'},{h:'咖啡',p:'kā fēi',fr:'un café'},{h:'电视',p:'diàn shì',fr:'la télévision'},{h:'汉字',p:'Hàn zì',fr:'des caractères'},{h:'饭',p:'fàn',fr:'le repas'},{h:'音乐',p:'yīn yuè',fr:'de la musique'},{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'电影',p:'diàn yǐng',fr:'un film'},{h:'英语',p:'Yīng yǔ',fr:'l’anglais'}]}},

    {cadre:[{s:'n'},{s:'v'},{h:'着',p:'zhe'},P('。')],
     fr:'… est …', lie:[['n','v']],
     listes:{n:[{h:'门',p:'mén',fr:'la porte'},{h:'门',p:'mén',fr:'la porte'},{h:'窗户',p:'chuāng hu',fr:'la fenêtre'},{h:'窗户',p:'chuāng hu',fr:'la fenêtre'},{h:'灯',p:'dēng',fr:'la lampe'},{h:'灯',p:'dēng',fr:'la lampe'},{h:'电视',p:'diàn shì',fr:'la télévision'},{h:'电视',p:'diàn shì',fr:'la télévision'},{h:'手机',p:'shǒu jī',fr:'le téléphone'},{h:'手机',p:'shǒu jī',fr:'le téléphone'},{h:'电脑',p:'diàn nǎo',fr:'l’ordinateur'},{h:'电脑',p:'diàn nǎo',fr:'l’ordinateur'}],v:[{h:'开',p:'kāi',fr:'ouvert'},{h:'关',p:'guān',fr:'fermé'},{h:'开',p:'kāi',fr:'ouverte'},{h:'关',p:'guān',fr:'fermée'},{h:'开',p:'kāi',fr:'allumée'},{h:'关',p:'guān',fr:'éteinte'},{h:'开',p:'kāi',fr:'allumée'},{h:'关',p:'guān',fr:'éteinte'},{h:'开',p:'kāi',fr:'allumé'},{h:'关',p:'guān',fr:'éteint'},{h:'开',p:'kāi',fr:'allumé'},{h:'关',p:'guān',fr:'éteint'}]}}
  ],

  transfo:[
    {consigne:'Dites que l’action est en cours, avec 在',
     de:{hz:'我看书。',py:'wǒ kàn shū',fr:'Je lis.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'书',p:'shū'},P('。')],fr:'Je suis en train de lire.'}},
    {consigne:'Insistez sur l’instant précis, avec 正在',
     de:{hz:'我做饭。',py:'wǒ zuò fàn',fr:'Je fais la cuisine.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'正在',p:'zhèng zài'},{h:'做',p:'zuò'},{h:'饭',p:'fàn'},P('。')],fr:'Je suis justement en train de faire la cuisine.'}},
    {consigne:'Ajoutez 呢 en fin de phrase',
     de:{hz:'他在睡觉。',py:'tā zài shuì jiào',fr:'Il dort.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'在',p:'zài'},{h:'睡觉',p:'shuì jiào'},{h:'呢',p:'ne'},P('。')],fr:'Il est en train de dormir.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'我在看电视。',py:'wǒ zài kàn diàn shì',fr:'Je regarde la télévision.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'电视',p:'diàn shì'},P('。')],fr:'Je ne suis pas en train de regarder la télévision.'}},
    {consigne:'Passez de l’action en cours à l’état qui dure',
     de:{hz:'他在开门。',py:'tā zài kāi mén',fr:'Il est en train d’ouvrir la porte.'},
     vers:{seg:[{h:'门',p:'mén'},{h:'开',p:'kāi'},{h:'着',p:'zhe'},P('。')],fr:'La porte est ouverte.'}},
    {consigne:'Posez la question avec 吗',
     de:{hz:'他在工作。',py:'tā zài gōng zuò',fr:'Il travaille.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'在',p:'zài'},{h:'工作',p:'gōng zuò'},{h:'吗',p:'ma'},P('？')],fr:'Est-il en train de travailler ?'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'书',p:'shū'},{h:'在',p:'zài'},P('。')],bad:3,
     bon:'我在看书。',why:'在 se place devant le verbe, jamais derrière l’objet.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bú'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'电视',p:'diàn shì'},P('。')],bad:1,
     bon:'我没在看电视。',why:'L’action en cours se nie avec 没, non avec 不.'},
    {seg:[{h:'我',p:'wǒ'},{h:'在',p:'zài'},{h:'看',p:'kàn'},{h:'书',p:'shū'},{h:'着',p:'zhe'},P('。')],bad:4,
     bon:'我在看书。',why:'在 et 着 ne se cumulent pas : l’un dit l’action qui se déroule, l’autre l’état qui dure.'},
    {seg:[{h:'他',p:'tā'},{h:'呢',p:'ne'},{h:'在',p:'zài'},{h:'睡觉',p:'shuì jiào'},P('。')],bad:1,
     bon:'他在睡觉呢。',why:'呢 se pose en toute fin de phrase.'},
    {seg:[{h:'门',p:'mén'},{h:'开',p:'kāi'},{h:'在',p:'zài'},P('。')],bad:2,
     bon:'门开着。',why:'L’état qui dure se marque par 着 après le verbe. 在 précède le verbe et dit l’action en cours.'},
    {seg:[{h:'她',p:'tā'},{h:'穿',p:'chuān'},{h:'一件',p:'yí jiàn'},{h:'红色',p:'hóng sè'},{h:'的',p:'de'},{h:'衣服',p:'yī fu'},{h:'着',p:'zhe'},P('。')],bad:6,
     bon:'她穿着一件红色的衣服。',why:'着 se colle au verbe ; il ne se rejette pas en fin de phrase.'}
  ],

  reemploi:[
    {q:'Quelqu’un vous téléphone et demande 你在做什么呢？ Répondez.',
     verif:[{type:'contient',v:'在',msg:'L’action en cours demande 在 devant le verbe.'},
            {type:'absent',v:'着',msg:'着 décrit un état, non une action en cours.'}],
     modeles:[{hz:'我在看书呢。',py:'wǒ zài kàn shū ne',fr:'Je suis en train de lire.'},
              {hz:'我正在做饭。',py:'wǒ zhèng zài zuò fàn',fr:'Je suis justement en train de faire la cuisine.'}],
     criteres:['在 précède le verbe','L’objet suit le verbe','呢 est facultatif ; s’il est là, il ferme la phrase']},
    {q:'Décrivez la pièce où vous êtes : deux choses ouvertes, fermées, allumées ou posées quelque part.',
     verif:[{type:'contient',v:'着',msg:'L’état installé demande 着 après le verbe.'},
            {type:'absent',v:'正在',msg:'正在 dit l’action qui se déroule, non l’état qui dure.'}],
     modeles:[{hz:'窗户开着，灯也开着。',py:'chuāng hu kāi zhe, dēng yě kāi zhe',fr:'La fenêtre est ouverte et la lampe est allumée aussi.'},
              {hz:'桌子上放着一本书。',py:'zhuō zi shang fàng zhe yì běn shū',fr:'Sur la table est posé un livre.'}],
     criteres:['着 suit immédiatement le verbe','La phrase décrit un état, non une action','Aucun 在 devant le verbe']},
    {q:'Dites ce que vous n’êtes pas en train de faire, puis ce que vous faites à la place.',
     verif:[{type:'contient',v:'没',msg:'La négation de l’action en cours passe par 没.'},
            {type:'contient',v:'在',msg:'Les deux phrases attendent 在 devant le verbe.'}],
     modeles:[{hz:'我没在工作，我在休息。',py:'wǒ méi zài gōng zuò, wǒ zài xiū xi',fr:'Je ne travaille pas, je me repose.'},
              {hz:'我没在看电视，我在学汉语。',py:'wǒ méi zài kàn diàn shì, wǒ zài xué Hàn yǔ',fr:'Je ne regarde pas la télévision, j’apprends le chinois.'}],
     criteres:['没 précède 在','在 précède le verbe dans les deux phrases','Ni 了 ni 过 dans la phrase']}
  ]
},
/* ------------------------------------------------------------------ */
{
  id:'g306', hsk:3, fam:'verbe', th:['quotidien','travail'],
  title:'Le complément de résultat : ce que devient l’action',
  resume:'Le chinois ne dit pas seulement ce qu’on fait, mais comment cela finit. Un second élément se soude au verbe et donne son issue : 看完, 听懂, 找到.',

  steps:[
    {
      t:'Le principe — un bloc verbe + issue',
      p:[
        'Le verbe seul dit l’action, sans dire si elle a abouti. Un second élément vient se souder derrière lui et donne son <b>issue</b>.',
        'Les deux forment un bloc que rien ne sépare : ni un objet, ni même 了.'
      ],
      ex:[
        {hz:'我看书。',py:'wǒ kàn shū',fr:'Je lis.',
         note:'L’action, sans son issue : rien ne dit que la lecture aboutit.'},
        {hz:'我看完了这本书。',py:'wǒ kàn wán le zhè běn shū',fr:'J’ai fini de lire ce livre.',
         note:'完 dit que la lecture est allée à son terme. 了 se pose après le bloc 看完.'}
      ],
      check:{q:'Où se place 了 ?',a:['我看了完这本书。','我看完了这本书。'],ok:1,
             why:'Le verbe et son résultat forment un bloc : 了 se pose après, jamais entre les deux.'}
    },
    {
      t:'Les résultats les plus courants',
      p:[
        'Quelques éléments reviennent sans cesse : <b>完</b> l’achèvement, <b>好</b> le bon achèvement, <b>到</b> l’atteinte, <b>懂</b> la compréhension, <b>见</b> la perception, <b>错</b> l’erreur.',
        'Ce ne sont pas des adverbes mais de vrais verbes ou adjectifs, employés ici comme issue de l’action.'
      ],
      ex:[
        {hz:'我找到了我的手机。',py:'wǒ zhǎo dào le wǒ de shǒu jī',fr:'J’ai retrouvé mon téléphone.',
         note:'找 c’est chercher ; c’est 到 qui ajoute l’aboutissement.'},
        {hz:'我听懂了。',py:'wǒ tīng dǒng le',fr:'J’ai compris.'},
        {hz:'你说错了。',py:'nǐ shuō cuò le',fr:'Tu t’es trompé.'}
      ],
      check:{q:'找 employé seul veut dire :',a:['trouver','chercher'],ok:1,
             why:'C’est 到 qui ajoute l’aboutissement : 找到, c’est trouver.'}
    },
    {
      t:'La négation — 没, et le résultat reste',
      p:[
        'On nie avec <b>没</b> ou <b>没有</b> : l’action n’a pas abouti. Le complément de résultat, lui, <b>reste</b>, et 了 disparaît.',
        'C’est exactement le mécanisme de 过 : ce qui est nié, c’est l’aboutissement, donc il doit rester visible.'
      ],
      ex:[
        {hz:'我没看完这本书。',py:'wǒ méi kàn wán zhè běn shū',fr:'Je n’ai pas fini ce livre.'},
        {hz:'我没听懂。',py:'wǒ méi tīng dǒng',fr:'Je n’ai pas compris.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我没看完了这本书。','我没看完这本书。'],ok:1,
             why:'没 chasse 了, mais le complément de résultat demeure.'}
    },
    {
      t:'La forme potentielle — 得 et 不 au milieu du bloc',
      p:[
        'Pour dire qu’un résultat est <b>possible ou impossible</b>, on glisse <b>得</b> ou <b>不</b> entre le verbe et son résultat.',
        '看得懂, j’arrive à comprendre en lisant. 看不懂, je n’y arrive pas.',
        'Ce n’est pas la même chose que 没看懂, qui constate un échec ponctuel : la forme potentielle parle d’une capacité.'
      ],
      ex:[
        {hz:'这本书我看得懂。',py:'zhè běn shū wǒ kàn de dǒng',fr:'Ce livre, j’arrive à le lire.'},
        {hz:'老师说得太快，我听不懂。',py:'lǎo shī shuō de tài kuài, wǒ tīng bu dǒng',fr:'Le professeur parle trop vite, je n’arrive pas à suivre.',
         note:'Dans la forme potentielle, 不 se prononce au ton neutre : bu.'}
      ],
      check:{q:'« Je n’arrive pas à comprendre ce que je lis » se dit :',
             a:['我没看懂。','我看不懂。'],ok:1,
             why:'La forme potentielle parle d’une capacité ; 没 ne constaterait qu’un échec ponctuel.'}
    },
    {
      t:'Le piège — un verbe français, plusieurs blocs chinois',
      p:[
        'Le français a des verbes distincts là où le chinois a un seul verbe et des issues différentes.',
        '听 écouter · 听到 entendre, le son parvient · 听见 entendre, on le perçoit · 听懂 comprendre.',
        'La faute la plus fréquente consiste à employer le verbe nu là où le français emploie un verbe d’aboutissement.'
      ],
      ex:[
        {hz:'我听了，可是没听懂。',py:'wǒ tīng le, kě shì méi tīng dǒng',fr:'J’ai écouté, mais je n’ai pas compris.'},
        {hz:'我看见他了。',py:'wǒ kàn jiàn tā le',fr:'Je l’ai vu.',
         note:'看 seul dirait seulement que je regardais dans sa direction.'}
      ],
      check:{q:'« Je l’ai vu » se dit :',a:['我看他了。','我看见他了。'],ok:1,
             why:'见 marque que la perception a abouti ; 看 seul ne dit que le regard.'}
    }
  ],

  tableau:{
    cols:['Résultat','Ce qu’il ajoute','Exemple'],
    rows:[
      ['完','mené à son terme','我看完了 — j’ai fini de lire'],
      ['好','achevé comme il faut','饭做好了 — le repas est prêt'],
      ['到','atteint, obtenu','我找到了 — j’ai trouvé'],
      ['懂','compris','我听懂了 — j’ai compris'],
      ['见','perçu','我看见他了 — je l’ai vu'],
      ['错','de travers','你说错了 — tu t’es trompé']
    ]
  },

  piege:{
    bad:{hz:'我没看完了这本书。',py:'wǒ méi kàn wán le zhè běn shū'},
    good:{hz:'我没看完这本书。',py:'wǒ méi kàn wán zhè běn shū'},
    why:'没 et 了 ne cohabitent jamais. Le complément de résultat, lui, reste en place : c’est lui qui porte l’aboutissement, et c’est précisément cet aboutissement que 没 vient nier.'
  },

  voir:['g303','g302'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'了',p:'le'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],cle:2,fr:'J’ai fini de lire ce livre.'},
    {seg:[{h:'我',p:'wǒ'},{h:'找',p:'zhǎo'},{h:'到',p:'dào'},{h:'了',p:'le'},{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'手机',p:'shǒu jī'},P('。')],cle:2,fr:'J’ai retrouvé mon téléphone.'},
    {seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},{h:'了',p:'le'},P('。')],cle:2,fr:'J’ai compris.'},
    {seg:[{h:'你',p:'nǐ'},{h:'说',p:'shuō'},{h:'错',p:'cuò'},{h:'了',p:'le'},P('。')],cle:2,fr:'Tu t’es trompé.'},
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'见',p:'jiàn'},{h:'他',p:'tā'},{h:'了',p:'le'},P('。')],cle:2,fr:'Je l’ai vu.'},
    {seg:[{h:'饭',p:'fàn'},{h:'做',p:'zuò'},{h:'好',p:'hǎo'},{h:'了',p:'le'},P('。')],cle:2,fr:'Le repas est prêt.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],cle:3,fr:'Je n’ai pas fini ce livre.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},P('。')],cle:3,fr:'Je n’ai pas compris.'},
    {seg:[{h:'你',p:'nǐ'},{h:'听',p:'tīng'},{h:'见',p:'jiàn'},{h:'了',p:'le'},{h:'吗',p:'ma'},P('？')],cle:2,fr:'Tu as entendu ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'找',p:'zhǎo'},{h:'到',p:'dào'},{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'手机',p:'shǒu jī'},P('。')],cle:3,fr:'Je n’ai pas retrouvé mon téléphone.'},
    {seg:[{h:'作业',p:'zuò yè'},{h:'我',p:'wǒ'},{h:'写',p:'xiě'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],cle:3,fr:'Mes devoirs, je les ai finis.'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'做',p:'zuò'},{h:'好',p:'hǎo'},{h:'这个',p:'zhè ge'},{h:'工作',p:'gōng zuò'},P('。')],cle:3,fr:'Il n’a pas bien fait ce travail.'},
    {seg:[{h:'我',p:'wǒ'},{h:'买',p:'mǎi'},{h:'到',p:'dào'},{h:'票',p:'piào'},{h:'了',p:'le'},P('。')],cle:2,fr:'J’ai réussi à avoir un billet.'},
    {seg:[{h:'你',p:'nǐ'},{h:'写',p:'xiě'},{h:'错',p:'cuò'},{h:'了',p:'le'},{h:'一个',p:'yí ge'},{h:'字',p:'zì'},P('。')],cle:2,fr:'Tu as écrit un caractère de travers.'},
    {seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'了',p:'le'},P('，'),{h:'可是',p:'kě shì'},{h:'没',p:'méi'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},P('。')],cle:7,fr:'J’ai écouté, mais je n’ai pas compris.'}
  ],
  leurres:['完','到','懂','见','错','好','了','没'],

  gabarits:[
    {cadre:[{s:'s'},{s:'v'},{s:'r'},{h:'了',p:'le'},P('。')],
     fr:'… a …', lie:[['v','r']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},{h:'找',p:'zhǎo',fr:'chercher'},{h:'写',p:'xiě',fr:'écrire'},{h:'做',p:'zuò',fr:'faire'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'买',p:'mǎi',fr:'acheter'},{h:'说',p:'shuō',fr:'dire'},{h:'学',p:'xué',fr:'apprendre'},{h:'写',p:'xiě',fr:'écrire'},{h:'听',p:'tīng',fr:'entendre'}],r:[{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'}]}},

    {cadre:[{s:'s'},{h:'没',p:'méi'},{s:'v'},{s:'r'},P('。')],
     fr:'… n’a pas …', lie:[['v','r']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},{h:'找',p:'zhǎo',fr:'chercher'},{h:'写',p:'xiě',fr:'écrire'},{h:'做',p:'zuò',fr:'faire'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'买',p:'mǎi',fr:'acheter'},{h:'说',p:'shuō',fr:'dire'},{h:'学',p:'xué',fr:'apprendre'},{h:'写',p:'xiě',fr:'écrire'},{h:'听',p:'tīng',fr:'entendre'}],r:[{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'完',p:'wán',fr:'jusqu’au bout'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'好',p:'hǎo',fr:'comme il faut'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'}]}},

    {cadre:[{s:'s'},{s:'v'},{s:'d'},{s:'r'},P('。')],
     fr:'… arrive / n’arrive pas à …', lie:[['v','d','r']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],v:[{h:'看',p:'kàn',fr:'lire'},{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},{h:'听',p:'tīng',fr:'écouter'},{h:'找',p:'zhǎo',fr:'chercher'},{h:'找',p:'zhǎo',fr:'chercher'},{h:'看',p:'kàn',fr:'lire'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'},{h:'吃',p:'chī',fr:'manger'},{h:'买',p:'mǎi',fr:'acheter'},{h:'买',p:'mǎi',fr:'acheter'}],d:[{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'},{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'},{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'},{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'},{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'},{h:'得',p:'de',fr:'y arriver'},{h:'不',p:'bu',fr:'ne pas y arriver'}],r:[{h:'懂',p:'dǒng',fr:'comprendre'},{h:'懂',p:'dǒng',fr:'comprendre'},{h:'懂',p:'dǒng',fr:'comprendre'},{h:'懂',p:'dǒng',fr:'comprendre'},{h:'到',p:'dào',fr:'trouver'},{h:'到',p:'dào',fr:'trouver'},{h:'完',p:'wán',fr:'finir'},{h:'完',p:'wán',fr:'finir'},{h:'完',p:'wán',fr:'finir'},{h:'完',p:'wán',fr:'finir'},{h:'到',p:'dào',fr:'l’obtenir'},{h:'到',p:'dào',fr:'l’obtenir'}]}}
  ],

  transfo:[
    {consigne:'Ajoutez le résultat 完',
     de:{hz:'我看了这本书。',py:'wǒ kàn le zhè běn shū',fr:'J’ai lu ce livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'了',p:'le'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],fr:'J’ai fini de lire ce livre.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'我看完了这本书。',py:'wǒ kàn wán le zhè běn shū',fr:'J’ai fini de lire ce livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],fr:'Je n’ai pas fini ce livre.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'我听懂了。',py:'wǒ tīng dǒng le',fr:'J’ai compris.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},P('。')],fr:'Je n’ai pas compris.'}},
    {consigne:'Passez à la forme potentielle négative',
     de:{hz:'我没听懂。',py:'wǒ méi tīng dǒng',fr:'Je n’ai pas compris.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},P('。')],fr:'Je n’arrive pas à comprendre.'}},
    {consigne:'Passez à la forme potentielle affirmative',
     de:{hz:'我听不懂。',py:'wǒ tīng bu dǒng',fr:'Je n’arrive pas à comprendre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},P('。')],fr:'J’arrive à comprendre.'}},
    {consigne:'Ajoutez le résultat 到',
     de:{hz:'我找我的手机。',py:'wǒ zhǎo wǒ de shǒu jī',fr:'Je cherche mon téléphone.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'找',p:'zhǎo'},{h:'到',p:'dào'},{h:'了',p:'le'},{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'手机',p:'shǒu jī'},P('。')],fr:'J’ai retrouvé mon téléphone.'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'了',p:'le'},{h:'完',p:'wán'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],bad:2,
     bon:'我看完了这本书。',why:'Le verbe et son résultat forment un bloc : 了 se pose après, jamais entre les deux.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'了',p:'le'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],bad:4,
     bon:'我没看完这本书。',why:'没 chasse 了 ; le complément de résultat, lui, reste en place.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bù'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},P('。')],bad:1,
     bon:'我没听懂。',why:'Un résultat qui n’a pas abouti se nie avec 没. 不 exprimerait un refus.'},
    {seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'懂',p:'dǒng'},{h:'不',p:'bù'},P('。')],bad:3,
     bon:'我听不懂。',why:'Dans la forme potentielle, 不 se glisse entre le verbe et son résultat.'},
    {seg:[{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'不',p:'bù'},{h:'懂',p:'dǒng'},P('。')],bad:4,
     bon:'这本书我看不懂。',why:'得 et 不 ne se cumulent pas : l’un dit que le résultat est possible, l’autre qu’il ne l’est pas.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'找',p:'zhǎo'},{h:'我',p:'wǒ'},{h:'的',p:'de'},{h:'手机',p:'shǒu jī'},P('。')],bad:2,
     bon:'我没找到我的手机。',why:'找 seul ne dit que la recherche. Pour l’aboutissement — trouver — il faut 到.'}
  ],

  reemploi:[
    {q:'Dites une chose que vous avez terminée aujourd’hui et une chose que vous n’avez pas terminée.',
     verif:[{type:'contient',v:'完',msg:'L’achèvement demande le résultat 完.'},
            {type:'contient',v:'没',msg:'La partie négative attend 没.'}],
     modeles:[{hz:'我看完了一本书，没写完作业。',py:'wǒ kàn wán le yì běn shū, méi xiě wán zuò yè',fr:'J’ai fini un livre et je n’ai pas fini mes devoirs.'},
              {hz:'今天我做完了工作，可是没看完这本书。',py:'jīn tiān wǒ zuò wán le gōng zuò, kě shì méi kàn wán zhè běn shū',fr:'Aujourd’hui j’ai fini mon travail, mais je n’ai pas fini ce livre.'}],
     criteres:['完 est collé au verbe, sans rien entre les deux','了 se pose après le bloc verbe + résultat','La phrase négative emploie 没 et perd son 了']},
    {q:'Dites ce que vous arrivez à comprendre en chinois, et ce que vous n’arrivez pas à comprendre.',
     verif:[{type:'contient',v:'得',msg:'La capacité s’exprime avec 得 entre le verbe et son résultat.'},
            {type:'contient',v:'不',msg:'L’incapacité s’exprime avec 不 à la même place.'}],
     modeles:[{hz:'我看得懂汉字，可是听不懂。',py:'wǒ kàn de dǒng Hàn zì, kě shì tīng bu dǒng',fr:'J’arrive à lire les caractères, mais pas à comprendre à l’oreille.'},
              {hz:'老师说的我听得懂，电影我听不懂。',py:'lǎo shī shuō de wǒ tīng de dǒng, diàn yǐng wǒ tīng bu dǒng',fr:'Ce que dit le professeur, je le comprends ; les films, non.'}],
     criteres:['得 et 不 sont entre le verbe et son résultat','Aucun 没 : il s’agit d’une capacité, non d’un échec ponctuel','Le résultat 懂 reste dans les deux phrases']},
    {q:'Vous cherchiez quelque chose. Dites si vous l’avez trouvé, avec le résultat 到.',
     verif:[{type:'contient',v:'到',msg:'L’aboutissement de la recherche demande 到.'},
            {type:'contient',v:'找',msg:'On attend le verbe 找.'}],
     modeles:[{hz:'我找到了我的手机。',py:'wǒ zhǎo dào le wǒ de shǒu jī',fr:'J’ai retrouvé mon téléphone.'},
              {hz:'我没找到我的钥匙。',py:'wǒ méi zhǎo dào wǒ de yào shi',fr:'Je n’ai pas retrouvé mes clés.'}],
     criteres:['到 est collé au verbe 找','Si la phrase est affirmative, 了 suit le bloc','Si elle est négative, 没 est là et 了 a disparu']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g307', hsk:3, fam:'phrase', th:['logement','quotidien'],
  title:'把 : dire ce qu’on fait subir à un objet',
  resume:'把 avance l’objet devant le verbe pour dire non pas ce qu’on fait, mais ce que cet objet devient : déplacé, terminé, rangé, transformé.',

  steps:[
    {
      t:'Quand l’employer',
      p:[
        'La phrase ordinaire dit ce que fait le sujet. La phrase en <b>把</b> dit ce que l’objet <b>devient</b> : où il finit, dans quel état il se retrouve.',
        'Deux conditions, toujours réunies : l’objet est <b>connu et déterminé</b> — celui-là, le mien, ce livre-ci — et la phrase raconte son sort.'
      ],
      ex:[
        {hz:'我吃了那个面包。',py:'wǒ chī le nà ge miàn bāo',fr:'J’ai mangé ce pain.',
         note:'Phrase ordinaire : ce que j’ai fait.'},
        {hz:'我把那个面包吃了。',py:'wǒ bǎ nà ge miàn bāo chī le',fr:'Ce pain, je l’ai mangé.',
         note:'Phrase en 把 : ce qu’il est devenu.'}
      ],
      check:{q:'把 s’emploie quand :',
             a:['l’objet est un objet quelconque','l’objet est connu et la phrase dit son sort'],ok:1,
             why:'把 exige un objet déterminé et un verbe qui dit ce qu’il devient.'}
    },
    {
      t:'Le moule — et le verbe qui ne reste jamais nu',
      p:[
        'L’ordre est fixe : <b>sujet + 把 + objet + verbe + complément</b>.',
        'Le verbe ne reste <b>jamais nu</b>. Il lui faut toujours quelque chose derrière lui : c’est là toute la difficulté de la construction.'
      ],
      ex:[
        {hz:'我把书放在桌子上。',py:'wǒ bǎ shū fàng zài zhuō zi shang',fr:'J’ai posé le livre sur la table.'},
        {hz:'请把门关上。',py:'qǐng bǎ mén guān shang',fr:'Ferme la porte, s’il te plaît.',
         note:'上 est le complément qui achève le verbe.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我把书放。','我把书放在桌子上。'],ok:1,
             why:'Après 把, le verbe ne peut pas rester nu : il lui faut un complément.'}
    },
    {
      t:'Ce qui peut occuper la place du complément',
      p:[
        'Cinq possibilités, toutes déjà connues : <b>了</b>, un <b>complément de résultat</b>, <b>给</b> suivi d’une personne, <b>在</b> ou <b>到</b> suivis d’un lieu, ou une direction.',
        'C’est ici que la fiche précédente sert : la plupart des phrases en 把 se terminent par un résultatif.'
      ],
      ex:[
        {hz:'我把作业写完了。',py:'wǒ bǎ zuò yè xiě wán le',fr:'J’ai fini mes devoirs.',
         note:'Le résultat 完, puis 了 après le bloc.'},
        {hz:'我把这本书给他了。',py:'wǒ bǎ zhè běn shū gěi tā le',fr:'Je lui ai donné ce livre.'},
        {hz:'他把车开到了机场。',py:'tā bǎ chē kāi dào le jī chǎng',fr:'Il a conduit la voiture jusqu’à l’aéroport.'}
      ],
      check:{q:'Dans 我把作业写完了, qu’est-ce qui remplit la place du complément ?',
             a:['了 tout seul','le résultat 完, suivi de 了'],ok:1,
             why:'C’est 完 qui dit ce que les devoirs sont devenus ; 了 ne vient qu’après le bloc.'}
    },
    {
      t:'Négation et auxiliaires — devant 把',
      p:[
        '不, 没, 想, 要, 能 se placent <b>devant 把</b>, jamais devant le verbe.',
        'C’est logique : ils portent sur toute la phrase, non sur le seul verbe, qui est déjà pris dans son bloc.'
      ],
      ex:[
        {hz:'我没把作业写完。',py:'wǒ méi bǎ zuò yè xiě wán',fr:'Je n’ai pas fini mes devoirs.',
         note:'没 devant 把 ; le résultat 完 reste, 了 disparaît.'},
        {hz:'我想把这本书给他。',py:'wǒ xiǎng bǎ zhè běn shū gěi tā',fr:'Je voudrais lui donner ce livre.'}
      ],
      check:{q:'Où se place 没 ?',a:['我把作业没写完。','我没把作业写完。'],ok:1,
             why:'La négation précède 把 ; elle ne se glisse pas devant le verbe.'}
    },
    {
      t:'Les deux pièges',
      p:[
        'Premier piège : l’objet doit être <b>déterminé</b>. 我把一本书看完了 est faux — un livre quelconque n’a pas de sort à raconter.',
        'Second piège : 把 refuse les verbes qui ne font <b>rien subir</b> à leur objet — perception, sentiment, état : 看见, 喜欢, 知道, 是, 有.',
        'Le test est simple : si l’objet ne change ni de place ni d’état, 把 est hors de propos.'
      ],
      ex:[
        {hz:'我把这本书看完了。',py:'wǒ bǎ zhè běn shū kàn wán le',fr:'Ce livre, je l’ai fini.',
         note:'这本 le détermine, et 看完 le mène à son terme : la phrase est juste.'},
        {hz:'我看见他了。',py:'wǒ kàn jiàn tā le',fr:'Je l’ai vu.',
         note:'Aucun 把 possible : le regard ne fait rien subir.'}
      ],
      check:{q:'Laquelle est possible ?',a:['我把他看见了。','我把这本书看完了。'],ok:1,
             why:'看见 ne fait rien subir à son objet ; 看完, lui, le mène à son terme.'}
    }
  ],

  tableau:{
    cols:['Ce qui ferme le verbe','Exemple','Traduction'],
    rows:[
      ['了','我把面包吃了','Ce pain, je l’ai mangé'],
      ['un résultat','我把作业写完了','J’ai fini mes devoirs'],
      ['给 + personne','我把书给他了','Je lui ai donné le livre'],
      ['在 / 到 + lieu','我把书放在桌子上','J’ai posé le livre sur la table'],
      ['une direction','请把门关上','Ferme la porte'],
      ['Négation','我没把作业写完','Je n’ai pas fini mes devoirs']
    ]
  },

  piege:{
    bad:{hz:'我把书放。',py:'wǒ bǎ shū fàng'},
    good:{hz:'我把书放在桌子上。',py:'wǒ bǎ shū fàng zài zhuō zi shang'},
    why:'Après 把, le verbe ne reste jamais nu. La phrase a promis de dire ce que l’objet devient : il lui faut donc un complément — un lieu, un résultat, une direction, ou au minimum 了.'
  },

  voir:['g306','g303'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'那个',p:'nà ge'},{h:'面包',p:'miàn bāo'},{h:'吃',p:'chī'},{h:'了',p:'le'},P('。')],cle:1,fr:'Ce pain, je l’ai mangé.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'书',p:'shū'},{h:'放',p:'fàng'},{h:'在',p:'zài'},{h:'桌子',p:'zhuō zi'},{h:'上',p:'shang'},P('。')],cle:1,fr:'J’ai posé le livre sur la table.'},
    {seg:[{h:'请',p:'qǐng'},{h:'把',p:'bǎ'},{h:'门',p:'mén'},{h:'关',p:'guān'},{h:'上',p:'shang'},P('。')],cle:1,fr:'Ferme la porte, s’il te plaît.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'作业',p:'zuò yè'},{h:'写',p:'xiě'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],cle:4,fr:'J’ai fini mes devoirs.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'给',p:'gěi'},{h:'他',p:'tā'},{h:'了',p:'le'},P('。')],cle:4,fr:'Je lui ai donné ce livre.'},
    {seg:[{h:'他',p:'tā'},{h:'把',p:'bǎ'},{h:'车',p:'chē'},{h:'开',p:'kāi'},{h:'到',p:'dào'},{h:'了',p:'le'},{h:'机场',p:'jī chǎng'},P('。')],cle:4,fr:'Il a conduit la voiture jusqu’à l’aéroport.'},
    {seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'把',p:'bǎ'},{h:'作业',p:'zuò yè'},{h:'写',p:'xiě'},{h:'完',p:'wán'},P('。')],cle:1,fr:'Je n’ai pas fini mes devoirs.'},
    {seg:[{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'把',p:'bǎ'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'给',p:'gěi'},{h:'他',p:'tā'},P('。')],cle:2,fr:'Je voudrais lui donner ce livre.'},
    {seg:[{h:'你',p:'nǐ'},{h:'把',p:'bǎ'},{h:'那个',p:'nà ge'},{h:'字',p:'zì'},{h:'写',p:'xiě'},{h:'错',p:'cuò'},{h:'了',p:'le'},P('。')],cle:1,fr:'Tu as écrit ce caractère de travers.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],cle:5,fr:'Ce livre, je l’ai fini.'},
    {seg:[{h:'请',p:'qǐng'},{h:'把',p:'bǎ'},{h:'手机',p:'shǒu jī'},{h:'放',p:'fàng'},{h:'在',p:'zài'},{h:'这儿',p:'zhèr'},P('。')],cle:4,fr:'Pose ton téléphone ici.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'咖啡',p:'kā fēi'},{h:'喝',p:'hē'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],cle:4,fr:'J’ai fini mon café.'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'把',p:'bǎ'},{h:'门',p:'mén'},{h:'关',p:'guān'},{h:'上',p:'shang'},P('。')],cle:1,fr:'Il n’a pas fermé la porte.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'钱',p:'qián'},{h:'给',p:'gěi'},{h:'你',p:'nǐ'},P('。')],cle:3,fr:'Je te donne l’argent.'}
  ],
  leurres:['把','了','完','在','给','没','到'],

  gabarits:[
    {cadre:[{s:'s'},{h:'把',p:'bǎ'},{s:'o'},{s:'v'},{h:'了',p:'le'},P('。')],
     fr:'…, … l’a …', lie:[['o','v']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],o:[{h:'那个面包',p:'nà ge miàn bāo',fr:'ce pain'},{h:'咖啡',p:'kā fēi',fr:'le café'},{h:'茶',p:'chá',fr:'le thé'},{h:'饭',p:'fàn',fr:'le repas'},{h:'那些菜',p:'nà xiē cài',fr:'ces plats'},{h:'蛋糕',p:'dàn gāo',fr:'le gâteau'},{h:'水',p:'shuǐ',fr:'l’eau'},{h:'那杯茶',p:'nà bēi chá',fr:'cette tasse de thé'},{h:'那个苹果',p:'nà ge píng guǒ',fr:'cette pomme'},{h:'牛奶',p:'niú nǎi',fr:'le lait'},{h:'面包',p:'miàn bāo',fr:'le pain'},{h:'那杯咖啡',p:'nà bēi kā fēi',fr:'ce café'}],v:[{h:'吃',p:'chī',fr:'mangé'},{h:'喝',p:'hē',fr:'bu'},{h:'喝',p:'hē',fr:'bu'},{h:'吃',p:'chī',fr:'mangé'},{h:'吃',p:'chī',fr:'mangés'},{h:'吃',p:'chī',fr:'mangé'},{h:'喝',p:'hē',fr:'bue'},{h:'喝',p:'hē',fr:'bue'},{h:'吃',p:'chī',fr:'mangée'},{h:'喝',p:'hē',fr:'bu'},{h:'吃',p:'chī',fr:'mangé'},{h:'喝',p:'hē',fr:'bu'}]}},

    {cadre:[{s:'s'},{h:'把',p:'bǎ'},{s:'o'},{s:'v'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],
     fr:'… a fini de … …', lie:[['o','v']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],o:[{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'这本书',p:'zhè běn shū',fr:'ce livre'},{h:'咖啡',p:'kā fēi',fr:'le café'},{h:'工作',p:'gōng zuò',fr:'le travail'},{h:'饭',p:'fàn',fr:'le repas'},{h:'这些字',p:'zhè xiē zì',fr:'ces caractères'},{h:'那个电影',p:'nà ge diàn yǐng',fr:'ce film'},{h:'茶',p:'chá',fr:'le thé'},{h:'这些菜',p:'zhè xiē cài',fr:'ces plats'},{h:'这些作业',p:'zhè xiē zuò yè',fr:'ces devoirs'},{h:'那本书',p:'nà běn shū',fr:'ce livre-là'},{h:'面包',p:'miàn bāo',fr:'le pain'}],v:[{h:'写',p:'xiě',fr:'écrire'},{h:'看',p:'kàn',fr:'lire'},{h:'喝',p:'hē',fr:'boire'},{h:'做',p:'zuò',fr:'faire'},{h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},{h:'看',p:'kàn',fr:'regarder'},{h:'喝',p:'hē',fr:'boire'},{h:'吃',p:'chī',fr:'manger'},{h:'做',p:'zuò',fr:'faire'},{h:'看',p:'kàn',fr:'lire'},{h:'吃',p:'chī',fr:'manger'}]}},

    {cadre:[{s:'q'},{h:'把',p:'bǎ'},{s:'o'},{h:'放',p:'fàng'},{h:'在',p:'zài'},{s:'l'},P('。')],
     fr:'Pose … …', lie:[], libre:['q','o','l'],
     listes:{q:[{h:'请',p:'qǐng',fr:'s’il te plaît'},{h:'请你',p:'qǐng nǐ',fr:'s’il te plaît'}],o:[{h:'书',p:'shū',fr:'le livre'},{h:'手机',p:'shǒu jī',fr:'le téléphone'},{h:'钱',p:'qián',fr:'l’argent'},{h:'咖啡',p:'kā fēi',fr:'le café'},{h:'词典',p:'cí diǎn',fr:'le dictionnaire'},{h:'电脑',p:'diàn nǎo',fr:'l’ordinateur'},{h:'衣服',p:'yī fu',fr:'les vêtements'},{h:'照片',p:'zhào piàn',fr:'la photo'},{h:'礼物',p:'lǐ wù',fr:'le cadeau'},{h:'水',p:'shuǐ',fr:'l’eau'},{h:'作业',p:'zuò yè',fr:'les devoirs'},{h:'蛋糕',p:'dàn gāo',fr:'le gâteau'}],l:[{h:'桌子上',p:'zhuō zi shang',fr:'sur la table'},{h:'这儿',p:'zhèr',fr:'ici'},{h:'那儿',p:'nàr',fr:'là'},{h:'房间里',p:'fáng jiān lǐ',fr:'dans la chambre'}]}}
  ],

  transfo:[
    {consigne:'Récrivez avec 把',
     de:{hz:'我吃了那个面包。',py:'wǒ chī le nà ge miàn bāo',fr:'J’ai mangé ce pain.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'那个',p:'nà ge'},{h:'面包',p:'miàn bāo'},{h:'吃',p:'chī'},{h:'了',p:'le'},P('。')],fr:'Ce pain, je l’ai mangé.'}},
    {consigne:'Récrivez avec 把',
     de:{hz:'我写完了作业。',py:'wǒ xiě wán le zuò yè',fr:'J’ai fini mes devoirs.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'作业',p:'zuò yè'},{h:'写',p:'xiě'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],fr:'J’ai fini mes devoirs.'}},
    {consigne:'Récrivez avec 把',
     de:{hz:'他开车到了机场。',py:'tā kāi chē dào le jī chǎng',fr:'Il est allé en voiture jusqu’à l’aéroport.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'把',p:'bǎ'},{h:'车',p:'chē'},{h:'开',p:'kāi'},{h:'到',p:'dào'},{h:'了',p:'le'},{h:'机场',p:'jī chǎng'},P('。')],fr:'Il a conduit la voiture jusqu’à l’aéroport.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'我把作业写完了。',py:'wǒ bǎ zuò yè xiě wán le',fr:'J’ai fini mes devoirs.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'没',p:'méi'},{h:'把',p:'bǎ'},{h:'作业',p:'zuò yè'},{h:'写',p:'xiě'},{h:'完',p:'wán'},P('。')],fr:'Je n’ai pas fini mes devoirs.'}},
    {consigne:'Exprimez le souhait avec 想',
     de:{hz:'我把这本书给他。',py:'wǒ bǎ zhè běn shū gěi tā',fr:'Je lui donne ce livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'把',p:'bǎ'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'给',p:'gěi'},{h:'他',p:'tā'},P('。')],fr:'Je voudrais lui donner ce livre.'}},
    {consigne:'Ajoutez le lieu 在桌子上',
     de:{hz:'我把书放好了。',py:'wǒ bǎ shū fàng hǎo le',fr:'J’ai rangé le livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'书',p:'shū'},{h:'放',p:'fàng'},{h:'在',p:'zài'},{h:'桌子',p:'zhuō zi'},{h:'上',p:'shang'},P('。')],fr:'J’ai posé le livre sur la table.'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'书',p:'shū'},{h:'放',p:'fàng'},P('。')],bad:3,
     bon:'我把书放在桌子上。',why:'Après 把, le verbe ne reste jamais nu : il lui faut un complément.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'作业',p:'zuò yè'},{h:'没',p:'méi'},{h:'写',p:'xiě'},{h:'完',p:'wán'},P('。')],bad:3,
     bon:'我没把作业写完。',why:'La négation se place devant 把, jamais devant le verbe.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'一本',p:'yì běn'},{h:'书',p:'shū'},{h:'看',p:'kàn'},{h:'完',p:'wán'},{h:'了',p:'le'},P('。')],bad:2,
     bon:'我把这本书看完了。',why:'L’objet d’une phrase en 把 doit être déterminé : un livre quelconque n’a pas de sort à raconter.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'他',p:'tā'},{h:'看',p:'kàn'},{h:'见',p:'jiàn'},{h:'了',p:'le'},P('。')],bad:1,
     bon:'我看见他了。',why:'把 refuse les verbes de perception : le regard ne fait rien subir à son objet.'},
    {seg:[{h:'我',p:'wǒ'},{h:'把',p:'bǎ'},{h:'吃',p:'chī'},{h:'了',p:'le'},{h:'那个',p:'nà ge'},{h:'面包',p:'miàn bāo'},P('。')],bad:2,
     bon:'我把那个面包吃了。',why:'Dans le moule 把, l’objet vient avant le verbe, jamais après.'},
    {seg:[{h:'请',p:'qǐng'},{h:'门',p:'mén'},{h:'把',p:'bǎ'},{h:'关',p:'guān'},{h:'上',p:'shang'},P('。')],bad:1,
     bon:'请把门关上。',why:'把 précède l’objet : c’est lui qui l’avance devant le verbe.'}
  ],

  reemploi:[
    {q:'Vous rangez la pièce. Dites où vous posez deux objets, avec 把.',
     verif:[{type:'contient',v:'把',msg:'On attend la construction en 把.'},
            {type:'contient',v:'在',msg:'Le verbe doit être suivi d’un complément de lieu : 在 ou 到.'}],
     modeles:[{hz:'我把书放在桌子上，把手机放在这儿。',py:'wǒ bǎ shū fàng zài zhuō zi shang, bǎ shǒu jī fàng zài zhèr',fr:'Je pose le livre sur la table et le téléphone ici.'},
              {hz:'请把咖啡放在桌子上。',py:'qǐng bǎ kā fēi fàng zài zhuō zi shang',fr:'Pose le café sur la table.'}],
     criteres:['把 précède l’objet, qui précède le verbe','Le verbe est suivi d’un complément de lieu','L’objet est déterminé, non un objet quelconque']},
    {q:'Dites une chose que vous avez terminée aujourd’hui, avec 把 et un complément de résultat.',
     verif:[{type:'contient',v:'把',msg:'On attend la construction en 把.'},
            {type:'contient',v:'完',msg:'L’achèvement demande le résultat 完.'}],
     modeles:[{hz:'我把作业写完了。',py:'wǒ bǎ zuò yè xiě wán le',fr:'J’ai fini mes devoirs.'},
              {hz:'今天我把这本书看完了。',py:'jīn tiān wǒ bǎ zhè běn shū kàn wán le',fr:'Aujourd’hui j’ai fini ce livre.'}],
     criteres:['把 avance l’objet devant le verbe','完 est collé au verbe','了 vient après le bloc verbe + résultat']},
    {q:'Dites ce que vous n’avez pas réussi à finir, avec 把 à la forme négative.',
     verif:[{type:'contient',v:'把',msg:'On attend la construction en 把.'},
            {type:'contient',v:'没',msg:'La négation se fait avec 没, placé devant 把.'},
            {type:'absent',v:'了',msg:'À la forme négative, 了 disparaît.'}],
     modeles:[{hz:'我没把工作做完。',py:'wǒ méi bǎ gōng zuò zuò wán',fr:'Je n’ai pas fini mon travail.'},
              {hz:'昨天我没把这本书看完。',py:'zuó tiān wǒ méi bǎ zhè běn shū kàn wán',fr:'Hier, je n’ai pas fini ce livre.'}],
     criteres:['没 se place devant 把','Le complément de résultat reste en place','了 a disparu']}
  ]
},

/* ------------------------------------------------------------------ */
{
  id:'g308', hsk:3, fam:'verbe', th:['quotidien','logement'],
  title:'Les compléments de direction : 来, 去 et les composés',
  resume:'Le chinois ne dit pas seulement l’action : il ajoute le trajet qu’elle suit, et le point de vue depuis lequel on la regarde.',

  steps:[
    {
      t:'来 et 去 — où se tient celui qui parle',
      p:[
        'Le français dit « entrer » et s’arrête là. Le chinois demande une chose de plus : le mouvement vient-il <b>vers celui qui parle</b>, ou s’en éloigne-t-il ?',
        '<b>来</b> marque le mouvement qui se rapproche du locuteur, <b>去</b> celui qui s’en éloigne. Ils se collent derrière le trajet.'
      ],
      ex:[
        {hz:'他进来了。',py:'tā jìn lái le',fr:'Il est entré.',
         note:'Je suis dans la pièce : il vient vers moi.'},
        {hz:'他进去了。',py:'tā jìn qù le',fr:'Il est entré.',
         note:'Je suis dehors : il s’éloigne de moi. Le français ne fait pas cette différence.'}
      ],
      check:{q:'Vous êtes dans le bureau, votre collègue y entre. Vous dites :',
             a:['他进去了。','他进来了。'],ok:1,
             why:'Le mouvement vient vers vous : c’est 来.'}
    },
    {
      t:'Les sept trajets',
      p:[
        'Sept caractères disent le trajet : <b>进</b> entrer, <b>出</b> sortir, <b>上</b> monter, <b>下</b> descendre, <b>回</b> rentrer, <b>过</b> passer, <b>起</b> se lever.',
        'Chacun se combine avec 来 ou 去 : il n’y a pas quatorze mots à mémoriser, mais un trajet à choisir puis un point de vue. Seul <b>起</b> fait exception : il n’admet que 来.'
      ],
      ex:[
        {hz:'我回来了。',py:'wǒ huí lái le',fr:'Je suis rentrée.',
         note:'Ce qu’on dit en franchissant sa propre porte.'},
        {hz:'他上去了。',py:'tā shàng qù le',fr:'Il est monté.',
         note:'Je reste en bas : il s’éloigne.'},
        {hz:'她站起来了。',py:'tā zhàn qǐ lái le',fr:'Elle s’est levée.',
         note:'起 ne se combine jamais avec 去.'}
      ],
      check:{q:'Peut-on dire 起去 ?',a:['Oui, comme 上去','Non, 起 n’admet que 来'],ok:1,
             why:'起 est le seul trajet à ne connaître qu’une seule combinaison : 起来.'}
    },
    {
      t:'Greffer le trajet sur un verbe d’action',
      p:[
        'Jusqu’ici le verbe disait déjà le déplacement. Mais le trajet peut se greffer sur n’importe quel verbe d’action : <b>verbe + trajet + 来/去</b>.',
        'Trois informations en un seul bloc : le verbe dit ce qu’on fait, le trajet dit où cela va, 来/去 dit de quel côté on se tient.'
      ],
      ex:[
        {hz:'他拿出来一本书。',py:'tā ná chū lái yì běn shū',fr:'Il a sorti un livre.',
         note:'拿 l’action, 出 le trajet, 来 le point de vue : le livre vient vers moi.'},
        {hz:'我带回来一些水果。',py:'wǒ dài huí lái yì xiē shuǐ guǒ',fr:'J’ai rapporté des fruits.'},
        {hz:'他走进来了。',py:'tā zǒu jìn lái le',fr:'Il est entré.',
         note:'走 précise qu’il est entré à pied, sans se presser.'}
      ],
      check:{q:'Dans 拿出来, que dit 出 ?',a:['l’action','le trajet'],ok:1,
             why:'拿 dit l’action, 出 dit le trajet, 来 dit le point de vue.'}
    },
    {
      t:'La place de l’objet',
      p:[
        'Un objet qui désigne une <b>chose</b> a deux places possibles : après le bloc entier, ou à l’intérieur, juste avant 来/去. 拿出来一本书 et 拿出一本书来 se disent aussi bien l’un que l’autre.',
        'Un objet qui désigne un <b>lieu</b> n’a pas le choix : il se place toujours <b>avant 来/去</b>. C’est le point que le français fait rater, parce qu’il place le lieu à la fin.'
      ],
      ex:[
        {hz:'他拿出一本书来。',py:'tā ná chū yì běn shū lái',fr:'Il a sorti un livre.',
         note:'Même phrase que 拿出来一本书, l’objet ayant simplement changé de place.'},
        {hz:'他走进教室来了。',py:'tā zǒu jìn jiào shì lái le',fr:'Il est entré dans la salle de classe.',
         note:'教室 est un lieu : il se glisse obligatoirement avant 来.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他走进来教室了。','他走进教室来了。'],ok:1,
             why:'Un objet de lieu se place toujours avant 来 ou 去, jamais après.'}
    },
    {
      t:'La négation et le 了',
      p:[
        '<b>了</b> se place après le bloc entier, jamais à l’intérieur : 他进来<b>了</b>, et non 他进了来.',
        'La négation se fait avec <b>没</b>, posé devant le verbe — donc devant tout le bloc — et le 了 disparaît, comme partout ailleurs.'
      ],
      ex:[
        {hz:'他没回来。',py:'tā méi huí lái',fr:'Il n’est pas rentré.',
         note:'没 devant le bloc, et plus de 了.'},
        {hz:'我没带回来水果。',py:'wǒ méi dài huí lái shuǐ guǒ',fr:'Je n’ai pas rapporté de fruits.'}
      ],
      check:{q:'Où se place 了 ?',a:['他进了来。','他进来了。'],ok:1,
             why:'了 vient après le bloc complet : le trajet et le point de vue ne se séparent pas.'}
    },
    {
      t:'Ce que le français fond, le chinois l’articule',
      p:[
        'Le français a un verbe unique pour chaque trajet — entrer, sortir, monter, rapporter — et ne dit ni comment ni de quel côté. Le chinois articule toujours les trois.',
        'Conséquence directe : un trajet ne se tient jamais seul devant un objet. 他出书 ne veut rien dire ; il faut un verbe d’action devant, 他拿出来一本书.',
        'À ne pas confondre avec le complément de résultat de la fiche précédente : 看完 dit que la lecture est <b>achevée</b>, 拿出来 dit que la chose a <b>bougé</b>.'
      ],
      ex:[
        {hz:'他拿出来一本书。',py:'tā ná chū lái yì běn shū',fr:'Il a sorti un livre.',
         note:'拿 porte l’action ; 出来 ne fait que dire où elle mène.'},
        {hz:'他看完了那本书。',py:'tā kàn wán le nà běn shū',fr:'Il a fini ce livre.',
         note:'完 est un résultat, pas un trajet : rien n’a bougé.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他出一本书。','他拿出一本书来。'],ok:1,
             why:'Le trajet 出 ne peut pas porter l’action tout seul : il lui faut un verbe devant.'}
    }
  ],

  tableau:{
    cols:['Trajet','Vers celui qui parle','Loin de celui qui parle'],
    rows:[
      ['进 entrer','进来','进去'],
      ['出 sortir','出来','出去'],
      ['上 monter','上来','上去'],
      ['下 descendre','下来','下去'],
      ['回 rentrer','回来','回去'],
      ['过 passer','过来','过去'],
      ['起 se lever','起来','—']
    ]
  },

  piege:{
    bad:{hz:'他走进来教室了。',py:'tā zǒu jìn lái jiào shì le'},
    good:{hz:'他走进教室来了。',py:'tā zǒu jìn jiào shì lái le'},
    why:'Le français place le lieu à la fin — « il est entré dans la salle » — et l’on transpose sans y penser. En chinois, un objet de lieu se glisse toujours à l’intérieur du bloc, avant 来 ou 去.'
  },

  voir:['g306','g307'],

  banque:[
    {seg:[{h:'他',p:'tā'},{h:'进来',p:'jìn lái'},{h:'了',p:'le'},P('。')],cle:1,fr:'Il est entré (il vient vers moi).'},
    {seg:[{h:'他',p:'tā'},{h:'进去',p:'jìn qù'},{h:'了',p:'le'},P('。')],cle:1,fr:'Il est entré (il s’éloigne de moi).'},
    {seg:[{h:'我',p:'wǒ'},{h:'回来',p:'huí lái'},{h:'了',p:'le'},P('。')],cle:1,fr:'Je suis rentrée.'},
    {seg:[{h:'他',p:'tā'},{h:'拿',p:'ná'},{h:'出来',p:'chū lái'},{h:'一本',p:'yì běn'},{h:'书',p:'shū'},P('。')],cle:2,fr:'Il a sorti un livre.'},
    {seg:[{h:'我',p:'wǒ'},{h:'带',p:'dài'},{h:'回来',p:'huí lái'},{h:'一些',p:'yì xiē'},{h:'水果',p:'shuǐ guǒ'},P('。')],cle:2,fr:'J’ai rapporté des fruits.'},
    {seg:[{h:'他',p:'tā'},{h:'走',p:'zǒu'},{h:'进',p:'jìn'},{h:'教室',p:'jiào shì'},{h:'来',p:'lái'},{h:'了',p:'le'},P('。')],cle:4,fr:'Il est entré dans la salle de classe.'},
    {seg:[{h:'他',p:'tā'},{h:'拿',p:'ná'},{h:'出',p:'chū'},{h:'一本',p:'yì běn'},{h:'书',p:'shū'},{h:'来',p:'lái'},P('。')],cle:5,fr:'Il a sorti un livre.'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'回来',p:'huí lái'},P('。')],cle:2,fr:'Il n’est pas rentré.'},
    {seg:[{h:'请',p:'qǐng'},{h:'拿',p:'ná'},{h:'过来',p:'guò lái'},P('。')],cle:2,fr:'Apporte-le ici, s’il te plaît.'},
    {seg:[{h:'他',p:'tā'},{h:'从',p:'cóng'},{h:'楼上',p:'lóu shàng'},{h:'下来',p:'xià lái'},{h:'了',p:'le'},P('。')],cle:3,fr:'Il est descendu de l’étage.'},
    {seg:[{h:'她',p:'tā'},{h:'站',p:'zhàn'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],cle:2,fr:'Elle s’est levée.'},
    {seg:[{h:'老师',p:'lǎo shī'},{h:'走',p:'zǒu'},{h:'出去',p:'chū qù'},{h:'了',p:'le'},P('。')],cle:2,fr:'Le professeur est sorti.'},
    {seg:[{h:'你',p:'nǐ'},{h:'什么时候',p:'shén me shí hou'},{h:'回去',p:'huí qù'},P('？')],cle:2,fr:'Quand repars-tu ?'},
    {seg:[{h:'他',p:'tā'},{h:'搬',p:'bān'},{h:'进来',p:'jìn lái'},{h:'了',p:'le'},{h:'一张',p:'yì zhāng'},{h:'桌子',p:'zhuō zi'},P('。')],cle:2,fr:'Il a rentré une table.'}
  ],
  leurres:['来','去','进','出','回','过','上','下'],

  gabarits:[
    {cadre:[{h:'他',p:'tā'},{s:'d'},{h:'了',p:'le'},P('。')],
     fr:'Il est …',
     listes:{d:[{h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},{h:'进去',p:'jìn qù',fr:'à l’intérieur, loin de moi'},
                {h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'出去',p:'chū qù',fr:'dehors, loin de moi'},
                {h:'上来',p:'shàng lái',fr:'en haut, vers moi'},{h:'上去',p:'shàng qù',fr:'en haut, loin de moi'},
                {h:'下来',p:'xià lái',fr:'en bas, vers moi'},{h:'下去',p:'xià qù',fr:'en bas, loin de moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回去',p:'huí qù',fr:'de retour là-bas'},
                {h:'过来',p:'guò lái',fr:'jusqu’ici'},{h:'过去',p:'guò qù',fr:'jusque là-bas'}]}},

    {cadre:[{s:'s'},{s:'v'},{s:'d'},{h:'了',p:'le'},{s:'o'},P('。')],
     fr:'… a … …', lie:[['v','d','o']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'带',p:'dài',fr:'apporter'},{h:'带',p:'dài',fr:'apporter'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'买',p:'mǎi',fr:'acheter'},
                {h:'搬',p:'bān',fr:'déplacer'},{h:'搬',p:'bān',fr:'déplacer'},
                {h:'送',p:'sòng',fr:'porter'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'带',p:'dài',fr:'apporter'},{h:'拿',p:'ná',fr:'prendre'}],
             d:[{h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'出来',p:'chū lái',fr:'dehors, vers moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回来',p:'huí lái',fr:'de retour ici'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回来',p:'huí lái',fr:'de retour ici'},
                {h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},{h:'出去',p:'chū qù',fr:'dehors, loin de moi'},
                {h:'过来',p:'guò lái',fr:'jusqu’ici'},{h:'过来',p:'guò lái',fr:'jusqu’ici'},
                {h:'过去',p:'guò qù',fr:'jusque là-bas'},{h:'上来',p:'shàng lái',fr:'en haut, vers moi'}],
             o:[{h:'一本书',p:'yì běn shū',fr:'un livre'},{h:'手机',p:'shǒu jī',fr:'le téléphone'},
                {h:'一些水果',p:'yì xiē shuǐ guǒ',fr:'des fruits'},{h:'一个礼物',p:'yí ge lǐ wù',fr:'un cadeau'},
                {h:'一些面包',p:'yì xiē miàn bāo',fr:'du pain'},{h:'一杯咖啡',p:'yì bēi kā fēi',fr:'un café'},
                {h:'一张桌子',p:'yì zhāng zhuō zi',fr:'une table'},{h:'那张桌子',p:'nà zhāng zhuō zi',fr:'cette table'},
                {h:'一些蛋糕',p:'yì xiē dàn gāo',fr:'du gâteau'},{h:'一杯水',p:'yì bēi shuǐ',fr:'un verre d’eau'},
                {h:'一些照片',p:'yì xiē zhào piàn',fr:'des photos'},{h:'一些衣服',p:'yì xiē yī fu',fr:'des vêtements'}]}},

    {cadre:[{s:'s'},{s:'v'},{s:'d'},{s:'o'},{s:'w'},P('。')],
     fr:'… a … … (objet à l’intérieur du bloc)', lie:[['v','d','o','w']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'带',p:'dài',fr:'apporter'},{h:'带',p:'dài',fr:'apporter'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'买',p:'mǎi',fr:'acheter'},
                {h:'搬',p:'bān',fr:'déplacer'},{h:'送',p:'sòng',fr:'porter'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'带',p:'dài',fr:'apporter'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'}],
             d:[{h:'出',p:'chū',fr:'dehors'},{h:'出',p:'chū',fr:'dehors'},
                {h:'回',p:'huí',fr:'de retour'},{h:'回',p:'huí',fr:'de retour'},
                {h:'回',p:'huí',fr:'de retour'},{h:'回',p:'huí',fr:'de retour'},
                {h:'进',p:'jìn',fr:'à l’intérieur'},{h:'过',p:'guò',fr:'de côté'},
                {h:'过',p:'guò',fr:'de côté'},{h:'过',p:'guò',fr:'de côté'},
                {h:'上',p:'shàng',fr:'en haut'},{h:'下',p:'xià',fr:'en bas'}],
             o:[{h:'一本书',p:'yì běn shū',fr:'un livre'},{h:'手机',p:'shǒu jī',fr:'le téléphone'},
                {h:'一些水果',p:'yì xiē shuǐ guǒ',fr:'des fruits'},{h:'一个礼物',p:'yí ge lǐ wù',fr:'un cadeau'},
                {h:'一些面包',p:'yì xiē miàn bāo',fr:'du pain'},{h:'一杯咖啡',p:'yì bēi kā fēi',fr:'un café'},
                {h:'一些东西',p:'yì xiē dōng xi',fr:'des affaires'},{h:'一些蛋糕',p:'yì xiē dàn gāo',fr:'du gâteau'},
                {h:'一杯水',p:'yì bēi shuǐ',fr:'un verre d’eau'},{h:'一些照片',p:'yì xiē zhào piàn',fr:'des photos'},
                {h:'一些衣服',p:'yì xiē yī fu',fr:'des vêtements'},{h:'一些书',p:'yì xiē shū',fr:'des livres'}],
             w:[{h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'去',p:'qù',fr:'loin de moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'}]}},

    {cadre:[{s:'s'},{s:'v'},{s:'d'},{s:'l'},{s:'w'},{h:'了',p:'le'},P('。')],
     fr:'… est … dans / vers …', lie:[['v','d','l','w']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'走',p:'zǒu',fr:'à pied'},{h:'走',p:'zǒu',fr:'à pied'},
                {h:'走',p:'zǒu',fr:'à pied'},{h:'跑',p:'pǎo',fr:'en courant'},
                {h:'跑',p:'pǎo',fr:'en courant'},{h:'走',p:'zǒu',fr:'à pied'},
                {h:'跑',p:'pǎo',fr:'en courant'},{h:'走',p:'zǒu',fr:'à pied'},
                {h:'走',p:'zǒu',fr:'à pied'},{h:'跑',p:'pǎo',fr:'en courant'},
                {h:'走',p:'zǒu',fr:'à pied'},{h:'跑',p:'pǎo',fr:'en courant'}],
             d:[{h:'进',p:'jìn',fr:'à l’intérieur'},{h:'进',p:'jìn',fr:'à l’intérieur'},
                {h:'出',p:'chū',fr:'dehors'},{h:'进',p:'jìn',fr:'à l’intérieur'},
                {h:'出',p:'chū',fr:'dehors'},{h:'回',p:'huí',fr:'de retour'},
                {h:'回',p:'huí',fr:'de retour'},{h:'上',p:'shàng',fr:'en haut'},
                {h:'下',p:'xià',fr:'en bas'},{h:'上',p:'shàng',fr:'en haut'},
                {h:'进',p:'jìn',fr:'à l’intérieur'},{h:'回',p:'huí',fr:'de retour'}],
             l:[{h:'教室',p:'jiào shì',fr:'la salle de classe'},{h:'房间',p:'fáng jiān',fr:'la chambre'},
                {h:'教室',p:'jiào shì',fr:'la salle de classe'},{h:'房间',p:'fáng jiān',fr:'la chambre'},
                {h:'房间',p:'fáng jiān',fr:'la chambre'},{h:'家',p:'jiā',fr:'la maison'},
                {h:'家',p:'jiā',fr:'la maison'},{h:'楼',p:'lóu',fr:'l’étage'},
                {h:'楼',p:'lóu',fr:'l’étage'},{h:'楼',p:'lóu',fr:'l’étage'},
                {h:'学校',p:'xué xiào',fr:'l’école'},{h:'学校',p:'xué xiào',fr:'l’école'}],
             w:[{h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'去',p:'qù',fr:'loin de moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'去',p:'qù',fr:'loin de moi'},{h:'去',p:'qù',fr:'loin de moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'去',p:'qù',fr:'loin de moi'},{h:'去',p:'qù',fr:'loin de moi'},
                {h:'去',p:'qù',fr:'loin de moi'},{h:'去',p:'qù',fr:'loin de moi'}]}},

    {cadre:[{s:'s'},{h:'没',p:'méi'},{s:'v'},{s:'d'},{s:'o'},P('。')],
     fr:'… n’a pas … …', lie:[['v','d','o']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'带',p:'dài',fr:'apporter'},{h:'带',p:'dài',fr:'apporter'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'买',p:'mǎi',fr:'acheter'},
                {h:'搬',p:'bān',fr:'déplacer'},{h:'送',p:'sòng',fr:'porter'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'带',p:'dài',fr:'apporter'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'}],
             d:[{h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回来',p:'huí lái',fr:'de retour ici'},
                {h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'出来',p:'chū lái',fr:'dehors, vers moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回来',p:'huí lái',fr:'de retour ici'},
                {h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},{h:'过来',p:'guò lái',fr:'jusqu’ici'},
                {h:'过来',p:'guò lái',fr:'jusqu’ici'},{h:'过去',p:'guò qù',fr:'jusque là-bas'},
                {h:'上来',p:'shàng lái',fr:'en haut, vers moi'},{h:'下来',p:'xià lái',fr:'en bas, vers moi'}],
             o:[{h:'水果',p:'shuǐ guǒ',fr:'de fruits'},{h:'礼物',p:'lǐ wù',fr:'de cadeau'},
                {h:'手机',p:'shǒu jī',fr:'le téléphone'},{h:'词典',p:'cí diǎn',fr:'le dictionnaire'},
                {h:'面包',p:'miàn bāo',fr:'de pain'},{h:'咖啡',p:'kā fēi',fr:'de café'},
                {h:'桌子',p:'zhuō zi',fr:'la table'},{h:'蛋糕',p:'dàn gāo',fr:'de gâteau'},
                {h:'水',p:'shuǐ',fr:'d’eau'},{h:'照片',p:'zhào piàn',fr:'de photos'},
                {h:'衣服',p:'yī fu',fr:'de vêtements'},{h:'书',p:'shū',fr:'de livres'}]}},

    {cadre:[{s:'s'},{s:'d'},{h:'了',p:'le'},{h:'吗',p:'ma'},P('？')],
     fr:'Est-ce que … est … ?', lie:[], libre:['s','d'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'你朋友',p:'nǐ péng you',fr:'ton amie'}],
             d:[{h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},{h:'进去',p:'jìn qù',fr:'à l’intérieur, loin de moi'},
                {h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'出去',p:'chū qù',fr:'dehors, loin de moi'},
                {h:'上来',p:'shàng lái',fr:'en haut, vers moi'},{h:'上去',p:'shàng qù',fr:'en haut, loin de moi'},
                {h:'下来',p:'xià lái',fr:'en bas, vers moi'},{h:'下去',p:'xià qù',fr:'en bas, loin de moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回去',p:'huí qù',fr:'de retour là-bas'},
                {h:'过来',p:'guò lái',fr:'jusqu’ici'},{h:'过去',p:'guò qù',fr:'jusque là-bas'}]}},

    {cadre:[{h:'请',p:'qǐng'},{s:'v'},{s:'d'},{s:'o'},{s:'w'},P('。')],
     fr:'S’il te plaît, … …', lie:[['v','d','o','w']],
     listes:{v:[{h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'带',p:'dài',fr:'apporter'},{h:'送',p:'sòng',fr:'porter'},
                {h:'搬',p:'bān',fr:'déplacer'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'拿',p:'ná',fr:'prendre'},{h:'带',p:'dài',fr:'apporter'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'送',p:'sòng',fr:'porter'},{h:'带',p:'dài',fr:'apporter'}],
             d:[{h:'出',p:'chū',fr:'dehors'},{h:'过',p:'guò',fr:'de côté'},
                {h:'回',p:'huí',fr:'de retour'},{h:'过',p:'guò',fr:'de côté'},
                {h:'进',p:'jìn',fr:'à l’intérieur'},{h:'上',p:'shàng',fr:'en haut'},
                {h:'下',p:'xià',fr:'en bas'},{h:'过',p:'guò',fr:'de côté'},
                {h:'回',p:'huí',fr:'de retour'},{h:'出',p:'chū',fr:'dehors'},
                {h:'过',p:'guò',fr:'de côté'},{h:'回',p:'huí',fr:'de retour'}],
             o:[{h:'你的书',p:'nǐ de shū',fr:'ton livre'},{h:'那本词典',p:'nà běn cí diǎn',fr:'ce dictionnaire'},
                {h:'一些水果',p:'yì xiē shuǐ guǒ',fr:'des fruits'},{h:'这些照片',p:'zhè xiē zhào piàn',fr:'ces photos'},
                {h:'那张桌子',p:'nà zhāng zhuō zi',fr:'cette table'},{h:'我的衣服',p:'wǒ de yī fu',fr:'mes vêtements'},
                {h:'那本书',p:'nà běn shū',fr:'ce livre'},{h:'你的电脑',p:'nǐ de diàn nǎo',fr:'ton ordinateur'},
                {h:'一些面包',p:'yì xiē miàn bāo',fr:'du pain'},{h:'这些东西',p:'zhè xiē dōng xi',fr:'ces affaires'},
                {h:'一杯水',p:'yì bēi shuǐ',fr:'un verre d’eau'},{h:'这些礼物',p:'zhè xiē lǐ wù',fr:'ces cadeaux'}],
             w:[{h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'去',p:'qù',fr:'loin de moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'来',p:'lái',fr:'vers moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'去',p:'qù',fr:'loin de moi'},
                {h:'来',p:'lái',fr:'vers moi'},{h:'去',p:'qù',fr:'loin de moi'}]}},

    {cadre:[{s:'s'},{h:'从',p:'cóng'},{s:'l'},{s:'d'},{h:'了',p:'le'},P('。')],
     fr:'… est … de …', lie:[['l','d']], libre:['s'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             l:[{h:'楼上',p:'lóu shàng',fr:'l’étage'},{h:'楼下',p:'lóu xià',fr:'le bas'},
                {h:'房间',p:'fáng jiān',fr:'la chambre'},{h:'教室',p:'jiào shì',fr:'la salle de classe'},
                {h:'学校',p:'xué xiào',fr:'l’école'},{h:'中国',p:'Zhōng guó',fr:'Chine'},
                {h:'北京',p:'Běi jīng',fr:'Pékin'},{h:'家',p:'jiā',fr:'la maison'},
                {h:'楼上',p:'lóu shàng',fr:'l’étage'},{h:'外面',p:'wài miàn',fr:'dehors'},
                {h:'那边',p:'nà biān',fr:'là-bas'},{h:'法国',p:'Fǎ guó',fr:'France'}],
             d:[{h:'下来',p:'xià lái',fr:'en bas, vers moi'},{h:'上来',p:'shàng lái',fr:'en haut, vers moi'},
                {h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'出来',p:'chū lái',fr:'dehors, vers moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'回来',p:'huí lái',fr:'de retour ici'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'出来',p:'chū lái',fr:'dehors, vers moi'},
                {h:'下去',p:'xià qù',fr:'en bas, loin de moi'},{h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},
                {h:'过来',p:'guò lái',fr:'jusqu’ici'},{h:'回来',p:'huí lái',fr:'de retour ici'}]}}
  ],

  transfo:[
    {consigne:'Changez le point de vue : vous êtes maintenant à l’extérieur',
     de:{hz:'他进来了。',py:'tā jìn lái le',fr:'Il est entré (vers moi).'},
     vers:{seg:[{h:'他',p:'tā'},{h:'进去',p:'jìn qù'},{h:'了',p:'le'},P('。')],fr:'Il est entré (loin de moi).'}},
    {consigne:'Ajoutez l’objet 一本书 après le bloc',
     de:{hz:'他拿出来了。',py:'tā ná chū lái le',fr:'Il l’a sorti.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'拿',p:'ná'},{h:'出来',p:'chū lái'},{h:'了',p:'le'},{h:'一本书',p:'yì běn shū'},P('。')],fr:'Il a sorti un livre.'}},
    {consigne:'Replacez l’objet à l’intérieur du bloc',
     de:{hz:'他拿出来一本书。',py:'tā ná chū lái yì běn shū',fr:'Il a sorti un livre.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'拿',p:'ná'},{h:'出',p:'chū'},{h:'一本书',p:'yì běn shū'},{h:'来',p:'lái'},P('。')],fr:'Il a sorti un livre.'}},
    {consigne:'Mettez à la forme négative',
     de:{hz:'他带回来了水果。',py:'tā dài huí lái le shuǐ guǒ',fr:'Il a rapporté des fruits.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'带',p:'dài'},{h:'回来',p:'huí lái'},{h:'水果',p:'shuǐ guǒ'},P('。')],fr:'Il n’a pas rapporté de fruits.'}},
    {consigne:'Ajoutez le lieu 教室, à sa place obligatoire',
     de:{hz:'他走进来了。',py:'tā zǒu jìn lái le',fr:'Il est entré.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'走',p:'zǒu'},{h:'进',p:'jìn'},{h:'教室',p:'jiào shì'},{h:'来',p:'lái'},{h:'了',p:'le'},P('。')],fr:'Il est entré dans la salle de classe.'}},
    {consigne:'Posez la question avec 吗',
     de:{hz:'他回来了。',py:'tā huí lái le',fr:'Il est rentré.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'回来',p:'huí lái'},{h:'了',p:'le'},{h:'吗',p:'ma'},P('？')],fr:'Est-il rentré ?'}}
  ],

  fixes:[
    {seg:[{h:'他',p:'tā'},{h:'走',p:'zǒu'},{h:'进',p:'jìn'},{h:'来',p:'lái'},{h:'教室',p:'jiào shì'},{h:'了',p:'le'},P('。')],bad:3,
     bon:'他走进教室来了。',why:'Un objet de lieu se place toujours avant 来 ou 去, jamais après.'},
    {seg:[{h:'他',p:'tā'},{h:'进',p:'jìn'},{h:'了',p:'le'},{h:'来',p:'lái'},P('。')],bad:2,
     bon:'他进来了。',why:'了 vient après le bloc entier : le trajet et le point de vue ne se séparent pas.'},
    {seg:[{h:'他',p:'tā'},{h:'没',p:'méi'},{h:'回来',p:'huí lái'},{h:'了',p:'le'},P('。')],bad:3,
     bon:'他没回来。',why:'Avec 没, le 了 disparaît.'},
    {seg:[{h:'她',p:'tā'},{h:'站',p:'zhàn'},{h:'起',p:'qǐ'},{h:'去',p:'qù'},{h:'了',p:'le'},P('。')],bad:3,
     bon:'她站起来了。',why:'起 est le seul trajet à n’admettre que 来.'},
    {seg:[{h:'他',p:'tā'},{h:'出',p:'chū'},{h:'一本书',p:'yì běn shū'},P('。')],bad:1,
     bon:'他拿出一本书来。',why:'Un trajet ne porte pas l’action tout seul : il lui faut un verbe devant.'},
    {seg:[{h:'我',p:'wǒ'},{h:'带',p:'dài'},{h:'回来',p:'huí lái'},{h:'没',p:'méi'},{h:'水果',p:'shuǐ guǒ'},P('。')],bad:3,
     bon:'我没带回来水果。',why:'没 se place devant le verbe, donc devant tout le bloc.'}
  ],

  reemploi:[
    {q:'Vous êtes dans votre bureau, un collègue frappe. Faites-le entrer, puis racontez qu’il est entré.',
     verif:[{type:'contient',v:'进',msg:'On attend le trajet 进.'},
            {type:'contient',v:'来',msg:'Le mouvement vient vers vous : c’est 来.'},
            {type:'absent',v:'进去',msg:'进去 s’éloignerait de vous : vous êtes dans le bureau.'}],
     modeles:[{hz:'请进来。',py:'qǐng jìn lái',fr:'Entrez.'},
              {hz:'他走进来了。',py:'tā zǒu jìn lái le',fr:'Il est entré.'}],
     criteres:['来 et non 去, puisque vous êtes à l’intérieur','了 se place après le bloc','Le verbe d’action peut précéder le trajet']},
    {q:'Vous rentrez du marché. Dites ce que vous avez rapporté, puis ce que vous avez oublié.',
     verif:[{type:'contient',v:'回来',msg:'Le retour à la maison demande 回来.'},
            {type:'un_parmi',v:['带','买'],msg:'On attend un verbe d’action devant le trajet : 带 ou 买.'},
            {type:'contient',v:'没',msg:'L’oubli demande la forme négative avec 没.'}],
     modeles:[{hz:'我带回来一些水果，可是我没买回来面包。',py:'wǒ dài huí lái yì xiē shuǐ guǒ, kě shì wǒ méi mǎi huí lái miàn bāo',fr:'J’ai rapporté des fruits, mais je n’ai pas rapporté de pain.'}],
     criteres:['Le verbe d’action précède le trajet','没 est devant le verbe, pas dans le bloc','Aucun 了 après 没']},
    {q:'Décrivez quelqu’un qui entre dans une salle de classe, en nommant le lieu.',
     verif:[{type:'contient',v:'进',msg:'On attend le trajet 进.'},
            {type:'un_parmi',v:['来','去'],msg:'Il faut préciser le point de vue : 来 ou 去.'},
            {type:'absent',v:'进来教室',msg:'Le lieu ne peut pas suivre 来 : il se place avant.'},
            {type:'absent',v:'进去教室',msg:'Le lieu ne peut pas suivre 去 : il se place avant.'}],
     modeles:[{hz:'他走进教室来了。',py:'tā zǒu jìn jiào shì lái le',fr:'Il est entré dans la salle de classe.'},
              {hz:'老师走进教室去了。',py:'lǎo shī zǒu jìn jiào shì qù le',fr:'Le professeur est entré dans la salle.'}],
     criteres:['Le lieu est entre le trajet et 来/去','Le point de vue est cohérent avec l’endroit où vous êtes','了 ferme la phrase']}
  ]
}
,

/* ------------------------------------------------------------------ */
{
  id:'g309', hsk:3, fam:'verbe', th:['decrire','quotidien'],
  title:'起来 au sens figuré : 看起来, 说起来, 想起来',
  resume:'Le même 起来 qui fait lever un corps sert aussi à juger d’une apparence, à retrouver un souvenir, à éprouver une chose en s’y mettant, ou à dire qu’une action se déclenche.',

  steps:[
    {
      t:'Rappel du sens propre',
      p:[
        'Dans la fiche précédente, <b>起来</b> disait un mouvement réel vers le haut : 站起来, se lever ; 拿起来, ramasser.',
        'C’est de ce sens que dérivent tous les autres. Ce qui monte, dans les emplois figurés, ce n’est plus un corps : c’est une impression, un souvenir, une action qui démarre.'
      ],
      ex:[
        {hz:'她站起来了。',py:'tā zhàn qǐ lái le',fr:'Elle s’est levée.',
         note:'Sens propre : le corps monte.'},
        {hz:'他把书拿起来了。',py:'tā bǎ shū ná qǐ lái le',fr:'Il a ramassé le livre.'}
      ],
      check:{q:'Dans 站起来, 起来 dit :',a:['une impression','un mouvement réel vers le haut'],ok:1,
             why:'C’est le sens propre, dont tous les emplois figurés dérivent.'}
    },
    {
      t:'看起来, 听起来 — juger d’une apparence',
      p:[
        '<b>看起来</b> introduit un jugement fondé sur ce qu’on voit : « à le voir, on dirait que… ». <b>听起来</b> fait de même pour ce qu’on entend.',
        'Ce qui suit se construit comme une phrase d’adjectif ordinaire, avec 很 devant : 看起来<b>很</b>累.'
      ],
      ex:[
        {hz:'他看起来很累。',py:'tā kàn qǐ lái hěn lèi',fr:'Il a l’air fatigué.',
         note:'Je ne dis pas qu’il est fatigué : je dis ce que son apparence donne à penser.'},
        {hz:'这个名字听起来很好听。',py:'zhè ge míng zi tīng qǐ lái hěn hǎo tīng',fr:'Ce nom sonne joliment.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['他看起来累。','他看起来很累。'],ok:1,
             why:'Comme partout, l’adjectif attribut demande un adverbe : 很.'}
    },
    {
      t:'想起来 — le souvenir qui remonte',
      p:[
        '<b>想</b> seul veut dire penser, ou vouloir. <b>想起来</b> dit tout autre chose : un souvenir qu’on avait perdu remonte à la surface.',
        'L’objet se place après le bloc, ou à l’intérieur juste avant 来, exactement comme pour les compléments de direction.'
      ],
      ex:[
        {hz:'我想起来了。',py:'wǒ xiǎng qǐ lái le',fr:'Ça y est, je me rappelle.'},
        {hz:'我想起来他的名字了。',py:'wǒ xiǎng qǐ lái tā de míng zi le',fr:'Je me suis rappelé son nom.'},
        {hz:'我想起他的名字来了。',py:'wǒ xiǎng qǐ tā de míng zi lái le',fr:'Je me suis rappelé son nom.',
         note:'Même phrase, l’objet ayant seulement changé de place.'}
      ],
      check:{q:'我想他 veut dire :',a:['je me souviens de lui','il me manque, je pense à lui'],ok:1,
             why:'Le souvenir qui revient demande 想起来 ; 想 seul, c’est penser à quelqu’un.'}
    },
    {
      t:'说起来, 做起来 — à l’épreuve',
      p:[
        'Greffé sur un verbe d’action, <b>起来</b> dit : quand on s’y met, à l’usage. C’est un jugement porté sur l’expérience de faire la chose.',
        'La formule proverbiale la plus connue oppose les deux : 说起来容易，做起来难.'
      ],
      ex:[
        {hz:'说起来容易，做起来难。',py:'shuō qǐ lái róng yì, zuò qǐ lái nán',fr:'Facile à dire, difficile à faire.'},
        {hz:'汉语说起来很难。',py:'Hàn yǔ shuō qǐ lái hěn nán',fr:'Le chinois est difficile à parler.',
         note:'Le sujet est ce dont on parle ; le verbe dit par quel bout on l’éprouve.'}
      ],
      check:{q:'这个菜吃起来很好吃 signifie :',a:['ce plat est en train d’être mangé','à le goûter, ce plat est bon'],ok:1,
             why:'起来 dit ici l’épreuve : ce que donne la chose quand on s’y met.'}
    },
    {
      t:'起来 — l’action qui se déclenche',
      p:[
        'Dernier emploi : <b>起来</b> marque le moment où l’action se met en route. 他笑起来了, il s’est mis à rire.',
        'S’il y a un objet, il se glisse entre 起 et 来 : 下<b>起</b>雨<b>来</b>了.'
      ],
      ex:[
        {hz:'他笑起来了。',py:'tā xiào qǐ lái le',fr:'Il s’est mis à rire.'},
        {hz:'下起雨来了。',py:'xià qǐ yǔ lái le',fr:'Il s’est mis à pleuvoir.',
         note:'雨 se glisse à l’intérieur, entre 起 et 来.'}
      ],
      check:{q:'Où se place 雨 ?',a:['下起来雨了。','下起雨来了。'],ok:1,
             why:'L’objet se glisse entre 起 et 来, jamais après le bloc.'}
    },
    {
      t:'Les confusions à éviter',
      p:[
        '<b>看起来</b> n’est pas <b>看见</b> : le premier juge d’une apparence, le second constate qu’on a vu.',
        '<b>想起来</b> n’est pas <b>想</b> : le premier retrouve un souvenir, le second pense à quelque chose ou en a envie.',
        'Enfin, 起来 figuré garde la construction du 起来 propre : l’objet se glisse toujours avant 来.'
      ],
      ex:[
        {hz:'我看见他了。',py:'wǒ kàn jiàn tā le',fr:'Je l’ai vu.',
         note:'Un constat, pas un jugement.'},
        {hz:'他看起来很年轻。',py:'tā kàn qǐ lái hěn nián qīng',fr:'Il a l’air jeune.',
         note:'Un jugement tiré de l’apparence.'}
      ],
      check:{q:'Pour dire « il a l’air content » :',a:['他看见很高兴。','他看起来很高兴。'],ok:1,
             why:'看见 constate ; c’est 看起来 qui porte un jugement sur l’apparence.'}
    }
  ],

  tableau:{
    cols:['Emploi','Exemple','Traduction'],
    rows:[
      ['Sens propre','她站起来了','Elle s’est levée'],
      ['Apparence vue','他看起来很累','Il a l’air fatigué'],
      ['Apparence entendue','这个名字听起来很好听','Ce nom sonne joliment'],
      ['Souvenir retrouvé','我想起来了','Ça y est, je me rappelle'],
      ['À l’épreuve','说起来容易','Facile à dire'],
      ['Action déclenchée','下起雨来了','Il s’est mis à pleuvoir']
    ]
  },

  piege:{
    bad:{hz:'他看见很高兴。',py:'tā kàn jiàn hěn gāo xìng'},
    good:{hz:'他看起来很高兴。',py:'tā kàn qǐ lái hěn gāo xìng'},
    why:'看见 constate qu’on a vu quelque chose. Pour dire ce que l’apparence donne à penser, il faut 看起来 — et l’adjectif garde son 很, comme dans toute phrase d’adjectif.'
  },

  voir:['g308','g302'],

  banque:[
    {seg:[{h:'他',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'很',p:'hěn'},{h:'累',p:'lèi'},P('。')],cle:1,fr:'Il a l’air fatigué.'},
    {seg:[{h:'她',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'很',p:'hěn'},{h:'高兴',p:'gāo xìng'},P('。')],cle:1,fr:'Elle a l’air contente.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'名字',p:'míng zi'},{h:'听起来',p:'tīng qǐ lái'},{h:'很',p:'hěn'},{h:'好听',p:'hǎo tīng'},P('。')],cle:2,fr:'Ce nom sonne joliment.'},
    {seg:[{h:'我',p:'wǒ'},{h:'想起来',p:'xiǎng qǐ lái'},{h:'了',p:'le'},P('。')],cle:1,fr:'Ça y est, je me rappelle.'},
    {seg:[{h:'我',p:'wǒ'},{h:'想起来',p:'xiǎng qǐ lái'},{h:'他的',p:'tā de'},{h:'名字',p:'míng zi'},{h:'了',p:'le'},P('。')],cle:1,fr:'Je me suis rappelé son nom.'},
    {seg:[{h:'说起来',p:'shuō qǐ lái'},{h:'容易',p:'róng yì'},P('，'),{h:'做起来',p:'zuò qǐ lái'},{h:'难',p:'nán'},P('。')],cle:0,fr:'Facile à dire, difficile à faire.'},
    {seg:[{h:'汉语',p:'Hàn yǔ'},{h:'说起来',p:'shuō qǐ lái'},{h:'很',p:'hěn'},{h:'难',p:'nán'},P('。')],cle:1,fr:'Le chinois est difficile à parler.'},
    {seg:[{h:'他',p:'tā'},{h:'笑',p:'xiào'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],cle:2,fr:'Il s’est mis à rire.'},
    {seg:[{h:'下',p:'xià'},{h:'起',p:'qǐ'},{h:'雨',p:'yǔ'},{h:'来',p:'lái'},{h:'了',p:'le'},P('。')],cle:1,fr:'Il s’est mis à pleuvoir.'},
    {seg:[{h:'她',p:'tā'},{h:'站',p:'zhàn'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],cle:2,fr:'Elle s’est levée.'},
    {seg:[{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},{h:'看起来',p:'kàn qǐ lái'},{h:'很',p:'hěn'},{h:'有意思',p:'yǒu yì si'},P('。')],cle:2,fr:'Ce livre a l’air intéressant.'},
    {seg:[{h:'他',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'不太',p:'bú tài'},{h:'舒服',p:'shū fu'},P('。')],cle:1,fr:'Il n’a pas l’air très bien.'},
    {seg:[{h:'大家',p:'dà jiā'},{h:'唱',p:'chàng'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],cle:2,fr:'Tout le monde s’est mis à chanter.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'办法',p:'bàn fǎ'},{h:'听起来',p:'tīng qǐ lái'},{h:'很',p:'hěn'},{h:'好',p:'hǎo'},P('。')],cle:2,fr:'Cette solution a l’air bonne.'}
  ],
  leurres:['起来','看起来','听起来','想起来','看见','很','了'],

  gabarits:[
    {cadre:[{s:'s'},{h:'看起来',p:'kàn qǐ lái'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'… a l’air …', lie:[], libre:['s','a'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'你朋友',p:'nǐ péng you',fr:'ton amie'}],
             a:[{h:'累',p:'lèi',fr:'fatigué'},{h:'高兴',p:'gāo xìng',fr:'content'},
                {h:'年轻',p:'nián qīng',fr:'jeune'},{h:'忙',p:'máng',fr:'occupé'},
                {h:'舒服',p:'shū fu',fr:'à l’aise'},{h:'好',p:'hǎo',fr:'bien'},
                {h:'高',p:'gāo',fr:'grand'},{h:'聪明',p:'cōng ming',fr:'intelligent'},
                {h:'认真',p:'rèn zhēn',fr:'sérieux'},{h:'安静',p:'ān jìng',fr:'calme'},
                {h:'快乐',p:'kuài lè',fr:'joyeux'},{h:'生气',p:'shēng qì',fr:'fâché'}]}},

    {cadre:[{s:'n'},{h:'听起来',p:'tīng qǐ lái'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'… sonne …', lie:[['n','a']],
     listes:{n:[{h:'这个名字',p:'zhè ge míng zi',fr:'ce nom'},{h:'这首歌',p:'zhè shǒu gē',fr:'cette chanson'},
                {h:'他的声音',p:'tā de shēng yīn',fr:'sa voix'},{h:'这个故事',p:'zhè ge gù shi',fr:'cette histoire'},
                {h:'这个问题',p:'zhè ge wèn tí',fr:'cette question'},{h:'这个办法',p:'zhè ge bàn fǎ',fr:'cette solution'},
                {h:'这首歌',p:'zhè shǒu gē',fr:'cette chanson'},{h:'这个故事',p:'zhè ge gù shi',fr:'cette histoire'},
                {h:'这个问题',p:'zhè ge wèn tí',fr:'cette question'},{h:'这个办法',p:'zhè ge bàn fǎ',fr:'cette solution'},
                {h:'这个名字',p:'zhè ge míng zi',fr:'ce nom'},{h:'他的声音',p:'tā de shēng yīn',fr:'sa voix'}],
             a:[{h:'好听',p:'hǎo tīng',fr:'joli à l’oreille'},{h:'好听',p:'hǎo tīng',fr:'joli à l’oreille'},
                {h:'好听',p:'hǎo tīng',fr:'joli à l’oreille'},{h:'有意思',p:'yǒu yì si',fr:'intéressant'},
                {h:'难',p:'nán',fr:'difficile'},{h:'好',p:'hǎo',fr:'bon'},
                {h:'不错',p:'bú cuò',fr:'pas mal'},{h:'不错',p:'bú cuò',fr:'pas mal'},
                {h:'容易',p:'róng yì',fr:'facile'},{h:'容易',p:'róng yì',fr:'facile'},
                {h:'不错',p:'bú cuò',fr:'pas mal'},{h:'奇怪',p:'qí guài',fr:'étrange'}]}},

    {cadre:[{s:'s'},{h:'想起来',p:'xiǎng qǐ lái'},{s:'o'},{h:'了',p:'le'},P('。')],
     fr:'… s’est rappelé …', lie:[], libre:['s','o'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},
                {h:'她',p:'tā',fr:'elle'},{h:'你朋友',p:'nǐ péng you',fr:'ton amie'}],
             o:[{h:'他的名字',p:'tā de míng zi',fr:'son nom'},{h:'她的名字',p:'tā de míng zi',fr:'son nom à elle'},
                {h:'那个人的名字',p:'nà ge rén de míng zi',fr:'le nom de cette personne'},{h:'那个词',p:'nà ge cí',fr:'ce mot'},
                {h:'那件事',p:'nà jiàn shì',fr:'cette affaire'},{h:'老师的话',p:'lǎo shī de huà',fr:'les paroles du professeur'},
                {h:'那个地方',p:'nà ge dì fang',fr:'cet endroit'},{h:'昨天的事',p:'zuó tiān de shì',fr:'ce qui s’est passé hier'},
                {h:'那个故事',p:'nà ge gù shi',fr:'cette histoire'},{h:'那本书的名字',p:'nà běn shū de míng zi',fr:'le titre de ce livre'},
                {h:'他的电话号码',p:'tā de diàn huà hào mǎ',fr:'son numéro'},{h:'那个办法',p:'nà ge bàn fǎ',fr:'cette solution'}]}},

    {cadre:[{s:'o'},{s:'v'},{h:'起来',p:'qǐ lái'},{h:'很',p:'hěn'},{s:'a'},P('。')],
     fr:'…, à l’épreuve, est …', lie:[['o','v','a']],
     listes:{o:[{h:'汉语',p:'Hàn yǔ',fr:'le chinois'},{h:'汉字',p:'Hàn zì',fr:'les caractères'},
                {h:'这个字',p:'zhè ge zì',fr:'ce caractère'},{h:'这本书',p:'zhè běn shū',fr:'ce livre'},
                {h:'这个问题',p:'zhè ge wèn tí',fr:'cette question'},{h:'这个问题',p:'zhè ge wèn tí',fr:'cette question'},
                {h:'这首歌',p:'zhè shǒu gē',fr:'cette chanson'},{h:'这首歌',p:'zhè shǒu gē',fr:'cette chanson'},
                {h:'这个菜',p:'zhè ge cài',fr:'ce plat'},{h:'这个菜',p:'zhè ge cài',fr:'ce plat'},
                {h:'中文',p:'Zhōng wén',fr:'le chinois'},{h:'这个词',p:'zhè ge cí',fr:'ce mot'}],
             v:[{h:'说',p:'shuō',fr:'à parler'},{h:'写',p:'xiě',fr:'à écrire'},
                {h:'写',p:'xiě',fr:'à écrire'},{h:'看',p:'kàn',fr:'à lire'},
                {h:'说',p:'shuō',fr:'à formuler'},{h:'做',p:'zuò',fr:'à résoudre'},
                {h:'唱',p:'chàng',fr:'à chanter'},{h:'听',p:'tīng',fr:'à écouter'},
                {h:'做',p:'zuò',fr:'à préparer'},{h:'吃',p:'chī',fr:'à manger'},
                {h:'学',p:'xué',fr:'à apprendre'},{h:'用',p:'yòng',fr:'à employer'}],
             a:[{h:'难',p:'nán',fr:'difficile'},{h:'难',p:'nán',fr:'difficile'},
                {h:'容易',p:'róng yì',fr:'facile'},{h:'容易',p:'róng yì',fr:'facile'},
                {h:'容易',p:'róng yì',fr:'facile'},{h:'难',p:'nán',fr:'difficile'},
                {h:'难',p:'nán',fr:'difficile'},{h:'好听',p:'hǎo tīng',fr:'agréable'},
                {h:'容易',p:'róng yì',fr:'facile'},{h:'好吃',p:'hǎo chī',fr:'bon'},
                {h:'难',p:'nán',fr:'difficile'},{h:'容易',p:'róng yì',fr:'facile'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],
     fr:'… s’est mis à …', lie:[['s','v']],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'大家',p:'dà jiā',fr:'tout le monde'},{h:'孩子',p:'hái zi',fr:'l’enfant'},
                {h:'他',p:'tā',fr:'il'},{h:'大家',p:'dà jiā',fr:'tout le monde'},
                {h:'天',p:'tiān',fr:'le temps'},{h:'天气',p:'tiān qì',fr:'le temps'},
                {h:'雨',p:'yǔ',fr:'la pluie'},{h:'她',p:'tā',fr:'elle'},
                {h:'他',p:'tā',fr:'il'},{h:'大家',p:'dà jiā',fr:'tout le monde'}],
             v:[{h:'笑',p:'xiào',fr:'rire'},{h:'哭',p:'kū',fr:'pleurer'},
                {h:'唱',p:'chàng',fr:'chanter'},{h:'哭',p:'kū',fr:'pleurer'},
                {h:'跑',p:'pǎo',fr:'courir'},{h:'说',p:'shuō',fr:'parler'},
                {h:'冷',p:'lěng',fr:'se rafraîchir'},{h:'热',p:'rè',fr:'se réchauffer'},
                {h:'下',p:'xià',fr:'tomber'},{h:'唱',p:'chàng',fr:'chanter'},
                {h:'说',p:'shuō',fr:'parler'},{h:'笑',p:'xiào',fr:'rire'}]}},

    {cadre:[{s:'s'},{h:'看起来',p:'kàn qǐ lái'},{h:'不太',p:'bú tài'},{s:'a'},P('。')],
     fr:'… n’a pas l’air très …', lie:[], libre:['s','a'],
     listes:{s:[{h:'他',p:'tā',fr:'il'},{h:'她',p:'tā',fr:'elle'},
                {h:'老师',p:'lǎo shī',fr:'le professeur'},{h:'你朋友',p:'nǐ péng you',fr:'ton amie'}],
             a:[{h:'累',p:'lèi',fr:'fatigué'},{h:'高兴',p:'gāo xìng',fr:'content'},
                {h:'年轻',p:'nián qīng',fr:'jeune'},{h:'忙',p:'máng',fr:'occupé'},
                {h:'舒服',p:'shū fu',fr:'à l’aise'},{h:'好',p:'hǎo',fr:'bien'},
                {h:'高',p:'gāo',fr:'grand'},{h:'聪明',p:'cōng ming',fr:'intelligent'},
                {h:'认真',p:'rèn zhēn',fr:'sérieux'},{h:'安静',p:'ān jìng',fr:'calme'},
                {h:'快乐',p:'kuài lè',fr:'joyeux'},{h:'生气',p:'shēng qì',fr:'fâché'}]}}
  ],

  transfo:[
    {consigne:'Portez un jugement sur l’apparence, avec 看起来',
     de:{hz:'他很累。',py:'tā hěn lèi',fr:'Il est fatigué.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'很',p:'hěn'},{h:'累',p:'lèi'},P('。')],fr:'Il a l’air fatigué.'}},
    {consigne:'Portez le jugement sur ce qu’on entend, avec 听起来',
     de:{hz:'这个名字很好听。',py:'zhè ge míng zi hěn hǎo tīng',fr:'Ce nom est joli.'},
     vers:{seg:[{h:'这个',p:'zhè ge'},{h:'名字',p:'míng zi'},{h:'听起来',p:'tīng qǐ lái'},{h:'很',p:'hěn'},{h:'好听',p:'hǎo tīng'},P('。')],fr:'Ce nom sonne joliment.'}},
    {consigne:'Replacez l’objet à l’intérieur du bloc',
     de:{hz:'我想起来他的名字了。',py:'wǒ xiǎng qǐ lái tā de míng zi le',fr:'Je me suis rappelé son nom.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'起',p:'qǐ'},{h:'他的',p:'tā de'},{h:'名字',p:'míng zi'},{h:'来',p:'lái'},{h:'了',p:'le'},P('。')],fr:'Je me suis rappelé son nom.'}},
    {consigne:'Dites la difficulté à l’épreuve, avec 起来',
     de:{hz:'汉语很难。',py:'Hàn yǔ hěn nán',fr:'Le chinois est difficile.'},
     vers:{seg:[{h:'汉语',p:'Hàn yǔ'},{h:'说',p:'shuō'},{h:'起来',p:'qǐ lái'},{h:'很',p:'hěn'},{h:'难',p:'nán'},P('。')],fr:'Le chinois est difficile à parler.'}},
    {consigne:'Dites que l’action se déclenche, avec 起来',
     de:{hz:'他笑了。',py:'tā xiào le',fr:'Il a ri.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'笑',p:'xiào'},{h:'起来',p:'qǐ lái'},{h:'了',p:'le'},P('。')],fr:'Il s’est mis à rire.'}},
    {consigne:'Atténuez le jugement avec 不太',
     de:{hz:'他看起来很舒服。',py:'tā kàn qǐ lái hěn shū fu',fr:'Il a l’air bien.'},
     vers:{seg:[{h:'他',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'不太',p:'bú tài'},{h:'舒服',p:'shū fu'},P('。')],fr:'Il n’a pas l’air très bien.'}}
  ],

  fixes:[
    {seg:[{h:'他',p:'tā'},{h:'看见',p:'kàn jiàn'},{h:'很',p:'hěn'},{h:'高兴',p:'gāo xìng'},P('。')],bad:1,
     bon:'他看起来很高兴。',why:'看见 constate qu’on a vu ; le jugement d’apparence demande 看起来.'},
    {seg:[{h:'他',p:'tā'},{h:'看起来',p:'kàn qǐ lái'},{h:'累',p:'lèi'},P('。')],bad:2,
     bon:'他看起来很累。',why:'L’adjectif attribut garde son adverbe : 很.'},
    {seg:[{h:'下',p:'xià'},{h:'起来',p:'qǐ lái'},{h:'雨',p:'yǔ'},{h:'了',p:'le'},P('。')],bad:2,
     bon:'下起雨来了。',why:'L’objet se glisse entre 起 et 来, jamais après le bloc.'},
    {seg:[{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'他的',p:'tā de'},{h:'名字',p:'míng zi'},{h:'了',p:'le'},P('。')],bad:1,
     bon:'我想起来他的名字了。',why:'想 seul veut dire penser à ; le souvenir qui remonte demande 想起来.'},
    {seg:[{h:'汉语',p:'Hàn yǔ'},{h:'起来',p:'qǐ lái'},{h:'说',p:'shuō'},{h:'很',p:'hěn'},{h:'难',p:'nán'},P('。')],bad:1,
     bon:'汉语说起来很难。',why:'起来 se place après le verbe, jamais devant.'},
    {seg:[{h:'她',p:'tā'},{h:'站',p:'zhàn'},{h:'起去',p:'qǐ qù'},{h:'了',p:'le'},P('。')],bad:2,
     bon:'她站起来了。',why:'起 n’admet que 来, au sens propre comme au sens figuré.'}
  ],

  reemploi:[
    {q:'Regardez quelqu’un autour de vous et dites de quoi il a l’air, puis atténuez avec 不太.',
     verif:[{type:'contient',v:'看起来',msg:'Le jugement d’apparence demande 看起来.'},
            {type:'contient',v:'不太',msg:'L’atténuation se fait avec 不太.'}],
     modeles:[{hz:'他看起来很累，可是看起来不太生气。',py:'tā kàn qǐ lái hěn lèi, kě shì kàn qǐ lái bú tài shēng qì',fr:'Il a l’air fatigué, mais pas très fâché.'}],
     criteres:['看起来 précède le jugement','很 devant l’adjectif à la forme affirmative','不太 remplace 很 à la forme atténuée']},
    {q:'Vous venez de retrouver le nom de quelqu’un que vous aviez oublié. Dites-le.',
     verif:[{type:'contient',v:'想起来',msg:'Le souvenir qui remonte demande 想起来.'},
            {type:'finit',v:'了',msg:'Le changement d’état demande 了 en fin de phrase.'}],
     modeles:[{hz:'我想起来了，他叫王明。',py:'wǒ xiǎng qǐ lái le, tā jiào Wáng Míng',fr:'Ça y est, je me rappelle : il s’appelle Wang Ming.'},
              {hz:'我想起来他的名字了。',py:'wǒ xiǎng qǐ lái tā de míng zi le',fr:'Je me suis rappelé son nom.'}],
     criteres:['想起来 et non 想 seul','了 ferme la phrase','L’objet est après le bloc, ou entre 起 et 来']},
    {q:'Dites d’une langue ou d’un plat ce qu’il donne à l’épreuve : à parler, à goûter.',
     verif:[{type:'contient',v:'起来',msg:'L’épreuve demande 起来 greffé sur le verbe.'},
            {type:'contient',v:'很',msg:'Le jugement garde son adverbe : 很.'}],
     modeles:[{hz:'汉语说起来很难，可是听起来很好听。',py:'Hàn yǔ shuō qǐ lái hěn nán, kě shì tīng qǐ lái hěn hǎo tīng',fr:'Le chinois est difficile à parler, mais agréable à entendre.'},
              {hz:'这个菜吃起来很好吃。',py:'zhè ge cài chī qǐ lái hěn hǎo chī',fr:'Ce plat est bon.'}],
     criteres:['起来 suit immédiatement le verbe','Ce dont on parle est en tête','很 précède l’adjectif']}
  ]
}
,

/* ------------------------------------------------------------------ */
{
  id:'g310', hsk:3, fam:'verbe', th:['quotidien','travail'],
  title:'Y arriver ou non : la forme potentielle 看得懂 / 看不懂',
  resume:'On glisse 得 ou 不 entre le verbe et son complément pour dire si le résultat est à portée : non pas ce qui a eu lieu, mais ce dont on est capable.',

  steps:[
    {
      t:'Le principe',
      p:[
        'Reprenez un verbe et son complément de résultat — 看懂, comprendre en lisant. Glissez <b>得</b> entre les deux : 看<b>得</b>懂, j’arrive à comprendre. Glissez <b>不</b> : 看<b>不</b>懂, je n’y arrive pas.',
        'Ce n’est plus un fait accompli, c’est une capacité. 我看懂了 raconte que j’ai compris ; 我看得懂 dit que j’en suis capable.',
        'Dans cette construction, 得 et 不 perdent leur ton et se prononcent légers.'
      ],
      ex:[
        {hz:'我看不懂这本书。',py:'wǒ kàn bu dǒng zhè běn shū',fr:'Je n’arrive pas à comprendre ce livre.'},
        {hz:'他听得懂老师的话。',py:'tā tīng de dǒng lǎo shī de huà',fr:'Il arrive à comprendre ce que dit le professeur.'}
      ],
      check:{q:'我看懂了 veut dire :',a:['j’arrive à comprendre','j’ai compris'],ok:1,
             why:'Avec 了, c’est un fait accompli. La capacité passe par 得 ou 不.'}
    },
    {
      t:'La même chose avec un complément de direction',
      p:[
        'Le procédé vaut aussi pour les compléments de direction de la fiche g308 : 拿<b>不</b>出来, je n’arrive pas à le sortir ; 进<b>得</b>去, on peut y entrer.',
        'Attention : 不 se place devant le complément <b>entier</b>. On ne coupe jamais 出来 en deux.'
      ],
      ex:[
        {hz:'我拿不出来。',py:'wǒ ná bu chū lái',fr:'Je n’arrive pas à le sortir.'},
        {hz:'桌子搬不进去。',py:'zhuō zi bān bu jìn qù',fr:'La table ne rentre pas.',
         note:'不 précède 进去 tout entier.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我拿出不来。','我拿不出来。'],ok:1,
             why:'不 se met devant le complément entier, jamais à l’intérieur.'}
    },
    {
      t:'Interroger',
      p:[
        'Deux façons. Avec <b>吗</b> : 你看得懂吗？ Ou par la forme alternative, en juxtaposant l’affirmatif et le négatif : 你看<b>得</b>懂看<b>不</b>懂？',
        'Comme pour V不V, les deux outils ne se cumulent jamais.'
      ],
      ex:[
        {hz:'你听得清楚吗？',py:'nǐ tīng de qīng chu ma',fr:'Tu entends bien ?'},
        {hz:'你看得懂看不懂？',py:'nǐ kàn de dǒng kàn bu dǒng',fr:'Arrives-tu à comprendre ?'}
      ],
      check:{q:'Laquelle est correcte ?',a:['你看得懂吗看不懂？','你看得懂看不懂？'],ok:1,
             why:'La forme alternative remplace 吗 : les employer ensemble est une faute.'}
    },
    {
      t:'Ne pas confondre avec 不能',
      p:[
        '<b>不能</b> dit une impossibilité venue du dehors : une interdiction, une circonstance. 我不能看电视, je n’ai pas le droit de regarder la télévision.',
        'La forme potentielle, elle, dit une incapacité qui tient à moi ou à la chose : 我看不懂, mes moyens n’y suffisent pas.',
        'Autre remarque d’usage : la forme négative est bien plus fréquente que l’affirmative. On dit couramment 看不懂 ; pour l’affirmatif, on emploie souvent 能 ou rien du tout.'
      ],
      ex:[
        {hz:'我不能看电视。',py:'wǒ bù néng kàn diàn shì',fr:'Je n’ai pas le droit de regarder la télévision.'},
        {hz:'我看不懂这本书。',py:'wǒ kàn bu dǒng zhè běn shū',fr:'Je n’arrive pas à comprendre ce livre.'}
      ],
      check:{q:'La bibliothèque est fermée, vous ne pouvez pas emprunter le livre. Vous dites :',
             a:['我借不到那本书。','我不能借那本书。'],ok:1,
             why:'L’obstacle est extérieur : c’est 不能. 借不到 dirait que vous n’arrivez pas à mettre la main dessus.'}
    },
    {
      t:'Les deux erreurs de placement',
      p:[
        'Première erreur : mettre 不 devant le verbe. 我<b>不</b>看懂 est faux — la négation ne porte pas sur l’action, mais sur l’aboutissement.',
        'Seconde erreur : ajouter 了. La forme potentielle ne raconte aucun fait, elle ne peut donc pas s’achever.',
        'Et l’objet, comme toujours, peut passer en tête : 这本书，我看不懂.'
      ],
      ex:[
        {hz:'这本书，我看不懂。',py:'zhè běn shū, wǒ kàn bu dǒng',fr:'Ce livre, je n’arrive pas à le comprendre.'},
        {hz:'这个词，我想不起来。',py:'zhè ge cí, wǒ xiǎng bu qǐ lái',fr:'Ce mot, je n’arrive pas à le retrouver.',
         note:'想起来 de la fiche précédente se met lui aussi à la forme potentielle.'}
      ],
      check:{q:'Laquelle est correcte ?',a:['我不看懂这本书。','我看不懂这本书。'],ok:1,
             why:'不 se glisse entre le verbe et le résultat, jamais devant le verbe.'}
    }
  ],

  tableau:{
    cols:['Forme','Exemple','Sens'],
    rows:[
      ['Fait accompli','我看懂了','J’ai compris'],
      ['Capacité affirmée','我看得懂','J’arrive à comprendre'],
      ['Capacité niée','我看不懂','Je n’y arrive pas'],
      ['Question alternative','你看得懂看不懂？','Y arrives-tu ?'],
      ['Avec une direction','我拿不出来','Je n’arrive pas à le sortir'],
      ['Obstacle extérieur','我不能看','Je n’ai pas le droit de regarder']
    ]
  },

  piege:{
    bad:{hz:'我不看懂这本书。',py:'wǒ bú kàn dǒng zhè běn shū'},
    good:{hz:'我看不懂这本书。',py:'wǒ kàn bu dǒng zhè běn shū'},
    why:'Le français nie le verbe — « je ne comprends pas ». Le chinois nie l’aboutissement : l’action de regarder a bien lieu, c’est la compréhension qui manque. 不 se loge donc entre le verbe et son résultat.'
  },

  voir:['g306','g308'],

  banque:[
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],cle:2,fr:'Je n’arrive pas à comprendre ce livre.'},
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],cle:2,fr:'J’arrive à comprendre ce livre.'},
    {seg:[{h:'他',p:'tā'},{h:'听',p:'tīng'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},{h:'老师的',p:'lǎo shī de'},{h:'话',p:'huà'},P('。')],cle:2,fr:'Il n’arrive pas à comprendre le professeur.'},
    {seg:[{h:'我',p:'wǒ'},{h:'找',p:'zhǎo'},{h:'不',p:'bu'},{h:'到',p:'dào'},{h:'我的',p:'wǒ de'},{h:'手机',p:'shǒu jī'},P('。')],cle:2,fr:'Je ne trouve pas mon téléphone.'},
    {seg:[{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('，'),{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'完',p:'wán'},P('。')],cle:5,fr:'Ce livre, je n’arriverai pas à le finir.'},
    {seg:[{h:'你',p:'nǐ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},P('？')],cle:2,fr:'Arrives-tu à comprendre ?'},
    {seg:[{h:'我',p:'wǒ'},{h:'拿',p:'ná'},{h:'不',p:'bu'},{h:'出来',p:'chū lái'},P('。')],cle:2,fr:'Je n’arrive pas à le sortir.'},
    {seg:[{h:'桌子',p:'zhuō zi'},{h:'搬',p:'bān'},{h:'不',p:'bu'},{h:'进去',p:'jìn qù'},P('。')],cle:2,fr:'La table ne rentre pas.'},
    {seg:[{h:'你',p:'nǐ'},{h:'听',p:'tīng'},{h:'得',p:'de'},{h:'清楚',p:'qīng chu'},{h:'吗',p:'ma'},P('？')],cle:2,fr:'Tu entends bien ?'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'词',p:'cí'},P('，'),{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'不',p:'bu'},{h:'起来',p:'qǐ lái'},P('。')],cle:5,fr:'Ce mot, je n’arrive pas à le retrouver.'},
    {seg:[{h:'这些',p:'zhè xiē'},{h:'菜',p:'cài'},{h:'我',p:'wǒ'},{h:'吃',p:'chī'},{h:'不',p:'bu'},{h:'完',p:'wán'},P('。')],cle:4,fr:'Je n’arriverai pas à finir ces plats.'},
    {seg:[{h:'那本',p:'nà běn'},{h:'书',p:'shū'},{h:'买',p:'mǎi'},{h:'不',p:'bu'},{h:'到',p:'dào'},P('。')],cle:3,fr:'Ce livre est introuvable.'},
    {seg:[{h:'我',p:'wǒ'},{h:'听',p:'tīng'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'一点儿',p:'yì diǎnr'},P('。')],cle:2,fr:'J’arrive à comprendre un peu.'},
    {seg:[{h:'他',p:'tā'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'清楚',p:'qīng chu'},{h:'那个',p:'nà ge'},{h:'人',p:'rén'},P('。')],cle:2,fr:'Il ne distingue pas bien cette personne.'}
  ],
  leurres:['得','不','懂','到','完','见','清楚'],

  gabarits:[
    {cadre:[{s:'s'},{s:'v'},{h:'不',p:'bu'},{s:'r'},{s:'o'},P('。')],
     fr:'… n’arrive pas à …', lie:[['v','r','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},
                {h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'听',p:'tīng',fr:'entendre'},
                {h:'找',p:'zhǎo',fr:'chercher'},{h:'看',p:'kàn',fr:'lire'},
                {h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'做',p:'zuò',fr:'faire'}],
             r:[{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},
                {h:'见',p:'jiàn',fr:'jusqu’à voir'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'},
                {h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'清楚',p:'qīng chu',fr:'jusqu’à bien saisir'},
                {h:'清楚',p:'qīng chu',fr:'jusqu’à bien distinguer'},{h:'完',p:'wán',fr:'jusqu’au bout'}],
             o:[{h:'这本书',p:'zhè běn shū',fr:'ce livre'},{h:'老师的话',p:'lǎo shī de huà',fr:'les paroles du professeur'},
                {h:'那个字',p:'nà ge zì',fr:'ce caractère'},{h:'你的声音',p:'nǐ de shēng yīn',fr:'ta voix'},
                {h:'我的手机',p:'wǒ de shǒu jī',fr:'mon téléphone'},{h:'这本书',p:'zhè běn shū',fr:'ce livre'},
                {h:'这些菜',p:'zhè xiē cài',fr:'ces plats'},{h:'这些字',p:'zhè xiē zì',fr:'ces caractères'},
                {h:'那本书',p:'nà běn shū',fr:'ce livre-là'},{h:'那个人的话',p:'nà ge rén de huà',fr:'ce que dit cette personne'},
                {h:'那个人',p:'nà ge rén',fr:'cette personne'},{h:'这些作业',p:'zhè xiē zuò yè',fr:'ces devoirs'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'得',p:'de'},{s:'r'},{s:'o'},P('。')],
     fr:'… arrive à …', lie:[['v','r','o']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},
                {h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'听',p:'tīng',fr:'entendre'},
                {h:'找',p:'zhǎo',fr:'chercher'},{h:'看',p:'kàn',fr:'lire'},
                {h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'做',p:'zuò',fr:'faire'}],
             r:[{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},
                {h:'见',p:'jiàn',fr:'jusqu’à voir'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'},
                {h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'清楚',p:'qīng chu',fr:'jusqu’à bien saisir'},
                {h:'清楚',p:'qīng chu',fr:'jusqu’à bien distinguer'},{h:'完',p:'wán',fr:'jusqu’au bout'}],
             o:[{h:'这本书',p:'zhè běn shū',fr:'ce livre'},{h:'老师的话',p:'lǎo shī de huà',fr:'les paroles du professeur'},
                {h:'那个字',p:'nà ge zì',fr:'ce caractère'},{h:'你的声音',p:'nǐ de shēng yīn',fr:'ta voix'},
                {h:'我的手机',p:'wǒ de shǒu jī',fr:'mon téléphone'},{h:'这本书',p:'zhè běn shū',fr:'ce livre'},
                {h:'这些菜',p:'zhè xiē cài',fr:'ces plats'},{h:'这些字',p:'zhè xiē zì',fr:'ces caractères'},
                {h:'那本书',p:'nà běn shū',fr:'ce livre-là'},{h:'那个人的话',p:'nà ge rén de huà',fr:'ce que dit cette personne'},
                {h:'那个人',p:'nà ge rén',fr:'cette personne'},{h:'这些作业',p:'zhè xiē zuò yè',fr:'ces devoirs'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'得',p:'de'},{s:'r'},{s:'v'},{h:'不',p:'bu'},{s:'r'},P('？')],
     fr:'… y arrive-t-il ou non ?', lie:[['v','r']], libre:['s'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'}],
             v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'听',p:'tīng',fr:'entendre'},
                {h:'找',p:'zhǎo',fr:'chercher'},{h:'看',p:'kàn',fr:'lire'},
                {h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'做',p:'zuò',fr:'faire'}],
             r:[{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},
                {h:'见',p:'jiàn',fr:'jusqu’à voir'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'},
                {h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'清楚',p:'qīng chu',fr:'jusqu’à bien saisir'},
                {h:'清楚',p:'qīng chu',fr:'jusqu’à bien distinguer'},{h:'完',p:'wán',fr:'jusqu’au bout'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'不',p:'bu'},{s:'d'},P('。')],
     fr:'… n’arrive pas à …', lie:[['v','d']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},
                {h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             v:[{h:'拿',p:'ná',fr:'prendre'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'搬',p:'bān',fr:'déplacer'},{h:'走',p:'zǒu',fr:'aller à pied'},
                {h:'跑',p:'pǎo',fr:'courir'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'带',p:'dài',fr:'apporter'},{h:'搬',p:'bān',fr:'déplacer'},
                {h:'走',p:'zǒu',fr:'aller à pied'},{h:'拿',p:'ná',fr:'prendre'},
                {h:'跑',p:'pǎo',fr:'courir'},{h:'走',p:'zǒu',fr:'aller à pied'}],
             d:[{h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'进去',p:'jìn qù',fr:'à l’intérieur, loin de moi'},
                {h:'进来',p:'jìn lái',fr:'à l’intérieur, vers moi'},{h:'进去',p:'jìn qù',fr:'à l’intérieur, loin de moi'},
                {h:'上去',p:'shàng qù',fr:'en haut, loin de moi'},{h:'下来',p:'xià lái',fr:'en bas, vers moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'出去',p:'chū qù',fr:'dehors, loin de moi'},
                {h:'出来',p:'chū lái',fr:'dehors, vers moi'},{h:'上来',p:'shàng lái',fr:'en haut, vers moi'},
                {h:'回来',p:'huí lái',fr:'de retour ici'},{h:'过去',p:'guò qù',fr:'jusque là-bas'}]}},

    {cadre:[{s:'o'},P('，'),{s:'s'},{s:'v'},{h:'不',p:'bu'},{s:'r'},P('。')],
     fr:'…, … n’arrive pas à …', lie:[['o','v','r']], libre:['s'],
     listes:{s:[{h:'我',p:'wǒ',fr:'je'},{h:'他',p:'tā',fr:'il'},
                {h:'她',p:'tā',fr:'elle'},{h:'我朋友',p:'wǒ péng you',fr:'mon amie'}],
             o:[{h:'这本书',p:'zhè běn shū',fr:'ce livre'},{h:'老师的话',p:'lǎo shī de huà',fr:'les paroles du professeur'},
                {h:'那个字',p:'nà ge zì',fr:'ce caractère'},{h:'我的手机',p:'wǒ de shǒu jī',fr:'mon téléphone'},
                {h:'这些菜',p:'zhè xiē cài',fr:'ces plats'},{h:'这些字',p:'zhè xiē zì',fr:'ces caractères'},
                {h:'那本书',p:'nà běn shū',fr:'ce livre-là'},{h:'那个人的话',p:'nà ge rén de huà',fr:'ce que dit cette personne'},
                {h:'那个人',p:'nà ge rén',fr:'cette personne'},{h:'这些作业',p:'zhè xiē zuò yè',fr:'ces devoirs'},
                {h:'这本书',p:'zhè běn shū',fr:'ce livre'},{h:'这个词',p:'zhè ge cí',fr:'ce mot'}],
             v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'找',p:'zhǎo',fr:'chercher'},
                {h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'做',p:'zuò',fr:'faire'},
                {h:'看',p:'kàn',fr:'lire'},{h:'想',p:'xiǎng',fr:'chercher à retrouver'}],
             r:[{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},
                {h:'见',p:'jiàn',fr:'jusqu’à voir'},{h:'到',p:'dào',fr:'jusqu’à trouver'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'清楚',p:'qīng chu',fr:'jusqu’à bien saisir'},
                {h:'清楚',p:'qīng chu',fr:'jusqu’à bien distinguer'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'起来',p:'qǐ lái',fr:'jusqu’à le retrouver'}]}},

    {cadre:[{s:'s'},{s:'v'},{h:'得',p:'de'},{s:'r'},{h:'吗',p:'ma'},P('？')],
     fr:'Est-ce que … y arrive ?', lie:[['v','r']], libre:['s'],
     listes:{s:[{h:'你',p:'nǐ',fr:'tu'},{h:'他',p:'tā',fr:'il'}],
             v:[{h:'看',p:'kàn',fr:'lire'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'听',p:'tīng',fr:'entendre'},
                {h:'找',p:'zhǎo',fr:'chercher'},{h:'看',p:'kàn',fr:'lire'},
                {h:'吃',p:'chī',fr:'manger'},{h:'写',p:'xiě',fr:'écrire'},
                {h:'买',p:'mǎi',fr:'acheter'},{h:'听',p:'tīng',fr:'écouter'},
                {h:'看',p:'kàn',fr:'regarder'},{h:'做',p:'zuò',fr:'faire'}],
             r:[{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},{h:'懂',p:'dǒng',fr:'jusqu’à comprendre'},
                {h:'见',p:'jiàn',fr:'jusqu’à voir'},{h:'见',p:'jiàn',fr:'jusqu’à entendre'},
                {h:'到',p:'dào',fr:'jusqu’à trouver'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'完',p:'wán',fr:'jusqu’au bout'},{h:'完',p:'wán',fr:'jusqu’au bout'},
                {h:'到',p:'dào',fr:'jusqu’à l’obtenir'},{h:'清楚',p:'qīng chu',fr:'jusqu’à bien saisir'},
                {h:'清楚',p:'qīng chu',fr:'jusqu’à bien distinguer'},{h:'完',p:'wán',fr:'jusqu’au bout'}]}}
  ],

  transfo:[
    {consigne:'Passez du fait accompli à l’incapacité',
     de:{hz:'我看懂了这本书。',py:'wǒ kàn dǒng le zhè běn shū',fr:'J’ai compris ce livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},{h:'这本书',p:'zhè běn shū'},P('。')],fr:'Je n’arrive pas à comprendre ce livre.'}},
    {consigne:'Passez à la forme potentielle affirmative',
     de:{hz:'我看不懂这本书。',py:'wǒ kàn bu dǒng zhè běn shū',fr:'Je n’arrive pas à comprendre ce livre.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'这本书',p:'zhè běn shū'},P('。')],fr:'J’arrive à comprendre ce livre.'}},
    {consigne:'Posez la question par la forme alternative',
     de:{hz:'你看得懂。',py:'nǐ kàn de dǒng',fr:'Tu arrives à comprendre.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},P('？')],fr:'Arrives-tu à comprendre ?'}},
    {consigne:'Passez à l’incapacité, avec le complément de direction',
     de:{hz:'我拿出来了。',py:'wǒ ná chū lái le',fr:'Je l’ai sorti.'},
     vers:{seg:[{h:'我',p:'wǒ'},{h:'拿',p:'ná'},{h:'不',p:'bu'},{h:'出来',p:'chū lái'},P('。')],fr:'Je n’arrive pas à le sortir.'}},
    {consigne:'Placez ce dont on parle en tête',
     de:{hz:'我看不完这本书。',py:'wǒ kàn bu wán zhè běn shū',fr:'Je n’arriverai pas à finir ce livre.'},
     vers:{seg:[{h:'这本书',p:'zhè běn shū'},P('，'),{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'完',p:'wán'},P('。')],fr:'Ce livre, je n’arriverai pas à le finir.'}},
    {consigne:'Posez la question avec 吗',
     de:{hz:'你听得清楚。',py:'nǐ tīng de qīng chu',fr:'Tu entends bien.'},
     vers:{seg:[{h:'你',p:'nǐ'},{h:'听',p:'tīng'},{h:'得',p:'de'},{h:'清楚',p:'qīng chu'},{h:'吗',p:'ma'},P('？')],fr:'Tu entends bien ?'}}
  ],

  fixes:[
    {seg:[{h:'我',p:'wǒ'},{h:'不',p:'bú'},{h:'看',p:'kàn'},{h:'懂',p:'dǒng'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],bad:1,
     bon:'我看不懂这本书。',why:'不 se glisse entre le verbe et le résultat, jamais devant le verbe.'},
    {seg:[{h:'我',p:'wǒ'},{h:'不能',p:'bù néng'},{h:'看',p:'kàn'},{h:'懂',p:'dǒng'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],bad:1,
     bon:'我看不懂这本书。',why:'不能 dit un obstacle extérieur ; l’incapacité personnelle passe par la forme potentielle.'},
    {seg:[{h:'我',p:'wǒ'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},{h:'了',p:'le'},{h:'这本',p:'zhè běn'},{h:'书',p:'shū'},P('。')],bad:4,
     bon:'我看不懂这本书。',why:'La forme potentielle ne raconte aucun fait : elle ne se combine pas avec 了.'},
    {seg:[{h:'我',p:'wǒ'},{h:'拿',p:'ná'},{h:'出',p:'chū'},{h:'不',p:'bu'},{h:'来',p:'lái'},P('。')],bad:3,
     bon:'我拿不出来。',why:'不 précède le complément de direction entier : 出来 ne se coupe pas.'},
    {seg:[{h:'你',p:'nǐ'},{h:'看',p:'kàn'},{h:'得',p:'de'},{h:'懂',p:'dǒng'},{h:'吗',p:'ma'},{h:'看',p:'kàn'},{h:'不',p:'bu'},{h:'懂',p:'dǒng'},P('？')],bad:4,
     bon:'你看得懂看不懂？',why:'La forme alternative remplace 吗 : les cumuler est une faute.'},
    {seg:[{h:'这个',p:'zhè ge'},{h:'词',p:'cí'},{h:'我',p:'wǒ'},{h:'想',p:'xiǎng'},{h:'不',p:'bu'},{h:'起',p:'qǐ'},P('。')],bad:5,
     bon:'这个词，我想不起来。',why:'起来 ne se coupe pas davantage : 不 se met devant le bloc entier.'}
  ],

  reemploi:[
    {q:'Dites ce que vous arrivez et ce que vous n’arrivez pas à comprendre en chinois.',
     verif:[{type:'contient',v:'得',msg:'La capacité affirmée demande 得 entre le verbe et le résultat.'},
            {type:'contient',v:'不',msg:'L’incapacité demande 不 à la même place.'},
            {type:'contient',v:'懂',msg:'On attend le résultat 懂.'}],
     modeles:[{hz:'我听得懂老师的话，可是看不懂这本书。',py:'wǒ tīng de dǒng lǎo shī de huà, kě shì kàn bu dǒng zhè běn shū',fr:'Je comprends le professeur, mais pas ce livre.'}],
     criteres:['得 et 不 sont entre le verbe et le résultat','Aucun 不 devant le verbe','Aucun 了 dans la phrase']},
    {q:'Vous cherchez votre téléphone sans le trouver. Dites-le, puis demandez à quelqu’un s’il le voit.',
     verif:[{type:'contient',v:'找不到',msg:'Ne pas parvenir à trouver, c’est 找不到.'},
            {type:'un_parmi',v:['吗','看得见看不见'],msg:'On attend une question, avec 吗 ou par la forme alternative.'}],
     modeles:[{hz:'我找不到我的手机，你看得见吗？',py:'wǒ zhǎo bu dào wǒ de shǒu jī, nǐ kàn de jiàn ma',fr:'Je ne trouve pas mon téléphone, tu le vois ?'}],
     criteres:['不 est entre 找 et 到','La question emploie 吗 ou la forme alternative, jamais les deux']},
    {q:'Un mot vous échappe. Dites-le en plaçant le mot en tête de phrase.',
     verif:[{type:'contient',v:'想不起来',msg:'Le souvenir qui ne revient pas, c’est 想不起来.'},
            {type:'absent',v:'不想',msg:'不想 voudrait dire que vous n’en avez pas envie.'}],
     modeles:[{hz:'这个词，我想不起来。',py:'zhè ge cí, wǒ xiǎng bu qǐ lái',fr:'Ce mot, je n’arrive pas à le retrouver.'},
              {hz:'他的名字，我想不起来了。',py:'tā de míng zi, wǒ xiǎng bu qǐ lái le',fr:'Son nom, je n’arrive plus à le retrouver.'}],
     criteres:['Ce dont on parle est en tête, suivi d’une virgule','不 se place devant 起来 tout entier','想不起来 et non 不想起来']}
  ]
}


];

/* Publication explicite : les scripts sont classiques, une déclaration
   const ne rejoint pas window. */
window.GRAMMAR=GRAMMAR;
