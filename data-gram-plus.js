/* =====================================================================
   data-gram-plus.js — compléments des fiches de grammaire (lot 4)

   GRAM_PAIRES : « choisir entre deux structures ». Chaque paire oppose
   deux mots clés de fiches ; les phrases viennent des banques des
   fiches (le mot clé y est la case « cle »). Ne sont gardées que les
   phrases où, le sens français étant donné, un seul des deux mots
   convient : celles où l’autre donnerait aussi une phrase correcte
   sont écartées (exclu, par la traduction française de la phrase).

   GRAM_ORDRE : « de l’ordre français à l’ordre chinois ». Pour un
   exemple de fiche (clé : la phrase chinoise exacte), les morceaux dans
   l’ordre français, chacun avec sa part de chinois et son rang dans la
   phrase chinoise. Les morceaux chinois, remis dans leur rang, refont
   la phrase exactement ; le pinyin est pris dans l’exemple lui-même.
   ===================================================================== */
const GRAM_PAIRES=[
  {a:{g:'g313',t:'就'},b:{g:'g313',t:'才'},
   exclu:['Un an m’a suffi.','Je n’ai appris qu’un an.','Il n’a dormi que quatre heures.','Te voilà enfin !','Pas question que j’y aille !']},
  {a:{g:'g303',t:'没'},b:{g:'g202',t:'不'},exclu:[]},
  {a:{g:'g317',t:'地'},b:{g:'g302',t:'得'},exclu:[]},
  {a:{g:'g208',t:'比'},b:{g:'g208',t:'没有'},exclu:[]},
  {a:{g:'g322',t:'还是'},b:{g:'g322',t:'或者'},
   exclu:['Allons-y plutôt demain.','Ce serait mieux que ce soit toi qui y ailles.','Du thé ou du café, l’un ou l’autre me va.']},
  {a:{g:'g320',t:'被'},b:{g:'g307',t:'把'},exclu:[]},
  {a:{g:'g314',t:'就'},b:{g:'g314',t:'才'},
   exclu:['Si tu viens, je t’attendrai à la maison.','Si j’ai le temps, j’irai te voir.','Si tu y vas, j’y vais.']}
];

const GRAM_ORDRE={
  '我在家吃饭。':[['Je','我',0],['mange','吃饭',2],['à la maison','在家',1]],
  '他在图书馆看书。':[['Il','他',0],['lit','看书',2],['à la bibliothèque','在图书馆',1]],
  '我们在公园等你。':[['Nous','我们',0],['t’attendons','等你',2],['au parc','在公园',1]],
  '明天我们在饭馆吃饭。':[['Demain','明天',0],['nous','我们',1],['mangeons','吃饭',3],['au restaurant','在饭馆',2]],
  '他晚上在公司工作。':[['Le soir','晚上',1],['il','他',0],['travaille','工作',3],['au bureau','在公司',2]],
  '我三天没吃饭了。':[['Je','我',0],['n’ai pas mangé','没吃饭了',2],['depuis trois jours','三天',1]],
  '我一年没见他了。':[['Je','我',0],['ne l’ai pas vu','没见他了',2],['depuis un an','一年',1]],
  '昨天我看了两个小时电视。':[['Hier','昨天',0],['j’ai regardé','我看了',1],['la télévision','电视',3],['deux heures','两个小时',2]],
  '请把门关上。':[['Ferme','关上',2],['la porte','把门',1],['s’il te plaît','请',0]],
  '把书给我。':[['Passe-moi','给我',1],['le livre','把书',0]],
  '我的手机被偷了。':[['On m’a volé','被偷了',1],['mon téléphone','我的手机',0]]
};
