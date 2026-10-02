// ---- tap the garment itself: find the tagged piece under a point on the frame
function hitItem(cx,cy){
  if(mode==='off'||scanning)return null;
  const r=stage.getBoundingClientRect(),cam=camFor(t),fx=((cx-r.left)/r.width-cam.tx)/cam.z,fy=((cy-r.top)/r.height-cam.ty)/cam.z,sc=SCENES[sceneIdx(t)];
  let best=null,area=9;
  for(const it of ITEMS){
    if(it.scene!==sc)continue;const g=geo(it,cam.shot);if(!g)continue;
    const[x1,y1,x2,y2]=g.b;if(fx<x1||fx>x2||fy<y1||fy>y2)continue;
    const a=(x2-x1)*(y2-y1);if(a<area){area=a;best=it;best._hb=g.b} // smallest box wins, so a belt beats the dress under it
  }
  return best;
}
function ripple(cx,cy){
  const r=stage.getBoundingClientRect(),el=document.createElement('span');
  el.className='ripple';el.style.left=(cx-r.left)+'px';el.style.top=(cy-r.top)+'px';
  stage.appendChild(el);el.addEventListener('animationend',()=>el.remove());
}
// hover: spotlight the piece under the cursor
{
  const hb=$('#hoverBox'),lab=$('span',hb);let raf=0,last=null,pt=null;
  const hide=()=>{if(last){last=null;hb.hidden=true;stage.classList.remove('hit')}};
  const upd=()=>{raf=0;
    const it=pt&&!openId?hitItem(pt[0],pt[1]):null;
    if(!it)return hide();
    const[x1,y1,x2,y2]=it._hb;hb.style.cssText=`left:${x1*100}%;top:${y1*100}%;width:${(x2-x1)*100}%;height:${(y2-y1)*100}%`;
    if(it!==last){last=it;lab.textContent=`${it.short||it.name} · ${it.brand}`;hb.hidden=false;stage.classList.add('hit')}
  };
  stage.addEventListener('mousemove',e=>{pt=e.target.closest('.spot,.ppanel,.pair')?null:[e.clientX,e.clientY];if(!raf)raf=requestAnimationFrame(upd)});
  stage.addEventListener('mouseleave',()=>{pt=null;hide()});
  stage.addEventListener('click',()=>{pt=null;hide()});
}

// ---- lookbook: every scene in the default reel as a card that jumps into the demo
{
  const R0=REELS[reel],strip=$('#lbStrip');
  strip.innerHTML=R0.scenes.map((sc,k)=>{
    const its=R0.items.filter(i=>i.sc===k),brands=[...new Set(its.filter(i=>!i.similar).map(i=>i.brand))];
    let img;if(sc.figs)img=`<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#bg-${sc.id}"/><use href="#fg-${sc.id}"/></svg>`;
    else{const n=sc.shots[0].img,r=frameRect(n);img=`<svg viewBox="${(r.x*1600).toFixed(1)} 0 ${(r.w*1600).toFixed(1)} 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#fr-${n}"/></svg>`}
    return`<button class="lb-card" data-look="${k}"><span class="lb-img">${img}<strong>${String(k+1).padStart(2,'0')}</strong><em>${its.length} piece${its.length===1?'':'s'}</em></span><span class="lb-meta"><small>Look ${String(k+1).padStart(2,'0')}${sc.ep?' · Episode '+sc.ep:''}</small><b>${sc.name}</b><span>${brands.join(' · ')||'Closest matches'}</span></span></button>`}).join('');
  strip.addEventListener('click',e=>{const c=e.target.closest('[data-look]');if(!c)return;const sc=R0.scenes[+c.dataset.look];setReel(sc.reel);closeProduct(true);seek(sc.t0+.6);pause(true);toDemo()});
  const brands=new Set(R0.items.filter(i=>!i.similar).map(i=>i.brand));
  $('#lbStats').textContent=`${R0.scenes.length} scenes · ${R0.items.length} pieces · ${brands.size} brands identified`;
  // brand marquee under the hero
  // kinetic band under the hero: every identified piece in the reel, as an invitation to tap it
  const pieces=R0.items.filter(i=>!i.similar).map(i=>(i.short||i.name).replace(/^30 Montaigne /,''));
  if(pieces.length>3){$('#marq').innerHTML=[0,1].map(()=>pieces.map((p,j)=>`<span${j%2?' class="o"':''}>Tap the ${p}</span><i>✦</i>`).join('')).join('');$('#marqWrap').hidden=false}
}

// ---- hero card tilts toward the cursor
if(!RM&&matchMedia('(hover:hover)').matches){
  const w=$('.teaser'),f=$('#teaser');
  w.addEventListener('mousemove',e=>{const r=w.getBoundingClientRect();f.style.setProperty('--ry',(((e.clientX-r.left)/r.width-.5)*10).toFixed(2)+'deg');f.style.setProperty('--rx',((.5-(e.clientY-r.top)/r.height)*8).toFixed(2)+'deg')});
  w.addEventListener('mouseleave',()=>{f.style.setProperty('--ry','0deg');f.style.setProperty('--rx','0deg')});
}

// ---- first time the player scrolls into view, show one scan on its own, then carry on playing
if(!RM){
  let touched=false;deviceEl.addEventListener('pointerdown',()=>{touched=true},{once:true});
  const io=new IntersectionObserver(es=>{
    if(!es[0].isIntersecting)return;io.disconnect();
    setTimeout(()=>{if(touched||!playing||openId||tourI>=0)return;pause(true);
      setTimeout(()=>{if(!touched&&!playing&&!openId&&tourI<0)play()},2900)},1400);
  },{threshold:.6});
  io.observe(stage);
}

// ---- a pink TAP badge follows the pointer over the hero and over any garment in the player
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  const c=$('#tapCur');let x=0,y=0,raf=0,on=false;
  const paint=()=>{raf=0;c.style.transform=`translate(${x}px,${y}px)`};
  addEventListener('mousemove',e=>{
    x=e.clientX;y=e.clientY;const el=e.target,v=!!(el.closest&&(el.closest('#teaser')||(el.closest('#stage')&&stage.classList.contains('hit')&&!el.closest('.spot,.ppanel'))));
    if(v!==on){on=v;c.classList.toggle('on',v)}
    if(on&&!raf)raf=requestAnimationFrame(paint);
  },{passive:true});
  addEventListener('scroll',()=>{if(on){on=false;c.classList.remove('on')}},{passive:true});
}
