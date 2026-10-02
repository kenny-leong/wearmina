'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const small=()=>innerWidth<=700;
const SEG=24, SHOW='Queen of Tears', SITE='wearmina.com';
const usd=n=>'$'+n.toLocaleString('en-US');
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

// Illustrated figures: x = centre, y = top of head, s = scale (feet land on y=820 of the 1600x900 frame).
const FIG={
 's1-haein':{x:560,y:126,s:.92,look:'hq1'}, 's1-hyunwoo':{x:1010,y:77,s:.985,look:'mq1'},
 's2-haein':{x:590,y:126,s:.92,look:'hq2'}, 's2-hyunwoo':{x:1020,y:77,s:.985,look:'mq2'},
 's3-haein':{x:720,y:100,s:.955,look:'hq3'}, 's4-haein':{x:860,y:100,s:.955,look:'hq4'},
};
// Demo retailers (fictional) for unidentified pieces and for the cheaper alternatives.
const A=(a,b,c)=>[['Dalbit Studio',a],['Line 2',b],['Everyday Mapo',c]];

// A reel is a list of scenes plus the items tagged in them. Each scene runs SEG seconds.
// shots: dt = start within the scene, z = zoom, cx/cy = frame centre, par = backdrop lag, img = still (stills reel only).
// base = simulated timecode (s) where the clip starts in its episode.
const REELS={};
// ---- stills: real frames supplied in frames/. Tags sit at image fractions: at[shot] = [u,v, boxU1,boxV1,boxU2,boxV2].
if(FRAMES['pink-wide'])REELS.stills={label:'Stills',
 scenes:[
  {id:'p1',ep:1,base:9*60+42,name:'Queens Department Store, flashback',
   shots:[{dt:0,img:'pink-wide',z:1.25,cx:.5,cy:.55,par:.6},{dt:10,img:'pink-close',z:1.12,cx:.5,cy:.52,par:.6}],
   subs:[[1,8,'[department store chatter]'],[11,22,'[soft strings]']]},
  {id:'p2',ep:null,base:27*60+15,name:'Queens Department Store',
   shots:[{dt:0,img:'knit',z:1,cx:.5,cy:.5,par:.6},{dt:11,img:'knit',z:1.45,cx:.5,cy:.43,par:.6}],
   subs:[[1,9,'[heels on marble]'],[12,22,'[piano theme]']]},
 ],
 items:[
  {id:'p1-jacket',sc:0,who:'Hae-in',name:'Glaze Tweed Light jacket',short:'Tweed jacket',brand:'Valentino',price:null,url:'valentino.com',conf:98,side:'r',shot:1,cat:'apparel',alts:A(240,119,69),at:{0:[.54,.415,.445,.33,.615,.50],1:[.72,.725,.20,.42,.88,1]}},
  {id:'p1-blouse',sc:0,who:'Hae-in',name:'Georgette bow blouse',short:'Bow blouse',brand:'Valentino',price:null,url:'valentino.com',conf:96,side:'l',shot:1,cat:'apparel',alts:A(110,49,29),at:{1:[.44,.62,.33,.42,.56,.98]}},
  {id:'p1-skirt',sc:0,who:'Hae-in',name:'Glaze Tweed Light mini skirt',short:'Tweed mini skirt',brand:'Valentino',price:null,url:'valentino.com',conf:95,side:'r',shot:0,cat:'apparel',alts:A(130,59,35),at:{0:[.56,.55,.455,.48,.61,.605]}},
  {id:'p1-bag',sc:0,who:'Hae-in',name:'Locò small shoulder bag',short:'Locò shoulder bag',brand:'Valentino Garavani',price:null,url:'valentino.com',conf:97,side:'l',shot:0,cat:'acc',alts:A(180,79,39),at:{0:[.50,.653,.455,.62,.545,.69]}},
  {id:'p2-dress',sc:1,who:'Hae-in',name:'Collared knit mini dress',short:'Knit mini dress',brand:'Dalbit Studio',price:185,similar:1,conf:88,side:'l',shot:0,cat:'apparel',alts:[['Hanok Row',120],['Line 2',69],['Everyday Mapo',45]],at:{0:[.42,.47,.21,.335,.82,.895],1:[.42,.47,.21,.335,.82,.895]}},
  {id:'p2-belt',sc:1,who:'Hae-in',name:'Square-buckle leather belt',short:'Leather belt',brand:'Hanok Row',price:48,similar:1,conf:85,side:'r',shot:1,cat:'acc',alts:[['Line 2',32],['Seorae Supply',24],['Everyday Mapo',15]],at:{0:[.535,.685,.31,.655,.70,.715],1:[.535,.685,.31,.655,.70,.715]}},
  {id:'p2-bag',sc:1,who:'Hae-in',name:'Black leather tote',short:'Leather tote',brand:'Sora Sora',price:160,similar:1,conf:83,side:'r',shot:0,cat:'acc',alts:[['Dalbit Studio',110],['Line 2',59],['Everyday Mapo',39]],at:{0:[.815,.89,.69,.83,1,1]}},
 ]};
// ---- illustrated: original artwork. a = tag anchor, b = bounding box, in figure-local units.
// price = null when no public price was found; noEp marks pieces documented for the series but not pinned to this episode.
REELS.art={label:'Illustrated',
 scenes:[
  {id:'s1',fx:0,ep:1,base:12*60+8,name:'Queens Department Store',figs:['s1-haein','s1-hyunwoo'],
   shots:[{dt:0,z:1,cx:.5,cy:.5,par:.4},{dt:8,z:1.7,cx:.32,cy:.38,par:1},{dt:16,z:1.5,cx:.62,cy:.40,par:1}],
   subs:[[1,6.5,'[soft piano over the store PA]'],[9,15,'[heels on marble]'],[17,23,'[camera shutters clicking]']]},
  {id:'s2',fx:1,ep:6,base:48*60+20,name:'Sanssouci Palace, Potsdam',figs:['s2-haein','s2-hyunwoo'],
   shots:[{dt:0,z:1,cx:.5,cy:.5,par:.4},{dt:8,z:1.6,cx:.36,cy:.40,par:1},{dt:17,z:1.3,cx:.62,cy:.45,par:1}],
   subs:[[1,6.5,'[wind through the vineyard terraces]'],[9,16,'[strings swell]'],[18,23,'[footsteps on gravel]']]},
  {id:'s3',fx:2,ep:7,base:31*60+5,name:'Queens Group headquarters',figs:['s3-haein'],
   shots:[{dt:0,z:1,cx:.5,cy:.5,par:.4},{dt:8,z:1.8,cx:.45,cy:.34,par:1},{dt:16,z:2,cx:.44,cy:.8,par:0}],
   subs:[[1,6.5,'[lobby falls silent]'],[9,15,'[tense strings]'],[17,23,'[heels echo across the lobby]']]},
  {id:'s4',fx:3,ep:15,base:22*60+40,name:'Seoul, at dusk',figs:['s4-haein'],
   shots:[{dt:0,z:1,cx:.5,cy:.5,par:.5},{dt:11,z:1.5,cx:.55,cy:.42,par:1}],
   subs:[[1,8,'[city traffic, distant]'],[12,22,'[quiet piano theme]']]},
 ],
 items:[
  {id:'s1-dress',sc:0,fig:'s1-haein',who:'Hae-in',name:'Cut-out blazer dress',brand:'Alexander McQueen',price:null,url:'alexandermcqueen.com',conf:97,a:[30,380],b:[-100,104,100,448],side:'r',shot:1,cat:'apparel',alts:A(260,119,69)},
  {id:'s1-bag',short:'Jewelled crossbody',sc:0,fig:'s1-haein',who:'Hae-in',name:'Biker jewelled crossbody bag',brand:'Alexander McQueen',price:null,url:'alexandermcqueen.com',conf:95,a:[-74,324],b:[-112,284,-36,350],side:'l',shot:1,cat:'acc',alts:A(190,79,39)},
  {id:'s1-hoops',short:'T1 hoop earrings',sc:0,fig:'s1-haein',who:'Hae-in',name:'T1 open hoop earrings',brand:'Tiffany & Co.',price:null,url:'tiffany.com',conf:92,a:[31,66],b:[-44,48,44,84],side:'r',shot:1,cat:'acc',alts:A(68,29,15)},
  {id:'s1-watch',short:'TV Big Date watch',sc:0,fig:'s1-hyunwoo',who:'Hyun-woo',name:'Multifort TV Big Date watch',brand:'MIDO',price:null,url:'midowatches.com',noEp:1,conf:94,a:[-92,357],b:[-116,338,-70,378],side:'r',shot:2,cat:'acc',alts:A(240,95,49)},
  {id:'s1-suit',sc:0,fig:'s1-hyunwoo',who:'Hyun-woo',name:'Black two-button suit',brand:'Dalbit Studio',price:420,similar:1,conf:86,a:[46,300],b:[-104,104,104,382],side:'r',shot:2,cat:'apparel',alts:[['Hanok Row',280],['Line 2',189],['Everyday Mapo',129]]},
  {id:'s2-knit',sc:1,fig:'s2-haein',who:'Hae-in',name:'Argyle V-neck knit',brand:'Mudidi',price:null,conf:95,a:[-34,240],b:[-100,104,100,344],side:'l',shot:1,cat:'apparel',alts:A(120,59,35)},
  {id:'s2-scarf',short:'Stripe silk scarf',sc:1,fig:'s2-haein',who:'Hae-in',name:'Two-tone stripe silk scarf',brand:'Totême',price:190,url:'toteme.com',conf:96,a:[8,150],b:[-32,88,42,212],side:'r',shot:1,cat:'acc',alts:A(72,34,18)},
  {id:'s2-watch',sc:1,fig:'s2-haein',who:'Hae-in',name:'Ballon Bleu watch',brand:'Cartier',price:null,url:'cartier.com',conf:91,a:[84,358],b:[62,338,108,378],side:'r',shot:1,cat:'acc',alts:A(260,89,45)},
  {id:'s2-skirt',sc:1,fig:'s2-haein',who:'Hae-in',name:'Black midi skirt',brand:'Hanok Row',price:145,similar:1,conf:84,a:[-30,470],b:[-80,324,80,572],side:'l',shot:0,cat:'apparel',alts:A(98,59,36)},
  {id:'s2-heels',short:'Patent pumps',sc:1,fig:'s2-haein',who:'Hae-in',name:'Patent leather pumps',brand:'Valentino Garavani',price:null,url:'valentino.com',conf:90,a:[-26,738],b:[-52,704,52,758],side:'l',shot:0,cat:'shoes',alts:A(160,79,45)},
  {id:'s2-trench',short:'Heritage trench coat',sc:1,fig:'s2-hyunwoo',who:'Hyun-woo',name:'Kensington heritage trench coat',brand:'Burberry',price:null,url:'burberry.com',noEp:1,conf:96,a:[50,560],b:[-124,104,124,606],side:'r',shot:2,cat:'apparel',alts:A(340,159,95)},
  {id:'s3-blazer',short:'Double-breasted blazer',sc:2,fig:'s3-haein',who:'Hae-in',name:'Double-breasted wool blazer',brand:'Balmain',price:2595,url:'balmain.com',conf:98,a:[-40,296],b:[-100,104,100,384],side:'l',shot:1,cat:'apparel',alts:A(280,129,79)},
  {id:'s3-necklace',short:'Serpenti necklace',sc:2,fig:'s3-haein',who:'Hae-in',name:'Serpenti Viper necklace',brand:'Bvlgari',price:null,url:'bulgari.com',conf:90,a:[8,116],b:[-24,94,24,134],side:'r',shot:1,cat:'acc',alts:A(110,45,22)},
  {id:'s3-dress',sc:2,fig:'s3-haein',who:'Hae-in',name:'Red sheath dress',brand:'Balmain',price:null,url:'balmain.com',conf:93,a:[24,430],b:[-62,372,62,480],side:'r',shot:2,cat:'apparel',alts:A(210,99,55)},
  {id:'s3-bag',short:'Rockstud handbag',sc:2,fig:'s3-haein',who:'Hae-in',name:'Rockstud leather handbag',brand:'Valentino Garavani',price:4035,url:'valentino.com',conf:95,a:[-84,430],b:[-128,360,-42,460],side:'l',shot:2,cat:'acc',alts:A(230,95,49)},
  {id:'s3-pumps',sc:2,fig:'s3-haein',who:'Hae-in',name:'Tabasco-red pumps',brand:'Gianvito Rossi',price:1900,url:'gianvitorossi.com',conf:94,a:[-26,738],b:[-52,704,52,758],side:'l',shot:2,cat:'shoes',alts:A(170,85,49)},
  {id:'s4-coat',sc:3,fig:'s4-haein',who:'Hae-in',name:'Belted suede coat',brand:'Ferragamo',price:null,url:'ferragamo.com',conf:97,a:[-46,450],b:[-104,104,104,618],side:'l',shot:1,cat:'apparel',alts:A(390,179,99)},
  {id:'s4-tote',sc:3,fig:'s4-haein',who:'Hae-in',name:'Leather tote bag',brand:'Ferragamo',price:null,url:'ferragamo.com',conf:93,a:[86,446],b:[38,352,132,494],side:'r',shot:1,cat:'acc',alts:A(210,89,45)},
 ]};
// resolve absolute times once, and index every item across reels
const itemById={},ALL_SCENES=[],ALL_ITEMS=[];
for(const k in REELS){const R0=REELS[k];
  R0.scenes.forEach((sc,i)=>{sc.reel=k;sc.t0=i*SEG;sc.t1=(i+1)*SEG;sc.shots.forEach(s=>s.t=sc.t0+s.dt);sc.subs=sc.subs.map(s=>[sc.t0+s[0],sc.t0+s[1],s[2]]);ALL_SCENES.push(sc)});
  const n=R0.scenes.map(()=>0);
  for(const it of R0.items){const sc=R0.scenes[it.sc];it.reel=k;it.scene=sc;it.ep=sc.ep;it.t=sc.shots[it.shot].t+2.5;it.from=1+.4*n[it.sc]++;itemById[it.id]=it;ALL_ITEMS.push(it)}
}
let reel=REELS.stills?'stills':'art',SCENES,ITEMS,DUR;
function useReel(k){reel=k;SCENES=REELS[k].scenes;ITEMS=REELS[k].items;DUR=SCENES.length*SEG}
useReel(reel);
const sceneIdx=t=>Math.min(SCENES.length-1,Math.max(0,Math.floor(t/SEG)));
const clockIn=(sc,t)=>{const s=Math.floor(sc.base+t-sc.t0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const clock=t=>clockIn(SCENES[sceneIdx(t)],t);
const epTag=sc=>sc.ep?`E${sc.ep} · `:'';
const fmt=t=>{const sc=SCENES[sceneIdx(t)];return epTag(sc)+clockIn(sc,t)};
const seen=it=>epTag(it.scene)+clockIn(it.scene,it.t);
// tier 0 = as worn, 1 = similar for less, 2 = budget
let tier=0;
const view=it=>{if(!tier)return{brand:it.brand,price:it.price,alt:false};const a=it.alts[tier===1?0:2];return{brand:a[0],price:a[1],alt:true}};
const money=p=>p==null?'':usd(p);
// where a still sits in the 16:9 frame (it fills the height; the sides are a blurred copy)
const frameRect=name=>{const f=FRAMES[name],w=Math.min(1,f.w/f.h*9/16);return{x:(1-w)/2,w}};
// frame-space geometry (0..1) of an item in a given shot: {a:[x,y], b:[x1,y1,x2,y2]}, or null when it is not in that shot
function geo(it,shot){
  if(it.fig){const f=FIG[it.fig],X=v=>(f.x+v*f.s)/1600,Y=v=>(f.y+v*f.s)/900;return{a:[X(it.a[0]),Y(it.a[1])],b:[X(it.b[0]),Y(it.b[1]),X(it.b[2]),Y(it.b[3])]}}
  const p=it.at[shot];if(!p)return null;const r=frameRect(it.scene.shots[shot].img),X=u=>r.x+u*r.w;
  return{a:[X(p[0]),p[1]],b:[X(p[2]),p[3],X(p[4]),p[5]]};
}
function camFor(t){
  const sc=SCENES[sceneIdx(t)];let i=0;sc.shots.forEach((s,k)=>{if(t>=s.t)i=k});
  const sh=sc.shots[i],end=sc.shots[i+1]?sc.shots[i+1].t:sc.t1,k=Math.min(1,Math.max(0,(t-sh.t)/(end-sh.t))),z=sh.z*(1+(RM?0:.045)*k);
  const cl=(v,zz)=>Math.min(0,Math.max(1-zz,v));
  const tx=cl(.5-sh.cx*z,z),ty=cl(.5-sh.cy*z,z);
  // backdrop: slightly oversized, zooms and pans less than the foreground, and drifts sideways through the shot
  const zb=1.07+(z-1)*(1-.3*sh.par),dr=(RM?0:.012)*sh.par*(k-.5);
  const bx=cl(.5-(.5+(sh.cx-.5)*(1-.2*sh.par)+dr)*zb,zb),by=cl(.5-(.5+(sh.cy-.5)*(1-.12*sh.par))*zb,zb);
  return{z,tx,ty,zb,bx,by,shot:i};
}
function onScreen(it,cam){const g=geo(it,cam.shot);if(!g)return{ok:false};const X=g.a[0]*cam.z+cam.tx,Y=g.a[1]*cam.z+cam.ty;return{X,Y,g,ok:X>.05&&X<.9&&Y>.08&&Y<.905}}
