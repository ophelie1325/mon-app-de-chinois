/* diag.js — diagnostic statique de data-gram.js.
   Usage : node outils/diag.js [data-gram.js]
   Échec = défaut bloquant. Signalement = écart connu et voulu (normes
   récentes non rétroactives sur les 42 fiches d’origine, plafond de
   neuf écrans dépassé par g326 et g327). Sortie non nulle s’il y a un échec. */
'use strict';
const C=require('./charge.js');
const fs=require('fs'), path=require('path');
const PY=C.chargerPinyin();
const {GRAMMAR,FAM}=C.chargerFiches(process.argv[2]);

/* Les 42 fiches d’origine : les normes fixées après coup ne s’y appliquent
   qu’en signalement. Toute autre fiche y est soumise en échec. */
const ANCIENNES=new Set(('g201 g202 g203 g204 g205 g206 g207 g208 g209 g210 '+
  'g301 g302 g303 g304 g305 g306 g307 g308 g309 g310 g311 g312 g313 g314 g315 '+
  'g316 g317 g318 g319 g320 g321 g322 g323 g324 gO2 gO3 g325 g326 g327 g328 g329 g330').split(' '));
const PLAFOND_TOLERE=new Set(['g326','g327']);
/* Recalibrées sur g325–g330 : normes pleines (banque, leurres…) */
const NORMES_PLEINES=new Set(['g325','g326','g327','g328','g329','g330']);

const words=fs.readFileSync(path.join(C.RACINE,'data-words.js'),'utf8');
const THEMES=[...words.slice(0,words.indexOf('const WORDS')).matchAll(/id:'([a-z]+)'/g)].map(m=>m[1]);

let n=0; const echecs=[], signal=[];
function ok(c,msg,f,doux){n++; if(!c){(doux?signal:echecs).push((f?f.id+' — ':'')+msg);}}
const HAN=/[㐀-鿿]/;
let phrases=0;
function py(hz,p,f,ou){
  phrases++;
  const r=PY.pinyinCheck(hz,p,true);
  ok(r.ok,`pinyin (${ou}) : ${hz} / ${p} → ${r.why}`,f);
}
function jeton(t,f,ou){
  ok(t&&typeof t.h==='string'&&typeof t.p==='string',`jeton mal formé (${ou})`,f);
  if(!t||typeof t.h!=='string')return;
  if(HAN.test(t.h))ok(t.p.trim().length>0,`jeton chinois sans pinyin (${ou}) : ${t.h}`,f);
  else ok(t.p==='',`ponctuation avec pinyin (${ou}) : ${t.h}`,f);
  if(t.p)py(t.h,t.p,f,ou+' jeton');
}
function seg(s,f,ou){
  ok(Array.isArray(s)&&s.length>0,`seg vide (${ou})`,f);
  if(!Array.isArray(s))return;
  s.forEach(t=>jeton(t,f,ou));
  py(C.segHz(s),C.segPy(s),f,ou);
}
/* Typographie française : apostrophe droite, doubles espaces, espace
   avant virgule ou point. */
function fr(txt,f,ou){
  if(typeof txt!=='string')return;
  const t=txt.replace(/<[^>]+>/g,'');
  ok(!/[A-Za-zÀ-ÿ]'[A-Za-zÀ-ÿ]/.test(t),`apostrophe droite (${ou}) : ${t.slice(0,80)}`,f);
  ok(!/ {2,}/.test(t),`double espace (${ou}) : ${t.slice(0,80)}`,f);
  ok(!/ [,.](?!\.)/.test(t),`espace avant , ou . (${ou}) : ${t.slice(0,80)}`,f);
  if(!(f&&ANCIENNES.has(f.id)))ok(t===t.trim(),`espace en bord (${ou}) : ${t.slice(0,80)}`,f);
}
function ex(e,f,ou){
  ok(e&&e.hz&&typeof e.py==='string'&&e.fr,`exemple incomplet (${ou})`,f);
  if(!e)return; py(e.hz,e.py,f,ou); fr(e.fr,f,ou); fr(e.note,f,ou+' note');
}

const ids=new Set();
GRAMMAR.forEach(f=>{
  const anc=ANCIENNES.has(f.id), plein=!anc||NORMES_PLEINES.has(f.id);
  const doux=anc; // écarts aux normes : signalement pour les anciennes
  ok(!ids.has(f.id),'identifiant en double',f); ids.add(f.id);
  ['id','hsk','fam','th','title','resume','steps','tableau','piege','voir','banque','leurres','gabarits','transfo','fixes','reemploi']
    .forEach(k=>ok(f[k]!==undefined,'champ absent : '+k,f));
  ok(FAM.some(x=>x.k===f.fam),'famille inconnue : '+f.fam,f);
  (f.th||[]).forEach(t=>ok(THEMES.includes(t),'thème inconnu : '+t,f));
  ok((f.th||[]).length>=1,'aucun thème',f);
  fr(f.title,f,'titre'); fr(f.resume,f,'résumé');
  if(!anc)ok(f.hsk3===undefined||(Array.isArray(f.hsk3)&&!f.hsk3.length),'champ hsk3 sur une fiche nouvelle',f);
  /* Écrans */
  const ns=(f.steps||[]).length;
  ok(ns<=9,`${ns} écrans (plafond 9)`,f,PLAFOND_TOLERE.has(f.id));
  let oralEcran=false;
  (f.steps||[]).forEach((s,i)=>{
    const ou='écran '+(i+1);
    ok(s.t&&Array.isArray(s.p)&&s.p.length,`écran incomplet (${ou})`,f);
    fr(s.t,f,ou+' titre'); (s.p||[]).forEach(p=>fr(p,f,ou));
    (s.ex||[]).forEach(e=>ex(e,f,ou));
    if(s.reg==='oral')oralEcran=true;
    if(s.check){
      ok(Array.isArray(s.check.a)&&s.check.ok>=0&&s.check.ok<s.check.a.length,`check invalide (${ou})`,f);
      fr(s.check.q,f,ou+' check'); fr(s.check.why,f,ou+' check');
    }
  });
  /* Gabarits */
  const gabs=f.gabarits||[];
  ok(gabs.length>=5,`${gabs.length} gabarits (minimum 5)`,f,doux);
  let oralGab=false;
  gabs.forEach((ga,i)=>{
    const ou='gabarit '+(i+1);
    if(ga.reg==='oral'||Object.values(ga.listes).some(l=>l.some(x=>x.reg==='oral')))oralGab=true;
    const cles=Object.keys(ga.listes);
    const slots=ga.cadre.filter(t=>t.s).map(t=>t.s);
    slots.forEach(s=>ok(cles.includes(s),`fente sans liste (${ou}) : ${s}`,f));
    cles.forEach(k=>ok(slots.includes(k),`liste hors cadre (${ou}) : ${k}`,f));
    ga.cadre.filter(t=>!t.s).forEach(t=>jeton(t,f,ou+' cadre'));
    fr(ga.fr,f,ou);
    if(cles.length>1){
      const lie=[].concat(...(ga.lie||[])), libre=ga.libre||[];
      ok(Array.isArray(ga.lie)&&(Array.isArray(ga.libre)||(anc&&lie.length===cles.length)),`lie/libre non déclarés (${ou})`,f);
      const tous=lie.concat(libre);
      ok(tous.length===new Set(tous).size,`liste déclarée deux fois (${ou})`,f);
      ok(tous.length===cles.length&&cles.every(k=>tous.includes(k)),`lie ∪ libre ≠ listes (${ou})`,f);
    }
    (ga.lie||[]).forEach(g=>{
      const lg=g.map(k=>(ga.listes[k]||[]).length);
      ok(lg.every(x=>x===lg[0]),`groupe lié de longueurs inégales (${ou}) : ${lg}`,f);
      if(g.length>1)ok(lg[0]%12===0,`bloc apparié de ${lg[0]} rangées (${ou})`,f,doux);
    });
    cles.forEach(k=>ga.listes[k].forEach(x=>{
      ok(x.h&&typeof x.p==='string'&&x.fr,`élément incomplet (${ou}, ${k})`,f);
      if(x.p)py(x.h,x.p,f,ou+' liste '+k); fr(x.fr,f,ou+' liste '+k);
    }));
  });
  const reco=f.reco===true;
  ok(oralEcran||reco,'aucun écran oral',f,doux);
  ok(oralGab||reco,'aucun gabarit oral',f,doux);
  /* Tableau, piège, renvois */
  const rows=(f.tableau&&f.tableau.rows)||[];
  ok(rows.length>=14&&rows.length<=28,`tableau de ${rows.length} rangées (14 à 28)`,f,doux);
  rows.forEach(r=>{ok(r.length===f.tableau.cols.length,'rangée de tableau mal formée',f);r.forEach(c=>{if(!HAN.test(c))fr(c,f,'tableau');});});
  if(f.piege){ex({hz:f.piege.bad.hz,py:f.piege.bad.py,fr:'-'},f,'piège faux');ex({hz:f.piege.good.hz,py:f.piege.good.py,fr:'-'},f,'piège juste');fr(f.piege.why,f,'piège');}
  (f.voir||[]).forEach(v=>ok(GRAMMAR.some(g=>g.id===v),'renvoi vers une fiche absente : '+v,f));
  ok(!(f.voir||[]).includes(f.id),'renvoi vers soi',f);
  /* Banque, leurres, transformations, 改错, réemplois */
  const cnt=(k,v)=>ok((f[k]||[]).length>=v,`${k} : ${(f[k]||[]).length} (attendu ${v})`,f,doux);
  cnt('banque',18);cnt('leurres',12);cnt('transfo',9);cnt('fixes',8);cnt('reemploi',4);
  (f.banque||[]).forEach((b,i)=>{
    seg(b.seg,f,'banque '+(i+1)); fr(b.fr,f,'banque');
    ok(b.cle>=0&&b.cle<b.seg.length&&b.seg[b.cle].p,`banque ${i+1} : clé sur un jeton non touchable`,f);
  });
  (f.transfo||[]).forEach((t,i)=>{ex(t.de,f,'transfo '+(i+1));seg(t.vers.seg,f,'transfo '+(i+1)+' vers');fr(t.consigne,f,'transfo');fr(t.vers.fr,f,'transfo');});
  (f.fixes||[]).forEach((x,i)=>{
    seg(x.seg,f,'改错 '+(i+1));
    ok(x.bad>=0&&x.bad<x.seg.length&&x.seg[x.bad].p,`改错 ${i+1} : faute sur un jeton non touchable`,f);
    ok(HAN.test(x.bon||''),`改错 ${i+1} : correction absente`,f); fr(x.why,f,'改错');
  });
  (f.reemploi||[]).forEach((r,i)=>{
    fr(r.q,f,'réemploi'); (r.criteres||[]).forEach(c=>fr(c,f,'réemploi'));
    ok((r.verif||[]).some(v=>v.type==='contient'||v.type==='un_parmi'),`réemploi ${i+1} sans critère « contient »`,f,doux&&!plein);
    (r.verif||[]).forEach(v=>fr(v.msg,f,'réemploi'));
    ok((r.modeles||[]).length>=1,`réemploi ${i+1} sans modèle`,f);
    /* Les modèles réunis doivent satisfaire les critères : la réponse de
       l’élève est contrôlée d’un bloc, et un modèle peut n’en illustrer
       qu’une partie. Aucun modèle ne doit contenir une forme exclue. */
    const tout=(r.modeles||[]).map(m=>m.hz).join('');
    (r.modeles||[]).forEach(m=>{ex(m,f,'réemploi modèle');
      (r.verif||[]).forEach(v=>{if(v.type==='absent')ok(!m.hz.includes(v.v),`réemploi ${i+1} : un modèle contient ${v.v}`,f);});});
    (r.verif||[]).forEach(v=>{
      if(v.type==='contient')ok(tout.includes(v.v),`réemploi ${i+1} : aucun modèle ne contient ${v.v}`,f,anc);
      if(v.type==='un_parmi')ok(v.v.some(x=>tout.includes(x)),`réemploi ${i+1} : aucun modèle ne contient l’un de ${v.v}`,f,anc);
    });
  });
  (f.leurres||[]).forEach(l=>ok(HAN.test(l),'leurre sans caractère : '+l,f));
});

console.log(`diag.js — ${GRAMMAR.length} fiches, ${n} contrôles, ${phrases} chaînes passées au pinyin.`);
console.log(`Signalements (connus, non bloquants) : ${signal.length}`);
if(process.env.VERBOSE)signal.forEach(s=>console.log('  · '+s));
console.log(`Échecs : ${echecs.length}`);
echecs.slice(0,80).forEach(e=>console.log('  ✗ '+e));
process.exit(echecs.length?1:0);
