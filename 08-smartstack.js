/* ===== DaHub Home smart stack: swipe up/down through widgets ===== */
(function(){
const K='dahub_steps_v1',G=10000,T=()=>ymd(),fmt=n=>n.toLocaleString('en-US');
const PL=[['Active Recovery',['Walk 30 min','Mobility flow','Foam rolling','Core holds'],'35 min'],['Push Day',['Bench Press','Incline DB Press','Overhead Press','Dips'],'45 min'],['Pull Day',['Pull-Ups','Barbell Row','Lat Pulldown','Bicep Curl'],'45 min'],['Leg Day',['Squat','Romanian Deadlift','Leg Press','Lunges'],'50 min'],['Upper Body',['Bench Press','Barbell Row','Overhead Press','Tricep Pushdown'],'50 min'],['Full Body',['Deadlift','Squat','Pull-Ups','Dips'],'55 min'],['Cardio + Core',['Run 20 min','Intervals x6','Plank holds','Leg raises'],'40 min']];
const ico=(n,c='')=>`<i class="ph-fill ${n} ${c}"></i>`;
const hd=(i,t)=>`<p class="ss-h">${ico(i)}<span>${t}</span></p>`;
const steps=()=>LS(K,{})[T()]||0;
let W=null,WS='idle',ssI=(h=>h<11?0:h<18?1:4)(new Date().getHours());

const c1=()=>{const p=PL[new Date().getDay()];return hd('ph-barbell','Workout of the day')+`<p class="ss-big">${p[0]}</p><p class="ss-sm">${p[1].join(' · ')}</p><p class="ss-sm">About ${p[2]}</p><button class="gbtn ss-btn" onclick="switchTab('train')">Start <i class="ph-bold ph-caret-right"></i></button>`};

const c2=()=>{const l=[...sPosts].sort((a,b)=>b.ts-a.ts).slice(0,2);return hd('ph-users-three','Friends feed')+(l.length?l.map(p=>`<div class="ss-row">${avatar(p.name,p.c)}<div><b>${mEsc(p.name)}<small>${ago(p.ts)}</small></b><p>${mEsc((p.text||'Shared a post').slice(0,80))}</p></div></div>`).join('')+`<button class="ss-link" onclick="goSocial('feed')">See feed &rarr;</button>`:`<p class="ss-sm">No posts from friends yet.</p><button class="gbtn ss-btn" onclick="goSocial('friends')">Find friends</button>`)};

const WC=c=>c===0?['ph-sun','Clear']:c<=3?['ph-cloud','Partly cloudy']:c<=48?['ph-cloud','Foggy']:(c<=67||(c>=80&&c<=82))?['ph-cloud-rain','Rain']:(c<=77||c===85||c===86)?['ph-snowflake','Snow']:['ph-lightning','Storms'];
async function wLoad(a,o){WS='load';ssRender();try{const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${a}&longitude=${o}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`),j=await r.json();W={t:Math.round(j.current.temperature_2m),c:j.current.weather_code,w:Math.round(j.current.wind_speed_10m)};WS='ok'}catch(e){WS='err'}ssRender()}
function ssWeather(){const s=LS('dahub_geo_v1',null);if(s){wLoad(s.lat,s.lon);return}if(!navigator.geolocation){WS='err';ssRender();return}WS='load';ssRender();navigator.geolocation.getCurrentPosition(p=>{const a=+p.coords.latitude.toFixed(2),o=+p.coords.longitude.toFixed(2);SV('dahub_geo_v1',{lat:a,lon:o});wLoad(a,o)},()=>{WS='deny';ssRender()},{timeout:8000})}
const c3=()=>{const b=hd('ph-sun','Weather');if(WS==='ok'){const w=WC(W.c);return b+`<div class="ss-wx">${ico(w[0],'ss-wi')}<p class="ss-big">${W.t}&deg;F</p></div><p class="ss-sm">${w[1]} · wind ${W.w} mph</p>`}
return b+`<p class="ss-sm">${WS==='load'?'Loading...':WS==='deny'?'Location is blocked. Allow it in your browser settings.':WS==='err'?'Could not load weather here. Try again later.':'See your local weather. Your location stays on this device.'}</p>`+(WS==='load'?'':`<button class="gbtn ss-btn" onclick="ssWeather()">${WS==='idle'?'Enable weather':'Try again'}</button>`)};

const c4=()=>{const s=steps(),k=Math.round(s*.04+workouts.length*7),C=2*Math.PI*34,p=Math.min(1,s/G);return hd('ph-footprints','Steps + calories')+`<div class="ss-st"><svg viewBox="0 0 80 80" class="ss-ring"><circle cx="40" cy="40" r="34" class="ss-t"/><circle cx="40" cy="40" r="34" class="ss-p" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}"/></svg><div><p class="ss-big">${fmt(s)}</p><p class="ss-sm">of ${fmt(G)} steps</p><p class="ss-sm">${ico('ph-fire')} About ${k} kcal (estimate)</p></div></div><div class="ss-btns"><button class="pbtn" onclick="ssStep(500)">+500</button><button class="pbtn" onclick="ssStep(1000)">+1,000</button><button class="pbtn" onclick="ssStep(-500)">-500</button></div>`};

const c5=()=>{const cur=(MM[T()]||{}).m;return hd('ph-brain','Mind check-in')+`<p class="ss-sm">${cur?'Logged for today. Tap to change it.':'How are you feeling today?'}</p><div class="ss-faces">${MOODS.map(m=>`<button aria-label="${m[1]}" class="face${cur===m[0]?' on':''}" style="--c:${m[3]}" onclick="ssMood('${m[0]}')">${ico(m[2])}</button>`).join('')}</div><button class="ss-link" onclick="switchTab('mind')">Open Mind &rarr;</button>`};

const c6=()=>{const m=T().slice(0,7),tx=(MD.tx||[]).filter(t=>String(t.date||'').slice(0,7)===m);let i=0,e=0;tx.forEach(t=>t.type==='income'?i+=+t.amt:e+=+t.amt);const n=i-e,d=v=>mHide?'•••':'$'+Math.abs(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});return hd('ph-currency-dollar','Money this month')+(tx.length?`<p class="ss-big">${n<0?'-':''}${d(n)}</p><p class="ss-sm">In ${d(i)} · Out ${d(e)}</p>`:`<p class="ss-sm">No transactions yet this month.</p>`)+`<button class="gbtn ss-btn" onclick="switchTab('money')">${tx.length?'Open Money':'Add transaction'} <i class="ph-bold ph-caret-right"></i></button>`};

const CARDS=[c1,c2,c3,c4,c5,c6];
function ssRender(){const t=document.getElementById('ssTrack');if(!t)return;t.innerHTML=CARDS.map(f=>{let h='';try{h=f()}catch(e){h='<p class="ss-sm">Unavailable right now.</p>'}return `<section class="ss-card chrome">${h}</section>`}).join('');if(t.clientHeight)t.scrollTop=ssI*t.clientHeight;ssDots()}
function ssDots(){const t=document.getElementById('ssTrack'),d=document.getElementById('ssDots');if(!t||!d)return;if(t.clientHeight)ssI=Math.round(t.scrollTop/t.clientHeight);d.innerHTML=CARDS.map((_,k)=>`<button aria-label="Card ${k+1}" class="${k===ssI?'on':''}" onclick="ssGo(${k})"></button>`).join('')}
function ssGo(k){const t=document.getElementById('ssTrack');t.scrollTo({top:k*t.clientHeight,behavior:'smooth'})}
Object.assign(window,{ssRender,ssDots,ssGo,ssWeather,
 ssStep:d=>{const o=LS(K,{});o[T()]=Math.max(0,steps()+d);SV(K,o);ssRender()},
 ssMood:id=>{MM[T()]={m:id,ts:Date.now()};SV('dahub_mood_v1',MM);ssRender();if(typeof showNotificationToast==='function')showNotificationToast('Mood logged')}});

function ssInit(){const h=document.querySelector('#tab-home .hero');if(!h||document.getElementById('ssTrack'))return;
 h.outerHTML='<div class="ss"><p class="ss-hey sub-ttl">Hey, <span id="homeName">there</span></p><div class="ss-wrap"><div id="ssTrack" class="ss-track" onscroll="ssDots()"></div><div id="ssDots" class="ss-dots"></div></div></div>';
 ssRender();try{applyUserName()}catch(e){}
 if(LS('dahub_geo_v1',null))ssWeather();
 const o=window.switchTab;if(typeof o==='function')window.switchTab=function(t){const r=o.apply(this,arguments);if(t==='home')setTimeout(ssRender,30);return r}}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',ssInit):ssInit();
})();
