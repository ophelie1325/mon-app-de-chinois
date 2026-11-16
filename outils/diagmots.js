/* diagmots.js — mots et caractères sous jsdom : 13 pages, pinyinCheck de chaque mot, exemple et caractère, règle d’affichage (leçon commencée, fiche découverte), séances de vocabulaire toutes boîtes, fiche de chaque mot. Lancer : NODE_PATH=<dossier jsdom>/node_modules node outils/diagmots.js */
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('jsdom');
const R=require('path').resolve(__dirname,'..');
const PAGES=['index','grammaire','vocabulaire','caracteres','ecoute','lecture','production',
  'hsk','parcours','progres','reglages','traducteur','conversation'];
let fails=0,checks=0;
const ok=(c,m)=>{checks++;if(!c){fails++;console.log('ÉCHEC',m);}};

function load(page,store){
  let html=fs.readFileSync(path.join(R,page+'.html'),'utf8');
  html=html.replace(/<link[^>]*>/g,'');
  html=html.replace(/<script src="([^"?]+)(\?[^"]*)?"><\/script>/g,(m,src)=>{
    if(/^https?:/.test(src)){
      return /hanzi-writer/i.test(src)?'<script>window.HanziWriter={create:()=>({animateCharacter(){},quiz(){},showCharacter(){},hideCharacter(){},hideOutline(){},showOutline(){},setCharacter(){}})};</script>':'';
    }
    return '<script>'+fs.readFileSync(path.join(R,src),'utf8').replace(/<\/script>/g,'<\\/script>')+'</script>';
  });
  const errs=[];const vc=new VirtualConsole();
  vc.on('jsdomError',e=>{if(!/scrollTo|not implemented/i.test(String(e.message)))errs.push(String(e.message||e).slice(0,300));});
  vc.on('error',e=>errs.push('console.error '+String(e).slice(0,200)));
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
    url:'https://chinese.peiban.fr/'+page+'.html',
    beforeParse(w){
      if(store)for(const k in store)w.localStorage.setItem(k,store[k]);
      w.speechSynthesis={speak(){},cancel(){},getVoices:()=>[],addEventListener(){}};
      w.SpeechSynthesisUtterance=function(){};w.scrollTo=()=>{};
      w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){}});
      w.fetch=()=>Promise.reject(new Error('hors ligne'));
    }});
  return new Promise(res=>dom.window.addEventListener('load',()=>setTimeout(()=>res({w:dom.window,errs}),50)));
}

(async()=>{
  /* 1. Les 13 pages */
  for(const p of PAGES){
    const {w,errs}=await load(p);
    ok(!errs.length,`${p} : erreurs ${errs.join(' | ')}`);
    w.document.querySelectorAll('script,style').forEach(n=>n.remove());const t=w.document.body.textContent.replace(/\s+/g,' ');
    ok(t.length>(p==='hsk'?120:200),`${p} : page quasi vide (${t.length})`);
    ok(!/undefined|NaN|\[object Object\]/.test(t),`${p} : texte suspect`);
  }

  /* 2. Données : les mots versés */
  const {w,errs}=await load('vocabulaire');
  const W=w.WORDS,G=w.GRAMMAR,gid=new Set(G.map(g=>g.id));
  const ids=new Set();
  W.forEach(x=>{
    ok(!ids.has(x.id),'id en double '+x.id);ids.add(x.id);
    ok(Array.isArray(x.th),'th non tableau '+x.id);
    ok(Array.isArray(x.src)&&x.src.length,'src absent '+x.id);
    ok(!/'/.test(x.fr),'apostrophe droite '+x.id);
    const r=w.pinyinCheck(x.hz,x.py);ok(r.ok,`pinyin ${x.hz} ${x.py} : ${r.why}`);
    (x.g||[]).forEach(g=>ok(gid.has(g),'fiche inconnue '+g+' '+x.id));
    if(x.src.indexOf('fiche')>=0)ok((x.g||[]).length>0,'mot de fiche sans fiche '+x.id);
    if(x.ex){
      const r2=w.pinyinCheck(x.ex.hz,x.ex.py);ok(r2.ok,`pinyin exemple ${x.ex.hz} : ${r2.why}`);
      ok(x.ex.hz.indexOf(x.hz)>=0||new RegExp(x.hz.split('').join('.{0,2}')).test(x.ex.hz),'exemple sans le mot '+x.id);
      ok(!/'/.test(x.ex.fr),'apostrophe droite exemple '+x.id);
      /* l’exemple est mot pour mot une phrase de l’une des fiches du mot */
      const vu=G.some(g=>(g.banque||[]).some(b=>b.seg.map(t=>t.h).join('')===x.ex.hz&&b.fr===x.ex.fr&&b.seg.map(t=>t.p).filter(Boolean).join(' ')===x.ex.py));
      const vuT=w.TEXTS.some(t=>(t.lines||[]).some(l=>l.hz===x.ex.hz&&l.py===x.ex.py&&l.fr===x.ex.fr));
      ok(vu||vuT,'exemple absent des fiches et des textes '+x.id);
    }
    if(x.cl)x.cl.forEach(c=>ok(c.length===1,'classificateur '+x.id));
  });
  /* nat et src sur tous les mots */
  W.forEach(x=>ok(Array.isArray(x.nat)&&x.nat.length,'nat absent '+x.id));
  /* CHARS */
  const C=w.CHARS,cid=new Set(),TY=new Set(['picto','indic','ideo','phono']);
  ok(C.length>=500,'CHARS : '+C.length);
  C.forEach(c=>{
    ok(!cid.has(c.id),'id car. en double '+c.id);cid.add(c.id);
    ok(c.hz.length===1,'car. '+c.id);
    const r=w.pinyinCheck(c.hz,c.py);ok(r.ok,`pinyin car. ${c.hz} ${c.py} : ${r.why}`);
    ok(c.fr&&!/'/.test(c.fr),'sens car. '+c.id);
    ok(Array.isArray(c.th),'th car. '+c.id);
    ok(c.cle&&c.cle.hz,'clé '+c.id);
    if(c.type)ok(TY.has(c.type),'type '+c.id);
    if(c.type==='phono'){ok(c.sens||c.son,'phono vide '+c.id);if(c.sens)ok(c.sens.hz&&c.sens.fr,'sens phono '+c.id);
      if(c.son&&c.son.py){const r2=w.pinyinCheck(c.son.hz,c.son.py);ok(r2.ok,`son ${c.hz} ${c.son.hz} ${c.son.py}`);ok(['meme','ton','proche','perdu'].includes(c.son.ecart),'écart '+c.id);}}
    else ok(!c.son,'son hors phono '+c.id);
    ok(W.some(x=>x.hz.indexOf(c.hz)>=0),'caractère sans mot '+c.id);
  });
  W.forEach(x=>x.hz.split('').forEach(ch=>{if(/[\u4e00-\u9fff]/.test(ch))ok(C.some(c=>c.hz===ch),'caractère manquant '+ch);}));
  /* 不 et 一 seuls en forme de dictionnaire */
  ok(W.find(x=>x.hz==='不').py==='bù','不');ok(W.find(x=>x.hz==='一').py==='yī','一');

  /* 3. Mise en sommeil : rien n’est actif tant que rien n’est rencontré */
  const S=w.eval('S');S.settings.theme='all';
  const raz=()=>{S.gram={};S.lessons={};S.items={};};
  raz();
  [1,2,3,4,5,6].forEach(l=>{S.settings.level=l;ok(w.pool().length===0,`HSK ${l} : actifs sans rien rencontré (${w.pool().length})`);});
  ok(w.CHARS.filter(w.carActif).length===0,'caractères actifs sans rien rencontré');
  ok(w.motsLecon().length===70,'motsLecon ≠ 70 : '+w.motsLecon().length);
  ok(W.filter(x=>x.src.indexOf('lecon')>=0).every(x=>w.LESSONS.some(l=>l.hsk===x.hsk&&x.th.indexOf(l.theme)>=0)),'mot de leçon sans leçon');
  /* leçon commencée : ses mots de leçon s’éveillent, eux seuls */
  S.lessons={'l-presenter-2':[0]};S.settings.level=2;
  let P=w.pool();
  ok(P.length>0&&P.every(x=>x.src.indexOf('lecon')>=0&&x.hsk===2&&x.th.indexOf('presenter')>=0),'éveil par la leçon ('+P.length+')');
  console.log('  leçon l-presenter-2 commencée :',P.length,'mots');
  /* étape « Point de langue » de la leçon (g201) : éveille les mots de g201 */
  const L0=w.LESSONS.find(l=>l.id==='l-presenter-2'),ig=L0.steps.findIndex(st=>st.k==='gram');
  S.lessons={'l-presenter-2':[ig]};S.settings.level=1;
  P=w.pool();ok(P.length>0&&P.every(x=>x.g.indexOf('g201')>=0),'éveil par l’étape grammaire ('+P.length+')');
  /* fiche ouverte seule */
  raz();S.gram={g201:{vu:1,essais:0,best:0}};
  P=w.pool();ok(P.length>0&&P.every(x=>x.g.indexOf('g201')>=0),'éveil par la fiche ('+P.length+')');
  console.log('  HSK 1 actifs après g201 :',P.length,P.map(x=>x.hz).join(' '));
  const C1=w.CHARS.filter(w.carActif);
  ok(C1.every(c=>w.motsActifs().some(x=>x.hz.indexOf(c.hz)>=0)),'caractères éveillés');
  console.log('  caractères éveillés après g201 :',C1.map(c=>c.hz).join(' '));
  /* un mot déjà travaillé ne se rendort pas */
  raz();S.items={w201:{box:2,due:0,seen:1,ok:1,ko:0,kos:0,last:''}};S.settings.level=2;
  ok(w.pool().length===1,'mot travaillé rendormi');
  raz();

  /* 4. Séances de vocabulaire sur les mots versés, toutes boîtes */
  S.settings.level=1;raz();G.forEach(g=>S.gram[g.id]={vu:1,essais:0,best:0});
  P=w.pool();ok(P.length===W.filter(x=>x.hsk===1&&x.src.indexOf('fiche')>=0&&x.src.indexOf('lecon')<0).length,'HSK 1 tout activé : '+P.length);
  let items=0;
  for(let b=0;b<=5;b++){
    P.forEach(x=>{S.items[x.id]={box:b,due:0,seen:3,ok:2,ko:1,kos:0,last:''};});
    for(let s=0;s<4;s++){
      w.eval('ctx={}');w.lancer(w.pool());const A0=w.eval('ctx').session&&w.eval('ctx').session.asso;if(A0)A0.fini=true;
      let n=0;
      const C=()=>w.eval('ctx');
      while(C().session&&!C().session.done&&n<40){
        let html='';
        try{html=w.vVocab();}catch(e){ok(false,`séance b${b} : ${e.message}`);break;}
        ok(!/undefined|NaN/.test(html.replace(/<[^>]+>/g,'')),`séance b${b} texte suspect : ${html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,160)}`);
        items++;n++;
        try{w.vSkip();}catch(e){ok(false,`vSkip b${b} : ${e.message}`);break;}
      }
      try{w.vVocab();}catch(e){ok(false,'écran de fin '+e.message);}
    }
  }
  console.log('  items de séance rendus :',items);
  /* fiche de chaque mot (nouvel écran) */
  let fm=0;
  W.forEach(x=>{try{w.eval(`ctx={id:${JSON.stringify(x.id)}}`);const h=w.vMot();fm++;
    const t=h.replace(/<[^>]+>/g,' ');ok(!/undefined|NaN|\[object Object\]/.test(t),'fiche mot texte suspect '+x.id+' : '+t.replace(/\s+/g,' ').slice(0,120));
    ok(t.indexOf(x.hz)>=0,'fiche mot sans le mot '+x.id);
    if(x.ex)ok(t.replace(/[。？！，\s]/g,'').indexOf(x.ex.hz.replace(/[。？！，\s]/g,'').slice(0,4))>=0,'fiche mot sans exemple '+x.id);}
    catch(e){ok(false,'vMot '+x.id+' : '+e.message);}});
  console.log('  fiches de mot rendues :',fm);
  try{w.eval("ctx={}");const h=w.vVocab();ok(h.length>200,'accueil vocabulaire');}catch(e){ok(false,'accueil vocabulaire '+e.message);}
  ok(!errs.length,'vocabulaire : '+errs.join(' | '));
  console.log(`${checks} contrôles, ${fails} échec(s)`);
  process.exit(fails?1:0);
})();
