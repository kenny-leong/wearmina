// ---- the six looks, modelled on documented Queen of Tears outfits. Each returns one figure, drawn back to front.
const chest=`<path d="M-30,112 L30,112 L18,244 L-18,244Z" fill="${sh(SK,.5)}"/>`;
const compose=(h,male,p)=>{const hd=headSVG(h,male),big=s=>male?`<g transform="translate(0,86) scale(1.14) translate(0,-86)">${s}</g>`:s;return hd.back+p.under+hd.neck+p.body+big(hd.face+hd.front)+(p.over||'')};
const HAIR_F='#241A1B',HAIR_M='#17141A';
const LOOKS={
 // E1: black cut-out blazer dress, red jewelled crossbody, open hoops
 hq1(){const c='#1B1B21',s=sh(c),lp=lite(c,.3);
  const dress=`<path d="M-70,118 C-52,106 -26,106 -14,110 L0,206 L14,110 C26,106 52,106 70,118 C63,170 47,212 42,250 C54,300 68,380 72,444 L-72,444 C-68,380 -54,300 -42,250 C-47,212 -63,170 -70,118Z" fill="${s}"/>`
   +`<path d="M-14,110 L-42,168 L-9,188 L0,206Z" fill="${lite(c,.18)}"/><path d="M14,110 L42,168 L9,188 L0,206Z" fill="${lite(c,.08)}"/>`
   +`<path d="M-44,238 L-24,254 L-45,272Z" fill="${SK}"/><path d="M44,238 L24,254 L45,272Z" fill="${SKD}"/>`
   +[[-13,272],[13,272],[-13,304],[13,304]].map(p=>btn(p[0],p[1],5,lp)).join('')
   +fold('M0,206 L0,444 M-30,330 C-34,370 -40,410 -46,440 M34,330 C40,370 46,410 52,440',lite(c,.25),2,.5)
   +armDown(s)+mir(armDown(sh(c,1.2)));
  const bag=`<path d="M56,118 C24,190 -34,262 -72,302" stroke="#8E1022" stroke-width="4" fill="none"/><rect x="-106" y="300" width="66" height="46" rx="8" fill="${sh('#C5142C')}"/><path d="M-106,318 h66" stroke="#8E1022" stroke-width="2" fill="none"/>`+[-97,-82,-67,-52].map(x=>btn(x,299,6,GOLD)).join('');
  const hoops=`<path d="M-33,58 a8,11 0 1 0 6,0" fill="none" stroke="${GOLD}" stroke-width="3.2"/><path d="M27,58 a8,11 0 1 0 6,0" fill="none" stroke="${GOLD}" stroke-width="3.2"/>`;
  return compose({style:'long',c:HAIR_F},false,{under:legsBare('#5E4A48')+pump('#141418'),body:chest+hand()+mir(hand())+G('s1-dress',dress)+G('s1-bag',bag),over:G('s1-hoops',hoops)});
 },
 // E1: black suit, square-cased watch
 mq1(){const c='#1C1E28',s=sh(c),dx=8;
  const shirt=`<path d="M-30,112 L30,112 L22,262 L-22,262Z" fill="#F4F4F2"/><path d="M-16,108 L0,128 L-10,142Z M16,108 L0,128 L10,142Z" fill="#FFFFFF" stroke="#D9D9DD" stroke-width="1"/><path d="M-5,126 L5,126 L8,238 L0,252 L-8,238Z" fill="${sh('#262834')}"/>`;
  const jacket=`<path d="M-78,120 C-58,104 -32,106 -17,110 L0,258 L17,110 C32,106 58,104 78,120 L74,378 L-74,378Z" fill="${s}"/>`
   +`<path d="M-17,110 L-46,162 L-35,172 L-42,188 L0,258Z" fill="${lite(c,.14)}"/><path d="M17,110 L46,162 L35,172 L42,188 L0,258Z" fill="${lite(c,.06)}"/>`
   +btn(0,274,5,lite(c,.3))+R(-70,304,34,6,dark(c,.3),'rx="3"')+R(36,304,34,6,dark(c,.4),'rx="3"')+R(34,188,26,4,'#F4F4F2')+fold('M0,258 L0,378',dark(c,.5),2,.8)
   +armDown(s,dx)+mir(armDown(sh(c,1.2),dx));
  const watch=`<rect x="-106" y="353" width="28" height="9" rx="3" fill="#B9C0CB"/><rect x="-101" y="347" width="18" height="21" rx="5" fill="#14161B" stroke="#D5DAE2" stroke-width="2.5"/>`;
  return compose({style:'short',c:HAIR_M},true,{under:G('s1-suit',trousers(c))+oxford('#141418'),body:shirt+hand(dx)+mir(hand(dx))+G('s1-suit',jacket)+G('s1-watch',watch)});
 },
 // E6, Sanssouci: argyle V-neck knit, striped silk scarf, black midi skirt, patent heels, round steel watch
 hq2(){const k='#EFE6D6',s=sh(k,.7),sk='#1B1B20';
  const skirt=`<path d="M-48,326 L48,326 C60,420 70,500 76,568 L-76,568 C-70,500 -60,420 -48,326Z" fill="${sh(sk)}"/>`+fold('M-20,340 C-26,420 -34,500 -40,562 M22,340 C30,420 38,500 46,562',lite(sk,.25),2,.5);
  const shape='M-68,118 C-50,106 -26,106 -14,110 L0,176 L14,110 C26,106 50,106 68,118 C62,170 50,214 46,254 L50,340 L-50,340 L-46,254 C-50,214 -62,170 -68,118Z';
  const knit=`<path d="${shape}" fill="${s}"/><path d="${shape}" fill="url(#argyle)"/>`+R(-50,328,100,13,dark(k,.14),'rx="4"')+`<path d="M-14,110 L0,176 L14,110 L21,112 L0,192 L-21,112Z" fill="${dark(k,.12)}"/>`
   +armDown(s)+mir(armDown(sh(k,1)))+R(-98,340,30,16,dark(k,.14),'rx="5"')+R(68,340,30,16,dark(k,.22),'rx="5"');
  const scarf=`<path d="M-17,94 Q0,110 17,94 L19,113 Q0,131 -19,113Z" fill="url(#stripe)"/><path d="M-6,118 L-26,204 L-8,208 L6,124Z" fill="url(#stripe)"/><path d="M4,118 L24,186 L38,178 L12,116Z" fill="url(#stripe)"/><ellipse cx="0" cy="121" rx="9" ry="8" fill="#17171B"/>`;
  const watch=`<rect x="69" y="354" width="30" height="8" rx="3" fill="#C9CED6"/><circle cx="84" cy="358" r="9" fill="#F7F7F4" stroke="#AEB5C0" stroke-width="2.5"/><circle cx="94" cy="358" r="2" fill="#2F5FB8"/>`;
  return compose({style:'long',c:HAIR_F,lip:'#B85A5E'},false,{under:legsBare()+G('s2-heels',pump('#121216',1))+G('s2-skirt',skirt),body:chest+hand()+mir(hand())+G('s2-knit',knit)+G('s2-scarf',scarf)+G('s2-watch',watch)});
 },
 // black belted heritage trench over a grey knit
 mq2(){const c='#202127',s=sh(c),dx=8,g='#70737D',bt='#55555E';
  const inner=`<path d="M-30,112 L30,112 L20,238 L-20,238Z" fill="${sh(g)}"/><rect x="-16" y="84" width="32" height="30" rx="9" fill="${sh(g)}"/>`;
  const coat=`<path d="M-80,120 C-58,104 -32,106 -17,110 L0,234 L17,110 C32,106 58,104 80,120 L88,340 L100,602 L-100,602 L-88,340Z" fill="${s}"/>`
   +`<path d="M-17,110 L-52,172 L-12,216 L0,234Z" fill="${lite(c,.16)}"/><path d="M17,110 L52,172 L12,216 L0,234Z" fill="${lite(c,.07)}"/>`
   +`<path d="M-78,124 L-34,152 L-42,214 L-82,198Z" fill="${lite(c,.08)}"/>`
   +R(-98,300,196,18,dark(c,.3))+`<rect x="-15" y="296" width="30" height="26" rx="3" fill="none" stroke="#8A8372" stroke-width="4"/>`
   +[[-24,256],[24,256],[-24,360],[24,360],[-24,430],[24,430]].map(p=>btn(p[0],p[1],5,bt)).join('')
   +fold('M0,234 L0,602 M-50,330 C-56,420 -62,520 -70,598 M54,330 C60,420 66,520 74,598',lite(c,.22),2,.5)
   +armDown(s,dx)+mir(armDown(sh(c,1.2),dx))+R(-106,336,34,8,dark(c,.3),'rx="3"')+R(72,336,34,8,dark(c,.3),'rx="3"');
  return compose({style:'short',c:HAIR_M},true,{under:trousers('#17181D')+oxford('#111114'),body:inner+hand(dx)+mir(hand(dx))+G('s2-trench',coat)});
 },
 // E7: red dress under a red double-breasted blazer with gold buttons, red pumps, studded handbag, snake-chain necklace
 hq3(){const c='#C4122B',s=sh(c),d='#B50F26';
  const dress=`<path d="M-44,250 C-56,300 -58,380 -54,476 L54,476 C58,380 56,300 44,250Z" fill="${sh(d)}"/><path d="M-30,112 Q0,152 30,112 L34,262 L-34,262Z" fill="${sh(d)}"/>`;
  const blazer=`<path d="M-76,116 C-54,101 -26,106 -14,110 L-2,216 L14,110 C26,106 54,101 76,116 C66,170 50,214 46,256 C50,300 58,342 62,380 L-62,380 C-58,342 -50,300 -46,256 C-50,214 -66,170 -76,116Z" fill="${s}"/>`
   +`<path d="M-14,110 L-49,150 L-36,164 L-44,180 L-2,216Z" fill="${lite(c,.16)}"/><path d="M14,110 L47,150 L36,164 L42,180 L-2,216Z" fill="${lite(c,.05)}"/>`
   +[[-17,246],[17,246],[-17,288],[17,288],[-17,330],[17,330]].map(p=>btn(p[0],p[1],7,GOLD)).join('')
   +R(-58,340,30,7,dark(c,.2),'rx="3"')+R(28,340,30,7,dark(c,.3),'rx="3"')+fold('M-2,216 L-2,380',dark(c,.3),2,.7)
   +armDown(s)+mir(armDown(sh(c,1.2)));
  const bag=`<path d="M-112,402 q28,-48 56,0" stroke="#7E0C1C" stroke-width="6" fill="none"/><rect x="-122" y="398" width="76" height="58" rx="8" fill="${sh('#9E1024')}"/><path d="M-122,408 h76 v8 l-38,18 l-38,-18Z" fill="#7E0C1C"/>`+[[-112,417],[-98,424],[-84,431],[-70,424],[-56,417]].map(p=>`<rect x="${p[0]-3}" y="${p[1]-3}" width="6" height="6" fill="${GOLD}" transform="rotate(45 ${p[0]} ${p[1]})"/>`).join('');
  const neck=`<path d="M-15,102 Q0,134 15,102" stroke="${GOLD}" stroke-width="3.6" fill="none"/><circle cx="-7" cy="117" r="1.7" fill="#FFFFFF"/><circle cx="0" cy="120" r="1.7" fill="#FFFFFF"/><circle cx="7" cy="117" r="1.7" fill="#FFFFFF"/>`;
  return compose({style:'bun',c:HAIR_F,lip:'#B8162C'},false,{under:legsBare()+G('s3-pumps',pump('#B01226')),body:chest+G('s3-dress',dress)+hand()+mir(hand())+G('s3-blazer',blazer)+G('s3-bag',bag)+G('s3-necklace',neck),over:btn(-30,62,3.5,GOLD)+btn(30,62,3.5,GOLD)});
 },
 // E15: grey belted suede coat, black leather tote
 hq4(){const c='#8E8B8F',s=sh(c,.9);
  const inner=`<path d="M-30,112 L30,112 L20,244 L-20,244Z" fill="#18181C"/><rect x="-16" y="86" width="32" height="28" rx="9" fill="#18181C"/>`;
  const coat=`<path d="M-74,116 C-54,102 -26,104 -14,108 L0,246 L14,108 C26,104 54,102 74,116 C68,180 60,240 56,300 L92,614 L-92,614 L-56,300 C-60,240 -68,180 -74,116Z" fill="${s}"/>`
   +`<path d="M-14,108 L-54,178 L-14,228 L0,246Z" fill="${lite(c,.16)}"/><path d="M14,108 L54,178 L14,228 L0,246Z" fill="${lite(c,.04)}"/>`
   +`<path d="M-58,292 L58,292 L61,313 L-61,313Z" fill="${dark(c,.2)}"/>`+R(-12,288,24,29,dark(c,.28),'rx="4"')+`<path d="M2,315 l17,80 l-14,4 l-11,-82Z" fill="${dark(c,.2)}"/>`
   +fold('M0,246 L0,292 M0,318 L0,614 M-30,330 C-40,430 -54,530 -64,610 M32,330 C44,430 58,530 70,610',dark(c,.3),2,.5)
   +armDown(s)+mir(armDown(sh(c,1.2)));
  const tote=`<path d="M62,410 Q84,338 106,410 M70,410 Q84,356 98,410" stroke="#111114" stroke-width="5" fill="none"/><path d="M50,406 L118,406 L127,490 L42,490Z" fill="${sh('#1A1A1F')}"/>`+fold('M60,420 L56,478','#FFFFFF',2,.18);
  return compose({style:'long',c:HAIR_F,lip:'#A94550'},false,{under:legsBare('#2A2428')+boot('#17171B'),body:inner+hand()+mir(hand())+G('s4-coat',coat)+G('s4-tote',tote)});
 },
};
const figG=id=>{const f=FIG[id];return`<ellipse cx="${f.x}" cy="${Math.round(f.y+754*f.s)}" rx="${Math.round(118*f.s)}" ry="${Math.round(13*f.s)}" fill="#000000" opacity=".26"/><g transform="translate(${f.x},${f.y}) scale(${f.s})">${LOOKS[f.look]()}</g>`};
