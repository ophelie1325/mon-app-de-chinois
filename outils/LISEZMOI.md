# Outils de fabrication et de diagnostic des fiches de grammaire

- `gram_lib.py` — constructeurs (T, P, S, seg, hz, py, phrase/EX, liste, col, gab, tirages, combos, ecran), contrôles (port de pinyinCheck, sandhi de 一 et 不, lectures comparées à pypinyin, typographie française), émission JavaScript (val_js, jeton_js, fiche_js : seize lignes) et insertion gardée (poser).
- `fiches/gXXX.py` — une fiche par script. `python3 outils/fiches/gXXX.py` imprime quatre tirages par gabarit et les écarts à relire ; `--poser` l’insère dans data-gram.js.
- `diag.js` — contrôles statiques. Les 104 signalements des fiches anciennes (normes non rétroactives, g326/g327 au-delà de neuf écrans) ne sont pas des échecs.
- `pyfull.js` — toutes les phrases engendrées au contrôle de pinyin.
- `reprise.js` — reprise lexicale au bigramme ; `reprise-connus.txt` liste les cas relus et acceptés.
- `diagdom.js` — rendu des treize pages sous jsdom, et grammaire.html en détail (sommaires, écrans, piège, fiche, douze sessions de douze items).

Dépendances hors dépôt : `pip install pypinyin`, `npm install jsdom` dans un dossier à part, puis `NODE_PATH=<ce dossier>/node_modules node outils/diagdom.js`.
