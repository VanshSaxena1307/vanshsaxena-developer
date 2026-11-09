(function(){
var $=function(i){return document.getElementById(i)};
/* typing tagline */
var el=$('type'),ri=0,ci=0,del=false;
function tick(){var s=SITE.roles[ri];ci+=del?-1:1;el.textContent=s.slice(0,ci);var t=del?30:60;
if(!del&&ci==s.length){del=true;t=1400}else if(del&&ci==0){del=false;ri=(ri+1)%SITE.roles.length;t=300}setTimeout(tick,t)}
tick();
/* ticker, tech stack, projects */
$('tick').textContent=SITE.ticker+SITE.ticker+SITE.ticker+SITE.ticker;
$('stack').innerHTML=SITE.stack.map(function(s){return '<div class="tech"><small>&gt;_ '+s[1]+'</small><b>'+s[0]+'</b></div>'}).join('');
var cols=["#ffd600","#ff4d8d","#3df5ff"];
$('projects').innerHTML=SITE.projects.map(function(p,i){return '<article class="box proj"><div class="shot" style="background:'+cols[i%3]+'">'+(p[5]?'<img src="'+p[5]+'" alt="'+p[0]+' preview" loading="lazy">':p[0])+'</div><div class="in"><h3>'+p[0]+'</h3><p>'+p[1]+'</p><div class="tags">'+p[2].map(function(t){return '<span>'+t+'</span>'}).join('')+'</div>'+(p[3]=='#'?'<span class="btn alt">LINK COMING SOON</span>':'<a class="btn" href="'+p[3]+'" target="_blank" rel="noopener">'+p[4]+'</a>')+'</div></article>'}).join('');
/* hero cube follows the pointer */
var cube=$('cube'),stage=cube.parentNode;
stage.addEventListener('pointermove',function(e){var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cube.style.animationPlayState='paused';cube.style.transform='rotateX('+(-y*180)+'deg) rotateY('+(x*180)+'deg)'});
stage.addEventListener('pointerleave',function(){cube.style.transform='';cube.style.animationPlayState='running'});
/* reveal on scroll */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.rev').forEach(function(n){io.observe(n)});
/* CV button */
var cv=$('cv');if(SITE.cv){cv.href=SITE.cv;cv.setAttribute('download','')}else{cv.addEventListener('click',function(e){e.preventDefault()})}
/* reports marquee: repeat cards so the loop is seamless */
var fd=$('fd'),fo=fd.innerHTML;fd.innerHTML=fo+fo;
/* heatmaps (placeholder pattern) and badge strips */
function heat(id){var h='';for(var i=0;i<364;i++)h+='<i style="background:rgba(128,128,128,.28)"></i>';$(id).innerHTML=h}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function badges(id,a){var tr=$(id);if(!a.length)a=['ADD BADGES IN data.js'];
var h=a.map(function(t){var o=typeof t=='string'?{name:t}:t;return '<div class="bd"><span class="bi'+(o.img?' im':'')+'">'+(o.img?'<img src="'+esc(o.img)+'" alt="" loading="lazy">':'★')+'</span>'+esc(o.name)+'</div>'}).join('');
var few=a.length<4;tr.classList.toggle('static',few);tr.innerHTML=few?h:h+h}
window.renderBadges=badges;
heat('ghh',SITE.github.heat,SITE.github.seed);heat('lch',SITE.leetcode.heat,SITE.leetcode.seed);
badges('ghb',SITE.github.badges);badges('lcb',SITE.leetcode.badges);
heat('cch');badges('ccb',SITE.codechef.badges);
heat('cfh');badges('cfb',SITE.codeforces.badges);
var fb=SITE.leetcode.fallback||{};if(fb.solved){var tt={easy:900,medium:1900,hard:850};$('lc-total').textContent=fb.solved;if(fb.rank)$('lc-rank').textContent='#'+fb.rank;
[['e','easy'],['m','medium'],['h','hard']].forEach(function(k){if(fb[k[1]]){$('lc-'+k[0]).textContent=fb[k[1]];$('lc-'+k[0]+'b').style.width=Math.min(100,fb[k[1]]/tt[k[1]]*100)+'%'}})}
/* mobile menu */
var bg=$('burger'),mn=$('menu');
if(bg&&mn){var setMenu=function(o){mn.classList.toggle('open',o);bg.setAttribute('aria-expanded',o?'true':'false')};
bg.addEventListener('click',function(e){e.stopPropagation();setMenu(!mn.classList.contains('open'))});
mn.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false)});
document.addEventListener('click',function(e){if(!mn.contains(e.target))setMenu(false)});
addEventListener('keydown',function(e){if(e.key=='Escape')setMenu(false)});
addEventListener('resize',function(){if(innerWidth>820)setMenu(false)})}
})();
