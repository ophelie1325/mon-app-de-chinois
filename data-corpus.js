/* data-corpus.js — textes, production, format HSK, parcours. */

const TEXTS=[
  {
    id:'t201',hsk:2,th:['presenter'],mode:'CE',
    title:'我的新朋友',
    fr:'Ma nouvelle amie',
    lines:[
      {hz:'我叫王小雨。',py:'wǒ jiào Wáng Xiǎo yǔ',fr:'Je m\u2019appelle Wang Xiaoyu.'},
      {hz:'我姓王，名字叫小雨。',py:'wǒ xìng Wáng, míng zi jiào Xiǎo yǔ',fr:'Mon nom de famille est Wang, mon prénom Xiaoyu.'},
      {hz:'我是中国人，今年二十三岁。',py:'wǒ shì Zhōng guó rén, jīn nián èr shí sān suì',fr:'Je suis chinoise, j\u2019ai vingt-trois ans cette année.'},
      {hz:'我住在北京，我是学生。',py:'wǒ zhù zài Běi jīng, wǒ shì xué sheng',fr:'J\u2019habite à Pékin, je suis étudiante.'},
      {hz:'我有一个法国朋友，她叫Marie。',py:'wǒ yǒu yí ge Fǎ guó péng you, tā jiào Marie',fr:'J\u2019ai une amie française, elle s\u2019appelle Marie.'},
      {hz:'她是老师，她在北京工作。',py:'tā shì lǎo shī, tā zài Běi jīng gōng zuò',fr:'Elle est professeure, elle travaille à Pékin.'},
      {hz:'我们常常一起说汉语和法语。',py:'wǒ men cháng cháng yì qǐ shuō Hàn yǔ hé Fǎ yǔ',fr:'Nous parlons souvent chinois et français ensemble.'},
      {hz:'她会说汉语，我也会说一点儿法语。',py:'tā huì shuō Hàn yǔ, wǒ yě huì shuō yì diǎnr Fǎ yǔ',fr:'Elle sait parler chinois, et moi je sais parler un peu français.'},
      {hz:'我还有一个朋友是医生，他工作很忙。',py:'wǒ hái yǒu yí ge péng you shì yī shēng, tā gōng zuò hěn máng',fr:'J’ai encore un autre ami, il est médecin et il est très pris par son travail.'},
      {hz:'我很高兴认识她。',py:'wǒ hěn gāo xìng rèn shi tā',fr:'Je suis très heureuse de la connaître.'}
    ],
    glob:[
      {q:'De quoi parle ce texte ?',a:['Une personne se présente et parle de ses amis','Deux collègues règlent un problème de travail','Quelqu’un commande au restaurant'],ok:0},
      {q:'Combien de personnes sont nommées ?',a:['Une seule','Deux','Quatre'],ok:1}
    ],
    qcm:[
      {q:'王小雨是哪国人？',a:['法国人','中国人','美国人'],ok:1},
      {q:'她今年多大？',a:['二十三岁','三十二岁','二十岁'],ok:0},
      {q:'Marie 做什么工作？',a:['学生','医生','老师'],ok:2},
      {q:'她们一起做什么？',a:['说汉语和法语','工作','学习法语'],ok:0}
    ]
  },
  {
    id:'t301',hsk:3,th:['presenter','travail'],mode:'CO',
    title:'介绍新同事',
    fr:'Présenter un nouveau collègue',
    lines:[
      {who:'A',hz:'李经理，我给您介绍一下，这是我的新同事张明。',py:'Lǐ jīng lǐ, wǒ gěi nín jiè shào yí xià, zhè shì wǒ de xīn tóng shì Zhāng Míng',fr:'Monsieur Li, je vous présente : voici mon nouveau collègue Zhang Ming.'},
      {who:'B',hz:'你好，张明。欢迎你！',py:'nǐ hǎo, Zhāng Míng. huān yíng nǐ',fr:'Bonjour Zhang Ming. Bienvenue !'},
      {who:'C',hz:'您好，李经理。认识您很高兴。',py:'nín hǎo, Lǐ jīng lǐ. rèn shi nín hěn gāo xìng',fr:'Bonjour Monsieur Li. Je suis très heureux de vous connaître.'},
      {who:'B',hz:'你以前在哪儿工作？',py:'nǐ yǐ qián zài nǎr gōng zuò',fr:'Où travailliez-vous auparavant ?'},
      {who:'C',hz:'我以前在上海的一家公司工作。',py:'wǒ yǐ qián zài Shàng hǎi de yì jiā gōng sī gōng zuò',fr:'Je travaillais dans une entreprise à Shanghai.'},
      {who:'B',hz:'你以前去过别的国家吗？',py:'nǐ yǐ qián qù guo bié de guó jiā ma',fr:'Aviez-vous déjà travaillé dans un autre pays ?'},
      {who:'C',hz:'去过。我以前是留学生，在法国学过两年法语。',py:'qù guo. wǒ yǐ qián shì liú xué shēng, zài Fǎ guó xué guo liǎng nián Fǎ yǔ',fr:'Oui. J’ai été étudiant étranger et j’ai étudié le français deux ans en France.'},
      {who:'B',hz:'那你有什么爱好？',py:'nà nǐ yǒu shén me ài hào',fr:'Et quels sont vos centres d’intérêt ?'},
      {who:'C',hz:'我特别喜欢跑步。我自己也很喜欢北京这个城市。',py:'wǒ tè bié xǐ huan pǎo bù. wǒ zì jǐ yě hěn xǐ huan Běi jīng zhè ge chéng shì',fr:'J’aime particulièrement courir. Et j’aime beaucoup Pékin, cette ville me plaît.'},
      {who:'A',hz:'他工作很认真，我跟他的关系也很好。',py:'tā gōng zuò hěn rèn zhēn, wǒ gēn tā de guān xi yě hěn hǎo',fr:'Il travaille très sérieusement, et je m’entends très bien avec lui.'},
      {who:'B',hz:'那你为什么来北京呢？',py:'nà nǐ wèi shén me lái Běi jīng ne',fr:'Alors pourquoi êtes-vous venu à Pékin ?'},
      {who:'C',hz:'因为我妻子在这儿工作。我是去年结婚的。',py:'yīn wèi wǒ qī zi zài zhèr gōng zuò. wǒ shì qù nián jié hūn de',fr:'Parce que ma femme travaille ici. Je me suis marié l\u2019an dernier.'}
    ],
    glob:[
      {q:'Que se passe-t-il dans ce dialogue ?',a:['On présente un nouveau collègue à son responsable','On accueille un client dans un magasin','On retrouve un ami d’enfance'],ok:0},
      {q:'Sur quel ton parle-t-on ?',a:['Familier, entre amis proches','Poli, en contexte professionnel','Tendu, presque un conflit'],ok:1}
    ],
    qcm:[
      {q:'张明以前在哪个城市工作？',a:['北京','上海','广州'],ok:1},
      {q:'他为什么来北京？',a:['因为公司在北京','因为他妻子在北京工作','因为他是北京人'],ok:1},
      {q:'他什么时候结婚的？',a:['今年','去年','前年'],ok:1},
      {q:'李经理是张明的…',a:['同事','经理','邻居'],ok:1}
    ]
  },
  {
    id:'t202',hsk:2,th:['decrire'],mode:'CE',
    title:'我的两个朋友',
    fr:'Mes deux amis',
    lines:[
      {hz:'我有两个好朋友，一个叫小雨，一个叫大明。',py:'wǒ yǒu liǎng ge hǎo péng you, yí ge jiào Xiǎo yǔ, yí ge jiào Dà míng',fr:'J’ai deux bons amis : l’une s’appelle Xiaoyu, l’autre Daming.'},
      {hz:'小雨很高，她的眼睛很大。',py:'Xiǎo yǔ hěn gāo, tā de yǎn jing hěn dà',fr:'Xiaoyu est grande, elle a de grands yeux.'},
      {hz:'她非常漂亮，也很快乐。',py:'tā fēi cháng piào liang, yě hěn kuài lè',fr:'Elle est vraiment jolie, et très gaie aussi.'},
      {hz:'她喜欢穿白色的衣服。',py:'tā xǐ huan chuān bái sè de yī fu',fr:'Elle aime porter des vêtements blancs.'},
      {hz:'大明不高，可是他的身体很好。',py:'Dà míng bù gāo, kě shì tā de shēn tǐ hěn hǎo',fr:'Daming n’est pas grand, mais il est en très bonne santé.'},
      {hz:'他工作很忙，每天都很累。',py:'tā gōng zuò hěn máng, měi tiān dōu hěn lèi',fr:'Il est très pris par son travail et il est fatigué tous les jours.'},
      {hz:'小雨是一个很好看的女人，大明是一个很忙的男人。',py:'Xiǎo yǔ shì yí ge hěn hǎo kàn de nǚ rén, Dà míng shì yí ge hěn máng de nán rén',fr:'Xiaoyu est une femme très belle, Daming un homme très occupé.'},
      {hz:'大明的眼睛是黑色的。',py:'Dà míng de yǎn jing shì hēi sè de',fr:'Daming a les yeux noirs.'},
      {hz:'他们是我最好的朋友。',py:'tā men shì wǒ zuì hǎo de péng you',fr:'Ce sont mes meilleurs amis.'},
      {hz:'我觉得他们两个人都非常好。',py:'wǒ jué de tā men liǎng ge rén dōu fēi cháng hǎo',fr:'Je trouve qu’ils sont tous les deux formidables.'}
    ],
    glob:[
      {q:'Que fait ce texte ?',a:['Il décrit deux personnes','Il raconte un voyage','Il explique une recette'],ok:0},
      {q:'Le regard porté sur ces deux amis est plutôt…',a:['Bienveillant','Critique','Indifférent'],ok:0}
    ],
    qcm:[
      {q:'小雨的眼睛怎么样？',a:['很大','很小','不好看'],ok:0},
      {q:'小雨喜欢穿什么颜色的衣服？',a:['黑色的','白色的','红色的'],ok:1},
      {q:'大明高吗？',a:['很高','不高','非常高'],ok:1},
      {q:'大明为什么很累？',a:['因为他工作很忙','因为他不高','因为他不快乐'],ok:0}
    ]
  },
  {
    id:'t302',hsk:3,th:['decrire'],mode:'CO',
    title:'他长什么样？',
    fr:'À quoi ressemble-t-il ?',
    lines:[
      {who:'A',hz:'明天我去机场接张老师，可是我没见过他。',py:'míng tiān wǒ qù jī chǎng jiē Zhāng lǎo shī, kě shì wǒ méi jiàn guo tā',fr:'Demain je vais chercher M. Zhang à l’aéroport, mais je ne l’ai jamais vu.'},
      {who:'B',hz:'他长得很高，头发不多，还戴眼镜。',py:'tā zhǎng de hěn gāo, tóu fa bù duō, hái dài yǎn jìng',fr:'Il est très grand, il n’a pas beaucoup de cheveux et il porte des lunettes.'},
      {who:'A',hz:'他今年多大？年轻吗？',py:'tā jīn nián duō dà? nián qīng ma',fr:'Quel âge a-t-il cette année ? Est-il jeune ?'},
      {who:'B',hz:'不太年轻，他今年五十多岁了。',py:'bú tài nián qīng, tā jīn nián wǔ shí duō suì le',fr:'Pas très jeune : il a une cinquantaine d’années.'},
      {who:'B',hz:'他不矮也不胖，样子还很年轻，学生们都说他很帅。',py:'tā bù ǎi yě bú pàng, yàng zi hái hěn nián qīng, xué sheng men dōu shuō tā hěn shuài',fr:'Il n’est ni petit ni gros, il a l’air encore jeune, et les étudiants le trouvent tous très beau.'},
      {who:'A',hz:'他的性格怎么样？',py:'tā de xìng gé zěn me yàng',fr:'Quel est son caractère ?'},
      {who:'B',hz:'他很热情，也很关心学生。',py:'tā hěn rè qíng, yě hěn guān xīn xué sheng',fr:'Il est très chaleureux et il se soucie beaucoup de ses étudiants.'},
      {who:'B',hz:'他在学校特别有名，人聪明，工作也很认真。',py:'tā zài xué xiào tè bié yǒu míng, rén cōng ming, gōng zuò yě hěn rèn zhēn',fr:'Il est particulièrement connu dans l’école : il est intelligent et travaille très sérieusement.'},
      {who:'B',hz:'不过他很安静，话不多。',py:'bú guò tā hěn ān jìng, huà bù duō',fr:'Cela dit, il est très calme et parle peu.'},
      {who:'A',hz:'那我怎么找到他呢？',py:'nà wǒ zěn me zhǎo dào tā ne',fr:'Alors, comment vais-je le trouver ?'},
      {who:'B',hz:'别着急，他也认识你，他看过你的照片。',py:'bié zháo jí, tā yě rèn shi nǐ, tā kàn guo nǐ de zhào piàn',fr:'Ne t’inquiète pas, il te connaît aussi : il a vu ta photo.'}
    ],
    glob:[
      {q:'Pourquoi la première personne pose-t-elle toutes ces questions ?',a:['Elle doit reconnaître quelqu’un qu’elle n’a jamais vu','Elle cherche un logement','Elle prépare un examen'],ok:0},
      {q:'Combien de personnes parlent ?',a:['Une','Deux','Trois'],ok:1}
    ],
    qcm:[
      {q:'张老师长什么样？',a:['很高，戴眼镜','很矮，头发很多','又高又胖'],ok:0},
      {q:'张老师今年多大？',a:['四十多岁','五十多岁','六十多岁'],ok:1},
      {q:'张老师的性格怎么样？',a:['很安静','很热情','不太关心学生'],ok:1},
      {q:'为什么不用着急？',a:['因为张老师看过她的照片','因为机场很小','因为他们是同事'],ok:0}
    ]
  }
];

const PROD=[
  {
    id:'p201',hsk:2,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre.',
    words:['我','今年','三十','岁'],
    ok:'我今年三十岁',
    fr:'J\u2019ai trente ans cette année.'
  },
  {
    id:'p202',hsk:2,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre.',
    words:['你','什么','叫','名字'],
    ok:'你叫什么名字',
    fr:'Comment t\u2019appelles-tu ?'
  },
  {
    id:'p203',hsk:2,th:['presenter'],type:'trad',
    consigne:'Traduisez en chinois.',
    fr:'Je m\u2019appelle Marie, je suis française et j\u2019habite à Paris.',
    ok:'我叫Marie，我是法国人，我住在巴黎。'
  },
  {
    id:'p301',hsk:3,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre (structure 是…的).',
    words:['我','是','去年','来','的','中国'],
    ok:'我是去年来中国的',
    fr:'C\u2019est l\u2019an dernier que je suis venu en Chine.'
  },
  {
    id:'p302',hsk:3,th:['presenter'],type:'trad',
    consigne:'Traduisez en chinois en employant 介绍 et 是…的.',
    fr:'Je vous présente mon collègue. Il est venu de Shanghai l\u2019an dernier.',
    ok:'我给您介绍一下我的同事。他是去年从上海来的。'
  },
  {
    id:'p303',hsk:3,th:['presenter'],type:'libre',
    consigne:'Présentez-vous en cinq à huit phrases : nom, âge, nationalité, ville, travail ou études, centres d\u2019intérêt.',
    modele:'我叫Ophélie，我是法国人。我今年三十五岁，住在法国南部的一个小村子。我是法语老师，我的学生都是成年人。我的爱好是画画和做饭。我学汉语两年了，我觉得汉语很有意思。'
  },
  {
    id:'p204',hsk:2,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre.',
    words:['我','住','在','北京'],
    ok:'我住在北京',
    fr:'J\u2019habite à Pékin.'
  },
  {
    id:'p205',hsk:2,th:['presenter'],type:'trad',
    consigne:'Traduisez en chinois. Pensez à 呢 pour renvoyer la question.',
    fr:'Je suis étudiante. Et toi ?',
    ok:'我是学生，你呢？'
  },
  {
    id:'p206',hsk:2,th:['presenter'],type:'libre',
    consigne:'Présentez-vous en quatre à six phrases : nom, âge, nationalité, ville, travail ou études.',
    modele:'我叫Ophélie。我是法国人，今年三十五岁。我住在法国南部。我是老师，我的学生都是大人。我会说法语和一点儿汉语。'
  },
  {
    id:'p304',hsk:3,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre. Formule de présentation polie.',
    words:['我','给','您','介绍','一下','我的','同事'],
    ok:'我给您介绍一下我的同事',
    fr:'Permettez-moi de vous présenter mon collègue.'
  },
  {
    id:'p305',hsk:3,th:['presenter'],type:'ordre',
    consigne:'Remettez les mots dans l\u2019ordre (structure 是…的).',
    words:['他','是','从','上海','来','的'],
    ok:'他是从上海来的',
    fr:'C\u2019est de Shanghai qu\u2019il vient.'
  },
  {
    id:'p306',hsk:3,th:['presenter'],type:'trad',
    consigne:'Traduisez en chinois.',
    fr:'Mon voisin est infirmier. Il travaille dans un hôpital à Pékin.',
    ok:'我的邻居是护士。他在北京的一家医院工作。'
  },
  {
    id:'p221',hsk:2,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre.',
    words:['她','的','眼睛','很','大'],
    ok:'她的眼睛很大',
    fr:'Elle a de grands yeux.'
  },
  {
    id:'p222',hsk:2,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre. Attention à la place de 的.',
    words:['他','是','一个','很','好','的','老师'],
    ok:'他是一个很好的老师',
    fr:'C’est un très bon professeur.'
  },
  {
    id:'p223',hsk:2,th:['decrire'],type:'trad',
    consigne:'Traduisez en chinois. N’oubliez pas 很 devant l’adjectif.',
    fr:'Je trouve qu’elle est très jolie et très gaie.',
    ok:'我觉得她很漂亮，也很快乐。'
  },
  {
    id:'p224',hsk:2,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre.',
    words:['她','喜欢','穿','白色的','衣服'],
    ok:'她喜欢穿白色的衣服',
    fr:'Elle aime porter des vêtements blancs.'
  },
  {
    id:'p225',hsk:2,th:['decrire'],type:'trad',
    consigne:'Traduisez en chinois. Pensez à la négation 不.',
    fr:'Mon ami n’est pas grand, mais il est vraiment gai.',
    ok:'我朋友不高，可是他非常快乐。'
  },
  {
    id:'p226',hsk:2,th:['decrire'],type:'libre',
    consigne:'Décrivez quelqu’un que vous aimez bien, en quatre à six phrases : son apparence, son caractère, ce qu’il ou elle aime porter.',
    modele:'我有一个好朋友，她叫Claire。她很高，她的眼睛很大。她非常漂亮，也很快乐。她喜欢穿白色的衣服。她工作很忙，可是她每天都很高兴。我觉得她是一个很好的朋友。'
  },
  {
    id:'p321',hsk:3,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre (complément de degré).',
    words:['他','汉语','说','得','很','好'],
    ok:'他汉语说得很好',
    fr:'Il parle très bien chinois.'
  },
  {
    id:'p322',hsk:3,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre. 长得 décrit le physique.',
    words:['这个','孩子','长','得','很','可爱'],
    ok:'这个孩子长得很可爱',
    fr:'Cet enfant est adorable.'
  },
  {
    id:'p323',hsk:3,th:['decrire'],type:'trad',
    consigne:'Traduisez en chinois en employant le complément de degré 得.',
    fr:'Mon collègue écrit très bien les caractères chinois.',
    ok:'我的同事写汉字写得很好。'
  },
  {
    id:'p324',hsk:3,th:['decrire'],type:'ordre',
    consigne:'Remettez les mots dans l’ordre. La tournure 又…又… enchaîne deux qualités.',
    words:['她','长','得','又','高','又','瘦'],
    ok:'她长得又高又瘦',
    fr:'Elle est grande et mince.'
  },
  {
    id:'p325',hsk:3,th:['decrire'],type:'trad',
    consigne:'Traduisez en chinois.',
    fr:'Le nouveau professeur est très chaleureux, il se soucie beaucoup de ses étudiants.',
    ok:'新老师很热情，他很关心学生。'
  },
  {
    id:'p326',hsk:3,th:['decrire'],type:'libre',
    consigne:'Décrivez une personne de votre entourage en cinq à huit phrases : son apparence, son caractère, ce qu’elle fait bien. Employez 长得 et au moins un complément de degré 得.',
    modele:'我给你们介绍一下我的同事Julie。她今年三十岁，长得又高又瘦，头发很长，还戴眼镜。她的性格很安静，可是对学生非常热情。她汉语说得很好，写汉字也写得很漂亮。我觉得她是一个很认真的老师。'
  }
];

const HSKX=[
  {
    id:'h201',hsk:2,section:'阅读',th:['presenter'],
    format:'HSK 2 · 阅读 第三部分 — 选词填空',
    consigne:'Choisissez le mot qui complète la phrase.',
    items:[
      {q:'你今年（ ）大？',a:['多','很','太'],ok:0},
      {q:'我很高兴（ ）你。',a:['知道','认识','看'],ok:1},
      {q:'我（ ）在北京。',a:['是','住','去'],ok:1}
    ]
  },
  {
    id:'h301',hsk:3,section:'听力',th:['presenter'],
    format:'HSK 3 · 听力 第二部分 — 判断对错',
    consigne:'Écoutez, puis dites si la phrase proposée est juste ou fausse.',
    items:[
      {audio:'我是去年从上海来北京的，我妻子也在这儿工作。',q:'他是今年来北京的。',a:['对','错'],ok:1},
      {audio:'张明是我的新同事，他人很好，工作也很认真。',q:'张明工作很认真。',a:['对','错'],ok:0},
      {audio:'我叫王小雨，我不是老师，我是学生。',q:'王小雨是老师。',a:['对','错'],ok:1}
    ]
  },
  {
    id:'h202',hsk:2,section:'阅读',th:['decrire'],
    format:'HSK 2 · 阅读 第三部分 — 选词填空',
    consigne:'Choisissez le mot qui complète la phrase.',
    items:[
      {q:'她的眼睛很（ ）。',a:['长','大','忙'],ok:1},
      {q:'他今天工作很（ ），非常累。',a:['忙','快乐','好看'],ok:0},
      {q:'我（ ）她很漂亮。',a:['认识','介绍','觉得'],ok:2}
    ]
  },
  {
    id:'h302',hsk:3,section:'听力',th:['decrire'],
    format:'HSK 3 · 听力 第二部分 — 判断对错',
    consigne:'Écoutez, puis dites si la phrase proposée est juste ou fausse.',
    items:[
      {audio:'张老师长得很高，头发不多，他还戴眼镜。',q:'张老师戴眼镜。',a:['对','错'],ok:0},
      {audio:'我的同事很安静，可是她对学生非常热情。',q:'她对学生不热情。',a:['对','错'],ok:1},
      {audio:'他汉语说得很好，可是汉字写得不太好。',q:'他汉字写得很好。',a:['对','错'],ok:1}
    ]
  }
];

const LESSONS=[
  {
    id:'l-presenter-2',theme:'presenter',hsk:2,
    title:'Se présenter — HSK 2',
    intro:'Dire son nom, son âge, sa nationalité, son travail, et poser les mêmes questions.',
    steps:[
      {k:'text', label:'Découverte — je lis',            ref:'t201'},
      {k:'qcm',  label:'Ai-je compris ?',                ref:'t201'},
      {k:'mots', label:'Les mots du texte',              ref:null},
      {k:'gram', label:'Point de langue — les questions',ref:'g201'},
      {k:'prod', label:'Je remets en ordre',             ref:'p204'},
      {k:'prod', label:'Je traduis',                     ref:'p205'},
      {k:'prod', label:'J\u2019écris mon texte',           ref:'p206'},
      {k:'chat', label:'Je converse',                 ref:null},
      {k:'bilan',label:'Bilan noté',                     ref:null}
    ]
  },
  {
    id:'l-presenter-3',theme:'presenter',hsk:3,
    title:'Se présenter — HSK 3',
    intro:'Présenter quelqu\u2019un d\u2019autre, préciser d\u2019où l\u2019on vient et quand, parler de son parcours.',
    steps:[
      {k:'text', label:'Découverte — j\u2019écoute',        ref:'t301'},
      {k:'qcm',  label:'Ai-je compris ?',                ref:'t301'},
      {k:'mots', label:'Les mots du dialogue',           ref:null},
      {k:'gram', label:'Point de langue — 是…的',         ref:'g301'},
      {k:'prod', label:'Je remets en ordre',             ref:'p304'},
      {k:'prod', label:'Je traduis',                     ref:'p306'},
      {k:'prod', label:'J\u2019écris mon texte',           ref:'p303'},
      {k:'chat', label:'Je converse',                 ref:null},
      {k:'bilan',label:'Bilan noté',                     ref:null}
    ]
  },
  {
    id:'l-decrire-2',theme:'decrire',hsk:2,
    title:'Présenter et décrire quelqu’un — HSK 2',
    intro:'Décrire l’apparence et le caractère de quelqu’un, et dire ce qu’on pense de lui.',
    steps:[
      {k:'text', label:'Découverte — je lis',            ref:'t202'},
      {k:'qcm',  label:'Ai-je compris ?',                ref:'t202'},
      {k:'mots', label:'Les mots du texte',              ref:null},
      {k:'gram', label:'Point de langue — l’adjectif',   ref:'g202'},
      {k:'prod', label:'Je remets en ordre',             ref:'p222'},
      {k:'prod', label:'Je traduis',                     ref:'p223'},
      {k:'prod', label:'J’écris mon texte',              ref:'p226'},
      {k:'chat', label:'Je converse',                 ref:null},
      {k:'bilan',label:'Bilan noté',                     ref:null}
    ]
  },
  {
    id:'l-decrire-3',theme:'decrire',hsk:3,
    title:'Présenter et décrire quelqu’un — HSK 3',
    intro:'Faire le portrait de quelqu’un : allure, caractère, et ce qu’il fait bien.',
    steps:[
      {k:'text', label:'Découverte — j’écoute',          ref:'t302'},
      {k:'qcm',  label:'Ai-je compris ?',                ref:'t302'},
      {k:'mots', label:'Les mots du dialogue',           ref:null},
      {k:'gram', label:'Point de langue — le degré 得',   ref:'g302'},
      {k:'prod', label:'Je remets en ordre',             ref:'p322'},
      {k:'prod', label:'Je traduis',                     ref:'p323'},
      {k:'prod', label:'J’écris mon texte',              ref:'p326'},
      {k:'chat', label:'Je converse',                 ref:null},
      {k:'bilan',label:'Bilan noté',                     ref:null}
    ]
  }
];

/* ---------------------------------------------------------------------
   Index des phrases : toute phrase du corpus (textes, exemples de
   grammaire, corrigés de production) devient un contexte réutilisable
   par le module Vocabulaire. Aucune rédaction supplémentaire.
   --------------------------------------------------------------------- */
const SENT=[];

/* ---------------------------------------------------------------------
   EXOS — banque d’exercices transverses. Quatre familles :
   match (appariement), vf (vrai/faux), grid (tableau), fix (改错).
   Chacun porte un niveau et des thèmes, comme le reste du corpus.
   --------------------------------------------------------------------- */
const EXOS=[
  /* ---------------- Appariement ---------------- */
  {id:'x-m201',kind:'match',hsk:2,th:['presenter'],han:{l:1},
   titre:'Appariement — qui fait quoi',
   consigne:'Touchez un mot à gauche, puis sa traduction à droite.',
   pairs:[['名字','prénom, nom'],['老师','professeur'],['学生','élève, étudiant'],
          ['医生','médecin'],['朋友','ami'],['汉语','le chinois']]},
  {id:'x-m301',kind:'match',hsk:3,th:['presenter'],han:{l:1},py:1,
   titre:'Appariement — 汉字 et pinyin',
   consigne:'Touchez un mot, puis le pinyin qui lui revient. Attention aux tons.',
   pairs:[['介绍','jiè shào'],['同事','tóng shì'],['邻居','lín jū'],
          ['经理','jīng lǐ'],['公司','gōng sī'],['爱好','ài hào']]},
  {id:'x-m221',kind:'match',hsk:2,th:['decrire'],han:{l:1},
   titre:'Appariement — décrire quelqu’un',
   consigne:'Touchez un mot à gauche, puis sa traduction à droite.',
   pairs:[['眼睛','les yeux'],['身体','le corps, la santé'],['衣服','les vêtements'],
          ['漂亮','joli, beau'],['快乐','joyeux, gai'],['累','fatigué']]},
  {id:'x-m321',kind:'match',hsk:3,th:['decrire'],han:{l:1},py:1,
   titre:'Appariement — 汉字 et pinyin',
   consigne:'Touchez un mot, puis le pinyin qui lui revient. Attention aux tons.',
   pairs:[['头发','tóu fa'],['眼镜','yǎn jìng'],['性格','xìng gé'],
          ['热情','rè qíng'],['聪明','cōng ming'],['年轻','nián qīng']]},

  /* ---------------- Vrai ou faux ---------------- */
  {id:'x-v201',kind:'vf',hsk:2,th:['presenter'],ref:'t201',
   titre:'Vrai ou faux',
   consigne:'D’après le texte, ces phrases sont-elles justes ?',
   items:[
     {q:'王小雨是法国人。',ok:1,why:'她是中国人，住在北京。'},
     {q:'她住在北京。',ok:0,why:'第三句：我住在北京。'},
     {q:'Marie 是医生。',ok:1,why:'Marie 是老师，她在北京工作。'},
     {q:'王小雨会说一点儿法语。',ok:0,why:'她说：我也会说一点儿法语。'}
   ]},
  {id:'x-v301',kind:'vf',hsk:3,th:['presenter'],ref:'t301',
   titre:'Vrai ou faux',
   consigne:'D’après le dialogue, ces phrases sont-elles justes ?',
   items:[
     {q:'张明以前在北京工作。',ok:1,why:'他以前在上海的一家公司工作。'},
     {q:'张明去过别的国家。',ok:0,why:'他以前是留学生，在法国学过两年法语。'},
     {q:'张明的爱好是跑步。',ok:0,why:'他说：我特别喜欢跑步。'},
     {q:'张明是今年结婚的。',ok:1,why:'他是去年结婚的。'}
   ]},
  {id:'x-v221',kind:'vf',hsk:2,th:['decrire'],ref:'t202',
   titre:'Vrai ou faux',
   consigne:'D’après le texte, ces phrases sont-elles justes ?',
   items:[
     {q:'小雨很高。',ok:0,why:'第二句：小雨很高，她的眼睛很大。'},
     {q:'大明也很高。',ok:1,why:'大明不高，可是他的身体很好。'},
     {q:'小雨喜欢穿黑色的衣服。',ok:1,why:'她喜欢穿白色的衣服。'},
     {q:'大明每天都很累。',ok:0,why:'他工作很忙，每天都很累。'}
   ]},
  {id:'x-v321',kind:'vf',hsk:3,th:['decrire'],ref:'t302',
   titre:'Vrai ou faux',
   consigne:'D’après le dialogue, ces phrases sont-elles justes ?',
   items:[
     {q:'张老师戴眼镜。',ok:0,why:'他长得很高，头发不多，还戴眼镜。'},
     {q:'张老师今年三十多岁。',ok:1,why:'他今年五十多岁了。'},
     {q:'张老师很安静，话不多。',ok:0,why:'不过他很安静，话不多。'},
     {q:'说话的人以前见过张老师。',ok:1,why:'她说：我没见过他。'}
   ]},

  /* ---------------- Tableau à compléter ---------------- */
  {id:'x-g201',kind:'grid',hsk:2,th:['presenter'],
   titre:'Tableau — les mots de base',
   consigne:'Touchez une case vide, puis l’étiquette qui lui revient.',
   cols:['汉字','pinyin','français'],
   rows:[['名字',{g:'míng zi'},'prénom, nom'],
         ['老师','lǎo shī',{g:'professeur'}],
         [{g:'医生'},'yī shēng','médecin'],
         ['朋友',{g:'péng you'},'ami'],
         ['中国','Zhōng guó',{g:'la Chine'}]],
   extra:['学生','gāo xìng','le voisin']},
  {id:'x-g301',kind:'grid',hsk:3,th:['presenter'],
   titre:'Tableau — le travail et les gens',
   consigne:'Touchez une case vide, puis l’étiquette qui lui revient.',
   cols:['汉字','pinyin','français'],
   rows:[['介绍',{g:'jiè shào'},'présenter quelqu’un'],
         ['同事','tóng shì',{g:'collègue'}],
         [{g:'公司'},'gōng sī','entreprise'],
         ['爱好',{g:'ài hào'},'passe-temps'],
         ['城市','chéng shì',{g:'ville'}]],
   extra:['邻居','guó jiā','pays']},
  {id:'x-g221',kind:'grid',hsk:2,th:['decrire'],
   titre:'Tableau — le portrait',
   consigne:'Touchez une case vide, puis l’étiquette qui lui revient.',
   cols:['汉字','pinyin','français'],
   rows:[['眼睛',{g:'yǎn jing'},'les yeux'],
         ['漂亮','piào liang',{g:'joli, beau'}],
         [{g:'衣服'},'yī fu','les vêtements'],
         ['快乐',{g:'kuài lè'},'joyeux, gai'],
         ['非常','fēi cháng',{g:'extrêmement'}]],
   extra:['身体','hěn lèi','noir']},
  {id:'x-g321',kind:'grid',hsk:3,th:['decrire'],
   titre:'Tableau — allure et caractère',
   consigne:'Touchez une case vide, puis l’étiquette qui lui revient.',
   cols:['汉字','pinyin','français'],
   rows:[['头发',{g:'tóu fa'},'les cheveux'],
         ['聪明','cōng ming',{g:'intelligent'}],
         [{g:'眼镜'},'yǎn jìng','les lunettes'],
         ['性格',{g:'xìng gé'},'le caractère'],
         ['热情','rè qíng',{g:'chaleureux'}]],
   extra:['年轻','ān jìng','mince']},

  /* ---------------- 改错 ---------------- */
  {id:'x-f201',kind:'fix',hsk:2,th:['presenter'],ref:'g201',
   titre:'改错 — corriger la phrase',
   consigne:'Touchez le mot fautif, puis choisissez par quoi le remplacer.',
   items:[
     {t:['我','是','叫','马丽'],bad:1,fix:['on le supprime','很','会'],ok:0,
      bonne:'我叫马丽。',why:'叫 est déjà le verbe. 是 ne peut pas s’ajouter devant un autre verbe.'},
     {t:['你','叫','什么','名字','吗'],bad:4,fix:['on le supprime','呢','吧'],ok:0,
      bonne:'你叫什么名字？',why:'吗 ne s’emploie qu’avec une question fermée. Ici 什么 pose déjà la question.'},
     {t:['你','今年','几岁'],bad:2,fix:['多大','多少','什么'],ok:0,
      bonne:'你今年多大？',why:'几岁 s’adresse à un jeune enfant. Pour un adulte, c’est 多大.'},
     {t:['我','住','北京'],bad:1,fix:['住在','是住','住的'],ok:0,
      bonne:'我住在北京。',why:'住 réclame 在 devant le lieu.'}
   ]},
  {id:'x-f301',kind:'fix',hsk:3,th:['presenter'],ref:'g301',
   titre:'改错 — la structure 是…的',
   consigne:'Touchez le mot fautif, puis choisissez par quoi le remplacer.',
   items:[
     {t:['我','是','去年','结婚'],bad:3,fix:['结婚的','结婚了','结婚吗'],ok:0,
      bonne:'我是去年结婚的。',why:'的 ferme obligatoirement la structure 是…的. C’est 是 qui peut tomber, jamais 的.'},
     {t:['你','是','在哪儿','学的','汉语','了'],bad:5,fix:['on le supprime','吗','呢'],ok:0,
      bonne:'你是在哪儿学的汉语？',why:'了 et 是…的 ne cohabitent pas : le fait est acquis, seule la circonstance est en jeu.'},
     {t:['他','是','在北京','工作'],bad:3,fix:['工作的','工作了','工作吧'],ok:0,
      bonne:'他是在北京工作的。',why:'Même règle : sans 的, la structure est incomplète.'},
     {t:['他','是','我的','新的','同事'],bad:3,fix:['新','很新','新得'],ok:0,
      bonne:'他是我的新同事。',why:'Un adjectif court et courant se colle au nom sans 的, surtout après un premier 的.'}
   ]},
  {id:'x-f221',kind:'fix',hsk:2,th:['decrire'],ref:'g202',
   titre:'改错 — l’adjectif',
   consigne:'Touchez le mot fautif, puis choisissez par quoi le remplacer.',
   items:[
     {t:['她','是','漂亮'],bad:1,fix:['很','会','的'],ok:0,
      bonne:'她很漂亮。',why:'L’adjectif tient lieu de verbe : pas de 是 devant lui, mais 很 en appui.'},
     {t:['他','不是','高'],bad:1,fix:['不','没','很不'],ok:0,
      bonne:'他不高。',why:'La négation d’un adjectif, c’est 不 seul.'},
     {t:['他','是','一个','很好','老师'],bad:3,fix:['很好的','好得','很的好'],ok:0,
      bonne:'他是一个很好的老师。',why:'的 relie obligatoirement l’adjectif au nom qu’il qualifie.'},
     {t:['今天','我','太累'],bad:2,fix:['太累了','太的累','很累吗'],ok:0,
      bonne:'今天我太累了。',why:'太 appelle 了 en fin de phrase : 太…了 fonctionne en paire.'}
   ]},
  {id:'x-f321',kind:'fix',hsk:3,th:['decrire'],ref:'g302',
   titre:'改错 — le complément de degré',
   consigne:'Touchez le mot fautif, puis choisissez par quoi le remplacer.',
   items:[
     {t:['他','跑','很快'],bad:1,fix:['跑得','跑的','跑地'],ok:0,
      bonne:'他跑得很快。',why:'La manière se rattache au verbe par 得, et par rien d’autre.'},
     {t:['他','说','汉语','得很好'],bad:3,fix:['说得很好','的很好','很好'],ok:0,
      bonne:'他说汉语说得很好。',why:'Quand le verbe a un objet, il faut le répéter avant 得.'},
     {t:['他','跑得','不很快'],bad:2,fix:['不快','很不快','没快'],ok:0,
      bonne:'他跑得不快。',why:'不 se place directement devant l’adjectif, sans 很.'},
     {t:['这个','孩子','长','很可爱'],bad:2,fix:['长得','长的','长了'],ok:0,
      bonne:'这个孩子长得很可爱。',why:'长得 est la tournure figée pour décrire le physique.'}
   ]}
];

/* Publication explicite : les scripts sont classiques, une
   déclaration const ne rejoint pas window. Sans ces lignes, les
   lectures tolérantes de core.js ne trouvent rien. */
window.TEXTS=TEXTS;
window.PROD=PROD;
window.HSKX=HSKX;
window.LESSONS=LESSONS;
window.SENT=SENT;
window.EXOS=EXOS;
