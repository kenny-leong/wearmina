// ---- player
const stage=$('#stage'),camEl=$('#cam'),camBg=$('#camBg'),spotsEl=$('#spots'),scanLayer=$('#scanLayer'),statusEl=$('#status'),subsEl=$('#subs');
const range=$('#range'),timeNow=$('#timeNow'),nowTime=$('#nowTime'),stagePanel=$('#stagePanel'),deviceEl=$('#device'),companion=$('#companion'),sheet=$('#sheet');
{const art=buildArt();$('#artBg').innerHTML=art.bg;$('#artFg').innerHTML=art.fg;$('#fxWrap').innerHTML=ALL_SCENES.map(fxHTML).join('')}
const sceneEls=$$('.scene'),shotEls=$$('.shot'),fxEls=$$('.fx'),spotEls={};
const labHTML=it=>{const v=view(it);return`<b>${it.short||it.name}</b>${v.price==null?'':`<i>${usd(v.price)}</i>`}`};
const labNeed=it=>((it.short||it.name).length*7.4+(view(it).price==null?44:92))/Math.max(280,stage.clientWidth);
spotsEl.innerHTML=ALL_ITEMS.map(it=>`<button class="spot" data-id="${it.id}" aria-label="${it.name}, ${it.brand}"><span class="dot"></span><span class="lab">${labHTML(it)}</span></button>`).join('');
$$('.spot',spotsEl).forEach(el=>spotEls[el.dataset.id]=el);
const looksAt=t=>{const c=camFor(t),sc=SCENES[sceneIdx(t)];return ITEMS.filter(i=>i.scene===sc&&onScreen(i,c).ok).length};

let t=1,playing=false,mode='dots',device='browser',curScene=-1,curSid='',shotKey='',openId=null,resumeAfter=false,scanTimer=0,flashTimer=0,scanning=false,inView=false,who='all',curTab='scene',rowEls={};
let lastT=-1,lastSec=-1,lastSub=null,lastN=-1,lastNow=0;
const nLooks=n=>`${n} look${n===1?'':'s'}`;
const sceneLabel=sc=>sc.ep?`Episode ${sc.ep} · ${sc.name}`:sc.name;

// rebuild everything that depends on which reel is loaded
function mountReel(){
  range.max=DUR;
  $('#marks').innerHTML=SCENES.flatMap(sc=>sc.shots.map(sh=>sh.t+2.5)).map(mt=>`<button class="mark" data-mark="${mt}" style="left:${mt/DUR*100}%" aria-label="Shoppable moment, ${fmt(mt)}"><span class="tip">${looksAt(mt)} looks · ${fmt(mt)}</span></button>`).join('')
    +SCENES.slice(1).map(sc=>`<i class="cut" style="left:${sc.t0/DUR*100}%"></i>`).join('');
  ALL_ITEMS.forEach(it=>{const el=spotEls[it.id];el._on=false;el.classList.remove('on')});
  curScene=-1;curSid='';shotKey='';lastT=lastSec=lastN=-1;lastSub=null;
  $$('#reelSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.reel===reel));
}
function setReel(k){if(!REELS[k]||k===reel)return;closeProduct(true);stopScan();useReel(k);mountReel();t=1;draw(true)}

function draw(force){
  if(!force&&t===lastT)return;lastT=t;
  const si=sceneIdx(t),sc=SCENES[si];
  if(sc.id!==curSid){
    const first=!curSid;curSid=sc.id;curScene=si;
    sceneEls.forEach(el=>el.classList.toggle('on',el.dataset.sid===sc.id));fxEls.forEach(el=>el.classList.toggle('on',el.dataset.sid===sc.id));
    stage.dataset.scene=sc.id;stage.dataset.kind=sc.figs?'art':'photo';renderList();$('#epNow').textContent=sc.ep?` · E${sc.ep}`:'';
    if(!first&&playing&&mode!=='off'){const n=ITEMS.filter(i=>i.scene===sc).length;statusEl.textContent=`${sc.ep?'Episode '+sc.ep:'New scene'} · ${nLooks(n)} found`;stage.classList.add('flash');clearTimeout(flashTimer);flashTimer=setTimeout(()=>{stage.classList.remove('flash');lastN=-1;lastT=-1},2400)}
  }
  const cam=camFor(t),pc=v=>(v*100).toFixed(3)+'%',sk=sc.id+':'+cam.shot;
  if(sk!==shotKey){ // a cut: swap the frame and move the tags to where the pieces are in this shot
    shotKey=sk;shotEls.forEach(el=>el.classList.toggle('on',el.dataset.shot===sk));
    for(const it of ITEMS){if(it.scene!==sc)continue;const g=geo(it,cam.shot);if(g){const el=spotEls[it.id];el.style.left=pc(g.a[0]);el.style.top=pc(g.a[1])}}
  }
  camEl.style.transform=`translate(${pc(cam.tx)},${pc(cam.ty)}) scale(${cam.z.toFixed(4)})`;
  camBg.style.transform=`translate(${pc(cam.bx)},${pc(cam.by)}) scale(${cam.zb.toFixed(4)})`;
  camEl.style.setProperty('--inv',(1/cam.z).toFixed(4));
  let n=0;
  for(const it of ITEMS){
    let on=false,left=false,live=false;
    if(it.scene===sc){const p=onScreen(it,cam);live=p.ok;if(live){n++;on=(!playing||t>=sc.t0+it.from)&&t<sc.t1-.4;const nd=labNeed(it),fl=p.X-nd>.01,fr=p.X+nd<.99;left=it.side==='l'?(fl||!fr):!(fr||!fl)}}
    const el=spotEls[it.id];
    if(el._on!==on){el._on=on;el.classList.toggle('on',on)}
    if(el._l!==left){el._l=left;el.classList.toggle('left',left)}
    const row=rowEls[it.id];if(row&&row._live!==live){row._live=live;row.classList.toggle('live',live)}
  }
  range.value=t;range.style.setProperty('--p',(t/DUR*100).toFixed(2)+'%');
  const sec=Math.floor(t);if(sec!==lastSec){lastSec=sec;timeNow.textContent=fmt(t);nowTime.textContent=clock(t)}
  const sub=(sc.subs.find(s=>t>=s[0]&&t<s[1])||[])[2]||'';if(sub!==lastSub){lastSub=sub;subsEl.textContent=sub}
  if(n!==lastN){lastN=n;$('#tvHint').textContent=`Press ↑ to shop · ${nLooks(n)}`;if(!scanning&&!stage.classList.contains('flash'))statusEl.textContent=`${nLooks(n)} in this frame`}
}
function frame(now){
  const dt=Math.min(.1,(now-lastNow)/1000||0);lastNow=now;
  if(playing&&inView){t+=dt;if(t>=DUR)t=0}
  draw();requestAnimationFrame(frame);
}
function setPlayUI(){$('#playIcon').setAttribute('d',playing?'M3 2h4v12H3zM9 2h4v12H9z':'M4 2l10 6-10 6z');$('#playBtn').setAttribute('aria-label',playing?'Pause':'Play')}
function stopScan(){clearTimeout(scanTimer);scanning=false;stage.classList.remove('scanning');scanLayer.innerHTML='';lastN=-1;lastT=-1}
function play(){closeProduct(true);stopScan();playing=true;stage.classList.remove('paused');setPlayUI();draw(true)}
function pause(scan){playing=false;stage.classList.add('paused');stage.classList.remove('flash');setPlayUI();stopScan();draw(true);if(scan&&mode!=='off'&&!RM)doScan()}
function seek(nt){t=Math.max(0,Math.min(DUR-.05,nt));stopScan();draw(true)}
function doScan(){
  const cam=camFor(t),sc=SCENES[curScene],hits=ITEMS.filter(i=>i.scene===sc).map(i=>[i,onScreen(i,cam)]).filter(h=>h[1].ok);
  scanLayer.innerHTML=hits.map(([it,p])=>{const[x1,y1,x2,y2]=p.g.b,X=Math.max(0,Math.min(1,(x1+x2)/2*cam.z+cam.tx));
    return`<div class="sbox" style="left:${(x1*100).toFixed(2)}%;top:${(y1*100).toFixed(2)}%;width:${((x2-x1)*100).toFixed(2)}%;height:${((y2-y1)*100).toFixed(2)}%;--d:${X.toFixed(2)}s"><span>${it.short||it.name} · ${it.conf}%</span></div>`}).join('');
  scanning=true;void stage.offsetWidth;stage.classList.add('scanning');statusEl.textContent='Scanning frame…';
  scanTimer=setTimeout(stopScan,2600);
}
function setMode(m){mode=m;stage.dataset.mode=m;$$('#modeSeg button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));if(m==='off')stopScan()}
function setHL(id){$$('.hl').forEach(e=>e.classList.remove('hl'));if(!id)return;$$(`.gar[data-g="${id}"]`,$('#artFg')).forEach(e=>e.classList.add('hl'));spotEls[id]&&spotEls[id].classList.add('hl')}

// ---- closet (saved looks), kept in this browser only
let closet=[];try{closet=JSON.parse(localStorage.getItem('mina.closet2')||'[]').filter(id=>itemById[id])}catch(e){}
function saveCloset(){try{localStorage.setItem('mina.closet2',JSON.stringify(closet))}catch(e){}syncSaves();renderCloset()}
function toggleSave(id){const i=closet.indexOf(id);i<0?closet.unshift(id):closet.splice(i,1);saveCloset();toast(i<0?'Saved to your closet':'Removed from your closet')}
function syncSaves(){
  $$('[data-save]').forEach(b=>{const on=closet.includes(b.dataset.save);b.setAttribute('aria-pressed',on);if(b.classList.contains('btn-save'))b.textContent=on?'♥ Saved':'♡ Save'});
  $('#closetCount').textContent=closet.length;
}

// ---- product card
function productHTML(it){
  const note=it.similar?'The exact piece has not been identified, so this is the closest match from a demo retailer.':it.noEp?'Identified by fashion press as worn in the series. Placed in this scene for the demo.':it.ep?`Identified by fashion press for episode ${it.ep}.`:'Identified by fashion press for this look.';
  return`<div class="p-thumb">${thumb(it)}<span class="p-seen">Seen on ${it.who} · ${seen(it)}</span></div>
  <div class="p-meta"><span class="badge ${it.similar?'similar':'exact'}">${it.similar?'Closest match':'Identified'}</span><span class="p-conf">${it.conf}% visual match</span></div>
  <h4>${it.name}</h4><p class="p-brand">${it.brand}</p>
  <p class="p-price">${it.price==null?'<span class="p-na">Price at retailer</span>':usd(it.price)}</p>
  <p class="p-note">${note}</p>
  <div class="p-actions"><button class="btn-shop" data-shop="${it.id}">Shop at ${it.brand}</button><button class="btn-save" data-save="${it.id}" aria-pressed="false">♡ Save</button></div>
  <h5>Get the look for less <span>demo retailers</span></h5>
  <div class="alts">${it.alts.map((a,k)=>`<button class="alt${(tier===1&&k===0)||(tier===2&&k===2)?' pick':''}" data-alt="${it.id}|${k}"><b>${a[0]}</b>${it.price?`<span class="less">−${Math.round((1-a[1]/it.price)*100)}%</span>`:''}<span>${usd(a[1])}</span></button>`).join('')}</div>`;
}
const useStagePanel=()=>device==='browser'&&stage.clientWidth>=620;
function showTab(tab){curTab=tab;$('#paneScene').hidden=tab!=='scene';$('#paneCloset').hidden=tab!=='closet';$('#compDetail').hidden=true;$('#tabScene').setAttribute('aria-selected',tab==='scene');$('#tabCloset').setAttribute('aria-selected',tab==='closet')}
function openProduct(id){
  const it=itemById[id];if(!it)return;
  const was=playing||resumeAfter;
  if(playing)pause(false);
  if(it.reel!==reel)setReel(it.reel);
  if(it.scene!==SCENES[sceneIdx(t)]||!onScreen(it,camFor(t)).ok)seek(it.t);
  stopScan();resumeAfter=was;openId=id;setHL(id);
  stagePanel.classList.remove('open');stagePanel.inert=true;sheet.hidden=true;
  if(small()){$('#sheetBody').innerHTML=productHTML(it);sheet.hidden=false;$('.sheet-card',sheet).scrollTop=0}
  else if(useStagePanel()){stagePanel.innerHTML=`<button class="x" data-close aria-label="Close product">×</button><div class="pc">${productHTML(it)}</div>`;stagePanel.scrollTop=0;stagePanel.classList.add('open');stagePanel.inert=false}
  else{$('#compDetailBody').innerHTML=productHTML(it);$('#paneScene').hidden=$('#paneCloset').hidden=true;$('#compDetail').hidden=false;$('#compDetail').scrollTop=0}
  syncSaves();
}
function closeProduct(noResume){
  if(!openId)return;openId=null;setHL(null);
  stagePanel.classList.remove('open');stagePanel.inert=true;sheet.hidden=true;showTab(curTab);
  const r=resumeAfter;resumeAfter=false;if(r&&!noResume)play();
}

// ---- companion lists
function rowHTML(it,inCloset){
  const v=view(it);
  return`<li><button class="look" data-open="${it.id}" data-row="${it.id}"><span class="lk-thumb">${thumb(it)}</span><span class="lk-txt"><b>${it.name}</b><span>${v.brand}${v.alt?' · similar':''} · ${it.who}</span>${inCloset?`<span class="seen">Seen at ${seen(it)}</span>`:''}</span><span class="lk-price">${money(v.price)||'Retail'}</span></button><button class="heart" data-save="${it.id}" aria-pressed="false" aria-label="Save ${it.name}">♥</button></li>`;
}
function renderList(){
  const sc=SCENES[curScene],its=ITEMS.filter(i=>i.scene===sc),whos=[...new Set(its.map(i=>i.who))];
  if(who!=='all'&&!whos.includes(who))who='all';
  const shown=its.filter(i=>who==='all'||i.who===who);
  $('#whoChips').innerHTML=(whos.length>1?['all',...whos]:whos).map(w=>`<button class="chip" aria-pressed="${w===who||whos.length===1}" data-who="${w}">${w==='all'?'Everyone':w}</button>`).join('');
  $('#lookList').innerHTML=shown.map(i=>rowHTML(i)).join('');
  rowEls={};$$('#lookList [data-row]').forEach(el=>rowEls[el.dataset.row]=el);
  const priced=shown.filter(i=>view(i).price!=null),sum=priced.reduce((a,i)=>a+view(i).price,0),all=priced.length===shown.length;
  $('#lookTotal').innerHTML=`<span><b>${who==='all'&&whos.length>1?'Everything in this scene':(who==='all'?whos[0]:who)+'’s look'}</b>${all?`${shown.length} pieces`:`${priced.length} of ${shown.length} pieces priced`}</span><strong>${priced.length?usd(sum)+(all?'':'+'):'Retail'}</strong><button class="saveall" data-saveall>Save all</button>`;
  $('#sceneCount').textContent=its.length;$('#sceneName').textContent=sceneLabel(sc);syncSaves();lastT=-1;
}
function renderCloset(){
  $('#closetList').innerHTML=closet.length?closet.map(id=>rowHTML(itemById[id],true)).join(''):'<li class="empty">Nothing saved yet. Tap ♥ on any look and it lands here, with the scene it came from.</li>';
  syncSaves();
}
function setTier(k){
  tier=k;$$('#tierSeg button').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.tier===k));
  ALL_ITEMS.forEach(it=>$('.lab',spotEls[it.id]).innerHTML=labHTML(it));renderList();renderCloset();
}
let toastTimer;function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('on'),2600)}
mountReel();
