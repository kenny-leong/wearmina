// ---- backdrops (1600x900). Drawn soft and low-contrast; the stage blurs this layer so the figures read as in focus.
const persp=(c,n=9)=>{let s='';for(let i=0;i<n;i++){const x=i*1600/(n-1);s+=`<path d="M${x|0},600 L${Math.round((x-800)*1.9+800)},900" stroke="${c}" stroke-width="2" fill="none" opacity=".6"/>`}return s+[650,722,812].map(y=>R(0,y,1600,2,c,'opacity=".6"')).join('')};
const BG={
 s1(){ // Queens Department Store atrium
  let s=R(0,0,1600,900,'url(#g-s1wall)');
  const cols=['#7B2337','#2F3E57','#C9A66B','#3A3A40'];
  for(let i=0;i<7;i++){const x=40+i*230;
   s+=`<path d="M${x},580 V260 Q${x+85},160 ${x+170},260 V580Z" fill="url(#g-s1niche)"/><path d="M${x},580 V260 Q${x+85},160 ${x+170},260 V580" stroke="#B8935A" stroke-width="8" fill="none"/>`
    +`<ellipse cx="${x+85}" cy="338" rx="16" ry="20" fill="#8A6F52" opacity=".55"/><path d="M${x+55},580 C${x+50},450 ${x+62},378 ${x+85},368 C${x+108},378 ${x+120},450 ${x+115},580Z" fill="${cols[i%4]}" opacity=".6"/>`
    +R(x,600,170,170,'#FFE9BF','opacity=".13"')}
  s+=R(0,156,1600,26,'#D9C39E')+R(0,126,1600,8,'#B8935A')+`<text x="800" y="104" text-anchor="middle" font-family="Bodoni Moda,Georgia,serif" font-size="56" letter-spacing="18" fill="#9C7A45">QUEENS</text>`;
  for(const x of[-14,770,1544])s+=R(x,0,70,640,'url(#g-s1col)');
  s+=R(0,600,1600,300,'url(#g-s1floor)')+persp('#C2AD88');
  for(const x of[260,800,1340])s+=`<circle cx="${x}" cy="30" r="150" fill="url(#g-warm)"/>`;
  return s;
 },
 s2(){ // Sanssouci: yellow palace above the vineyard terraces
  const r=rng(8);let s=R(0,0,1600,900,'url(#g-s2sky)');
  s+=`<ellipse cx="300" cy="150" rx="210" ry="20" fill="#FFFFFF" opacity=".75"/><ellipse cx="1180" cy="110" rx="260" ry="18" fill="#FFFFFF" opacity=".65"/>`;
  const au=['#C9792E','#D99A2B','#7C8F3E','#A8532A','#8E6A2A'];
  for(let i=0;i<46;i++){const left=i%2,x=left?r()*400:1200+r()*400;s+=`<circle cx="${x|0}" cy="${(250+r()*230)|0}" r="${(44+r()*46)|0}" fill="${au[r()*au.length|0]}"/>`}
  s+=R(380,268,840,100,'#E8C566')+R(380,256,840,14,'#F3E2B0')+`<path d="M716,258 Q800,146 884,258Z" fill="#7FA890"/>`+R(792,142,16,34,'#7FA890');
  for(let x=396;x<1200;x+=52)s+=`<path d="M${x},368 V306 q13,-18 26,0 V368Z" fill="#6E5A3A" opacity=".7"/>`+R(x+33,284,8,84,'#D4AE4E');
  for(let x=388;x<1220;x+=60)s+=R(x,244,10,14,'#DCCB9A');
  for(let i=0;i<4;i++){const y=368+i*68,w=440+i*110;s+=R(800-w-60,y,w*2+120,68,i%2?'#5E7F45':'#6E9150')+R(800-w-60,y,w*2+120,10,'#D2BC8E');
   for(let x=800-w-40;x<800+w+40;x+=58)s+=R(x,y+18,34,50,'#3F5A31','rx="3" opacity=".8"')}
  s+=`<path d="M690,368 L910,368 L1010,640 L590,640Z" fill="#E4D6B2"/>`;
  for(let y=386;y<640;y+=18)s+=`<path d="M${Math.round(690-(y-368)*.368)},${y} H${Math.round(910+(y-368)*.368)}" stroke="#C9B88E" stroke-width="2" fill="none"/>`;
  s+=R(0,640,1600,260,'url(#g-s2ground)')+R(0,628,330,30,'#4F6B3A')+R(1270,628,330,30,'#4F6B3A')+persp('#C2B086',7);
  return s;
 },
 s3(){ // Queens Group lobby: window wall, wood panelling, staff lined up
  const r=rng(14);let s=R(0,0,1600,900,'#232B37')+R(60,50,900,560,'url(#g-s3sky)');
  for(let x=60;x<960;x+=44){const h=80+r()*260;s+=R(x,610-h,30+r()*24,h,'#5E7088','opacity=".85"')}
  for(let x=60;x<=960;x+=180)s+=R(x-6,50,12,560,'#141A22');
  s+=R(60,300,900,8,'#141A22')+R(1000,0,600,610,'url(#g-s3wood)');
  for(let x=1040;x<1600;x+=70)s+=R(x,0,3,610,'#2A1D14','opacity=".6"');
  s+=`<text x="1300" y="250" text-anchor="middle" font-family="Bodoni Moda,Georgia,serif" font-size="46" letter-spacing="10" fill="#C9A866">QUEENS GROUP</text>`;
  for(const x of[200,620,1040])s+=R(x,14,280,10,'#F4F8FF','rx="5"')+`<ellipse cx="${x+140}" cy="20" rx="220" ry="46" fill="#DCE8FF" opacity=".12"/>`;
  s+=R(0,600,1600,300,'url(#g-s3floor)')+R(60,600,900,230,'#9FB6CF','opacity=".14"')+persp('#3A4656');
  for(const x of[120,250,1340,1470])s+=`<circle cx="${x}" cy="372" r="24" fill="#0E1218"/><rect x="${x-38}" y="398" width="76" height="210" rx="22" fill="#11161D"/>`+R(x-30,600,26,190,'#0E1218')+R(x+4,600,26,190,'#0E1218');
  return s;
 },
 s4(){ // Seoul street at dusk
  const r=rng(51);let s=R(0,0,1600,900,'url(#g-s4sky)');
  for(const[x0,x1]of[[0,560],[1080,1600]])for(let x=x0;x<x1;x+=92){const h=260+r()*260;s+=R(x,640-h,96,h,'#1C1E36');for(let k=0;k<9;k++)if(r()>.4)s+=R(x+10+(k%3)*28,650-h+20+((k/3)|0)*54,16,26,'#FFD79A',`opacity="${(.4+r()*.5).toFixed(2)}"`)}
  s+=R(0,430,330,210,'#2A2238')+R(26,470,280,150,'#FFCF8A','opacity=".9"')+`<path d="M0,430 h340 l30,-40 h-370Z" fill="#7E2A3A"/>`;
  s+=R(0,640,1600,260,'url(#g-s4ground)');
  for(const x of[400,640,980,1230]){s+=R(x,300,8,350,'#15162A')+`<circle cx="${x+4}" cy="296" r="110" fill="url(#g-warm)"/><circle cx="${x+4}" cy="296" r="12" fill="#FFF2CF"/>`+R(x-30,650,70,220,'#FFD79A','opacity=".10"')}
  for(const x of[520,1100]){s+=R(x,380,10,270,'#1A1420');for(let k=0;k<40;k++)s+=`<circle cx="${(x-90+r()*190)|0}" cy="${(250+r()*190)|0}" r="${(2+r()*2.5).toFixed(1)}" fill="#FFE7A8" opacity="${(.5+r()*.5).toFixed(2)}"/>`}
  return s;
 },
};
const lin=(id,st)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${st}</linearGradient>`;
function buildArt(){
  // every scene of every reel is drawn once; the player shows the ones in the active reel
  const fg=ALL_SCENES.map(sc=>`<g class="scene" data-sid="${sc.id}">`+(sc.figs?`<g id="fg-${sc.id}">${sc.figs.map(figG).join('')}</g>`
    :sc.shots.map((s,k)=>{const f=FRAMES[s.img],r=frameRect(s.img);return`<g class="shot" data-shot="${sc.id}:${k}"><image id="fr-${sc.id}-${k}" href="${f.src}" x="${(r.x*1600).toFixed(1)}" y="0" width="${(r.w*1600).toFixed(1)}" height="900" preserveAspectRatio="none"/></g>`}).join(''))+`</g>`).join('');
  const defs=`<defs>`
   +lin('g-s1wall',stop(0,'#F1E4CC')+stop(1,'#D5BF9C'))+lin('g-s1niche',stop(0,'#FFF4D8')+stop(1,'#E9CF9C'))+lin('g-s1floor',stop(0,'#C9B594')+stop(1,'#F0E6D2'))
   +`<linearGradient id="g-s1col" x1="0" x2="1" y1="0" y2="0">${stop(0,'#FBF6EA')+stop(1,'#CDBB9A')}</linearGradient>`
   +lin('g-s2sky',stop(0,'#7FB0E6')+stop(1,'#DCEBF5'))+lin('g-s2ground',stop(0,'#CDBB93')+stop(1,'#E9DCBC'))
   +lin('g-s3sky',stop(0,'#8FA9C9')+stop(1,'#D8E2EC'))+lin('g-s3floor',stop(0,'#161B23')+stop(1,'#2B3442'))
   +`<linearGradient id="g-s3wood" x1="0" x2="1" y1="0" y2="0">${stop(0,'#4A3424')+stop(1,'#2E2016')}</linearGradient>`
   +lin('g-s4sky',stop(0,'#262B58')+stop(.6,'#7A5B86')+stop(1,'#D58A6E'))+lin('g-s4ground',stop(0,'#2A2B3F')+stop(1,'#44425A'))
   +`<radialGradient id="g-warm">${stop(0,'#FFE9B4',.55)+stop(1,'#FFE9B4',0)}</radialGradient>`
   +`<pattern id="argyle" width="44" height="56" patternUnits="userSpaceOnUse" x="-22" y="118"><path d="M22,0 L44,28 L22,56 L0,28Z" fill="#8FA0B8" opacity=".5"/><path d="M0,0 L44,56 M44,0 L0,56" stroke="#B9895A" stroke-width="1.5" fill="none"/></pattern>`
   +`<pattern id="stripe" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><rect width="10" height="5" fill="#16161A"/><rect y="5" width="10" height="5" fill="#EFE9DC"/></pattern>`
   +Object.values(GR).join('')+`</defs>`;
  const bg=defs+ALL_SCENES.map(sc=>`<g class="scene" data-sid="${sc.id}">`+(sc.figs?`<g id="bg-${sc.id}">${BG[sc.id]()}</g>`
    :sc.shots.map((s,k)=>`<g class="shot" data-shot="${sc.id}:${k}"><image href="${FRAMES[s.img].src}" x="-80" y="-45" width="1760" height="990" preserveAspectRatio="xMidYMid slice"/></g>`).join(''))+`</g>`).join('');
  return{bg,fg};
}
// floating lights / leaves over the backdrop, as plain elements so they animate on the compositor
function fxHTML(sc){
  const i=sc.fx;if(i==null)return'';
  const r=rng(70+i),o=[];
  const dot=(c,n,y0,y1,d0,d1)=>{for(let k=0;k<n;k++){const d=d0+r()*(d1-d0);o.push(`<i style="left:${(r()*100).toFixed(1)}%;top:${(y0+r()*(y1-y0)).toFixed(1)}%;width:${d.toFixed(1)}%;background:radial-gradient(circle,${c} 0%,transparent 68%);animation-delay:-${(r()*6).toFixed(1)}s"></i>`)}};
  if(i===0)dot('rgba(255,226,160,.55)',12,0,38,4,9);
  if(i===3)dot('rgba(255,214,150,.5)',14,10,60,3,8);
  if(i===1)for(let k=0;k<9;k++)o.push(`<b style="left:${(r()*100).toFixed(1)}%;background:${['#D99A2B','#C9792E','#A8532A'][k%3]};animation-delay:-${(r()*9).toFixed(1)}s;animation-duration:${(7+r()*5).toFixed(1)}s"></b>`);
  return`<div class="fx" data-sid="${sc.id}">${o.join('')}</div>`;
}
// crop of the frame around an item, used as its product image
function thumb(it){
  const[x1,y1,x2,y2]=geo(it,it.shot).b,id=it.scene.id;
  const cx=(x1+x2)*800,cy=(y1+y2)*450,w=Math.max((x2-x1)*1600,120)*1.3,h=Math.max((y2-y1)*900,120)*1.3;
  return`<svg viewBox="${(cx-w/2).toFixed(0)} ${(cy-h/2).toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${it.fig?`<use href="#bg-${id}"/><use href="#fg-${id}"/>`:`<use href="#fr-${id}-${it.shot}"/>`}</svg>`;
}
