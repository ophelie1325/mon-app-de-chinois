# -*- coding: utf-8 -*-
"""gram_lib.py — fabrication d’une fiche de grammaire de Coach Chinois.

Le contenu se construit en Python ; le JavaScript est émis par fiche_js(),
jamais écrit à la main. Chaque constructeur vérifie ce qu’il reçoit :
pinyin (port fidèle de pinyinCheck de core.js), blocs de douze rangées,
couverture lie/libre, typographie française.

Fonctions : T, P, S, seg, hz, py, phrase (alias EX), liste, col, gab,
tirages, combos, ecran, poser, controles, val_js, jeton_js, fiche_js,
pinyin_check, lectures (contrôle complémentaire des tons par pypinyin).
"""
import itertools, json, random, re, unicodedata, os, shutil

# ---------------------------------------------------------------------
# Port fidèle de pinyinCheck (core.js), sans le « doute » de PYDICT.
# ---------------------------------------------------------------------
_SYL = set((
 'a ai an ang ao e ê ei en eng er o ou '
 'yi ya yao ye you yan yin yang ying yong wu wa wo wai wei wan wen wang weng yu yue yuan yun '
 'ba bo bai bei bao ban ben bang beng bi bie biao bian bin bing bu '
 'pa po pai pei pao pou pan pen pang peng pi pie piao pian pin ping pu '
 'ma mo me mai mei mao mou man men mang meng mi mie miao miu mian min ming mu '
 'fa fo fei fou fan fen fang feng fu '
 'da de dai dei dao dou dan dang deng dong di dia die diao diu dian ding du duo dui duan dun '
 'ta te tai tei tao tou tan tang teng tong ti tie tiao tian ting tu tuo tui tuan tun '
 'na ne nai nei nao nou nan nen nang neng nong ni nie niao niu nian nin niang ning nu nuo nuan nü nüe '
 'la le lo lai lei lao lou lan lang leng long li lia lie liao liu lian lin liang ling lu luo luan lun lü lüe '
 'ga ge gai gei gao gou gan gen gang geng gong gu gua guo guai gui guan gun guang '
 'ka ke kai kei kao kou kan ken kang keng kong ku kua kuo kuai kui kuan kun kuang '
 'ha he hai hei hao hou han hen hang heng hong hu hua huo huai hui huan hun huang '
 'ji jia jie jiao jiu jian jin jiang jing jiong ju jue juan jun '
 'qi qia qie qiao qiu qian qin qiang qing qiong qu que quan qun '
 'xi xia xie xiao xiu xian xin xiang xing xiong xu xue xuan xun '
 'zha zhe zhi zhai zhei zhao zhou zhan zhen zhang zheng zhong zhu zhua zhuo zhuai zhui zhuan zhun zhuang '
 'cha che chi chai chao chou chan chen chang cheng chong chu chua chuo chuai chui chuan chun chuang '
 'sha she shi shai shei shao shou shan shen shang sheng shu shua shuo shuai shui shuan shun shuang '
 're ri rao rou ran ren rang reng rong ru rua ruo rui ruan run '
 'za ze zi zai zei zao zou zan zen zang zeng zong zu zuo zui zuan zun '
 'ca ce ci cai cao cou can cen cang ceng cong cu cuo cui cuan cun '
 'sa se si sai sao sou san sen sang seng song su suo sui suan sun '
 'ng hm hng m n yo').split(' '))
_TONES = {'āēīōūǖ': 1, 'áéíóúǘ': 2, 'ǎěǐǒǔǚ': 3, 'àèìòùǜ': 4}
_VOW = {'a': 'aāáǎà', 'e': 'eēéěè', 'i': 'iīíǐì', 'o': 'oōóǒò', 'u': 'uūúǔù', 'ü': 'üǖǘǚǜ'}
_HAN = re.compile('[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]')
_PONCT = re.compile(r"[\s,，.。、·？?！!;；:：\"“”‘’'`()（）《》「」…—–\-]+")

def tone_of(s):
    for c in s.lower():
        for k, v in _TONES.items():
            if c in k:
                return v
    return 0

def strip_tone(sy):
    r = ''
    for c in sy:
        hit = False
        for k, v in _VOW.items():
            i = v.find(c)
            if i >= 0:
                r += k.upper() if (c == c.upper() and c != k) else k
                hit = True
                break
        if not hit:
            r += c
    return r

def set_tone(sy, n):
    base = strip_tone(sy); low = base.lower()
    if n == 0:
        return base
    if 'a' in low: pos = low.index('a')
    elif 'e' in low: pos = low.index('e')
    elif 'ou' in low: pos = low.index('o')
    else:
        pos = -1
        for i in range(len(low) - 1, -1, -1):
            if low[i] in 'aeiouü':
                pos = i; break
    if pos < 0:
        return base
    return base[:pos] + _VOW[low[pos]][n] + base[pos + 1:]

def han_chars(s):
    return [c for c in (s or '') if _HAN.match(c)]

def py_syls(p):
    return [t.strip() for t in _PONCT.split(p or '') if t.strip()]

def py_bare(s):
    return strip_tone((s or '').lower()).replace('v', 'ü')

def pinyin_check(hz, p):
    """Renvoie (ok, raison, paires[(caractère, syllabe)])."""
    han, toks = han_chars(hz), py_syls(p)
    if not han:
        return True, '', []
    if not toks:
        return False, 'Pinyin absent.', []
    syls = []
    for t in toks:
        if re.match(r"^[A-Za-zÀ-ÿ'’-]+$", t) and py_bare(t) not in _SYL and t.lower() in (hz or '').lower():
            continue
        nu0 = re.sub('[\u0300-\u036f]', '', unicodedata.normalize('NFD', t)).lower()
        if re.match(r'^(ng|hm|hng|m|n|ê)$', nu0):
            syls.append((t, nu0, 0, False)); continue
        n = py_bare(t); er = False; val = n in _SYL
        if not val and len(n) > 2 and n[-1] == 'r' and n[:-1] in _SYL:
            val = er = True
        if not val:
            return False, 'Syllabe impossible en pinyin : ' + t, []
        ton = tone_of(t); nu = n[:-1] if er else n
        attendu = set_tone(nu, ton) + ('r' if er else '')
        if t.lower().replace('v', 'ü') != attendu:
            return False, 'Marque de ton mal placée : %s — attendu %s' % (t, attendu), []
        syls.append((t, nu, ton, er))
    paires = []; i = 0
    for s in syls:
        if i >= len(han):
            break
        paires.append((han[i], s[0]))
        i += 2 if (s[3] and i + 1 < len(han) and han[i + 1] == '儿') else 1
    if i != len(han) or len(paires) != len(syls):
        return False, '%d caractères pour %d syllabes' % (len(han), len(syls)), []
    return True, '', paires

def assert_py(hz, p, ou=''):
    ok, why, _ = pinyin_check(hz, p)
    assert ok, 'Pinyin refusé (%s) : %s / %s → %s' % (ou, hz, p, why)

# ---------------------------------------------------------------------
# Contrôle complémentaire des lectures (tons), par pypinyin.
# Non bloquant : il imprime les écarts, qu’il faut relire un par un.
# ---------------------------------------------------------------------
_LECTURES = []
def lectures(hz, p, ou=''):
    _LECTURES.append((hz, p, ou))

def rapport_lectures(exceptions=()):
    from pypinyin import pinyin as _pp, Style
    vus = set(); ecarts = []
    for hz, p, ou in _LECTURES:
        if (hz, p) in vus:
            continue
        vus.add((hz, p))
        ok, _, paires = pinyin_check(hz, p)
        if not ok:
            continue
        ref = [x[0] for x in _pp(''.join(han_chars(hz)), style=Style.TONE, heteronym=False)]
        # Les syllabes erhua soudées couvrent deux caractères.
        k = 0; refs = []
        hc = han_chars(hz)
        for c, s in paires:
            refs.append((c, s, ref[k] if k < len(ref) else ''))
            k += 2 if (s.endswith('r') and py_bare(s)[:-1] in _SYL and k + 1 < len(hc) and hc[k + 1] == '儿') else 1
        for c, s, r in refs:
            a, b = s.lower(), r.lower()
            if a == b or (c, a) in exceptions:
                continue
            if a.endswith('r') and a[:-1] == b:
                continue  # erhua soudé : diǎnr pour 点儿
            if py_bare(a).rstrip('r') == py_bare(b) and tone_of(a) == 0:
                continue  # ton neutre noté, lecture de base identique
            if c in '一不' and py_bare(a) == py_bare(b):
                continue  # sandhi de 一 et de 不, contrôlé à part
            ecarts.append(((c, s, r), hz))
    groupes = {}
    for k, h in ecarts:
        groupes.setdefault(k, []).append(h)
    return ['%s %s (pypinyin %s) ×%d, ex. %s' % (k[0], k[1], k[2], len(v), min(v, key=len)) for k, v in sorted(groupes.items())]

def sandhi(hz, p, ou=''):
    """Sandhi de 一 et de 不 dans une chaîne : 不 → bú devant un 4ᵉ ton,
    bù ailleurs (atone bu dans V不V et V不C) ; 一 → yí devant un 4ᵉ ton ou
    un atone issu d’un 4ᵉ (个), yì devant 1ᵉʳ/2ᵉ/3ᵉ, yī quand il compte."""
    ok, _, paires = pinyin_check(hz, p)
    if not ok:
        return []
    msgs = []
    for i, (c, s) in enumerate(paires):
        if c not in '一不' or i + 1 >= len(paires):
            continue
        nc, ns = paires[i + 1]
        t, tn = tone_of(s), tone_of(ns)
        if c == '不':
            if t == 0:
                continue
            att = 2 if tn == 4 else 4
            if t != att:
                msgs.append('%s : 不 %s devant %s%s' % (hz, s, nc, ns))
        else:
            if t == 0:
                continue  # 一 atone dans V一V
            if t == 1:
                prec = paires[i - 1][0] if i else ''
                if not (prec and prec in '第十') and nc not in '月号':
                    msgs.append('%s : 一 yī devant %s — compté ou numéroté ? à relire' % (hz, nc))
                continue
            att = 2 if (tn == 4 or nc in '个') else 4
            if t != att:
                msgs.append('%s : 一 %s devant %s%s' % (hz, s, nc, ns))
    return msgs

# ---------------------------------------------------------------------
# Jetons, phrases, listes
# ---------------------------------------------------------------------
class _Ponct(dict):
    """Jeton de ponctuation : émis P('，')."""
    pass

def P(h):
    assert not _HAN.search(h), 'Un jeton chinois ne passe jamais par P() : ' + h
    d = _Ponct(); d['h'] = h; d['p'] = ''
    return d

def T(h, p, fr=None, reg=None):
    """Jeton ou élément de liste."""
    assert _HAN.search(h), 'Jeton sans caractère chinois : utilisez P() : ' + h
    assert_py(h, p, 'jeton')
    lectures(h, p, 'jeton')
    d = {'h': h, 'p': p}
    if fr is not None:
        d['fr'] = fr
    if reg:
        d['reg'] = reg
    return d

def S(nom):
    return {'s': nom}

def seg(*toks):
    out = []
    for t in toks:
        if isinstance(t, dict):
            out.append(t)
        elif isinstance(t, str) and not _HAN.search(t):
            out.append(P(t))
        else:
            h, p = t
            out.append(T(h, p))
    s = out
    assert_py(hz(s), py(s), 'seg')
    lectures(hz(s), py(s), 'seg')
    return s

def hz(s):
    return ''.join(t['h'] for t in s)

def py(s):
    return ' '.join(t['p'] for t in s if t['p'])

def phrase(h, p, fr, note=None, reg=None):
    assert_py(h, p, 'exemple')
    lectures(h, p, 'exemple')
    d = {'hz': h, 'py': p, 'fr': fr}
    if note:
        d['note'] = note
    if reg:
        d['reg'] = reg
    return d
EX = phrase

def liste(*items):
    """items : (h, p, fr) ou (h, p, fr, reg)."""
    return [T(*it) for it in items]

def col(*items):
    l = liste(*items)
    assert len(l) == 12, 'Bloc apparié : %d rangées au lieu de 12' % len(l)
    return l

# ---------------------------------------------------------------------
# Gabarits
# ---------------------------------------------------------------------
def gab(cadre, fr, listes, lie, libre, reg=None):
    cles = list(listes.keys())
    fentes = [t['s'] for t in cadre if 's' in t]
    assert set(fentes) == set(cles), 'Fentes %s ≠ listes %s' % (fentes, cles)
    dl = [k for g in lie for k in g]
    tous = dl + list(libre)
    assert len(tous) == len(set(tous)), 'Liste déclarée deux fois'
    assert sorted(tous) == sorted(cles), 'lie ∪ libre ≠ listes : %s / %s' % (tous, cles)
    for g in lie:
        lg = [len(listes[k]) for k in g]
        assert len(set(lg)) == 1, 'Groupe lié de longueurs inégales : %s' % lg
        if len(g) > 1:
            assert lg[0] == 12, 'Bloc apparié de %d rangées' % lg[0]
    d = {'cadre': cadre, 'fr': fr, 'lie': [list(g) for g in lie], 'libre': list(libre), 'listes': listes}
    if reg:
        d['reg'] = reg
    for s in tirages(d, None):
        assert_py(hz(s), py(s), 'tirage')
        lectures(hz(s), py(s), 'tirage')
    return d

def tirages(g, n=4, graine=None):
    """Toutes les phrases (n=None) ou n phrases au hasard."""
    groupes = [list(x) for x in g['lie']]
    dans = {k for x in groupes for k in x}
    groupes += [[k] for k in g['listes'] if k not in dans]
    axes = [range(min(len(g['listes'][k]) for k in grp)) for grp in groupes]
    tout = []
    for idx in itertools.product(*axes):
        acc = {}
        for grp, i in zip(groupes, idx):
            for k in grp:
                acc[k] = g['listes'][k][i]
        tout.append([acc[t['s']] if 's' in t else t for t in g['cadre']])
    if n is None:
        return tout
    rnd = random.Random(graine)
    return rnd.sample(tout, min(n, len(tout)))

def combos(g):
    return len(tirages(g, None))

def ecran(t, p, ex, check, reg=None):
    d = {'t': t}
    if reg:
        d['reg'] = reg
    d['p'] = p; d['ex'] = ex; d['check'] = check
    return d

# ---------------------------------------------------------------------
# Typographie française
# ---------------------------------------------------------------------
def _textes_fr(o, chemin=''):
    """Parcourt une fiche et rend les chaînes françaises (hors pinyin et chinois pur)."""
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('p', 'py', 'h', 'hz', 'bon', 'id', 'fam', 's', 'type') and isinstance(v, str):
                continue
            if k == 'v':
                continue
            yield from _textes_fr(v, chemin + '.' + str(k))
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from _textes_fr(v, chemin + '[%d]' % i)
    elif isinstance(o, str):
        if re.search('[A-Za-zÀ-ÿ]', re.sub('<[^>]+>', '', o)):
            yield chemin, o

def controles(fiche):
    erreurs = []
    for ch, s in _textes_fr(fiche):
        t = re.sub('<[^>]+>', '', s)
        if re.search(r"[A-Za-zÀ-ÿ]'", t) or "'" in t:
            erreurs.append('apostrophe droite %s : %s' % (ch, t))
        if '  ' in t:
            erreurs.append('double espace %s : %s' % (ch, t))
        if re.search(r' [,.]', t):
            erreurs.append('espace avant , ou . %s : %s' % (ch, t))
        if re.search(r'[A-Za-zÀ-ÿ0-9»)][?!:;]', t):
            erreurs.append('espace manquante avant ? ! : ; %s : %s' % (ch, t))
        if t != t.strip():
            erreurs.append('espace en bord %s : %s' % (ch, t))
        if re.search(r'«[^ ]|[^ ]»', t):
            erreurs.append('guillemets sans espace %s : %s' % (ch, t))
        if re.search(r'\boe|\bOe', t) and not re.search('oe[ui]', t):
            pass
    return erreurs

# ---------------------------------------------------------------------
# Émission JavaScript (style compact à guillemets simples)
# ---------------------------------------------------------------------
_CLE = re.compile(r'^[A-Za-z_$][A-Za-z0-9_$]*$')

def _str_js(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n') + "'"

def jeton_js(t):
    if isinstance(t, _Ponct):
        return 'P(%s)' % _str_js(t['h'])
    return val_js(t)

def val_js(v):
    if isinstance(v, _Ponct):
        return jeton_js(v)
    if isinstance(v, dict):
        return '{' + ','.join((k if _CLE.match(k) else _str_js(k)) + ':' + val_js(x) for k, x in v.items()) + '}'
    if isinstance(v, (list, tuple)):
        return '[' + ','.join(val_js(x) for x in v) + ']'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, str):
        return _str_js(v)
    if v is None:
        return 'null'
    raise TypeError(type(v))

ORDRE = ['title', 'resume', 'hsk3', 'equiv', 'steps', 'tableau', 'piege', 'voir',
         'banque', 'leurres', 'gabarits', 'transfo', 'fixes', 'reemploi']

def fiche_js(f):
    """Seize lignes : l’accolade, id/hsk/fam/th, puis une clé par ligne (hsk3 vide si absent)."""
    lignes = ["  id:%s, hsk:%d, fam:%s, th:%s," % (_str_js(f['id']), f['hsk'], _str_js(f['fam']), val_js(f['th']))]
    for k in ORDRE:
        v = f.get(k, [] if k == 'hsk3' else None)
        assert v is not None, 'Clé absente : ' + k
        lignes.append('  %s:%s,' % (k, val_js(v)))
    lignes[-1] = lignes[-1].rstrip(',')
    assert len(lignes) == 15
    return '{\n' + '\n'.join(lignes) + '\n}'   # seize lignes avec l’accolade ouvrante

SEPARATEUR = '\n}' + ',\n\n/* ------------------------------------------------------------------ */\n'
ANCRE = '\n}' + '\n\n];\n\n/* Publication explicite'

def poser(f, chemin):
    """Insère la fiche en fin de tableau GRAMMAR, par substitution gardée.
    Sauvegarde avant, écriture en fin de fonction seulement."""
    src = open(chemin, encoding='utf-8').read()
    assert src.count(ANCRE) == 1, 'Ancre de fin de tableau introuvable ou multiple'
    assert ("id:'%s'" % f['id']) not in src and ('"id":"%s"' % f['id']) not in src, 'Fiche déjà présente'
    shutil.copy(chemin, chemin + '.sauvegarde')
    nouveau = src.replace(ANCRE, SEPARATEUR + fiche_js(f) + '\n\n];\n\n/* Publication explicite', 1)
    assert nouveau.count("id:'%s'" % f['id']) == 1
    assert len(nouveau) > len(src)
    open(chemin, 'w', encoding='utf-8').write(nouveau)
    return len(nouveau) - len(src)
