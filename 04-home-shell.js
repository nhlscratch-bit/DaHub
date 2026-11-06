/* ===== Redesign logic ===== */
document.querySelectorAll('[data-brand]').forEach(el=>{const src=document.querySelector(el.dataset.brand==='wm'?'#splashScreen h1 img':'#splashScreen img[alt^="DaHub crowned"]');if(src)el.src=src.src;});
const TAB_LABEL={home:'Home',train:'Train',mind:'Mind',journal:'Journal',money:'Money',arcade:'Arcade',media:'Media',social:'Social',ask:'Ask AI',profile:'Profile'};
const SOON={pet:['Pet','Your virtual companion. Not built yet.'],games:['Mind Games','Brain games and puzzles. Not built yet.'],messages:['Messages','Direct messages need the online backend, which is not connected yet.']};
function switchTab(tabId){
  if(currentTab===tabId)return;
  try{playAudioTone(380,'sine',.05)}catch(e){}
  document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));
  const t=document.getElementById('tab-'+tabId);if(t)t.classList.add('active');
  currentTab=tabId;document.body.dataset.tab=tabId;
  document.querySelectorAll('#dock [data-d]').forEach(b=>{const k=b.dataset.d;b.classList.toggle('on',k===tabId||(k==='more'&&['media','ask','profile','arcade'].includes(tabId))||(k==='mind'&&tabId==='journal'))});
  document.getElementById('dockLabel').textContent=TAB_LABEL[tabId]||'Home';
  window.scrollTo({top:0,behavior:'smooth'});
  if(tabId==='home')updateHome();
  if(tabId==='social'&&typeof renderSocial==='function')renderSocial();
  if(window.SECTIONS&&SECTIONS[tabId])SECTIONS[tabId]();
}
document.body.dataset.tab='home';document.querySelector('#dock [data-d="home"]').classList.add('on');
function dockCenter(){const c=document.getElementById('dockC');c.classList.remove('spin');void c.offsetWidth;c.classList.add('spin');switchTab('home')}
function goDock(k){if(k==='more')return openMore();if(SOON[k])return openSoon(k);switchTab(k)}
function goTile(k){goDock(k)}
function openSheet(title,html){closeSheet();const d=document.createElement('div');d.id='dhSheet';d.className='fixed inset-0 z-[80] flex items-end justify-center bg-black/70';d.onclick=e=>{if(e.target===d)closeSheet()};d.innerHTML='<div class="sheet chrome" style="border-radius:28px 28px 0 0;padding-bottom:calc(22px + env(safe-area-inset-bottom,0px))"><div class="flex items-center justify-between mb-3"><h3 class="font-display font-extrabold text-lg">'+title+'</h3><button onclick="closeSheet()" class="text-sm text-white/60">Close</button></div>'+html+'</div>';document.body.appendChild(d)}
function closeSheet(){const d=document.getElementById('dhSheet');if(d)d.remove()}
function openSoon(k){const [n,m]=SOON[k];openSheet(n,'<p class="text-sm text-white/75">'+m+'</p><button onclick="closeSheet()" class="mt-4 w-full py-3 rounded-2xl bg-graphite border border-graphiteBorder text-sm font-bold">Got it</button>')}
function openMore(){
  const it=(ic,l,fn,soon)=>'<button onclick="closeSheet();'+fn+'" class="chrome py-4 flex flex-col items-center gap-1 text-xs font-bold"><i class="ph-fill '+ic+' text-2xl text-neonPurple"></i>'+l+(soon?'<span class="text-[9px] text-white/50 font-normal">Soon</span>':'')+'</button>';
  openSheet('More','<div class="grid grid-cols-3 gap-3">'+it('ph-play','Media',"switchTab('media')")+it('ph-sparkle','Ask AI',"switchTab('ask')")+it('ph-user','Profile',"switchTab('profile')")+it('ph-game-controller','Arcade',"openSoon('arcade')",1)+it('ph-paw-print','Pet',"openSoon('pet')",1)+it('ph-notebook','Journal',"openSoon('journal')",1)+'</div>');
}
/* notifications */
let notifs=JSON.parse(localStorage.getItem('dahub_notifs_v3')||'[]'),notifRead=+localStorage.getItem('dahub_notifread_v3')||0;
const __toast=window.showNotificationToast;
window.showNotificationToast=function(m){__toast(m);notifs.unshift({t:m,ts:Date.now()});notifs=notifs.slice(0,30);localStorage.setItem('dahub_notifs_v3',JSON.stringify(notifs));updateBell()};
function updateBell(){const n=Math.max(0,notifs.length-notifRead),b=document.getElementById('bellBadge');if(!b)return;b.style.display=n?'block':'none';b.textContent=n>9?'9+':n}
function openNotifs(){notifRead=notifs.length;localStorage.setItem('dahub_notifread_v3',notifRead);updateBell();openSheet('Notifications',notifs.length?'<div class="space-y-2 max-h-[50vh] overflow-y-auto">'+notifs.map(n=>'<div class="rounded-2xl bg-black/50 p-3 text-sm">'+mEsc(n.t)+'<span class="block text-[10px] text-white/40 mt-1">'+ago(n.ts)+'</span></div>').join('')+'</div>':'<p class="text-sm text-white/60">Nothing yet. Likes, XP and saves show up here.</p>')}
/* home data */
const dayKey=t=>{const d=new Date(t);return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()};
function streakDays(){const S=new Set();workouts.forEach(w=>{const t=+String(w.id).split('_')[1];if(t)S.add(dayKey(t))});sPosts.filter(p=>p.h===me().h).forEach(p=>S.add(dayKey(p.ts)));let n=0,d=new Date();if(!S.has(dayKey(d)))d.setDate(d.getDate()-1);while(S.has(dayKey(d))){n++;d.setDate(d.getDate()-1)}return n}
const fmtN=n=>n>=1e4?(n/1e3).toFixed(1).replace(/\.0$/,'')+'K':n.toLocaleString();
const setRing=(id,v,goal)=>{const c=document.getElementById('r_'+id);if(c)c.style.strokeDashoffset=150.8*(1-Math.min(1,v/goal));const t=document.getElementById('v_'+id);if(t)t.textContent=fmtN(v)};
let socialKey='';
function hashtag(t){return mEsc(t).replace(/#\w+/g,m=>'<span class="hl">'+m+'</span>')}
function updateHome(){
  const lvl=1+Math.floor(userXp/250),pr=(userXp%250)/250;
  document.getElementById('hLvl').textContent='Level '+lvl;document.getElementById('hBar').style.width=Math.max(4,pr*100)+'%';
  document.getElementById('hRing').style.strokeDashoffset=163.4*(1-pr);
  const vol=Math.round(workouts.reduce((a,w)=>a+w.weight*w.reps,0)),mine=sPosts.filter(p=>p.h===me().h).length;
  setRing('sets',workouts.length,20);setRing('vol',vol,10000);setRing('posts',mine,5);
  const n=streakDays(),ms=[3,7,14,30,60,100,365].find(m=>m>n)||365;
  document.getElementById('stkDays').textContent=n+(n===1?' Day':' Days');
  document.getElementById('stkMsg').textContent=n?'Keep it going! Next: '+ms+' days.':'Log a set or post to start.';
  document.getElementById('stkBar').style.width=(n?Math.max(6,n/ms*100):0)+'%';
  const nm=document.getElementById('homeName');if(nm){nm.style.fontSize=nm.textContent.length>9?'30px':'42px'}
  const p=sPosts[0],key=p?p.id+p.likes.length+p.comments.length:'official';
  if(key!==socialKey){socialKey=key;const hs=document.getElementById('homeSocial');
    if(p){hs.innerHTML='<div class="flex gap-3">'+avatar(p.name,p.c)+'<div class="min-w-0 flex-1"><p class="text-sm font-bold text-white truncate">'+mEsc(p.name)+'</p><p class="text-[11px] text-white/50">'+ago(p.ts)+' &bull; Public</p><p class="text-[13px] text-white/90 mt-1 line-clamp-3">'+hashtag(p.text||'')+'</p></div>'+(p.kind==='photo'?'<img data-m="'+p.media+'" class="w-24 h-24 rounded-xl object-cover shrink-0">':'')+'</div><div class="flex gap-5 mt-3 text-xs text-white/70"><button onclick="toggleLike(\''+p.id+'\');updateHome()" class="'+(p.likes.includes(me().h)?'text-accentPink font-bold':'')+'">&#9829; '+p.likes.length+'</button><button onclick="switchTab(\'social\')">Comments '+p.comments.length+'</button><button onclick="sharePost(\''+p.id+'\')">Share</button></div>';
      hs.querySelectorAll('[data-m]').forEach(async el=>{try{const b=await idbGet(el.dataset.m);if(b)el.src=URL.createObjectURL(b)}catch(e){}})}
    else hs.innerHTML='<div class="flex gap-3"><img data-brand="emb" class="w-12 h-12 object-contain shrink-0"><div class="min-w-0"><p class="text-sm font-bold text-white flex items-center gap-1">DaHub Official <i class="ph-fill ph-seal-check text-[#6aa7ff]"></i></p><p class="text-[11px] text-white/50">Welcome &bull; Public</p><p class="text-[13px] text-white/90 mt-1">One Hub. Every Side of Life. &#128170;</p><p class="text-[12px]"><span class="hl">#DaHub #Fitness #Mindset #Culture</span></p></div></div><button onclick="openComposer(\'text\')" class="mt-3 w-full py-2.5 rounded-xl bg-[#7CFF3A] text-black text-xs font-extrabold">Make the first post</button>';
    hs.querySelectorAll('[data-brand]').forEach(el=>{const e=document.querySelector('#splashScreen img[alt^="DaHub crowned"]');if(e)el.src=e.src})}
  updateBell();
}
updateHome();setInterval(updateHome,1500);
