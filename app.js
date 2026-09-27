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
// Retain the original site's three-image sequence and six-second changeover.
const originalSlides=[...document.querySelectorAll('.original-fv-slide')];
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
let originalSlideIndex=0;
if(originalSlides.length>1)setInterval(()=>{
 if(document.hidden||reduceMotion.matches)return;
 originalSlides[originalSlideIndex].classList.remove('is-current');
 originalSlides[originalSlideIndex].setAttribute('aria-hidden','true');
 originalSlideIndex=(originalSlideIndex+1)%originalSlides.length;
 originalSlides[originalSlideIndex].classList.add('is-current');
 originalSlides[originalSlideIndex].removeAttribute('aria-hidden');
},6000);
