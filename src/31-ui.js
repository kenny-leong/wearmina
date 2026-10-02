// ---- device modes
let paired=false,pairTimers=[];
function qrSVG(){
  const r=rng(99),n=21;let s='';
  const fz=(x,y)=>(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){let on;if(fz(x,y)){const lx=x<7?x:x-(n-7),ly=y<7?y:y-(n-7);on=lx===0||lx===6||ly===0||ly===6||(lx>=2&&lx<=4&&ly>=2&&ly<=4)}else on=r()>.5;if(on)s+=`<rect x="${x}" y="${y}" width="1.03" height="1.03"/>`}
  return`<svg viewBox="-2 -2 25 25" aria-hidden="true"><rect x="-2" y="-2" width="25" height="25" fill="#FFFFFF"/><g fill="#0F0A17">${s}</g></svg>`;
}
function endPair(){pairTimers.forEach(clearTimeout);pairTimers=[];$('#pair').hidden=true;$('#compPair').hidden=true}
function setDevice(d){
  closeProduct(true);endPair();device=d;deviceEl.dataset.device=d;
  $$('#deviceSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.device===d));
  if(d==='tv'&&!paired){
    paired=true;const was=playing;pause(false);
    $('#qr').innerHTML=qrSVG();$('#pair').hidden=false;$('#compPair').hidden=false;
    $('#pairTitle').textContent='Pairing';$('#pairText').innerHTML='<span class="spin"></span>Connecting to Living Room TV';
    pairTimers=[setTimeout(()=>{$('#pairTitle').textContent='Paired';$('#pairText').textContent='Looks from the TV now appear here.'},RM?0:1500),
      setTimeout(()=>{endPair();if(was)play()},RM?600:2600)];
  }
}

// ---- store handoff: shows the attributed link, then sends the viewer to the brand's own site
const handEl=$('#handoff');let handReturn=null;
function openHandoff(it,alt){
  const brand=alt?alt[0]:it.brand,price=alt?alt[1]:it.price,real=!alt&&!it.similar&&it.url;
  const code=`QOT${it.ep?'-E'+it.ep:''}-${clockIn(it.scene,it.t).replace(':','m')}s-${slug(it.name).split('-').slice(0,2).join('-')}`;
  handEl.innerHTML=`<div class="shopwin" role="dialog" aria-modal="true" aria-label="Leaving for ${brand}">
    <div class="sw-top"><span class="logo-s">mina</span><button class="sw-x" data-hclose aria-label="Close">×</button></div>
    <div class="sw-page">
      <div class="sw-prod"><div class="sw-img">${thumb(it)}</div><div class="sw-info">
        <p class="sw-crumb">${alt?'Similar to a look in':'As seen in'} ${SHOW}${it.ep?', episode '+it.ep:''}</p><h4>${it.name}</h4><p class="sw-price">${brand}${price!=null?' · '+usd(price):''}</p></div></div>
      <ol class="route">
        <li><b>You tap</b><span>${seen(it)}, on ${it.who}</span></li>
        <li><b>Mina link</b><code>${SITE}/go/${code}</code></li>
        <li><b>${brand}</b><span>${real?it.url:'product page'}</span></li>
      </ol>
      <aside class="sw-note"><b>How Mina gets paid</b>The link tells ${brand} which show, episode and second sent this shopper. If the order completes, Mina earns a commission on it.</aside>
      ${real?`<a class="btn" href="https://www.${it.url}" target="_blank" rel="noopener noreferrer">Continue to ${it.url} ↗</a><p class="note">Opens the brand's real site in a new tab. No tracking code is attached in this prototype.</p>`
            :`<button class="btn" data-demo-store>Continue to ${brand}</button><p class="note">${brand} is a demo retailer, so there is no site to open.</p>`}
    </div></div>`;
  handReturn=document.activeElement;handEl.hidden=false;$('.sw-x',handEl).focus();
}
function closeHandoff(){if(handEl.hidden)return;handEl.hidden=true;handEl.innerHTML='';if(handReturn&&handReturn.isConnected)handReturn.focus()}

// ---- guided tour
const tourEl=$('#tour');let tourI=-1,tourTimer,tourAnim;
const TOURCFG={stills:{hero:'p1-jacket',t0:.5,ts:13},art:{hero:'s3-blazer',t0:48.5,ts:58.5}};
const tc=()=>TOURCFG[reel],th=()=>itemById[tc().hero];
const TOUR=[
 [()=>'Press play. Mina identifies the show and the exact second you are watching.',()=>{if(!small())setDevice('browser');setMode('dots');setTier(0);showTab('scene');seek(tc().t0);play()},4600],
 [()=>'Tags follow the wardrobe on screen, and move with every cut.',()=>{setMode(small()?'dots':'labels')},4800],
 [()=>'Pause on any frame and Mina scans it for every look.',()=>{seek(tc().ts);pause(true)},4600],
 [()=>`Tap a tag. The card names the exact piece Hae-in wore${th().ep?' in episode '+th().ep:''}.`,()=>openProduct(tc().hero),5200],
 [()=>`Not ready for ${th().price?usd(th().price):th().brand+' prices'}? Every look comes with cheaper alternatives.`,()=>{const a=$('.alts',small()?sheet:useStagePanel()?stagePanel:companion);if(a){a.classList.add('pulse');const sc=a.closest('.ppanel,.comp-detail,.sheet-card');if(sc)sc.scrollTop=sc.scrollHeight}},4800],
 [()=>'Save it to your closet, with the scene it came from.',()=>{const h=tc().hero;if(!closet.includes(h))toggleSave(h);if(small()||!useStagePanel())closeProduct(true);showTab('closet')},4800],
 [()=>'Shop sends you to the brand through a Mina link that credits this second of this episode. That link is the business.',()=>openHandoff(th()),7000],
 [()=>'That is the whole loop: watch, tap, shop. Now try it yourself.',()=>{closeHandoff();closeProduct(true);showTab('scene');play()},4200],
];
function tourStep(i){
  clearTimeout(tourTimer);if(tourAnim)tourAnim.cancel();
  if(i>=TOUR.length)return endTour();
  tourI=i;const[txt,run,ms]=TOUR[i];
  $('#tourN').textContent=`${i+1} / ${TOUR.length}`;$('#tourText').textContent=txt();$('#tourNext').textContent=i===TOUR.length-1?'Done':'Next';
  run();
  tourAnim=$('#tourBar').animate([{width:'0%'},{width:'100%'}],{duration:ms,fill:'forwards'});
  tourTimer=setTimeout(()=>tourStep(i+1),ms);
}
const toDemo=()=>(small()?$('#device'):$('#demo')).scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
function startTour(){tourEl.hidden=false;$('#tourBtn').textContent='Restart tour';toDemo();tourStep(0)}
function endTour(){clearTimeout(tourTimer);if(tourAnim)tourAnim.cancel();tourI=-1;tourEl.hidden=true;$('#tourBtn').textContent='Guided tour';closeHandoff()}

// ---- events
stage.addEventListener('click',e=>{
  if(e.target.closest('.ppanel')||e.target.closest('.pair'))return;
  const s=e.target.closest('.spot');if(s)return openProduct(s.dataset.id);
  if(openId&&stagePanel.classList.contains('open'))return closeProduct();
  playing?pause(true):play();
});
stage.addEventListener('keydown',e=>{
  if(e.target!==stage)return;
  if(e.key===' '||e.key==='k'){e.preventDefault();playing?pause(true):play()}
  else if(e.key==='ArrowRight'){e.preventDefault();seek(t+5)}
  else if(e.key==='ArrowLeft'){e.preventDefault();seek(t-5)}
  else if(e.key==='m'){setMode(mode==='off'?'dots':mode==='dots'?'labels':'off')}
});
$('#playBtn').onclick=()=>playing?pause(true):play();
$('#backBtn').onclick=()=>seek(t-8);
$('#fwdBtn').onclick=()=>seek(t+8);
range.addEventListener('input',()=>{closeProduct(true);seek(+range.value)});
$('#tourBtn').onclick=startTour;$('#tourNext').onclick=()=>tourStep(tourI+1);$('#tourExit').onclick=endTour;
document.addEventListener('click',e=>{
  const q=s=>e.target.closest(s);let el;
  if(el=q('[data-save]'))return toggleSave(el.dataset.save);
  if(q('[data-saveall]')){const ids=$$('#lookList [data-row]').map(r=>r.dataset.row).filter(id=>!closet.includes(id));closet=[...ids,...closet];saveCloset();return toast(ids.length?`${ids.length} pieces saved to your closet`:'Already in your closet')}
  if(el=q('[data-shop]'))return openHandoff(itemById[el.dataset.shop]);
  if(el=q('[data-alt]')){const[id,k]=el.dataset.alt.split('|');return openHandoff(itemById[id],itemById[id].alts[+k])}
  if(el=q('[data-open]'))return openProduct(el.dataset.open);
  if(q('[data-close]')||e.target===sheet)return closeProduct();
  if(el=q('[data-who]')){who=el.dataset.who;return renderList()}
  if(el=q('[data-tier]'))return setTier(+el.dataset.tier);
  if(el=q('[data-tab]')){if(openId&&!stagePanel.classList.contains('open'))closeProduct(true);return showTab(el.dataset.tab)}
  if(el=q('#modeSeg [data-mode]'))return setMode(el.dataset.mode);
  if(el=q('#reelSeg [data-reel]'))return setReel(el.dataset.reel);
  if(el=q('#deviceSeg [data-device]'))return setDevice(el.dataset.device);
  if(el=q('[data-mark]')){closeProduct(true);seek(+el.dataset.mark);return pause(true)}
  if(el=q('[data-try]')){setDevice(el.dataset.try);return toDemo()}
  if(q('[data-hclose]')||e.target===handEl)return closeHandoff();
  if(q('[data-demo-store]'))return toast('Demo retailer: nothing to open in this prototype.');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!handEl.hidden)closeHandoff();else if(openId)closeProduct()}});
companion.addEventListener('mouseover',e=>{const r=e.target.closest('[data-row]');if(r&&!openId)setHL(r.dataset.row)});
companion.addEventListener('mouseleave',()=>{if(!openId)setHL(null)});
// swipe the product sheet down to close it
{let y0=null;const card=$('.sheet-card',sheet);
 card.addEventListener('touchstart',e=>{y0=card.scrollTop<=0?e.touches[0].clientY:null},{passive:true});
 card.addEventListener('touchmove',e=>{if(y0==null)return;const dy=e.touches[0].clientY-y0;card.style.transform=dy>0?`translateY(${dy}px)`:''},{passive:true});
 card.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;card.style.transform='';y0=null;if(dy>90)closeProduct()});}
new IntersectionObserver(es=>{inView=es[0].isIntersecting},{threshold:.15}).observe(stage);
