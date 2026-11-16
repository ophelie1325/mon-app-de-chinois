#!/usr/bin/env python3
"""Versement des mots des fiches de grammaire dans WORDS (data-words.js).

Règle d’Ophélie (16 novembre 2026) : chaque nouvelle fiche ou leçon crée,
dans le même envoi, les fiches de ses mots et de ses caractères nouveaux.
Règles de fond : claude/prompt-continuite-20261112-words-chars.md (projet).

Usage
  python3 outils/mots.py candidats [g331 …]   # mots nouveaux à gloser, ids de fiche manquants
  python3 outils/mots.py poser                # verse outils/mots-a-verser.json, complète les g
  python3 outils/mots.py verifier             # garde-fou : code de sortie 1 si quelque chose manque

Étapes pour une fiche :
  1. `candidats gXXX` imprime chaque mot nouveau avec sa lecture de dictionnaire,
     son niveau HSK, les indications du dictionnaire et les phrases de la fiche.
  2. Écrire outils/mots-a-verser.json : une liste d’objets
       {"hz":"历史","py":"lì shǐ","fr":"histoire","nat":["nom"],"cl":[],"th":[],
        "ex":"我喜欢历史。"}
     ex = une phrase de la banque, recopiée en caractères ; le script reprend
     son pinyin et sa traduction tels quels. Pour exclure un mot (prénom,
     fragment), l’ajouter dans outils/mots-regles.json plutôt que de le gloser.
  3. `poser` : contrôles (syllabes, nature, thème, apostrophes, exemple présent
     dans une fiche du mot), niveau HSK calculé, id calculé, champ g calculé ;
     les mots déjà présents reçoivent les ids de fiche qui leur manquent.
  4. Caractères nouveaux : `python3 outils/chars.py …` (la commande est imprimée).
  5. `verifier` doit sortir à zéro.

Sources (téléchargées dans /tmp/mots-src au premier lancement)
  - drkameleon/complete-hsk-vocabulary : liste HSK « newest » (programme de
    décembre 2025), lectures, natures et classificateurs du dictionnaire.
  - skishore/makemeahanzi : lecture de dictionnaire d’un caractère.
"""
import json, os, re, sys, subprocess, unicodedata, urllib.request
from collections import defaultdict, OrderedDict

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(ICI)
DW = os.path.join(DEPOT, 'data-words.js')
REGLES = json.load(open(os.path.join(ICI, 'mots-regles.json'), encoding='utf8'))
A_VERSER = os.path.join(ICI, 'mots-a-verser.json')
CACHE = '/tmp/mots-src'
URLS = {
    'complete.json': 'https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main/complete.json',
    'dictionary.txt': 'https://raw.githubusercontent.com/skishore/makemeahanzi/master/dictionary.txt',
}
HZ = re.compile(r'[一-鿿]')
THEMES = {'presenter', 'decrire', 'famille', 'quotidien', 'nourriture', 'achats', 'temps', 'passe',
          'espace', 'logement', 'travail', 'voyage', 'sante', 'projets', 'avis'}
NATS = {'nom', 'verbe', 'adj', 'adv', 'expr', 'pron', 'num', 'cl', 'part', 'prep', 'conj', 'loc'}
NEUTRE = set('了的得地过着吗吧呢啊呀们么嘛啦')
NUM = set('一二两三四五六七八九十几半每这那哪')
CLF = set('个本张位件条只把台辆杯碗次块岁天年口家双种些点')


def charge(nom):
    os.makedirs(CACHE, exist_ok=True)
    p = os.path.join(CACHE, nom)
    if not os.path.exists(p):
        req = urllib.request.Request(URLS[nom], headers={'User-Agent': 'CoachChinois/1.0'})
        open(p, 'wb').write(urllib.request.urlopen(req, timeout=120).read())
    return open(p, encoding='utf8').read()


def donnees():
    js = ("global.window=global;for(const f of ['data-words','data-corpus','data-gram'])"
          "require(%r+'/'+f+'.js');console.log(JSON.stringify({W:WORDS,C:CHARS,G:GRAMMAR,"
          "T:(window.TEXTS||[])}))" % DEPOT)
    return json.loads(subprocess.check_output(['node', '-e', js]))


D = donnees()
W, CHARS, G = D['W'], D['C'], D['G']
DIC = defaultdict(list)
for e in json.loads(charge('complete.json')):
    DIC[e['simplified']].append(e)
MMH = {}
for l in charge('dictionary.txt').splitlines():
    e = json.loads(l); MMH[e['character']] = e.get('pinyin') or []

bare = lambda s: unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode().lower()
neutre = lambda s: bare(s) == s.lower()
erhua = lambda p: re.sub(r'(\S) r\b', r'\1r', p)


def dpys(h):
    return [erhua(f['transcriptions']['pinyin']) for e in DIC.get(h, []) for f in e['forms']]


def niveau(h):
    ls = {int(l[7:]) for e in DIC.get(h, []) for l in e['level'] if l.startswith('newest-')}
    return min(ls) if ls else None


# ---------- découpage d’un segment en vrais mots ----------
CONNUS = {w['hz'] for w in W}
PROPRES = {t['h'] for f in G for b in f.get('banque', []) for t in b['seg']
           if HZ.search(t['h']) and t['p'][:1].isupper()}
SEP, FORCE, AJ = set(REGLES['separer']), REGLES['forcer'], set(REGLES['ajouter'])


def est_mot(s):
    if s in SEP: return False
    return s in AJ or s in DIC or s in CONNUS or s in PROPRES


def couper(h):
    out = []; i = 0
    while i < len(h):
        if h[i] in NUM and i + 1 < len(h) and h[i + 1] in CLF and not est_mot(h[i:i + 2]) \
                and not any(est_mot(h[i:i + L]) for L in (3, 4, 5) if i + L <= len(h)):
            out += [h[i], h[i + 1]]; i += 2; continue
        for L in range(min(5, len(h) - i), 0, -1):
            w = h[i:i + L]
            if L > 1 and w == '个人' and i > 0 and h[i - 1] in NUM: continue
            if L > 1 and w.endswith('分') and h[i + L:i + L + 1] == '钟': continue
            if w == '写作' and h[i + L:i + L + 1] == '业': continue
            if L == 1 or est_mot(w): out.append(w); i += L; break
    return out


def aligner(h, p):
    s = p.split(); out = []; i = 0
    for k, ch in enumerate(h):
        if ch == '儿' and k > 0 and out and out[-1].endswith('r') and (len(s) == len(h) - 1 or i >= len(s)):
            out.append(''); continue
        out.append(s[i] if i < len(s) else '?'); i += 1
    return out if i == len(s) else None


def compat(h, ctx, dic):
    a, b = ctx.lower().split(), dic.lower().split()
    if len(a) != len(b): return False
    for ch, x, y in zip(h.replace('儿', '') if len(a) < len(h) else h, a, b):
        if x == y or ch in '一不' and bare(x) == bare(y): continue
        if bare(x) != bare(y): return False
        if not (neutre(x) or neutre(y)): return False
    return True


def forme_dico(h, ctx):
    """Lecture de dictionnaire, ou None si la lecture du contexte est incompatible."""
    if h in REGLES['pinyin_fixe'] and bare(REGLES['pinyin_fixe'][h]) == bare(ctx):
        return REGLES['pinyin_fixe'][h]
    if len(h) == 1:
        if h == '不': return 'bù'
        if h == '一': return 'yī'
        if not neutre(ctx) or h in NEUTRE: return ctx
        ton = [r for r in MMH.get(h, []) if not neutre(r)]
        return (ton or [ctx])[0]
    D_ = dpys(h)
    if not D_: return ctx
    for x in D_:
        if compat(h, ctx, x):
            a, b = ctx.split(), x.split()
            if len(a) != len(b): return ctx
            return ' '.join(y if (neutre(c) and not neutre(y) and ch not in '一不') else c
                            for ch, c, y in zip(h, a, b))
    return None


def mots_des_fiches(ids=None):
    """(hz, py) -> {g: fiches, ex: phrases} ; plus la liste des cas à relire."""
    lex = OrderedDict(); relire = []
    for f in G:
        if ids and f['id'] not in ids: continue
        for b in f.get('banque', []):
            phrase = {'hz': ''.join(t['h'] for t in b['seg']),
                      'py': ' '.join(t['p'] for t in b['seg'] if t['p']), 'fr': b['fr']}
            for t in b['seg']:
                h = ''.join(HZ.findall(t['h']))
                if not h: continue
                sy = aligner(h, t['p'])
                if sy is None: relire.append(('pinyin non aligné', f['id'], t['h'], t['p'])); continue
                parts = FORCE.get(h) or ([h] if est_mot(h) else couper(h))
                k = 0
                for p in parts:
                    ctx = ' '.join(x for x in sy[k:k + len(p)] if x); k += len(p)
                    if p in REGLES['noms'] or p in REGLES['fragments']: continue
                    py = forme_dico(p, ctx)
                    if py is None: relire.append(('lecture incompatible', f['id'], p, ctx)); continue
                    o = lex.setdefault((p, py), {'g': set(), 'ex': []})
                    o['g'].add(f['id'])
                    if phrase not in o['ex']: o['ex'].append(phrase)
    return lex, relire


def present(hz, py):
    """Entrée de WORDS pour ce mot : même lecture, sinon même son (tons de contexte)."""
    m = [w for w in W if w['hz'] == hz]
    return next((w for w in m if w['py'] == py), None) or next((w for w in m if bare(w['py']) == bare(py)), None)


def manque_g(lex):
    out = []
    for (hz, py), o in lex.items():
        w = present(hz, py)
        if w:
            miss = sorted(o['g'] - set(w.get('g') or []))
            if miss: out.append((w, miss))
    return out


# ---------- commandes ----------
def candidats(ids):
    lex, relire = mots_des_fiches(ids)
    nouveaux = [(k, o) for k, o in lex.items() if not present(*k)]
    print('%d mots nouveaux%s' % (len(nouveaux), ' dans ' + ' '.join(ids) if ids else ''))
    for (hz, py), o in nouveaux:
        es = DIC.get(hz, [])
        pos = ''.join(sorted({x for e in es for x in e['pos']}))
        cl = ''.join(sorted({c for e in es for f in e['forms'] for c in f.get('classifiers', [])}))
        sens = '; '.join(m for e in es[:1] for f in e['forms'][:1] for m in f.get('meanings', [])[:3])
        print('\n%s  %s  HSK %s  %s%s%s' % (hz, py, niveau(hz), pos, '  cl ' + cl if cl else '',
                                          '  ' + PROPRES_flag(hz) if hz in PROPRES else ''))
        if sens: print('   dico : ' + sens)
        for ex in sorted(o['ex'], key=lambda e: len(e['hz']))[:3]:
            print('   ' + ex['hz'] + ' | ' + ex['fr'])
    mg = manque_g(lex)
    if mg: print('\n%d mots déjà présents recevront un id de fiche (poser) : %s' %
                 (len(mg), ' '.join(w['hz'] + '+' + ','.join(m) for w, m in mg)))
    for r in relire: print('À RELIRE :', *r)


def PROPRES_flag(hz):
    return '(nom propre : lieu → garder avec hsk null ; personne → ajouter à "noms")'


def js(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'").replace('’', '\\u2019') + "'"


def arr(a): return '[' + ','.join(js(x) for x in a) + ']'


def poser():
    lot = json.load(open(A_VERSER, encoding='utf8')) if os.path.exists(A_VERSER) else []
    lex, relire = mots_des_fiches()
    src = open(DW, encoding='utf8').read()
    ids = {w['id'] for w in W}
    lignes = []
    for x in lot:
        hz, py = x['hz'], x['py']
        assert not present(hz, py), ('déjà dans WORDS', hz)
        k = next((k for k in lex if k[0] == hz and (k[1] == py or bare(k[1]) == bare(py))), None)
        assert k, ('mot absent des fiches (ou lecture différente)', hz, py)
        n = len(HZ.findall(hz)) - (1 if hz.endswith('儿') and len(hz) > 1 and py.split()[-1].endswith('r')
                                   and bare(py.split()[-1]) != 'er' else 0)
        assert n == len(py.split()), ('syllabes', hz, py)
        assert x['nat'] and set(x['nat']) <= NATS, ('nature', hz)
        assert set(x.get('th', [])) <= THEMES, ('thème', hz)
        assert x['fr'] and "'" not in x['fr'] and '"' not in x['fr'], ('sens ou apostrophe droite', hz)
        assert all(len(c) == 1 for c in x.get('cl', [])), ('classificateur', hz)
        ex = next((e for e in lex[k]['ex'] if e['hz'] == x['ex']), None)
        assert ex, ('exemple absent des phrases des fiches du mot', hz, x['ex'])
        assert "'" not in ex['fr'], ('apostrophe droite dans l’exemple', hz)
        lect = {bare(w['py']) for w in W if w['hz'] == hz} | {bare(kk[1]) for kk in lex if kk[0] == hz}
        meme = [w for w in W if w['hz'] == hz and bare(w['py']) == bare(py)] + \
               [y for y in lot if y['hz'] == hz and y is not x and bare(y['py']) == bare(py)]
        suf = bare(py).replace(' ', '')
        if meme:
            T = {'̄': '1', '́': '2', '̌': '3', '̀': '4'}
            suf += ''.join(T.get(c, '') for c in unicodedata.normalize('NFD', py)) or '5'
        wid = 'w_' + hz + ('_' + suf if len(lect) > 1 or meme else '')
        assert wid not in ids, ('identifiant déjà pris', wid); ids.add(wid)
        hsk = niveau(hz)
        lignes.append("  {id:%s,hz:%s,py:%s,fr:%s,hsk:%s,th:%s,nat:%s,cl:%s,ex:{hz:%s,py:%s,fr:%s},src:['fiche'],g:%s}" % (
            js(wid), js(hz), js(py), js(x['fr']), 'null' if hsk is None else hsk, arr(x.get('th', [])),
            arr(x['nat']), arr(x.get('cl', [])), js(ex['hz']), js(ex['py']), js(ex['fr']), arr(sorted(lex[k]['g']))))
        print('  +', wid, py, '—', x['fr'], '(HSK %s)' % hsk)
    # ids de fiche manquants sur les mots déjà présents
    for w, miss in manque_g(lex):
        pat = "{id:%s," % js(w['id']); assert src.count(pat) == 1, pat
        i = src.index(pat); j = src.index('\n', i); ligne = src[i:j]
        if ',g:[' in ligne:
            a = ligne.index(',g:[') + 4; b = ligne.index(']', a)
            nouv = ligne[:a] + ','.join(js(x) for x in sorted(set(w['g']) | set(miss))) + ligne[b:]
        else:
            nouv = ligne.replace(",src:['lecon']", ",src:['lecon','fiche']", 1)
            assert ',src:' in nouv, ('mot sans src', w['id'])
            fin = nouv.rindex('}'); nouv = nouv[:fin] + ',g:' + arr(sorted(miss)) + nouv[fin:]
        src = src[:i] + nouv + src[j:]
        print('  g', w['id'], '+', ','.join(miss))
    if lignes:
        a = src.index('const WORDS=['); fin = src.index('\n];', a)   # fin du tableau WORDS
        assert src.count('const WORDS=[') == 1 and src.index('const CHARS=[') > fin
        src = src[:fin] + ',\n' + ',\n'.join(lignes) + src[fin:]
    open(DW, 'w', encoding='utf8').write(src)
    if lot: os.remove(A_VERSER)
    print('%d mots versés.' % len(lignes))
    D2 = donnees()
    have = {c['hz'] for c in D2['C']}
    neufs = sorted({c for w in D2['W'] for c in HZ.findall(w['hz'])} - have)
    if neufs: print('Caractères nouveaux à créer : python3 outils/chars.py ' + ' '.join(neufs))


def verifier():
    lex, relire = mots_des_fiches()
    err = []
    for (hz, py), o in lex.items():
        if not present(hz, py): err.append('mot non versé : %s %s (%s)' % (hz, py, ','.join(sorted(o['g']))))
    for w, miss in manque_g(lex): err.append('fiche absente du champ g : %s ← %s' % (w['id'], ','.join(miss)))
    for w in W:
        if not w.get('nat'): err.append('mot sans nature : ' + w['id'])
    have = {c['hz'] for c in CHARS}
    for c in sorted({c for w in W for c in HZ.findall(w['hz'])} - have): err.append('caractère sans fiche : ' + c)
    for r in relire: err.append('à relire : ' + ' '.join(r))
    for e in err: print('ÉCHEC', e)
    print('mots.py verifier : %d mots des fiches, %d échec(s)' % (len(lex), len(err)))
    sys.exit(1 if err else 0)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'verifier'
    if cmd == 'candidats': candidats(sys.argv[2:])
    elif cmd == 'poser': poser()
    elif cmd == 'verifier': verifier()
    else: print(__doc__)
