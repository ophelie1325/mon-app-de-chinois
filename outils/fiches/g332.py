# -*- coding: utf-8 -*-
"""g332 — La phrase à deux étages (rattrapage HSK 3).
Double sujet (他个子很高), verbe ou proposition sujet (学汉语很有意思,
他不来没关系), double objet et V给 (告诉你一件事, 送给他), V着V (笑着说).
Usage : python3 outils/fiches/g332.py [--poser]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from gram_lib import *

# ---------------------------------------------------------------------
# Écrans
# ---------------------------------------------------------------------
steps = [
  ecran('Deux sujets : 他个子很高', [
    'Le chinois pose souvent deux sujets à la suite : d’abord la personne dont on parle, puis ce que l’on décrit chez elle. 他<b>个子</b>很高 — <i>il est grand</i>, mot à mot « lui, la taille est haute ».',
    'Le français garde un seul sujet et range le reste dans un attribut ou un complément : « elle a les cheveux longs ». Le chinois garde les deux sujets : 她<b>头发</b>很长.',
    'Entre les deux, pas besoin de 的. 他的个子很高 est correct, mais 他个子很高 est la forme courante.',
    'Le second sujet porte l’adjectif, avec son 很, comme dans toute description (fiche 202) : 她<b>眼睛</b>很大.'],
    [EX('他个子很高。', 'tā gè zi hěn gāo', 'Il est grand.'),
     EX('她头发很长。', 'tā tóu fa hěn cháng', 'Elle a les cheveux longs.'),
     EX('我妹妹脾气很好。', 'wǒ mèi mei pí qi hěn hǎo', 'Ma petite sœur a bon caractère.')],
    {'q': 'Pour dire « il est grand » (de taille), on dit plutôt :', 'a': ['他个子很高。', '他是个子高。'], 'ok': 0,
     'why': 'Deux sujets côte à côte, puis 很 + adjectif : pas de 是.'}),

  ecran('Le corps, le goût, la vie : les doubles sujets courants', [
    'Pour une douleur, le français dit « j’ai mal à la tête ». Le chinois dit « moi, la tête fait mal » : 我<b>头</b>疼.',
    'On n’« a » donc pas mal : pas de 有. 我<b>肚子</b>疼 — <i>j’ai mal au ventre</i>.',
    'Pour une chose, un lieu, un repas, le premier sujet est l’endroit ou l’objet : 这家饭馆<b>菜</b>很好吃 — <i>dans ce restaurant, les plats sont bons</i>.',
    'Pour la vie de quelqu’un, même moule : 我最近<b>工作</b>很忙. Quand on sait de qui l’on parle, le premier sujet tombe : 最近工作很忙.'],
    [EX('我头疼。', 'wǒ tóu téng', 'J’ai mal à la tête.'),
     EX('这个菜味道不错。', 'zhè ge cài wèi dao bú cuò', 'Ce plat a bon goût.'),
     EX('我最近工作很忙。', 'wǒ zuì jìn gōng zuò hěn máng', 'J’ai beaucoup de travail ces temps-ci.')],
    {'q': '« J’ai mal au ventre » se dit :', 'a': ['我肚子疼。', '我有肚子疼。'], 'ok': 0,
     'why': 'On n’« a » pas mal : le ventre fait mal. Pas de 有.'}),

  ecran('Une action en sujet : 学汉语很有意思', [
    'Une action peut être le sujet de la phrase, telle quelle : 学汉语很有意思 — <i>apprendre le chinois, c’est intéressant</i>.',
    'Le verbe ne change pas de forme : pas d’infinitif, pas de 的, rien pour l’annoncer. 说汉语<b>不难</b> — <i>parler chinois n’est pas difficile</i>.',
    'Le français aime dire « c’est difficile d’apprendre les caractères » : il annonce avec « c’est », puis donne l’action. Le chinois commence par l’action : 学汉字很难.',
    'Derrière l’action vient un jugement : un adjectif, ou une expression comme 对身体很好, 很有用. 每天走路<b>对身体很好</b>.'],
    [EX('学汉语很有意思。', 'xué Hàn yǔ hěn yǒu yì si', 'Apprendre le chinois, c’est intéressant.'),
     EX('学汉字很难。', 'xué Hàn zì hěn nán', 'C’est difficile d’apprendre les caractères.'),
     EX('每天走路对身体很好。', 'měi tiān zǒu lù duì shēn tǐ hěn hǎo', 'Marcher tous les jours, c’est très bon pour la santé.')],
    {'q': '« C’est agréable de voyager » se dit :', 'a': ['这很舒服旅游。', '旅游很舒服。'], 'ok': 1,
     'why': 'L’action se met en tête ; aucun 这 ne l’annonce.'}),

  ecran('Une phrase en sujet : 他不来没关系', [
    'Une proposition entière, avec son propre sujet, peut aussi servir de sujet : 他不来<b>没关系</b> — <i>s’il ne vient pas, ce n’est pas grave</i>.',
    'Le français ajoute « si » ou « que », parfois un subjonctif. Le chinois juxtapose, sans rien entre les deux : 你一个人去<b>不安全</b> — <i>que tu y ailles seule, ce n’est pas prudent</i>.',
    'Une question peut être sujet, sous la forme oui-non redoublée : 他来不来<b>还不一定</b> — <i>on ne sait pas encore s’il viendra</i>. Pas de 吗 dans ce cas.',
    'Le jugement qui suit est court, souvent 没关系, 也行, 也可以 : 你明天来<b>也可以</b>.'],
    [EX('他不来没关系。', 'tā bù lái méi guān xi', 'S’il ne vient pas, ce n’est pas grave.'),
     EX('你一个人去不安全。', 'nǐ yí ge rén qù bù ān quán', 'Que tu y ailles seule, ce n’est pas prudent.'),
     EX('他来不来还不一定。', 'tā lái bu lái hái bù yí dìng', 'On ne sait pas encore s’il viendra.')],
    {'q': '« S’il viendra, on ne le sait pas encore » se dit :', 'a': ['他来吗还不知道。', '他来不来还不知道。'], 'ok': 1,
     'why': 'La question en sujet prend la forme 来不来, jamais 吗.'}),

  ecran('Deux objets : 给他一本书, 告诉你一件事', [
    'Quelques verbes prennent deux objets à la suite : la personne d’abord, la chose ensuite. 他<b>给</b>我一本书 — <i>il me donne un livre</i>.',
    'Le français dit « donner un livre à quelqu’un » : la chose, puis la personne avec « à ». Le chinois n’a pas ce « à » et inverse l’ordre : jamais 他给一本书我.',
    'Les verbes les plus courants : 给, 送, 教, 问, 告诉, 还, 借. 老师<b>教</b>我们中文 — <i>le professeur nous enseigne le chinois</i>.',
    'Avec 告诉, la chose est souvent toute une phrase : 他<b>告诉</b>我他明天不来.'],
    [EX('他给我一本书。', 'tā gěi wǒ yì běn shū', 'Il me donne un livre.'),
     EX('我想问你一个问题。', 'wǒ xiǎng wèn nǐ yí ge wèn tí', 'Je voudrais vous poser une question.'),
     EX('他告诉我他明天不来。', 'tā gào su wǒ tā míng tiān bù lái', 'Il m’a dit qu’il ne viendrait pas demain.')],
    {'q': '« Elle m’a offert un cadeau » se dit :', 'a': ['她送了一个礼物我。', '她送了我一个礼物。'], 'ok': 1,
     'why': 'La personne d’abord, la chose ensuite, sans « à ».'}),

  ecran('送给他, 还给你 : 给 derrière le verbe', [
    'Beaucoup de verbes ne prennent pas deux objets seuls. Ils s’appuient sur <b>给</b>, collé derrière eux, qui dit où va la chose : 寄<b>给</b>妈妈 — <i>envoyer à maman</i>.',
    '送 et 还 acceptent les deux formes : 送他一本书, ou 送<b>给</b>他一本书. 寄, 交, 卖, 带 demandent 给 : 我明天寄<b>给</b>你一张照片.',
    'Quand la chose est déjà connue, elle passe devant avec 把 (fiche 307) : 我把书还<b>给</b>他了.',
    '给 placé devant le verbe dit autre chose : pour qui ou vers qui l’on agit, sans rien remettre de la main à la main. 我<b>给</b>你打电话 — <i>je t’appelle</i>.'],
    [EX('这是我送给你的。', 'zhè shì wǒ sòng gěi nǐ de', 'C’est un cadeau pour toi.'),
     EX('我把书还给他了。', 'wǒ bǎ shū huán gěi tā le', 'Je lui ai rendu le livre.'),
     EX('晚上我给你打电话。', 'wǎn shang wǒ gěi nǐ dǎ diàn huà', 'Je t’appelle ce soir.')],
    {'q': '« Je lui ai rendu le livre » se dit :', 'a': ['我给他还了书。', '我把书还给他了。'], 'ok': 1,
     'why': '给 devant le verbe voudrait dire « pour lui, à sa place ». Le livre qu’on rend passe par 还给.'}),

  ecran('Deux verbes, un état : 笑着说, 站着吃', [
    'Deux verbes à la suite, le premier suivi de <b>着</b> : le premier dit dans quel état ou de quelle manière, le second dit l’action. 她<b>笑着</b>说没关系 — <i>elle dit en souriant que ce n’est rien</i>.',
    'C’est le 着 de l’état qui dure (fiche 305) : on est debout, couché, on tient quelque chose, pendant qu’on fait autre chose. 我们<b>站着</b>吃吧 — <i>mangeons debout</i>.',
    'Le français emploie un gérondif ou un adverbe : « en souriant », « debout », « à pied ». Le chinois aligne les deux verbes, l’état d’abord : 走<b>着</b>去 — <i>y aller à pied</i>.',
    'La négation et 别 se placent devant le premier verbe : 别<b>躺着</b>看书 — <i>ne lisez pas couché</i>.'],
    [EX('她笑着说没关系。', 'tā xiào zhe shuō méi guān xi', 'Elle dit en souriant que ce n’est rien.'),
     EX('我们站着吃吧。', 'wǒ men zhàn zhe chī ba', 'Mangeons debout.'),
     EX('别躺着看书。', 'bié tǎng zhe kàn shū', 'Ne lisez pas couché.')],
    {'q': '« Il est venu à pied » se dit :', 'a': ['他是走着来的。', '他是来着走的。'], 'ok': 0,
     'why': 'L’état ou la manière d’abord, avec 着 ; l’action ensuite.'}),

  ecran('À l’oral — 我头疼, 借我用一下, 送你的', [
    'Le double sujet est partout dans la conversation, souvent sans le premier terme : 肚子饿了 — <i>j’ai faim</i>. Pour un compliment : 你中文真不错 !',
    'Pour offrir, on tend l’objet en disant 送你的 ! ou 这是送给你的. 送你的 vaut « c’est pour toi » ; 你送的 voudrait dire « c’est toi qui l’as offert ».',
    'Pour emprunter un instant, 借 prend la personne, puis 用一下 suit : 你的笔，借我用一下 — <i>tu me prêtes ton stylo ?</i>',
    'Pour proposer d’y aller à pied : 走着去吧，不远. Et pour gronder gentiment, 别 + V着V : 别看着手机吃饭 !'],
    [EX('我头疼，今天不去了。', 'wǒ tóu téng, jīn tiān bú qù le', 'J’ai mal à la tête, je n’y vais pas aujourd’hui.', reg='oral'),
     EX('一点儿小礼物，送你的！', 'yì diǎnr xiǎo lǐ wù, sòng nǐ de', 'Un petit cadeau, c’est pour toi !', reg='oral'),
     EX('你的笔，借我用一下，行吗？', 'nǐ de bǐ, jiè wǒ yòng yí xià, xíng ma', 'Ton stylo, tu me le prêtes un instant ?', reg='oral'),
     EX('走着去吧，不远。', 'zǒu zhe qù ba, bù yuǎn', 'Allons-y à pied, ce n’est pas loin.', reg='oral')],
    {'q': 'Vous tendez un cadeau à une amie. Vous dites :', 'a': ['送你的！', '你送的！'], 'ok': 0,
     'why': '送你的 : « offert à toi ». 你送的 voudrait dire « c’est toi qui l’as offert ».'},
    reg='oral'),
]

# ---------------------------------------------------------------------
# Tableau, piège
# ---------------------------------------------------------------------
tableau = {'cols': ['Construction', 'Exemple', 'Ce qu’elle fait'], 'rows': [
  ['Personne + partie + adjectif', '他个子很高', 'Deux sujets : de qui, puis quoi'],
  ['Sans 的 entre les deux', '她头发很长', '他的个子很高 se dit, en moins courant'],
  ['La douleur', '我头疼, 我肚子疼', 'Pas de 有 : la tête fait mal'],
  ['Lieu ou chose + aspect', '这家饭馆菜很好吃', 'L’endroit, puis ce qu’on en dit'],
  ['Premier sujet sous-entendu', '最近工作很忙', 'On sait de qui l’on parle'],
  ['Action en sujet', '学汉语很有意思', 'Le verbe tel quel, en tête'],
  ['Action + jugement', '每天走路对身体很好', '对身体很好, 很有用, 很重要'],
  ['Pas de « c’est »', '学汉字很难', 'Jamais 这很难学汉字'],
  ['Proposition en sujet', '他不来没关系', 'Sans « si », sans « que »'],
  ['Jugement court', '你明天来也可以', '没关系, 也行, 也可以'],
  ['Question en sujet', '他来不来还不一定', 'Forme 来不来, jamais 吗'],
  ['Deux objets', '他给我一本书', 'La personne, puis la chose'],
  ['Verbes à deux objets', '给, 送, 教, 问, 告诉, 还, 借', 'Ils se passent de 给'],
  ['告诉 + phrase', '他告诉我他明天不来', 'La chose est une phrase'],
  ['Verbe + 给 + personne', '寄给妈妈, 交给老师', 'Où va la chose'],
  ['送, 还 : deux formes', '送他 = 送给他', 'Les deux se disent'],
  ['把 + chose + V给', '我把书还给他了', 'La chose déjà connue passe devant'],
  ['给 + personne + verbe', '我给你打电话', 'Pour qui, vers qui l’on agit'],
  ['V着 + V', '她笑着说没关系', 'L’état ou la manière, puis l’action'],
  ['État du corps', '站着吃, 躺着看书', '« debout », « couché »'],
  ['Trajet', '走着去', '« à pied »'],
  ['别 + V着V', '别看着手机吃饭', '别 devant le premier verbe'],
  ['À l’oral', '送你的！', '« C’est pour toi ! »'],
  ['À l’oral', '借我用一下', '« Tu me le prêtes un instant ? »'],
]}

piege = {
  'bad': {'hz': '这很有意思学汉语。', 'py': 'zhè hěn yǒu yì si xué Hàn yǔ'},
  'good': {'hz': '学汉语很有意思。', 'py': 'xué Hàn yǔ hěn yǒu yì si'},
  'why': 'Le français annonce d’abord le jugement avec « c’est », puis donne l’action : « c’est intéressant d’apprendre le chinois ». Le chinois n’a pas ce « c’est » d’attente. L’action se met en tête, telle quelle, et le jugement suit : 学汉语很有意思.'}
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
  B([('他', 'tā'), ('个子', 'gè zi'), ('很高', 'hěn gāo'), '。'], 1, 'Il est grand.'),
  B([('她', 'tā'), ('头发', 'tóu fa'), ('很长', 'hěn cháng'), '。'], 1, 'Elle a les cheveux longs.'),
  B([('我', 'wǒ'), ('头', 'tóu'), ('疼', 'téng'), '。'], 1, 'J’ai mal à la tête.'),
  B([('这家饭馆', 'zhè jiā fàn guǎn'), ('菜', 'cài'), ('很好吃', 'hěn hǎo chī'), '。'], 1, 'Dans ce restaurant, les plats sont bons.'),
  B([('学', 'xué'), ('汉语', 'Hàn yǔ'), ('很有意思', 'hěn yǒu yì si'), '。'], 0, 'Apprendre le chinois, c’est intéressant.'),
  B([('每天', 'měi tiān'), ('走路', 'zǒu lù'), ('对', 'duì'), ('身体很好', 'shēn tǐ hěn hǎo'), '。'], 2, 'Marcher tous les jours, c’est très bon pour la santé.'),
  B([('他', 'tā'), ('来', 'lái'), ('不', 'bu'), ('来', 'lái'), ('还不一定', 'hái bù yí dìng'), '。'], 2, 'On ne sait pas encore s’il viendra.'),
  B([('他', 'tā'), ('给', 'gěi'), ('我', 'wǒ'), ('一本书', 'yì běn shū'), '。'], 1, 'Il me donne un livre.'),
  B([('我想', 'wǒ xiǎng'), ('问', 'wèn'), ('你', 'nǐ'), ('一个问题', 'yí ge wèn tí'), '。'], 1, 'Je voudrais vous poser une question.'),
  B([('老师', 'lǎo shī'), ('教', 'jiāo'), ('我们', 'wǒ men'), ('中文', 'Zhōng wén'), '。'], 1, 'Le professeur nous enseigne le chinois.'),
  B([('我', 'wǒ'), ('把', 'bǎ'), ('作业', 'zuò yè'), ('交', 'jiāo'), ('给', 'gěi'), ('老师', 'lǎo shī'), ('了', 'le'), '。'], 4, 'J’ai remis mes devoirs au professeur.'),
  B([('我', 'wǒ'), ('明天', 'míng tiān'), ('把', 'bǎ'), ('书', 'shū'), ('还', 'huán'), ('给', 'gěi'), ('你', 'nǐ'), '。'], 5, 'Je te rends le livre demain.'),
  B([('晚上', 'wǎn shang'), ('我', 'wǒ'), ('给', 'gěi'), ('你', 'nǐ'), ('打电话', 'dǎ diàn huà'), '。'], 2, 'Je t’appelle ce soir.'),
  B([('我们', 'wǒ men'), ('站', 'zhàn'), ('着', 'zhe'), ('吃', 'chī'), ('吧', 'ba'), '。'], 2, 'Mangeons debout.'),
  B([('他', 'tā'), ('喜欢', 'xǐ huan'), ('躺', 'tǎng'), ('着', 'zhe'), ('看书', 'kàn shū'), '。'], 3, 'Il aime lire couché.'),
  B([('她', 'tā'), ('听', 'tīng'), ('着', 'zhe'), ('音乐', 'yīn yuè'), ('跑步', 'pǎo bù'), '。'], 2, 'Elle court en écoutant de la musique.'),
  B([('借', 'jiè'), ('我', 'wǒ'), ('用', 'yòng'), ('一下', 'yí xià'), '。'], 0, 'Tu me le prêtes un instant ?', reg='oral'),
  B([('我', 'wǒ'), ('肚子', 'dù zi'), ('饿了', 'è le'), '。'], 1, 'J’ai faim.', reg='oral'),
]
leurres = ['地', '得', '了', '过', '在', '把', '被', '往', '比', '向', '从', '离']

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
gabarits = []

# 1. Écran 1 — personne + partie + degré + adjectif
gabarits.append(gab(
  [S('p'), S('n'), S('d'), S('a'), P('。')],
  '… a … (description).',
  {'p': liste(('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我妹妹', 'wǒ mèi mei', 'ma petite sœur'), ('我同事', 'wǒ tóng shì', 'mon collègue'), ('我朋友', 'wǒ péng you', 'mon ami')),
   'n': col(('个子', 'gè zi', 'la taille'), ('头发', 'tóu fa', 'les cheveux'), ('眼睛', 'yǎn jing', 'les yeux'), ('脾气', 'pí qi', 'le caractère'),
            ('身体', 'shēn tǐ', 'la santé'), ('声音', 'shēng yīn', 'la voix'), ('工作', 'gōng zuò', 'le travail'), ('胃口', 'wèi kǒu', 'l’appétit'),
            ('汉语', 'Hàn yǔ', 'le chinois'), ('腿', 'tuǐ', 'les jambes'), ('胆子', 'dǎn zi', 'le courage'), ('记性', 'jì xing', 'la mémoire')),
   'd': liste(('很', 'hěn', 'très'), ('特别', 'tè bié', 'particulièrement')),
   'a': col(('高', 'gāo', 'grand'), ('长', 'cháng', 'longs'), ('大', 'dà', 'grands'), ('好', 'hǎo', 'bon'),
            ('好', 'hǎo', 'bonne'), ('好听', 'hǎo tīng', 'agréable'), ('忙', 'máng', 'prenant'), ('好', 'hǎo', 'bon'),
            ('好', 'hǎo', 'bon'), ('长', 'cháng', 'longues'), ('小', 'xiǎo', 'petit (peureux)'), ('好', 'hǎo', 'bonne'))},
  [['n', 'a']], ['p', 'd']))

# 2. Écran 2 — la douleur : moi, la tête fait mal
gabarits.append(gab(
  [S('p'), S('n'), T('疼', 'téng'), P('，'), S('r'), P('。')],
  'J’ai mal à …, ….',
  {'p': liste(('我', 'wǒ', 'je'), ('我今天', 'wǒ jīn tiān', 'aujourd’hui, je')),
   'n': col(('头', 'tóu', 'la tête'), ('肚子', 'dù zi', 'le ventre'), ('牙', 'yá', 'les dents'), ('腿', 'tuǐ', 'la jambe'),
            ('眼睛', 'yǎn jing', 'les yeux'), ('嗓子', 'sǎng zi', 'la gorge'), ('头', 'tóu', 'la tête'), ('肚子', 'dù zi', 'le ventre'),
            ('腰', 'yāo', 'le dos'), ('脚', 'jiǎo', 'le pied'), ('牙', 'yá', 'les dents'), ('嗓子', 'sǎng zi', 'la gorge')),
   'r': col(('想回家休息', 'xiǎng huí jiā xiū xi', 'je veux rentrer me reposer'), ('不想吃东西', 'bù xiǎng chī dōng xi', 'je n’ai pas envie de manger'),
            ('不能吃甜的', 'bù néng chī tián de', 'je ne peux pas manger sucré'), ('走不了路', 'zǒu bu liǎo lù', 'je ne peux pas marcher'),
            ('不想看手机', 'bù xiǎng kàn shǒu jī', 'je ne veux pas regarder mon téléphone'), ('不想说话', 'bù xiǎng shuō huà', 'je n’ai pas envie de parler'),
            ('不去上班了', 'bú qù shàng bān le', 'je ne vais pas au travail'), ('想去医院看看', 'xiǎng qù yī yuàn kàn kan', 'je veux aller voir à l’hôpital'),
            ('不能搬东西', 'bù néng bān dōng xi', 'je ne peux rien porter'), ('不想去跑步了', 'bù xiǎng qù pǎo bù le', 'je n’ai plus envie de courir'),
            ('得去看牙医', 'děi qù kàn yá yī', 'je dois aller chez le dentiste'), ('不唱歌了', 'bú chàng gē le', 'je ne chante pas'))},
  [['n', 'r']], ['p']))

# 3. Écran 2 — lieu ou chose + aspect + adjectif
gabarits.append(gab(
  [S('x'), S('t'), S('n'), S('a'), P('。')],
  '… : …, … est ….',
  {'x': liste(('我觉得', 'wǒ jué de', 'je trouve que'), ('听说', 'tīng shuō', 'il paraît que'), ('大家都说', 'dà jiā dōu shuō', 'tout le monde dit que')),
   't': col(('这家饭馆', 'zhè jiā fàn guǎn', 'ce restaurant'), ('这个菜', 'zhè ge cài', 'ce plat'), ('那个超市', 'nà ge chāo shì', 'ce supermarché'),
            ('这家咖啡馆', 'zhè jiā kā fēi guǎn', 'ce café'), ('这件衣服', 'zhè jiàn yī fu', 'ce vêtement'), ('这个城市', 'zhè ge chéng shì', 'cette ville'),
            ('北京', 'Běi jīng', 'Pékin'), ('这儿', 'zhèr', 'ici'), ('那个地方', 'nà ge dì fang', 'cet endroit'),
            ('这本书', 'zhè běn shū', 'ce livre'), ('这个小区', 'zhè ge xiǎo qū', 'ce quartier'), ('这个公园', 'zhè ge gōng yuán', 'ce parc')),
   'n': col(('菜', 'cài', 'les plats'), ('味道', 'wèi dao', 'le goût'), ('水果', 'shuǐ guǒ', 'les fruits'),
            ('咖啡', 'kā fēi', 'le café'), ('颜色', 'yán sè', 'la couleur'), ('交通', 'jiāo tōng', 'les transports'),
            ('冬天', 'dōng tiān', 'l’hiver'), ('夏天', 'xià tiān', 'l’été'), ('东西', 'dōng xi', 'les choses'),
            ('内容', 'nèi róng', 'le contenu'), ('环境', 'huán jìng', 'le cadre'), ('人', 'rén', 'les gens')),
   'a': col(('很好吃', 'hěn hǎo chī', 'bons'), ('不错', 'bú cuò', 'pas mal'), ('很新鲜', 'hěn xīn xiān', 'frais'),
            ('很好喝', 'hěn hǎo hē', 'bon'), ('很好看', 'hěn hǎo kàn', 'jolie'), ('很方便', 'hěn fāng biàn', 'pratiques'),
            ('很冷', 'hěn lěng', 'froid'), ('特别热', 'tè bié rè', 'très chaud'), ('很便宜', 'hěn pián yi', 'bon marché'),
            ('很有意思', 'hěn yǒu yì si', 'intéressant'), ('很好', 'hěn hǎo', 'agréable'), ('不多', 'bù duō', 'peu nombreux'))},
  [['t', 'n', 'a']], ['x']))

# 4. Écran 3 — une action en sujet
gabarits.append(gab(
  [S('x'), S('v'), S('j'), P('。')],
  '… : …, c’est ….',
  {'x': liste(('我觉得', 'wǒ jué de', 'je trouve que'), ('其实', 'qí shí', 'en fait')),
   'v': col(('学汉语', 'xué Hàn yǔ', 'apprendre le chinois'), ('写汉字', 'xiě Hàn zì', 'écrire les caractères'),
            ('每天走路', 'měi tiān zǒu lù', 'marcher tous les jours'), ('晚上喝咖啡', 'wǎn shang hē kā fēi', 'boire du café le soir'),
            ('一个人旅游', 'yí ge rén lǚ yóu', 'voyager seul'), ('坐地铁上班', 'zuò dì tiě shàng bān', 'aller au travail en métro'),
            ('在家做饭', 'zài jiā zuò fàn', 'cuisiner chez soi'), ('早睡早起', 'zǎo shuì zǎo qǐ', 'se coucher tôt et se lever tôt'),
            ('看中文电影', 'kàn Zhōng wén diàn yǐng', 'regarder des films chinois'), ('学做中国菜', 'xué zuò Zhōng guó cài', 'apprendre la cuisine chinoise'),
            ('跟中国人聊天', 'gēn Zhōng guó rén liáo tiān', 'discuter avec des Chinois'), ('周末睡懒觉', 'zhōu mò shuì lǎn jiào', 'faire la grasse matinée le week-end')),
   'j': col(('很有意思', 'hěn yǒu yì si', 'intéressant'), ('没那么难', 'méi nà me nán', 'moins difficile qu’on ne croit'),
            ('对身体很好', 'duì shēn tǐ hěn hǎo', 'très bon pour la santé'), ('对睡觉不好', 'duì shuì jiào bù hǎo', 'mauvais pour le sommeil'),
            ('很自由', 'hěn zì yóu', 'la liberté'), ('比开车快', 'bǐ kāi chē kuài', 'plus rapide qu’en voiture'),
            ('比较便宜', 'bǐ jiào pián yi', 'plutôt économique'), ('很重要', 'hěn zhòng yào', 'important'),
            ('很有用', 'hěn yǒu yòng', 'utile'), ('挺有意思的', 'tǐng yǒu yì si de', 'plutôt amusant'),
            ('很有帮助', 'hěn yǒu bāng zhù', 'd’une grande aide'), ('很舒服', 'hěn shū fu', 'agréable'))},
  [['v', 'j']], ['x']))

# 5. Écran 4 — une proposition en sujet, jugement court
gabarits.append(gab(
  [S('c'), S('j'), P('。')],
  '…, … (ça ne pose pas de problème).',
  {'c': liste(('你明天来', 'nǐ míng tiān lái', 'que tu viennes demain'), ('他不来', 'tā bù lái', 's’il ne vient pas'),
              ('你一个人去', 'nǐ yí ge rén qù', 'que tu y ailles seul'), ('我们晚一点儿走', 'wǒ men wǎn yì diǎnr zǒu', 'que nous partions un peu plus tard'),
              ('你用我的手机', 'nǐ yòng wǒ de shǒu jī', 'que tu prennes mon téléphone'), ('咱们坐地铁去', 'zán men zuò dì tiě qù', 'qu’on y aille en métro'),
              ('你先回家', 'nǐ xiān huí jiā', 'que tu rentres d’abord'), ('你下个星期还我', 'nǐ xià ge xīng qī huán wǒ', 'que tu me le rendes la semaine prochaine')),
   'j': liste(('没关系', 'méi guān xi', 'ce n’est pas grave'), ('也行', 'yě xíng', 'ça va aussi'), ('也可以', 'yě kě yǐ', 'c’est possible aussi'))},
  [], ['c', 'j']))

# 6. Écran 4 — une question en sujet
gabarits.append(gab(
  [S('q'), S('j'), P('。')],
  '…, on ne le sait pas encore.',
  {'q': liste(('他来不来', 'tā lái bu lái', 's’il viendra'), ('明天下不下雨', 'míng tiān xià bu xià yǔ', 's’il pleuvra demain'),
              ('她去不去', 'tā qù bu qù', 'si elle ira'), ('我们几点出发', 'wǒ men jǐ diǎn chū fā', 'à quelle heure nous partirons'),
              ('谁去机场接他', 'shéi qù jī chǎng jiē tā', 'qui ira le chercher à l’aéroport'), ('他什么时候回国', 'tā shén me shí hou huí guó', 'quand il rentrera dans son pays'),
              ('这个周末去哪儿玩', 'zhè ge zhōu mò qù nǎr wánr', 'où on ira ce week-end'), ('饭馆开不开门', 'fàn guǎn kāi bu kāi mén', 'si le restaurant sera ouvert')),
   'j': liste(('还不知道', 'hái bù zhī dào', 'on ne sait pas encore'), ('还不清楚', 'hái bù qīng chu', 'ce n’est pas encore clair'))},
  [], ['q', 'j']))

# 7. Écran 5 — deux objets : la personne, puis la chose
gabarits.append(gab(
  [S('s'), S('v'), S('p'), S('o'), P('。')],
  '… … à … ….',
  {'s': liste(('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我朋友', 'wǒ péng you', 'mon ami'), ('我同事', 'wǒ tóng shì', 'ma collègue')),
   'v': col(('给了', 'gěi le', 'a donné'), ('送了', 'sòng le', 'a offert'), ('教', 'jiāo', 'enseigne'), ('问了', 'wèn le', 'a posé'),
            ('告诉', 'gào su', 'a annoncé'), ('还了', 'huán le', 'a rendu'), ('借了', 'jiè le', 'a prêté'), ('给了', 'gěi le', 'a servi'),
            ('教', 'jiāo', 'apprend'), ('送了', 'sòng le', 'a offert'), ('问了', 'wèn le', 'a posé'), ('告诉', 'gào su', 'a confié')),
   'p': liste(('我', 'wǒ', 'moi'), ('我们', 'wǒ men', 'nous')),
   'o': col(('一本书', 'yì běn shū', 'un livre'), ('一个礼物', 'yí ge lǐ wù', 'un cadeau'), ('中文', 'Zhōng wén', 'le chinois'),
            ('一个问题', 'yí ge wèn tí', 'une question'), ('一个好消息', 'yí ge hǎo xiāo xi', 'une bonne nouvelle'), ('两百块钱', 'liǎng bǎi kuài qián', 'deux cents yuans'),
            ('一辆自行车', 'yí liàng zì xíng chē', 'un vélo'), ('一杯茶', 'yì bēi chá', 'une tasse de thé'), ('做饺子', 'zuò jiǎo zi', 'à faire des raviolis'),
            ('两张电影票', 'liǎng zhāng diàn yǐng piào', 'deux places de cinéma'), ('很多问题', 'hěn duō wèn tí', 'beaucoup de questions'), ('一个秘密', 'yí ge mì mì', 'un secret'))},
  [['v', 'o']], ['s', 'p']))

# 8. Écran 6 — verbe + 给 + personne + chose
gabarits.append(gab(
  [S('s'), S('t'), S('v'), S('p'), S('o'), P('。')],
  '… … … à … ….',
  {'s': liste(('我', 'wǒ', 'je'), ('我们', 'wǒ men', 'nous')),
   't': liste(('明天', 'míng tiān', 'demain'), ('下午', 'xià wǔ', 'cet après-midi'), ('下个星期', 'xià ge xīng qī', 'la semaine prochaine')),
   'v': col(('还给', 'huán gěi', 'rendre'), ('寄给', 'jì gěi', 'envoyer'), ('带给', 'dài gěi', 'apporter'), ('送给', 'sòng gěi', 'offrir'),
            ('送给', 'sòng gěi', 'offrir'), ('寄给', 'jì gěi', 'envoyer'), ('借给', 'jiè gěi', 'prêter'), ('借给', 'jiè gěi', 'prêter'),
            ('发给', 'fā gěi', 'envoyer'), ('带给', 'dài gěi', 'apporter'), ('还给', 'huán gěi', 'rendre'), ('卖给', 'mài gěi', 'vendre')),
   'p': col(('你', 'nǐ', 'toi'), ('妈妈', 'mā ma', 'maman'), ('你', 'nǐ', 'toi'), ('他', 'tā', 'lui'),
            ('老师', 'lǎo shī', 'la professeure'), ('我姐姐', 'wǒ jiě jie', 'ma grande sœur'), ('他', 'tā', 'lui'), ('你', 'nǐ', 'toi'),
            ('你', 'nǐ', 'toi'), ('孩子们', 'hái zi men', 'les enfants'), ('图书馆', 'tú shū guǎn', 'la bibliothèque'), ('我同学', 'wǒ tóng xué', 'mon camarade')),
   'o': col(('两百块钱', 'liǎng bǎi kuài qián', 'deux cents yuans'), ('一张照片', 'yì zhāng zhào piàn', 'une photo'), ('一本中文书', 'yì běn Zhōng wén shū', 'un livre en chinois'),
            ('一个小礼物', 'yí ge xiǎo lǐ wù', 'un petit cadeau'), ('一盒茶', 'yì hé chá', 'une boîte de thé'), ('一点儿中国茶', 'yì diǎnr Zhōng guó chá', 'un peu de thé chinois'),
            ('五百块钱', 'wǔ bǎi kuài qián', 'cinq cents yuans'), ('一辆自行车', 'yí liàng zì xíng chē', 'un vélo'), ('几张照片', 'jǐ zhāng zhào piàn', 'quelques photos'),
            ('一些糖', 'yì xiē táng', 'des bonbons'), ('两本书', 'liǎng běn shū', 'deux livres'), ('一辆旧车', 'yí liàng jiù chē', 'une vieille voiture'))},
  [['v', 'p', 'o']], ['s', 't']))

# 9. Écran 6 — 把 + chose connue + V给 + personne + 了
gabarits.append(gab(
  [S('s'), T('把', 'bǎ'), S('o'), S('v'), S('p'), T('了', 'le'), P('。')],
  '… … … à ….',
  {'s': liste(('我', 'wǒ', 'j’ai'), ('我已经', 'wǒ yǐ jīng', 'j’ai déjà')),
   'o': col(('作业', 'zuò yè', 'les devoirs'), ('书', 'shū', 'le livre'), ('钥匙', 'yào shi', 'les clés'), ('照片', 'zhào piàn', 'les photos'),
            ('钱', 'qián', 'l’argent'), ('信', 'xìn', 'la lettre'), ('旧自行车', 'jiù zì xíng chē', 'le vieux vélo'), ('那本词典', 'nà běn cí diǎn', 'ce dictionnaire'),
            ('手机号码', 'shǒu jī hào mǎ', 'le numéro de portable'), ('礼物', 'lǐ wù', 'le cadeau'), ('地址', 'dì zhǐ', 'l’adresse'), ('护照', 'hù zhào', 'le passeport')),
   'v': col(('交给', 'jiāo gěi', 'remis'), ('还给', 'huán gěi', 'rendu'), ('交给', 'jiāo gěi', 'confié'), ('发给', 'fā gěi', 'envoyé'),
            ('还给', 'huán gěi', 'rendu'), ('寄给', 'jì gěi', 'envoyé'), ('卖给', 'mài gěi', 'vendu'), ('送给', 'sòng gěi', 'offert'),
            ('发给', 'fā gěi', 'envoyé'), ('送给', 'sòng gěi', 'offert'), ('发给', 'fā gěi', 'envoyé'), ('交给', 'jiāo gěi', 'remis')),
   'p': col(('老师', 'lǎo shī', 'la professeure'), ('他', 'tā', 'lui'), ('邻居', 'lín jū', 'la voisine'), ('你', 'nǐ', 'toi'),
            ('你', 'nǐ', 'toi'), ('妈妈', 'mā ma', 'maman'), ('朋友', 'péng you', 'un ami'), ('我同学', 'wǒ tóng xué', 'mon camarade'),
            ('他', 'tā', 'lui'), ('她', 'tā', 'elle'), ('大家', 'dà jiā', 'tout le monde'), ('前台', 'qián tái', 'la réception'))},
  [['o', 'v', 'p']], ['s']))

# 10. Écran 6 — 给 + personne devant le verbe : pour qui l’on agit
gabarits.append(gab(
  [S('t'), T('我', 'wǒ'), T('给', 'gěi'), S('p'), S('v'), P('。')],
  '…, je … pour … / à ….',
  {'t': liste(('等一下', 'děng yí xià', 'tout à l’heure'), ('晚上', 'wǎn shang', 'ce soir'), ('明天', 'míng tiān', 'demain')),
   'p': liste(('你', 'nǐ', 'toi'), ('你们', 'nǐ men', 'vous')),
   'v': liste(('打电话', 'dǎ diàn huà', 'téléphoner'), ('发微信', 'fā wēi xìn', 'envoyer un message WeChat'), ('做饭', 'zuò fàn', 'faire à manger'),
              ('拍张照片', 'pāi zhāng zhào piàn', 'prendre une photo'), ('买杯咖啡', 'mǎi bēi kā fēi', 'acheter un café'), ('讲个故事', 'jiǎng ge gù shi', 'raconter une histoire'))},
  [], ['t', 'p', 'v']))

# 11. Écran 7 — V着 + V : la manière, puis l’action
gabarits.append(gab(
  [S('s'), S('a'), S('b'), P('。')],
  '… … en … / … ….',
  {'s': liste(('他', 'tā', 'il'), ('她', 'tā', 'elle'), ('我妹妹', 'wǒ mèi mei', 'ma petite sœur'), ('我朋友', 'wǒ péng you', 'mon ami')),
   'a': col(('笑着', 'xiào zhe', 'en souriant'), ('哭着', 'kū zhe', 'en pleurant'), ('站着', 'zhàn zhe', 'debout'), ('躺着', 'tǎng zhe', 'couché'),
            ('走着', 'zǒu zhe', 'à pied'), ('坐着', 'zuò zhe', 'assis'), ('开着灯', 'kāi zhe dēng', 'la lumière allumée'), ('听着音乐', 'tīng zhe yīn yuè', 'en écoutant de la musique'),
            ('唱着歌', 'chàng zhe gē', 'en chantant'), ('看着手机', 'kàn zhe shǒu jī', 'en regardant son téléphone'), ('抱着孩子', 'bào zhe hái zi', 'un enfant dans les bras'), ('拿着伞', 'ná zhe sǎn', 'avec un parapluie')),
   'b': col(('说没关系', 'shuō méi guān xi', 'dire que ce n’est rien'), ('说不想去', 'shuō bù xiǎng qù', 'dire qu’il ne veut pas y aller'), ('吃早饭', 'chī zǎo fàn', 'prendre le petit déjeuner'),
            ('看手机', 'kàn shǒu jī', 'regarder son téléphone'), ('去公司', 'qù gōng sī', 'aller au bureau'), ('看电视', 'kàn diàn shì', 'regarder la télévision'),
            ('睡觉', 'shuì jiào', 'dormir'), ('跑步', 'pǎo bù', 'courir'), ('做饭', 'zuò fàn', 'cuisiner'),
            ('吃饭', 'chī fàn', 'manger'), ('买菜', 'mǎi cài', 'faire les courses'), ('出门了', 'chū mén le', 'sortir'))},
  [['a', 'b']], ['s']))

# 12. Écrans 7 et 8 — 别 + V着V, la remontrance (oral)
gabarits.append(gab(
  [S('p'), T('别', 'bié'), S('a'), S('b'), T('了', 'le'), P('，'), S('r'), P('。')],
  '… : ne … pas … ; ….',
  {'p': liste(('你', 'nǐ', 'toi'), ('你们', 'nǐ men', 'vous')),
   'a': col(('躺着', 'tǎng zhe', 'couché'), ('站着', 'zhàn zhe', 'debout'), ('开着灯', 'kāi zhe dēng', 'la lumière allumée'), ('看着手机', 'kàn zhe shǒu jī', 'en regardant le téléphone'),
            ('走着', 'zǒu zhe', 'à pied'), ('开着窗', 'kāi zhe chuāng', 'la fenêtre ouverte'), ('低着头', 'dī zhe tóu', 'tête baissée'), ('戴着耳机', 'dài zhe ěr jī', 'avec des écouteurs'),
            ('趴着', 'pā zhe', 'penché sur la table'), ('光着脚', 'guāng zhe jiǎo', 'pieds nus'), ('穿着鞋', 'chuān zhe xié', 'avec ses chaussures'), ('空着肚子', 'kōng zhe dù zi', 'le ventre vide')),
   'b': col(('看书', 'kàn shū', 'lire'), ('吃饭', 'chī fàn', 'manger'), ('睡觉', 'shuì jiào', 'dormir'), ('吃饭', 'chī fàn', 'manger'),
            ('去', 'qù', 'y aller'), ('睡觉', 'shuì jiào', 'dormir'), ('走路', 'zǒu lù', 'marcher'), ('过马路', 'guò mǎ lù', 'traverser la rue'),
            ('写作业', 'xiě zuò yè', 'faire ses devoirs'), ('跑', 'pǎo', 'courir'), ('上床', 'shàng chuáng', 'monter sur le lit'), ('喝酒', 'hē jiǔ', 'boire de l’alcool')),
   'r': col(('对眼睛不好', 'duì yǎn jing bù hǎo', 'c’est mauvais pour les yeux'), ('找个地方坐吧', 'zhǎo ge dì fang zuò ba', 'trouvez une place pour vous asseoir'),
            ('会睡不好的', 'huì shuì bu hǎo de', 'tu dormiras mal'), ('饭都凉了', 'fàn dōu liáng le', 'le repas a refroidi'),
            ('太远了', 'tài yuǎn le', 'c’est trop loin'), ('会感冒的', 'huì gǎn mào de', 'tu vas t’enrhumer'),
            ('小心车', 'xiǎo xīn chē', 'attention aux voitures'), ('太危险了', 'tài wēi xiǎn le', 'c’est trop dangereux'),
            ('坐直了', 'zuò zhí le', 'tiens-toi droit'), ('地上很凉', 'dì shang hěn liáng', 'le sol est froid'),
            ('多脏啊', 'duō zāng a', 'c’est sale'), ('对胃不好', 'duì wèi bù hǎo', 'c’est mauvais pour l’estomac'))},
  [['a', 'b', 'r']], ['p'], reg='oral'))

# 13. Écran 8 — emprunter un instant (oral)
gabarits.append(gab(
  [S('o'), P('，'), T('借', 'jiè'), T('我', 'wǒ'), T('用一下', 'yòng yí xià'), P('，'), S('t'), P('？')],
  '…, tu me le prêtes un instant, … ?',
  {'o': liste(('你的笔', 'nǐ de bǐ', 'ton stylo'), ('你的手机', 'nǐ de shǒu jī', 'ton téléphone'), ('你的伞', 'nǐ de sǎn', 'ton parapluie'),
              ('你的词典', 'nǐ de cí diǎn', 'ton dictionnaire'), ('你的充电器', 'nǐ de chōng diàn qì', 'ton chargeur'), ('你的自行车', 'nǐ de zì xíng chē', 'ton vélo')),
   't': liste(('行吗', 'xíng ma', 'ça va'), ('好吗', 'hǎo ma', 'd’accord'), ('可以吗', 'kě yǐ ma', 'je peux'))},
  [], ['o', 't'], reg='oral'))

# 14. Écran 8 — offrir (oral)
gabarits.append(gab(
  [S('o'), P('，'), S('v'), T('你', 'nǐ'), T('的', 'de'), P('！')],
  '…, c’est pour toi !',
  {'o': liste(('一点儿小礼物', 'yì diǎnr xiǎo lǐ wù', 'un petit cadeau'), ('这本书', 'zhè běn shū', 'ce livre'), ('这盒茶', 'zhè hé chá', 'cette boîte de thé'),
              ('这个蛋糕', 'zhè ge dàn gāo', 'ce gâteau'), ('这是我做的饺子', 'zhè shì wǒ zuò de jiǎo zi', 'ce sont des raviolis que j’ai faits')),
   'v': liste(('送', 'sòng', 'offert à'), ('送给', 'sòng gěi', 'offert à'))},
  [], ['o', 'v'], reg='oral'))

# ---------------------------------------------------------------------
# Transformations (9), 改错 (8), réemplois (4)
# ---------------------------------------------------------------------
def TR(consigne, de, vers, fr, reg=None):
    d = {'consigne': consigne, 'de': EX(*de), 'vers': {'seg': seg(*vers), 'fr': fr}}
    if reg:
        d['reg'] = reg
    return d

transfo = [
  TR('Dites-le avec deux sujets, sans 的', ('他的个子很高。', 'tā de gè zi hěn gāo', 'Sa taille est grande.'),
     [('他', 'tā'), ('个子', 'gè zi'), ('很高', 'hěn gāo'), '。'], 'Il est grand.'),
  TR('Faites de l’action le sujet du jugement, en une phrase', ('我学汉语。我觉得很有意思。', 'wǒ xué Hàn yǔ. wǒ jué de hěn yǒu yì si', 'J’apprends le chinois. Je trouve ça intéressant.'),
     [('我觉得', 'wǒ jué de'), ('学汉语', 'xué Hàn yǔ'), ('很有意思', 'hěn yǒu yì si'), '。'], 'Je trouve qu’apprendre le chinois, c’est intéressant.'),
  TR('Supprimez 如果 : la proposition devient sujet', ('如果他不来，也没关系。', 'rú guǒ tā bù lái, yě méi guān xi', 'S’il ne vient pas, ce n’est pas grave non plus.'),
     [('他不来', 'tā bù lái'), ('也没关系', 'yě méi guān xi'), '。'], 'S’il ne vient pas, ce n’est pas grave.'),
  TR('Faites de la question le sujet de la phrase', ('他来吗？我们还不知道。', 'tā lái ma? wǒ men hái bù zhī dào', 'Il vient ? Nous ne le savons pas encore.'),
     [('他', 'tā'), ('来不来', 'lái bu lái'), ('还不知道', 'hái bù zhī dào'), '。'], 'On ne sait pas encore s’il viendra.'),
  TR('Placez la personne juste après le verbe, puis la chose', ('他送了一本书给我。', 'tā sòng le yì běn shū gěi wǒ', 'Il m’a offert un livre.'),
     [('他', 'tā'), ('送了', 'sòng le'), ('我', 'wǒ'), ('一本书', 'yì běn shū'), '。'], 'Il m’a offert un livre.'),
  TR('Faites passer le livre devant avec 把, puis employez 还给', ('我明天还你书。', 'wǒ míng tiān huán nǐ shū', 'Je te rends le livre demain.'),
     [('我', 'wǒ'), ('明天', 'míng tiān'), ('把', 'bǎ'), ('书', 'shū'), ('还给', 'huán gěi'), ('你', 'nǐ'), '。'], 'Je te rends le livre demain.'),
  TR('Précisez à qui : « je t’appelle »', ('晚上我打电话。', 'wǎn shang wǒ dǎ diàn huà', 'Ce soir, je téléphone.'),
     [('晚上', 'wǎn shang'), ('我', 'wǒ'), ('给', 'gěi'), ('你', 'nǐ'), ('打电话', 'dǎ diàn huà'), '。'], 'Je t’appelle ce soir.'),
  TR('Fondez les deux phrases : le premier verbe dit la manière', ('她笑了。她说没关系。', 'tā xiào le. tā shuō méi guān xi', 'Elle a souri. Elle a dit que ce n’était rien.'),
     [('她', 'tā'), ('笑着', 'xiào zhe'), ('说', 'shuō'), ('没关系', 'méi guān xi'), '。'], 'Elle dit en souriant que ce n’est rien.'),
  TR('Dites-le avec 着, comme à l’oral', ('我们走路去吧。', 'wǒ men zǒu lù qù ba', 'Allons-y en marchant.'),
     [('我们', 'wǒ men'), ('走着', 'zǒu zhe'), ('去', 'qù'), ('吧', 'ba'), '。'], 'Allons-y à pied.', reg='oral'),
]

def FX(toks, bad, bon, why):
    s = seg(*toks)
    assert s[bad]['p']
    return {'seg': s, 'bad': bad, 'bon': bon, 'why': why}

fixes = [
  FX([('他', 'tā'), ('给', 'gěi'), ('一本书', 'yì běn shū'), ('我', 'wǒ'), '。'], 2, '他给我一本书。',
     'La personne d’abord, la chose ensuite, sans « à ».'),
  FX([('这', 'zhè'), ('很有意思', 'hěn yǒu yì si'), ('学汉语', 'xué Hàn yǔ'), '。'], 0, '学汉语很有意思。',
     'Pas de 这 pour annoncer l’action : elle se met en tête.'),
  FX([('他', 'tā'), ('是', 'shì'), ('个子', 'gè zi'), ('很高', 'hěn gāo'), '。'], 1, '他个子很高。',
     'Deux sujets, puis 很 + adjectif : pas de 是.'),
  FX([('我', 'wǒ'), ('有', 'yǒu'), ('头疼', 'tóu téng'), '。'], 1, '我头疼。',
     'On n’« a » pas mal en chinois : la tête fait mal.'),
  FX([('我', 'wǒ'), ('寄', 'jì'), ('妈妈', 'mā ma'), ('一张照片', 'yì zhāng zhào piàn'), '。'], 1, '我寄给妈妈一张照片。',
     '寄 ne prend pas deux objets seul : 寄给.'),
  FX([('我们', 'wǒ men'), ('站', 'zhàn'), ('在', 'zài'), ('吃', 'chī'), ('吧', 'ba'), '。'], 2, '我们站着吃吧。',
     '站在 attend un lieu. Pour « debout », c’est 站着.'),
  FX([('他', 'tā'), ('来', 'lái'), ('吗', 'ma'), ('还不一定', 'hái bù yí dìng'), '。'], 2, '他来不来还不一定。',
     'Une question en sujet prend la forme 来不来, pas 吗.'),
  FX([('我', 'wǒ'), ('把', 'bǎ'), ('作业', 'zuò yè'), ('交', 'jiāo'), ('老师', 'lǎo shī'), ('了', 'le'), '。'], 3, '我把作业交给老师了。',
     '交 demande 给 devant la personne : 交给老师.'),
]

reemploi = [
  {'q': 'Décrivez une personne de votre entourage : sa taille et ses cheveux, chaque fois avec deux sujets.',
   'verif': [{'type': 'contient', 'v': '个子', 'msg': 'La taille se dit avec 个子.'},
             {'type': 'contient', 'v': '头发', 'msg': 'Les cheveux se disent avec 头发.'},
             {'type': 'absent', 'v': '是个子', 'msg': 'Pas de 是 devant le second sujet.'}],
   'modeles': [EX('我妹妹个子很高，头发很长。', 'wǒ mèi mei gè zi hěn gāo, tóu fa hěn cháng', 'Ma petite sœur est grande, elle a les cheveux longs.'),
               EX('我朋友个子不高，头发很短。', 'wǒ péng you gè zi bù gāo, tóu fa hěn duǎn', 'Mon ami n’est pas grand, il a les cheveux courts.')],
   'criteres': ['La personne d’abord, puis 个子 ou 头发', '很 ou 不 devant l’adjectif', 'Pas de 是, pas de 有']},
  {'q': 'Dites ce que vous pensez de l’apprentissage du chinois, puis de la cuisine à la maison, en commençant chaque fois par l’action.',
   'verif': [{'type': 'un_parmi', 'v': ['学汉语', '学中文'], 'msg': 'L’action se met en tête : 学汉语 ou 学中文.'},
             {'type': 'un_parmi', 'v': ['做饭', '做菜'], 'msg': 'La cuisine à la maison : 在家做饭.'},
             {'type': 'absent', 'v': '这很', 'msg': 'Pas de 这 pour annoncer l’action.'}],
   'modeles': [EX('学汉语很有意思，在家做饭比较便宜。', 'xué Hàn yǔ hěn yǒu yì si, zài jiā zuò fàn bǐ jiào pián yi', 'Apprendre le chinois, c’est intéressant ; cuisiner chez soi, c’est plutôt économique.'),
               EX('学中文不太难，在家做菜很舒服。', 'xué Zhōng wén bú tài nán, zài jiā zuò cài hěn shū fu', 'Le chinois n’est pas très difficile à apprendre ; cuisiner chez soi, c’est agréable.')],
   'criteres': ['L’action en tête, sans 这', 'Le jugement suit directement', 'Pas de 是 avant l’adjectif']},
  {'q': 'Vous rendez à un ami le livre et l’argent qu’il vous a prêtés. Dites-le-lui.',
   'verif': [{'type': 'contient', 'v': '还给', 'msg': 'Rendre à quelqu’un : 还给 + personne.'}],
   'modeles': [EX('这是你的书，还给你。我明天把钱还给你。', 'zhè shì nǐ de shū, huán gěi nǐ. wǒ míng tiān bǎ qián huán gěi nǐ', 'Voici ton livre, je te le rends. Je te rends l’argent demain.'),
               EX('我把书还给你，钱下个星期还给你。', 'wǒ bǎ shū huán gěi nǐ, qián xià ge xīng qī huán gěi nǐ', 'Je te rends le livre, l’argent la semaine prochaine.')],
   'criteres': ['还 se lit huán', '给 juste après 还, avant la personne', 'La chose connue passe devant, avec 把 ou en tête']},
  {'q': 'Un ami mange debout dans la cuisine en regardant son téléphone. Faites-lui deux remarques, comme à l’oral.',
   'verif': [{'type': 'contient', 'v': '别', 'msg': 'La remarque commence par 别.'},
             {'type': 'contient', 'v': '着', 'msg': 'L’état se dit avec V着 : 站着, 看着手机.'}],
   'modeles': [EX('别站着吃了，找个地方坐吧。别看着手机吃饭！', 'bié zhàn zhe chī le, zhǎo ge dì fang zuò ba. bié kàn zhe shǒu jī chī fàn', 'Ne mange pas debout, trouve une place pour t’asseoir. Et ne mange pas en regardant ton téléphone !', reg='oral')],
   'criteres': ['别 devant le premier verbe', '着 juste après le premier verbe', 'L’action vient en second'],
   'reg': 'oral'},
]

fiche = {
  'id': 'g332', 'hsk': 3, 'fam': 'phrase', 'th': ['decrire', 'quotidien'],
  'title': 'La phrase à deux étages : 他个子很高, 送给他, 笑着说',
  'resume': 'Le chinois empile volontiers deux étages dans une phrase simple : deux sujets (他个子很高), une action ou une phrase entière en sujet (学汉语很有意思), deux objets ou 给 derrière le verbe (送给他一本书), deux verbes dont le premier dit la manière (笑着说).',
  'hsk3': [],
  'equiv': [],
  'steps': steps, 'tableau': tableau, 'piege': piege,
  'voir': ['g202', 'g305', 'g307', 'g331'],
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
    tout = ''.join(m['hz'] for m in r['modeles'])
    for v in r['verif']:
        if v['type'] == 'contient': assert all(v['v'] in m['hz'] for m in r['modeles']), v
        if v['type'] == 'absent': assert all(v['v'] not in m['hz'] for m in r['modeles']), v
        if v['type'] == 'un_parmi': assert all(any(x in m['hz'] for x in v['v']) for m in r['modeles']), v
err = controles(fiche)
assert not err, '\n'.join(err)

if __name__ == '__main__':
    tot = sum(combos(g) for g in gabarits)
    print('g332 — %d écrans, %d gabarits, %d phrases engendrées' % (len(steps), len(gabarits), tot))
    for i, g in enumerate(gabarits, 1):
        print('\n— gabarit %d (%d phrases)%s : %s' % (i, combos(g), ' [oral]' if g.get('reg') else '', g['fr']))
        for s in tirages(g, 4, graine=i):
            print('   ', hz(s), ' | ', py(s))
    if '--banque' in sys.argv:
        print('\nBanque × leurres :')
        for b in banque:
            for l in leurres:
                print('   ', ''.join(l if k == b['cle'] else t['h'] for k, t in enumerate(b['seg'])))
    import gram_lib
    sd = sorted({m for h, p, _ in gram_lib._LECTURES for m in sandhi(h, p)})
    print('\nSandhi à relire :', len(sd)); [print('   ', m) for m in sd]
    ec = rapport_lectures()
    print('\nÉcarts de lecture (pypinyin) à relire :', len(ec)); [print('   ', m) for m in ec]
    if '--poser' in sys.argv:
        d = poser(fiche, os.path.join(os.path.dirname(__file__), '..', '..', 'data-gram.js'))
        print('\nFiche posée dans data-gram.js (+%d caractères).' % d)
