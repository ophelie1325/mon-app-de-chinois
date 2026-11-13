/* diagdom.js — diagnostic de rendu sous jsdom.
   Les treize pages sont remontées hors ligne : chaque <script src> local
   est recopié en clair à sa place exacte, HanziWriter est remplacé par un
   bouchon, les polices Google et la feuille de style sont retirées.
   On attend l’événement « load » (on ne le déclenche pas).
   Sur grammaire.html : les trois sommaires, puis pour chaque fiche tous
   les écrans de découverte, le piège, la fiche entière, et douze sessions
   de douze items dont la composition est vérifiée, chaque item rendu.
   Usage : NODE_PATH=<dossier contenant jsdom> node outils/diagdom.js */
'use strict';
const fs=require('fs'),path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const RACINE=path.resolve(__dirname,'..');
const PAGES=['index','vocabulaire','caracteres','grammaire','ecoute','lecture','production',
  'conversation','traducteur','parcours','hsk','progres','reglages'];
const BUILD=(fs.readFileSync(path.join(RACINE,'core.js'),'utf8').match(/BUILD='([^']+)'/)||[])[1];

let n=0; const echecs=[];
function ok(c,msg){n++; if(!c)echecs.push(msg);}

function monter(page,query){
  let html=fs.readFileSync(path.join(RACINE,page+'.html'),'utf8');
  /* Marqueur : toutes les références ?v= de la page portent BUILD. */
  const vs=[...html.matchAll(/\?v=([0-9a-z]+)/g)].map(m=>m[1]);
  ok(vs.length>0&&vs.every(v=>v===BUILD),`${page} : marqueurs ?v= incohérents (${[...new Set(vs)]}) / BUILD ${BUILD}`);
  html=html.replace(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g,'')
           .replace(/<link rel="stylesheet"[^>]*>/g,'')
           .replace(/<script src="https:[^"]*hanzi-writer[^"]*"><\/script>/,
             '<script>window.HanziWriter={create:()=>({animateCharacter(){},quiz(){},hideCharacter(){},showCharacter(){},setCharacter(){}}),loadCharacterData:()=>Promise.resolve({})};</script>')
           .replace(/<script src="([^":]+?)(\?v=[^"]*)?"><\/script>/g,(m,src)=>{
             const code=fs.readFileSync(path.join(RACINE,src),'utf8');
             return '<script>'+code.replace(/<\/script/gi,'<\\/script')+'\n</script>';
           });
  const erreurs=[];
  const vc=new VirtualConsole();
  vc.on('jsdomError',e=>{const m=String(e&&e.message||e);if(!/Not implemented: window\.(scrollTo|alert)|Could not parse CSS/.test(m))erreurs.push(m);});
  vc.on('error',e=>{const m=String(e&&e.message||e);if(!/Not implemented/.test(m))erreurs.push(m);});
  const dom=new JSDOM(html,{url:'http://localhost/'+page+'.html'+(query||''),runScripts:'dangerously',
    pretendToBeVisual:true,virtualConsole:vc,
    beforeParse(w){w.scrollTo=()=>{};w.speechSynthesis={getVoices:()=>[],speak(){},cancel(){},addEventListener(){}};
      w.SpeechSynthesisUtterance=function(){};w.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
      w.HTMLElement.prototype.scrollIntoView=function(){};w.AudioContext=undefined;}});
  return new Promise(res=>dom.window.addEventListener('load',()=>setTimeout(()=>res({dom,w:dom.window,erreurs}),20)));
}
const app=w=>w.document.getElementById('app').innerHTML;
const casse=h=>/n’a pas pu s’afficher/.test(h);

(async()=>{
  /* 1. Les treize pages : rendu d’accueil sans erreur. */
  for(const p of PAGES){
    const {w,erreurs}=await monter(p);
    const h=app(w);
    ok(h.length>200,`${p} : page d’accueil vide`);
    ok(!casse(h),`${p} : écran d’erreur à l’accueil`);
    ok(!erreurs.length,`${p} : erreurs JS — ${erreurs.slice(0,3).join(' | ')}`);
    w.close();
  }
  /* 2. grammaire.html en détail. */
  const {w,erreurs}=await monter('grammaire');
  const ev=s=>w.eval(s);
  const G=ev('GRAMMAR');
  const rend=(v,c)=>{ev(`view=${JSON.stringify(v)};ctx=${JSON.stringify(c)};render();`);return app(w);};
  for(const lv of [2,3,4]){ev(`S.settings.level=${lv};S.settings.theme='all'`);const h=rend('home',{});ok(!casse(h),'sommaire grammaire niveau '+lv);}
  ev(`S.settings.level=3`);
  const hi=rend('index',{});
  ok(!casse(hi)&&G.every(g=>hi.includes(ev(`esc(${JSON.stringify(g.title)})`))),'index : fiche manquante');
  ok(!/Il reste -|-\d+ fiche/.test(hi),'index : décompte négatif');
  const hs=G.map(g=>g.hsk);
  ok(hi.includes(`${G.length} fiches, du HSK ${Math.min(...hs)} au HSK ${Math.max(...hs)}.`),'index : décompte automatique absent');
  ok(!casse(rend('revoir',{})),'points à revoir');
  for(const g of G){
    const ns=g.steps.length;
    for(let i=0;i<ns;i++){
      const h=rend('decouv',{g:g.id,i});
      ok(!casse(h)&&h.includes(ev(`esc(${JSON.stringify(g.steps[i].t)})`)),`${g.id} écran ${i+1}`);
      (g.steps[i].ex||[]).forEach(e=>ok(h.includes(e.hz),`${g.id} écran ${i+1} : exemple absent ${e.hz}`));
    }
    const hp=rend('decouv',{g:g.id,i:ns});
    ok(!casse(hp)&&hp.includes(g.piege.bad.hz)&&hp.includes(g.piege.good.hz),`${g.id} piège`);
    const hf=rend('fiche',{g:g.id});
    ok(!casse(hf)&&g.steps.every(s=>hf.includes(ev(`esc(${JSON.stringify(s.t)})`))),`${g.id} fiche entière`);
    for(let s=0;s<12;s++){
      ev(`window.__q=buildSession(gById(${JSON.stringify(g.id)}))`);
      const q=ev('window.__q');
      const c={};q.forEach(x=>c[x.t]=(c[x.t]||0)+1);
      const attendu={rep:2,sub:3,comp:2,tra:2,fix:2,reu:1};
      ok(q.length===12&&Object.keys(attendu).every(k=>c[k]===attendu[k]),`${g.id} session ${s+1} : composition ${JSON.stringify(c)}`);
      for(let i=0;i<q.length;i++){
        ev(`view='exos';ctx={g:${JSON.stringify(g.id)},q:window.__q,i:${i},res:[],pose:[],rep:null};render();`);
        const h=app(w);
        ok(!casse(h)&&h.length>100,`${g.id} session ${s+1} item ${i+1} (${q[i].t})`);
      }
    }
  }
  /* Ouverture depuis un parcours. */
  const last=G[G.length-1].id;
  const r2=await monter('grammaire','?g='+last+'&l=x&i=0&n=3');
  ok(r2.w.eval('view')==='decouv'&&r2.w.eval('ctx.g')===last,'ouverture par paramètre ?g=');
  ok(!erreurs.length&&!r2.erreurs.length,'grammaire : erreurs JS — '+erreurs.concat(r2.erreurs).slice(0,3).join(' | '));
  console.log(`diagdom.js — 13 pages, ${G.length} fiches, ${n} contrôles de rendu.`);
  console.log(`Échecs : ${echecs.length}`); echecs.slice(0,60).forEach(e=>console.log('  ✗ '+e));
  process.exit(echecs.length?1:0);
})();
