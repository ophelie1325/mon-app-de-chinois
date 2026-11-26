#!/usr/bin/env python3
"""Ajout de caractères nouveaux dans CHARS (data-words.js).

Règle d’Ophélie (16 novembre 2026) : tout caractère nouveau (fiche de
grammaire, leçon, mot gardé) entre dans CHARS avec clé, type, composants,
traits et structure. Ce script calcule tout ce qui se calcule ; il ne
devine jamais un sens ni une lecture.

Usage
  python3 outils/chars.py 王 新 …        # montre les fiches calculées
  python3 outils/chars.py --poser 王 …   # les ajoute à la fin de CHARS

Lecture (py), sens (fr), niveau (hsk) et thèmes (th) viennent du mot de
WORDS qui contient le caractère (lecture la plus fréquente) ou de
outils/chars-gloses.json, à compléter à la main : le script s’arrête et
dit ce qui manque. Quand la notice Wiktionary présente plusieurs lectures
de la forme, il le signale : on les rédige toutes dans « explic »
(liste de {type, fr, src}, la première étant celle que retient la notice).
Mêmes règles pour les sens des clés et des composants
de sens (glossaire tiré de CHARS, complété dans le même fichier).

Sources (téléchargées dans /tmp/chars-src au premier lancement)
  - makemeahanzi (skishore) : clé (radical), décomposition, traits.
  - Wiktionary, via kaikki.org : type (象形, 指事, 會意, 形聲), composants.
  - mapull/chinese-dictionary : structure (通用规范汉字表), lecture des
    composants de son.
Règles de type : Wiktionary fait foi si la première ligne de sa notice
est nette ; sinon makemeahanzi (pictographic → picto, ideographic →
ideo, pictophonetic → phono) ; sinon pas de type. Un phono n’est gardé
que si l’élément de son se voit dans la forme simplifiée.
"""
import json, os, re, sys, time, urllib.parse, urllib.request
from collections import Counter

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(ICI)
DW = os.path.join(DEPOT, 'data-words.js')
GLOSES = os.path.join(ICI, 'chars-gloses.json')
CACHE = '/tmp/chars-src'
URLS = {
    'dictionary.txt': 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt',
    'graphics.txt': 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/graphics.txt',
    'char_base.json': 'https://raw.githubusercontent.com/mapull/chinese-dictionary/main/character/char_base.json',
}
UA = {'User-Agent': 'CoachChinois/1.0'}


def charge(nom):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, nom)
    if not os.path.exists(p):
        req = urllib.request.Request(URLS[nom], headers=UA)
        open(p, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
    return open(p, encoding='utf8').read()


def sources():
    MD = {}
    for l in charge('dictionary.txt').splitlines():
        d = json.loads(l); MD[d['character']] = d
    TR = {}
    for l in charge('graphics.txt').splitlines():
        d = json.loads(l); TR[d['character']] = len(d['strokes'])
    B = {}
    for m in re.finditer(r'\{[^{}]*\}', charge('char_base.json')):
        d = json.loads(m.group(0)); B[d['char']] = d
    return MD, TR, B


def etymologie(ch):
    """Première ligne de la première notice Wiktionary (kaikki.org)."""
    q = urllib.parse.quote(ch)
    u = 'https://kaikki.org/dictionary/Chinese/meaning/%s/%s/%s.html' % (q, q, q)
    for essai in range(3):
        try:
            import html
            t = html.unescape(urllib.request.urlopen(
                urllib.request.Request(u, headers=UA), timeout=30).read().decode())
            m = re.search(r'"etymology_text": ("(?:[^"\\]|\\.)*")', t)
            return json.loads(m.group(1)) if m else ''
        except Exception:
            time.sleep(3)
    return ''


LABRE = re.compile(r'^\s*(ideogrammic compound|compound ideogram|phono-semantic compound|pictogram|ideogram)\b', re.I)
LAB = {'pictogram': 'picto', 'ideogram': 'indic', 'ideogrammic compound': 'ideo',
       'compound ideogram': 'ideo', 'phono-semantic compound': 'phono'}
MMH = {'pictographic': 'picto', 'ideographic': 'ideo', 'pictophonetic': 'phono'}
VAR = {'水': '氵', '竹': '⺮', '𥫗': '⺮', '阜': '阝', '邑': '阝', '人': '亻', '心': '忄',
       '手': '扌', '言': '讠', '金': '钅', '糸': '纟', '食': '饣', '艸': '艹', '辵': '辶',
       '刀': '刂', '火': '灬', '衣': '衤', '示': '礻', '犬': '犭', '戶': '户', '訁': '讠'}
# Notice qui présente plusieurs lectures de la forme (règle d’Ophélie, 16 novembre 2026 :
# on les met toutes, chacune avec sa source).
PLUS = re.compile(r'possible interpretation|[Aa]lternatively|[Aa]nother (interpretation|theory|view)|[Tt]heories include|[Mm]ultiple theories|Shuowen (interprets|erroneously|mistakenly|incorrectly)|[Ff]olk etymology|traditional (interpretation|view|explanation)')
STRUCT = {'D': 'seul', 'A': 'hb', 'B': 'hb', 'E': 'hmb', 'H': 'gd', 'M': 'ghd', 'Q': 'env',
          'R1': 'env3', 'R5': 'env3', 'R6': 'env3', 'R2': 'env2', 'R3': 'env2', 'R4': 'env2'}
IDC = set('⿰⿱⿲⿳⿴⿵⿶⿷⿸⿹⿺⿻？')

TON = {}
for v, row in zip('aeiouü', ['āáǎà', 'ēéěè', 'īíǐì', 'ōóǒò', 'ūúǔù', 'ǖǘǚǜ']):
    for i, c in enumerate(row): TON[c] = (v, i + 1)
INI = ['zh', 'ch', 'sh', 'b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's']


def syl(p):
    p = p.strip().split()[0].lower(); t = 5; b = ''
    for ch in p:
        if ch in TON: b += TON[ch][0]; t = TON[ch][1]
        else: b += ch
    ini = next((i for i in INI if b.startswith(i)), '')
    fin = b[len(ini):]
    if not ini:
        for a, r in (('yu', 'ü'), ('yi', 'i'), ('y', 'i'), ('wu', 'u'), ('w', 'u')):
            if b.startswith(a): fin = r + b[len(a):]; break
    if ini in ('j', 'q', 'x') and fin.startswith('u'): fin = 'ü' + fin[1:]
    if ini: fin = {'iu': 'iou', 'ui': 'uei', 'un': 'uen'}.get(fin, fin)
    return b, t, ini, fin


def lien(a, b):
    A, B = syl(a), syl(b)
    if A[0] == B[0]: return 'meme' if A[1] == B[1] else 'ton'
    if (A[2] and A[2] == B[2]) or A[3] == B[3]: return 'proche'
    return 'perdu'


def composants(MD, h, prof=0, acc=None):
    acc = set() if acc is None else acc
    d = MD.get(h)
    if not d or prof > 3: return acc
    for x in d['decomposition']:
        if x in IDC or x == h: continue
        acc.add(x); composants(MD, x, prof + 1, acc)
    return acc


def lire_js():
    import subprocess
    js = ("global.window=global;require(%r);process.stdout.write(JSON.stringify({W:WORDS,C:CHARS}))" % DW)
    return json.loads(subprocess.check_output(['node', '-e', js]))


def emet(v):
    if v is None: return 'null'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, (int, float)): return str(v)
    if isinstance(v, list): return '[' + ','.join(emet(x) for x in v) + ']'
    if isinstance(v, dict): return '{' + ','.join(k + ':' + emet(x) for k, x in v.items()) + '}'
    s = v.replace('\\', '\\\\').replace("'", "\\'").replace('\u2019', '\\u2019')
    return "'" + s + "'"


def fiche(h, MD, TR, B, W, GL, G):
    manque = []
    g = G.get(h, {})
    mots = [w for w in W if h in w['hz']]
    py = g.get('py')
    if not py:
        lect = Counter()
        for w in mots:
            hz = [c for c in w['hz']]; sy = w['py'].split()
            if len(hz) == len(sy):
                for c, s in zip(hz, sy):
                    if c == h: lect[s] += 1
        py = lect.most_common(1)[0][0] if lect else None
    fr = g.get('fr') or next((w['fr'] for w in mots if w['hz'] == h), None)
    if not py: manque.append('py')
    if not fr: manque.append('fr')
    hsks = [w['hsk'] for w in mots if w.get('hsk')]
    hsk = g.get('hsk', min(hsks) if hsks else None)
    th = g.get('th', sorted({t for w in mots if w['hz'] == h for t in w.get('th', [])}))
    d = MD.get(h)
    if not d: return None, ['absent de makemeahanzi']
    cle = d['radical']
    o = {'id': 'c_' + h, 'hz': h, 'py': py, 'fr': fr, 'hsk': hsk, 'th': th,
         'cle': {'hz': cle, 'fr': GL.get(cle)}}
    if not GL.get(cle): manque.append('sens de la clé ' + cle)
    notice = etymologie(h); time.sleep(0.5)
    ety = notice.split('\n')[0]
    # « Simplified from 記 (訁 → 讠). » : la notice de la forme traditionnelle
    # fait foi ; un phono n’est gardé que si l’élément de son reste visible
    # dans la forme simplifiée (contrôle plus bas).
    m = re.match(r'^\s*Simplified from (\S) \(([^()]*)\)\.?\s*$', ety) \
        or re.match(r'^\s*Variant of (\S)\.()', ety)   # 却 : « Variant of 卻. » (ajout du 26 novembre)
    if m:
        trad = etymologie(m.group(1)).split('\n')[0]; time.sleep(0.5)
        if LABRE.match(trad):
            ety = trad
    m = LABRE.match(ety)
    ty = sem = son = None
    if m:
        ty = LAB[m.group(1).lower()]
        if ty == 'phono':
            a = re.search(r'\bsemantic (?!compound)([^\s(（+,;:.₂]+)', ety); sem = a.group(1) if a else None
            a = re.search(r'\bphonetic ([^\s(（+,;:.₂]+)', ety); son = a.group(1) if a else None
    elif not re.match(r'\s*(Simplified|Unorthodox|Partly simplified)', ety) and d.get('etymology'):
        e = d['etymology']; ty = MMH.get(e.get('type'))
        sem, son = e.get('semantic'), e.get('phonetic')
    elif d.get('etymology'):  # forme simplifiée : on décrit la forme moderne
        e = d['etymology']; ty = MMH.get(e.get('type'))
        sem, son = e.get('semantic'), e.get('phonetic')
    cs = composants(MD, h)
    if ty == 'phono':
        son = VAR.get(son, son) if son not in cs else son
        if not son or son not in cs:
            ty = MMH.get((d.get('etymology') or {}).get('type'))
            if ty == 'phono': ty = None
            manque.append('type à relire (élément de son invisible)')
    if 'type' in g:  # chars-gloses.json tranche quand la source ne le fait pas (null : pas de type)
        ty = g['type']
        manque[:] = [x for x in manque if not x.startswith('type')]
    if ty: o['type'] = ty
    if ty == 'phono':
        if sem and sem != son:
            sem = sem if sem in cs else VAR.get(sem, sem)
            if sem in cs:
                o['sens'] = {'hz': sem, 'fr': GL.get(sem)}
                if not GL.get(sem): manque.append('sens du composant ' + sem)
        pys = G.get(son, {}).get('py') or (B.get(son, {}).get('pinyin') or [None])[0]
        if pys: pys = pys.replace('\u0261', 'g')  # « ɡ » non latin de la source (象, 尚…)
        if not pys: manque.append('lecture du composant ' + son)
        else:
            li = lien(py, pys) if py else None
            o['son'] = {'hz': son, 'py': pys, 'ecart': li}
    o['traits'] = TR.get(h)
    if g.get('explic'):
        o['explic'] = g['explic']
    elif PLUS.search(notice):
        manque.append('plusieurs explications possibles : les rédiger dans « explic » (voir la notice Wiktionary)')
    st = (B.get(h) or {}).get('structure')
    o['struct'] = STRUCT.get(st, STRUCT.get((st or 'X')[0]))
    if not o['struct']: manque.append('structure')
    return o, manque


def main():
    args = sys.argv[1:]
    poser = '--poser' in args
    chars = [a for a in args if a != '--poser']
    chars = [c for a in chars for c in a]
    MD, TR, B = sources()
    D = lire_js(); W, C = D['W'], D['C']
    deja = {c['hz'] for c in C}
    GL = {}
    for c in C:
        for k in ('cle', 'sens'):
            if c.get(k) and c[k].get('fr'): GL.setdefault(c[k]['hz'], c[k]['fr'])
    G = json.load(open(GLOSES, encoding='utf8')) if os.path.exists(GLOSES) else {}
    for k, v in G.items():
        if isinstance(v, str): GL[k] = v
    G = {k: v for k, v in G.items() if isinstance(v, dict)}
    nouv, bloque = [], False
    for h in dict.fromkeys(chars):
        if h in deja: print(h, ': déjà dans CHARS'); continue
        o, manque = fiche(h, MD, TR, B, W, GL, G)
        print(emet(o) if o else h)
        if manque:
            print('   À COMPLÉTER dans outils/chars-gloses.json :', ', '.join(manque))
            if any(not m.startswith(('type', 'plusieurs')) for m in manque): bloque = True
        if o: nouv.append(o)
    if poser:
        assert not bloque, 'compléter les gloses avant --poser'
        t = open(DW, encoding='utf8').read()
        ancre = '\n];\n\n/* Publication explicite'
        i = t.find('const CHARS=[')
        j = t.find(ancre, i)
        assert i > 0 and j > i and t.count(ancre) == 1
        ajout = ''.join(',\n  ' + emet(o) for o in nouv)
        t = t[:j] + ajout + t[j:]
        open(DW, 'w', encoding='utf8').write(t)
        print(len(nouv), 'caractère(s) ajouté(s) à CHARS')


if __name__ == '__main__':
    main()
