# Outils de fabrication et de diagnostic des fiches de grammaire

- `gram_lib.py` — constructeurs (T, P, S, seg, hz, py, phrase/EX, liste, col, gab, tirages, combos, ecran), contrôles (port de pinyinCheck, sandhi de 一 et 不, lectures comparées à pypinyin, typographie française), émission JavaScript (val_js, jeton_js, fiche_js : seize lignes) et insertion gardée (poser).
- `fiches/gXXX.py` — une fiche par script. `python3 outils/fiches/gXXX.py` imprime quatre tirages par gabarit et les écarts à relire ; `--poser` l’insère dans data-gram.js.
- `diag.js` — contrôles statiques. Les 104 signalements des fiches anciennes (normes non rétroactives, g326/g327 au-delà de neuf écrans) ne sont pas des échecs.
- `pyfull.js` — toutes les phrases engendrées au contrôle de pinyin.
- `reprise.js` — reprise lexicale au bigramme ; `reprise-connus.txt` liste les cas relus et acceptés.
- `diagdom.js` — rendu des treize pages sous jsdom, et grammaire.html en détail (sommaires, écrans, piège, fiche, douze sessions de douze items).

Dépendances hors dépôt : `pip install pypinyin`, `npm install jsdom` dans un dossier à part, puis `NODE_PATH=<ce dossier>/node_modules node outils/diagdom.js`.

## Formes anciennes (écran Caractères)
- `formes/` : SVG des formes sur os, bronze et sceau, projet *Ancient Chinese Characters* de Wikimedia Commons (domaine public ou CC0), passés par svgo ; `formes/index.js` (window.FORMES) et `formes/CREDITS.md`.
- Récupération du 16 novembre 2026 : Wikimedia répond 429 à l’espace de travail, les fichiers ont donc été cherchés (API Commons, forme traditionnelle d’abord, puis simplifiée) et téléchargés depuis le navigateur de l’application de bureau.
- Un caractère absent de `window.FORMES` (ajouté après cette date) n’affiche pas la section « D’où il vient » ; une forme à `null` affiche « pas de forme connue ».
- `chars.py` — ajoute à CHARS les caractères nouveaux (clé, type, composants de sens et de son avec `ecart`, traits, structure). `python3 outils/chars.py 王新` montre les fiches calculées et ce qui manque ; on complète lectures et sens dans `chars-gloses.json` (`{"王":{"py":"wáng","fr":"roi"},"鱼":"poisson"}` : objet pour un caractère, chaîne pour le sens d’un composant), puis `--poser`. Sources téléchargées dans /tmp/chars-src (makemeahanzi, kaikki.org pour Wiktionary, mapull pour les structures).
