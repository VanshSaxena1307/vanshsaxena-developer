/* dotted-page wireframe shapes that follow the mouse (lightweight: 30fps, capped pixel ratio, pauses when tab is hidden) */
(function(){var cv=document.getElementById('bg'),cx=cv.getContext('2d'),W,H,mx=0,my=0,sx=0,sy=0,sh=[],last=0,cs=['#ff4d8d','#3df5ff','#ffd600','#4d7cff'];
function ed(v,d){var e=[];for(var i=0;i<v.length;i++)for(var j=i+1;j<v.length;j++){var s=0;for(var k=0;k<3;k++)s+=Math.pow(v[i][k]-v[j][k],2);if(Math.abs(Math.sqrt(s)-d)<.01)e.push([i,j])}return e}
var cube=[],oct=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],p=1.618,ico=[],tor=[],te=[];
for(var a=-1;a<=1;a+=2)for(var b=-1;b<=1;b+=2){cube.push([a,b,1],[a,b,-1]);ico.push([0,a,b*p],[a,b*p,0],[b*p,0,a])}
for(var i=0;i<10;i++)for(var j=0;j<5;j++){var u=i/10*6.283,w=j/5*6.283,R=1+.4*Math.cos(w);tor.push([R*Math.cos(u),R*Math.sin(u),.4*Math.sin(w)]);te.push([i*5+j,i*5+(j+1)%5],[i*5+j,((i+1)%10)*5+j])}
var defs=[[cube,ed(cube,2)],[oct,ed(oct,Math.SQRT2)],[ico,ed(ico,2)],[tor,te]];
var N=innerWidth<700?6:10;
for(var n=0;n<N;n++)sh.push({k:n%4,x:(n*.37+.08)%1,y:(n*.53+.1)%1,s:28+(n*13%38),d:.5+(n%4)*.6,rx:1+(n%3)*.5,ry:.8+n%2,p:n,c:cs[n%4]});
function size(){var r=Math.min(window.devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;cv.width=W*r;cv.height=H*r;cx.setTransform(r,0,0,r,0,0)}
size();var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,150)});
addEventListener('pointermove',function(e){mx=e.clientX/W*2-1;my=e.clientY/H*2-1},{passive:true});
function draw(t){requestAnimationFrame(draw);if(document.hidden||t-last<33)return;last=t;
cx.clearRect(0,0,W,H);sx+=(mx-sx)*.12;sy+=(my-sy)*.12;cx.lineWidth=1.5;
sh.forEach(function(o){var d=defs[o.k],a=t*.0004,ax=a*o.rx+o.p,ay=a*o.ry+o.p,ca=Math.cos(ax),sa=Math.sin(ax),cb=Math.cos(ay),sb=Math.sin(ay);
var P=d[0].map(function(q){var y=q[1]*ca-q[2]*sa,z=q[1]*sa+q[2]*ca,x=q[0]*cb+z*sb;return[o.x*W-sx*o.d*70+x*o.s,o.y*H-sy*o.d*70+y*o.s]});
cx.strokeStyle=o.c;cx.beginPath();d[1].forEach(function(e){cx.moveTo(P[e[0]][0],P[e[0]][1]);cx.lineTo(P[e[1]][0],P[e[1]][1])});cx.stroke()});}
requestAnimationFrame(draw)})();
