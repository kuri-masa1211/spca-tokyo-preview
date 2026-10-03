// Reveal each homepage block as it enters the viewport; content stays visible without JS.
const revealItems=[...document.querySelectorAll('[data-reveal]')];
if(revealItems.length&&window.matchMedia('(prefers-reduced-motion:no-preference)').matches&&'IntersectionObserver' in window){
 document.documentElement.classList.add('js-motion');
 const revealObserver=new IntersectionObserver((entries)=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}},{threshold:.12,rootMargin:'0px 0px -25px 0px'});
 revealItems.forEach(item=>revealObserver.observe(item));
}else revealItems.forEach(item=>item.classList.add('is-visible'));
const toggle=document.querySelector('.menu-toggle');
const mobile=document.querySelector('.mobile-nav');
function setMenu(open){toggle?.setAttribute('aria-expanded',String(open));if(mobile)mobile.hidden=!open;document.body.classList.toggle('menu-open',open);if(toggle)toggle.querySelector('small').textContent=open?'CLOSE':'MENU';}
toggle?.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus()}if(e.key==='Tab'&&toggle?.getAttribute('aria-expanded')==='true'){const items=[toggle,...mobile.querySelectorAll('a')];if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus()}}});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
window.matchMedia('(min-width:901px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});
document.querySelectorAll('[data-filter-group]').forEach(group=>{
 const target=document.querySelector(group.dataset.filterTarget);const message=group.parentElement.querySelector('[data-filter-message]');
 group.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;group.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  target?.classList.toggle('filtered',filter!=='all');let count=0;
  target?.querySelectorAll('[data-category]').forEach(item=>{const show=filter==='all'||item.dataset.category===filter;item.hidden=!show;if(show)count++});
  if(message)message.textContent=`${button.textContent.trim()}：${count}件`;
 }));
});
const donationPicker=document.querySelector('[data-donation-picker]');
if(donationPicker){
 const tabs=[...donationPicker.querySelectorAll('[role="tab"]')];
 const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
 const activate=index=>{tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});};
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>activate(i));
  tab.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activate(next);tabs[next].focus();}});
 });
 for(const panel of panels){
  const buttons=[...panel.querySelectorAll('[data-amount]')];
  const custom=panel.querySelector('input');
  const summary=panel.querySelector('[data-donation-summary]');
  const next=panel.querySelector('[data-donation-next]');
  const label=panel.dataset.frequency==='monthly'?'毎月':'今回のみ';
  const target=new URL(next.href);
  const update=amount=>{
   summary.textContent=`${label} ${amount.toLocaleString('ja-JP')}円`;
   target.searchParams.set('support',panel.dataset.frequency);
   target.searchParams.set('amount',String(amount));
   next.href=target.toString();
   next.removeAttribute('aria-disabled');
   custom.removeAttribute('aria-invalid');
  };
  buttons.forEach(button=>button.addEventListener('click',()=>{buttons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));custom.value='';update(Number(button.dataset.amount));}));
  custom.addEventListener('input',()=>{
   const amount=Number(custom.value);
   if(custom.value!==''&&Number.isInteger(amount)&&amount>0&&amount<=99999999){buttons.forEach(item=>item.setAttribute('aria-pressed','false'));update(amount);}
   else if(custom.value!==''){summary.textContent='金額を確認してください';custom.setAttribute('aria-invalid','true');next.removeAttribute('href');next.setAttribute('aria-disabled','true');}
   else {const selected=buttons.find(button=>button.getAttribute('aria-pressed')==='true')||buttons.find(button=>button.dataset.amount==='3000')||buttons[0];selected.setAttribute('aria-pressed','true');update(Number(selected.dataset.amount));}
  });
 }
}
const donationParams=new URLSearchParams(location.search);
if(location.pathname.endsWith('/contact/')&&['monthly','once'].includes(donationParams.get('support'))){
 const amount=Number(donationParams.get('amount'));
 const contactOptions=document.querySelector('.contact-options');
 if(Number.isInteger(amount)&&amount>0&&amount<=99999999&&contactOptions){
  const box=document.createElement('div');box.className='notice donation-intent';
  const title=document.createElement('strong');title.textContent='寄付についてのご相談内容（確認用）';
  const copy=document.createElement('p');copy.textContent=`${donationParams.get('support')==='monthly'?'毎月':'今回のみ'} ${amount.toLocaleString('ja-JP')}円の寄付をご検討中です。お問い合わせフォームの本文にこの内容をご記入ください。`;
  box.append(title,copy);contactOptions.before(box);
 }
}
// Fit deliberately unbroken short display headings to their container, including narrow phones.
function fitLines(){document.querySelectorAll('.line-word,[data-fit]').forEach(el=>{el.style.fontSize='';const base=parseFloat(getComputedStyle(el).fontSize);const room=el.parentElement.clientWidth;const range=document.createRange();range.selectNodeContents(el);const width=range.getBoundingClientRect().width;if(width>room)el.style.fontSize=`${Math.max(18,base*room/width*.98)}px`;});}
document.fonts.ready.then(fitLines);window.addEventListener('resize',fitLines);
// Muted background footage; pause it offscreen or when motion is reduced.
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
const heroVideo=document.querySelector('[data-hero-video]');
if(heroVideo){
 let inView=true;
 heroVideo.muted=true;
 heroVideo.controls=false;
 const syncPlayback=()=>{
  if(!reduceMotion.matches&&!navigator.connection?.saveData&&inView&&!document.hidden)heroVideo.play().catch(()=>{});
  else heroVideo.pause();
 };
 document.addEventListener('visibilitychange',syncPlayback);
 reduceMotion.addEventListener('change',syncPlayback);
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncPlayback();},{threshold:0}).observe(heroVideo);
 syncPlayback();
}

// Advance the existing horizontal animal list while it is visible and not being used.
document.querySelectorAll('[data-animal-carousel]').forEach(carousel=>{
 const strip=carousel.querySelector('.legacy-animal-strip');
 const track=carousel.querySelector('.legacy-animal-track');
 let inView=false,hovered=false,resumeAt=0;
 const advance=direction=>{
  const step=track.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);
  const end=strip.scrollWidth-strip.clientWidth;
  const next=direction>0&&strip.scrollLeft>=end-2?0:direction<0&&strip.scrollLeft<=2?end:strip.scrollLeft+step*direction;
  strip.scrollTo({left:next,behavior:reduceMotion.matches?'instant':'smooth'});
 };
 carousel.querySelector('[data-animal-prev]').addEventListener('click',()=>{resumeAt=Date.now()+12000;advance(-1);});
 carousel.querySelector('[data-animal-next]').addEventListener('click',()=>{resumeAt=Date.now()+12000;advance(1);});
 carousel.addEventListener('mouseenter',()=>{hovered=true;});
 carousel.addEventListener('mouseleave',()=>{hovered=false;});
 for(const event of ['touchstart','wheel','keydown'])strip.addEventListener(event,()=>{resumeAt=Date.now()+12000;},{passive:true});
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;},{threshold:0}).observe(carousel);
 setInterval(()=>{if(inView&&!hovered&&!document.hidden&&!reduceMotion.matches&&Date.now()>resumeAt&&!carousel.contains(document.activeElement))advance(1);},6000);
});
