// ---- hero: with stills, rotate through every identified piece on the real frames; otherwise the illustrated crop
if(REELS.stills){
  const R0=REELS.stills,seq=R0.items.filter(i=>i.at[0]&&!i.similar),el=$('#teaser'),tag=$('#heroTag'),bug=$('.teaser-bug',el);
  el.insertAdjacentHTML('afterbegin',R0.scenes.map((sc,k)=>{const n=sc.shots[0].img,r=frameRect(n);
    return`<div class="t-slide" data-k="${k}"><svg viewBox="${(r.x*1600).toFixed(1)} 0 ${(r.w*1600).toFixed(1)} 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#fr-${n}"/></svg>${R0.items.filter(i=>i.sc===k&&i.at[0]).map(i=>`<span class="t-spot" data-t="${i.id}" style="left:${(i.at[0][0]*100).toFixed(1)}%;top:${(i.at[0][1]*100).toFixed(1)}%"></span>`).join('')}</div>`}).join(''));
  let k=0,cur=seq[0];
  const show=()=>{const it=cur=seq[k];k=(k+1)%seq.length;
    $$('.t-slide',el).forEach(s=>s.classList.toggle('on',+s.dataset.k===it.sc));
    $$('.t-spot',el).forEach(s=>s.classList.toggle('on',s.dataset.t===it.id));
    bug.textContent=`QUEEN OF TEARS${it.ep?' · E'+it.ep:''}`;
    tag.innerHTML=`<small>${it.brand}</small><b>${it.name}</b><span>Hae-in${it.ep?' · episode '+it.ep:''}</span><i>${it.price==null?'Tap to shop':usd(it.price)}</i>`;
    tag.classList.remove('pop');void tag.offsetWidth;tag.classList.add('pop')};
  show();if(!RM)setInterval(show,2400);
  const open=()=>{setReel('stills');toDemo();openProduct(cur.id)};
  el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
}else{
  const VB=[460,70,520,650],ids=['s3-blazer','s3-necklace','s3-bag','s3-dress'],el=$('#teaser'),tag=$('#heroTag');
  el.insertAdjacentHTML('afterbegin',`<svg viewBox="${VB.join(' ')}" preserveAspectRatio="xMidYMid slice"><use href="#bg-s3"/><use href="#fg-s3"/></svg>`);
  el.insertAdjacentHTML('beforeend',ids.map(id=>{const[x,y]=geo(itemById[id],0).a;return`<span class="t-spot" data-t="${id}" style="left:${((x*1600-VB[0])/VB[2]*100).toFixed(1)}%;top:${((y*900-VB[1])/VB[3]*100).toFixed(1)}%"></span>`}).join(''));
  let k=0;const show=()=>{const it=itemById[ids[k]];$$('.t-spot',el).forEach(s=>s.classList.toggle('on',s.dataset.t===it.id));
    tag.innerHTML=`<small>${it.brand}</small><b>${it.name}</b><span>Hae-in · episode ${it.ep}</span><i>${it.price==null?'Price at retailer':usd(it.price)}</i>`;k=(k+1)%ids.length};
  show();if(!RM)setInterval(show,2600);
}

// ---- how it works
const PIPE=[
 ["Sync","Works out what you're watching","Mina reads two things from the player: which show is on, and how far in you are. That's all it needs. It never sees or uploads the video itself.",["Works anywhere there's a web or TV player","Accurate to the frame, so tags don't slide off the clothes","You don't have to link your streaming account"]],
 ["Wardrobe graph","Looks up who's wearing what","This is the hard part: a big catalog of what every character wears, scene by scene. It gets filled in three ways, and each one double-checks the others. The demo above runs on the third.",["Costume departments, who know exactly what was bought","Image matching against shop catalogs, for everything else","Fans and fashion blogs, who are often first to work out a new episode"]],
 ["Overlay","Puts the tags on screen","Mina draws the tags over the video and keeps them stuck to the clothes as people move. They stay small while you're watching and open up when you pause.",["Dots, labels or off. Your call","Pause and it scans the whole frame","On a TV, the tags go to your phone instead"]],
 ["Commerce","Takes you to the shop","Every tag is a link to the shop, with a code attached so the brand knows the sale came from Mina. If the exact piece exists, you get it. If it's custom or sold out, you get the closest thing.",["It always says whether it's the exact piece or a lookalike","Cheaper options under every piece","The code records the show, the episode and the second"]],
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
  $('#bars').innerHTML=eps.map((v,i)=>`<button class="bar${v===Math.max(...eps)?' hi':''}" style="height:${v/max*100}%" aria-label="Episode ${i+1}: ${v.toLocaleString('en-US')} taps"><span class="tip">E${i+1} · ${v.toLocaleString('en-US')} taps</span></button>`).join('');
  $('#xl').innerHTML=eps.map((v,i)=>`<span>E${i+1}</span>`).join('');
  $('#hbars').innerHTML=[['Hae-in',38],['Hyun-woo',29],['Others',22]].map(([n,v])=>`<div class="hbar"><span>${n}</span><i style="width:${v/40*100}%"></i><b>${v}%</b></div>`).join('');
}

// ---- waitlist (prototype: nothing is sent or stored except a flag)
$('#waitForm').addEventListener('submit',e=>{
  e.preventDefault();const inp=$('#waitEmail');
  if(!inp.value.trim()||!inp.checkValidity()){inp.focus();return toast('Pop in an email first.')}
  try{localStorage.setItem('mina.waitlist','1')}catch(err){}
  inp.value='';toast('Got it. This is a prototype, so nothing was sent.');
});
$('#partnerBtn').onclick=()=>toast('Not hooked up yet. This is still a prototype.');

// ---- start
if(small())setDevice('mobile');
new ResizeObserver(()=>{if(openId&&small()===sheet.hidden)closeProduct(true)}).observe(document.documentElement);
renderCloset();draw(true);
if(!RM)play();
requestAnimationFrame(frame);
