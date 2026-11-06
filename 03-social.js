/* ===== DaHub Social v3: friends, feed, shorts, composer (local-first) ===== */
const SK = { p: 'dahub_sposts_v3', f: 'dahub_people_v3', h: 'dahub_handle_v3' };
const ld = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
let sPosts = ld(SK.p, []), people = ld(SK.f, []), sView = 'feed', sFilter = 'all', openCm = {}, cmp = null;
const me = () => ({ name: localStorage.getItem('dahub_name_v3') || 'You', h: localStorage.getItem(SK.h) || 'you' });
const persist = () => { localStorage.setItem(SK.p, JSON.stringify(sPosts)); localStorage.setItem(SK.f, JSON.stringify(people)); };
const ago = t => { const m = Math.floor((Date.now() - t) / 60000); return m < 1 ? 'now' : m < 60 ? m + 'm' : m < 1440 ? Math.floor(m / 60) + 'h' : Math.floor(m / 1440) + 'd'; };
const ini = n => (n || '?')[0].toUpperCase();
const avatar = (n, c) => `<div class="w-10 h-10 rounded-2xl flex items-center justify-center font-display font-black text-sm text-obsidian shrink-0" style="background:${c || 'linear-gradient(135deg,#D78BFF,#B7F36B)'}">${mEsc(ini(n))}</div>`;
const idb = new Promise((res, rej) => { const r = indexedDB.open('dahub_media_v3', 1); r.onupgradeneeded = () => r.result.createObjectStore('m'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const idbPut = async (k, b) => { const d = await idb; return new Promise((res, rej) => { const t = d.transaction('m', 'readwrite'); t.objectStore('m').put(b, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); };
const idbGet = async k => { const d = await idb; return new Promise((res, rej) => { const q = d.transaction('m').objectStore('m').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
const goSocial = v => { sView = v; renderSocial(); if (typeof switchTab === 'function') switchTab('social'); };
const ytId = t => { const m = (t || '').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : ''; };

function updateHomeStats() {
  const s = (i, v) => { const e = document.getElementById(i); if (e) e.textContent = v; };
  s('statSets', workouts.length); s('statPosts', sPosts.filter(p => p.h === me().h).length); s('statSaved', watchlist.length);
}
function applyUserName() {
  const n = localStorage.getItem('dahub_name_v3'); if (!n) return;
  const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
  let since = localStorage.getItem('dahub_since_v3');
  if (!since) { since = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); localStorage.setItem('dahub_since_v3', since); }
  set('homeName', n); set('profileName', n); set('profileHandle', '@' + me().h + ' \u2022 Member since ' + since);
  set('userHeaderAvatar', ini(n)); set('profileAvatar', ini(n));
}
function saveUserName() {
  const n = document.getElementById('nameInput').value.trim();
  const h = document.getElementById('handleInput').value.trim().toLowerCase().replace(/[^a-z0-9._]/g, '');
  if (!n || h.length < 2) { document.getElementById('nameErr').textContent = 'Add a name and a handle (2+ characters).'; return; }
  localStorage.setItem('dahub_name_v3', n); localStorage.setItem(SK.h, h);
  document.getElementById('nameModal').remove(); applyUserName(); renderSocial();
}
function openOnboarding() {
  const old = document.getElementById('nameModal'); if (old) old.remove();
  if (localStorage.getItem('dahub_name_v3')) return;
  const emb = document.querySelector('#splashScreen img[alt^="DaHub crowned"]').src, wm = document.querySelector('#splashScreen h1 img').src;
  const d = document.createElement('div'); d.id = 'nameModal';
  d.className = 'fixed inset-0 z-[45] bg-obsidian overflow-y-auto flex flex-col items-center justify-center p-6 text-center';
  d.style.background = 'radial-gradient(circle at 50% 30%,#2a1d4d 0,#101116 62%)';
  d.innerHTML = `<img src="${emb}" alt="" class="w-40 h-auto drop-shadow-[0_0_24px_rgba(167,139,250,0.6)]"><img src="${wm}" alt="DaHub" class="w-56 h-auto -mt-2">
    <p class="text-[11px] tracking-[0.25em] text-cloudMuted font-bold mt-1">ONE HUB. EVERY SIDE OF LIFE.</p>
    <div class="w-full max-w-xs mt-7 space-y-3">
      <input id="nameInput" maxlength="24" placeholder="Your name" oninput="const h=document.getElementById('handleInput');if(!h.dataset.t)h.value=this.value.toLowerCase().replace(/[^a-z0-9._]/g,'')" class="w-full bg-graphite border border-graphiteBorder rounded-2xl px-4 py-3.5 text-sm text-cloud text-center">
      <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-cloudMuted text-sm">@</span><input id="handleInput" maxlength="20" placeholder="handle" oninput="this.dataset.t=1" class="w-full bg-graphite border border-graphiteBorder rounded-2xl pl-9 pr-4 py-3.5 text-sm text-cloud text-center"></div>
      <p id="nameErr" class="text-xs text-accentPink min-h-[1rem]"></p>
      <button onclick="saveUserName()" class="btn-chunky w-full py-3.5 rounded-2xl bg-gradient-to-r from-neonPurple via-violetHub to-volt text-obsidian font-display font-extrabold text-sm uppercase tracking-wider">Enter DaHub</button>
      <p class="text-[10px] text-cloudMuted">Your handle is how friends find you.</p>
    </div>`;
  document.body.appendChild(d);
}

/* ---- data actions ---- */
function toggleLike(id) { const p = sPosts.find(x => x.id === id), h = me().h; p.likes = p.likes.includes(h) ? p.likes.filter(x => x !== h) : [...p.likes, h]; persist(); renderSocial(); }
function toggleCm(id) { openCm[id] = !openCm[id]; renderSocial(); }
function addComment(id) {
  const i = document.getElementById('cm_' + id), t = i.value.trim(); if (!t) return;
  sPosts.find(x => x.id === id).comments.push({ h: me().h, name: me().name, t, ts: Date.now() }); persist(); openCm[id] = true; renderSocial();
}
function delPost(id) { if (!confirm('Delete this post?')) return; sPosts = sPosts.filter(p => p.id !== id); persist(); renderSocial(); }
async function sharePost(id) {
  const p = sPosts.find(x => x.id === id), txt = (p.text || 'Check this out') + ' \u2014 on DaHub';
  try { if (navigator.share) await navigator.share({ text: txt }); else { await navigator.clipboard.writeText(txt); showNotificationToast('Copied'); } } catch (e) {}
}
function addByHandle() {
  const i = document.getElementById('addHandle'), h = i.value.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9._]/g, '');
  if (!h) return; if (h === me().h) { showNotificationToast("That's you"); return; }
  if (people.some(p => p.h === h)) { showNotificationToast('Already added'); return; }
  people.push({ h, name: h, st: 'pending' }); persist(); renderSocial(); showNotificationToast('Request saved for @' + h);
}
function removePerson(h) { people = people.filter(p => p.h !== h); sPosts = sPosts.filter(p => !(p.demo && p.h === h)); persist(); renderSocial(); }
function addTestFriends() {
  const T = [['ava.moves', 'Ava (test)', 'Morning run done. 5K and a coffee, what is everyone up to?', '#FF779D'], ['tre.hoops', 'Tre (test)', 'Pickup tonight at 7. Who is in?', '#65C7F2'], ['lina.lifts', 'Lina (test)', 'New deadlift PR. Slow and steady wins.', '#B7F36B']];
  T.forEach(([h, name, text, c], k) => {
    if (people.some(p => p.h === h)) return;
    people.push({ h, name, st: 'friend', demo: true, c });
    sPosts.push({ id: 'd_' + h, h, name, demo: true, c, kind: 'text', text, ts: Date.now() - (k + 1) * 2400000, likes: [], comments: [] });
  });
  persist(); renderSocial();
}
function removeTestFriends() { const hs = people.filter(p => p.demo).map(p => p.h); people = people.filter(p => !p.demo); sPosts = sPosts.filter(p => !p.demo); persist(); renderSocial(); }
async function inviteFriends() {
  const t = 'Join me on DaHub. My handle: @' + me().h;
  try { if (navigator.share) await navigator.share({ text: t, url: location.href.startsWith('http') ? location.href : undefined }); else { await navigator.clipboard.writeText(t); showNotificationToast('Invite copied'); } } catch (e) {}
}

/* ---- composer ---- */
function openCreateModal() { openComposer(sView === 'shorts' ? 'short' : 'text'); }
function openComposer(kind) {
  cmp = { kind, file: null, yt: '' };
  const d = document.createElement('div'); d.id = 'cmpModal'; d.className = 'fixed inset-0 z-[60] bg-black/70 flex items-end md:items-center justify-center';
  d.onclick = e => { if (e.target === d) closeComposer(); };
  document.body.appendChild(d); drawComposer();
}
function closeComposer() { const d = document.getElementById('cmpModal'); if (d) d.remove(); cmp = null; }
function drawComposer() {
  const d = document.getElementById('cmpModal'); if (!d) return;
  const keep = (document.getElementById('cmpText') || {}).value || '';
  const K = [['text', 'Post'], ['photo', 'Photo'], ['short', 'Short'], ['workout', 'Workout']];
  d.innerHTML = `<div class="w-full max-w-md glass-panel-elevated rounded-t-3xl md:rounded-3xl border border-graphiteBorder p-5 space-y-3 max-h-[90vh] overflow-y-auto">
    <div class="flex items-center justify-between"><h3 class="font-display font-extrabold text-lg text-white">Create</h3><button onclick="closeComposer()" class="text-cloudMuted text-sm">Close</button></div>
    <div class="flex gap-2">${K.map(([k, l]) => `<button onclick="cmp.kind='${k}';drawComposer()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${cmp.kind === k ? 'bg-[#7CFF3A] text-black' : 'bg-graphite text-cloudMuted border border-graphiteBorder'}">${l}</button>`).join('')}</div>
    <textarea id="cmpText" rows="3" placeholder="${cmp.kind === 'workout' ? 'Say something about your session...' : 'What is moving you today?'}" class="w-full bg-obsidian border border-graphiteBorder rounded-2xl px-4 py-3 text-sm text-cloud">${mEsc(keep)}</textarea>
    ${cmp.kind === 'photo' ? `<input type="file" accept="image/*" onchange="cmp.file=this.files[0]" class="text-xs text-cloudMuted w-full">` : ''}
    ${cmp.kind === 'short' ? `<p class="text-[11px] text-cloudMuted">Record or pick a vertical video, or paste a YouTube Shorts link.</p><input type="file" accept="video/*" onchange="cmp.file=this.files[0]" class="text-xs text-cloudMuted w-full"><input id="cmpYt" placeholder="https://youtube.com/shorts/..." class="w-full bg-obsidian border border-graphiteBorder rounded-2xl px-4 py-2.5 text-xs text-cloud">` : ''}
    ${cmp.kind === 'workout' ? (workouts.length ? `<div class="rounded-2xl bg-obsidian border border-graphiteBorder p-3 text-xs text-cloud">Sharing ${workouts.length} logged sets from Train.</div>` : `<div class="rounded-2xl bg-obsidian border border-graphiteBorder p-3 text-xs text-cloudMuted">Log a set in Train first, then share it here.</div>`) : ''}
    <p id="cmpErr" class="text-xs text-accentPink min-h-[1rem]"></p>
    <button onclick="submitPost()" class="btn-chunky w-full py-3 rounded-2xl bg-[#7CFF3A] text-black font-display font-extrabold text-sm uppercase">Post</button></div>`;
}
async function submitPost() {
  const text = document.getElementById('cmpText').value.trim(), err = t => { document.getElementById('cmpErr').textContent = t; };
  const k = cmp.kind, P = { id: 'p_' + Date.now(), h: me().h, name: me().name, kind: k, text, ts: Date.now(), likes: [], comments: [] };
  if (k === 'photo') { if (!cmp.file) return err('Pick a photo.'); await idbPut(P.id, cmp.file); P.media = P.id; }
  if (k === 'short') {
    const y = ytId((document.getElementById('cmpYt') || {}).value);
    if (y) P.yt = y; else if (cmp.file) { await idbPut(P.id, cmp.file); P.media = P.id; } else return err('Add a video or a YouTube Shorts link.');
  }
  if (k === 'workout') {
    if (!workouts.length) return err('Log a set in Train first.');
    P.w = { sets: workouts.length, vol: Math.round(workouts.reduce((a, w) => a + w.weight * w.reps, 0)), ex: [...new Set(workouts.map(w => w.exercise))].slice(0, 4) };
  }
  if (k === 'text' && !text) return err('Write something first.');
  sPosts.unshift(P); persist(); closeComposer(); awardXp(15, 'Posted'); goSocial(k === 'short' ? 'shorts' : 'feed');
}

/* ---- views ---- */
const friendHs = () => people.filter(p => p.st === 'friend').map(p => p.h);
function postCard(p) {
  const mine = p.h === me().h, liked = p.likes.includes(me().h);
  const media = p.kind === 'photo' ? `<img data-m="${p.media}" class="w-full rounded-2xl mt-3 max-h-96 object-cover bg-obsidian">`
    : p.kind === 'short' ? (p.yt ? `<iframe class="w-full aspect-[9/16] max-h-[28rem] rounded-2xl mt-3" src="https://www.youtube.com/embed/${encodeURIComponent(p.yt)}?playsinline=1&rel=0" allowfullscreen></iframe>` : `<video data-m="${p.media}" controls playsinline class="w-full rounded-2xl mt-3 max-h-[28rem] bg-black"></video>`) : '';
  const wk = p.w ? `<div class="mt-3 rounded-2xl p-4 bg-gradient-to-br from-volt/20 to-neonPurple/20 border border-volt/30"><p class="text-[10px] tracking-widest text-volt font-bold">TRAINING SESSION</p><div class="flex gap-6 mt-1"><div><p class="text-2xl font-display font-black text-white">${p.w.sets}</p><p class="text-[10px] text-cloudMuted uppercase">Sets</p></div><div><p class="text-2xl font-display font-black text-white">${p.w.vol.toLocaleString()}</p><p class="text-[10px] text-cloudMuted uppercase">Volume</p></div></div><p class="text-xs text-cloud mt-2">${p.w.ex.map(mEsc).join(' \u2022 ')}</p></div>` : '';
  const cms = (openCm[p.id] ? `<div class="mt-3 space-y-2">${p.comments.map(c => `<p class="text-xs text-cloud"><b>@${mEsc(c.h)}</b> ${mEsc(c.t)}</p>`).join('')}<div class="flex gap-2"><input id="cm_${p.id}" placeholder="Add a comment" onkeydown="if(event.key==='Enter')addComment('${p.id}')" class="flex-1 bg-obsidian border border-graphiteBorder rounded-xl px-3 py-2 text-xs text-cloud"><button onclick="addComment('${p.id}')" class="text-xs font-bold text-accentPink px-2">Send</button></div></div>` : '');
  return `<article class="neon p-4" style="--c:#a855f7">
    <div class="flex items-center gap-3">${avatar(p.name, p.c)}<div class="flex-1 min-w-0"><p class="text-sm font-bold text-cloud truncate">${mEsc(p.name)}${p.demo ? ' <span class="text-[9px] px-1.5 py-0.5 rounded bg-graphite text-cloudMuted">TEST</span>' : ''}</p><p class="text-[11px] text-cloudMuted">@${mEsc(p.h)} \u2022 ${ago(p.ts)}</p></div>${mine ? `<button onclick="delPost('${p.id}')" class="text-cloudMuted text-xs p-1">Delete</button>` : ''}</div>
    ${p.text ? `<p class="text-sm text-cloud mt-3 whitespace-pre-wrap">${mEsc(p.text)}</p>` : ''}${media}${wk}
    <div class="flex items-center gap-5 mt-3 text-xs text-cloudMuted"><button onclick="toggleLike('${p.id}')" class="${liked ? 'text-accentPink font-bold' : ''}">${liked ? '\u2665' : '\u2661'} ${p.likes.length}</button><button onclick="toggleCm('${p.id}')">Comment ${p.comments.length}</button><button onclick="sharePost('${p.id}')">Share</button></div>${cms}</article>`;
}
function feedView() {
  const fh = friendHs(), list = sPosts.filter(p => sFilter === 'friends' ? fh.includes(p.h) : true);
  const chip = (k, l) => `<button onclick="sFilter='${k}';renderSocial()" class="px-3.5 py-1.5 rounded-xl text-xs font-bold ${sFilter === k ? 'bg-[#7CFF3A] text-black' : 'bg-graphite text-cloudMuted border border-graphiteBorder'}">${l}</button>`;
  return `<div class="neon flex items-center gap-3 p-3" style="--c:#a855f7;border-radius:22px">${avatar(me().name)}<button onclick="openComposer('text')" class="flex-1 text-left italic text-white/45 font-['Permanent_Marker'] text-[15px]">What's on your mind?</button><button onclick="openComposer('photo')" aria-label="Photo" class="text-[#7CFF3A] text-3xl"><i class="ph-bold ph-camera"></i></button><span class="w-px h-8 bg-white/20"></span><button onclick="openComposer('short')" aria-label="Short" class="text-[#a855f7] text-3xl"><i class="ph-bold ph-lightning"></i></button></div>
  <div class="grid grid-cols-4 gap-2">${[['text', 'Post', 'ph-pencil-simple'], ['photo', 'Photo', 'ph-image'], ['short', 'Short', 'ph-video-camera'], ['workout', 'Workout', 'ph-barbell']].map(([k, l, ic]) => `<button onclick="openComposer('${k}')" class="chipx justify-center !px-1 !text-[12px]"><i class="ph-bold ${ic}"></i>${l}</button>`).join('')}</div>
  <div class="flex gap-2">${chip('all', 'Everyone')}${chip('friends', 'Friends')}</div>
  ${list.length ? list.map(postCard).join('') : `<div class="text-center py-12 text-cloudMuted space-y-3 px-4"><p class="text-sm font-bold text-cloud">Your feed is empty</p><p class="text-xs">Post something, or add friends to see their updates here.</p><button onclick="goSocial('friends')" class="px-4 py-2 rounded-xl bg-[#7CFF3A] text-black text-xs font-bold">Find friends</button></div>`}`;
}
function shortsView() {
  const l = sPosts.filter(p => p.kind === 'short');
  if (!l.length) return `<div class="text-center py-14 text-cloudMuted space-y-3 px-4"><p class="text-sm font-bold text-cloud">No shorts yet</p><p class="text-xs">Record a vertical clip or share a YouTube Short.</p><button onclick="openComposer('short')" class="px-4 py-2 rounded-xl bg-[#7CFF3A] text-black text-xs font-bold">Post a short</button></div>`;
  return `<div style="height:70vh;overflow-y:auto;scroll-snap-type:y mandatory" class="rounded-3xl space-y-3">${l.map(p => `<div style="height:70vh;scroll-snap-align:start" class="relative rounded-3xl overflow-hidden bg-black">${p.yt ? `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${encodeURIComponent(p.yt)}?playsinline=1&rel=0" allowfullscreen></iframe>` : `<video data-m="${p.media}" data-short loop muted playsinline onclick="this.paused?this.play():this.pause()" class="w-full h-full object-contain"></video>`}<div class="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"><p class="text-sm font-bold text-white">@${mEsc(p.h)}</p><p class="text-xs text-white/90">${mEsc(p.text)}</p></div><div class="absolute right-3 bottom-20 flex flex-col gap-4 text-white text-xs text-center"><button onclick="toggleLike('${p.id}')">${p.likes.includes(me().h) ? '\u2665' : '\u2661'}<br>${p.likes.length}</button><button onclick="sharePost('${p.id}')">Share</button></div></div>`).join('')}</div>`;
}
function friendsView() {
  const row = p => `<div class="flex items-center gap-3 py-2">${avatar(p.name, p.c)}<div class="flex-1"><p class="text-sm font-bold text-cloud">${mEsc(p.name)}${p.demo ? ' <span class="text-[9px] px-1.5 py-0.5 rounded bg-graphite text-cloudMuted">TEST</span>' : ''}</p><p class="text-[11px] text-cloudMuted">@${mEsc(p.h)}${p.st === 'pending' ? ' \u2022 request saved, waiting for them to join' : ''}</p></div><button onclick="removePerson('${p.h}')" class="text-xs text-cloudMuted">Remove</button></div>`;
  const fr = people.filter(p => p.st === 'friend'), pe = people.filter(p => p.st === 'pending');
  return `<div class="glass-panel rounded-3xl border border-graphiteBorder p-4 space-y-3"><h3 class="font-display font-bold text-base text-cloud">Add friends</h3>
    <div class="flex gap-2"><input id="addHandle" placeholder="@handle" onkeydown="if(event.key==='Enter')addByHandle()" class="flex-1 bg-obsidian border border-graphiteBorder rounded-2xl px-4 py-2.5 text-sm text-cloud"><button onclick="addByHandle()" class="px-4 rounded-2xl bg-[#7CFF3A] text-black text-xs font-bold">Add</button></div>
    <button onclick="inviteFriends()" class="w-full py-2.5 rounded-2xl bg-graphite border border-graphiteBorder text-xs font-bold text-cloud">Invite friends (your handle: @${mEsc(me().h)})</button></div>
  <div class="glass-panel rounded-3xl border border-graphiteBorder p-4"><h3 class="font-display font-bold text-base text-cloud mb-1">Friends (${fr.length})</h3>${fr.length ? fr.map(row).join('') : '<p class="text-xs text-cloudMuted">No friends yet.</p>'}${pe.length ? `<h3 class="font-display font-bold text-sm text-cloud mt-3">Pending</h3>${pe.map(row).join('')}` : ''}</div>
  <div class="rounded-3xl border border-dashed border-graphiteBorder p-4 text-xs text-cloudMuted space-y-2"><p>Friend accounts across devices need the online backend, which is not connected yet. To try the feed with other people in it, add test friends. You can remove them any time.</p><button onclick="${people.some(p => p.demo) ? 'removeTestFriends()' : 'addTestFriends()'}" class="px-3 py-2 rounded-xl bg-graphite border border-graphiteBorder font-bold text-cloud">${people.some(p => p.demo) ? 'Remove test friends' : 'Add 3 test friends'}</button></div>`;
}
function renderSocial() {
  const r = document.getElementById('socialRoot'); if (!r) return;
  const tab = (k, l) => `<button onclick="sView='${k}';renderSocial()" class="seg ${sView === k ? 'on' : ''}">${l}</button>`;
  r.innerHTML = secTitle('SOCIAL', [['CONNECT.', '#7CFF3A'], ['SHARE.', '#a855f7'], ['VIBE.', '#fff']], '#a855f7') + `<div class="flex gap-2">${tab('feed', 'Feed')}${tab('shorts', 'Shorts')}${tab('friends', 'Friends')}</div>
  <div class="space-y-4">${sView === 'feed' ? feedView() : sView === 'shorts' ? shortsView() : friendsView()}</div>`;
  r.querySelectorAll('[data-m]').forEach(async el => {
    try { const b = await idbGet(el.dataset.m); if (b) { el.src = URL.createObjectURL(b); if (el.hasAttribute('data-short')) io.observe(el); } } catch (e) {}
  });
  const hp = document.getElementById('homeFeedPreview');
  if (hp) hp.innerHTML = sPosts.length ? sPosts.slice(0, 3).map(p => `<p class="text-xs text-cloud truncate"><b>@${mEsc(p.h)}</b> ${mEsc(p.text || p.kind)}</p>`).join('') : `<button onclick="goSocial('friends')" class="text-xs font-bold text-accentPink">Find friends</button>`;
  updateHomeStats();
}
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.6 });
document.addEventListener('DOMContentLoaded', () => { openOnboarding(); applyUserName(); renderSocial(); });
