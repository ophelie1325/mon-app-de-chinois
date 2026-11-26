# -*- coding: utf-8 -*-
"""g401 — Concéder (HSK 4).
尽管…可是/但是 (un fait admis), 却 (après le sujet), 即使…也 (une hypothèse),
就是…也 (son équivalent oral), 不…也 sans connecteur (你不说我也知道),
然而 en reconnaissance seulement ; à l’oral, 尽管 + verbe (尽管问).
Renvois : g316 (虽然…但是), g314 (如果…就), g330 (好是好，就是…).
Usage : python3 outils/fiches/g401.py [--banque] [--tout] [--poser]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from gram_lib import *

# ---------------------------------------------------------------------
# Écrans
# ---------------------------------------------------------------------
steps = [
  ecran('Malgré un fait : 尽管⋯可是', [
    '<b>尽管</b> pose un fait <b>admis</b>, puis la suite va contre lui : <b>尽管</b>很累，<b>可是</b>他还是来上课了 — <i>il avait beau être fatigué, il est venu en cours</i>.',
    'Vous connaissez déjà 虽然 (fiche 316). 尽管 dit la même chose avec plus de poids : le fait est réel, et il pèse. <b>尽管</b>下着大雨，比赛还是开始了.',
    'Comme avec 虽然, le chinois garde les deux bouts : 尽管 ouvre, 可是 ou 但是 ferme. Le français n’en garde qu’un : « bien qu’il soit fatigué, il est venu ». On ajoute souvent <b>还是</b>, « quand même » : 尽管很贵，客人<b>还是</b>很多.',
    'Quand les deux parties ont le même sujet, il se place devant 尽管, et 还是 suffit à fermer : 他<b>尽管</b>很忙，<b>还是</b>每天给妈妈打电话.'],
    [EX('尽管很累，可是他还是来上课了。', 'jǐn guǎn hěn lèi, kě shì tā hái shi lái shàng kè le', 'Il avait beau être fatigué, il est venu en cours.'),
     EX('尽管下着大雨，比赛还是开始了。', 'jǐn guǎn xià zhe dà yǔ, bǐ sài hái shi kāi shǐ le', 'Malgré la pluie battante, le match a commencé.'),
     EX('他尽管很忙，还是每天给妈妈打电话。', 'tā jǐn guǎn hěn máng, hái shi měi tiān gěi mā ma dǎ diàn huà', 'Il a beau être très occupé, il appelle sa mère tous les jours.')],
    {'q': '尽管很累 présente la fatigue comme :', 'a': ['un fait : il est fatigué', 'une hypothèse : s’il était fatigué'], 'ok': 0,
     'why': '尽管 admet un fait réel. Pour une hypothèse, le chinois prend 即使.'}),

  ecran('Pourtant : 却, après le sujet', [
    '<b>却</b> marque la surprise : la suite ne va pas dans le sens attendu. 他很累，<b>却</b>不想休息 — <i>il est fatigué, et pourtant il ne veut pas se reposer</i>.',
    '却 est un adverbe : il se place après le sujet, juste devant le verbe, comme 也 ou 就. Le français met « pourtant » où il veut ; le chinois jamais en tête : 我想去，他<b>却</b>不想去.',
    'Il oppose souvent deux personnes, ou ce qu’on attendait et ce qui arrive : 大家都来了，他<b>却</b>没来 — <i>tout le monde est venu, sauf lui</i>.',
    'Il s’ajoute volontiers à 可是 ou 但是 : le connecteur ouvre, devant le sujet, et 却 insiste, derrière lui. 东西很贵，可是质量<b>却</b>不好.'],
    [EX('他很累，却不想休息。', 'tā hěn lèi, què bù xiǎng xiū xi', 'Il est fatigué, et pourtant il ne veut pas se reposer.'),
     EX('我想去，他却不想去。', 'wǒ xiǎng qù, tā què bù xiǎng qù', 'Moi, je veux y aller ; lui, pourtant, ne veut pas.'),
     EX('大家都来了，他却没来。', 'dà jiā dōu lái le, tā què méi lái', 'Tout le monde est venu, sauf lui.')],
    {'q': '« Moi, je veux y aller ; lui, pourtant, ne veut pas » se dit :', 'a': ['我想去，却他不想去。', '我想去，他却不想去。'], 'ok': 1,
     'why': '却 est un adverbe : il suit le sujet et précède le verbe.'}),

  ecran('Même si : 即使⋯也', [
    '<b>即使</b> pose une <b>hypothèse</b> : « même si ». La suite ne change pas pour autant, et <b>也</b> la rattache : <b>即使</b>下雨，我<b>也</b>要去 — <i>même s’il pleut, j’irai</i>.',
    '也 ne tombe pas : sans lui, la phrase reste en l’air. Comme 就 après 如果 (fiche 314), il se place après le sujet de la seconde partie : <b>即使</b>你不去，我<b>也</b>去.',
    'La négation suit 也 : <b>即使</b>很便宜，我<b>也不</b>买 — <i>même bon marché, je ne l’achète pas</i>. Le français dit « ne… pas » ; le chinois dit 也不, dans cet ordre.',
    'L’hypothèse peut être extrême, pour dire qu’on ne cédera pas : <b>即使</b>大家都反对，我<b>也</b>要试一试.'],
    [EX('即使下雨，我也要去。', 'jí shǐ xià yǔ, wǒ yě yào qù', 'Même s’il pleut, j’irai.'),
     EX('即使你不去，我也去。', 'jí shǐ nǐ bú qù, wǒ yě qù', 'Même si tu n’y vas pas, moi, j’y vais.'),
     EX('即使很便宜，我也不买。', 'jí shǐ hěn pián yi, wǒ yě bù mǎi', 'Même bon marché, je ne l’achète pas.')],
    {'q': 'Quelle phrase est complète ?', 'a': ['即使下雨，我要去。', '即使下雨，我也要去。'], 'ok': 1,
     'why': '即使 appelle 也 dans la seconde partie, après le sujet.'}),

  ecran('Un fait ou une hypothèse : 尽管 ou 即使', [
    'Le français dit « même si » dans les deux cas. Le chinois choisit : <b>尽管</b> pour ce qui est vrai, <b>即使</b> pour ce qui pourrait l’être. 尽管下雨了 : il pleut. 即使下雨 : il pleuvra peut-être.',
    'Le temps vous aide : demain, la semaine prochaine, c’est une hypothèse, donc 即使. <b>即使</b>明天下雨，我们<b>也</b>去爬山. 尽管明天下雨 ne se dit pas.',
    'La fin change aussi : 尽管 appelle 可是, 但是 ou 还是 ; 即使 appelle 也. 尽管他不同意，我们<b>还是</b>去了 — <i>c’est fait</i>. 即使他不同意，我们<b>也</b>要去 — <i>c’est décidé d’avance</i>.',
    'Un test simple : si « bien que » convient en français, c’est un fait, donc 尽管 : 尽管很贵, « bien que ce soit cher ». Si seul « même si » convient, c’est une hypothèse : 即使很贵.'],
    [EX('尽管下雨了，我们还是去了。', 'jǐn guǎn xià yǔ le, wǒ men hái shi qù le', 'Bien qu’il ait plu, nous y sommes allés.'),
     EX('即使明天下雨，我们也去爬山。', 'jí shǐ míng tiān xià yǔ, wǒ men yě qù pá shān', 'Même s’il pleut demain, nous irons en montagne.'),
     EX('即使他不同意，我们也要去。', 'jí shǐ tā bù tóng yì, wǒ men yě yào qù', 'Même s’il n’est pas d’accord, nous irons.')],
    {'q': '« Même s’il pleut demain, nous irons » se dit :', 'a': ['尽管明天下雨，我们也去。', '即使明天下雨，我们也去。'], 'ok': 1,
     'why': 'Demain, c’est une hypothèse : 即使. 尽管 ne pose qu’un fait réel.'}),

  ecran('Le même si de l’oral : 就是⋯也', [
    'À l’oral, 即使 sonne un peu écrit. On dit plutôt <b>就是</b>⋯<b>也</b> : <b>就是</b>下雨，我<b>也</b>要去 — <i>même s’il pleut, j’y vais</i>.',
    'C’est le même 也, à la même place : après le sujet, devant le verbe. <b>就是</b>很贵，我<b>也</b>要买.',
    'Ne le confondez pas avec le 就是 de 好是好，就是太贵 (fiche 330), qui veut dire « seulement ». Ici, c’est 也 qui décide : 就是 suivi de 也, c’est « même si ».',
    '就是 se prononce avec force, devant une hypothèse extrême : <b>就是</b>给我一百万，我<b>也</b>不卖 — <i>même pour un million, je ne le vendrais pas</i>.'],
    [EX('就是下雨，我也要去。', 'jiù shì xià yǔ, wǒ yě yào qù', 'Même s’il pleut, j’y vais.', reg='oral'),
     EX('就是很贵，我也要买。', 'jiù shì hěn guì, wǒ yě yào mǎi', 'Même si c’est cher, je l’achète.', reg='oral'),
     EX('就是给我一百万，我也不卖。', 'jiù shì gěi wǒ yì bǎi wàn, wǒ yě bú mài', 'Même pour un million, je ne le vendrais pas.', reg='oral')],
    {'q': '好是好，就是太贵 et 就是下雨，我也要去 :', 'a': ['emploient le même 就是', 'opposent « seulement » et « même si »'], 'ok': 1,
     'why': 'Suivi de 也, 就是 dit « même si ». Sans 也, après X是X, il dit « seulement ».'}),

  ecran('Même sans : 不⋯也', [
    'Le chinois concède souvent sans aucun connecteur : une négation, puis 也. 你不说，我<b>也</b>知道 — <i>même si tu ne dis rien, je le sais</i>.',
    'Le français a besoin de « même si » ou de « quand même ». Le chinois laisse 不 et 也 faire le travail : 你不来，我们<b>也</b>去 — <i>même si tu ne viens pas, nous irons</i>.',
    'Avec 没, la concession porte sur ce qui s’est passé : 我没告诉他，他<b>也</b>知道了 — <i>je ne lui ai rien dit, il l’a su quand même</i>.',
    'On le dit souvent d’une traite, sans virgule : 你不说我<b>也</b>知道. Le sujet de la seconde partie reste devant 也.'],
    [EX('你不说我也知道。', 'nǐ bù shuō wǒ yě zhī dào', 'Même si tu ne dis rien, je le sais.', reg='oral'),
     EX('你不来，我们也去。', 'nǐ bù lái, wǒ men yě qù', 'Même si tu ne viens pas, nous irons.'),
     EX('我没告诉他，他也知道了。', 'wǒ méi gào su tā, tā yě zhī dào le', 'Je ne lui ai rien dit, il l’a su quand même.')],
    {'q': '你不说我也知道 veut dire :', 'a': ['même si tu ne dis rien, je le sais', 'tu ne dis rien, et moi non plus je ne sais rien'], 'ok': 0,
     'why': '也 rattache une suite qui tient malgré la négation : c’est une concession.'}),

  ecran('À lire : 然而', [
    '<b>然而</b> est le « cependant » de l’écrit. Il ouvre la seconde partie, en tête, comme 但是 : 大家都以为他会赢，<b>然而</b>他输了.',
    'Ne le confondez pas avec 却 : 然而 se place <b>avant</b> le sujet, 却 <b>après</b>. Un texte les combine souvent : <b>然而</b>他<b>却</b>没有放弃.',
    'Vous le lirez dans la presse, les essais, les sujets d’examen. À l’oral, dites 可是 ou 不过 : 大家都以为他会赢，<b>可是</b>他输了.',
    'Repérez-le pour suivre le fil d’un texte : ce qui suit 然而 compte plus que ce qui précède. 这个办法很简单，<b>然而</b>效果很好.'],
    [EX('大家都以为他会赢，然而他输了。', 'dà jiā dōu yǐ wéi tā huì yíng, rán ér tā shū le', 'Tout le monde pensait qu’il gagnerait ; cependant, il a perdu.'),
     EX('然而他却没有放弃。', 'rán ér tā què méi yǒu fàng qì', 'Cependant, il n’a pas abandonné pour autant.'),
     EX('这个办法很简单，然而效果很好。', 'zhè ge bàn fǎ hěn jiǎn dān, rán ér xiào guǒ hěn hǎo', 'Cette méthode est simple ; elle est pourtant très efficace.')],
    {'q': 'À l’oral, à la place de 然而, en tête de la seconde partie, vous direz :', 'a': ['可是', '却'], 'ok': 0,
     'why': '可是 se place en tête, comme 然而. 却 se place après le sujet.'}),

  ecran('À l’oral — 尽管问, 不过, 就是⋯也', [
    'Devant un verbe seul, 尽管 change de sens : <b>n’hésitez pas</b>. 有什么问题，你<b>尽管</b>问 — <i>si vous avez une question, n’hésitez pas</i>. C’est une invitation polie, très courante.',
    'Un hôte vous le dira à table : 想吃什么，<b>尽管</b>点 — <i>commandez ce que vous voulez</i>. Ici, 尽管 n’a plus rien d’une concession : il suit le sujet, comme 却.',
    'Après 尽管, l’oral préfère 不过 ou 可是 à 但是 : 尽管有点儿贵，<b>不过</b>味道真不错 — <i>c’est un peu cher, mais c’est vraiment bon</i>.',
    'Pour rassurer quelqu’un, 就是⋯也 promet que rien ne vous arrêtera : 你放心，<b>就是</b>下雨我<b>也</b>来 — <i>ne t’inquiète pas, même s’il pleut, je viens</i>.'],
    [EX('有什么问题，你尽管问。', 'yǒu shén me wèn tí, nǐ jǐn guǎn wèn', 'Si vous avez une question, n’hésitez pas.', reg='oral'),
     EX('想吃什么，尽管点。', 'xiǎng chī shén me, jǐn guǎn diǎn', 'Commandez ce que vous voulez.', reg='oral'),
     EX('尽管有点儿贵，不过味道真不错。', 'jǐn guǎn yǒu diǎnr guì, bú guò wèi dao zhēn bú cuò', 'C’est un peu cher, mais c’est vraiment bon.', reg='oral'),
     EX('你放心，就是下雨我也来。', 'nǐ fàng xīn, jiù shì xià yǔ wǒ yě lái', 'Ne t’inquiète pas, même s’il pleut, je viens.', reg='oral')],
    {'q': 'Votre hôte vous dit : 想吃什么，尽管点. Il veut dire :', 'a': ['commandez ce que vous voulez', 'même si vous avez faim, commandez'], 'ok': 0,
     'why': 'Devant un verbe seul, 尽管 invite : « n’hésitez pas ».'},
    reg='oral'),
]

# ---------------------------------------------------------------------
# Tableau, piège
# ---------------------------------------------------------------------
tableau = {'cols': ['Construction', 'Exemple', 'Ce qu’elle fait'], 'rows': [
  ['尽管 + fait, 可是/但是 …', '尽管很累，可是他还是来上课了', 'Un fait admis, puis l’inattendu'],
  ['Sujet + 尽管 …, 还是 …', '他尽管很忙，还是每天给妈妈打电话', 'Le sujet commun en tête'],
  ['虽然 (fiche 316)', '虽然很贵，我还是买了', 'Plus léger que 尽管'],
  ['Sujet + 却 + verbe', '他很累，却不想休息', 'Pourtant : après le sujet'],
  ['A, sujet 2 + 却 …', '我想去，他却不想去', 'Deux personnes opposées'],
  ['大家都…，sujet + 却…', '大家都来了，他却没来', 'L’exception'],
  ['可是 + sujet + 却', '东西很贵，可是质量却不好', 'Le connecteur ouvre, 却 insiste'],
  ['即使 + hypothèse, sujet + 也 …', '即使下雨，我也要去', 'Même si'],
  ['即使 …, sujet + 也不 …', '即使很便宜，我也不买', 'Même si… ne… pas'],
  ['即使 + extrême, 也 …', '即使大家都反对，我也要试一试', 'On ne cédera pas'],
  ['尽管 : un fait', '尽管下雨了，我们还是去了', 'C’est arrivé'],
  ['即使 : une hypothèse', '即使明天下雨，我们也去爬山', 'Ce qui pourrait arriver'],
  ['就是 + hypothèse, 也 … (oral)', '就是下雨，我也要去', 'Le 即使 de l’oral'],
  ['就是 …, 也不 …', '就是给我一百万，我也不卖', 'Même à la négative'],
  ['好是好，就是… (fiche 330)', '好是好，就是太贵', '« Seulement » : sans 也'],
  ['Sujet 1 + 不 + verbe, sujet 2 + 也 …', '你不说我也知道', 'Sans connecteur'],
  ['不来, 也去', '你不来，我们也去', 'Même si tu ne viens pas'],
  ['没 + verbe, 也 …', '我没告诉他，他也知道了', 'Ce qui s’est passé'],
  ['然而 (écrit)', '大家都以为他会赢，然而他输了', 'Cependant : en tête'],
  ['然而 + sujet + 却', '然而他却没有放弃', 'Les deux se combinent'],
  ['À l’oral : 可是, 不过', '…，可是他输了', 'À la place de 然而'],
  ['Sujet + 尽管 + verbe', '有什么问题，你尽管问', 'N’hésitez pas'],
  ['想 + verbe + 什么，尽管 + verbe', '想吃什么，尽管点', 'Servez-vous'],
  ['尽管…，不过…', '尽管有点儿贵，不过味道真不错', 'La concession à l’oral'],
]}

piege = {
  'bad': {'hz': '我想去，却他不想去。', 'py': 'wǒ xiǎng qù, què tā bù xiǎng qù'},
  'good': {'hz': '我想去，他却不想去。', 'py': 'wǒ xiǎng qù, tā què bù xiǎng qù'},
  'why': 'Le français place « pourtant » où il veut, même en tête : « pourtant, lui ne veut pas ». 却 est un adverbe chinois, comme 也 ou 就 : il se place après le sujet, juste devant le verbe. 我想去，他却不想去. Pour ouvrir la seconde partie, prenez un connecteur : 我想去，可是他不想去.'}
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
  B([('尽管', 'jǐn guǎn'), ('很累', 'hěn lèi'), '，', ('可是', 'kě shì'), ('他', 'tā'), ('还是', 'hái shi'), ('来上课了', 'lái shàng kè le'), '。'], 0, 'Il avait beau être fatigué, il est venu en cours.'),
  B([('他', 'tā'), ('尽管', 'jǐn guǎn'), ('很忙', 'hěn máng'), '，', ('还是', 'hái shi'), ('每天', 'měi tiān'), ('给妈妈', 'gěi mā ma'), ('打电话', 'dǎ diàn huà'), '。'], 1, 'Il a beau être très occupé, il appelle sa mère tous les jours.'),
  B([('尽管', 'jǐn guǎn'), ('下雨了', 'xià yǔ le'), '，', ('我们', 'wǒ men'), ('还是', 'hái shi'), ('去了', 'qù le'), '。'], 0, 'Bien qu’il ait plu, nous y sommes allés.'),
  B([('他', 'tā'), ('很累', 'hěn lèi'), '，', ('却', 'què'), ('不想', 'bù xiǎng'), ('休息', 'xiū xi'), '。'], 3, 'Il est fatigué, et pourtant il ne veut pas se reposer.'),
  B([('我', 'wǒ'), ('想去', 'xiǎng qù'), '，', ('他', 'tā'), ('却', 'què'), ('不想去', 'bù xiǎng qù'), '。'], 4, 'Moi, je veux y aller ; lui, pourtant, ne veut pas.'),
  B([('大家', 'dà jiā'), ('都', 'dōu'), ('来了', 'lái le'), '，', ('他', 'tā'), ('却', 'què'), ('没来', 'méi lái'), '。'], 5, 'Tout le monde est venu, sauf lui.'),
  B([('东西', 'dōng xi'), ('很贵', 'hěn guì'), '，', ('可是', 'kě shì'), ('质量', 'zhì liàng'), ('却', 'què'), ('不好', 'bù hǎo'), '。'], 5, 'C’est cher, et pourtant la qualité n’est pas bonne.'),
  B([('即使', 'jí shǐ'), ('下雨', 'xià yǔ'), '，', ('我', 'wǒ'), ('也', 'yě'), ('要去', 'yào qù'), '。'], 0, 'Même s’il pleut, j’irai.'),
  B([('即使', 'jí shǐ'), ('很便宜', 'hěn pián yi'), '，', ('我', 'wǒ'), ('也', 'yě'), ('不买', 'bù mǎi'), '。'], 4, 'Même bon marché, je ne l’achète pas.'),
  B([('即使', 'jí shǐ'), ('你', 'nǐ'), ('不去', 'bú qù'), '，', ('我', 'wǒ'), ('也', 'yě'), ('去', 'qù'), '。'], 0, 'Même si tu n’y vas pas, moi, j’y vais.'),
  B([('即使', 'jí shǐ'), ('明天', 'míng tiān'), ('下雨', 'xià yǔ'), '，', ('我们', 'wǒ men'), ('也', 'yě'), ('去', 'qù'), ('爬山', 'pá shān'), '。'], 0, 'Même s’il pleut demain, nous irons en montagne.'),
  B([('就是', 'jiù shì'), ('下雨', 'xià yǔ'), '，', ('我', 'wǒ'), ('也', 'yě'), ('要去', 'yào qù'), '。'], 0, 'Même s’il pleut, j’y vais.', reg='oral'),
  B([('就是', 'jiù shì'), ('很贵', 'hěn guì'), '，', ('我', 'wǒ'), ('也', 'yě'), ('要买', 'yào mǎi'), '。'], 4, 'Même si c’est cher, je l’achète.', reg='oral'),
  B([('你', 'nǐ'), ('不说', 'bù shuō'), ('我', 'wǒ'), ('也', 'yě'), ('知道', 'zhī dào'), '。'], 3, 'Même si tu ne dis rien, je le sais.', reg='oral'),
  B([('你', 'nǐ'), ('不来', 'bù lái'), '，', ('我们', 'wǒ men'), ('也', 'yě'), ('去', 'qù'), '。'], 4, 'Même si tu ne viens pas, nous irons.'),
  B([('我', 'wǒ'), ('没', 'méi'), ('告诉他', 'gào su tā'), '，', ('他', 'tā'), ('也', 'yě'), ('知道了', 'zhī dào le'), '。'], 1, 'Je ne lui ai rien dit, il l’a su quand même.'),
  B([('大家', 'dà jiā'), ('都', 'dōu'), ('以为', 'yǐ wéi'), ('他', 'tā'), ('会赢', 'huì yíng'), '，', ('然而', 'rán ér'), ('他', 'tā'), ('输了', 'shū le'), '。'], 6, 'Tout le monde pensait qu’il gagnerait ; cependant, il a perdu.'),
  B([('有', 'yǒu'), ('什么', 'shén me'), ('问题', 'wèn tí'), '，', ('你', 'nǐ'), ('尽管', 'jǐn guǎn'), ('问', 'wèn'), '。'], 5, 'Si vous avez une question, n’hésitez pas.', reg='oral'),
]
leurres = ['为了', '一边', '把', '被', '比', '的', '和', '跟', '给', '往', '对', '向']
equiv = [['但是', '可是', '不过'], ['即使', '就是', '就算', '哪怕'], ['尽管', '虽然']]

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
gabarits = []

# 1. Écran 1 — 尽管 + fait，可是/但是 + suite (还是)
gabarits.append(gab(
  [T('尽管', 'jǐn guǎn'), S('c'), P('，'), S('m'), S('r'), P('。')],
  'Bien que …, … quand même.',
  {'c': col(('很累', 'hěn lèi', 'il était fatigué'), ('下着大雨', 'xià zhe dà yǔ', 'il pleuvait à verse'),
            ('工作很忙', 'gōng zuò hěn máng', 'il a beaucoup de travail'), ('这家饭馆很贵', 'zhè jiā fàn guǎn hěn guì', 'ce restaurant est cher'),
            ('外面很冷', 'wài miàn hěn lěng', 'il fait froid dehors'), ('医生不让他喝酒', 'yī shēng bú ràng tā hē jiǔ', 'le médecin lui interdit l’alcool'),
            ('我们输了', 'wǒ men shū le', 'nous avons perdu'), ('路不远', 'lù bù yuǎn', 'ce n’était pas loin'),
            ('这个菜有点儿辣', 'zhè ge cài yǒu diǎnr là', 'ce plat est un peu épicé'), ('天气不好', 'tiān qì bù hǎo', 'il fait mauvais'),
            ('东西很便宜', 'dōng xi hěn pián yi', 'c’était bon marché'), ('他已经道歉了', 'tā yǐ jīng dào qiàn le', 'il s’est excusé')),
   'r': col(('他还是来上课了', 'tā hái shi lái shàng kè le', 'il est venu en cours'), ('比赛还是开始了', 'bǐ sài hái shi kāi shǐ le', 'le match a commencé'),
            ('他还是每天给妈妈打电话', 'tā hái shi měi tiān gěi mā ma dǎ diàn huà', 'il appelle sa mère tous les jours'), ('客人还是很多', 'kè rén hái shi hěn duō', 'il y a beaucoup de clients'),
            ('孩子们还是想出去玩', 'hái zi men hái shi xiǎng chū qù wán', 'les enfants veulent sortir jouer'), ('他还是喝了', 'tā hái shi hē le', 'il en a bu'),
            ('大家还是很高兴', 'dà jiā hái shi hěn gāo xìng', 'tout le monde est content'), ('我们还是迟到了', 'wǒ men hái shi chí dào le', 'nous sommes arrivés en retard'),
            ('我还是吃完了', 'wǒ hái shi chī wán le', 'je l’ai fini'), ('公园里人还是很多', 'gōng yuán lǐ rén hái shi hěn duō', 'il y a du monde au parc'),
            ('我还是没买', 'wǒ hái shi méi mǎi', 'je n’ai rien acheté'), ('她还是很生气', 'tā hái shi hěn shēng qì', 'elle est toujours fâchée')),
   'm': liste(('可是', 'kě shì', 'mais'), ('但是', 'dàn shì', 'mais'))},
  [['c', 'r']], ['m']))

# 2. Écran 1 — sujet + 尽管 + fait，还是 + suite
gabarits.append(gab(
  [S('s'), T('尽管', 'jǐn guǎn'), S('c'), P('，'), T('还是', 'hái shi'), S('v'), P('。')],
  '… a beau …, … quand même.',
  {'s': liste(('我', 'wǒ', 'je'), ('他', 'tā', 'il'), ('她', 'tā', 'elle')),
   'c': col(('很忙', 'hěn máng', 'être occupé'), ('很累', 'hěn lèi', 'être fatigué'),
            ('不太舒服', 'bú tài shū fu', 'ne pas se sentir bien'), ('不喜欢吃辣的', 'bù xǐ huan chī là de', 'ne pas aimer les plats épicés'),
            ('知道很难', 'zhī dào hěn nán', 'savoir que c’est difficile'), ('钱不多', 'qián bù duō', 'avoir peu d’argent'),
            ('很想去', 'hěn xiǎng qù', 'avoir très envie d’y aller'), ('很害怕', 'hěn hài pà', 'avoir peur'),
            ('不太饿', 'bú tài è', 'ne pas avoir très faim'), ('认识路', 'rèn shi lù', 'connaître le chemin'),
            ('睡得很晚', 'shuì de hěn wǎn', 'se coucher tard'), ('身体不好', 'shēn tǐ bù hǎo', 'avoir une santé fragile')),
   'v': col(('每天给妈妈打电话', 'měi tiān gěi mā ma dǎ diàn huà', 'appeler sa mère tous les jours'), ('坚持跑完了', 'jiān chí pǎo wán le', 'courir jusqu’au bout'),
            ('来上班了', 'lái shàng bān le', 'venir travailler'), ('吃了一点儿', 'chī le yì diǎnr', 'en manger un peu'),
            ('想试一试', 'xiǎng shì yi shì', 'vouloir essayer'), ('买了那件大衣', 'mǎi le nà jiàn dà yī', 'acheter ce manteau'),
            ('没去', 'méi qù', 'ne pas y aller'), ('上台唱了一首歌', 'shàng tái chàng le yì shǒu gē', 'monter chanter sur scène'),
            ('吃了两碗饭', 'chī le liǎng wǎn fàn', 'manger deux bols de riz'), ('迷路了', 'mí lù le', 'se perdre'),
            ('七点就起床了', 'qī diǎn jiù qǐ chuáng le', 'se lever dès sept heures'), ('每天去上班', 'měi tiān qù shàng bān', 'aller travailler tous les jours'))},
  [['c', 'v']], ['s']))

# 3. Écran 2 — A，sujet 2 + 却 + B
gabarits.append(gab(
  [S('a'), P('，'), S('s'), T('却', 'què'), S('v'), P('。')],
  '…, et pourtant … ….',
  {'a': col(('我想去', 'wǒ xiǎng qù', 'moi, je veux y aller'), ('大家都来了', 'dà jiā dōu lái le', 'tout le monde est venu'),
            ('我给他打了三次电话', 'wǒ gěi tā dǎ le sān cì diàn huà', 'je l’ai appelé trois fois'), ('妈妈做了很多菜', 'mā ma zuò le hěn duō cài', 'maman a préparé beaucoup de plats'),
            ('天气预报说今天有雨', 'tiān qì yù bào shuō jīn tiān yǒu yǔ', 'la météo annonçait de la pluie'), ('哥哥很高', 'gē ge hěn gāo', 'le grand frère est grand'),
            ('别人都很紧张', 'bié rén dōu hěn jǐn zhāng', 'les autres sont tendus'), ('这个菜看起来很辣', 'zhè ge cài kàn qǐ lái hěn là', 'ce plat a l’air épicé'),
            ('我早就到了', 'wǒ zǎo jiù dào le', 'je suis arrivé depuis longtemps'), ('夏天到了', 'xià tiān dào le', 'l’été est là'),
            ('大家都笑了', 'dà jiā dōu xiào le', 'tout le monde a ri'), ('这家店很小', 'zhè jiā diàn hěn xiǎo', 'cette boutique est petite')),
   's': col(('他', 'tā', 'lui'), ('他', 'tā', 'lui'),
            ('他', 'tā', 'lui'), ('孩子们', 'hái zi men', 'les enfants'),
            ('太阳', 'tài yáng', 'le soleil'), ('弟弟', 'dì di', 'le petit frère'),
            ('她', 'tā', 'elle'), ('吃起来', 'chī qǐ lái', 'en bouche, il'),
            ('他', 'tā', 'lui'), ('天气', 'tiān qì', 'le temps'),
            ('他', 'tā', 'lui'), ('生意', 'shēng yi', 'les affaires')),
   'v': col(('不想去', 'bù xiǎng qù', 'ne veut pas'), ('没来', 'méi lái', 'n’est pas venu'),
            ('一次也没接', 'yí cì yě méi jiē', 'n’a jamais répondu'), ('一口也没吃', 'yì kǒu yě méi chī', 'n’ont rien mangé'),
            ('出来了', 'chū lái le', 'est sorti'), ('很矮', 'hěn ǎi', 'est petit'),
            ('一点儿也不紧张', 'yì diǎnr yě bù jǐn zhāng', 'n’est pas tendue du tout'), ('不辣', 'bú là', 'n’est pas épicé'),
            ('还在路上', 'hái zài lù shang', 'est encore en route'), ('还很冷', 'hái hěn lěng', 'est encore froid'),
            ('哭了', 'kū le', 'a pleuré'), ('很好', 'hěn hǎo', 'marchent bien'))},
  [['a', 's', 'v']], []))

# 4. Écran 2 — sujet + fait，却 + suite inattendue
gabarits.append(gab(
  [S('s'), S('c'), P('，'), T('却', 'què'), S('v'), P('。')],
  '… …, et pourtant ….',
  {'s': liste(('我', 'wǒ', 'je'), ('他', 'tā', 'il'), ('她', 'tā', 'elle')),
   'c': col(('很累', 'hěn lèi', 'être fatigué'), ('很有钱', 'hěn yǒu qián', 'être riche'),
            ('学了三年汉语', 'xué le sān nián Hàn yǔ', 'avoir étudié le chinois trois ans'), ('吃了很多', 'chī le hěn duō', 'avoir beaucoup mangé'),
            ('知道答案', 'zhī dào dá àn', 'connaître la réponse'), ('身体不好', 'shēn tǐ bù hǎo', 'avoir une santé fragile'),
            ('住得很近', 'zhù de hěn jìn', 'habiter tout près'), ('很喜欢这件衣服', 'hěn xǐ huan zhè jiàn yī fu', 'adorer ce vêtement'),
            ('睡了十个小时', 'shuì le shí ge xiǎo shí', 'avoir dormi dix heures'), ('工资不高', 'gōng zī bù gāo', 'gagner peu'),
            ('说要减肥', 'shuō yào jiǎn féi', 'dire vouloir maigrir'), ('很会做饭', 'hěn huì zuò fàn', 'savoir très bien cuisiner')),
   'v': col(('不想休息', 'bù xiǎng xiū xi', 'ne pas vouloir se reposer'), ('从来不请客', 'cóng lái bù qǐng kè', 'ne jamais inviter'),
            ('不太会说', 'bú tài huì shuō', 'ne pas bien le parler'), ('还觉得饿', 'hái jué de è', 'avoir encore faim'),
            ('什么也没说', 'shén me yě méi shuō', 'ne rien dire'), ('每天抽烟', 'měi tiān chōu yān', 'fumer tous les jours'),
            ('常常迟到', 'cháng cháng chí dào', 'arriver souvent en retard'), ('没买', 'méi mǎi', 'ne pas l’acheter'),
            ('还是很困', 'hái shi hěn kùn', 'avoir encore sommeil'), ('常常请朋友吃饭', 'cháng cháng qǐng péng you chī fàn', 'inviter souvent ses amis au restaurant'),
            ('每天吃蛋糕', 'měi tiān chī dàn gāo', 'manger du gâteau tous les jours'), ('天天在外面吃', 'tiān tiān zài wài miàn chī', 'manger dehors tous les jours'))},
  [['c', 'v']], ['s']))

# 5. Écran 3 — 即使 + hypothèse，sujet + 也 + suite
gabarits.append(gab(
  [T('即使', 'jí shǐ'), S('h'), P('，'), S('s'), T('也', 'yě'), S('v'), P('。')],
  'Même si …, … ….',
  {'h': col(('下雨', 'xià yǔ', 'il pleut'), ('很贵', 'hěn guì', 'c’est cher'),
            ('很远', 'hěn yuǎn', 'c’est loin'), ('大家都反对', 'dà jiā dōu fǎn duì', 'tout le monde est contre'),
            ('失败了', 'shī bài le', 'c’est un échec'), ('很便宜', 'hěn pián yi', 'c’est bon marché'),
            ('你不去', 'nǐ bú qù', 'tu n’y vas pas'), ('他不来', 'tā bù lái', 'il ne vient pas'),
            ('很累', 'hěn lèi', 'on est fatigués'), ('只有一天', 'zhǐ yǒu yì tiān', 'on n’a qu’un jour'),
            ('很晚了', 'hěn wǎn le', 'il est tard'), ('没有人帮忙', 'méi yǒu rén bāng máng', 'personne n’aide')),
   'v': col(('要去', 'yào qù', 'y aller'), ('要买', 'yào mǎi', 'l’acheter'),
            ('要去看看', 'yào qù kàn kan', 'aller voir'), ('要试一试', 'yào shì yi shì', 'essayer'),
            ('不后悔', 'bú hòu huǐ', 'ne rien regretter'), ('不买', 'bù mǎi', 'ne pas l’acheter'),
            ('去', 'qù', 'y aller'), ('能做完', 'néng zuò wán', 'pouvoir finir'),
            ('要把作业写完', 'yào bǎ zuò yè xiě wán', 'finir les devoirs'), ('要去长城', 'yào qù Cháng chéng', 'aller à la Grande Muraille'),
            ('会给你打电话', 'huì gěi nǐ dǎ diàn huà', 'vous appeler'), ('能做好', 'néng zuò hǎo', 'pouvoir bien le faire')),
   's': liste(('我', 'wǒ', 'je'), ('我们', 'wǒ men', 'nous'))},
  [['h', 'v']], ['s']))

# 6. Écran 4 — 即使 + moment à venir + hypothèse，我们也 + projet
gabarits.append(gab(
  [T('即使', 'jí shǐ'), S('t'), S('h'), P('，'), T('我们', 'wǒ men'), T('也', 'yě'), S('v'), P('。')],
  'Même si …, nous … quand même ….',
  {'t': liste(('明天', 'míng tiān', 'demain'), ('后天', 'hòu tiān', 'après-demain'), ('周末', 'zhōu mò', 'ce week-end')),
   'h': liste(('下雨', 'xià yǔ', 'il pleut'), ('下雪', 'xià xuě', 'il neige'), ('刮大风', 'guā dà fēng', 'il y a beaucoup de vent'), ('很冷', 'hěn lěng', 'il fait froid')),
   'v': liste(('去爬山', 'qù pá shān', 'faire de la montagne'), ('去海边', 'qù hǎi biān', 'aller à la mer'), ('出发', 'chū fā', 'partir'), ('去公园跑步', 'qù gōng yuán pǎo bù', 'courir au parc'))},
  [], ['t', 'h', 'v']))

# 7. Écran 5 — 就是 + hypothèse，我也 + suite (oral)
gabarits.append(gab(
  [T('就是', 'jiù shì'), S('h'), P('，'), T('我', 'wǒ'), T('也', 'yě'), S('v'), P('。')],
  'Même si …, je ….',
  {'h': col(('下雨', 'xià yǔ', 'il pleut'), ('很贵', 'hěn guì', 'c’est cher'),
            ('不睡觉', 'bú shuì jiào', 'sans dormir'), ('他求我', 'tā qiú wǒ', 'il me supplie'),
            ('给我一百万', 'gěi wǒ yì bǎi wàn', 'pour un million'), ('你不请我', 'nǐ bù qǐng wǒ', 'tu ne m’invites pas'),
            ('排两个小时队', 'pái liǎng ge xiǎo shí duì', 'faire deux heures de queue'), ('老板来了', 'lǎo bǎn lái le', 'le patron arrive'),
            ('很辣', 'hěn là', 'c’est épicé'), ('晚一点儿', 'wǎn yì diǎnr', 'c’est un peu tard'),
            ('没有人去', 'méi yǒu rén qù', 'personne n’y va'), ('考不上', 'kǎo bu shàng', 'je ne suis pas reçu')),
   'v': col(('要去', 'yào qù', 'y vais'), ('要买', 'yào mǎi', 'l’achète'),
            ('要把这本书看完', 'yào bǎ zhè běn shū kàn wán', 'finis ce livre'), ('不去', 'bú qù', 'n’y vais pas'),
            ('不卖', 'bú mài', 'ne le vends pas'), ('会来', 'huì lái', 'viendrai'),
            ('要吃这家的饺子', 'yào chī zhè jiā de jiǎo zi', 'mange les raviolis d’ici'), ('这么说', 'zhè me shuō', 'le dis'),
            ('吃', 'chī', 'en mange'), ('等你', 'děng nǐ', 't’attends'),
            ('去', 'qù', 'y vais'), ('不后悔', 'bú hòu huǐ', 'ne regrette rien'))},
  [['h', 'v']], [], reg='oral'))

# 8. Écran 6 — 不 … ，也 … (oral)
gabarits.append(gab(
  [S('a'), P('，'), S('b'), P('。')],
  'Même si … ne … pas, ….',
  {'a': col(('你不说', 'nǐ bù shuō', 'tu ne dis rien'), ('你不来', 'nǐ bù lái', 'tu ne viens pas'),
            ('你不告诉我', 'nǐ bú gào su wǒ', 'tu ne me dis rien'), ('你不叫我', 'nǐ bú jiào wǒ', 'tu ne me réveilles pas'),
            ('他不帮忙', 'tā bù bāng máng', 'il n’aide pas'), ('你不提醒我', 'nǐ bù tí xǐng wǒ', 'tu ne me le rappelles pas'),
            ('你不请客', 'nǐ bù qǐng kè', 'tu n’invites pas'), ('你不给钱', 'nǐ bù gěi qián', 'tu ne paies pas'),
            ('他不同意', 'tā bù tóng yì', 'il n’est pas d’accord'), ('你不问', 'nǐ bú wèn', 'tu ne demandes pas'),
            ('不吃药', 'bù chī yào', 'sans médicament'), ('你不等我', 'nǐ bù děng wǒ', 'tu ne m’attends pas')),
   'b': col(('我也知道', 'wǒ yě zhī dào', 'je le sais'), ('我们也去', 'wǒ men yě qù', 'nous irons'),
            ('我也会知道的', 'wǒ yě huì zhī dào de', 'je le saurai'), ('我也会起来', 'wǒ yě huì qǐ lái', 'je me lèverai'),
            ('我也能做完', 'wǒ yě néng zuò wán', 'je pourrai finir'), ('我也记得', 'wǒ yě jì de', 'je m’en souviens'),
            ('我也来', 'wǒ yě lái', 'je viens'), ('我也帮你', 'wǒ yě bāng nǐ', 'je t’aide'),
            ('我也要去', 'wǒ yě yào qù', 'j’y vais'), ('我也会告诉你', 'wǒ yě huì gào su nǐ', 'je te le dirai'),
            ('病也会好的', 'bìng yě huì hǎo de', 'ça guérira'), ('我也能找到', 'wǒ yě néng zhǎo dào', 'je trouverai'))},
  [['a', 'b']], [], reg='oral'))

# 9. Écran 6 — 没 … ，也 … : ce qui s’est passé
gabarits.append(gab(
  [S('a'), P('，'), S('b'), P('。')],
  '… pas …, et pourtant ….',
  {'a': col(('我没告诉他', 'wǒ méi gào su tā', 'je ne lui ai rien dit'), ('我没叫他', 'wǒ méi jiào tā', 'je ne l’ai pas appelé'),
            ('没人教他', 'méi rén jiāo tā', 'personne ne le lui a appris'), ('她没带地图', 'tā méi dài dì tú', 'elle n’avait pas de plan'),
            ('我没放盐', 'wǒ méi fàng yán', 'je n’ai pas mis de sel'), ('他没穿大衣', 'tā méi chuān dà yī', 'il n’a pas mis de manteau'),
            ('我没看说明书', 'wǒ méi kàn shuō míng shū', 'je n’ai pas lu le mode d’emploi'), ('我没复习', 'wǒ méi fù xí', 'je n’ai pas révisé'),
            ('他没吃早饭', 'tā méi chī zǎo fàn', 'il n’a pas pris de petit déjeuner'), ('我们没开空调', 'wǒ men méi kāi kōng tiáo', 'nous n’avons pas mis la climatisation'),
            ('没人提醒他', 'méi rén tí xǐng tā', 'personne ne le lui a rappelé'), ('我没订座', 'wǒ méi dìng zuò', 'je n’avais pas réservé')),
   'b': col(('他也知道了', 'tā yě zhī dào le', 'il l’a su'), ('他也来了', 'tā yě lái le', 'il est venu'),
            ('他也学会了', 'tā yě xué huì le', 'il a appris'), ('也找到了那家饭馆', 'yě zhǎo dào le nà jiā fàn guǎn', 'elle a trouvé le restaurant'),
            ('也挺好吃的', 'yě tǐng hǎo chī de', 'c’est bon'), ('也不冷', 'yě bù lěng', 'il n’a pas froid'),
            ('也会用', 'yě huì yòng', 'je sais m’en servir'), ('也考得不错', 'yě kǎo de bú cuò', 'j’ai bien réussi'),
            ('也不饿', 'yě bú è', 'il n’a pas faim'), ('也不热', 'yě bú rè', 'il ne fait pas chaud'),
            ('他也记得', 'tā yě jì de', 'il s’en est souvenu'), ('也有位子', 'yě yǒu wèi zi', 'il y avait de la place'))},
  [['a', 'b']], []))

# 10. Écran 8 — 别客气，有什么/想 V 什么，尽管 + V (oral)
gabarits.append(gab(
  [S('r'), P('，'), S('a'), P('，'), T('尽管', 'jǐn guǎn'), S('b'), P('。')],
  '…, si vous … …, n’hésitez pas à ….',
  {'r': liste(('别客气', 'bié kè qi', 'ne vous gênez pas'), ('不用客气', 'bú yòng kè qi', 'je vous en prie')),
   'a': col(('有什么问题', 'yǒu shén me wèn tí', 'avez une question'), ('想吃什么', 'xiǎng chī shén me', 'voulez manger quelque chose'),
            ('需要什么', 'xū yào shén me', 'avez besoin de quelque chose'), ('想要什么', 'xiǎng yào shén me', 'voulez quelque chose'),
            ('有什么事', 'yǒu shén me shì', 'avez besoin de moi'), ('有什么不懂的', 'yǒu shén me bù dǒng de', 'ne comprenez pas'),
            ('想喝什么', 'xiǎng hē shén me', 'voulez boire quelque chose'), ('想看哪本书', 'xiǎng kàn nǎ běn shū', 'voulez lire un livre'),
            ('有什么困难', 'yǒu shén me kùn nan', 'avez une difficulté'), ('想住几天', 'xiǎng zhù jǐ tiān', 'voulez rester quelques jours'),
            ('想去哪儿玩', 'xiǎng qù nǎr wán', 'voulez sortir quelque part'), ('有什么意见', 'yǒu shén me yì jiàn', 'avez une remarque')),
   'b': col(('问', 'wèn', 'demander'), ('点', 'diǎn', 'commander'),
            ('说', 'shuō', 'le dire'), ('拿', 'ná', 'le prendre'),
            ('找我', 'zhǎo wǒ', 'venir me voir'), ('问我', 'wèn wǒ', 'me demander'),
            ('喝', 'hē', 'vous servir'), ('拿去看', 'ná qù kàn', 'l’emporter'),
            ('告诉我', 'gào su wǒ', 'me le dire'), ('住', 'zhù', 'rester'),
            ('说', 'shuō', 'le dire'), ('提', 'tí', 'la faire'))},
  [['a', 'b']], ['r'], reg='oral'))

# 11. Écran 8 — 尽管有点儿 …，不过/可是 … (oral)
gabarits.append(gab(
  [T('尽管', 'jǐn guǎn'), S('a'), P('，'), S('m'), S('b'), P('。')],
  'C’est un peu …, mais ….',
  {'a': col(('有点儿贵', 'yǒu diǎnr guì', 'cher'), ('有点儿远', 'yǒu diǎnr yuǎn', 'loin'),
            ('有点儿辣', 'yǒu diǎnr là', 'épicé'), ('房间有点儿小', 'fáng jiān yǒu diǎnr xiǎo', 'petit, la chambre'),
            ('工作有点儿累', 'gōng zuò yǒu diǎnr lèi', 'fatigant, le travail'), ('路上有点儿堵', 'lù shang yǒu diǎnr dǔ', 'bouché, sur la route'),
            ('汉字有点儿难', 'Hàn zì yǒu diǎnr nán', 'difficile, les caractères'), ('天气有点儿冷', 'tiān qì yǒu diǎnr lěng', 'froid, le temps'),
            ('排队的人有点儿多', 'pái duì de rén yǒu diǎnr duō', 'long, la file d’attente'), ('这件衣服有点儿旧', 'zhè jiàn yī fu yǒu diǎnr jiù', 'vieux, ce vêtement'),
            ('他说话有点儿快', 'tā shuō huà yǒu diǎnr kuài', 'rapide, sa façon de parler'), ('饺子有点儿咸', 'jiǎo zi yǒu diǎnr xián', 'salé, les raviolis')),
   'b': col(('味道真不错', 'wèi dao zhēn bú cuò', 'c’est vraiment bon'), ('风景很美', 'fēng jǐng hěn měi', 'le paysage est beau'),
            ('挺好吃的', 'tǐng hǎo chī de', 'c’est très bon'), ('很干净', 'hěn gān jìng', 'elle est propre'),
            ('同事都很好', 'tóng shì dōu hěn hǎo', 'les collègues sont gentils'), ('我们没迟到', 'wǒ men méi chí dào', 'nous ne sommes pas en retard'),
            ('很有意思', 'hěn yǒu yì si', 'c’est passionnant'), ('我们玩得很开心', 'wǒ men wán de hěn kāi xīn', 'on s’est bien amusés'),
            ('很快就到我们了', 'hěn kuài jiù dào wǒ men le', 'notre tour est vite arrivé'), ('穿着很舒服', 'chuān zhe hěn shū fu', 'il est confortable'),
            ('我都听懂了', 'wǒ dōu tīng dǒng le', 'j’ai tout compris'), ('挺香的', 'tǐng xiāng de', 'ils sont savoureux')),
   'm': liste(('不过', 'bú guò', 'mais'), ('可是', 'kě shì', 'mais'))},
  [['a', 'b']], ['m'], reg='oral'))

# ---------------------------------------------------------------------
# Transformations (9), 改错 (8), réemplois (4)
# ---------------------------------------------------------------------
def TR(consigne, de, vers, fr, reg=None):
    d = {'consigne': consigne, 'de': EX(*de), 'vers': {'seg': seg(*vers), 'fr': fr}}
    if reg:
        d['reg'] = reg
    return d

transfo = [
  TR('Insistez sur le fait admis, avec 尽管 et 还是', ('这家饭馆很贵，可是客人很多。', 'zhè jiā fàn guǎn hěn guì, kě shì kè rén hěn duō', 'Ce restaurant est cher, mais il y a beaucoup de clients.'),
     [('尽管', 'jǐn guǎn'), ('这家饭馆', 'zhè jiā fàn guǎn'), ('很贵', 'hěn guì'), '，', ('客人', 'kè rén'), ('还是', 'hái shi'), ('很多', 'hěn duō'), '。'], 'Ce restaurant a beau être cher, il y a quand même beaucoup de clients.'),
  TR('Remplacez 可是 par 却, à sa place', ('我想去，可是他不想去。', 'wǒ xiǎng qù, kě shì tā bù xiǎng qù', 'Je veux y aller, mais lui ne veut pas.'),
     [('我', 'wǒ'), ('想去', 'xiǎng qù'), '，', ('他', 'tā'), ('却', 'què'), ('不想去', 'bù xiǎng qù'), '。'], 'Moi, je veux y aller ; lui, pourtant, ne veut pas.'),
  TR('Dites l’exception avec 却', ('大家都来了，只有他没来。', 'dà jiā dōu lái le, zhǐ yǒu tā méi lái', 'Tout le monde est venu, il n’y a que lui qui ne soit pas venu.'),
     [('大家', 'dà jiā'), ('都', 'dōu'), ('来了', 'lái le'), '，', ('他', 'tā'), ('却', 'què'), ('没来', 'méi lái'), '。'], 'Tout le monde est venu, sauf lui.'),
  TR('Posez une hypothèse avec 即使⋯也', ('如果下雨，我还是要去。', 'rú guǒ xià yǔ, wǒ hái shi yào qù', 'S’il pleut, j’irai quand même.'),
     [('即使', 'jí shǐ'), ('下雨', 'xià yǔ'), '，', ('我', 'wǒ'), ('也', 'yě'), ('要去', 'yào qù'), '。'], 'Même s’il pleut, j’irai.'),
  TR('Ce n’est qu’une hypothèse : dites-le avec 即使⋯也', ('明天可能下雨，可是我们还是去爬山。', 'míng tiān kě néng xià yǔ, kě shì wǒ men hái shi qù pá shān', 'Il pleuvra peut-être demain, mais nous irons quand même en montagne.'),
     [('即使', 'jí shǐ'), ('明天', 'míng tiān'), ('下雨', 'xià yǔ'), '，', ('我们', 'wǒ men'), ('也', 'yě'), ('去', 'qù'), ('爬山', 'pá shān'), '。'], 'Même s’il pleut demain, nous irons en montagne.'),
  TR('Dites-le comme à l’oral, avec 就是', ('即使下雨，我也要去。', 'jí shǐ xià yǔ, wǒ yě yào qù', 'Même s’il pleut, j’irai.'),
     [('就是', 'jiù shì'), ('下雨', 'xià yǔ'), '，', ('我', 'wǒ'), ('也', 'yě'), ('要去', 'yào qù'), '。'], 'Même s’il pleut, j’y vais.', reg='oral'),
  TR('Supprimez le connecteur : 不 et 也 suffisent', ('即使你不说，我也知道。', 'jí shǐ nǐ bù shuō, wǒ yě zhī dào', 'Même si tu ne dis rien, je le sais.'),
     [('你', 'nǐ'), ('不说', 'bù shuō'), ('我', 'wǒ'), ('也', 'yě'), ('知道', 'zhī dào'), '。'], 'Même si tu ne dis rien, je le sais.', reg='oral'),
  TR('Dites-le comme à l’oral, à la place de 然而', ('大家都以为他会赢，然而他输了。', 'dà jiā dōu yǐ wéi tā huì yíng, rán ér tā shū le', 'Tout le monde pensait qu’il gagnerait ; cependant, il a perdu.'),
     [('大家', 'dà jiā'), ('都', 'dōu'), ('以为', 'yǐ wéi'), ('他', 'tā'), ('会赢', 'huì yíng'), '，', ('可是', 'kě shì'), ('他', 'tā'), ('输了', 'shū le'), '。'], 'Tout le monde pensait qu’il gagnerait, mais il a perdu.'),
  TR('Invitez avec 尽管 : « n’hésitez pas »', ('有什么问题，你可以问我，别客气。', 'yǒu shén me wèn tí, nǐ kě yǐ wèn wǒ, bié kè qi', 'Si vous avez une question, vous pouvez me la poser, ne vous gênez pas.'),
     [('有', 'yǒu'), ('什么', 'shén me'), ('问题', 'wèn tí'), '，', ('你', 'nǐ'), ('尽管', 'jǐn guǎn'), ('问', 'wèn'), '。'], 'Si vous avez une question, n’hésitez pas.', reg='oral'),
]

def FX(toks, bad, bon, why):
    s = seg(*toks)
    assert s[bad]['p']
    return {'seg': s, 'bad': bad, 'bon': bon, 'why': why}

fixes = [
  FX([('我', 'wǒ'), ('想去', 'xiǎng qù'), '，', ('却', 'què'), ('他', 'tā'), ('不想去', 'bù xiǎng qù'), '。'], 3, '我想去，他却不想去。',
     '却 est un adverbe : il se place après le sujet, jamais en tête.'),
  FX([('东西', 'dōng xi'), ('很贵', 'hěn guì'), '，', ('却', 'què'), ('质量', 'zhì liàng'), ('不好', 'bù hǎo'), '。'], 3, '东西很贵，质量却不好。',
     '却 suit le sujet de la seconde partie : 质量却不好.'),
  FX([('即使', 'jí shǐ'), ('下雨', 'xià yǔ'), '，', ('我', 'wǒ'), ('就', 'jiù'), ('去', 'qù'), '。'], 4, '即使下雨，我也去。',
     '即使 appelle 也, pas 就 : la suite tient malgré l’hypothèse.'),
  FX([('尽管', 'jǐn guǎn'), ('明天', 'míng tiān'), ('下雨', 'xià yǔ'), '，', ('我们', 'wǒ men'), ('也', 'yě'), ('去', 'qù'), ('爬山', 'pá shān'), '。'], 0, '即使明天下雨，我们也去爬山。',
     'Demain, c’est une hypothèse : 即使. 尽管 ne pose qu’un fait réel.'),
  FX([('他', 'tā'), ('尽管', 'jǐn guǎn'), ('很忙', 'hěn máng'), '，', ('所以', 'suǒ yǐ'), ('每天', 'měi tiān'), ('给妈妈', 'gěi mā ma'), ('打电话', 'dǎ diàn huà'), '。'], 4, '他尽管很忙，还是每天给妈妈打电话。',
     '尽管 annonce une opposition : la suite prend 还是, 可是 ou 但是, jamais 所以.'),
  FX([('就是', 'jiù shì'), ('给我', 'gěi wǒ'), ('一百万', 'yì bǎi wàn'), '，', ('我', 'wǒ'), ('不卖', 'bú mài'), '。'], 5, '就是给我一百万，我也不卖。',
     '就是⋯也 : 也 ne tombe pas, même à l’oral. La négation le suit : 也不卖.'),
  FX([('大家', 'dà jiā'), ('都', 'dōu'), ('以为', 'yǐ wéi'), ('他', 'tā'), ('会赢', 'huì yíng'), '，', ('他', 'tā'), ('然而', 'rán ér'), ('输了', 'shū le'), '。'], 7, '大家都以为他会赢，然而他输了。',
     '然而 ouvre la seconde partie, devant le sujet. Après le sujet, c’est 却.'),
  FX([('有', 'yǒu'), ('什么', 'shén me'), ('问题', 'wèn tí'), '，', ('尽管', 'jǐn guǎn'), ('你', 'nǐ'), ('问', 'wèn'), '。'], 4, '有什么问题，你尽管问。',
     'Au sens de « n’hésitez pas », 尽管 est un adverbe : il suit le sujet.'),
]

reemploi = [
  {'q': 'Il pleuvait à verse le jour de votre anniversaire, et pourtant vos amis sont tous venus. Racontez-le avec 尽管.',
   'verif': [{'type': 'contient', 'v': '尽管', 'msg': 'Un fait admis : 尽管.'},
             {'type': 'un_parmi', 'v': ['还是', '可是', '但是', '不过'], 'msg': 'La suite : 还是, 可是, 但是 ou 不过.'}],
   'modeles': [EX('尽管下着大雨，朋友们还是都来了。', 'jǐn guǎn xià zhe dà yǔ, péng you men hái shi dōu lái le', 'Malgré la pluie battante, mes amis sont tous venus.'),
               EX('尽管那天下大雨，可是大家都来给我过生日了。', 'jǐn guǎn nà tiān xià dà yǔ, kě shì dà jiā dōu lái gěi wǒ guò shēng rì le', 'Il pleuvait à verse ce jour-là, mais tout le monde est venu fêter mon anniversaire.')],
   'criteres': ['尽管 devant le fait admis', 'La suite avec 还是, ou 可是 en tête', 'Pas de 所以 : c’est une opposition']},
  {'q': 'Un collègue vous prévient qu’il fera très mauvais demain. Dites-lui que vous irez quand même à la randonnée.',
   'verif': [{'type': 'un_parmi', 'v': ['即使', '就是'], 'msg': 'Une hypothèse : 即使 ou 就是.'},
             {'type': 'contient', 'v': '也', 'msg': 'La suite rattachée par 也.'}],
   'modeles': [EX('即使明天下雨，我也要去爬山。', 'jí shǐ míng tiān xià yǔ, wǒ yě yào qù pá shān', 'Même s’il pleut demain, j’irai en montagne.'),
               EX('就是下大雨，我也去。', 'jiù shì xià dà yǔ, wǒ yě qù', 'Même s’il pleut à verse, j’y vais.', reg='oral')],
   'criteres': ['即使, ou 就是 à l’oral, devant l’hypothèse', '也 après le sujet de la seconde partie', 'Pas de 尽管 : demain n’est qu’une hypothèse']},
  {'q': 'Comparez-vous à un proche : vous aimez une chose, lui, pourtant, pas du tout. Dites-le avec 却.',
   'verif': [{'type': 'contient', 'v': '却', 'msg': 'Pourtant : 却, après le sujet.'}],
   'modeles': [EX('我很喜欢吃辣的，我妹妹却一点儿也不吃。', 'wǒ hěn xǐ huan chī là de, wǒ mèi mei què yì diǎnr yě bù chī', 'J’adore les plats épicés ; ma sœur, pourtant, n’en mange pas du tout.'),
               EX('我喜欢早起，我朋友却喜欢睡懒觉。', 'wǒ xǐ huan zǎo qǐ, wǒ péng you què xǐ huan shuì lǎn jiào', 'J’aime me lever tôt ; mon ami, lui, aime faire la grasse matinée.')],
   'criteres': ['Deux sujets différents', '却 après le second sujet, devant le verbe', 'Jamais 却 en tête']},
  {'q': 'Vous recevez un ami chez vous. Invitez-le à se servir et à vous demander ce qu’il veut, sans se gêner.',
   'verif': [{'type': 'contient', 'v': '尽管', 'msg': 'N’hésitez pas : 尽管 + verbe.'}],
   'modeles': [EX('别客气，想吃什么尽管吃。', 'bié kè qi, xiǎng chī shén me jǐn guǎn chī', 'Ne te gêne pas, mange ce que tu veux.', reg='oral'),
               EX('你需要什么，尽管告诉我。', 'nǐ xū yào shén me, jǐn guǎn gào su wǒ', 'Si tu as besoin de quelque chose, dis-le-moi.', reg='oral')],
   'criteres': ['尽管 directement devant le verbe', 'Le sujet, s’il y en a un, devant 尽管', '别客气 pour mettre à l’aise'],
   'reg': 'oral'},
]

fiche = {
  'id': 'g401', 'hsk': 4, 'fam': 'phrase', 'th': ['avis', 'quotidien'],
  'title': 'Concéder : 尽管, 却, 即使⋯也, 就是⋯也, 你不说我也知道, 然而',
  'resume': 'Admettre un fait et passer outre (尽管很累，他还是来了), dire « pourtant » au bon endroit (他却不想去), poser une hypothèse qui ne change rien (即使下雨，我也要去 ; à l’oral 就是下雨), concéder sans connecteur (你不说我也知道), et reconnaître le 然而 de l’écrit.',
  'hsk3': [],
  'equiv': equiv,
  'steps': steps, 'tableau': tableau, 'piege': piege,
  'voir': ['g314', 'g316', 'g330'],
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
    print('g401 — %d écrans, %d gabarits, %d phrases engendrées' % (len(steps), len(gabarits), tot))
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
