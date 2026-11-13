/* charge.js — chargement commun aux sondes : le contrôle de pinyin de
   core.js (extrait tel quel, sans réécriture) et les fiches de data-gram.js. */
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');
const RACINE=path.resolve(__dirname,'..');

function extrait(src,debut,fin){
  const i=src.indexOf(debut), j=src.indexOf(fin,i);
  if(i<0||j<0)throw new Error('Extrait introuvable dans core.js : '+debut);
  return src.slice(i,j);
}
function chargerPinyin(){
  const core=fs.readFileSync(path.join(RACINE,'core.js'),'utf8');
  const code=extrait(core,'const TONES=','function pinyin(')
    +extrait(core,'const VOW=','function tonVariants(')
    +extrait(core,'const SYL=','/* Dictionnaire des lectures')
    +'\nconst PYDICT={};\nthis.pinyinCheck=pinyinCheck;this.hanChars=hanChars;this.toneOf=toneOf;';
  const c={};vm.createContext(c);vm.runInContext(code,c);
  return c;
}
function chargerFiches(fichier){
  const c={window:{}};vm.createContext(c);
  vm.runInContext(fs.readFileSync(fichier||path.join(RACINE,'data-gram.js'),'utf8'),c);
  return {GRAMMAR:c.window.GRAMMAR, FAM:vm.runInContext('FAM',c)};
}
/* Énumération exhaustive d’un gabarit : produit des groupes « lie »
   (même index dans chaque liste du groupe) et des listes libres. */
function enumerer(ga){
  const groupes=(ga.lie||[]).map(g=>g.slice());
  const dansLie=new Set([].concat(...groupes));
  Object.keys(ga.listes).forEach(k=>{if(!dansLie.has(k))groupes.push([k]);});
  const axes=groupes.map(g=>({g,n:Math.min(...g.map(k=>ga.listes[k].length))}));
  const out=[];
  const rec=(a,acc)=>{
    if(a===axes.length){out.push({seg:ga.cadre.map(t=>t.s?acc[t.s]:t),choix:Object.assign({},acc)});return;}
    for(let i=0;i<axes[a].n;i++){const n=Object.assign({},acc);axes[a].g.forEach(k=>n[k]=ga.listes[k][i]);rec(a+1,n);}
  };
  rec(0,{});
  return out;
}
const segHz=s=>s.map(t=>t.h).join('');
const segPy=s=>s.map(t=>t.p).filter(Boolean).join(' ');
module.exports={RACINE,chargerPinyin,chargerFiches,enumerer,segHz,segPy};
