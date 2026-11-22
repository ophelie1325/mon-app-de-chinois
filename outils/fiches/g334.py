# -*- coding: utf-8 -*-
"""g334 — Ce qui arrive, ce qui continue (rattrapage HSK 3).
Apparition et disparition (前面来了一个人, 冰箱里少了两个鸡蛋),
下去 de continuation, 下来 de fixation ou d’arrêt, 上 d’atteinte,
住, 走, 出 de résultat (记住, 拿走, 想出).
Limite avec g508 : les états qui changent (静下来, 瘦下去, 热起来) n’y sont pas.
Usage : python3 outils/fiches/g334.py [--banque] [--tout] [--poser]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from gram_lib import *

# ---------------------------------------------------------------------
# Écrans
# ---------------------------------------------------------------------
steps = [
  ecran('Quelqu’un arrive : 前面来了一个人', [
    'Pour dire qu’une personne ou une chose <b>apparaît</b> quelque part, le chinois pose d’abord le lieu, puis le verbe, puis ce qui apparaît : 前面<b>来了</b>一个人 — <i>quelqu’un arrive, là devant</i>.',
    'Le français dit « un homme arrive », ou, plus rarement, « il arrive un homme ». Le chinois choisit toujours le second ordre : le nouveau venu se place <b>après</b> le verbe. 我们班<b>来了</b>一个新同学.',
    'Ce qui suit le verbe est indéfini : 一个, 几个, 一家. C’est la règle de 有 (fiche 315). 桌子上有一本书 dit ce qui est là ; 家里<b>来了</b>几个客人 dit ce qui vient d’arriver.',
    'Le verbe porte 了, ou un complément de direction : 楼下<b>开了</b>一家咖啡馆, 对面<b>搬来了</b>一家人. Une personne déjà connue, elle, repasse devant le verbe : 你朋友来了.'],
    [EX('前面来了一个人。', 'qián miàn lái le yí ge rén', 'Quelqu’un arrive, là devant.'),
     EX('我们班来了一个新同学。', 'wǒ men bān lái le yí ge xīn tóng xué', 'Un nouvel élève est arrivé dans notre classe.'),
     EX('楼下开了一家咖啡馆。', 'lóu xià kāi le yì jiā kā fēi guǎn', 'Un café a ouvert en bas de chez nous.')],
    {'q': '前面来了一个人 veut dire :', 'a': ['quelqu’un arrive, là devant', 'la personne qu’on attendait est arrivée'], 'ok': 0,
     'why': 'Après le verbe, le nouveau venu est inconnu. Une personne connue se placerait devant : 他来了.'}),

  ecran('Quelque chose disparaît : 走了, 少了', [
    'Le même moule dit une <b>disparition</b> : le lieu, le verbe, puis ce qui s’en va. 我们班<b>走了</b>两个同学 — <i>deux élèves ont quitté notre classe</i>.',
    'Les verbes de la disparition sont peu nombreux : <b>走</b>, <b>搬走</b>, <b>少</b>, <b>关</b>, <b>死</b>. 冰箱里<b>少了</b>两个鸡蛋 — <i>il manque deux œufs dans le frigo</i>.',
    'Le français dit « il manque », « il est parti » : un « il » vide, puis la chose. Le chinois met le lieu en tête, sans 在 : 楼上<b>搬走了</b>一家人, et non 在楼上搬走了一家人.',
    '少 compte aussi l’argent et les objets : 我的钱包里<b>少了</b>一百块 — <i>il manque cent yuans dans mon porte-monnaie</i>. On le dit souvent en cherchant le coupable.'],
    [EX('我们班走了两个同学。', 'wǒ men bān zǒu le liǎng ge tóng xué', 'Deux élèves ont quitté notre classe.'),
     EX('冰箱里少了两个鸡蛋。', 'bīng xiāng lǐ shǎo le liǎng ge jī dàn', 'Il manque deux œufs dans le frigo.'),
     EX('楼上搬走了一家人。', 'lóu shàng bān zǒu le yì jiā rén', 'Une famille a déménagé, à l’étage du dessus.')],
    {'q': '我们班走了两个同学 veut dire :', 'a': ['deux élèves ont quitté notre classe', 'deux élèves marchent dans notre classe'], 'ok': 0,
     'why': 'Dans ce moule, 走 dit un départ : ce qui s’en va suit le verbe.'}),

  ecran('Continuer : 说下去, 看下去', [
    'Au sens propre, <b>下去</b> dit qu’on descend en s’éloignant (fiche 308). Au figuré, il dit qu’une action <b>continue</b>, de maintenant vers la suite : 你说<b>下去</b> — <i>continuez, je vous écoute</i>.',
    'Le français ajoute un verbe : « continuer à lire ». Le chinois colle 下去 derrière le verbe qui se poursuit : 这本书很有意思，我想看<b>下去</b>.',
    'On l’appuie souvent avec 要 ou 继续 : 我们要坚持<b>下去</b> — <i>il faut tenir bon</i>. 继续学<b>下去</b>, c’est ne pas abandonner ses études.',
    '下去 ne prend pas d’objet derrière lui : on ne dit pas 看下去这本书. L’objet passe en tête : 这份工作，我不想做<b>下去</b>了 — <i>ce travail, je ne veux pas continuer</i>.'],
    [EX('你说下去。', 'nǐ shuō xià qù', 'Continuez, je vous écoute.'),
     EX('这本书很有意思，我想看下去。', 'zhè běn shū hěn yǒu yì si, wǒ xiǎng kàn xià qù', 'Ce livre est passionnant, je veux continuer à le lire.'),
     EX('我们要坚持下去。', 'wǒ men yào jiān chí xià qù', 'Il faut tenir bon.')],
    {'q': '« Je veux continuer à lire ce livre » se dit :', 'a': ['这本书我想看下去。', '我想看下去这本书。'], 'ok': 0,
     'why': '下去 ne prend pas d’objet derrière lui : l’objet passe en tête.'}),

  ecran('Garder, s’arrêter : 记下来, 停下来', [
    '<b>下来</b> regarde dans l’autre sens : ce qui passait <b>reste</b>, se fixe. 请把电话号码记<b>下来</b> — <i>notez le numéro</i> : il ne s’envolera plus.',
    'Le français dit « noter », « photographier », « mettre de côté ». Le chinois dit le geste, puis 下来 : 写<b>下来</b>, 拍<b>下来</b>, 存<b>下来</b>. Avec un objet, 把 le place devant (fiche 307) : 我把这张照片存<b>下来</b>了.',
    '下来 dit aussi qu’on s’arrête ou qu’on reste : 车停<b>下来</b>了 — <i>la voiture s’est arrêtée</i> ; 他在北京留<b>下来</b>了 — <i>il est resté à Pékin</i>.',
    'Opposez-le à 下去 : <b>下来</b> va du passé jusqu’à maintenant, <b>下去</b> de maintenant vers la suite. 我坚持<b>下来</b>了 — <i>j’ai tenu jusqu’au bout</i> ; 我要坚持<b>下去</b> — <i>je vais continuer</i>.'],
    [EX('请把电话号码记下来。', 'qǐng bǎ diàn huà hào mǎ jì xià lái', 'Notez le numéro, s’il vous plaît.'),
     EX('车停下来了。', 'chē tíng xià lái le', 'La voiture s’est arrêtée.'),
     EX('学汉语很难，可是我坚持下来了。', 'xué Hàn yǔ hěn nán, kě shì wǒ jiān chí xià lái le', 'Apprendre le chinois est difficile, mais j’ai tenu bon.')],
    {'q': '我坚持下来了 veut dire :', 'a': ['j’ai tenu jusqu’au bout', 'je vais continuer'], 'ok': 0,
     'why': '下来 va du passé jusqu’à maintenant. « Je vais continuer », c’est 我要坚持下去.'}),

  ecran('Atteindre : 考上, 赶上, 爱上', [
    '<b>上</b> derrière un verbe dit qu’on <b>atteint</b> ce qu’on visait : 他<b>考上</b>了北京大学 — <i>il a été reçu à l’université de Pékin</i>.',
    'Le français a deux verbes, « passer » et « être reçu ». Le chinois garde 考 et ajoute l’issue, qui reste à la négative : 他没考<b>上</b> — <i>il n’a pas été reçu</i>. De même 赶<b>上</b>, « arriver à temps », et 追<b>上</b>, « rattraper ».',
    'Avec un sentiment, 上 dit qu’il naît et s’installe : 他<b>爱上</b>了这个城市 — <i>il est tombé amoureux de cette ville</i>. 喜欢<b>上</b>, c’est « se mettre à aimer ».',
    'Le même 上 ferme ou recouvre : 关<b>上</b>, 穿<b>上</b>, 戴<b>上</b>. Il dit que la porte est bien fermée, que le manteau est bien mis : 请把门关<b>上</b>.'],
    [EX('他考上了北京大学。', 'tā kǎo shàng le Běi jīng dà xué', 'Il a été reçu à l’université de Pékin.'),
     EX('我们赶上了最后一班地铁。', 'wǒ men gǎn shàng le zuì hòu yì bān dì tiě', 'Nous avons attrapé le dernier métro.'),
     EX('请把门关上。', 'qǐng bǎ mén guān shàng', 'Fermez la porte, s’il vous plaît.')],
    {'q': '他没考上 veut dire :', 'a': ['il n’a pas passé l’examen', 'il a passé l’examen, sans être reçu'], 'ok': 1,
     'why': '考 dit l’examen, 上 la réussite. 没考上 nie la réussite, pas l’examen.'}),

  ecran('Retenir, tenir : 记住, 接住', [
    '<b>住</b> derrière un verbe dit que la chose <b>tient</b> : elle ne bouge plus, elle ne s’échappe plus. 请记<b>住</b>我的电话号码 — <i>retenez mon numéro</i>.',
    'Le français dit « retenir » d’un seul verbe. Le chinois dit l’effort, 记, puis le résultat, 住 : le numéro reste. 记 seul ne garantit rien : 我记了，可是没记<b>住</b>.',
    'D’autres verbes le prennent : 接<b>住</b>, « attraper au vol », 抓<b>住</b>, « saisir », 站<b>住</b>, « s’arrêter net ». 他接<b>住</b>了球 — <i>il a attrapé le ballon</i>.',
    'La forme potentielle est très fréquente (fiche 310) : 这么多生词，我<b>记不住</b> — <i>je n’arrive pas à retenir autant de mots</i>. 不记住 ne se dit pas.'],
    [EX('请记住我的电话号码。', 'qǐng jì zhù wǒ de diàn huà hào mǎ', 'Retenez mon numéro, s’il vous plaît.'),
     EX('我记了，可是没记住。', 'wǒ jì le, kě shì méi jì zhù', 'J’ai essayé de le retenir, mais ça n’est pas resté.'),
     EX('这么多生词，我记不住。', 'zhè me duō shēng cí, wǒ jì bu zhù', 'Je n’arrive pas à retenir autant de mots.')],
    {'q': '« Je n’arrive pas à retenir son nom » se dit :', 'a': ['他的名字我记不住。', '他的名字我不记住。'], 'ok': 0,
     'why': 'L’impossibilité se dit par la forme potentielle : 记不住.'}),

  ecran('Emporter : 拿走, 带走', [
    '<b>走</b> derrière un verbe dit que la chose <b>s’en va</b> avec quelqu’un : 谁把我的书拿<b>走</b>了？ — <i>qui a pris mon livre ?</i>',
    'Le français dit « emporter », « enlever », « prendre ». Le chinois choisit le geste, puis ajoute 走 : 拿<b>走</b> à la main, 带<b>走</b> avec soi, 搬<b>走</b> un meuble, 开<b>走</b> une voiture.',
    'Ne le confondez pas avec 拿去 (fiche 308), qui dit de quel côté va la chose : 拿去吧 — <i>tiens, prends-le</i>. 拿走 dit seulement qu’elle n’est plus là.',
    'Au comptoir, on vous demande : 在这儿吃还是带<b>走</b>？ — <i>sur place ou à emporter ?</i> Au restaurant, pour les restes : 这些菜可以带<b>走</b>吗？'],
    [EX('谁把我的书拿走了？', 'shéi bǎ wǒ de shū ná zǒu le', 'Qui a pris mon livre ?'),
     EX('他把车开走了。', 'tā bǎ chē kāi zǒu le', 'Il est parti avec la voiture.'),
     EX('在这儿吃还是带走？', 'zài zhèr chī hái shi dài zǒu', 'Sur place ou à emporter ?')],
    {'q': '他把车开走了 veut dire :', 'a': ['il est parti avec la voiture', 'il a ouvert la portière de la voiture'], 'ok': 0,
     'why': '开 conduit, 走 dit que la voiture n’est plus là.'}),

  ecran('Faire apparaître : 想出, 看出, 听出', [
    '<b>出</b> derrière un verbe fait <b>sortir</b> ce qui était caché : 他想<b>出</b>了一个好办法 — <i>il a trouvé une bonne solution</i>, à force d’y réfléchir.',
    'Le français dit « trouver », « deviner », « reconnaître ». Le chinois dit le moyen, puis 出 : 看<b>出</b> en regardant, 听<b>出</b> à l’oreille, 尝<b>出</b> au goût. 你看<b>出</b>他不高兴了吗？',
    'On ajoute souvent 来, surtout sans objet : 我看<b>出来</b>了 — <i>je m’en suis aperçu</i> ; 我听<b>出来</b>了，是你 — <i>j’ai reconnu ta voix</i>.',
    'Ne le confondez pas avec 想起来 (fiche 309) : 想<b>起来</b> retrouve un souvenir, 想<b>出</b> invente du neuf. 我想起来了 — <i>ça me revient</i> ; 我想出来了 — <i>j’ai trouvé</i>.'],
    [EX('他想出了一个好办法。', 'tā xiǎng chū le yí ge hǎo bàn fǎ', 'Il a trouvé une bonne solution.'),
     EX('你看出他不高兴了吗？', 'nǐ kàn chū tā bù gāo xìng le ma', 'Vous avez remarqué qu’il n’était pas content ?'),
     EX('我听出来了，是你。', 'wǒ tīng chū lái le, shì nǐ', 'J’ai reconnu ta voix : c’est toi.')],
    {'q': '我想起来了 et 我想出来了 :', 'a': ['disent la même chose', 'opposent un souvenir qui revient et une idée neuve'], 'ok': 1,
     'why': '想起来 retrouve ce qu’on savait ; 想出来 trouve ce qu’on ne savait pas.'}),

  ecran('À l’oral — 这样下去, 站住, 记住了, 来了个人', [
    '<b>这样下去</b> annonce une suite inquiétante : 这样下去可不行 — <i>ça ne peut pas continuer comme ça</i>. On ajoute ce qu’on craint : 这样下去，你会累坏的.',
    'Pour arrêter quelqu’un : <b>站住</b> ! — <i>halte !</i> Pour vérifier qu’on a compris : 记住了吗？ — 记住了. La réponse reprend le verbe et son résultat, sans sujet.',
    'Pour relancer quelqu’un qui hésite : 你说<b>下去</b>, ou 接着说 — <i>continue</i>. Et pour l’inverse, ce qui ne finit pas : 他一说就停不<b>下来</b>.',
    'Le moule de l’apparition vit aussi à l’oral, où 一 tombe devant 个 : 刚才<b>来了个人</b>找你 — <i>quelqu’un est passé te voir tout à l’heure</i>.'],
    [EX('这样下去可不行。', 'zhè yàng xià qù kě bù xíng', 'Ça ne peut pas continuer comme ça.', reg='oral'),
     EX('站住！', 'zhàn zhù', 'Halte !', reg='oral'),
     EX('记住了吗？——记住了。', 'jì zhù le ma? —— jì zhù le', 'C’est retenu ? — C’est retenu.', reg='oral'),
     EX('刚才来了个人找你。', 'gāng cái lái le ge rén zhǎo nǐ', 'Quelqu’un est passé te voir tout à l’heure.', reg='oral')],
    {'q': 'Un ami vous raconte un souci, puis s’interrompt. Vous l’encouragez à continuer :', 'a': ['你说下去。', '你说下来。'], 'ok': 0,
     'why': 'Ce qui se poursuit vers la suite prend 下去 ; 下来 fixe ou arrête.'},
    reg='oral'),
]

# ---------------------------------------------------------------------
# Tableau, piège
# ---------------------------------------------------------------------
tableau = {'cols': ['Construction', 'Exemple', 'Ce qu’elle fait'], 'rows': [
  ['Lieu + V + 了 + nouveau venu', '前面来了一个人', 'Quelqu’un apparaît'],
  ['Lieu + 开了 + 一家…', '楼下开了一家咖啡馆', 'Un commerce ouvre'],
  ['Lieu + 搬来了 + …', '对面搬来了一家人', 'Une arrivée'],
  ['À l’oral : 来了个…', '刚才来了个人找你', '一 tombe devant 个'],
  ['Personne connue : devant', '你朋友来了', 'Jamais après le verbe'],
  ['有 + chose (fiche 315)', '桌子上有一本书', 'Ce qui est là'],
  ['Lieu + 走了 + …', '我们班走了两个同学', 'Un départ'],
  ['Lieu + 少了 + …', '冰箱里少了两个鸡蛋', 'Ce qui manque'],
  ['Lieu + 搬走了 + …', '楼上搬走了一家人', 'Un déménagement'],
  ['V + 下去', '你说下去', 'Continuer'],
  ['Objet en tête + V + 下去', '这本书我想看下去', 'Jamais 看下去这本书'],
  ['要 + 坚持下去', '我们要坚持下去', 'Tenir bon, pour la suite'],
  ['这样下去', '这样下去可不行', 'Une suite inquiétante'],
  ['把 + objet + V + 下来', '请把电话号码记下来', 'Fixer, garder une trace'],
  ['停下来, 留下来', '车停下来了', 'S’arrêter, rester'],
  ['坚持下来', '我坚持下来了', 'Tenu jusqu’à maintenant'],
  ['V + 上 : atteindre', '他考上了北京大学', 'Être reçu'],
  ['没 + V + 上', '他没考上', '上 reste, 了 tombe'],
  ['爱上, 喜欢上', '他爱上了这个城市', 'Un sentiment qui naît'],
  ['把 + objet + V + 上', '请把门关上', 'Fermer, recouvrir'],
  ['V + 住', '请记住我的电话号码', 'Retenir, tenir'],
  ['V + 不住', '这么多生词，我记不住', 'Ne pas arriver à retenir'],
  ['V + 走', '谁把我的书拿走了？', 'Emporter, enlever'],
  ['带走', '在这儿吃还是带走？', 'À emporter'],
  ['V + 出', '他想出了一个好办法', 'Faire apparaître'],
  ['看出来, 听出来', '我看出来了', 'S’apercevoir, reconnaître'],
  ['想起来 (fiche 309)', '我想起来了', 'Un souvenir, pas une idée neuve'],
]}

piege = {
  'bad': {'hz': '一个新同学来了我们班。', 'py': 'yí ge xīn tóng xué lái le wǒ men bān'},
  'good': {'hz': '我们班来了一个新同学。', 'py': 'wǒ men bān lái le yí ge xīn tóng xué'},
  'why': 'Le français met le nouveau venu en sujet : « un nouvel élève est arrivé dans notre classe ». Le chinois évite de commencer par un inconnu : il pose le lieu, puis le verbe, et place le nouveau venu après, avec 一个 : 我们班来了一个新同学. À l’oral, on peut aussi ouvrir par 有 : 有个新同学来我们班了.'}
assert_py(piege['bad']['hz'], piege['bad']['py']); assert_py(piege['good']['hz'], piege['good']['py'])
lectures(piege['bad']['hz'], piege['bad']['py']); lectures(piege['good']['hz'], piege['good']['py'])

# ---------------------------------------------------------------------
# Banque (18), leurres (12)
# ---------------------------------------------------------------------
def B(toks, cle, fr, reg=None):
    s = seg(*toks)
    assert s[cle]['p'], 'Clé sur un jeton non touchable'
    d = {'seg': s, 'cle': cle, 'fr': fr}
    if reg:
        d['reg'] = reg
    return d

banque = [
  B([('前面', 'qián miàn'), ('来了', 'lái le'), ('一个人', 'yí ge rén'), '。'], 1, 'Quelqu’un arrive, là devant.'),
  B([('楼下', 'lóu xià'), ('开了', 'kāi le'), ('一家', 'yì jiā'), ('咖啡馆', 'kā fēi guǎn'), '。'], 1, 'Un café a ouvert en bas de chez nous.'),
  B([('冰箱里', 'bīng xiāng lǐ'), ('少了', 'shǎo le'), ('两个', 'liǎng ge'), ('鸡蛋', 'jī dàn'), '。'], 1, 'Il manque deux œufs dans le frigo.'),
  B([('楼上', 'lóu shàng'), ('搬走了', 'bān zǒu le'), ('一家人', 'yì jiā rén'), '。'], 1, 'Une famille a déménagé, à l’étage du dessus.'),
  B([('别停', 'bié tíng'), '，', ('你', 'nǐ'), ('说', 'shuō'), ('下去', 'xià qù'), '。'], 4, 'Ne vous arrêtez pas, continuez.'),
  B([('这本书', 'zhè běn shū'), ('很有意思', 'hěn yǒu yì si'), '，', ('我', 'wǒ'), ('想看', 'xiǎng kàn'), ('下去', 'xià qù'), '。'], 5, 'Ce livre est passionnant, je veux continuer à le lire.'),
  B([('我们', 'wǒ men'), ('要', 'yào'), ('坚持', 'jiān chí'), ('下去', 'xià qù'), '。'], 3, 'Il faut tenir bon.'),
  B([('请', 'qǐng'), ('把', 'bǎ'), ('电话号码', 'diàn huà hào mǎ'), ('记', 'jì'), ('下来', 'xià lái'), '。'], 4, 'Notez le numéro, s’il vous plaît.'),
  B([('车', 'chē'), ('停', 'tíng'), ('下来', 'xià lái'), ('了', 'le'), '。'], 2, 'La voiture s’est arrêtée.'),
  B([('学汉语', 'xué Hàn yǔ'), ('很难', 'hěn nán'), '，', ('可是', 'kě shì'), ('我', 'wǒ'), ('坚持', 'jiān chí'), ('下来', 'xià lái'), ('了', 'le'), '。'], 6, 'Apprendre le chinois est difficile, mais j’ai tenu bon.'),
  B([('他', 'tā'), ('考', 'kǎo'), ('上', 'shàng'), ('了', 'le'), ('北京大学', 'Běi jīng dà xué'), '。'], 2, 'Il a été reçu à l’université de Pékin.'),
  B([('请', 'qǐng'), ('把', 'bǎ'), ('门', 'mén'), ('关', 'guān'), ('上', 'shàng'), '。'], 4, 'Fermez la porte, s’il vous plaît.'),
  B([('请', 'qǐng'), ('记', 'jì'), ('住', 'zhù'), ('我的', 'wǒ de'), ('电话号码', 'diàn huà hào mǎ'), '。'], 2, 'Retenez mon numéro, s’il vous plaît.'),
  B([('这么多', 'zhè me duō'), ('生词', 'shēng cí'), '，', ('我', 'wǒ'), ('记', 'jì'), ('不', 'bu'), ('住', 'zhù'), '。'], 6, 'Je n’arrive pas à retenir autant de mots.'),
  B([('谁', 'shéi'), ('把', 'bǎ'), ('我的', 'wǒ de'), ('书', 'shū'), ('拿', 'ná'), ('走', 'zǒu'), ('了', 'le'), '？'], 5, 'Qui a pris mon livre ?'),
  B([('他', 'tā'), ('想', 'xiǎng'), ('出', 'chū'), ('了', 'le'), ('一个', 'yí ge'), ('好办法', 'hǎo bàn fǎ'), '。'], 2, 'Il a trouvé une bonne solution.'),
  B([('在这儿', 'zài zhèr'), ('吃', 'chī'), ('还是', 'hái shi'), ('带', 'dài'), ('走', 'zǒu'), '？'], 4, 'Sur place ou à emporter ?', reg='oral'),
  B([('这样', 'zhè yàng'), ('下去', 'xià qù'), ('可不行', 'kě bù xíng'), '。'], 1, 'Ça ne peut pas continuer comme ça.', reg='oral'),
]
leurres = ['被', '把', '比', '连', '地', '和', '跟', '从', '往', '很', '也', '都']

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
gabarits = []

# 1. Écran 1 — lieu + V + 了 + nouveau venu
gabarits.append(gab(
  [S('l'), S('v'), P('。')],
  '… : il est arrivé ….',
  {'l': col(('前面', 'qián miàn', 'là devant'), ('我们班', 'wǒ men bān', 'dans notre classe'),
            ('楼下', 'lóu xià', 'en bas de chez nous'), ('家里', 'jiā lǐ', 'à la maison'),
            ('对面', 'duì miàn', 'en face'), ('公司', 'gōng sī', 'dans l’entreprise'),
            ('门口', 'mén kǒu', 'devant la porte'), ('路口', 'lù kǒu', 'au carrefour'),
            ('隔壁', 'gé bì', 'à côté'), ('学校旁边', 'xué xiào páng biān', 'à côté de l’école'),
            ('天上', 'tiān shang', 'dans le ciel'), ('饭馆里', 'fàn guǎn lǐ', 'dans le restaurant')),
   'v': col(('来了一个人', 'lái le yí ge rén', 'quelqu’un arrive'), ('来了一个新同学', 'lái le yí ge xīn tóng xué', 'un nouvel élève est arrivé'),
            ('开了一家咖啡馆', 'kāi le yì jiā kā fēi guǎn', 'un café a ouvert'), ('来了几个客人', 'lái le jǐ ge kè rén', 'des invités sont arrivés'),
            ('搬来了一家人', 'bān lái le yì jiā rén', 'une famille s’est installée'), ('来了一位新经理', 'lái le yí wèi xīn jīng lǐ', 'un nouveau directeur est arrivé'),
            ('停了一辆车', 'tíng le yí liàng chē', 'une voiture s’est arrêtée'), ('开了一家超市', 'kāi le yì jiā chāo shì', 'un supermarché a ouvert'),
            ('搬来了一个新邻居', 'bān lái le yí ge xīn lín jū', 'un nouveau voisin s’est installé'), ('开了一家书店', 'kāi le yì jiā shū diàn', 'une librairie a ouvert'),
            ('飞来了一只鸟', 'fēi lái le yì zhī niǎo', 'un oiseau est arrivé'), ('进来了两个外国人', 'jìn lái le liǎng ge wài guó rén', 'deux étrangers sont entrés'))},
  [['l', 'v']], []))

# 2. Écran 2 — lieu + V + 了 + ce qui disparaît
gabarits.append(gab(
  [S('l'), S('v'), P('。')],
  '… : il manque …, il est parti ….',
  {'l': col(('我们班', 'wǒ men bān', 'dans notre classe'), ('冰箱里', 'bīng xiāng lǐ', 'dans le frigo'),
            ('楼上', 'lóu shàng', 'à l’étage du dessus'), ('我的钱包里', 'wǒ de qián bāo lǐ', 'dans mon porte-monnaie'),
            ('书架上', 'shū jià shang', 'sur l’étagère'), ('公司', 'gōng sī', 'dans l’entreprise'),
            ('停车场', 'tíng chē chǎng', 'sur le parking'), ('盘子里', 'pán zi lǐ', 'dans l’assiette'),
            ('碗里', 'wǎn lǐ', 'dans le bol'), ('我们队', 'wǒ men duì', 'dans notre équipe'),
            ('对面', 'duì miàn', 'en face'), ('鱼缸里', 'yú gāng lǐ', 'dans l’aquarium')),
   'v': col(('走了两个同学', 'zǒu le liǎng ge tóng xué', 'deux élèves sont partis'), ('少了两个鸡蛋', 'shǎo le liǎng ge jī dàn', 'il manque deux œufs'),
            ('搬走了一家人', 'bān zǒu le yì jiā rén', 'une famille a déménagé'), ('少了一百块', 'shǎo le yì bǎi kuài', 'il manque cent yuans'),
            ('少了一本书', 'shǎo le yì běn shū', 'il manque un livre'), ('走了三个人', 'zǒu le sān ge rén', 'trois personnes sont parties'),
            ('少了一辆车', 'shǎo le yí liàng chē', 'il manque une voiture'), ('少了一个饺子', 'shǎo le yí ge jiǎo zi', 'il manque un ravioli'),
            ('少了一块肉', 'shǎo le yí kuài ròu', 'il manque un morceau de viande'), ('少了一个人', 'shǎo le yí ge rén', 'il manque quelqu’un'),
            ('关了一家饭馆', 'guān le yì jiā fàn guǎn', 'un restaurant a fermé'), ('死了一条鱼', 'sǐ le yì tiáo yú', 'un poisson est mort'))},
  [['l', 'v']], []))

# 3. Écran 3 — une raison, puis 我 + 想/还想/要 + V + 下去
gabarits.append(gab(
  [S('c'), P('，'), T('我', 'wǒ'), S('m'), S('v'), T('下去', 'xià qù'), P('。')],
  '…, je veux continuer à ….',
  {'c': col(('这本书很有意思', 'zhè běn shū hěn yǒu yì si', 'ce livre est passionnant'), ('这个故事很好听', 'zhè ge gù shi hěn hǎo tīng', 'cette histoire est belle'),
            ('这个电视剧很好看', 'zhè ge diàn shì jù hěn hǎo kàn', 'cette série est très bien'), ('汉语越学越有意思', 'Hàn yǔ yuè xué yuè yǒu yì si', 'le chinois est de plus en plus passionnant'),
            ('这份工作很有意思', 'zhè fèn gōng zuò hěn yǒu yì si', 'ce travail est intéressant'), ('在这儿生活很舒服', 'zài zhèr shēng huó hěn shū fu', 'on vit bien ici'),
            ('这本小说写得很好', 'zhè běn xiǎo shuō xiě de hěn hǎo', 'ce roman est bien écrit'), ('每天跑步对身体好', 'měi tiān pǎo bù duì shēn tǐ hǎo', 'courir chaque jour fait du bien'),
            ('这个游戏很好玩', 'zhè ge yóu xì hěn hǎo wán', 'ce jeu est amusant'), ('这门课很有用', 'zhè mén kè hěn yǒu yòng', 'ce cours est très utile'),
            ('她讲得很好', 'tā jiǎng de hěn hǎo', 'elle raconte très bien'), ('早睡早起是个好习惯', 'zǎo shuì zǎo qǐ shì ge hǎo xí guàn', 'se coucher et se lever tôt est une bonne habitude')),
   'v': col(('看', 'kàn', 'le lire'), ('听', 'tīng', 'l’écouter'),
            ('看', 'kàn', 'la regarder'), ('学', 'xué', 'l’apprendre'),
            ('做', 'zuò', 'le faire'), ('住', 'zhù', 'y vivre'),
            ('读', 'dú', 'le lire'), ('坚持', 'jiān chí', 'm’y tenir'),
            ('玩', 'wán', 'y jouer'), ('学', 'xué', 'le suivre'),
            ('听', 'tīng', 'l’écouter'), ('坚持', 'jiān chí', 'm’y tenir')),
   'm': liste(('想', 'xiǎng', 'veux'), ('还想', 'hái xiǎng', 'veux encore'), ('要', 'yào', 'vais'))},
  [['c', 'v']], ['m']))

# 4. Écran 3 — relancer : 你 + V + 下去吧 (oral)
gabarits.append(gab(
  [S('r'), P('，'), T('你', 'nǐ'), S('v'), T('下去', 'xià qù'), T('吧', 'ba'), P('。')],
  '…, continue à ….',
  {'r': liste(('别停', 'bié tíng', 'ne t’arrête pas'), ('没关系', 'méi guān xi', 'ce n’est rien'), ('挺好的', 'tǐng hǎo de', 'c’est très bien')),
   'v': liste(('说', 'shuō', 'parler'), ('讲', 'jiǎng', 'raconter'), ('唱', 'chàng', 'chanter'),
              ('念', 'niàn', 'lire à voix haute'), ('读', 'dú', 'lire'), ('写', 'xiě', 'écrire'))},
  [], ['r', 'v'], reg='oral'))

# 5. Écran 9 — 这样下去，… (oral)
gabarits.append(gab(
  [T('这样', 'zhè yàng'), T('下去', 'xià qù'), P('，'), S('c'), P('。')],
  'Si ça continue comme ça, ….',
  {'c': liste(('你会累坏的', 'nǐ huì lèi huài de', 'tu vas t’épuiser'), ('你的身体会受不了的', 'nǐ de shēn tǐ huì shòu bu liǎo de', 'ta santé ne tiendra pas'),
              ('我们会迟到的', 'wǒ men huì chí dào de', 'nous allons être en retard'), ('钱很快就会花完的', 'qián hěn kuài jiù huì huā wán de', 'l’argent sera vite dépensé'),
              ('我们什么都做不完', 'wǒ men shén me dōu zuò bu wán', 'nous ne finirons rien'), ('他会生气的', 'tā huì shēng qì de', 'il va se fâcher'),
              ('你会生病的', 'nǐ huì shēng bìng de', 'tu vas tomber malade'), ('问题会越来越多', 'wèn tí huì yuè lái yuè duō', 'les problèmes vont s’accumuler'))},
  [], ['c'], reg='oral'))

# 6. Écran 4 — 把 + objet + V + 下来
gabarits.append(gab(
  [S('i'), T('把', 'bǎ'), S('o'), S('v'), T('下来', 'xià lái'), P('。')],
  '… noter, garder ….',
  {'i': liste(('快', 'kuài', 'vite'), ('你最好', 'nǐ zuì hǎo', 'vous feriez mieux de'), ('别忘了', 'bié wàng le', 'n’oubliez pas de'), ('请', 'qǐng', 's’il vous plaît')),
   'o': col(('电话号码', 'diàn huà hào mǎ', 'le numéro de téléphone'), ('老师的话', 'lǎo shī de huà', 'ce que dit le professeur'),
            ('这张照片', 'zhè zhāng zhào piàn', 'cette photo'), ('这个地方', 'zhè ge dì fang', 'cet endroit'),
            ('他的地址', 'tā de dì zhǐ', 'son adresse'), ('这个菜的做法', 'zhè ge cài de zuò fǎ', 'la recette de ce plat'),
            ('会上说的事', 'huì shang shuō de shì', 'ce qui s’est dit en réunion'), ('这段话', 'zhè duàn huà', 'ce passage'),
            ('这首歌', 'zhè shǒu gē', 'cette chanson'), ('这个网址', 'zhè ge wǎng zhǐ', 'cette adresse web'),
            ('他说的每一句话', 'tā shuō de měi yí jù huà', 'chacune de ses phrases'), ('这么美的风景', 'zhè me měi de fēng jǐng', 'un si beau paysage')),
   'v': col(('记', 'jì', 'noter'), ('写', 'xiě', 'écrire'),
            ('存', 'cún', 'enregistrer'), ('拍', 'pāi', 'photographier'),
            ('记', 'jì', 'noter'), ('写', 'xiě', 'écrire'),
            ('记', 'jì', 'noter'), ('记', 'jì', 'noter'),
            ('录', 'lù', 'enregistrer'), ('存', 'cún', 'enregistrer'),
            ('记', 'jì', 'noter'), ('拍', 'pāi', 'photographier'))},
  [['o', 'v']], ['i']))

# 7. Écran 4 — 坚持下来 : tenu jusqu’à maintenant
gabarits.append(gab(
  [S('a'), T('很难', 'hěn nán'), P('，'), T('可是', 'kě shì'), S('s'), T('坚持下来了', 'jiān chí xià lái le'), P('。')],
  '… était difficile, mais … a tenu bon.',
  {'a': liste(('学汉语', 'xué Hàn yǔ', 'apprendre le chinois'), ('每天跑步', 'měi tiān pǎo bù', 'courir chaque jour'),
              ('在国外生活', 'zài guó wài shēng huó', 'vivre à l’étranger'), ('早上五点起床', 'zǎo shang wǔ diǎn qǐ chuáng', 'se lever à cinq heures'),
              ('这份工作', 'zhè fèn gōng zuò', 'ce travail'), ('第一年', 'dì yī nián', 'la première année')),
   's': liste(('我', 'wǒ', 'j’'), ('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我们', 'wǒ men', 'nous'))},
  [], ['a', 's']))

# 8. Écran 5 — 终于 + V上了 + but atteint
gabarits.append(gab(
  [S('s'), T('终于', 'zhōng yú'), S('v'), T('了', 'le'), S('o'), P('。')],
  '… a enfin … ….',
  {'s': liste(('我', 'wǒ', 'j’'), ('他', 'tā', 'il'), ('她', 'tā', 'elle')),
   'v': col(('考上', 'kǎo shàng', 'été reçu à'), ('赶上', 'gǎn shàng', 'attrapé'),
            ('追上', 'zhuī shàng', 'rattrapé'), ('爱上', 'ài shàng', 'pris goût à'),
            ('喜欢上', 'xǐ huan shàng', 'pris goût à'), ('住上', 'zhù shàng', 'emménagé dans'),
            ('用上', 'yòng shàng', 'eu'), ('交上', 'jiāo shàng', 'trouvé'),
            ('吃上', 'chī shàng', 'retrouvé'), ('过上', 'guò shàng', 'connu'),
            ('坐上', 'zuò shàng', 'pris'), ('买上', 'mǎi shàng', 'pu acheter')),
   'o': col(('北京大学', 'Běi jīng dà xué', 'l’université de Pékin'), ('最后一班地铁', 'zuì hòu yì bān dì tiě', 'le dernier métro'),
            ('前面的人', 'qián miàn de rén', 'ceux de devant'), ('这个城市', 'zhè ge chéng shì', 'cette ville'),
            ('中国菜', 'Zhōng guó cài', 'la cuisine chinoise'), ('新房子', 'xīn fáng zi', 'un logement neuf'),
            ('新电脑', 'xīn diàn nǎo', 'un ordinateur neuf'), ('新朋友', 'xīn péng you', 'de nouveaux amis'),
            ('妈妈做的饭', 'mā ma zuò de fàn', 'la cuisine de maman'), ('好日子', 'hǎo rì zi', 'une vie meilleure'),
            ('回家的火车', 'huí jiā de huǒ chē', 'le train du retour'), ('自己的房子', 'zì jǐ de fáng zi', 'un logement à soi'))},
  [['v', 'o']], ['s']))

# 9. Écran 5 — 把 + objet + V + 上 : fermer, recouvrir
gabarits.append(gab(
  [S('x'), T('把', 'bǎ'), S('o'), S('v'), T('上', 'shàng'), P('。')],
  '…, … bien ….',
  {'x': liste(('请', 'qǐng', 's’il vous plaît'), ('快', 'kuài', 'vite'), ('你先', 'nǐ xiān', 'd’abord')),
   'o': col(('门', 'mén', 'la porte'), ('窗户', 'chuāng hu', 'la fenêtre'),
            ('书', 'shū', 'le livre'), ('眼睛', 'yǎn jing', 'les yeux'),
            ('大衣', 'dà yī', 'le manteau'), ('帽子', 'mào zi', 'le bonnet'),
            ('名字', 'míng zi', 'votre nom'), ('盖子', 'gài zi', 'le couvercle'),
            ('抽屉', 'chōu ti', 'le tiroir'), ('鞋', 'xié', 'les chaussures'),
            ('口罩', 'kǒu zhào', 'le masque'), ('日期', 'rì qī', 'la date')),
   'v': col(('关', 'guān', 'fermez'), ('关', 'guān', 'fermez'),
            ('合', 'hé', 'refermez'), ('闭', 'bì', 'fermez'),
            ('穿', 'chuān', 'mettez'), ('戴', 'dài', 'mettez'),
            ('写', 'xiě', 'écrivez'), ('盖', 'gài', 'remettez'),
            ('关', 'guān', 'fermez'), ('穿', 'chuān', 'mettez'),
            ('戴', 'dài', 'mettez'), ('填', 'tián', 'inscrivez'))},
  [['o', 'v']], ['x']))

# 10. Écran 6 — 你记住……了吗？
gabarits.append(gab(
  [T('你', 'nǐ'), T('记住', 'jì zhù'), S('o'), T('了吗', 'le ma'), P('？')],
  'Vous avez retenu … ?',
  {'o': liste(('我的名字', 'wǒ de míng zi', 'mon nom'), ('我的电话号码', 'wǒ de diàn huà hào mǎ', 'mon numéro'),
              ('回家的路', 'huí jiā de lù', 'le chemin du retour'), ('这个字', 'zhè ge zì', 'ce caractère'),
              ('这个词的意思', 'zhè ge cí de yì si', 'le sens de ce mot'), ('老师说的话', 'lǎo shī shuō de huà', 'ce qu’a dit le professeur'),
              ('密码', 'mì mǎ', 'le mot de passe'))},
  [], ['o']))

# 11. Écran 6 — 记不住 : la forme potentielle
gabarits.append(gab(
  [S('o'), P('，'), S('s'), T('总是', 'zǒng shì'), T('记不住', 'jì bu zhù'), P('。')],
  '…, … n’arrive jamais à le retenir.',
  {'o': liste(('她的名字', 'tā de míng zi', 'son nom'), ('这些生词', 'zhè xiē shēng cí', 'ces mots nouveaux'),
              ('汉字的声调', 'Hàn zì de shēng diào', 'les tons des caractères'), ('电话号码', 'diàn huà hào mǎ', 'les numéros de téléphone'),
              ('新同事的名字', 'xīn tóng shì de míng zi', 'le nom des nouveaux collègues'), ('这个字怎么写', 'zhè ge zì zěn me xiě', 'comment s’écrit ce caractère'),
              ('去她家的路', 'qù tā jiā de lù', 'le chemin de chez elle')),
   's': liste(('我', 'wǒ', 'je'), ('我妈妈', 'wǒ mā ma', 'ma mère'), ('他', 'tā', 'il'))},
  [], ['o', 's']))

# 12. Écran 7 — 谁把我的……V走了？
gabarits.append(gab(
  [S('x'), P('，'), T('谁', 'shéi'), T('把', 'bǎ'), T('我的', 'wǒ de'), S('o'), S('v'), T('走', 'zǒu'), T('了', 'le'), P('？')],
  '…, qui a emporté mon … ?',
  {'x': liste(('咦', 'yí', 'tiens'), ('哎呀', 'āi yā', 'zut')),
   'o': col(('书', 'shū', 'livre'), ('伞', 'sǎn', 'parapluie'),
            ('自行车', 'zì xíng chē', 'vélo'), ('车', 'chē', 'voiture'),
            ('椅子', 'yǐ zi', 'chaise'), ('词典', 'cí diǎn', 'dictionnaire'),
            ('钥匙', 'yào shi', 'clés'), ('衣服', 'yī fu', 'vêtements'),
            ('茶', 'chá', 'thé'), ('报纸', 'bào zhǐ', 'journal'),
            ('盘子', 'pán zi', 'assiette'), ('电脑', 'diàn nǎo', 'ordinateur')),
   'v': col(('拿', 'ná', 'pris'), ('借', 'jiè', 'emprunté'),
            ('骑', 'qí', 'parti avec'), ('开', 'kāi', 'parti avec'),
            ('搬', 'bān', 'déplacé'), ('借', 'jiè', 'emprunté'),
            ('拿', 'ná', 'pris'), ('穿', 'chuān', 'mis'),
            ('端', 'duān', 'emporté'), ('拿', 'ná', 'pris'),
            ('收', 'shōu', 'débarrassé'), ('搬', 'bān', 'emporté'))},
  [['o', 'v']], ['x']))

# 13. Écran 7 — ……可以带走吗？ (oral)
gabarits.append(gab(
  [S('o'), T('可以', 'kě yǐ'), T('带走', 'dài zǒu'), T('吗', 'ma'), P('？')],
  'Je peux emporter … ?',
  {'o': liste(('这些菜', 'zhè xiē cài', 'ces plats'), ('剩下的饺子', 'shèng xià de jiǎo zi', 'les raviolis qui restent'),
              ('这本杂志', 'zhè běn zá zhì', 'ce magazine'), ('这张地图', 'zhè zhāng dì tú', 'ce plan'),
              ('这些水果', 'zhè xiē shuǐ guǒ', 'ces fruits'), ('没吃完的蛋糕', 'méi chī wán de dàn gāo', 'le gâteau pas fini'))},
  [], ['o'], reg='oral'))

# 14. Écran 8 — 你 + V + 出 + ce qui apparaît + 了吗？
gabarits.append(gab(
  [T('你', 'nǐ'), S('v'), T('出', 'chū'), S('o'), T('了吗', 'le ma'), P('？')],
  'Vous avez … ?',
  {'v': col(('看', 'kàn', 'deviné'), ('听', 'tīng', 'reconnu'),
            ('想', 'xiǎng', 'trouvé'), ('看', 'kàn', 'reconnu'),
            ('听', 'tīng', 'deviné à l’accent'), ('找', 'zhǎo', 'trouvé'),
            ('猜', 'cāi', 'deviné'), ('看', 'kàn', 'vu'),
            ('尝', 'cháng', 'deviné au goût'), ('闻', 'wén', 'deviné à l’odeur'),
            ('认', 'rèn', 'reconnu'), ('算', 'suàn', 'calculé')),
   'o': col(('他是哪国人', 'tā shì nǎ guó rén', 'de quel pays il est'), ('这是谁的声音', 'zhè shì shéi de shēng yīn', 'de qui est cette voix'),
            ('什么好办法', 'shén me hǎo bàn fǎ', 'une bonne idée'), ('这是谁写的字', 'zhè shì shéi xiě de zì', 'qui a écrit ceci'),
            ('他是哪儿的人', 'tā shì nǎr de rén', 'd’où il vient'), ('问题在哪儿', 'wèn tí zài nǎr', 'où est le problème'),
            ('我是谁', 'wǒ shì shéi', 'qui je suis'), ('哪个是真的', 'nǎ ge shì zhēn de', 'lequel est le vrai'),
            ('这里面放了什么', 'zhè lǐ miàn fàng le shén me', 'ce qu’il y a dedans'), ('这是什么菜', 'zhè shì shén me cài', 'quel plat c’est'),
            ('这是谁', 'zhè shì shéi', 'qui c’est'), ('一共多少钱', 'yí gòng duō shao qián', 'le total'))},
  [['v', 'o']], []))

# ---------------------------------------------------------------------
# Transformations (9), 改错 (8), réemplois (4)
# ---------------------------------------------------------------------
def TR(consigne, de, vers, fr, reg=None):
    d = {'consigne': consigne, 'de': EX(*de), 'vers': {'seg': seg(*vers), 'fr': fr}}
    if reg:
        d['reg'] = reg
    return d

transfo = [
  TR('Commencez par le lieu, avec le moule de l’apparition', ('有一个新同学来到我们班。', 'yǒu yí ge xīn tóng xué lái dào wǒ men bān', 'Un nouvel élève est arrivé dans notre classe.'),
     [('我们班', 'wǒ men bān'), ('来了', 'lái le'), ('一个', 'yí ge'), ('新同学', 'xīn tóng xué'), '。'], 'Un nouvel élève est arrivé dans notre classe.'),
  TR('Dites ce qui manque, avec le moule de la disparition', ('冰箱里的鸡蛋，有两个不见了。', 'bīng xiāng lǐ de jī dàn, yǒu liǎng ge bú jiàn le', 'Deux des œufs du frigo ont disparu.'),
     [('冰箱里', 'bīng xiāng lǐ'), ('少了', 'shǎo le'), ('两个', 'liǎng ge'), ('鸡蛋', 'jī dàn'), '。'], 'Il manque deux œufs dans le frigo.'),
  TR('Dites « continuer » avec 下去', ('我想继续看这本书。', 'wǒ xiǎng jì xù kàn zhè běn shū', 'Je veux continuer à lire ce livre.'),
     [('这本书', 'zhè běn shū'), ('我', 'wǒ'), ('想', 'xiǎng'), ('看', 'kàn'), ('下去', 'xià qù'), '。'], 'Ce livre, je veux continuer à le lire.'),
  TR('Dites que le numéro doit rester, avec 把 et 下来', ('请写电话号码。', 'qǐng xiě diàn huà hào mǎ', 'Écrivez le numéro, s’il vous plaît.'),
     [('请', 'qǐng'), ('把', 'bǎ'), ('电话号码', 'diàn huà hào mǎ'), ('写', 'xiě'), ('下来', 'xià lái'), '。'], 'Notez le numéro par écrit, s’il vous plaît.'),
  TR('Dites que vous avez tenu jusqu’au bout, avec 下来', ('学汉语很难，可是我没有放弃。', 'xué Hàn yǔ hěn nán, kě shì wǒ méi yǒu fàng qì', 'Apprendre le chinois est difficile, mais je n’ai pas abandonné.'),
     [('学汉语', 'xué Hàn yǔ'), ('很难', 'hěn nán'), '，', ('可是', 'kě shì'), ('我', 'wǒ'), ('坚持', 'jiān chí'), ('下来', 'xià lái'), ('了', 'le'), '。'], 'Apprendre le chinois est difficile, mais j’ai tenu bon.'),
  TR('Dites la réussite avec 考上', ('他参加了北京大学的考试，成功了。', 'tā cān jiā le Běi jīng dà xué de kǎo shì, chéng gōng le', 'Il a passé le concours de l’université de Pékin, et il l’a réussi.'),
     [('他', 'tā'), ('考上', 'kǎo shàng'), ('了', 'le'), ('北京大学', 'Běi jīng dà xué'), '。'], 'Il a été reçu à l’université de Pékin.'),
  TR('Demandez qui l’a emporté, avec 把 et 拿走', ('我的书不在这儿了，谁拿了？', 'wǒ de shū bú zài zhèr le, shéi ná le', 'Mon livre n’est plus là : qui l’a pris ?'),
     [('谁', 'shéi'), ('把', 'bǎ'), ('我的', 'wǒ de'), ('书', 'shū'), ('拿走', 'ná zǒu'), ('了', 'le'), '？'], 'Qui a pris mon livre ?'),
  TR('Dites ce que vous avez remarqué, avec 看出', ('看他的脸，我知道他不高兴。', 'kàn tā de liǎn, wǒ zhī dào tā bù gāo xìng', 'À voir son visage, je sais qu’il n’est pas content.'),
     [('我', 'wǒ'), ('看出', 'kàn chū'), ('他', 'tā'), ('不高兴', 'bù gāo xìng'), ('了', 'le'), '。'], 'J’ai bien vu qu’il n’était pas content.'),
  TR('Dites-le comme à l’oral, avec 这样下去', ('如果你一直这样，你会累坏的。', 'rú guǒ nǐ yì zhí zhè yàng, nǐ huì lèi huài de', 'Si tu continues toujours ainsi, tu vas t’épuiser.'),
     [('这样', 'zhè yàng'), ('下去', 'xià qù'), '，', ('你', 'nǐ'), ('会', 'huì'), ('累坏', 'lèi huài'), ('的', 'de'), '。'], 'Si ça continue comme ça, tu vas t’épuiser.', reg='oral'),
]

def FX(toks, bad, bon, why):
    s = seg(*toks)
    assert s[bad]['p']
    return {'seg': s, 'bad': bad, 'bon': bon, 'why': why}

fixes = [
  FX([('我', 'wǒ'), ('想', 'xiǎng'), ('看下去', 'kàn xià qù'), ('这本书', 'zhè běn shū'), '。'], 3, '这本书我想看下去。',
     '下去 ne prend pas d’objet derrière lui : l’objet passe en tête.'),
  FX([('这么多', 'zhè me duō'), ('生词', 'shēng cí'), '，', ('我', 'wǒ'), ('不', 'bú'), ('记住', 'jì zhù'), '。'], 4, '这么多生词，我记不住。',
     'L’impossibilité se dit par la forme potentielle : 记不住.'),
  FX([('在', 'zài'), ('楼下', 'lóu xià'), ('开了', 'kāi le'), ('一家', 'yì jiā'), ('咖啡馆', 'kā fēi guǎn'), '。'], 0, '楼下开了一家咖啡馆。',
     'Le lieu ouvre la phrase de l’apparition : pas de 在 devant.'),
  FX([('前面', 'qián miàn'), ('来了', 'lái le'), ('那个人', 'nà ge rén'), '。'], 2, '前面来了一个人。',
     'Après le verbe, le nouveau venu est indéfini : 一个人. Une personne connue se place devant : 那个人来了.'),
  FX([('车', 'chē'), ('停', 'tíng'), ('下去', 'xià qù'), ('了', 'le'), '。'], 2, '车停下来了。',
     'S’arrêter, c’est se fixer : 停下来.'),
  FX([('谁', 'shéi'), ('把', 'bǎ'), ('我的', 'wǒ de'), ('书', 'shū'), ('拿', 'ná'), ('了', 'le'), ('走', 'zǒu'), '？'], 5, '谁把我的书拿走了？',
     'Le verbe et son résultat forment un bloc : 了 se place après 拿走.'),
  FX([('他', 'tā'), ('没', 'méi'), ('考上', 'kǎo shàng'), ('了', 'le'), ('北京大学', 'Běi jīng dà xué'), '。'], 3, '他没考上北京大学。',
     'À la négative, 了 tombe ; 上 reste.'),
  FX([('这样', 'zhè yàng'), ('下来', 'xià lái'), ('可不行', 'kě bù xíng'), '。'], 1, '这样下去可不行。',
     'Ce qui continue vers la suite, c’est 下去.'),
]

reemploi = [
  {'q': 'Racontez à une amie ce qui a changé dans votre rue : un commerce a ouvert, une famille est partie. Commencez chaque phrase par le lieu.',
   'verif': [{'type': 'un_parmi', 'v': ['来了', '开了', '搬来了'], 'msg': 'Une apparition : 来了, 开了 ou 搬来了.'},
             {'type': 'un_parmi', 'v': ['走了', '搬走了', '少了', '关了'], 'msg': 'Une disparition : 走了, 搬走了, 少了 ou 关了.'}],
   'modeles': [EX('我们楼下开了一家咖啡馆，楼上搬走了一家人。', 'wǒ men lóu xià kāi le yì jiā kā fēi guǎn, lóu shàng bān zǒu le yì jiā rén', 'Un café a ouvert en bas de chez nous, et une famille a déménagé, à l’étage du dessus.'),
               EX('对面开了一家书店，旁边关了一家饭馆。', 'duì miàn kāi le yì jiā shū diàn, páng biān guān le yì jiā fàn guǎn', 'Une librairie a ouvert en face, et un restaurant a fermé à côté.')],
   'criteres': ['Le lieu en tête, sans 在', 'Le verbe avec 了', 'Le nouveau venu après le verbe, avec 一 + classificateur']},
  {'q': 'Un collègue veut abandonner ses cours de chinois. Encouragez-le à continuer.',
   'verif': [{'type': 'contient', 'v': '下去', 'msg': 'Continuer : V + 下去.'}],
   'modeles': [EX('别放弃，你一定要坚持下去！', 'bié fàng qì, nǐ yí dìng yào jiān chí xià qù', 'N’abandonnez pas, il faut tenir bon !'),
               EX('你学得很好，继续学下去吧。', 'nǐ xué de hěn hǎo, jì xù xué xià qù ba', 'Vous progressez très bien, continuez.')],
   'criteres': ['下去 derrière le verbe', 'Pas d’objet après 下去', '要 ou 继续 pour appuyer']},
  {'q': 'Au restaurant, il reste beaucoup de plats. Demandez si vous pouvez les emporter.',
   'verif': [{'type': 'contient', 'v': '带走', 'msg': 'Emporter : 带走.'}],
   'modeles': [EX('这些菜吃不完，可以带走吗？', 'zhè xiē cài chī bu wán, kě yǐ dài zǒu ma', 'Nous n’arriverons pas à finir ces plats : on peut les emporter ?'),
               EX('服务员，剩下的菜可以带走吗？', 'fú wù yuán, shèng xià de cài kě yǐ dài zǒu ma', 'S’il vous plaît, on peut emporter les restes ?')],
   'criteres': ['带走 : le geste, puis 走', 'La chose en tête de la question', '吗 à la fin']},
  {'q': 'Un ami travaille tous les soirs jusqu’à minuit. Dites-lui que ça ne peut pas continuer, puis ce que vous craignez.',
   'verif': [{'type': 'contient', 'v': '这样下去', 'msg': 'Une suite inquiétante : 这样下去.'}],
   'modeles': [EX('这样下去可不行，你会累坏的。', 'zhè yàng xià qù kě bù xíng, nǐ huì lèi huài de', 'Ça ne peut pas continuer comme ça, tu vas t’épuiser.', reg='oral'),
               EX('你每天都工作到十二点，这样下去，身体会受不了的。', 'nǐ měi tiān dōu gōng zuò dào shí èr diǎn, zhè yàng xià qù, shēn tǐ huì shòu bu liǎo de', 'Tu travailles jusqu’à minuit tous les jours : si ça continue, ta santé ne tiendra pas.', reg='oral')],
   'criteres': ['这样下去 en tête', 'Puis la crainte, souvent avec 会……的', 'Le ton d’un ami, pas d’un médecin'],
   'reg': 'oral'},
]

fiche = {
  'id': 'g334', 'hsk': 3, 'fam': 'verbe', 'th': ['quotidien', 'nourriture'],
  'title': 'Ce qui arrive, ce qui continue : 来了一个人, 说下去, 记下来, 考上, 记住, 拿走, 想出',
  'resume': 'Ce qui apparaît ou disparaît quelque part (前面来了一个人, 冰箱里少了两个鸡蛋), puis les compléments qui disent la suite d’une action : elle continue (说下去), elle se fixe ou s’arrête (记下来, 停下来), elle atteint son but (考上), elle tient (记住), elle emporte (拿走), elle fait apparaître (想出).',
  'hsk3': [],
  'equiv': [],
  'steps': steps, 'tableau': tableau, 'piege': piege,
  'voir': ['g306', 'g308', 'g309', 'g310', 'g315'],
  'banque': banque, 'leurres': leurres, 'gabarits': gabarits,
  'transfo': transfo, 'fixes': fixes, 'reemploi': reemploi,
}

# ---------------------------------------------------------------------
# Contrôles
# ---------------------------------------------------------------------
assert len(steps) <= 9
assert any(s.get('reg') == 'oral' for s in steps)
assert any(g.get('reg') == 'oral' for g in gabarits)
assert len(gabarits) >= 5
assert len(banque) == 18 and len(leurres) == 12 and len(transfo) == 9 and len(fixes) == 8 and len(reemploi) == 4
assert 14 <= len(tableau['rows']) <= 28
for b in banque:
    assert b['seg'][b['cle']]['h'] not in leurres
for r in reemploi:
    for v in r['verif']:
        if v['type'] == 'contient': assert all(v['v'] in m['hz'] for m in r['modeles']), v
        if v['type'] == 'absent': assert all(v['v'] not in m['hz'] for m in r['modeles']), v
        if v['type'] == 'un_parmi': assert all(any(x in m['hz'] for x in v['v']) for m in r['modeles']), v
err = controles(fiche)
assert not err, '\n'.join(err)

if __name__ == '__main__':
    tot = sum(combos(g) for g in gabarits)
    print('g334 — %d écrans, %d gabarits, %d phrases engendrées' % (len(steps), len(gabarits), tot))
    for i, g in enumerate(gabarits, 1):
        print('\n— gabarit %d (%d phrases)%s : %s' % (i, combos(g), ' [oral]' if g.get('reg') else '', g['fr']))
        for s in tirages(g, 4, graine=i):
            print('   ', hz(s), ' | ', py(s))
    if '--banque' in sys.argv:
        print('\nBanque × leurres :')
        for b in banque:
            for l in leurres:
                print('   ', ''.join(l if k == b['cle'] else t['h'] for k, t in enumerate(b['seg'])))
    if '--tout' in sys.argv:
        for i, g in enumerate(gabarits, 1):
            print('\n== gabarit %d' % i)
            for s in tirages(g, None):
                print('   ', hz(s))
    import gram_lib
    sd = sorted({m for h, p, _ in gram_lib._LECTURES for m in sandhi(h, p)})
    print('\nSandhi à relire :', len(sd)); [print('   ', m) for m in sd]
    ec = rapport_lectures()
    print('\nÉcarts de lecture (pypinyin) à relire :', len(ec)); [print('   ', m) for m in ec]
    if '--poser' in sys.argv:
        d = poser(fiche, os.path.join(os.path.dirname(__file__), '..', '..', 'data-gram.js'))
        print('\nFiche posée dans data-gram.js (+%d caractères).' % d)
