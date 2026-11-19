# -*- coding: utf-8 -*-
"""g333 — Donner son avis (rattrapage HSK 3).
在……看来 et 我看, 看来, 好像, 一定 / 不一定, 是……的 de jugement,
一般来说 et 一般, 根据, 关于, 在……上 / 在……中, 不怎么样.
Usage : python3 outils/fiches/g333.py [--banque] [--poser]"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from gram_lib import *

# ---------------------------------------------------------------------
# Écrans
# ---------------------------------------------------------------------
steps = [
  ecran('À mon avis : 在我看来', [
    '<b>在……看来</b> encadre la personne dont on donne l’avis : <b>在</b>我<b>看来</b>，这个办法不错 — <i>à mon avis, cette solution est bonne</i>.',
    'Le français dit « selon moi », « à ses yeux ». Le chinois place la personne entre 在 et 看来, en tête de phrase, puis une virgule : 在他<b>看来</b>，钱不是最重要的.',
    'Le ton est un peu posé, celui d’une discussion ou d’une réunion. Entre amis, on dit plutôt 我觉得, ou simplement 我看 : 我看这个办法不错.',
    'Ne le confondez pas avec 对我来说 (fiche 328), qui dit ce qu’une chose représente pour vous : 对我来说，汉字最难. 在我看来 donne votre avis sur une question.'],
    [EX('在我看来，这个办法不错。', 'zài wǒ kàn lái, zhè ge bàn fǎ bú cuò', 'À mon avis, cette solution est bonne.'),
     EX('在他看来，钱不是最重要的。', 'zài tā kàn lái, qián bú shì zuì zhòng yào de', 'À ses yeux, l’argent n’est pas le plus important.'),
     EX('在很多人看来，学汉语很难。', 'zài hěn duō rén kàn lái, xué Hàn yǔ hěn nán', 'Pour beaucoup de gens, apprendre le chinois, c’est difficile.')],
    {'q': '在我看来 se place :', 'a': ['en tête de phrase, suivi d’une virgule', 'en fin de phrase'], 'ok': 0,
     'why': 'Le point de vue s’annonce d’abord ; l’avis suit.'}),

  ecran('Apparemment : 看来', [
    '<b>看来</b> seul tire une conclusion de ce qu’on voit ou de ce qu’on apprend : 门关着，<b>看来</b>没人在家 — <i>la porte est fermée, apparemment il n’y a personne</i>.',
    'D’abord le fait, puis 看来 et ce qu’on en déduit. Le français dit « apparemment », « visiblement », « on dirait que » : 他还没回消息，<b>看来</b>他今天很忙.',
    'Ne le confondez pas avec 看起来 (fiche 309), qui juge une apparence : 他看起来很累 — <i>il a l’air fatigué</i>. 看来 conclut à partir d’un fait.',
    'Souvent, la conclusion annonce un changement de plan, avec 了 : 都八点了，<b>看来</b>他不来了 — <i>il est déjà huit heures, il ne viendra plus</i>.'],
    [EX('门关着，看来没人在家。', 'mén guān zhe, kàn lái méi rén zài jiā', 'La porte est fermée : apparemment, il n’y a personne.'),
     EX('下雨了，看来今天去不了了。', 'xià yǔ le, kàn lái jīn tiān qù bu liǎo le', 'Il pleut : visiblement, on ne pourra pas y aller aujourd’hui.'),
     EX('都八点了，看来他不来了。', 'dōu bā diǎn le, kàn lái tā bù lái le', 'Il est déjà huit heures : il ne viendra plus, on dirait.')],
    {'q': 'Dans 门关着，看来没人在家, 看来 sert à :', 'a': ['décrire l’allure de la porte', 'tirer une conclusion d’un fait'], 'ok': 1,
     'why': 'La porte fermée est le fait ; 看来 en tire la conclusion.'}),

  ecran('Une impression : 好像', [
    '<b>好像</b> dit une impression, sans certitude : 他<b>好像</b>不太高兴 — <i>on dirait qu’il n’est pas très content</i>.',
    'Il se place après le sujet, devant ce qu’on croit percevoir. Le français dit « il semble que », « j’ai l’impression que » : 外面<b>好像</b>下雨了.',
    'Il adoucit une remarque. Plutôt que 你说错了, tout net, on dit 你<b>好像</b>说错了 — <i>je crois que vous vous êtes trompé</i>.',
    '好像 dit ce qu’on ressent ; 看来 ce qu’on déduit d’un fait. 我<b>好像</b>见过他 — <i>j’ai l’impression de l’avoir déjà vu</i>.'],
    [EX('他好像不太高兴。', 'tā hǎo xiàng bú tài gāo xìng', 'On dirait qu’il n’est pas très content.'),
     EX('外面好像下雨了。', 'wài miàn hǎo xiàng xià yǔ le', 'On dirait qu’il pleut dehors.'),
     EX('我好像见过他。', 'wǒ hǎo xiàng jiàn guo tā', 'J’ai l’impression de l’avoir déjà vu.')],
    {'q': '我好像见过他 veut dire :', 'a': ['je l’ai vu, c’est certain', 'j’ai l’impression de l’avoir vu'], 'ok': 1,
     'why': '好像 dit une impression, pas une certitude.'}),

  ecran('Sûrement, sans faute : 一定, 不一定', [
    '<b>一定</b> a deux emplois. Le premier dit une certitude tirée de ce qu’on sait : 你走了一天，<b>一定</b>很累吧 — <i>vous avez marché toute la journée, vous devez être fatigué</i>.',
    'Le français dit alors « devoir » : « il doit être fatigué ». Ce n’est pas une obligation, donc pas de 得 (fiche 319) : 他<b>一定</b>知道 — <i>il le sait sûrement</i>.',
    'Le second emploi dit une volonté ferme, une promesse : 放心，我<b>一定</b>去 — <i>j’y serai, c’est promis</i>. 你<b>一定</b>要来啊 ! insiste pour que l’autre vienne.',
    'Attention à l’ordre avec 不. <b>不一定</b> veut dire « pas forcément » : 贵的东西<b>不一定</b>好. <b>一定不</b> veut dire « sûrement pas », « surtout pas » : 我一定不告诉别人.'],
    [EX('你走了一天，一定很累吧。', 'nǐ zǒu le yì tiān, yí dìng hěn lèi ba', 'Vous avez marché toute la journée, vous devez être fatigué.'),
     EX('放心，我一定去。', 'fàng xīn, wǒ yí dìng qù', 'Ne vous inquiétez pas, j’y serai sans faute.'),
     EX('贵的东西不一定好。', 'guì de dōng xi bù yí dìng hǎo', 'Ce qui est cher n’est pas forcément bon.')],
    {'q': '« Ce qui est cher n’est pas forcément bon » se dit :', 'a': ['贵的东西一定不好。', '贵的东西不一定好。'], 'ok': 1,
     'why': '不一定 : « pas forcément ». 一定不 voudrait dire « sûrement pas ».'}),

  ecran('Affirmer calmement : 是可以的, 是不可能的', [
    'Vous connaissez le 是……的 qui précise quand, où ou comment une chose s’est faite (fiche 301). Un second 是……的 encadre un jugement pour l’affirmer avec assurance : 这个问题<b>是</b>可以解决<b>的</b>.',
    'Le ton est calme et ferme, comme « je vous assure que ». Sans 是……的, la phrase dit la même chose, avec moins d’aplomb : 这个问题可以解决.',
    'Entre 是 et 的, on trouve surtout un verbe comme 可以, 会, 能, ou un adjectif : 你的想法<b>是</b>好<b>的</b> — <i>votre idée est bonne</i>. 他<b>是</b>会来<b>的</b> — <i>il viendra, j’en suis sûr</i>.',
    'La négation se met à l’intérieur, entre 是 et 的 : 这<b>是</b>不可能<b>的</b> — <i>c’est impossible</i>. Le français dit « ce n’est pas possible » ; le chinois ne dit pas 这不是可能的.'],
    [EX('这个问题是可以解决的。', 'zhè ge wèn tí shì kě yǐ jiě jué de', 'Ce problème peut tout à fait se résoudre.'),
     EX('你的想法是好的。', 'nǐ de xiǎng fǎ shì hǎo de', 'Votre idée est bonne.'),
     EX('这是不可能的。', 'zhè shì bù kě néng de', 'C’est impossible.')],
    {'q': '他是会来的 veut dire :', 'a': ['il viendra, j’en suis sûr', 'c’est en voiture qu’il est venu'], 'ok': 0,
     'why': '会 entre 是 et 的 : on affirme un jugement. Le 是……的 de la fiche 301 encadre une circonstance passée.'}),

  ecran('En général, d’après : 一般来说, 根据', [
    '<b>一般来说</b> pose une règle générale, en tête de phrase : <b>一般来说</b>，中国人吃晚饭比较早 — <i>en général, les Chinois dînent assez tôt</i>.',
    'Pour parler de ses habitudes, on dit 一般 tout court, après le sujet : 我<b>一般</b>七点起床 — <i>d’habitude, je me lève à sept heures</i>.',
    '<b>根据</b> donne la source sur laquelle on s’appuie : <b>根据</b>天气预报，明天会下雨 — <i>d’après la météo, il pleuvra demain</i>.',
    'Le français « selon » accepte une source comme une personne. 根据 n’accepte qu’une source : un texte, des chiffres, une expérience. 根据我的经验 se dit, 根据我 ne se dit pas ; pour « selon moi », c’est 在我看来.'],
    [EX('一般来说，中国人吃晚饭比较早。', 'yì bān lái shuō, Zhōng guó rén chī wǎn fàn bǐ jiào zǎo', 'En général, les Chinois dînent assez tôt.'),
     EX('我一般七点起床。', 'wǒ yì bān qī diǎn qǐ chuáng', 'D’habitude, je me lève à sept heures.'),
     EX('根据天气预报，明天会下雨。', 'gēn jù tiān qì yù bào, míng tiān huì xià yǔ', 'D’après la météo, il pleuvra demain.')],
    {'q': '« Selon moi, c’est faisable » se dit :', 'a': ['根据我，这是可以的。', '在我看来，这是可以的。'], 'ok': 1,
     'why': '根据 demande une source, jamais une personne seule. L’avis passe par 在……看来.'}),

  ecran('À propos de : 关于', [
    '<b>关于</b> annonce le sujet dont on parle : <b>关于</b>这个问题，我想说几句 — <i>à propos de cette question, j’aimerais dire quelques mots</i>.',
    'En tête de phrase, 关于 et son sujet sont suivis d’une virgule. Devant un nom, ils se lient par 的 : 一本<b>关于</b>中国历史<b>的</b>书 — <i>un livre sur l’histoire de la Chine</i>.',
    'Le français place « sur », « de » derrière le verbe : « parler de ce problème ». Le chinois s’en passe : 我们谈谈这个问题. Derrière un verbe, 关于 demande 的 et un nom : 我们谈谈关于工作的事.',
    'Ne le confondez pas avec 对, qui dit envers quoi l’on a une attitude : 我<b>对</b>历史很感兴趣 — <i>l’histoire m’intéresse</i>. 关于 ne fait qu’annoncer un sujet.'],
    [EX('关于这个问题，我想说几句。', 'guān yú zhè ge wèn tí, wǒ xiǎng shuō jǐ jù', 'À propos de cette question, j’aimerais dire quelques mots.'),
     EX('我在看一本关于中国历史的书。', 'wǒ zài kàn yì běn guān yú Zhōng guó lì shǐ de shū', 'Je lis un livre sur l’histoire de la Chine.'),
     EX('关于学费，你可以问一下老师。', 'guān yú xué fèi, nǐ kě yǐ wèn yí xià lǎo shī', 'Pour les frais d’inscription, vous pouvez demander au professeur.')],
    {'q': '« L’histoire m’intéresse » se dit :', 'a': ['我关于历史很感兴趣。', '我对历史很感兴趣。'], 'ok': 1,
     'why': 'L’intérêt pour quelque chose passe par 对. 关于 annonce seulement un sujet.'}),

  ecran('Sur le plan de : 在学习上, 在生活中', [
    '<b>在……上</b> situe un jugement dans un domaine : <b>在</b>学习<b>上</b>，他很努力 — <i>pour les études, il travaille dur</i>.',
    'Le français dit « sur le plan de », « en matière de », « côté ». Le chinois encadre le domaine : 在工作<b>上</b>, 在时间<b>上</b>, 在这个问题<b>上</b>.',
    '<b>在……中</b> situe dans un déroulement ou dans un ensemble : 在生活<b>中</b> — <i>dans la vie de tous les jours</i> ; 在这些菜<b>中</b> — <i>parmi ces plats</i>.',
    'Le domaine se place en tête, avec sa virgule ; le jugement suit : 在这个问题上，我们的看法不一样. Ce 上 ne situe rien dans l’espace.'],
    [EX('在学习上，他很努力。', 'zài xué xí shàng, tā hěn nǔ lì', 'Pour les études, il travaille dur.'),
     EX('在这个问题上，我们的看法不一样。', 'zài zhè ge wèn tí shàng, wǒ men de kàn fǎ bù yí yàng', 'Sur cette question, nous ne sommes pas du même avis.'),
     EX('在这次旅行中，我认识了很多朋友。', 'zài zhè cì lǚ xíng zhōng, wǒ rèn shi le hěn duō péng you', 'Pendant ce voyage, je me suis fait beaucoup d’amis.')],
    {'q': '在这个问题上 veut dire :', 'a': ['sur cette question', 'au-dessus de cette question'], 'ok': 0,
     'why': 'Ici, 上 désigne un domaine, pas une position dans l’espace.'}),

  ecran('À l’oral — 不怎么样, 我看, 那是当然的', [
    '<b>不怎么样</b> juge sans méchanceté : <i>pas terrible</i>. 这家饭馆的菜<b>不怎么样</b> — <i>la cuisine de ce restaurant n’est pas terrible</i>.',
    'Il se suffit à lui-même : — 那个电影怎么样？ — 不怎么样. Ne le confondez pas avec 不怎么, qui attend un adjectif : 不怎么好.',
    '<b>我看</b> est le 在我看来 de la conversation : 我看还是明天去吧 — <i>je crois qu’il vaut mieux y aller demain</i>.',
    'Pour approuver avec force, le 是……的 sert de réplique : 那<b>是</b>当然<b>的</b> ! — <i>ça va de soi !</i> 这<b>是</b>肯定<b>的</b> — <i>c’est sûr</i>.'],
    [EX('这家饭馆的菜不怎么样。', 'zhè jiā fàn guǎn de cài bù zěn me yàng', 'La cuisine de ce restaurant n’est pas terrible.', reg='oral'),
     EX('我看还是明天去吧。', 'wǒ kàn hái shi míng tiān qù ba', 'Je crois qu’il vaut mieux y aller demain.', reg='oral'),
     EX('你会来吗？——那是当然的！', 'nǐ huì lái ma? —— nà shì dāng rán de', 'Tu viendras ? — Ça va de soi !', reg='oral')],
    {'q': 'Une amie vous demande ce que vous avez pensé d’un film décevant. Vous répondez :', 'a': ['不怎么样。', '不怎么。'], 'ok': 0,
     'why': '不怎么 attend un adjectif (不怎么好) ; seul, on dit 不怎么样.'},
    reg='oral'),
]

# ---------------------------------------------------------------------
# Tableau, piège
# ---------------------------------------------------------------------
tableau = {'cols': ['Construction', 'Exemple', 'Ce qu’elle fait'], 'rows': [
  ['在 + personne + 看来', '在我看来，这个办法不错', 'Le point de vue, en tête'],
  ['我看', '我看还是明天去吧', 'Le même, à l’oral'],
  ['对 + personne + 来说', '对我来说，汉字最难', 'Ce qu’une chose est pour vous (fiche 328)'],
  ['Fait, puis 看来', '门关着，看来没人在家', 'La conclusion qu’on en tire'],
  ['看来 + 了', '看来他不来了', 'Un changement de plan'],
  ['看起来', '他看起来很累', 'Une apparence (fiche 309)'],
  ['Sujet + 好像 + verbe', '外面好像下雨了', 'Une impression, sans certitude'],
  ['好像 pour adoucir', '你好像说错了', 'Plutôt que 你说错了'],
  ['一定 : certitude', '你一定很累吧', '« Vous devez être fatigué »'],
  ['一定 : promesse', '放心，我一定去', '« Sans faute »'],
  ['不一定', '贵的东西不一定好', '« Pas forcément »'],
  ['一定不', '我一定不告诉别人', '« Sûrement pas », « surtout pas »'],
  ['是 + jugement + 的', '这个问题是可以解决的', 'Affirmer avec assurance'],
  ['是 + 会 + V + 的', '他是会来的', '« Il viendra, j’en suis sûr »'],
  ['是 + 不… + 的', '这是不可能的', 'La négation à l’intérieur'],
  ['一般来说', '一般来说，中国人吃晚饭比较早', 'Une règle générale'],
  ['Sujet + 一般', '我一般七点起床', 'Une habitude'],
  ['根据 + source', '根据天气预报，明天会下雨', 'D’après un texte, des chiffres'],
  ['Pas de 根据 + personne', '在我看来⋯', 'Jamais 根据我'],
  ['关于 + sujet, en tête', '关于这个问题，我想说几句', 'À propos de'],
  ['关于 + sujet + 的 + nom', '一本关于中国历史的书', 'Un livre sur…'],
  ['对 + chose + 感兴趣', '我对历史很感兴趣', 'L’attitude : 对, pas 关于'],
  ['在 + domaine + 上', '在学习上，他很努力', 'Sur le plan de'],
  ['在 + déroulement + 中', '在这次旅行中⋯', 'Au cours de, parmi'],
  ['À l’oral', '这家饭馆的菜不怎么样', '« Pas terrible »'],
  ['À l’oral', '那是当然的！', '« Ça va de soi ! »'],
]}

piege = {
  'bad': {'hz': '根据我，这个菜太辣了。', 'py': 'gēn jù wǒ, zhè ge cài tài là le'},
  'good': {'hz': '在我看来，这个菜太辣了。', 'py': 'zài wǒ kàn lái, zhè ge cài tài là le'},
  'why': 'Le français « selon » accepte une personne (« selon moi ») comme une source (« selon la météo »). 根据 n’accepte qu’une source : 根据天气预报, 根据我的经验. Pour donner votre avis, encadrez la personne avec 在……看来, ou dites simplement 我觉得.'}
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
  B([('在', 'zài'), ('我', 'wǒ'), ('看来', 'kàn lái'), '，', ('这个办法', 'zhè ge bàn fǎ'), ('不错', 'bú cuò'), '。'], 2, 'À mon avis, cette solution est bonne.'),
  B([('门', 'mén'), ('关着', 'guān zhe'), '，', ('看来', 'kàn lái'), ('没人', 'méi rén'), ('在家', 'zài jiā'), '。'], 3, 'La porte est fermée : apparemment, il n’y a personne.'),
  B([('都', 'dōu'), ('八点了', 'bā diǎn le'), '，', ('看来', 'kàn lái'), ('他', 'tā'), ('不来了', 'bù lái le'), '。'], 3, 'Il est déjà huit heures : il ne viendra plus, on dirait.'),
  B([('他', 'tā'), ('好像', 'hǎo xiàng'), ('不太高兴', 'bú tài gāo xìng'), '。'], 1, 'On dirait qu’il n’est pas très content.'),
  B([('外面', 'wài miàn'), ('好像', 'hǎo xiàng'), ('下雨了', 'xià yǔ le'), '。'], 1, 'On dirait qu’il pleut dehors.'),
  B([('你', 'nǐ'), ('走了', 'zǒu le'), ('一天', 'yì tiān'), '，', ('一定', 'yí dìng'), ('很累', 'hěn lèi'), ('吧', 'ba'), '。'], 4, 'Vous avez marché toute la journée, vous devez être fatigué.'),
  B([('放心', 'fàng xīn'), '，', ('我', 'wǒ'), ('一定', 'yí dìng'), ('去', 'qù'), '。'], 3, 'Ne vous inquiétez pas, j’y serai sans faute.'),
  B([('贵的', 'guì de'), ('东西', 'dōng xi'), ('不一定', 'bù yí dìng'), ('好', 'hǎo'), '。'], 2, 'Ce qui est cher n’est pas forcément bon.'),
  B([('这个问题', 'zhè ge wèn tí'), ('是', 'shì'), ('可以', 'kě yǐ'), ('解决', 'jiě jué'), ('的', 'de'), '。'], 1, 'Ce problème peut tout à fait se résoudre.'),
  B([('这', 'zhè'), ('是', 'shì'), ('不可能', 'bù kě néng'), ('的', 'de'), '。'], 3, 'C’est impossible.'),
  B([('一般来说', 'yì bān lái shuō'), '，', ('中国人', 'Zhōng guó rén'), ('吃晚饭', 'chī wǎn fàn'), ('比较早', 'bǐ jiào zǎo'), '。'], 0, 'En général, les Chinois dînent assez tôt.'),
  B([('我', 'wǒ'), ('一般', 'yì bān'), ('七点', 'qī diǎn'), ('起床', 'qǐ chuáng'), '。'], 1, 'D’habitude, je me lève à sept heures.'),
  B([('根据', 'gēn jù'), ('天气预报', 'tiān qì yù bào'), '，', ('明天', 'míng tiān'), ('会下雨', 'huì xià yǔ'), '。'], 0, 'D’après la météo, il pleuvra demain.'),
  B([('关于', 'guān yú'), ('这个问题', 'zhè ge wèn tí'), '，', ('我', 'wǒ'), ('想说几句', 'xiǎng shuō jǐ jù'), '。'], 0, 'À propos de cette question, j’aimerais dire quelques mots.'),
  B([('我', 'wǒ'), ('在看', 'zài kàn'), ('一本', 'yì běn'), ('关于', 'guān yú'), ('中国历史', 'Zhōng guó lì shǐ'), ('的', 'de'), ('书', 'shū'), '。'], 3, 'Je lis un livre sur l’histoire de la Chine.'),
  B([('在', 'zài'), ('工作', 'gōng zuò'), ('上', 'shàng'), '，', ('她', 'tā'), ('帮了我', 'bāng le wǒ'), ('很多', 'hěn duō'), '。'], 2, 'Côté travail, elle m’a beaucoup aidé.'),
  B([('我', 'wǒ'), ('看', 'kàn'), ('还是', 'hái shi'), ('明天', 'míng tiān'), ('去', 'qù'), ('吧', 'ba'), '。'], 1, 'Je crois qu’il vaut mieux y aller demain.', reg='oral'),
  B([('这家饭馆', 'zhè jiā fàn guǎn'), ('的', 'de'), ('菜', 'cài'), ('不怎么样', 'bù zěn me yàng'), '。'], 3, 'La cuisine de ce restaurant n’est pas terrible.', reg='oral'),
]
leurres = ['被', '把', '比', '往', '连', '向', '地', '给', '和', '着', '朝', '跟']

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
gabarits = []

# 1. Écran 1 — 在 + personne + 看来，avis
gabarits.append(gab(
  [T('在', 'zài'), S('p'), T('看来', 'kàn lái'), P('，'), S('o'), P('。')],
  'Selon …, ….',
  {'p': liste(('我', 'wǒ', 'moi'), ('他', 'tā', 'lui'), ('她', 'tā', 'elle'), ('我父母', 'wǒ fù mǔ', 'mes parents'),
              ('很多人', 'hěn duō rén', 'beaucoup de gens'), ('我们老师', 'wǒ men lǎo shī', 'notre professeur'), ('我的同事', 'wǒ de tóng shì', 'mon collègue')),
   'o': liste(('钱不是最重要的', 'qián bú shì zuì zhòng yào de', 'l’argent n’est pas le plus important'),
              ('健康比什么都重要', 'jiàn kāng bǐ shén me dōu zhòng yào', 'la santé passe avant tout'),
              ('学汉语没那么难', 'xué Hàn yǔ méi nà me nán', 'apprendre le chinois n’est pas si difficile'),
              ('这个办法不错', 'zhè ge bàn fǎ bú cuò', 'cette solution est bonne'),
              ('周末应该多休息', 'zhōu mò yīng gāi duō xiū xi', 'le week-end, il faut se reposer'),
              ('在家做饭比较健康', 'zài jiā zuò fàn bǐ jiào jiàn kāng', 'cuisiner chez soi, c’est plus sain'),
              ('工作不能太累', 'gōng zuò bù néng tài lèi', 'le travail ne doit pas épuiser'),
              ('坐火车比坐飞机舒服', 'zuò huǒ chē bǐ zuò fēi jī shū fu', 'le train est plus confortable que l’avion'))},
  [], ['p', 'o']))

# 2. Écran 2 — le fait, puis 看来 et la conclusion
gabarits.append(gab(
  [S('f'), P('，'), T('看来', 'kàn lái'), S('c'), P('。')],
  '… : apparemment, ….',
  {'f': col(('他还没回消息', 'tā hái méi huí xiāo xi', 'il n’a pas encore répondu'), ('门关着', 'mén guān zhe', 'la porte est fermée'),
            ('都八点了', 'dōu bā diǎn le', 'il est déjà huit heures'), ('外面的人都打着伞', 'wài miàn de rén dōu dǎ zhe sǎn', 'dehors, tout le monde a un parapluie'),
            ('饭馆门口排着长队', 'fàn guǎn mén kǒu pái zhe cháng duì', 'il y a une longue file devant le restaurant'), ('他一口都没吃', 'tā yì kǒu dōu méi chī', 'il n’en a pas mangé une bouchée'),
            ('票都卖完了', 'piào dōu mài wán le', 'les billets sont tous vendus'), ('她每天都练习', 'tā měi tiān dōu liàn xí', 'elle s’entraîne tous les jours'),
            ('你的脸这么红', 'nǐ de liǎn zhè me hóng', 'tu as le visage tout rouge'), ('路上车这么多', 'lù shang chē zhè me duō', 'il y a tant de voitures sur la route'),
            ('孩子一直在哭', 'hái zi yì zhí zài kū', 'l’enfant n’arrête pas de pleurer'), ('他又迟到了', 'tā yòu chí dào le', 'il est encore en retard')),
   'c': col(('他今天很忙', 'tā jīn tiān hěn máng', 'il est très occupé aujourd’hui'), ('没人在家', 'méi rén zài jiā', 'il n’y a personne'),
            ('他不来了', 'tā bù lái le', 'il ne viendra plus'), ('下雨了', 'xià yǔ le', 'il pleut'),
            ('这家的菜不错', 'zhè jiā de cài bú cuò', 'la cuisine y est bonne'), ('他不喜欢这个菜', 'tā bù xǐ huan zhè ge cài', 'il n’aime pas ce plat'),
            ('我们只能明天去了', 'wǒ men zhǐ néng míng tiān qù le', 'nous ne pourrons y aller que demain'), ('她很想学好中文', 'tā hěn xiǎng xué hǎo Zhōng wén', 'elle tient à bien apprendre le chinois'),
            ('你发烧了', 'nǐ fā shāo le', 'tu as de la fièvre'), ('我们要晚到了', 'wǒ men yào wǎn dào le', 'nous allons arriver en retard'),
            ('他饿了', 'tā è le', 'il a faim'), ('他早上起不来', 'tā zǎo shang qǐ bu lái', 'il n’arrive pas à se lever le matin'))},
  [['f', 'c']], []))

# 3. Écran 3 — sujet + 好像 + impression
gabarits.append(gab(
  [S('x'), P('，'), S('s'), T('好像', 'hǎo xiàng'), S('v'), P('。')],
  '…, on dirait que … ….',
  {'x': liste(('咦', 'yí', 'tiens'), ('你看', 'nǐ kàn', 'regarde')),
   's': col(('他', 'tā', 'il'), ('外面', 'wài miàn', 'dehors'), ('我', 'wǒ', 'je'), ('你', 'nǐ', 'tu'),
            ('这个菜', 'zhè ge cài', 'ce plat'), ('我的手机', 'wǒ de shǒu jī', 'mon téléphone'), ('她', 'tā', 'elle'), ('这条路', 'zhè tiáo lù', 'cette route'),
            ('他们', 'tā men', 'ils'), ('我们', 'wǒ men', 'nous'), ('汤', 'tāng', 'la soupe'), ('你', 'nǐ', 'tu')),
   'v': col(('不太高兴', 'bú tài gāo xìng', 'n’est pas très content'), ('下雨了', 'xià yǔ le', 'il pleut'), ('见过他', 'jiàn guo tā', 'l’ai déjà vu'), ('瘦了', 'shòu le', 'as maigri'),
            ('有点儿咸', 'yǒu diǎnr xián', 'est un peu salé'), ('坏了', 'huài le', 'est en panne'), ('感冒了', 'gǎn mào le', 'est enrhumée'), ('不太对', 'bú tài duì', 'n’est pas la bonne'),
            ('认识', 'rèn shi', 'se connaissent'), ('走错了', 'zǒu cuò le', 'nous sommes trompés de chemin'), ('凉了', 'liáng le', 'a refroidi'), ('说错了', 'shuō cuò le', 't’es trompé'))},
  [['s', 'v']], ['x']))

# 4. Écran 4 — 一定 : la certitude tirée de ce qu’on sait
gabarits.append(gab(
  [S('c'), P('，'), T('一定', 'yí dìng'), S('p'), T('吧', 'ba'), P('。')],
  '…, vous devez … (j’en suis sûr).',
  {'c': col(('你走了一天', 'nǐ zǒu le yì tiān', 'vous avez marché toute la journée'), ('你一个人在国外', 'nǐ yí ge rén zài guó wài', 'vous êtes seul à l’étranger'),
            ('他学了五年中文', 'tā xué le wǔ nián Zhōng wén', 'il apprend le chinois depuis cinq ans'), ('你一天没吃饭', 'nǐ yì tiān méi chī fàn', 'vous n’avez rien mangé de la journée'),
            ('他天天加班', 'tā tiān tiān jiā bān', 'il fait des heures supplémentaires tous les jours'), ('这个菜你做了三个小时', 'zhè ge cài nǐ zuò le sān ge xiǎo shí', 'vous avez passé trois heures sur ce plat'),
            ('你第一次来中国', 'nǐ dì yī cì lái Zhōng guó', 'c’est votre premier séjour en Chine'), ('他昨天睡得很晚', 'tā zuó tiān shuì de hěn wǎn', 'il s’est couché très tard hier'),
            ('你孩子刚出生', 'nǐ hái zi gāng chū shēng', 'votre enfant vient de naître'), ('那儿冬天零下二十度', 'nàr dōng tiān líng xià èr shí dù', 'là-bas, il fait moins vingt en hiver'),
            ('你考了第一名', 'nǐ kǎo le dì yī míng', 'vous êtes arrivé premier à l’examen'), ('她找了一个下午', 'tā zhǎo le yí ge xià wǔ', 'elle a cherché tout l’après-midi')),
   'p': col(('很累', 'hěn lèi', 'être fatigué'), ('很想家', 'hěn xiǎng jiā', 'avoir le mal du pays'),
            ('说得很好', 'shuō de hěn hǎo', 'bien le parler'), ('饿了', 'è le', 'avoir faim'),
            ('很辛苦', 'hěn xīn kǔ', 'être épuisé'), ('很好吃', 'hěn hǎo chī', 'être délicieux'),
            ('很兴奋', 'hěn xīng fèn', 'être tout excité'), ('还没起床', 'hái méi qǐ chuáng', 'ne pas être encore levé'),
            ('很忙', 'hěn máng', 'être très occupé'), ('很冷', 'hěn lěng', 'faire très froid'),
            ('很高兴', 'hěn gāo xìng', 'être content'), ('很着急', 'hěn zháo jí', 'être inquiète'))},
  [['c', 'p']], []))

# 5. Écran 4 — 一定 : la promesse (oral)
gabarits.append(gab(
  [S('r'), P('，'), T('我', 'wǒ'), T('一定', 'yí dìng'), S('a'), P('。')],
  '…, je … sans faute.',
  {'r': liste(('放心', 'fàng xīn', 'ne vous inquiétez pas'), ('你放心吧', 'nǐ fàng xīn ba', 'soyez tranquille'), ('好的', 'hǎo de', 'd’accord')),
   'a': liste(('准时到', 'zhǔn shí dào', 'serai à l’heure'), ('去', 'qù', 'y serai'), ('告诉他', 'gào su tā', 'le lui dirai'),
              ('早点儿回来', 'zǎo diǎnr huí lái', 'rentrerai tôt'), ('记住', 'jì zhù', 'm’en souviendrai'), ('帮你问问', 'bāng nǐ wèn wen', 'me renseignerai pour vous'),
              ('给你打电话', 'gěi nǐ dǎ diàn huà', 'vous appellerai'), ('还给你', 'huán gěi nǐ', 'vous le rendrai'),
              ('不告诉别人', 'bú gào su bié rén', 'ne le dirai à personne'), ('不迟到', 'bù chí dào', 'ne serai pas en retard'))},
  [], ['r', 'a'], reg='oral'))

# 6. Écran 4 — 不一定 : pas forcément
gabarits.append(gab(
  [S('x'), P('，'), S('s'), T('不一定', 'bù yí dìng'), S('p'), P('。')],
  '…, … ne … pas forcément ….',
  {'x': liste(('其实', 'qí shí', 'en fait'), ('说实话', 'shuō shí huà', 'à vrai dire')),
   's': col(('贵的东西', 'guì de dōng xi', 'ce qui est cher'), ('便宜的东西', 'pián yi de dōng xi', 'ce qui est bon marché'),
            ('学过的字', 'xué guo de zì', 'les caractères étudiés'), ('个子高的人', 'gè zi gāo de rén', 'les grands'),
            ('老师说的', 'lǎo shī shuō de', 'ce que dit le professeur'), ('网上说的', 'wǎng shang shuō de', 'ce qu’on lit en ligne'),
            ('大饭馆的菜', 'dà fàn guǎn de cài', 'la cuisine des grands restaurants'), ('看起来很难的事', 'kàn qǐ lái hěn nán de shì', 'ce qui a l’air difficile'),
            ('有钱的人', 'yǒu qián de rén', 'les gens riches'), ('天气预报', 'tiān qì yù bào', 'la météo'),
            ('起得早的人', 'qǐ de zǎo de rén', 'ceux qui se lèvent tôt'), ('学习时间长', 'xué xí shí jiān cháng', 'étudier longtemps')),
   'p': col(('好', 'hǎo', 'être bon'), ('不好', 'bù hǎo', 'être mauvais'),
            ('记得住', 'jì de zhù', 'être retenus'), ('跑得快', 'pǎo de kuài', 'courir vite'),
            ('都对', 'dōu duì', 'être toujours juste'), ('是真的', 'shì zhēn de', 'être vrai'),
            ('比小饭馆好吃', 'bǐ xiǎo fàn guǎn hǎo chī', 'être meilleure que celle des petits'), ('真的很难', 'zhēn de hěn nán', 'être vraiment difficile'),
            ('很快乐', 'hěn kuài lè', 'être heureux'), ('准', 'zhǔn', 'être exacte'),
            ('睡得早', 'shuì de zǎo', 'se coucher tôt'), ('学得好', 'xué de hǎo', 'donner de bons résultats'))},
  [['s', 'p']], ['x']))

# 7. Écran 5 — 是 + jugement + 的
gabarits.append(gab(
  [S('x'), P('，'), S('s'), T('是', 'shì'), S('j'), T('的', 'de'), P('。')],
  '…, … est … (je vous l’assure).',
  {'x': liste(('其实', 'qí shí', 'en fait'), ('说实话', 'shuō shí huà', 'à vrai dire')),
   's': col(('这个问题', 'zhè ge wèn tí', 'ce problème'), ('你的想法', 'nǐ de xiǎng fǎ', 'votre idée'), ('他', 'tā', 'il'), ('这', 'zhè', 'ce'),
            ('学好汉语', 'xué hǎo Hàn yǔ', 'bien apprendre le chinois'), ('他的话', 'tā de huà', 'ce qu’il dit'), ('这样做', 'zhè yàng zuò', 'faire ainsi'), ('你的担心', 'nǐ de dān xīn', 'votre inquiétude'),
            ('她', 'tā', 'elle'), ('这个价格', 'zhè ge jià gé', 'ce prix'), ('多运动', 'duō yùn dòng', 'bouger davantage'), ('他的中文', 'tā de Zhōng wén', 'son chinois')),
   'j': col(('可以解决', 'kě yǐ jiě jué', 'peut se résoudre'), ('好', 'hǎo', 'bonne'), ('会来', 'huì lái', 'viendra'), ('不可能', 'bù kě néng', 'impossible'),
            ('能做到', 'néng zuò dào', 'est à votre portée'), ('对', 'duì', 'juste'), ('不行', 'bù xíng', 'ne marche pas'), ('有道理', 'yǒu dào li', 'fondée'),
            ('不会生气', 'bú huì shēng qì', 'ne se fâchera pas'), ('合理', 'hé lǐ', 'raisonnable'), ('有好处', 'yǒu hǎo chu', 'bon pour vous'), ('没问题', 'méi wèn tí', 'suffit largement'))},
  [['s', 'j']], ['x']))

# 8. Écran 6 — 一般来说 : la règle générale
gabarits.append(gab(
  [T('一般来说', 'yì bān lái shuō'), P('，'), S('c'), P('。')],
  'En général, ….',
  {'c': col(('中国人吃晚饭比较早', 'Zhōng guó rén chī wǎn fàn bǐ jiào zǎo', 'les Chinois dînent assez tôt'),
            ('南方人爱吃米饭', 'nán fāng rén ài chī mǐ fàn', 'les gens du Sud aiment le riz'),
            ('北方人爱吃面', 'běi fāng rén ài chī miàn', 'les gens du Nord aiment les nouilles'),
            ('周末地铁人比较少', 'zhōu mò dì tiě rén bǐ jiào shǎo', 'le week-end, il y a moins de monde dans le métro'),
            ('小饭馆比大饭馆便宜', 'xiǎo fàn guǎn bǐ dà fàn guǎn pián yi', 'les petits restaurants sont moins chers que les grands'),
            ('学一门语言要好几年', 'xué yì mén yǔ yán yào hǎo jǐ nián', 'apprendre une langue prend plusieurs années'),
            ('春节前火车票很难买', 'Chūn jié qián huǒ chē piào hěn nán mǎi', 'avant la fête du Printemps, les billets de train sont durs à trouver'),
            ('孩子比大人学得快', 'hái zi bǐ dà rén xué de kuài', 'les enfants apprennent plus vite que les adultes'),
            ('医院早上人最多', 'yī yuàn zǎo shang rén zuì duō', 'c’est le matin qu’il y a le plus de monde à l’hôpital'),
            ('中国人吃饭用筷子', 'Zhōng guó rén chī fàn yòng kuài zi', 'les Chinois mangent avec des baguettes'),
            ('请客的人付钱', 'qǐng kè de rén fù qián', 'c’est celui qui invite qui paie'),
            ('喝热水对身体好', 'hē rè shuǐ duì shēn tǐ hǎo', 'boire de l’eau chaude est bon pour la santé'))},
  [], ['c']))

# 9. Écran 6 — sujet + 一般 : l’habitude
gabarits.append(gab(
  [S('p'), T('一般', 'yì bān'), S('h'), P('。')],
  'D’habitude, … ….',
  {'p': liste(('我', 'wǒ', 'je'), ('我们', 'wǒ men', 'nous')),
   'h': liste(('七点起床', 'qī diǎn qǐ chuáng', 'se lever à sept heures'), ('坐地铁上班', 'zuò dì tiě shàng bān', 'aller au travail en métro'),
              ('中午在公司吃饭', 'zhōng wǔ zài gōng sī chī fàn', 'déjeuner au bureau'), ('周末在家做饭', 'zhōu mò zài jiā zuò fàn', 'cuisiner à la maison le week-end'),
              ('晚上十一点睡觉', 'wǎn shang shí yī diǎn shuì jiào', 'se coucher à onze heures'), ('不喝咖啡', 'bù hē kā fēi', 'ne pas boire de café'),
              ('早上喝茶', 'zǎo shang hē chá', 'boire du thé le matin'), ('星期六去买菜', 'xīng qī liù qù mǎi cài', 'faire les courses le samedi'),
              ('不在外面吃早饭', 'bú zài wài miàn chī zǎo fàn', 'ne pas prendre le petit déjeuner dehors'), ('晚饭后散步', 'wǎn fàn hòu sàn bù', 'se promener après le dîner'),
              ('一个月去一次电影院', 'yí ge yuè qù yí cì diàn yǐng yuàn', 'aller au cinéma une fois par mois'), ('周末不工作', 'zhōu mò bù gōng zuò', 'ne pas travailler le week-end'))},
  [], ['p', 'h']))

# 10. Écran 6 — 根据 + source
gabarits.append(gab(
  [T('根据', 'gēn jù'), S('s'), P('，'), S('c'), P('。')],
  'D’après …, ….',
  {'s': col(('天气预报', 'tiān qì yù bào', 'la météo'), ('我的经验', 'wǒ de jīng yàn', 'mon expérience'),
            ('学校的规定', 'xué xiào de guī dìng', 'le règlement de l’école'), ('地图', 'dì tú', 'le plan'),
            ('医生的建议', 'yī shēng de jiàn yì', 'les conseils du médecin'), ('这本书', 'zhè běn shū', 'ce livre'),
            ('大家的意见', 'dà jiā de yì jiàn', 'l’avis de tous'), ('最新的消息', 'zuì xīn de xiāo xi', 'les dernières nouvelles'),
            ('菜单上的照片', 'cài dān shang de zhào piàn', 'la photo du menu'), ('他的回答', 'tā de huí dá', 'sa réponse'),
            ('网上的评价', 'wǎng shang de píng jià', 'les avis en ligne'), ('公司的安排', 'gōng sī de ān pái', 'le planning de l’entreprise')),
   'c': col(('明天会下雨', 'míng tiān huì xià yǔ', 'il pleuvra demain'), ('这个方法很有用', 'zhè ge fāng fǎ hěn yǒu yòng', 'cette méthode est très utile'),
            ('上课不能用手机', 'shàng kè bù néng yòng shǒu jī', 'on ne peut pas utiliser son téléphone en cours'), ('前面就是火车站', 'qián miàn jiù shì huǒ chē zhàn', 'la gare est juste devant'),
            ('我每天要多走路', 'wǒ měi tiān yào duō zǒu lù', 'je dois marcher davantage chaque jour'), ('这个城市有两千年的历史', 'zhè ge chéng shì yǒu liǎng qiān nián de lì shǐ', 'cette ville a deux mille ans d’histoire'),
            ('我们改到星期五见面', 'wǒ men gǎi dào xīng qī wǔ jiàn miàn', 'nous nous retrouverons plutôt vendredi'), ('飞机晚到一个小时', 'fēi jī wǎn dào yí ge xiǎo shí', 'l’avion arrivera avec une heure de retard'),
            ('这个菜应该很辣', 'zhè ge cài yīng gāi hěn là', 'ce plat doit être très épicé'), ('他还不知道这件事', 'tā hái bù zhī dào zhè jiàn shì', 'il n’est pas encore au courant'),
            ('这家饭馆还不错', 'zhè jiā fàn guǎn hái bú cuò', 'ce restaurant est plutôt bon'), ('我下个月去上海', 'wǒ xià ge yuè qù Shàng hǎi', 'je vais à Shanghai le mois prochain'))},
  [['s', 'c']], []))

# 11. Écran 7 — 关于 + sujet, en tête
gabarits.append(gab(
  [T('关于', 'guān yú'), S('t'), P('，'), S('r'), P('。')],
  'À propos de …, ….',
  {'t': liste(('这个计划', 'zhè ge jì huà', 'ce projet'), ('下周的会', 'xià zhōu de huì', 'la réunion de la semaine prochaine'), ('学费', 'xué fèi', 'les frais d’inscription'),
              ('这次旅行', 'zhè cì lǚ xíng', 'ce voyage'), ('考试', 'kǎo shì', 'l’examen'), ('这件事', 'zhè jiàn shì', 'cette affaire')),
   'r': liste(('我想问几个问题', 'wǒ xiǎng wèn jǐ ge wèn tí', 'j’ai quelques questions'), ('我还不太清楚', 'wǒ hái bú tài qīng chu', 'je n’en sais pas encore grand-chose'),
              ('你可以问一下老师', 'nǐ kě yǐ wèn yí xià lǎo shī', 'vous pouvez demander au professeur'), ('我们明天再谈吧', 'wǒ men míng tiān zài tán ba', 'reparlons-en demain'),
              ('我想说几句', 'wǒ xiǎng shuō jǐ jù', 'j’aimerais dire quelques mots'))},
  [], ['t', 'r']))

# 12. Écran 7 — un livre, un film… 关于 + sujet + 的
gabarits.append(gab(
  [T('我', 'wǒ'), S('v'), T('关于', 'guān yú'), S('t'), T('的', 'de'), S('n'), P('。')],
  'Je … … sur ….',
  {'v': col(('在看一本', 'zài kàn yì běn', 'lis un'), ('想找一本', 'xiǎng zhǎo yì běn', 'cherche un'), ('看了一部', 'kàn le yí bù', 'ai vu un'),
            ('想看那部', 'xiǎng kàn nà bù', 'veux voir ce'), ('在写一篇', 'zài xiě yì piān', 'écris un'), ('读了一篇', 'dú le yì piān', 'ai lu un'),
            ('听了一个', 'tīng le yí ge', 'ai écouté une'), ('看了一个', 'kàn le yí ge', 'ai regardé une'), ('买了一本', 'mǎi le yì běn', 'ai acheté un'),
            ('借了几本', 'jiè le jǐ běn', 'ai emprunté quelques'), ('找到了一些', 'zhǎo dào le yì xiē', 'ai trouvé des'), ('想借一本', 'xiǎng jiè yì běn', 'voudrais emprunter un')),
   't': liste(('中国历史', 'Zhōng guó lì shǐ', 'l’histoire de la Chine'), ('中国菜', 'Zhōng guó cài', 'la cuisine chinoise'), ('北京', 'Běi jīng', 'Pékin'),
              ('茶', 'chá', 'le thé'), ('熊猫', 'xióng māo', 'les pandas'), ('汉字', 'Hàn zì', 'les caractères')),
   'n': col(('书', 'shū', 'livre'), ('书', 'shū', 'livre'), ('电影', 'diàn yǐng', 'film'),
            ('电影', 'diàn yǐng', 'film'), ('文章', 'wén zhāng', 'article'), ('文章', 'wén zhāng', 'article'),
            ('讲座', 'jiǎng zuò', 'conférence'), ('节目', 'jié mù', 'émission'), ('书', 'shū', 'livre'),
            ('书', 'shū', 'livres'), ('资料', 'zī liào', 'documents'), ('书', 'shū', 'livre'))},
  [['v', 'n']], ['t']))

# 13. Écran 8 — 在 + domaine + 上 / 中
gabarits.append(gab(
  [S('d'), P('，'), S('j'), P('。')],
  '…, ….',
  {'d': col(('在学习上', 'zài xué xí shàng', 'pour les études'), ('在工作上', 'zài gōng zuò shàng', 'côté travail'),
            ('在这个问题上', 'zài zhè ge wèn tí shàng', 'sur cette question'), ('在生活上', 'zài shēng huó shàng', 'dans la vie pratique'),
            ('在生活中', 'zài shēng huó zhōng', 'dans la vie de tous les jours'), ('在这次旅行中', 'zài zhè cì lǚ xíng zhōng', 'pendant ce voyage'),
            ('在时间上', 'zài shí jiān shàng', 'côté horaire'), ('在价格上', 'zài jià gé shàng', 'côté prix'),
            ('在学习中', 'zài xué xí zhōng', 'quand on apprend'), ('在这件事上', 'zài zhè jiàn shì shàng', 'dans cette affaire'),
            ('在这些菜中', 'zài zhè xiē cài zhōng', 'parmi ces plats'), ('在比赛中', 'zài bǐ sài zhōng', 'pendant le match')),
   'j': col(('他很努力', 'tā hěn nǔ lì', 'il travaille dur'), ('她帮了我很多', 'tā bāng le wǒ hěn duō', 'elle m’a beaucoup aidé'),
            ('我们的看法不一样', 'wǒ men de kàn fǎ bù yí yàng', 'nous ne sommes pas du même avis'), ('他们很照顾我', 'tā men hěn zhào gù wǒ', 'ils prennent bien soin de moi'),
            ('我们常常用到数学', 'wǒ men cháng cháng yòng dào shù xué', 'on se sert souvent des maths'), ('我认识了很多朋友', 'wǒ rèn shi le hěn duō péng you', 'je me suis fait beaucoup d’amis'),
            ('我们来得及', 'wǒ men lái de jí', 'nous avons le temps'), ('这家比那家便宜', 'zhè jiā bǐ nà jiā pián yi', 'cette boutique est moins chère que l’autre'),
            ('有问题很正常', 'yǒu wèn tí hěn zhèng cháng', 'c’est normal d’avoir des difficultés'), ('你做得很对', 'nǐ zuò de hěn duì', 'vous avez bien fait'),
            ('我最喜欢这个', 'wǒ zuì xǐ huan zhè ge', 'c’est celui-ci que je préfère'), ('他受伤了', 'tā shòu shāng le', 'il s’est blessé'))},
  [['d', 'j']], []))

# 14. Écran 9 — 不怎么样 (oral)
gabarits.append(gab(
  [S('x'), P('，'), S('t'), T('不怎么样', 'bù zěn me yàng'), P('。')],
  '…, … n’est pas terrible.',
  {'x': liste(('说实话', 'shuō shí huà', 'à vrai dire'), ('其实', 'qí shí', 'en fait')),
   't': liste(('这家饭馆的菜', 'zhè jiā fàn guǎn de cài', 'la cuisine de ce restaurant'), ('那个电影', 'nà ge diàn yǐng', 'ce film'),
              ('这儿的咖啡', 'zhèr de kā fēi', 'le café d’ici'), ('这本小说', 'zhè běn xiǎo shuō', 'ce roman'),
              ('新来的老板', 'xīn lái de lǎo bǎn', 'le nouveau patron'), ('今天的天气', 'jīn tiān de tiān qì', 'le temps aujourd’hui'),
              ('酒店的早饭', 'jiǔ diàn de zǎo fàn', 'le petit déjeuner de l’hôtel'), ('他做的菜', 'tā zuò de cài', 'sa cuisine'))},
  [], ['x', 't'], reg='oral'))

# 15. Écran 9 — 我看 (oral)
gabarits.append(gab(
  [T('我看', 'wǒ kàn'), S('a'), P('。')],
  'Je crois que ….',
  {'a': liste(('还是明天去吧', 'hái shi míng tiān qù ba', 'il vaut mieux y aller demain'), ('他今天不会来了', 'tā jīn tiān bú huì lái le', 'il ne viendra pas aujourd’hui'),
              ('这样就行', 'zhè yàng jiù xíng', 'ça ira comme ça'), ('你有点儿累', 'nǐ yǒu diǎnr lèi', 'tu es un peu fatigué'),
              ('咱们打车吧', 'zán men dǎ chē ba', 'prenons un taxi'), ('菜够了', 'cài gòu le', 'on a assez de plats'),
              ('你还是去医院看看吧', 'nǐ hái shi qù yī yuàn kàn kan ba', 'tu ferais mieux d’aller voir un médecin'), ('没问题', 'méi wèn tí', 'il n’y a pas de problème'))},
  [], ['a'], reg='oral'))

# 16. Écran 9 — la réplique 那是当然的 (oral)
gabarits.append(gab(
  [S('q'), P('？'), P('——'), S('r'), P('！')],
  '… ? — … !',
  {'q': liste(('你会来吗', 'nǐ huì lái ma', 'tu viendras'), ('你还记得我吗', 'nǐ hái jì de wǒ ma', 'tu te souviens de moi'),
              ('你喜欢中国菜吗', 'nǐ xǐ huan Zhōng guó cài ma', 'tu aimes la cuisine chinoise'), ('你会帮我吧', 'nǐ huì bāng wǒ ba', 'tu m’aideras, hein'),
              ('他能通过考试吗', 'tā néng tōng guò kǎo shì ma', 'il va réussir son examen')),
   'r': liste(('那是当然的', 'nà shì dāng rán de', 'ça va de soi'), ('这是肯定的', 'zhè shì kěn dìng de', 'c’est sûr'))},
  [], ['q', 'r'], reg='oral'))

# ---------------------------------------------------------------------
# Transformations (9), 改错 (8), réemplois (4)
# ---------------------------------------------------------------------
def TR(consigne, de, vers, fr, reg=None):
    d = {'consigne': consigne, 'de': EX(*de), 'vers': {'seg': seg(*vers), 'fr': fr}}
    if reg:
        d['reg'] = reg
    return d

transfo = [
  TR('Donnez votre avis avec 在……看来', ('我觉得这个办法不错。', 'wǒ jué de zhè ge bàn fǎ bú cuò', 'Je trouve que cette solution est bonne.'),
     [('在', 'zài'), ('我', 'wǒ'), ('看来', 'kàn lái'), '，', ('这个办法', 'zhè ge bàn fǎ'), ('不错', 'bú cuò'), '。'], 'À mon avis, cette solution est bonne.'),
  TR('Tirez la conclusion avec 看来', ('他还没回消息。我想他今天很忙。', 'tā hái méi huí xiāo xi. wǒ xiǎng tā jīn tiān hěn máng', 'Il n’a pas encore répondu. Je pense qu’il est très occupé aujourd’hui.'),
     [('他', 'tā'), ('还没回消息', 'hái méi huí xiāo xi'), '，', ('看来', 'kàn lái'), ('他', 'tā'), ('今天很忙', 'jīn tiān hěn máng'), '。'], 'Il n’a pas encore répondu : apparemment, il est très occupé aujourd’hui.'),
  TR('Dites l’impression avec 好像', ('我觉得他不太高兴，可是我不知道。', 'wǒ jué de tā bú tài gāo xìng, kě shì wǒ bù zhī dào', 'J’ai l’impression qu’il n’est pas très content, mais je n’en sais rien.'),
     [('他', 'tā'), ('好像', 'hǎo xiàng'), ('不太高兴', 'bú tài gāo xìng'), '。'], 'On dirait qu’il n’est pas très content.'),
  TR('Répondez en une phrase avec 不一定', ('贵的东西都好吗？不是。', 'guì de dōng xi dōu hǎo ma? bú shì', 'Ce qui est cher est-il toujours bon ? Non.'),
     [('贵的', 'guì de'), ('东西', 'dōng xi'), ('不一定', 'bù yí dìng'), ('好', 'hǎo'), '。'], 'Ce qui est cher n’est pas forcément bon.'),
  TR('Affirmez-le avec assurance, avec 是……的', ('这个问题可以解决。', 'zhè ge wèn tí kě yǐ jiě jué', 'Ce problème peut se résoudre.'),
     [('这个问题', 'zhè ge wèn tí'), ('是', 'shì'), ('可以', 'kě yǐ'), ('解决', 'jiě jué'), ('的', 'de'), '。'], 'Ce problème peut tout à fait se résoudre.'),
  TR('Citez la source en tête, avec 根据', ('天气预报说明天会下雨。', 'tiān qì yù bào shuō míng tiān huì xià yǔ', 'La météo dit qu’il pleuvra demain.'),
     [('根据', 'gēn jù'), ('天气预报', 'tiān qì yù bào'), '，', ('明天', 'míng tiān'), ('会下雨', 'huì xià yǔ'), '。'], 'D’après la météo, il pleuvra demain.'),
  TR('Annoncez le sujet avec 关于', ('这个问题，我想说几句。', 'zhè ge wèn tí, wǒ xiǎng shuō jǐ jù', 'Cette question, j’aimerais en dire quelques mots.'),
     [('关于', 'guān yú'), ('这个问题', 'zhè ge wèn tí'), '，', ('我', 'wǒ'), ('想说几句', 'xiǎng shuō jǐ jù'), '。'], 'À propos de cette question, j’aimerais dire quelques mots.'),
  TR('Placez le domaine en tête, avec 在……上', ('他学习很努力。', 'tā xué xí hěn nǔ lì', 'Il étudie avec beaucoup d’application.'),
     [('在', 'zài'), ('学习', 'xué xí'), ('上', 'shàng'), '，', ('他', 'tā'), ('很努力', 'hěn nǔ lì'), '。'], 'Pour les études, il travaille dur.'),
  TR('Dites-le comme à l’oral, avec 不怎么样', ('这家饭馆的菜不太好。', 'zhè jiā fàn guǎn de cài bú tài hǎo', 'La cuisine de ce restaurant n’est pas très bonne.'),
     [('这家饭馆', 'zhè jiā fàn guǎn'), ('的', 'de'), ('菜', 'cài'), ('不怎么样', 'bù zěn me yàng'), '。'], 'La cuisine de ce restaurant n’est pas terrible.', reg='oral'),
]

def FX(toks, bad, bon, why):
    s = seg(*toks)
    assert s[bad]['p']
    return {'seg': s, 'bad': bad, 'bon': bon, 'why': why}

fixes = [
  FX([('根据', 'gēn jù'), ('我', 'wǒ'), '，', ('这个办法', 'zhè ge bàn fǎ'), ('不好', 'bù hǎo'), '。'], 0, '在我看来，这个办法不好。',
     '根据 demande une source ; pour un avis, c’est 在……看来.'),
  FX([('我', 'wǒ'), ('关于', 'guān yú'), ('历史', 'lì shǐ'), ('很感兴趣', 'hěn gǎn xìng qù'), '。'], 1, '我对历史很感兴趣。',
     'L’intérêt pour quelque chose passe par 对 ; 关于 annonce seulement un sujet.'),
  FX([('这', 'zhè'), ('不是', 'bú shì'), ('可能', 'kě néng'), ('的', 'de'), '。'], 1, '这是不可能的。',
     'La négation se met entre 是 et 的 : 是不可能的.'),
  FX([('外面', 'wài miàn'), ('下雨', 'xià yǔ'), ('好像', 'hǎo xiàng'), ('了', 'le'), '。'], 2, '外面好像下雨了。',
     '好像 se place après le sujet, devant le verbe.'),
  FX([('在', 'zài'), ('学习', 'xué xí'), ('里', 'lǐ'), '，', ('他', 'tā'), ('很努力', 'hěn nǔ lì'), '。'], 2, '在学习上，他很努力。',
     'Un domaine se dit avec 在……上 : 在学习上.'),
  FX([('我们', 'wǒ men'), ('谈谈', 'tán tan'), ('关于', 'guān yú'), ('这个问题', 'zhè ge wèn tí'), '。'], 2, '我们谈谈这个问题。',
     'Derrière le verbe, 关于 demande 的 et un nom ; sinon, on s’en passe.'),
  FX([('他', 'tā'), ('得', 'děi'), ('很累', 'hěn lèi'), ('吧', 'ba'), '。'], 1, '他一定很累吧。',
     '得 dit une obligation ; la certitude se dit avec 一定.'),
  FX([('这个电影', 'zhè ge diàn yǐng'), ('不怎么', 'bù zěn me'), '。'], 1, '这个电影不怎么样。',
     '不怎么 attend un adjectif ; seul, on dit 不怎么样.'),
]

reemploi = [
  {'q': 'Un ami hésite entre le métro et le taxi pour aller à la gare. Donnez votre avis avec 在我看来, puis une raison.',
   'verif': [{'type': 'contient', 'v': '在我看来', 'msg': 'L’avis s’annonce avec 在我看来, en tête.'},
             {'type': 'absent', 'v': '根据我', 'msg': '根据 demande une source, pas une personne.'}],
   'modeles': [EX('在我看来，坐地铁比较好，又快又便宜。', 'zài wǒ kàn lái, zuò dì tiě bǐ jiào hǎo, yòu kuài yòu pián yi', 'À mon avis, le métro, c’est mieux : rapide et pas cher.'),
               EX('在我看来，打车比较方便，地铁人太多了。', 'zài wǒ kàn lái, dǎ chē bǐ jiào fāng biàn, dì tiě rén tài duō le', 'À mon avis, le taxi est plus pratique : il y a trop de monde dans le métro.')],
   'criteres': ['在我看来 en tête, suivi d’une virgule', 'Un avis, puis une raison', 'Pas de 根据我']},
  {'q': 'Vous arrivez au restaurant : la porte est fermée et il n’y a personne. Dites ce que vous voyez, puis ce que vous en concluez.',
   'verif': [{'type': 'contient', 'v': '看来', 'msg': 'La conclusion se tire avec 看来.'}],
   'modeles': [EX('门关着，看来今天不开门。', 'mén guān zhe, kàn lái jīn tiān bù kāi mén', 'La porte est fermée : apparemment, ils n’ouvrent pas aujourd’hui.'),
               EX('里面没有人，看来我们只能去别的地方吃了。', 'lǐ miàn méi yǒu rén, kàn lái wǒ men zhǐ néng qù bié de dì fang chī le', 'Il n’y a personne : visiblement, il va falloir manger ailleurs.')],
   'criteres': ['D’abord le fait', 'Puis 看来 et la conclusion', 'Souvent 了 pour un changement de plan']},
  {'q': 'Un ami vous demande si un téléphone très cher est forcément le meilleur. Répondez avec 不一定, puis appuyez-vous sur une source avec 根据.',
   'verif': [{'type': 'contient', 'v': '不一定', 'msg': '« Pas forcément » : 不一定.'},
             {'type': 'contient', 'v': '根据', 'msg': 'La source s’introduit avec 根据.'}],
   'modeles': [EX('贵的不一定好。根据网上的评价，这个手机不怎么样。', 'guì de bù yí dìng hǎo. gēn jù wǎng shang de píng jià, zhè ge shǒu jī bù zěn me yàng', 'Ce qui est cher n’est pas forcément bon. D’après les avis en ligne, ce téléphone n’est pas terrible.'),
               EX('不一定。根据我的经验，便宜的也很好用。', 'bù yí dìng. gēn jù wǒ de jīng yàn, pián yi de yě hěn hǎo yòng', 'Pas forcément. D’après mon expérience, les moins chers marchent très bien aussi.')],
   'criteres': ['不一定 : pas forcément', '根据 + une source, jamais une personne seule', 'La source en tête, puis une virgule']},
  {'q': 'Une amie vous demande ce que vous pensez du nouveau restaurant du quartier. Il vous a déçu. Répondez comme à l’oral.',
   'verif': [{'type': 'contient', 'v': '不怎么样', 'msg': '« Pas terrible » : 不怎么样.'}],
   'modeles': [EX('说实话，菜不怎么样。我看还是去以前那家吧。', 'shuō shí huà, cài bù zěn me yàng. wǒ kàn hái shi qù yǐ qián nà jiā ba', 'À vrai dire, la cuisine n’est pas terrible. Je crois qu’il vaut mieux retourner à l’ancien.', reg='oral'),
               EX('不怎么样，又贵又不好吃。', 'bù zěn me yàng, yòu guì yòu bù hǎo chī', 'Pas terrible : c’est cher, et ce n’est pas bon.', reg='oral')],
   'criteres': ['不怎么样 seul, sans 很', 'Une raison ensuite', '我看 pour proposer autre chose'],
   'reg': 'oral'},
]

fiche = {
  'id': 'g333', 'hsk': 3, 'fam': 'phrase', 'th': ['avis', 'nourriture'],
  'title': 'Donner son avis : 在我看来, 看来, 好像, 一定, 根据, 关于',
  'resume': 'Les petits mots qui accompagnent un avis : le point de vue (在我看来, 我看), la conclusion (看来), l’impression (好像), la certitude et la promesse (一定, 不一定), l’affirmation calme (是可以的), la règle et la source (一般来说, 根据), le sujet et le domaine (关于, 在学习上), et le « pas terrible » de la conversation (不怎么样).',
  'hsk3': [],
  'equiv': [],
  'steps': steps, 'tableau': tableau, 'piege': piege,
  'voir': ['g301', 'g309', 'g319', 'g328'],
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
    print('g333 — %d écrans, %d gabarits, %d phrases engendrées' % (len(steps), len(gabarits), tot))
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
