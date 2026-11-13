# -*- coding: utf-8 -*-
"""g331 — Autour du nom (rattrapage HSK 3).
Construit la fiche, la contrôle, imprime les tirages à relire.
Usage : python3 outils/fiches/g331.py [--poser]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from gram_lib import *

# ---------------------------------------------------------------------
# Écrans
# ---------------------------------------------------------------------
steps = [
  ecran('的 sans nom : 红的, 我的', [
    'Quand le nom est déjà connu, le chinois le laisse tomber et garde <b>的</b> : 我要红<b>的</b> — <i>je veux le rouge</i>.',
    'Le français dit « le rouge », « le mien », « celui de Paul ». Le chinois n’a ni article ni pronom pour cela : 的 suffit. 这本书是我<b>的</b> — <i>ce livre est à moi</i>.',
    'Rien de nouveau dans la construction : devant un nom, 的 relie déjà un adjectif ou un possesseur (fiche 202). Ici, le nom ne vient simplement pas : 便宜<b>的</b>, 我朋友<b>的</b>.',
    'Un adjectif d’une syllabe perd souvent 的 devant un nom : 红衣服. Il le reprend dès que le nom disparaît : on dit 红<b>的</b>, jamais 红 tout seul.'],
    [EX('我要红的。', 'wǒ yào hóng de', 'Je veux le rouge.'),
     EX('这本书是我的。', 'zhè běn shū shì wǒ de', 'Ce livre est à moi.'),
     EX('这件太大了，有没有小一点儿的？', 'zhè jiàn tài dà le, yǒu méi yǒu xiǎo yì diǎnr de', 'Celui-ci est trop grand, vous en avez un plus petit ?',
        note='Le vêtement est sous les yeux : on ne le nomme plus.')],
    {'q': 'Pour dire « je prends le grand », on dit :', 'a': ['我要大。', '我要大的。'], 'ok': 1,
     'why': 'Sans nom derrière lui, l’adjectif garde 的 : 大的.'}),

  ecran('我买的, 卖菜的 : ce qu’on fait, celui qui le fait', [
    'Un verbe suivi de <b>的</b> désigne lui aussi une chose ou une personne : 我买<b>的</b> — <i>ce que j’ai acheté</i>.',
    'Le français a besoin de « ce que » ou de « celui qui ». Le chinois n’a que 的 : 你说<b>的</b>都对 — <i>tout ce que tu dis est juste</i>.',
    'Quand le verbe a déjà son complément, 的 désigne la personne qui agit : 卖菜<b>的</b> — <i>le marchand de légumes</i>. Quand il lui manque son complément, 的 désigne la chose : 吃<b>的</b> — <i>de quoi manger</i>.',
    'Ne confondez pas avec le 是⋯的 de la fiche 301 : 这本书是我买<b>的</b> se comprend aussi « c’est moi qui l’ai acheté ». Le contexte tranche.'],
    [EX('你说的都对。', 'nǐ shuō de dōu duì', 'Tout ce que tu dis est juste.'),
     EX('他是卖菜的。', 'tā shì mài cài de', 'Il est marchand de légumes.'),
     EX('有喝的吗？', 'yǒu hē de ma', 'Il y a quelque chose à boire ?', note='Le verbe n’a pas de complément : 的 désigne la chose.')],
    {'q': '卖水果的 désigne :', 'a': ['des fruits vendus', 'la personne qui vend des fruits'], 'ok': 1,
     'why': 'Le verbe a déjà son complément, 水果 : 的 désigne celui qui agit.'}),

  ecran('La relative se place devant le nom', [
    'Pour dire « le livre que j’ai acheté », le chinois place toute la proposition devant le nom, puis 的 : 我买<b>的</b>书.',
    'C’est l’ordre inverse du français. On ne nomme pas d’abord pour expliquer ensuite : on décrit, puis on nomme. 这是我昨天买<b>的</b>书 — <i>c’est le livre que j’ai acheté hier</i>.',
    'Il n’y a pas de pronom relatif : ni « que », ni « qui », ni « dont ». 的 marque seul la fin de la description : 妈妈做<b>的</b>菜.',
    'La proposition garde son ordre normal, sujet, moment, verbe ; seul son complément manque, puisque c’est le nom placé après 的. Et le passé n’y prend pas 了 : 我昨天买<b>的</b>书.'],
    [EX('这是我昨天买的书。', 'zhè shì wǒ zuó tiān mǎi de shū', 'C’est le livre que j’ai acheté hier.'),
     EX('妈妈做的菜很好吃。', 'mā ma zuò de cài hěn hǎo chī', 'Les plats que fait maman sont délicieux.'),
     EX('你借的书在桌子上。', 'nǐ jiè de shū zài zhuō zi shang', 'Le livre que tu as emprunté est sur la table.')],
    {'q': '« Les photos qu’il a prises » se dit :', 'a': ['照片他拍的', '他拍的照片'], 'ok': 1,
     'why': 'La description vient d’abord, et le nom ferme le groupe.'}),

  ecran('Qui, où, quand : une seule construction', [
    'Quand le nom fait l’action, c’est le sujet qui manque dans la proposition : 教我中文<b>的</b>老师 — <i>le professeur qui m’enseigne le chinois</i>.',
    'Le français change de pronom selon le cas. Le chinois garde la même construction pour un lieu ou un moment : 我住<b>的</b>地方 — <i>l’endroit où j’habite</i>.',
    'Pour désigner quelqu’un dans une pièce, on le décrit devant 那个人 : 穿红衣服<b>的</b>那个人 — <i>la personne habillée en rouge</i>.',
    'Attention à la place des mots : 我认识<b>的</b>人 est <i>quelqu’un que je connais</i>, 认识我<b>的</b>人 <i>quelqu’un qui me connaît</i>. Tout tient à la place de 我.'],
    [EX('教我中文的老师是北京人。', 'jiāo wǒ Zhōng wén de lǎo shī shì Běi jīng rén', 'Le professeur qui m’enseigne le chinois est de Pékin.'),
     EX('我住的地方离地铁很近。', 'wǒ zhù de dì fang lí dì tiě hěn jìn', 'L’endroit où j’habite est tout près du métro.'),
     EX('穿红衣服的那个人是我姐姐。', 'chuān hóng yī fu de nà ge rén shì wǒ jiě jie', 'La personne habillée en rouge, c’est ma grande sœur.')],
    {'q': '认识我的人 veut dire :', 'a': ['quelqu’un que je connais', 'quelqu’un qui me connaît'], 'ok': 1,
     'why': '我 est le complément de 认识 : c’est l’autre qui connaît.'}),

  ecran('Nom devant nom : avec ou sans 的', [
    'Un nom en qualifie un autre sans 的 quand il dit de quelle sorte il s’agit : 历史老师 — <i>un professeur d’histoire</i>.',
    'Avec 的, le premier nom devient un possesseur : 老师<b>的</b>书 — <i>le livre du professeur</i>. Le français fait la même différence entre « un livre de professeur » et « le livre du professeur ».',
    'La nuance s’entend dans 中国菜 et 中国<b>的</b>菜 : le premier est la cuisine chinoise, où qu’on la mange ; le second, ce qu’on mange en Chine.',
    'Les couples les plus courants forment presque un seul mot : 中文书, 法国菜, 数学课. Ne leur ajoutez pas 的.'],
    [EX('她是历史老师。', 'tā shì lì shǐ lǎo shī', 'Elle est professeure d’histoire.'),
     EX('这是老师的书。', 'zhè shì lǎo shī de shū', 'C’est le livre du professeur.'),
     EX('我很喜欢吃中国菜。', 'wǒ hěn xǐ huan chī Zhōng guó cài', 'J’aime beaucoup la cuisine chinoise.')],
    {'q': '« Un professeur de musique » se dit :', 'a': ['音乐老师', '音乐的老师'], 'ok': 0,
     'why': 'Le premier nom dit la sorte : pas de 的.'}),

  ecran('Plusieurs déterminants : qui va où', [
    'Quand plusieurs éléments qualifient un même nom, le chinois les range du plus éloigné au plus proche : le possesseur, puis 这 ou 那 avec le classificateur, puis la description, enfin le nom. 我朋友那件红衣服.',
    'Ce qui se colle au nom sans 的, adjectif d’une syllabe ou nom de sorte, reste contre lui : 一件很漂亮<b>的</b>红衣服, jamais 一件红很漂亮的衣服.',
    'Une relative se place volontiers devant 那 et le classificateur : 我昨天买<b>的</b>那本书. L’ordre 那本我昨天买<b>的</b>书 se dit aussi.',
    'Évitez d’empiler les 的. Entre proches, le premier tombe : 我朋友<b>的</b>书, plutôt que 我的朋友的书. Devant 这 ou 那, le possesseur s’en passe aussi : 你那件衣服.'],
    [EX('我很喜欢你那件红衣服。', 'wǒ hěn xǐ huan nǐ nà jiàn hóng yī fu', 'J’aime beaucoup ton vêtement rouge.'),
     EX('她买了一件很漂亮的红衣服。', 'tā mǎi le yí jiàn hěn piào liang de hóng yī fu', 'Elle a acheté un très joli vêtement rouge.'),
     EX('我昨天买的那本书很有意思。', 'wǒ zuó tiān mǎi de nà běn shū hěn yǒu yì si', 'Le livre que j’ai acheté hier est très intéressant.')],
    {'q': 'Lequel est correct ?', 'a': ['一件很漂亮的红衣服', '一件红很漂亮的衣服'], 'ok': 0,
     'why': 'Le monosyllabe 红 reste collé au nom ; le groupe en 的 passe devant.'}),

  ecran('L’apposition : 首都北京, 我朋友小王', [
    'Pour dire « mon collègue Li Ming », le chinois pose les deux noms côte à côte, sans virgule ni 的 : 我同事李明.',
    'Le terme général vient d’abord, le nom propre ensuite : 首都北京 — <i>la capitale, Pékin</i>.',
    'Un pronom pluriel se fait suivre d’un nombre ou de 大家 : 我们三个 — <i>nous trois</i> ; 你们大家 — <i>vous tous</i>. Vous connaissez déjà 我们俩 (fiche 205).',
    'Avec 的, on n’a plus une personne mais deux : 我朋友<b>的</b>同事 — <i>le collègue de mon ami</i>.'],
    [EX('这是我同事李明。', 'zhè shì wǒ tóng shì Lǐ Míng', 'Je vous présente mon collègue Li Ming.'),
     EX('首都北京的冬天很冷。', 'shǒu dū Běi jīng de dōng tiān hěn lěng', 'L’hiver est très froid à Pékin, la capitale.'),
     EX('我们三个一起去吧。', 'wǒ men sān ge yì qǐ qù ba', 'Allons-y tous les trois.')],
    {'q': '« Mon ami Xiao Wang » se dit :', 'a': ['我朋友的小王', '我朋友小王'], 'ok': 1,
     'why': 'Deux noms pour une seule personne : côte à côte, sans 的.'}),

  ecran('À l’oral — choisir sans nommer, nommer par le métier', [
    'Au marché, au café, en boutique, le nom sous-entendu est la règle. On vous demandera : 你要大<b>的</b>还是小<b>的</b>？ Vous répondrez 大<b>的</b>, sans rien d’autre.',
    'Les métiers se nomment couramment par un groupe en 的 : 送快递<b>的</b>, 开出租车<b>的</b>. C’est familier, parfois un peu condescendant : pour s’adresser à quelqu’un, dites plutôt 师傅.',
    '我说<b>的</b>是⋯ ouvre une mise au point : 我说<b>的</b>是明天，不是今天 — <i>je parlais de demain, pas d’aujourd’hui</i>.',
    'Entre amis, 咱们 remplace volontiers 我们 quand celui qui écoute est inclus : 咱们俩一起去吧.'],
    [EX('你要大的还是小的？', 'nǐ yào dà de hái shi xiǎo de', 'Tu veux le grand ou le petit ?', reg='oral'),
     EX('送快递的来了。', 'sòng kuài dì de lái le', 'Le livreur est là.', reg='oral'),
     EX('我说的是明天，不是今天。', 'wǒ shuō de shì míng tiān, bú shì jīn tiān', 'Je parlais de demain, pas d’aujourd’hui.', reg='oral'),
     EX('咱们俩一起去吧。', 'zán men liǎ yì qǐ qù ba', 'Allons-y tous les deux.', reg='oral')],
    {'q': 'Pour héler un chauffeur de taxi, on dit plutôt :', 'a': ['开出租车的！', '师傅！'], 'ok': 1,
     'why': 'Le groupe en 的 nomme le métier ; pour interpeller, 师傅 est poli.'},
    reg='oral'),
]

# ---------------------------------------------------------------------
# Tableau, piège
# ---------------------------------------------------------------------
tableau = {'cols': ['Construction', 'Exemple', 'Ce qu’elle fait'], 'rows': [
  ['Adjectif + 的, sans nom', '我要红的', 'Le nom déjà connu tombe'],
  ['Possesseur + 的, sans nom', '这本书是我的', '« le mien », « à moi »'],
  ['Monosyllabe sans nom', '红的', 'Jamais 红 seul : 的 revient'],
  ['Sujet + verbe + 的', '我买的', '« ce que j’ai acheté »'],
  ['Verbe + complément + 的', '卖菜的', 'La personne qui agit'],
  ['Verbe seul + 的', '吃的, 喝的', 'La chose : de quoi manger, de quoi boire'],
  ['Relative + 的 + nom', '我买的书', '« le livre que j’ai acheté »'],
  ['Relative sans sujet', '教我中文的老师', '« qui » : le nom fait l’action'],
  ['Lieu, moment', '我住的地方', '« où », « quand »'],
  ['La place de 我', '我认识的人, 认识我的人', 'Que je connais, qui me connaît'],
  ['Pas de 了 devant 的', '我昨天买的书', 'Le moment suffit'],
  ['Nom de sorte + nom', '历史老师, 中文书', 'Sans 的 : la sorte'],
  ['Possesseur + 的 + nom', '老师的书', 'Avec 的 : l’appartenance'],
  ['中国菜, 中国的菜', '中国菜', 'La cuisine, ou ce qu’on mange en Chine'],
  ['Ordre des déterminants', '我朋友那件红衣服', 'Possesseur, 那 + classificateur, description, nom'],
  ['Groupe en 的, puis monosyllabe', '一件很漂亮的红衣服', 'Le monosyllabe reste contre le nom'],
  ['Relative devant 那', '我昨天买的那本书', 'L’ordre le plus courant'],
  ['Un seul 的', '我朋友的书', 'Plutôt que 我的朋友的书'],
  ['Possesseur + 那', '你那件衣服', '的 tombe devant 这 et 那'],
  ['Apposition', '我同事李明, 首都北京', 'Le terme général, puis le nom propre'],
  ['Pronom + nombre', '我们三个, 你们大家', '« nous trois », « vous tous »'],
  ['À l’oral', '你要大的还是小的？', 'Choisir sans nommer'],
  ['À l’oral', '送快递的', 'Nommer par le métier, familier'],
  ['Interpeller', '师傅！', 'Plutôt que 开出租车的！'],
]}

piege = {
  'bad': {'hz': '这是书我昨天买的。', 'py': 'zhè shì shū wǒ zuó tiān mǎi de'},
  'good': {'hz': '这是我昨天买的书。', 'py': 'zhè shì wǒ zuó tiān mǎi de shū'},
  'why': 'Le français nomme d’abord, puis décrit : « le livre que j’ai acheté hier ». Le chinois fait l’inverse : toute la description passe devant le nom, et 的 la ferme. Il n’y a pas de « que » à traduire, 的 en tient lieu ; le nom vient en dernier — 我昨天买的书.'}
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
  B([('我', 'wǒ'), ('要', 'yào'), ('红', 'hóng'), ('的', 'de'), '。'], 3, 'Je veux le rouge.'),
  B([('这本书', 'zhè běn shū'), ('是', 'shì'), ('我', 'wǒ'), ('的', 'de'), '。'], 3, 'Ce livre est à moi.'),
  B([('这件', 'zhè jiàn'), ('太大了', 'tài dà le'), '，', ('有没有', 'yǒu méi yǒu'), ('小一点儿', 'xiǎo yì diǎnr'), ('的', 'de'), '？'], 5,
    'Celui-ci est trop grand, vous en avez un plus petit ?'),
  B([('你说', 'nǐ shuō'), ('的', 'de'), ('都对', 'dōu duì'), '。'], 1, 'Tout ce que tu dis est juste.'),
  B([('他', 'tā'), ('是', 'shì'), ('卖菜', 'mài cài'), ('的', 'de'), '。'], 3, 'Il est marchand de légumes.', reg='oral'),
  B([('有', 'yǒu'), ('喝', 'hē'), ('的', 'de'), ('吗', 'ma'), '？'], 2, 'Il y a quelque chose à boire ?'),
  B([('这是', 'zhè shì'), ('我', 'wǒ'), ('昨天', 'zuó tiān'), ('买', 'mǎi'), ('的', 'de'), ('书', 'shū'), '。'], 4, 'C’est le livre que j’ai acheté hier.'),
  B([('妈妈', 'mā ma'), ('做', 'zuò'), ('的', 'de'), ('菜', 'cài'), ('很好吃', 'hěn hǎo chī'), '。'], 2, 'Les plats que fait maman sont délicieux.'),
  B([('你', 'nǐ'), ('借', 'jiè'), ('的', 'de'), ('书', 'shū'), ('在', 'zài'), ('桌子上', 'zhuō zi shang'), '。'], 2, 'Le livre que tu as emprunté est sur la table.'),
  B([('教我中文', 'jiāo wǒ Zhōng wén'), ('的', 'de'), ('老师', 'lǎo shī'), ('是北京人', 'shì Běi jīng rén'), '。'], 1, 'Le professeur qui m’enseigne le chinois est de Pékin.'),
  B([('我', 'wǒ'), ('住', 'zhù'), ('的', 'de'), ('地方', 'dì fang'), ('离地铁很近', 'lí dì tiě hěn jìn'), '。'], 2, 'L’endroit où j’habite est tout près du métro.'),
  B([('穿红衣服', 'chuān hóng yī fu'), ('的', 'de'), ('那个人', 'nà ge rén'), ('是', 'shì'), ('我姐姐', 'wǒ jiě jie'), '。'], 1, 'La personne habillée en rouge, c’est ma grande sœur.'),
  B([('她', 'tā'), ('是', 'shì'), ('历史', 'lì shǐ'), ('老师', 'lǎo shī'), '。'], 2, 'Elle est professeure d’histoire.'),
  B([('这是', 'zhè shì'), ('老师', 'lǎo shī'), ('的', 'de'), ('书', 'shū'), '。'], 2, 'C’est le livre du professeur.'),
  B([('她', 'tā'), ('买了', 'mǎi le'), ('一件', 'yí jiàn'), ('很漂亮', 'hěn piào liang'), ('的', 'de'), ('红衣服', 'hóng yī fu'), '。'], 4, 'Elle a acheté un très joli vêtement rouge.'),
  B([('我', 'wǒ'), ('昨天', 'zuó tiān'), ('买', 'mǎi'), ('的', 'de'), ('那本书', 'nà běn shū'), ('很有意思', 'hěn yǒu yì si'), '。'], 3, 'Le livre que j’ai acheté hier est très intéressant.'),
  B([('这是', 'zhè shì'), ('我', 'wǒ'), ('同事', 'tóng shì'), ('李明', 'Lǐ Míng'), '。'], 3, 'Je vous présente mon collègue Li Ming.'),
  B([('你', 'nǐ'), ('要', 'yào'), ('大', 'dà'), ('的', 'de'), ('还是', 'hái shi'), ('小', 'xiǎo'), ('的', 'de'), '？'], 4, 'Tu veux le grand ou le petit ?', reg='oral'),
]
leurres = ['地', '着', '在', '很', '也', '就', '给', '把', '被', '都', '还是', '是']

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
gabarits = []

# 1. Écran 1 — 的 sans nom, en boutique
gabarits.append(gab(
  [S('o'), P('，'), S('d'), T('太', 'tài'), S('a'), T('了', 'le'), P('，'), T('有没有', 'yǒu méi yǒu'), S('b'), T('的', 'de'), P('？')],
  '…, celui-ci est trop …, vous en avez un … ?',
  {'o': liste(('老板', 'lǎo bǎn', 'patron'), ('请问', 'qǐng wèn', 'excusez-moi'), ('不好意思', 'bù hǎo yì si', 'pardon')),
   'd': col(('这件', 'zhè jiàn', 'ce vêtement'), ('这件', 'zhè jiàn', 'ce vêtement'), ('这双', 'zhè shuāng', 'ces chaussures'),
            ('这双', 'zhè shuāng', 'ces chaussures'), ('这条', 'zhè tiáo', 'ce pantalon'), ('这条', 'zhè tiáo', 'ce pantalon'),
            ('这个', 'zhè ge', 'ce sac'), ('这本', 'zhè běn', 'ce livre'), ('这种', 'zhè zhǒng', 'ce plat'),
            ('这种', 'zhè zhǒng', 'ce gâteau'), ('这张', 'zhè zhāng', 'cette table'), ('这个', 'zhè ge', 'ce téléphone')),
   'a': col(('大', 'dà', 'grand'), ('小', 'xiǎo', 'petit'), ('贵', 'guì', 'cher'), ('大', 'dà', 'grandes'),
            ('长', 'cháng', 'long'), ('短', 'duǎn', 'court'), ('重', 'zhòng', 'lourd'), ('难', 'nán', 'difficile'),
            ('辣', 'là', 'pimenté'), ('甜', 'tián', 'sucré'), ('小', 'xiǎo', 'petite'), ('贵', 'guì', 'cher')),
   'b': col(('小一点儿', 'xiǎo yì diǎnr', 'plus petit'), ('大一点儿', 'dà yì diǎnr', 'plus grand'),
            ('便宜一点儿', 'pián yi yì diǎnr', 'moins cher'), ('小一点儿', 'xiǎo yì diǎnr', 'plus petit'),
            ('短一点儿', 'duǎn yì diǎnr', 'plus court'), ('长一点儿', 'cháng yì diǎnr', 'plus long'),
            ('轻一点儿', 'qīng yì diǎnr', 'plus léger'), ('容易一点儿', 'róng yì yì diǎnr', 'plus facile'),
            ('不辣', 'bú là', 'pas pimenté'), ('不太甜', 'bú tài tián', 'moins sucré'),
            ('大一点儿', 'dà yì diǎnr', 'plus grande'), ('便宜一点儿', 'pián yi yì diǎnr', 'moins cher'))},
  [['d', 'a', 'b']], ['o']))

# 2. Écran 1 — possesseur + 的, sans nom
gabarits.append(gab(
  [S('n'), T('是', 'shì'), S('p'), T('的', 'de'), P('，'), T('不是', 'bú shì'), S('q'), T('的', 'de'), P('。')],
  '… est à …, pas à ….',
  {'n': liste(('这本书', 'zhè běn shū', 'ce livre'), ('这个包', 'zhè ge bāo', 'ce sac'), ('这把伞', 'zhè bǎ sǎn', 'ce parapluie'),
              ('这件衣服', 'zhè jiàn yī fu', 'ce vêtement'), ('这张照片', 'zhè zhāng zhào piàn', 'cette photo')),
   'p': col(('我', 'wǒ', 'moi'), ('你', 'nǐ', 'toi'), ('他', 'tā', 'lui'), ('她', 'tā', 'elle'), ('我朋友', 'wǒ péng you', 'mon ami'),
            ('我妈妈', 'wǒ mā ma', 'ma mère'), ('我', 'wǒ', 'moi'), ('我同事', 'wǒ tóng shì', 'mon collègue'),
            ('我们', 'wǒ men', 'nous'), ('他们', 'tā men', 'eux'), ('小王', 'Xiǎo Wáng', 'Xiao Wang'), ('老师', 'lǎo shī', 'la professeure')),
   'q': col(('你', 'nǐ', 'toi'), ('我', 'wǒ', 'moi'), ('我', 'wǒ', 'moi'), ('他', 'tā', 'lui'), ('我', 'wǒ', 'moi'),
            ('我', 'wǒ', 'moi'), ('我妹妹', 'wǒ mèi mei', 'ma petite sœur'), ('我', 'wǒ', 'moi'),
            ('他们', 'tā men', 'eux'), ('我们', 'wǒ men', 'nous'), ('小李', 'Xiǎo Lǐ', 'Xiao Li'), ('学生', 'xué sheng', 'un élève'))},
  [['p', 'q']], ['n']))

# 3. Écran 2 — sujet + verbe + 的 : ce que l’on fait
gabarits.append(gab(
  [S('r'), S('v'), T('的', 'de'), T('都', 'dōu'), S('a'), P('。')],
  '… que tout ce que … est ….',
  {'r': liste(('我觉得', 'wǒ jué de', 'je trouve'), ('我也觉得', 'wǒ yě jué de', 'moi aussi, je trouve'), ('他觉得', 'tā jué de', 'il trouve')),
   'v': col(('你说', 'nǐ shuō', 'tu dis'), ('妈妈做', 'mā ma zuò', 'maman cuisine'), ('老师讲', 'lǎo shī jiǎng', 'le professeur explique'),
            ('我买', 'wǒ mǎi', 'j’ai acheté'), ('你写', 'nǐ xiě', 'tu écris'), ('你选', 'nǐ xuǎn', 'tu as choisi'),
            ('她拍', 'tā pāi', 'elle a photographié'), ('奶奶包', 'nǎi nai bāo', 'grand-mère a préparé (raviolis)'),
            ('我们点', 'wǒ men diǎn', 'nous avons commandé'), ('书上写', 'shū shang xiě', 'le livre dit'),
            ('他推荐', 'tā tuī jiàn', 'il a recommandé'), ('你带来', 'nǐ dài lái', 'tu as apporté')),
   'a': col(('对', 'duì', 'juste'), ('很好吃', 'hěn hǎo chī', 'délicieux'), ('很清楚', 'hěn qīng chu', 'clair'),
            ('很便宜', 'hěn pián yi', 'bon marché'), ('很好看', 'hěn hǎo kàn', 'joli'), ('不错', 'bú cuò', 'pas mal'),
            ('很漂亮', 'hěn piào liang', 'beau'), ('特别好吃', 'tè bié hǎo chī', 'particulièrement bon'),
            ('太辣了', 'tài là le', 'trop pimenté'), ('很有用', 'hěn yǒu yòng', 'utile'),
            ('很有意思', 'hěn yǒu yì si', 'intéressant'), ('很新鲜', 'hěn xīn xiān', 'frais'))},
  [['v', 'a']], ['r']))

# 4. Écran 2 et 8 — verbe + complément + 的 : le métier (oral)
gabarits.append(gab(
  [S('s'), T('是', 'shì'), S('v'), T('的', 'de'), P('。')],
  '… est … (familier).',
  {'s': liste(('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我爸爸', 'wǒ bà ba', 'mon père'), ('我邻居', 'wǒ lín jū', 'mon voisin'), ('我朋友', 'wǒ péng you', 'mon ami')),
   'v': liste(('卖菜', 'mài cài', 'marchand de légumes'), ('卖水果', 'mài shuǐ guǒ', 'marchand de fruits'),
              ('送快递', 'sòng kuài dì', 'livreur de colis'), ('送外卖', 'sòng wài mài', 'livreur de repas'),
              ('开出租车', 'kāi chū zū chē', 'chauffeur de taxi'), ('修车', 'xiū chē', 'garagiste'),
              ('修电脑', 'xiū diàn nǎo', 'réparateur d’ordinateurs'), ('做饭', 'zuò fàn', 'cuisinier'),
              ('教书', 'jiāo shū', 'enseignant'), ('卖衣服', 'mài yī fu', 'vendeur de vêtements'),
              ('开饭馆', 'kāi fàn guǎn', 'restaurateur'), ('卖肉', 'mài ròu', 'boucher'))},
  [], ['s', 'v'], reg='oral'))

# 5. Écran 3 — relative (complément) + 的 + nom
gabarits.append(gab(
  [T('这是', 'zhè shì'), S('s'), S('v'), T('的', 'de'), S('n'), P('。')],
  'Voici … que … a ….',
  {'s': liste(('我', 'wǒ', 'moi'), ('他', 'tā', 'lui'), ('我妈妈', 'wǒ mā ma', 'ma mère'), ('我朋友', 'wǒ péng you', 'mon ami'), ('老师', 'lǎo shī', 'le professeur')),
   'v': col(('买', 'mǎi', 'acheté'), ('做', 'zuò', 'cuisiné'), ('拍', 'pāi', 'prises'), ('画', 'huà', 'peint'),
            ('写', 'xiě', 'écrite'), ('借', 'jiè', 'emprunté'), ('包', 'bāo', 'préparés'), ('买', 'mǎi', 'achetés'),
            ('带来', 'dài lái', 'apportés'), ('推荐', 'tuī jiàn', 'recommandé'), ('选', 'xuǎn', 'choisi'), ('做', 'zuò', 'fait')),
   'n': col(('衣服', 'yī fu', 'le vêtement'), ('菜', 'cài', 'le plat'), ('照片', 'zhào piàn', 'les photos'), ('画儿', 'huàr', 'le tableau'),
            ('信', 'xìn', 'la lettre'), ('书', 'shū', 'le livre'), ('饺子', 'jiǎo zi', 'les raviolis'), ('票', 'piào', 'les billets'),
            ('水果', 'shuǐ guǒ', 'les fruits'), ('饭馆', 'fàn guǎn', 'le restaurant'), ('礼物', 'lǐ wù', 'le cadeau'), ('蛋糕', 'dàn gāo', 'le gâteau'))},
  [['v', 'n']], ['s']))

# 6. Écran 4 — relative sans sujet : « qui »
gabarits.append(gab(
  [S('v'), T('的', 'de'), T('那个人', 'nà ge rén'), T('是', 'shì'), S('p'), P('。')],
  'La personne qui …, c’est ….',
  {'v': liste(('穿红衣服', 'chuān hóng yī fu', 'est habillée en rouge'), ('戴眼镜', 'dài yǎn jìng', 'porte des lunettes'),
              ('站在门口', 'zhàn zài mén kǒu', 'est à la porte'), ('坐在左边', 'zuò zài zuǒ biān', 'est assise à gauche'),
              ('正在打电话', 'zhèng zài dǎ diàn huà', 'téléphone'), ('拿着雨伞', 'ná zhe yǔ sǎn', 'tient un parapluie')),
   'p': liste(('我姐姐', 'wǒ jiě jie', 'ma grande sœur'), ('我同事', 'wǒ tóng shì', 'mon collègue'), ('我邻居', 'wǒ lín jū', 'ma voisine'),
              ('我们老板', 'wǒ men lǎo bǎn', 'notre patron'), ('我的中文老师', 'wǒ de Zhōng wén lǎo shī', 'ma professeure de chinois'))},
  [], ['v', 'p']))

# 7. Écran 4 — lieu et moment : « où », « quand »
gabarits.append(gab(
  [S('s'), S('v'), T('的', 'de'), S('n'), S('a'), P('。')],
  'Le … où … … est ….',
  {'s': liste(('我', 'wǒ', 'je'), ('他', 'tā', 'il'), ('我姐姐', 'wǒ jiě jie', 'ma grande sœur')),
   'v': col(('住', 'zhù', 'habiter'), ('住', 'zhù', 'habiter'), ('工作', 'gōng zuò', 'travailler'), ('工作', 'gōng zuò', 'travailler'),
            ('上课', 'shàng kè', 'avoir cours'), ('上班', 'shàng bān', 'commencer le travail'), ('下班', 'xià bān', 'finir le travail'),
            ('吃午饭', 'chī wǔ fàn', 'déjeuner'), ('买菜', 'mǎi cài', 'faire les courses'), ('学中文', 'xué Zhōng wén', 'apprendre le chinois'),
            ('起床', 'qǐ chuáng', 'se lever'), ('跑步', 'pǎo bù', 'courir')),
   'n': col(('地方', 'dì fang', 'l’endroit'), ('地方', 'dì fang', 'l’endroit'), ('地方', 'dì fang', 'l’endroit'), ('公司', 'gōng sī', 'l’entreprise'),
            ('教室', 'jiào shì', 'la salle'), ('时间', 'shí jiān', 'l’heure'), ('时间', 'shí jiān', 'l’heure'), ('地方', 'dì fang', 'l’endroit'),
            ('市场', 'shì chǎng', 'le marché'), ('学校', 'xué xiào', 'l’école'), ('时间', 'shí jiān', 'l’heure'), ('公园', 'gōng yuán', 'le parc')),
   'a': col(('离地铁很近', 'lí dì tiě hěn jìn', 'tout près du métro'), ('很安静', 'hěn ān jìng', 'calme'), ('很舒服', 'hěn shū fu', 'agréable'),
            ('在市中心', 'zài shì zhōng xīn', 'en centre-ville'), ('在三楼', 'zài sān lóu', 'au deuxième étage'),
            ('是早上九点', 'shì zǎo shang jiǔ diǎn', 'neuf heures du matin'), ('很晚', 'hěn wǎn', 'tard'), ('很便宜', 'hěn pián yi', 'bon marché'),
            ('很大', 'hěn dà', 'grand'), ('很有名', 'hěn yǒu míng', 'réputée'), ('太早了', 'tài zǎo le', 'trop tôt'), ('离家不远', 'lí jiā bù yuǎn', 'près de chez soi'))},
  [['v', 'n', 'a']], ['s']))

# 8. Écran 5 — nom de sorte + nom, sans 的
gabarits.append(gab(
  [S('s'), T('是', 'shì'), S('m'), T('老师', 'lǎo shī'), P('。')],
  '… est professeur de ….',
  {'s': liste(('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我妈妈', 'wǒ mā ma', 'ma mère'), ('我朋友', 'wǒ péng you', 'mon ami')),
   'm': liste(('中文', 'Zhōng wén', 'chinois'), ('法语', 'Fǎ yǔ', 'français'), ('英语', 'Yīng yǔ', 'anglais'), ('历史', 'lì shǐ', 'histoire'),
              ('数学', 'shù xué', 'mathématiques'), ('音乐', 'yīn yuè', 'musique'), ('体育', 'tǐ yù', 'sport'))},
  [], ['s', 'm']))

# 9. Écran 5 — la cuisine : nom de sorte + 菜
gabarits.append(gab(
  [S('s'), T('最喜欢吃', 'zuì xǐ huan chī'), S('m'), T('菜', 'cài'), P('。')],
  '… préfère la cuisine ….',
  {'s': liste(('我', 'wǒ', 'je'), ('我爸爸', 'wǒ bà ba', 'mon père'), ('我朋友', 'wǒ péng you', 'mon ami'), ('他', 'tā', 'il')),
   'm': liste(('中国', 'Zhōng guó', 'chinoise'), ('法国', 'Fǎ guó', 'française'), ('日本', 'Rì běn', 'japonaise'), ('四川', 'Sì chuān', 'du Sichuan'),
              ('广东', 'Guǎng dōng', 'cantonaise'), ('家常', 'jiā cháng', 'familiale'))},
  [], ['s', 'm']))

# 10. Écran 6 — possesseur + 那 + classificateur + monosyllabe + nom
gabarits.append(gab(
  [T('我很喜欢', 'wǒ hěn xǐ huan'), S('p'), S('c'), S('a'), S('n'), P('。')],
  'J’aime beaucoup … de ….',
  {'p': liste(('你', 'nǐ', 'toi'), ('他', 'tā', 'lui'), ('我朋友', 'wǒ péng you', 'mon ami'), ('我妹妹', 'wǒ mèi mei', 'ma petite sœur'), ('我同事', 'wǒ tóng shì', 'mon collègue')),
   'c': col(('那件', 'nà jiàn', 'ce'), ('那双', 'nà shuāng', 'ces'), ('那个', 'nà ge', 'ce'), ('那辆', 'nà liàng', 'ce'),
            ('那张', 'nà zhāng', 'cette'), ('那本', 'nà běn', 'ce'), ('那把', 'nà bǎ', 'ce'), ('那只', 'nà zhī', 'ce'),
            ('那台', 'nà tái', 'cet'), ('那个', 'nà ge', 'ce'), ('那件', 'nà jiàn', 'cette'), ('那张', 'nà zhāng', 'cette')),
   'a': col(('红', 'hóng', 'rouge'), ('黑', 'hēi', 'noires'), ('新', 'xīn', 'nouveau'), ('旧', 'jiù', 'vieux'),
            ('老', 'lǎo', 'vieille'), ('中文', 'Zhōng wén', 'en chinois'), ('蓝', 'lán', 'bleu'), ('小', 'xiǎo', 'petit'),
            ('新', 'xīn', 'nouvel'), ('大', 'dà', 'grand'), ('白', 'bái', 'blanche'), ('法国', 'Fǎ guó', 'de France')),
   'n': col(('衣服', 'yī fu', 'vêtement'), ('鞋', 'xié', 'chaussures'), ('包', 'bāo', 'sac'), ('自行车', 'zì xíng chē', 'vélo'),
            ('照片', 'zhào piàn', 'photo'), ('书', 'shū', 'livre'), ('伞', 'sǎn', 'parapluie'), ('猫', 'māo', 'chat'),
            ('电脑', 'diàn nǎo', 'ordinateur'), ('杯子', 'bēi zi', 'verre'), ('衬衫', 'chèn shān', 'chemise'), ('地图', 'dì tú', 'carte'))},
  [['c', 'a', 'n']], ['p']))

# 11. Écran 6 — relative + 那 + classificateur + nom
gabarits.append(gab(
  [S('s'), T('昨天买的', 'zuó tiān mǎi de'), S('c'), S('n'), S('a'), P('。')],
  '… que … a acheté hier est ….',
  {'s': liste(('我', 'wǒ', 'je'), ('他', 'tā', 'il'), ('我妈妈', 'wǒ mā ma', 'ma mère'), ('我朋友', 'wǒ péng you', 'mon ami')),
   'c': col(('那本', 'nà běn', 'le'), ('那件', 'nà jiàn', 'le'), ('那双', 'nà shuāng', 'les'), ('那些', 'nà xiē', 'les'),
            ('那个', 'nà ge', 'la'), ('那把', 'nà bǎ', 'le'), ('那张', 'nà zhāng', 'la'), ('那瓶', 'nà píng', 'la bouteille de'),
            ('那条', 'nà tiáo', 'le'), ('那些', 'nà xiē', 'les'), ('那盒', 'nà hé', 'la boîte de'), ('那个', 'nà ge', 'le')),
   'n': col(('书', 'shū', 'livre'), ('衣服', 'yī fu', 'vêtement'), ('鞋', 'xié', 'chaussures'), ('水果', 'shuǐ guǒ', 'fruits'),
            ('西瓜', 'xī guā', 'pastèque'), ('伞', 'sǎn', 'parapluie'), ('桌子', 'zhuō zi', 'table'), ('酒', 'jiǔ', 'vin'),
            ('裤子', 'kù zi', 'pantalon'), ('菜', 'cài', 'légumes'), ('茶', 'chá', 'thé'), ('包', 'bāo', 'sac')),
   'a': col(('很有意思', 'hěn yǒu yì si', 'intéressant'), ('有点儿大', 'yǒu diǎnr dà', 'un peu grand'), ('太小了', 'tài xiǎo le', 'trop petites'),
            ('很甜', 'hěn tián', 'sucrés'), ('不太甜', 'bú tài tián', 'pas très sucrée'), ('已经坏了', 'yǐ jīng huài le', 'déjà cassé'),
            ('很便宜', 'hěn pián yi', 'bon marché'), ('特别好喝', 'tè bié hǎo hē', 'excellent'), ('有点儿长', 'yǒu diǎnr cháng', 'un peu long'),
            ('很新鲜', 'hěn xīn xiān', 'frais'), ('很香', 'hěn xiāng', 'parfumé'), ('质量很好', 'zhì liàng hěn hǎo', 'de bonne qualité'))},
  [['c', 'n', 'a']], ['s']))

# 12. Écran 7 — apposition : 我朋友小王
gabarits.append(gab(
  [T('这是', 'zhè shì'), T('我', 'wǒ'), S('r'), S('n'), P('。')],
  'Je vous présente mon …, ….',
  {'r': liste(('朋友', 'péng you', 'ami'), ('同事', 'tóng shì', 'collègue'), ('同学', 'tóng xué', 'camarade de classe'), ('邻居', 'lín jū', 'voisin')),
   'n': liste(('小王', 'Xiǎo Wáng', 'Xiao Wang'), ('小李', 'Xiǎo Lǐ', 'Xiao Li'), ('李明', 'Lǐ Míng', 'Li Ming'), ('王芳', 'Wáng Fāng', 'Wang Fang'))},
  [], ['r', 'n']))

# 13. Écrans 7 et 8 — pronom + nombre, à l’oral
gabarits.append(gab(
  [S('q'), S('v'), T('吧', 'ba'), P('。')],
  '… : … !',
  {'q': liste(('我们俩', 'wǒ men liǎ', 'nous deux'), ('咱们俩', 'zán men liǎ', 'nous deux'), ('我们三个', 'wǒ men sān ge', 'nous trois'),
              ('咱们几个', 'zán men jǐ ge', 'nous quelques-uns'), ('我们大家', 'wǒ men dà jiā', 'nous tous')),
   'v': liste(('一起去', 'yì qǐ qù', 'allons-y ensemble'), ('一起吃饭', 'yì qǐ chī fàn', 'mangeons ensemble'), ('打车去', 'dǎ chē qù', 'prenons un taxi'),
              ('先走', 'xiān zǒu', 'partons devant'), ('明天再来', 'míng tiān zài lái', 'revenons demain'))},
  [], ['q', 'v'], reg='oral'))

# 14. Écran 8 — choisir sans nommer (oral)
gabarits.append(gab(
  [S('r'), T('要', 'yào'), S('a'), T('的', 'de'), T('还是', 'hái shi'), S('b'), T('的', 'de'), P('？')],
  '… : le … ou le … ?',
  {'r': liste(('你', 'nǐ', 'tu'), ('您', 'nín', 'vous')),
   'a': col(('大', 'dà', 'grand'), ('红', 'hóng', 'rouge'), ('热', 'rè', 'chaud'), ('辣', 'là', 'pimenté'), ('甜', 'tián', 'sucré'),
            ('长', 'cháng', 'long'), ('新', 'xīn', 'neuf'), ('黑', 'hēi', 'noir'), ('大杯', 'dà bēi', 'grand verre'),
            ('冰', 'bīng', 'glacé'), ('便宜', 'pián yi', 'bon marché'), ('硬', 'yìng', 'dur')),
   'b': col(('小', 'xiǎo', 'petit'), ('白', 'bái', 'blanc'), ('凉', 'liáng', 'froid'), ('不辣', 'bú là', 'pas pimenté'), ('咸', 'xián', 'salé'),
            ('短', 'duǎn', 'court'), ('旧', 'jiù', 'ancien'), ('白', 'bái', 'blanc'), ('小杯', 'xiǎo bēi', 'petit verre'),
            ('不冰', 'bù bīng', 'pas glacé'), ('贵', 'guì', 'cher'), ('软', 'ruǎn', 'mou'))},
  [['a', 'b']], ['r'], reg='oral'))

# ---------------------------------------------------------------------
# Transformations (9), 改错 (8), réemplois (4)
# ---------------------------------------------------------------------
def TR(consigne, de, vers, fr, reg=None):
    d = {'consigne': consigne, 'de': EX(*de), 'vers': {'seg': seg(*vers), 'fr': fr}}
    return d

transfo = [
  TR('Le nom est déjà connu : supprimez-le', ('我要红的衣服。', 'wǒ yào hóng de yī fu', 'Je veux le vêtement rouge.'),
     [('我', 'wǒ'), ('要', 'yào'), ('红', 'hóng'), ('的', 'de'), '。'], 'Je veux le rouge.'),
  TR('Ne répétez pas le nom', ('这本书是我的书。', 'zhè běn shū shì wǒ de shū', 'Phrase à alléger.'),
     [('这本书', 'zhè běn shū'), ('是', 'shì'), ('我', 'wǒ'), ('的', 'de'), '。'], 'Ce livre est à moi.'),
  TR('Faites-en une description du livre : « c’est le livre que j’ai acheté hier »', ('我昨天买了一本书。', 'wǒ zuó tiān mǎi le yì běn shū', 'J’ai acheté un livre hier.'),
     [('这是', 'zhè shì'), ('我', 'wǒ'), ('昨天', 'zuó tiān'), ('买', 'mǎi'), ('的', 'de'), ('书', 'shū'), '。'], 'C’est le livre que j’ai acheté hier.'),
  TR('Désignez le professeur par ce qu’il fait, en une seule phrase', ('这个老师教我中文。他是北京人。', 'zhè ge lǎo shī jiāo wǒ Zhōng wén. tā shì Běi jīng rén', 'Ce professeur m’enseigne le chinois. Il est de Pékin.'),
     [('教我中文', 'jiāo wǒ Zhōng wén'), ('的', 'de'), ('老师', 'lǎo shī'), ('是北京人', 'shì Běi jīng rén'), '。'], 'Le professeur qui m’enseigne le chinois est de Pékin.'),
  TR('Corrigez l’ordre : la description passe devant le nom', ('这是书我昨天买的。', 'zhè shì shū wǒ zuó tiān mǎi de', 'Phrase à corriger.'),
     [('这是', 'zhè shì'), ('我', 'wǒ'), ('昨天', 'zuó tiān'), ('买', 'mǎi'), ('的', 'de'), ('书', 'shū'), '。'], 'C’est le livre que j’ai acheté hier.'),
  TR('Nommez-le par son métier, comme à l’oral', ('他卖水果。', 'tā mài shuǐ guǒ', 'Il vend des fruits.'),
     [('他', 'tā'), ('是', 'shì'), ('卖水果', 'mài shuǐ guǒ'), ('的', 'de'), '。'], 'Il est marchand de fruits.'),
  TR('Un seul 的 suffit entre proches', ('这是我的朋友的书。', 'zhè shì wǒ de péng you de shū', 'Phrase à alléger.'),
     [('这是', 'zhè shì'), ('我朋友', 'wǒ péng you'), ('的', 'de'), ('书', 'shū'), '。'], 'C’est le livre de mon ami.'),
  TR('Rangez les déterminants dans l’ordre', ('她买了一件红很漂亮的衣服。', 'tā mǎi le yí jiàn hóng hěn piào liang de yī fu', 'Phrase à corriger.'),
     [('她', 'tā'), ('买了', 'mǎi le'), ('一件', 'yí jiàn'), ('很漂亮', 'hěn piào liang'), ('的', 'de'), ('红衣服', 'hóng yī fu'), '。'], 'Elle a acheté un très joli vêtement rouge.'),
  TR('Présentez votre collègue en une phrase, nom propre accolé', ('这是我同事。他叫李明。', 'zhè shì wǒ tóng shì. tā jiào Lǐ Míng', 'Voici mon collègue. Il s’appelle Li Ming.'),
     [('这是', 'zhè shì'), ('我', 'wǒ'), ('同事', 'tóng shì'), ('李明', 'Lǐ Míng'), '。'], 'Je vous présente mon collègue Li Ming.'),
]

def FX(toks, bad, bon, why):
    s = seg(*toks)
    assert s[bad]['p']
    return {'seg': s, 'bad': bad, 'bon': bon, 'why': why}

fixes = [
  FX([('这是', 'zhè shì'), ('书', 'shū'), ('我昨天买', 'wǒ zuó tiān mǎi'), ('的', 'de'), '。'], 1, '这是我昨天买的书。',
     'Le nom vient après la description et après 的.'),
  FX([('我', 'wǒ'), ('要', 'yào'), ('红', 'hóng'), '。'], 2, '我要红的。', 'Sans nom derrière lui, l’adjectif reprend 的 : 红的.'),
  FX([('妈妈做', 'mā ma zuò'), ('地', 'de'), ('菜', 'cài'), ('很好吃', 'hěn hǎo chī'), '。'], 1, '妈妈做的菜很好吃。',
     '地 relie un adverbe à un verbe ; devant un nom, c’est 的.'),
  FX([('这是', 'zhè shì'), ('我的', 'wǒ de'), ('朋友的', 'péng you de'), ('书', 'shū'), '。'], 1, '这是我朋友的书。',
     'Entre proches, le premier 的 tombe.'),
  FX([('她买了', 'tā mǎi le'), ('一件', 'yí jiàn'), ('红', 'hóng'), ('很漂亮的', 'hěn piào liang de'), ('衣服', 'yī fu'), '。'], 2,
     '她买了一件很漂亮的红衣服。', 'Le monosyllabe 红 reste collé au nom ; le groupe en 的 passe devant.'),
  FX([('这是', 'zhè shì'), ('我朋友', 'wǒ péng you'), ('的', 'de'), ('小王', 'Xiǎo Wáng'), '。'], 2, '这是我朋友小王。',
     'Deux noms pour une seule personne : pas de 的.'),
  FX([('他是', 'tā shì'), ('历史的', 'lì shǐ de'), ('老师', 'lǎo shī'), '。'], 1, '他是历史老师。', 'Le premier nom dit la sorte : pas de 的.'),
  FX([('这是', 'zhè shì'), ('我昨天', 'wǒ zuó tiān'), ('买了', 'mǎi le'), ('的', 'de'), ('书', 'shū'), '。'], 2, '这是我昨天买的书。',
     'Devant 的, on ne garde pas 了 : 昨天 suffit à dire le passé.'),
]

reemploi = [
  {'q': 'En boutique, l’article qu’on vous montre est trop grand. Demandez-en un plus petit, puis dites lequel vous prenez, sans répéter le nom.',
   'verif': [{'type': 'contient', 'v': '的', 'msg': 'L’adjectif sans nom garde 的.'},
             {'type': 'contient', 'v': '有没有', 'msg': 'On demande avec 有没有.'}],
   'modeles': [EX('这件太大了，有没有小一点儿的？我要这个小的。', 'zhè jiàn tài dà le, yǒu méi yǒu xiǎo yì diǎnr de? wǒ yào zhè ge xiǎo de', 'Celui-ci est trop grand, vous en avez un plus petit ? Je prends ce petit-là.')],
   'criteres': ['Le nom n’est pas répété', 'Chaque adjectif sans nom garde son 的', '一点儿 se lit yì diǎnr']},
  {'q': 'Parlez d’un plat que prépare quelqu’un de votre entourage : qui le fait, et ce que vous en pensez, en un seul groupe nominal.',
   'verif': [{'type': 'contient', 'v': '做的', 'msg': 'La description se ferme par 做的, devant le nom du plat.'},
             {'type': 'absent', 'v': '了的', 'msg': 'Pas de 了 devant 的.'}],
   'modeles': [EX('我妈妈做的饺子特别好吃。', 'wǒ mā ma zuò de jiǎo zi tè bié hǎo chī', 'Les raviolis que fait ma mère sont particulièrement bons.'),
               EX('我爸爸做的家常菜很好吃。', 'wǒ bà ba zuò de jiā cháng cài hěn hǎo chī', 'La cuisine familiale de mon père est délicieuse.')],
   'criteres': ['La description précède le nom', '的 ferme la description', 'Le nom vient en dernier']},
  {'q': 'Dans une soirée, désignez quelqu’un par ce qu’il porte ou ce qu’il fait, et dites qui c’est.',
   'verif': [{'type': 'contient', 'v': '的', 'msg': 'La description se ferme par 的.'},
             {'type': 'un_parmi', 'v': ['那个人', '那位'], 'msg': 'On désigne la personne par 那个人 ou 那位.'}],
   'modeles': [EX('穿红衣服的那个人是我姐姐。', 'chuān hóng yī fu de nà ge rén shì wǒ jiě jie', 'La personne habillée en rouge, c’est ma grande sœur.'),
               EX('正在打电话的那位是我们老板。', 'zhèng zài dǎ diàn huà de nà wèi shì wǒ men lǎo bǎn', 'Celui qui téléphone, c’est notre patron.')],
   'criteres': ['La description vient avant 那个人', 'Aucun pronom relatif', '的 juste avant 那个人']},
  {'q': 'Présentez deux personnes de votre entourage en accolant leur nom, puis proposez de partir tous ensemble, comme à l’oral.',
   'verif': [{'type': 'contient', 'v': '这是我', 'msg': 'On présente avec 这是我 + nom commun + nom propre.'},
             {'type': 'un_parmi', 'v': ['我们三个', '咱们三个', '我们大家', '咱们几个', '我们几个'], 'msg': 'Le pronom pluriel prend un nombre ou 大家.'},
             {'type': 'contient', 'v': '吧', 'msg': 'La proposition se fait avec 吧.'}],
   'modeles': [EX('这是我同事李明，这是我朋友小王。咱们三个一起去吧！', 'zhè shì wǒ tóng shì Lǐ Míng, zhè shì wǒ péng you Xiǎo Wáng. zán men sān ge yì qǐ qù ba', 'Voici mon collègue Li Ming, et mon ami Xiao Wang. Allons-y tous les trois !', reg='oral')],
   'criteres': ['Pas de 的 entre 同事 et le nom propre', 'Le terme général vient d’abord', '咱们 inclut celui qui écoute'],
   'reg': 'oral'},
]

fiche = {
  'id': 'g331', 'hsk': 3, 'fam': 'nom', 'th': ['achats', 'nourriture'],
  'title': 'Autour du nom : 红的, 我买的书, 我朋友小王',
  'resume': 'Tout ce qui qualifie un nom se place devant lui, et 的 ferme le groupe : un adjectif, un possesseur, une proposition entière. Quand le nom est déjà connu, il tombe, et 的 reste seul.',
  'hsk3': [],
  'equiv': [['我们', '咱们']],
  'steps': steps, 'tableau': tableau, 'piege': piege,
  'voir': ['g202', 'g205', 'g301', 'g326'],
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
for r in reemploi:
    tout = ''.join(m['hz'] for m in r['modeles'])
    for v in r['verif']:
        if v['type'] == 'contient': assert v['v'] in tout, v
        if v['type'] == 'absent': assert all(v['v'] not in m['hz'] for m in r['modeles']), v
        if v['type'] == 'un_parmi': assert any(x in tout for x in v['v']), v
err = controles(fiche)
assert not err, '\n'.join(err)

if __name__ == '__main__':
    tot = sum(combos(g) for g in gabarits)
    print('g331 — %d écrans, %d gabarits, %d phrases engendrées' % (len(steps), len(gabarits), tot))
    for i, g in enumerate(gabarits, 1):
        print('\n— gabarit %d (%d phrases)%s : %s' % (i, combos(g), ' [oral]' if g.get('reg') else '', g['fr']))
        for s in tirages(g, 4, graine=i):
            print('   ', hz(s), ' | ', py(s))
    import gram_lib
    sd = sorted({m for h, p, _ in gram_lib._LECTURES for m in sandhi(h, p)})
    print('\nSandhi à relire :', len(sd)); [print('   ', m) for m in sd]
    ec = rapport_lectures()
    print('\nÉcarts de lecture (pypinyin) à relire :', len(ec)); [print('   ', m) for m in ec]
    if '--poser' in sys.argv:
        d = poser(fiche, os.path.join(os.path.dirname(__file__), '..', '..', 'data-gram.js'))
        print('\nFiche posée dans data-gram.js (+%d caractères).' % d)
