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
// Fit deliberately unbroken short display headings to their container, including narrow phones.
function fitLines(){document.querySelectorAll('.line-word,[data-fit]').forEach(el=>{el.style.fontSize='';const base=parseFloat(getComputedStyle(el).fontSize);const room=el.parentElement.clientWidth;const range=document.createRange();range.selectNodeContents(el);const width=range.getBoundingClientRect().width;if(width>room)el.style.fontSize=`${Math.max(18,base*room/width*.98)}px`;});}
document.fonts.ready.then(fitLines);window.addEventListener('resize',fitLines);
// Muted stock footage with explicit playback control and reduced-motion support.
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
const heroVideo=document.querySelector('[data-hero-video]');
const videoToggle=document.querySelector('[data-video-toggle]');
if(heroVideo&&videoToggle){
 let wantsPlayback=!reduceMotion.matches&&!navigator.connection?.saveData;
 let inView=true;
 heroVideo.muted=true;
 heroVideo.controls=false;
 videoToggle.hidden=false;
 const reflectPlayback=()=>{
  const playing=!heroVideo.paused;
  videoToggle.setAttribute('aria-label',playing?'動画を一時停止':'動画を再生');
  videoToggle.querySelector('[data-video-icon]').textContent=playing?'Ⅱ':'▶';
  videoToggle.querySelector('[data-video-label]').textContent=playing?'一時停止':'再生';
 };
 const syncPlayback=()=>{
  if(wantsPlayback&&inView&&!document.hidden)heroVideo.play().catch(()=>reflectPlayback());
  else heroVideo.pause();
 };
 heroVideo.addEventListener('play',reflectPlayback);
 heroVideo.addEventListener('pause',reflectPlayback);
 heroVideo.addEventListener('error',()=>{videoToggle.hidden=true;});
 videoToggle.addEventListener('click',()=>{wantsPlayback=heroVideo.paused;syncPlayback();});
 document.addEventListener('visibilitychange',syncPlayback);
 reduceMotion.addEventListener('change',()=>{wantsPlayback=!reduceMotion.matches&&!navigator.connection?.saveData;syncPlayback();});
 new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;syncPlayback();},{threshold:0}).observe(heroVideo);
 reflectPlayback();
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
