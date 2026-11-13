/* reprise.js — reprise lexicale au bigramme sur tout le corpus engendré.
   Pour chaque phrase, chaque élément tiré d’une liste LIBRE est découpé en
   bigrammes de caractères ; si l’un d’eux se retrouve ailleurs dans la
   phrase (hors de cet élément), la phrase est signalée (老师是老师吗).
   Exemptés : les listes appariées entre elles (bloc relu ligne à ligne) et
   une fente répétée dans un même cadre (reprise voulue).
   Les signalements déjà relus sont consignés dans reprise-connus.txt ;
   seul un signalement nouveau est un échec.
   Usage : node outils/reprise.js [data-gram.js] [--maj] */
'use strict';
const fs=require('fs'),path=require('path');
const C=require('./charge.js');
const args=process.argv.slice(2), maj=args.includes('--maj');
const {GRAMMAR}=C.chargerFiches(args.find(a=>!a.startsWith('--')));
const HAN=/[㐀-鿿]/;
const big=s=>{const a=Array.from(s).filter(c=>HAN.test(c)),r=[];for(let i=0;i+1<a.length;i++)r.push(a[i]+a[i+1]);return r;};
const CONNUS=path.join(__dirname,'reprise-connus.txt');
const connus=new Set(fs.existsSync(CONNUS)?fs.readFileSync(CONNUS,'utf8').split('\n').filter(l=>l&&!l.startsWith('#')):[]);
let n=0; const vus=[];
GRAMMAR.forEach(f=>f.gabarits.forEach((ga,gi)=>{
  const compte={}; ga.cadre.forEach(t=>{if(t.s)compte[t.s]=(compte[t.s]||0)+1;});
  C.enumerer(ga).forEach(t=>{n++;
    const toks=t.seg;
    toks.forEach((tk,pos)=>{
      const slot=ga.cadre[pos].s;
      if(!slot)return;
      const grp=((ga.lie||[]).find(g=>g.includes(slot))||[slot]);
      const reste=toks.map((x,j)=>j===pos||(ga.cadre[j].s&&grp.includes(ga.cadre[j].s)&&(ga.cadre[j].s!==slot||compte[slot]>1))?'|':x.h).join('');
      const b=big(tk.h).find(x=>reste.includes(x));
      if(b){const cle=`${f.id}\t${gi+1}\t${C.segHz(toks)}`; if(!vus.includes(cle))vus.push(cle);}
    });
  });
}));
const nouveaux=vus.filter(v=>!connus.has(v));
if(maj){fs.writeFileSync(CONNUS,'# Signalements de reprise lexicale relus et acceptés (fiche, gabarit, phrase).\n'+vus.join('\n')+'\n');}
console.log(`reprise.js — ${n} phrases, ${vus.length} signalements, dont ${vus.length-nouveaux.length} déjà relus.`);
console.log(`Échecs (signalements nouveaux) : ${nouveaux.length}`);
nouveaux.slice(0,60).forEach(v=>console.log('  ✗ '+v.replace(/\t/g,' · ')));
process.exit(nouveaux.length&&!maj?1:0);
