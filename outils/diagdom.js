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
  /* Accueil porcelaine (lot 1) : chemin de chaque niveau, familles,
     recherche, pastilles, panneau Filtres, et plus aucune boîte visible. */
  const niv=[...new Set(G.map(g=>g.hsk))];
  for(const lv of niv){
    ev(`GF={q:'',pill:'toutes',mode:'ordre',lvl:${lv},fam:'',oral:false,ouvert:false,anim:false}`);
    const h=rend('home',{});
    const titres=G.filter(g=>g.hsk===lv).map(g=>ev(`esc(${JSON.stringify(g.title)})`));
    ok(!casse(h)&&titres.every(t=>h.includes(t)),'chemin HSK '+lv+' : fiche manquante');
    ok((h.match(/class="gr-st/g)||[]).length===titres.length,'chemin HSK '+lv+' : nombre de lignes');
    ok((h.match(/gr-st next/g)||[]).length<=1,'chemin HSK '+lv+' : plusieurs « prochaine fiche »');
  }
  const ordre=ev('ordreProg().map(g=>g.id)');
  ok(ordre.length===G.length&&new Set(ordre).size===G.length,'ordre du programme : fiches perdues');
  ok(ordre.indexOf('gO2')>ordre.indexOf('g210')&&ordre.indexOf('gO2')<ordre.indexOf('g301')&&ordre.indexOf('gO3')===ordre.length-1-G.filter(g=>g.hsk>3).length,'ordre du programme : reprises orales mal placées');
  ev(`GF.mode='famille'`);
  const hfa=rend('home',{});
  ok(ev('FAM').every(f=>!G.some(g=>g.fam===f.k)||hfa.includes(f.n.replace(/’/g,'’'))),'familles : tuile manquante');
  ok((hfa.match(/class="gr-fam"/g)||[]).length===ev('FAM').filter(f=>G.some(g=>g.fam===f.k)).length,'familles : nombre de tuiles');
  ev(`grFamille('verbe')`);
  const hv=app(w);
  ok(ev(`GF.mode`)==='ordre'&&!/Autour du nom<span/.test(hv)&&hv.includes('gr-chipf'),'famille : filtre du chemin');
  const cherche=(q,id,doit)=>{ev(`GF={q:${JSON.stringify(q)},pill:'toutes',mode:'ordre',lvl:3,fam:'',oral:false,ouvert:false,anim:false}`);
    const h=rend('home',{});const t=ev(`esc(gById(${JSON.stringify(id)}).title)`);ok(!casse(h)&&h.includes(t)===doit,`recherche « ${q} » → ${id} ${doit?'absente':'présente à tort'}`);};
  cherche('把','g307',true);cherche('comparer','g208',true);cherche('COMPARER','g311',true);cherche('passe','g203',false);
  cherche('是…的','g301',true);cherche('zzzz','g301',false);
  for(const p of ['toutes','decouvrir','revoir','fragiles']){ev(`GF={q:'',pill:'${p}',mode:'ordre',lvl:3,fam:'',oral:false,ouvert:true,anim:true}`);
    const h=rend('home',{});ok(!casse(h)&&h.includes('vb-panel'),'pastille '+p+' et panneau Filtres');}
  ev(`GF={q:'',pill:'toutes',mode:'ordre',lvl:3,fam:'',oral:true,ouvert:false,anim:false}`);
  const ho=rend('home',{});
  ok(G.filter(g=>g.hsk===3).every(g=>ho.includes(ev(`esc(${JSON.stringify(g.title)})`))===ev(`ficheOrale(gById(${JSON.stringify(g.id)}))`)),'filtre oral');
  /* États : une fiche fragile, une sue à revoir, une découverte non exercée. */
  ev(`S.items.g303={box:0,due:0,seen:3,ok:1,ko:2};S.items.g304={box:5,due:0,seen:6,ok:6,ko:0};S.gram=S.gram||{};S.gram.g305={vu:1,essais:0,best:0}`);
  ok(ev(`etatFiche('g303')`)==='frag'&&ev(`etatFiche('g304')`)==='su'&&ev(`aRevoirFiche('g304')`)&&ev(`etatFiche('g305')`)==='cours'&&ev(`etatFiche('g306')`)==='neuf','états des fiches');
  ev(`GF={q:'',pill:'revoir',mode:'ordre',lvl:3,fam:'',oral:false,ouvert:false,anim:false}`);
  const hr=rend('home',{});
  ok(hr.includes(ev(`esc(gById('g303').title)`))&&hr.includes(ev(`esc(gById('g304').title)`))&&!hr.includes(ev(`esc(gById('g306').title)`)),'pastille À revoir');
  ok(/2<\/b><small>à revoir/.test(hr),'carte du jour : décompte');
  ev(`GF.pill='fragiles'`);const hfr=rend('home',{});
  ok(hfr.includes(ev(`esc(gById('g303').title)`))&&!hfr.includes(ev(`esc(gById('g304').title)`)),'pastille Fragiles');
  ok(!casse(rend('index',{}))&&!casse(rend('revoir',{})),'anciennes vues index et revoir');
  /* Plus aucune boîte affichée dans le module. */
  const ecrans=[rend('home',{}),rend('fiche',{g:'g303'}),rend('fiche',{g:'g201'})];
  ev(`window.__q=buildSession(gById('g303'))`);
  ev(`view='exos';ctx={g:'g303',q:window.__q,i:12,res:[1,1,1,1,1,1,1,1,1,1,1,1],pose:[],rep:null};render();`);ecrans.push(app(w));
  ev(`view='exos';ctx={g:'g304',q:window.__q,i:12,res:[0,0,0,0,0,0,0,0,0,0,0,0],pose:[],rep:null};render();`);ecrans.push(app(w));
  ok(ecrans.every(h=>!/[Bb]oîte\s*\d|en boîte/.test(h)),'une boîte est encore affichée');
  ev(`S.items={};S.gram={}`);
  /* Étudiée dans… */
  const hg=rend('fiche',{g:'g201'});
  ok(hg.includes('Étudiée dans')&&hg.includes("versLecon('l-presenter-2')"),'g201 : lien vers sa leçon');
  const hp3=rend('fiche',{g:'g331'});
  ok(hp3.includes('Étudiée dans')&&hp3.includes('pas encore écrite'),'g331 : leçon pas encore écrite');
  for(const g of G){const h=rend('fiche',{g:g.id});ok(!casse(h)&&h.includes('Étudiée dans'),g.id+' : « Étudiée dans… » absent');}
  /* La fiche en cartes (lot 2) : une carte par emploi, le piège, le
     récapitulatif. Chaque exemple découpé en mots garde exactement ses
     caractères et ses syllabes ; chaque animation aussi. */
  const plat=h=>h.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,'').replace(/\s+/g,'');
  const net=x=>String(x).replace(/[，。？！、；：“”‘’（）《》…—,.?!;:\s]/g,'');
  const syl=py=>ev(`sylls(${JSON.stringify(py)})`).join(' ');
  let nAnim=0,nMots=0;
  for(const g of G){
    const ns=g.steps.length;
    const nc=ns+(g.piege?1:0)+1;
    ev(`S.gram={}`);
    for(let c=0;c<nc;c++){
      const h=rend('fiche',{g:g.id,c});
      ok(!casse(h)&&(h.match(/class="gr-slide/g)||[]).length===nc,`${g.id} carte ${c+1} : nombre de cartes`);
      ok(ev('ctx.c')===c&&new RegExp('gr-slide on[^>]*>').test(h),`${g.id} carte ${c+1} : carte active`);
      if(c===0){
        const hanSeul=x=>(String(x).match(/[\u3400-\u9fff]/g)||[]).join('');
        const T=hanSeul(plat(h));
        g.steps.forEach((st,i)=>{
          ok(h.includes(ev(`esc(${JSON.stringify(st.t)})`)),`${g.id} carte ${i+1} : titre absent`);
          (st.ex||[]).forEach(e=>ok(T.includes(hanSeul(e.hz)),`${g.id} carte ${i+1} : exemple absent ${e.hz}`));
        });
        if(g.piege)ok(h.includes(g.piege.bad.hz)&&h.includes(g.piege.good.hz),`${g.id} piège`);
        if(g.tableau)ok(g.tableau.rows.every(r=>r.every(x=>h.includes(ev(`esc(${JSON.stringify(x)})`)))),`${g.id} récapitulatif incomplet`);
        ok(h.includes(`grSeance(['${g.id}'])`)&&h.includes('Étudiée dans'),`${g.id} récapitulatif : exercices ou leçon`);
        ok(!/[Bb]oîte\s*\d|en boîte/.test(h),`${g.id} : boîte affichée`);
        /* Découpage : caractères et syllabes intacts. */
        g.steps.forEach((st,i)=>(st.ex||[]).forEach(e=>{
          const t=ev(`decoupe(${JSON.stringify(e.hz)},${JSON.stringify(e.py)},gById(${JSON.stringify(g.id)}))`);
          if(!t)return;
          nMots++;
          ok(t.map(x=>x.h).join('')===e.hz,`${g.id} : découpage perd des caractères ${e.hz}`);
          ok(t.filter(x=>!x.pon).map(x=>x.p).join(' ')===syl(e.py),`${g.id} : découpage décale le pinyin ${e.hz}`);
          t.forEach(x=>{if(!x.pon)ok(x.p.split(' ').length===[...x.h].length,`${g.id} : ${x.h} / ${x.p}`);});
          t.forEach(x=>{if(x.id)ok(ev(`DATA('WORDS').some(w=>w.id===${JSON.stringify(x.id)}&&w.hz===${JSON.stringify(x.h)})`),`${g.id} : lien vers un mot inexistant ${x.h}`);});
        }));
        /* Animations : chaque côté redonne une phrase de la fiche, avec ses syllabes. */
        const D=new w.DOMParser().parseFromString('<div>'+h+'</div>','text/html');
        D.querySelectorAll('.gr-stage[data-anim="transfo"],.gr-stage[data-anim="piege"]').forEach(stg=>{
          nAnim++;
          const tk=[...stg.querySelectorAll('.gr-tk')];
          const cote=k=>tk.filter(x=>+x.dataset[k]>=0).sort((x,y)=>x.dataset[k]-y.dataset[k]);
          const A=cote('a'),B=cote('b');
          const hz=L=>L.map(x=>x.querySelector('.h').textContent).join('');
          const py=L=>L.map(x=>x.querySelector('.p').textContent.trim()).join(' ').replace(/\s+/g,' ');
          let sa,sb;
          if(stg.dataset.anim==='piege'){sa=g.piege.bad;sb=g.piege.good;}
          else{const tr=(g.transfo||[]).find(t=>net(t.de.hz)===hz(A)&&net(t.vers.seg.map(x=>x.h).join(''))===hz(B));
            if(!tr){ok(false,`${g.id} : transformation introuvable ${hz(A)}`);return;}
            sa=tr.de;sb={hz:tr.vers.seg.map(x=>x.h).join(''),py:tr.vers.seg.map(x=>x.p).filter(Boolean).join(' ')};}
          ok(hz(A)===net(sa.hz)&&py(A)===syl(sa.py),`${g.id} animation, départ : ${hz(A)} / ${py(A)}`);
          ok(hz(B)===net(sb.hz)&&py(B)===syl(sb.py),`${g.id} animation, arrivée : ${hz(B)} / ${py(B)}`);
        });
        D.querySelectorAll('.gr-stage[data-anim="moule"] .gr-slot.var').forEach(sl=>{
          nAnim++;
          const hh=sl.querySelector('.h').textContent,pp=sl.querySelector('.p').textContent.trim();
          ok(g.gabarits.some(ga=>Object.values(ga.listes).some(l=>l.some(x=>x.h===hh&&x.p.replace(/\s+/g,' ')===pp.replace(/\s+/g,' ')))),`${g.id} moule : ${hh} / ${pp}`);
        });
      }
    }
    ok(ev(`gRec(${JSON.stringify(g.id)}).vu`)===1,`${g.id} : dernière carte sans « vue »`);
    const hd=rend('decouv',{g:g.id,i:1});
    ok(!casse(hd)&&ev('view')==='fiche'&&ev('ctx.c')===1,`${g.id} : ancienne découverte`);
    ev(`ctx={g:${JSON.stringify(g.id)},c:0};view='fiche';render();grCarte(1)`);
    ok(ev('ctx.c')===1&&w.document.querySelectorAll('.gr-slide.on').length===1&&w.document.querySelectorAll('.gr-slide')[1].classList.contains('on'),`${g.id} : grCarte`);
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
  /* La séance mêlée (lot 3) : panneau, composition, chaque exercice
     rendu, fin de séance et notation des fiches. */
  ev(`S.items={};S.gram={};['g303','g307','g313'].forEach(id=>{S.gram[id]={vu:1,essais:0,best:0};S.items[id]={box:1,due:0,seen:2,ok:1,ko:1};})`);
  ev(`view='home';ctx={};GS.dur=0;grSeance()`);
  let hs=app(w);
  ok(hs.includes('Réviser ma grammaire')&&hs.includes('gr-sheet')&&ev('GS.mode')==='revoir'&&(hs.match(/class="gr-chk on"/g)||[]).length===3,'panneau de séance : mode « à revoir »');
  ok(/Environ 20 exercices, 3(&nbsp;| |\u00A0)notions mêlées/.test(hs),'panneau : estimation — '+(hs.match(/gr-sum">([^<]*)/)||[])[1]);
  ev(`grSeanceDuree(5)`);ok(app(w).includes('Environ 10 exercices'),'panneau : durée 5 min');
  ev(`ctx={g:'g307',c:0};view='fiche';GS.ouvert=false;grSeance(['g307'])`);
  hs=app(w);
  ok(ev('GS.mode')==='choix'&&ev('Object.keys(GS.choix).join()')==='g307'&&hs.includes('gr-slide')&&hs.includes('gr-sheet'),'panneau depuis la fiche');
  ev(`grSeanceDuree(10);grSeanceLancer()`);
  ok(ev('view')==='exos'&&ev('ctx.q.length')===20&&ev('ctx.q.every(x=>x.g==="g307")')&&ev('!!ctx.seance'),'séance d’une fiche lancée');
  const TYPES=['rep','sub','comp','tra','fix','reu','dic','dire'];
  const essais=[[['g307'],10,false],[['g303','g307','g313'],5,true],[['g303','g307','g313'],20,true],[G.slice(0,8).map(g=>g.id),15,false],[G.map(g=>g.id),20,true]];
  for(const [ids,dur,parler] of essais){
    const Q=ev(`composerSeance(${JSON.stringify(ids)},${dur*2},${parler})`);
    const tag=`séance ${ids.length} fiche(s), ${dur} min${parler?', parler':''}`;
    ok(Q.length===dur*2,`${tag} : ${Q.length} exercices`);
    ok(Q.every(x=>ids.indexOf(x.g)>=0&&TYPES.indexOf(x.t)>=0),`${tag} : exercice hors notions`);
    ok(ids.length===1||Q.every(x=>x.t!=='reu'),`${tag} : réemploi dans une séance mêlée`);
    ok(parler||Q.every(x=>x.t!=='dire'),`${tag} : « Dire » sans micro`);
    ok(!parler||Q.some(x=>x.t==='dire')||Q.length<4,`${tag} : aucun « Dire »`);
    ok(Q.some(x=>x.t==='dic'),`${tag} : aucune dictée`);
    ok(ids.length===1||Math.min(...ids.slice(0,Math.min(ids.length,dur*2)).map(id=>Q.filter(x=>x.g===id).length))>=1,`${tag} : notion absente`);
    ok(Q[0].t!=='dire'&&Q.every((x,k)=>k===0||!(x.t==='dire'&&Q[k-1].t==='dire')),`${tag} : « Dire » en tête ou deux fois de suite`);
    ev(`window.__q=composerSeance(${JSON.stringify(ids)},${dur*2},${parler})`);
    const nq=ev('window.__q.length');
    for(let i=0;i<nq;i++){
      ev(`view='exos';ctx={g:${JSON.stringify(ids[0])},q:window.__q,i:${i},res:[],pose:[],rep:null,seance:{ids:${JSON.stringify(ids)},dur:${dur},parler:${parler}}};render();`);
      const h=app(w),t=ev(`window.__q[${i}].t`);
      ok(!casse(h)&&h.length>100&&h.includes('Exercice '+(i+1)+' sur '+nq),`${tag} : exercice ${i+1} (${t})`);
      if(t==='dic'){const A=w.document.getElementById('app').cloneNode(true);A.querySelectorAll('.tiles,.drop').forEach(x=>x.remove());ok(h.includes('Écouter la phrase')&&!A.textContent.replace(/\s+/g,'').includes(ev(`segHz(window.__q[${i}].s.seg)`)),`${tag} : la dictée montre la phrase`);}
      if(t==='dire')ok(h.includes(ev(`esc(window.__q[${i}].s.fr)`))&&h.includes('Voir la phrase en chinois'),`${tag} : « Dire »`);
    }
    /* Fin : moitié juste, et notation de chaque fiche. */
    ev(`S.items={};S.gram={}`);
    ev(`view='exos';ctx={g:${JSON.stringify(ids[0])},q:window.__q,i:window.__q.length,res:window.__q.map((x,k)=>k%2),pose:[],rep:null,seance:{ids:${JSON.stringify(ids)},dur:${dur},parler:${parler}}};render();`);
    const hf=app(w);
    ok(!casse(hf)&&hf.includes('Séance terminée')&&hf.includes('du premier coup'),`${tag} : fin de séance`);
    const notees=ev(`${JSON.stringify(ids)}.filter(id=>window.__q.filter(x=>x.g===id&&x.t!=='dire').length>=2)`);
    ok(notees.every(id=>ev(`gRec(${JSON.stringify(id)}).essais`)===1&&ev(`!!S.items[${JSON.stringify(id)}]`)),`${tag} : fiches non notées`);
    ev(`render()`);
    ok(notees.every(id=>ev(`gRec(${JSON.stringify(id)}).essais`)===1),`${tag} : notée deux fois`);
  }
  ev(`S.items={};S.gram={};GS.ouvert=false`);
  /* Ouverture depuis un parcours, et retour à la leçon. */
  const last=G[G.length-1].id;
  const r2=await monter('grammaire','?g='+last+'&l=l-presenter-2&i=3&n=9');
  ok(r2.w.eval('view')==='fiche'&&r2.w.eval('ctx.g')===last&&r2.w.eval('ctx.from.l')==='l-presenter-2'&&r2.w.eval('ctx.from.i')===3,'ouverture par paramètre ?g=&l=&i=');
  ok(r2.w.eval('window.RETOUR_HIST')===true,'retour vers la leçon (historique)');
  ok(app(r2.w).includes('finishStep()'),'ruban de leçon absent');
  r2.w.eval('finishStep()');
  ok(JSON.stringify(r2.w.eval('S.lessons["l-presenter-2"]'))==='[3]','finishStep : étape non notée');
  ok(r2.erreurs.every(e=>/navigation/i.test(e)),'grammaire depuis une leçon : erreurs JS — '+r2.erreurs.slice(0,3).join(' | '));
  const src=fs.readFileSync(path.join(RACINE,'page-parcours.js'),'utf8');
  ok(/location\.href='grammaire\.html\?g='/.test(src)&&!/go\('gram'/.test(src),'openStep : lien vers grammaire.html');
  ok(/location\.replace\('parcours\.html\?l='/.test(fs.readFileSync(path.join(RACINE,'core.js'),'utf8')),'finishStep : retour vers parcours.html');
  const r3=await monter('parcours','?l=l-presenter-2&fait=3');
  ok(r3.w.eval('view')==='lecon'&&r3.w.eval('ctx.l')==='l-presenter-2'&&app(r3.w).includes('Se présenter — HSK 2'),'parcours.html?l= : leçon non ouverte');
  ok(r3.w.eval('stack.length')===1&&r3.w.eval('stack[0][0]')==='parcours','parcours.html?l= : retour vers le chemin');
  ok(!r3.erreurs.length,'parcours.html?l= : erreurs JS — '+r3.erreurs.slice(0,3).join(' | '));
  const r4=await monter('parcours','?l=inconnue');
  ok(r4.w.eval('view')==='parcours'&&!r4.erreurs.length,'parcours.html?l=inconnue');
  ok(!erreurs.length,'grammaire : erreurs JS — '+erreurs.slice(0,3).join(' | '));
  console.log(`fiche en cartes : ${nMots} exemples découpés, ${nAnim} animations et cases de moule contrôlées`);
  console.log(`diagdom.js — 13 pages, ${G.length} fiches, ${n} contrôles de rendu.`);
  console.log(`Échecs : ${echecs.length}`); echecs.slice(0,60).forEach(e=>console.log('  ✗ '+e));
  process.exit(echecs.length?1:0);
})();
