/* pyfull.js — toutes les phrases engendrées par tous les gabarits, une
   par une, au contrôle de pinyin de core.js (pinyinCheck, sans le doute
   de PYDICT). Usage : node outils/pyfull.js [data-gram.js] */
'use strict';
const C=require('./charge.js');
const PY=C.chargerPinyin();
const {GRAMMAR}=C.chargerFiches(process.argv[2]);
let n=0,g=0; const echecs=[];
GRAMMAR.forEach(f=>f.gabarits.forEach((ga,i)=>{g++;
  C.enumerer(ga).forEach(t=>{n++;
    const hz=C.segHz(t.seg),py=C.segPy(t.seg),r=PY.pinyinCheck(hz,py,true);
    if(!r.ok)echecs.push(`${f.id} gabarit ${i+1} : ${hz} / ${py} → ${r.why}`);
  });
}));
console.log(`pyfull.js — ${GRAMMAR.length} fiches, ${g} gabarits, ${n} phrases engendrées.`);
console.log(`Échecs : ${echecs.length}`); echecs.slice(0,50).forEach(e=>console.log('  ✗ '+e));
process.exit(echecs.length?1:0);
