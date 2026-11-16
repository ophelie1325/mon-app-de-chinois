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

## Mots et caractères des fiches et des leçons (règle du 16 novembre 2026)
Toute nouvelle fiche de grammaire ou leçon verse, dans le même envoi, ses mots nouveaux dans WORDS et ses caractères nouveaux dans CHARS. Règles de fond : claude/prompt-continuite-20261112-words-chars.md (projet).
- `mots.py candidats gXXX` — mots nouveaux de la fiche (vrais mots, lecture de dictionnaire, niveau HSK, indications du dictionnaire, phrases de la fiche) et mots déjà présents à qui manque l’id de la fiche.
- Écrire `mots-a-verser.json` (sens, nature, classificateurs, thèmes, phrase d’exemple de la fiche), puis `mots.py poser` : contrôles, niveau HSK, id et champ `g` calculés ; ids de fiche ajoutés aux mots déjà présents ; imprime la commande `chars.py` des caractères nouveaux.
- `mots-regles.json` — règles de découpage (separer, forcer, ajouter, fragments, noms, pinyin_fixe) : les compléter quand une coupe fautive apparaît, ne pas les rouvrir.
- **Garde-fou** : `mots.py verifier` sort en échec si un mot d’une fiche n’est pas versé, si une fiche manque dans le champ `g`, si un mot (de leçon compris) n’a pas de nature ou si un caractère de WORDS n’a pas de fiche dans CHARS. À lancer avec les autres diagnostics : zéro échec exigé avant tout envoi.
- `diagmots.js` — sous jsdom : pinyinCheck de chaque mot, exemple et caractère, règle d’affichage (un mot ou un caractère n’apparaît qu’une fois sa leçon commencée ou sa fiche découverte), séances de vocabulaire, fiche de chaque mot.
