/* Custom cursor: a circle that inverts the colors under it. Small dot over images. Moves with transform only and sleeps when idle. */
(function(){
var c=document.getElementById('cursor');
if(!c||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
document.documentElement.classList.add('has-cursor');
var x=-100,y=-100,tx=x,ty=y,s=1,ts=1,run=false;
function loop(){x+=(tx-x)*.3;y+=(ty-y)*.3;s+=(ts-s)*.25;
c.style.transform='translate3d('+x+'px,'+y+'px,0) translate(-50%,-50%) scale('+s+')';
if(Math.abs(tx-x)>.2||Math.abs(ty-y)>.2||Math.abs(ts-s)>.01)requestAnimationFrame(loop);else run=false}
function go(){if(!run){run=true;requestAnimationFrame(loop)}}
addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;c.classList.add('show');
var t=e.target,img=!!(t.closest&&t.closest('img,.photo,.shot')),big=!img&&!!(t.closest&&t.closest('a,button,.btn,.box,.tech,h1,h2'));
c.classList.toggle('img',img);ts=img?.67:big?1.83:1;go()},{passive:true});
document.documentElement.addEventListener('mouseleave',function(){c.classList.remove('show')});
})();
