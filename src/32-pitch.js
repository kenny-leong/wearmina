// ---- hero teaser: a crop of the episode 7 frame with rotating tags
{
  const VB=[460,70,520,650],ids=['s3-blazer','s3-necklace','s3-bag','s3-dress'],el=$('#teaser'),tag=$('#heroTag');
  el.insertAdjacentHTML('afterbegin',`<svg viewBox="${VB.join(' ')}" preserveAspectRatio="xMidYMid slice"><use href="#bg-s3"/><use href="#fg-s3"/></svg>`);
  el.insertAdjacentHTML('beforeend',ids.map(id=>{const[x,y]=geo(itemById[id],0).a;return`<span class="t-spot" data-t="${id}" style="left:${((x*1600-VB[0])/VB[2]*100).toFixed(1)}%;top:${((y*900-VB[1])/VB[3]*100).toFixed(1)}%"></span>`}).join(''));
  let k=0;const show=()=>{const it=itemById[ids[k]];$$('.t-spot',el).forEach(s=>s.classList.toggle('on',s.dataset.t===it.id));
    tag.innerHTML=`<small>${it.brand}</small><b>${it.name}</b><span>Hae-in · episode ${it.ep}</span><i>${it.price==null?'Price at retailer':usd(it.price)}</i>`;k=(k+1)%ids.length};
  show();if(!RM)setInterval(show,2600);
}

// ---- how it works
const PIPE=[
 ['Sync','Knows the show and the second','Mina reads the title and the playback position from the player. That is all it needs: the video itself never leaves your device.',['Works on any service with a web or TV player','Timestamp accuracy to the frame, so tags never drift','No account link with the streamer required']],
 ['Wardrobe graph','Knows every outfit in every scene','A database of what each character wears, scene by scene. Three sources feed it, and each one checks the others. The demo above uses the third: public identifications by fashion press and fans.',['Costume department credits, the ground truth for exact items','Visual matching against retailer catalogs for everything else','Fan tagging with review, which covers new episodes within hours']],
 ['Overlay','Draws the tags','Tags are placed over the player and timed to the frame. They stay quiet while you watch and open up when you pause.',['Dots, labels or off: the viewer chooses','Pause triggers a full scan of the frame','On a TV, the tags move to your phone']],
 ['Commerce','Sends you to the product','Each tag links to the retailer with an attribution code. You get the exact item when it exists and the closest matches when it does not.',['Exact and similar items are always labeled as such','Cheaper alternatives on every look','The code credits the show, the episode and the second']],
];
function setPipe(i){
  $$('#pipe button').forEach((b,k)=>b.setAttribute('aria-selected',k===i));
  const p=PIPE[i];$('#pipeDetail').innerHTML=`<div><h3>${p[0]}</h3><p>${p[2]}</p></div><ul>${p[3].map(x=>`<li>${x}</li>`).join('')}</ul>`;
}
$('#pipe').innerHTML=PIPE.map((p,i)=>`<button role="tab" data-pipe="${i}"><span class="n">Step ${i+1}</span><b>${p[0]}</b><span class="d">${p[1]}</span></button>`).join('');
$('#pipe').addEventListener('click',e=>{const b=e.target.closest('[data-pipe]');if(b)setPipe(+b.dataset.pipe)});
setPipe(1);

// ---- revenue calculator
const cmp=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});
function calc(){
  const v=id=>+$('#'+id).value;
  const raw=Math.pow(10,4+v('cMau')/100*2.7),mag=Math.pow(10,Math.floor(Math.log10(raw))-1),mau=Math.round(raw/mag)*mag;
  const taps=mau*v('cTaps'),orders=taps*v('cConv')/100,gmv=orders*v('cAov'),rev=gmv*v('cCom')/100;
  $('#oMau').textContent=cmp.format(mau);$('#oTaps').textContent=v('cTaps');$('#oConv').textContent=v('cConv')+'%';$('#oAov').textContent='$'+v('cAov');$('#oCom').textContent=v('cCom')+'%';
  $('#rRev').textContent='$'+cmp.format(rev);$('#rTaps').textContent=cmp.format(taps);$('#rOrders').textContent=cmp.format(orders);$('#rGmv').textContent='$'+cmp.format(gmv);$('#rYear').textContent='$'+cmp.format(rev*12);
  $$('.calc input').forEach(i=>i.style.setProperty('--p',((i.value-i.min)/(i.max-i.min)*100)+'%'));
}
$$('.calc input').forEach(i=>i.addEventListener('input',calc));calc();

// ---- brand console charts (sample data for the fictional label)
{
  const eps=[3100,4200,5400,6100,7600,8300,12400,9800],max=15000;
  $('#grid').innerHTML=[0,5,10,15].map(k=>`<span style="bottom:${k/15*100}%"><i>${k?k+'k':'0'}</i></span>`).join('');
  $('#bars').innerHTML=eps.map((v,i)=>`<button class="bar" style="height:${v/max*100}%" aria-label="Episode ${i+1}: ${v.toLocaleString('en-US')} taps"><span class="tip">E${i+1} · ${v.toLocaleString('en-US')} taps</span></button>`).join('');
  $('#xl').innerHTML=eps.map((v,i)=>`<span>E${i+1}</span>`).join('');
  $('#hbars').innerHTML=[['Hae-in',38],['Hyun-woo',29],['Others',22]].map(([n,v])=>`<div class="hbar"><span>${n}</span><i style="width:${v/40*100}%"></i><b>${v}%</b></div>`).join('');
}

// ---- waitlist (prototype: nothing is sent or stored except a flag)
$('#waitForm').addEventListener('submit',e=>{
  e.preventDefault();const inp=$('#waitEmail');
  if(!inp.value.trim()||!inp.checkValidity()){inp.focus();return toast('Enter an email address to join.')}
  try{localStorage.setItem('mina.waitlist','1')}catch(err){}
  inp.value='';toast('You are on the list. Prototype only: nothing was sent.');
});
$('#partnerBtn').onclick=()=>toast('Prototype: partner inquiries are not wired up yet.');

// ---- start
if(!REELS.stills)$('#reelSeg').hidden=true;
if(small())setDevice('mobile');
new ResizeObserver(()=>{if(openId&&small()===sheet.hidden)closeProduct(true)}).observe(document.documentElement);
renderCloset();draw(true);
if(!RM)play();
requestAnimationFrame(frame);
