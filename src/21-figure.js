// ---- illustrated figures (figure-local units: head top y=0, feet y=754, centre x=0). Light comes from the left.
const R=(x,y,w,h,f,ex='')=>`<rect x="${Math.round(x)}" y="${Math.round(y)}" width="${Math.round(w)}" height="${Math.round(h)}" fill="${f}" ${ex}/>`;
const stop=(o,c,op)=>`<stop offset="${o}" stop-color="${c}"${op===undefined?'':` stop-opacity="${op}"`}/>`;
const rgb=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mix=(c,t,k)=>'#'+rgb(c).map(v=>Math.round(v+(t-v)*k).toString(16).padStart(2,'0')).join('');
const lite=(c,k)=>mix(c,255,k),dark=(c,k)=>mix(c,0,k);
const GR={};
// shaded fill: lit on the left, falling into shadow on the right
function sh(c,k=1){const id='sh'+c.slice(1)+Math.round(k*10);GR[id]=`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".2">${stop(0,lite(c,.16*k))+stop(.42,c)+stop(1,dark(c,.34*k))}</linearGradient>`;return`url(#${id})`}
const SK='#EBC1A2',SKD='#CE9C7C',GOLD='#E2B45C';
const G=(id,body)=>id?`<g class="gar" data-g="${id}">${body}</g>`:body;
const mir=s=>`<g transform="scale(-1,1)">${s}</g>`;
const fold=(d,c,w=2,op=.5)=>`<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="${op}"/>`;

function headSVG(h,male){
  const hc=h.c,hl=lite(hc,.28);let back='',front='';
  if(h.style==='long')back=`<path d="M-34,26 C-50,90 -64,160 -54,238 C-44,258 -22,250 -18,232 L-12,112 L12,112 L20,234 C28,254 50,254 58,236 C66,160 50,90 34,26Z" fill="${sh(hc)}"/>`+fold('M-46,120 C-52,170 -50,210 -44,238 M44,110 C52,160 54,206 48,236',hl,3,.35);
  if(h.style==='bun')back=`<ellipse cx="6" cy="20" rx="26" ry="20" fill="${sh(hc)}"/>`;
  const face=`<path d="M-29,38 C-31,6 31,6 29,38 C29,62 15,85 0,85 C-15,85 -29,62 -29,38Z" fill="${sh(SK,.55)}"/>`
    +(male?`<ellipse cx="-30" cy="48" rx="4" ry="8" fill="${SKD}"/><ellipse cx="30" cy="48" rx="4" ry="8" fill="${SKD}"/>`:'')
    +`<path d="M-22,33 q8,-${male?4:6} 16,-1 M22,33 q-8,-${male?4:6} -16,-1" stroke="${dark(hc,.15)}" stroke-width="${male?3:2.2}" fill="none" stroke-linecap="round"/>`
    +`<path d="M-20,43 q7,-6 14,0 q-7,3.5 -14,0Z M20,43 q-7,-6 -14,0 q7,3.5 14,0Z" fill="#2A1A18"/><circle cx="-12" cy="42" r="1.1" fill="#FFFFFF"/><circle cx="14" cy="42" r="1.1" fill="#FFFFFF"/>`
    +fold('M1,48 q-4,12 1,15 q3,1 5,-1',SKD,1.6,.9)
    +`<path d="M-9,70 q4,-4 9,-1.5 q5,-2.5 9,1.5 q-9,${male?5:8} -18,0Z" fill="${male?'#B77A72':(h.lip||'#B4424F')}"/>`
    +(male?'':`<ellipse cx="-18" cy="57" rx="7" ry="4" fill="#E58C8C" opacity=".22"/><ellipse cx="18" cy="57" rx="7" ry="4" fill="#E58C8C" opacity=".22"/>`);
  if(h.style==='long')front=`<path d="M2,3 C-20,0 -38,14 -36,44 C-35,70 -42,98 -48,124 C-32,100 -25,62 -23,36 C-17,22 -6,15 2,13 C8,15 17,22 23,36 C25,62 32,100 48,124 C42,98 35,70 36,44 C38,14 24,0 2,3Z" fill="${hc}"/>`+fold('M-30,30 C-33,60 -38,90 -44,112 M30,30 C33,60 38,90 44,112 M-10,10 C-22,16 -28,28 -30,40',hl,2,.4);
  if(h.style==='bun')front=`<path d="M2,3 C-20,0 -36,14 -33,42 C-28,26 -16,14 2,13 C18,14 28,26 33,42 C36,14 24,0 2,3Z" fill="${hc}"/>`+fold('M-22,12 C-28,20 -31,30 -32,38 M10,8 C20,12 28,22 31,34',hl,2,.4);
  if(h.style==='short')front=`<path d="M-31,40 C-40,-14 38,-18 32,38 C31,22 22,9 6,9 C-10,9 -20,14 -26,26 C-28,31 -30,36 -31,40Z" fill="${sh(hc,.8)}"/>`+fold('M-18,8 C-6,2 12,2 22,10 M-24,18 C-12,8 6,6 18,10',hl,2.2,.35);
  return{back,neck:`<path d="M-12,74 L-14,118 L14,118 L12,74Z" fill="${SKD}"/>`,face,front};
}
// arms: drawn for the left side (viewer's left); dx widens the shoulders for the male figure
const armDown=(fill,dx=0)=>`<path d="M${-66-dx},118 C${-88-dx},124 ${-92-dx},170 ${-92-dx},242 L${-96-dx},354 L${-72-dx},356 L${-68-dx},246 C${-66-dx},198 ${-58-dx},162 ${-50-dx},140Z" fill="${fill}"/>`;
const hand=(dx=0)=>`<ellipse cx="${-84-dx}" cy="370" rx="11" ry="16" fill="${sh(SK,.5)}"/>`;
const legsBare=(c=SK)=>{const p='M-56,326 C-58,430 -45,520 -42,548 C-46,612 -38,680 -32,714 L-15,714 C-11,680 -11,612 -14,548 C-9,500 -5,420 -3,326Z';return`<path d="${p}" fill="${sh(c,.6)}"/>`+mir(`<path d="${p}" fill="${sh(c,.6)}"/>`)};
const pump=(c,patent)=>{const s=`<path d="M-34,710 L-14,710 L-12,738 C-12,750 -22,755 -40,755 C-46,755 -46,750 -42,746 C-33,738 -35,724 -34,710Z" fill="${sh(c,.8)}"/>`+(patent?fold('M-30,722 q2,16 -8,26','#FFFFFF',2,.5):'');return s+mir(s)};
const trousers=(c,wide)=>{const p=wide?'M-64,318 L-1,318 L-4,728 L-66,728Z':'M-60,318 L-2,318 L-8,728 L-50,728Z';const one=`<path d="${p}" fill="${sh(c,.9)}"/>`+fold('M-30,340 L-28,720',dark(c,.4),1.5,.5);return one+mir(one)};
const oxford=c=>{const s=`<path d="M-58,752 q0,-24 20,-28 h26 q6,0 6,8 v20Z" fill="${sh(c,.9)}"/><rect x="-60" y="749" width="56" height="6" rx="3" fill="${dark(c,.5)}"/>`;return s+mir(s)};
const boot=c=>{const s=`<path d="M-50,640 L-12,640 L-10,738 C-10,750 -22,755 -44,755 C-52,755 -50,748 -46,742Z" fill="${sh(c,.9)}"/>`;return s+mir(s)};
const btn=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/><circle cx="${x-r*.25}" cy="${y-r*.25}" r="${r*.35}" fill="#FFFFFF" opacity=".45"/>`;
