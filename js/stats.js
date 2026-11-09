/* Live GitHub + LeetCode stats. If a request fails, the values written in index.html stay as the fallback. */
(function(){
var $=function(i){return document.getElementById(i)},G=SITE.github,L=SITE.leetcode;
function get(u,ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms||8000);
return fetch(u,{signal:c.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error(r.status);return r.json()})}
function set(id,v){var e=$(id);if(e&&v!==undefined&&v!==null)e.textContent=v}
function paint(id,counts,colors){var max=Math.max.apply(null,counts)||1,h='';
counts.forEach(function(n){h+='<i style="background:'+(n<=0?'rgba(128,128,128,.28)':colors[Math.min(2,Math.floor(n/max*3))])+'"></i>'});$(id).innerHTML=h}
/* GitHub: profile numbers, stars, contribution heatmap */
get('https://api.github.com/users/'+G.user).then(function(u){set('gh-repos',u.public_repos);set('gh-big',u.public_repos);set('gh-followers',u.followers)}).catch(function(){});
get('https://api.github.com/users/'+G.user+'/repos?per_page=100').then(function(rs){set('gh-stars',rs.reduce(function(a,r){return a+r.stargazers_count},0))}).catch(function(){});
get('https://github-contributions-api.jogruber.de/v4/'+G.user+'?y=last').then(function(d){
var days=d.contributions.slice(-364),pad=new Date(days[0].date+'T00:00:00').getDay(),c=[];
for(var i=0;i<pad;i++)c.push(0);days.forEach(function(x){c.push(x.count)});
paint('ghh',c,G.heat);set('gh-contrib',(d.total&&d.total.lastYear)||days.reduce(function(a,x){return a+x.count},0))}).catch(function(){});
/* LeetCode: solved counts, ranking, submission heatmap */
function lcDraw(s){set('lc-total',s.totalSolved);set('lc-rank',s.ranking?'#'+s.ranking:undefined);
[['e','easy','Easy'],['m','medium','Medium'],['h','hard','Hard']].forEach(function(k){var sv=s[k[1]+'Solved'],tt=s['total'+k[2]];
set('lc-'+k[0],tt?sv+' / '+tt:sv);var b=$('lc-'+k[0]+'b');if(b&&tt)b.style.width=(sv/tt*100)+'%'});
var cal=s.submissionCalendar;if(cal){if(typeof cal=='string')cal=JSON.parse(cal);
var c=[],n=new Date(),t0=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate());
for(var i=363;i>=0;i--)c.push(cal[String((t0-i*864e5)/1000)]||0);paint('lch',c,L.heat)}}
var A='https://alfa-leetcode-api.onrender.com/'+L.user;
/* tries several free LeetCode APIs one after another until one answers */
function lcTry(list,i){if(i>=list.length)return Promise.reject();
return list[i]().then(function(s){if(s&&typeof s.totalSolved=='number')return s;throw 0}).catch(function(){return lcTry(list,i+1)})}
lcTry([
function(){return get('https://leetcode-api-faisalshohag.vercel.app/'+L.user,15000)},
function(){return get('https://leetcode-stats-api.herokuapp.com/'+L.user)},
function(){return Promise.all([get(A+'/solved',45000),get(A+'/calendar',45000),get(A,45000).catch(function(){return{}})]).then(function(r){return{totalSolved:r[0].solvedProblem,easySolved:r[0].easySolved,mediumSolved:r[0].mediumSolved,hardSolved:r[0].hardSolved,ranking:r[2].ranking,submissionCalendar:r[1].submissionCalendar}})}
],0).then(lcDraw).catch(function(){});
/* LeetCode badges (images) */
function abs(u){return u&&u.charAt(0)=='/'?'https://leetcode.com'+u:u}
get(A+'/badges',45000).then(function(b){var l=(b.badges||[]).map(function(x){return{name:x.displayName||x.name,img:abs(x.icon)}});
if(l.length&&window.renderBadges)window.renderBadges('lcb',l);
var a=b.activeBadge;if(a){set('lc-active',a.displayName);var m=$('lc-medal');if(m&&a.icon){m.innerHTML='<img src="'+abs(a.icon)+'" alt="">';m.classList.add('im')}}}).catch(function(){});
/* CodeChef (unofficial public API) */
var CC=SITE.codechef;
get('https://codechef-api.vercel.app/handle/'+CC.user).then(function(d){if(d.success===false)throw 0;
set('cc-big',d.currentRating);set('cc-high',d.highestRating);set('cc-grank',d.globalRank);set('cc-medal',d.stars);
if(d.heatMap&&d.heatMap.length){var mp={};d.heatMap.forEach(function(x){var p=String(x.date).split('-');mp[Date.UTC(+p[0],+p[1]-1,+p[2])]=x.value});
var n=new Date(),t0=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()),c=[];for(var i=363;i>=0;i--)c.push(mp[t0-i*864e5]||0);paint('cch',c,CC.heat)}}).catch(function(){});
/* Codeforces (official API; requests run one after another to respect its rate limit) */
var CF=SITE.codeforces,cfl=[];
function cfGet(p){return get('https://codeforces.com/api/'+p).then(function(r){if(r.status!='OK')throw 0;return r.result})}
function cap(s){return s?s.replace(/\b\w/g,function(c){return c.toUpperCase()}):''}
function wait(ms){return function(){return new Promise(function(res){setTimeout(res,ms)})}}
function cfShow(){if(window.renderBadges&&cfl.length)window.renderBadges('cfb',cfl.slice())}
function nop(){}
cfGet('user.info?handles='+CF.user).then(function(r){var u=r[0];
set('cf-big',u.rating||'--');set('cf-rank',(cap(u.rank)||'Unrated').toUpperCase());set('cf-maxrank',cap(u.maxRank)||'--');set('cf-max',u.maxRating||'--');set('cf-friends',u.friendOfCount);
if(u.rank)cfl.push('Rank: '+cap(u.rank));if(u.maxRank)cfl.push('Max: '+cap(u.maxRank));cfShow()}).catch(nop)
.then(wait(1500)).then(function(){return cfGet('user.rating?handle='+CF.user)}).then(function(r){set('cf-contests',r.length);cfl.push(r.length+' Contests');cfShow()}).catch(nop)
.then(wait(1500)).then(function(){return cfGet('user.status?handle='+CF.user+'&from=1&count=2000')}).then(function(r){
var ok={},mp={},n=new Date(),t0=Date.UTC(n.getUTCFullYear(),n.getUTCMonth(),n.getUTCDate()),c=[];
r.forEach(function(x){var d=new Date(x.creationTimeSeconds*1000),k=Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate());mp[k]=(mp[k]||0)+1;if(x.verdict=='OK')ok[x.problem.contestId+x.problem.index]=1});
var cnt=Object.keys(ok).length;set('cf-solved',cnt);cfl.push(cnt+' Solved');cfShow();
for(var i=363;i>=0;i--)c.push(mp[t0-i*864e5]||0);paint('cfh',c,CF.heat)}).catch(nop);
})();
