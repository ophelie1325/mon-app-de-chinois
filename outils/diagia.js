/* diagia.js — fiches de caractère faites par l’IA (mots gardés depuis le traducteur), réponse du modèle simulée. Lancer : NODE_PATH=<dossier jsdom>/node_modules node outils/diagia.js */
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('jsdom');
const R=require('path').resolve(__dirname,'..');let f=0,n=0;const ok=(c,m)=>{n++;if(!c){f++;console.log('ÉCHEC',m);}};
function load(page){
  let html=fs.readFileSync(path.join(R,page+'.html'),'utf8').replace(/<link[^>]*>/g,'');
  html=html.replace(/<script src="([^"?]+)(\?[^"]*)?"><\/script>/g,(m,src)=>/^https?:/.test(src)?'':'<script>'+fs.readFileSync(path.join(R,src),'utf8').replace(/<\/script>/g,'<\\/script>')+'</script>');
  const errs=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/scrollTo|not implemented/i.test(e.message))errs.push(e.message)});
  const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,url:'https://chinese.peiban.fr/'+page+'.html',
    beforeParse(w){w.speechSynthesis={speak(){},cancel(){},getVoices:()=>[],addEventListener(){}};w.SpeechSynthesisUtterance=function(){};w.scrollTo=()=>{};
      w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){}});
      w.fetch=async u=>({ok:true,json:async()=>({strokes:new Array(24).fill('M')})});}});
  return new Promise(r=>dom.window.addEventListener('load',()=>setTimeout(()=>r({w:dom.window,errs}),50)));
}
(async()=>{
  const {w,errs}=await load('vocabulaire');
  const S=w.eval('S');S.settings.provider='gemini';S.settings.apikey='x';
  const C='鹰';ok(!w.DATA('CHARS').some(c=>c.hz===C),'鹰 déjà dans CHARS');
  ok(w.pinyinCheck(C,'yīng').ok,'pinyinCheck 鹰 yīng : '+JSON.stringify(w.pinyinCheck(C,'yīng')));
  S.fav.unshift({id:'ftest',hz:'老鹰',py:'lǎo yīng',fr:'aigle',type:'mot',exs:[],syn:[],vois:[],decomp:[],t:Date.now()});
  ok(w.carsSansFiche('老鹰').join('')===C,'carsSansFiche');
  w.eval("ctx={id:'ftest'}");let h=w.vMot();ok(h.indexOf('Créer la fiche de')>=0,'bouton absent');
  /* réponse simulée */
  w.askJSON=async()=>({py:'yīng',fr:'aigle, faucon',cle:{hz:'鸟',fr:'oiseau'},type:'phono',sens:{hz:'鸟',fr:'oiseau'},son:{hz:'䧹',py:'yīng'},struct:'hb'});
  const k=await w.creerFichesIA('老鹰',{hz:'老鹰',py:'lǎo yīng'});
  ok(k===1,'créées '+k);const F=S.charsIA[C];
  ok(F&&F.id==='cia_鹰'&&F.ia&&F.traits===24&&F.struct==='hb'&&F.cle.hz==='鸟','fiche '+JSON.stringify(F));
  ok(F.type==='phono'&&F.son&&F.son.ecart==='meme','son/écart '+JSON.stringify(F.son));
  ok(w.DATA('CHARS').some(c=>c.hz===C),'DATA(CHARS) sans la fiche IA');
  ok(w.DATA('CHARS').length===w.CHARS.length+1,'compte DATA');
  ok(w.carActif(F),'carActif');
  w.eval("ctx={id:'ftest'}");h=w.vMot();ok(h.indexOf('Créer la fiche de')<0,'bouton resté');
  ok(h.indexOf('aigle, faucon')>=0||h.indexOf('鸟')>=0,'composition du mot sans la fiche IA');
  /* type douteux → pas de type ; lecture fausse → refus */
  delete S.charsIA[C];
  w.askJSON=async()=>({py:'yīng',fr:'aigle',cle:{hz:'鸟',fr:'oiseau'},type:'inconnu',sens:{hz:'',fr:''},son:{hz:'',py:''},struct:'inconnu'});
  await w.creerFichesIA('老鹰');ok(!S.charsIA[C].type&&!S.charsIA[C].struct&&!S.charsIA[C].son,'inconnu → rien '+JSON.stringify(S.charsIA[C]));
  delete S.charsIA[C];
  w.askJSON=async()=>({py:'māo',fr:'chat',cle:{hz:'鸟',fr:''},type:'picto',sens:{hz:'',fr:''},son:{hz:'',py:''},struct:'hb'});
  let rej=false;try{await w.creerFichesIA('老鹰',{hz:'老鹰',py:'lǎo yīng'});}catch(e){rej=true;}ok(rej&&!S.charsIA[C],'lecture fausse acceptée');
  /* une fiche officielle l’emporte */
  S.charsIA['好']={id:'cia_好',hz:'好',py:'hǎo',fr:'x',ia:true};
  ok(w.DATA('CHARS').filter(c=>c.hz==='好').length===1&&!w.DATA('CHARS').find(c=>c.hz==='好').ia,'doublon officiel');
  delete S.charsIA['好'];
  ok(!errs.length,'erreurs vocabulaire '+errs.join('|'));
  /* écran Caractères : fiche IA rendue avec la mention */
  const P=await load('caracteres');const S2=P.w.eval('S');
  S2.fav.unshift({id:'ftest',hz:'老鹰',py:'lǎo yīng',fr:'aigle',type:'mot',t:1});
  S2.charsIA[C]={id:'cia_鹰',hz:C,py:'yīng',fr:'aigle, faucon',hsk:null,th:[],ia:true,cle:{hz:'鸟',fr:'oiseau'},type:'phono',sens:{hz:'鸟',fr:'oiseau'},son:{hz:'䧹',py:'yīng',ecart:'meme'},traits:24,struct:'hb'};
  ok(P.w.crVus().has('cia_鹰'),'crVus');
  P.w.eval("ctx={id:'cia_鹰'}");const hc=P.w.vCar();
  ok(hc.indexOf('fiche faite par l’IA')>=0,'mention IA');ok(!/undefined|NaN/.test(hc.replace(/<[^>]+>/g,'')),'texte suspect');
  P.w.eval("ctx={}");const ha=P.w.vChars();ok(ha.indexOf(C)>=0,'鹰 absent de l’accueil Caractères');
  ok(!P.errs.length,'erreurs caracteres '+P.errs.join('|'));
  console.log(n+' contrôles, '+f+' échec(s)');
})();
