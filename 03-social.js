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
/* ---- Accounts (Supabase): sign up, log in, log out ---- */
let authMode = 'signup';
const authInp = 'w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 text-[15px] text-white placeholder-white/35 text-left focus:outline-none focus:border-neonPurple focus:shadow-[0_0_0_3px_rgba(168,85,247,0.25)] transition';
const authG = id => document.getElementById(id);
function authMsg(t, ok) { const e = authG('authMsg'); if (e) { e.textContent = t || ''; e.className = 'text-xs min-h-[1rem] ' + (ok ? 'text-volt' : 'text-accentPink'); } }
function authBusy(on) { const b = authG('authBtn'); if (!b) return; b.disabled = on; b.style.opacity = on ? '.6' : '1'; b.textContent = on ? 'Please wait...' : (authMode === 'signup' ? 'Create account' : 'Log in'); }
const authNet = m => /load failed|failed to fetch|networkerror|fetch/i.test(m || '') ? "Can't reach DaHub servers. Check your connection and try again." : m;
function authCard() {
  const su = authMode === 'signup';
  const tab = (m, l) => `<button onclick="setAuthMode('${m}')" class="flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${authMode === m ? 'bg-white/10 text-white' : 'text-white/45'}">${l}</button>`;
  return `<div class="flex gap-1 p-1 rounded-2xl bg-black/40 mb-4">${tab('signup', 'Sign up')}${tab('login', 'Log in')}</div>
    <p class="text-lg font-extrabold text-white">${su ? 'Create your account' : 'Welcome back'}</p>
    <p class="text-xs text-white/50 mt-1 mb-4">${su ? 'Your name and handle are how people find you.' : 'Log in to pick up where you left off.'}</p>
    <div class="space-y-3">
      ${su ? `<input id="nameInput" maxlength="24" placeholder="Your name" oninput="const h=document.getElementById('handleInput');if(!h.dataset.t)h.value=this.value.toLowerCase().replace(/[^a-z0-9._]/g,'')" class="${authInp}">
      <div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-volt font-bold">@</span><input id="handleInput" maxlength="20" placeholder="handle" autocapitalize="off" oninput="this.dataset.t=1" class="${authInp} !pl-9"></div>` : ''}
      <input id="authEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="Email" class="${authInp}">
      <input id="authPw" type="password" autocomplete="${su ? 'new-password' : 'current-password'}" placeholder="${su ? 'Password (8+ characters)' : 'Password'}" onkeydown="if(event.key==='Enter')submitAuth()" class="${authInp}">
      <p id="authMsg" class="text-xs min-h-[1rem] text-accentPink"></p>
      <button id="authBtn" onclick="submitAuth()" class="btn-chunky w-full py-4 rounded-2xl bg-gradient-to-r from-neonPurple via-violetHub to-volt text-obsidian font-display font-extrabold text-sm uppercase tracking-wider">${su ? 'Create account' : 'Log in'}</button>
    </div>`;
}
function setAuthMode(m) { authMode = m; const c = authG('authCard'); if (c) c.innerHTML = authCard(); }
async function enterSession(user) {
  let name = user.user_metadata && user.user_metadata.name, h = user.user_metadata && user.user_metadata.handle;
  try { const { data } = await sb.from('profiles').select('name,handle').eq('id', user.id).maybeSingle(); if (data) { name = data.name; h = data.handle; } } catch (e) {}
  localStorage.setItem('dahub_name_v3', name || 'You'); localStorage.setItem(SK.h, h || 'you');
  const m = authG('nameModal'); if (m) m.remove();
  applyUserName(); renderSocial();
}
async function submitAuth() {
  if (!sb) { authMsg("Can't reach DaHub servers. Check your connection and reload."); return; }
  const email = authG('authEmail').value.trim(), pw = authG('authPw').value, su = authMode === 'signup';
  if (!/^\S+@\S+\.\S+$/.test(email)) { authMsg('Enter a valid email.'); return; }
  authMsg('');
  try {
    if (su) {
      const n = authG('nameInput').value.trim(), h = authG('handleInput').value.trim().toLowerCase().replace(/[^a-z0-9._]/g, '');
      if (!n) { authMsg('Add your name.'); return; }
      if (h.length < 2) { authMsg('Your handle needs 2+ characters.'); return; }
      if (pw.length < 8) { authMsg('Password needs 8+ characters.'); return; }
      authBusy(true);
      const ex = await sb.from('profiles').select('id').eq('handle', h).maybeSingle();
      if (ex.data) { authBusy(false); authMsg('That handle is taken. Try another.'); return; }
      const { data, error } = await sb.auth.signUp({ email, password: pw, options: { data: { name: n, handle: h } } });
      if (error) { authBusy(false); authMsg(/handle|profiles|database error/i.test(error.message) ? 'That handle is taken. Try another.' : authNet(error.message)); return; }
      if (data.session) { await enterSession(data.user); return; }
      authBusy(false); setAuthMode('login'); authMsg('Account created. Check your email to confirm it, then log in.', true);
    } else {
      authBusy(true);
      const { data, error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) { authBusy(false); authMsg(/not confirmed/i.test(error.message) ? 'Confirm your email first, then log in.' : /invalid/i.test(error.message) ? 'Wrong email or password.' : authNet(error.message)); return; }
      await enterSession(data.user);
    }
  } catch (e) { authBusy(false); authMsg("Something went wrong. Check your connection and try again."); }
}
async function logOut() {
  try { if (sb) await sb.auth.signOut(); } catch (e) {}
  ['dahub_name_v3', SK.h, 'dahub_since_v3'].forEach(k => localStorage.removeItem(k));
  location.reload();
}
function showAuth() {
  const wm = document.querySelector('#splashScreen h1 img').src;
  const d = document.createElement('div'); d.id = 'nameModal';
  d.className = 'fixed inset-0 z-[45] bg-obsidian overflow-y-auto flex flex-col items-center justify-center p-6 text-center';
  d.style.background = 'radial-gradient(ellipse at 50% 22%,#33205f 0,#14111f 48%,#0b0b10 100%)';
  d.innerHTML = `<img src="${wm}" alt="DaHub" class="w-72 max-w-[85%] h-auto drop-shadow-[0_0_28px_rgba(168,85,247,0.55)]">
    <p class="text-[11px] tracking-[0.3em] text-white/60 font-bold mt-3">ONE HUB. EVERY SIDE OF LIFE.</p>
    <div class="w-full max-w-sm mt-8 rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.5)]"><div id="authCard">${authCard()}</div></div>`;
  document.body.appendChild(d);
}
// Guest-first: restore a saved session silently; the login screen only opens when asked (openLogin).
async function openOnboarding() {
  if (sb) { try { const { data } = await sb.auth.getSession(); if (data.session) { await enterSession(data.session.user); return; } } catch (e) {} }
}
function openLogin() {
  const old = authG('nameModal'); if (old) old.remove();
  showAuth();
  const d = authG('nameModal');
  if (d) d.insertAdjacentHTML('afterbegin', '<button onclick="document.getElementById(\'nameModal\').remove()" class="absolute top-4 right-4 text-white/60 text-xs font-bold px-3 py-2 rounded-xl border border-white/15">Continue as guest</button>');
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
const EMBLEM = 'logo-emblem.png';
const sAv = (p, cls = '') => (p.official || p.h === me().h)
  ? `<img src="${EMBLEM}" alt="" class="s-av ${cls}">`
  : `<div class="s-av s-av-i ${cls}" style="${p.c ? 'background:' + p.c : ''}">${mEsc(ini(p.name))}</div>`;
const tagify = t => mEsc(t).replace(/#(\w+)/g, '<span class="s-tag">#$1</span>');
const agoLbl = t => { const a = ago(t); return a === 'now' ? 'now' : a + ' ago'; };
function toggleSave(id) { const p = sPosts.find(x => x.id === id), h = me().h; p.saves = p.saves || []; p.saves = p.saves.includes(h) ? p.saves.filter(x => x !== h) : [...p.saves, h]; persist(); renderSocial(); }
function seedOfficial() {
  if (localStorage.getItem('dahub_seed_v1')) return;
  const base = { h: 'dahub', name: 'DaHub', official: true, likes: [], comments: [], saves: [] };
  sPosts.push({ ...base, id: 'o_1', kind: 'banner', text: 'Level up your mindset. 💯 The journey is yours. 🚀\n#DaHub #Mindset #Growth', banner: 'Think. Train. Thrive.', ts: Date.now() - 2 * 3600e3 });
  sPosts.push({ ...base, id: 'o_2', kind: 'text', text: 'Good vibes only. 💚💜', ts: Date.now() - 5 * 3600e3 });
  persist(); localStorage.setItem('dahub_seed_v1', '1');
}
function postCard(p) {
  const mine = p.h === me().h, liked = p.likes.includes(me().h), saved = (p.saves || []).includes(me().h);
  const media = p.kind === 'photo' ? `<img data-m="${p.media}" class="s-media">`
    : p.kind === 'banner' ? `<div class="s-banner"><img src="logo-wordmark.png" alt="DaHub"><span>${mEsc(p.banner || '')}</span></div>`
    : p.kind === 'short' ? (p.yt ? `<iframe class="s-media s-vert" src="https://www.youtube.com/embed/${encodeURIComponent(p.yt)}?playsinline=1&rel=0" allowfullscreen></iframe>` : `<video data-m="${p.media}" controls playsinline class="s-media s-vert"></video>`) : '';
  const wk = p.w ? `<div class="s-wk"><p class="s-wk-h">TRAINING SESSION</p><div class="s-wk-r"><div><b>${p.w.sets}</b><small>Sets</small></div><div><b>${p.w.vol.toLocaleString()}</b><small>Volume</small></div></div><p class="s-wk-ex">${p.w.ex.map(mEsc).join(' • ')}</p></div>` : '';
  const cms = openCm[p.id] ? `<div class="s-cms">${p.comments.map(c => `<p><b>@${mEsc(c.h)}</b> ${mEsc(c.t)}</p>`).join('')}<div class="s-cm-row"><input id="cm_${p.id}" placeholder="Add a comment" onkeydown="if(event.key==='Enter')addComment('${p.id}')" class="inp"><button onclick="addComment('${p.id}')" class="s-send">Send</button></div></div>` : '';
  return `<article class="chrome s-post">
    <div class="s-head">${sAv(p)}<div class="s-who"><p class="s-name">${mEsc(p.name)}${p.demo ? ' <span class="s-test">TEST</span>' : ''}</p><p class="s-sub">${agoLbl(p.ts)} • <i class="ph ph-globe-hemisphere-west"></i></p></div>${mine ? `<button onclick="delPost('${p.id}')" class="s-more" aria-label="Delete post"><i class="ph-bold ph-trash"></i></button>` : `<span class="s-more" aria-hidden="true"><i class="ph-bold ph-dots-three"></i></span>`}</div>
    ${p.text ? `<p class="s-text">${tagify(p.text)}</p>` : ''}${media}${wk}
    <div class="s-bar"><button onclick="toggleLike('${p.id}')" class="${liked ? 'on' : ''}" aria-label="Like"><i class="${liked ? 'ph-fill' : 'ph-bold'} ph-thumbs-up"></i><span>${p.likes.length}</span></button><button onclick="toggleCm('${p.id}')" aria-label="Comments"><i class="ph-bold ph-chat-circle"></i><span>${p.comments.length}</span></button><button onclick="sharePost('${p.id}')"><i class="ph-bold ph-share-fat"></i><span>SHARE</span></button><button onclick="toggleSave('${p.id}')" class="${saved ? 'on' : ''}"><i class="${saved ? 'ph-fill' : 'ph-bold'} ph-bookmark-simple"></i><span>SAVE</span></button></div>${cms}</article>`;
}
function feedView() {
  const fh = friendHs(), list = sPosts.filter(p => sFilter === 'friends' ? fh.includes(p.h) : true).sort((a, b) => b.ts - a.ts);
  const chip = (k, l) => `<button onclick="sFilter='${k}';renderSocial()" class="s-filter ${sFilter === k ? 'on' : ''}">${l}</button>`;
  return `<div class="chrome s-comp"><span class="s-av-wrap"><img src="${EMBLEM}" alt="" class="s-av"></span><button onclick="openComposer('text')" class="s-prompt">What's on your mind?</button><button onclick="openComposer('photo')" aria-label="Photo" class="s-ci"><i class="ph-bold ph-camera"></i></button><span class="s-div"></span><button onclick="openComposer('short')" aria-label="Short" class="s-ci"><i class="ph-bold ph-lightning"></i></button></div>
  <div class="s-chips">${[['text', 'Post', 'ph-pencil-simple'], ['photo', 'Photo', 'ph-image'], ['short', 'Short', 'ph-video-camera'], ['workout', 'Workout', 'ph-barbell']].map(([k, l, ic]) => `<button onclick="openComposer('${k}')" class="s-chip"><i class="ph-bold ${ic}"></i><span>${l}</span></button>`).join('')}</div>
  <div class="s-filters">${chip('all', 'Everyone')}${chip('friends', 'Friends')}</div>
  ${list.length ? list.map(postCard).join('') : `<div class="chrome s-empty"><p class="s-name">Your feed is empty</p><p class="s-sub">Post something, or add friends to see their updates here.</p><button onclick="goSocial('friends')" class="s-chip"><span>Find friends</span></button></div>`}`;
}
function leadersView() {
  const mh = me().h, hs = [mh, ...friendHs()];
  const rows = hs.map(h => { const ps = sPosts.filter(p => p.h === h), pe = people.find(x => x.h === h); return { h, name: h === mh ? me().name : (pe && pe.name) || h, c: pe && pe.c, score: ps.length * 10 + ps.reduce((a, p) => a + p.likes.length, 0) * 2, posts: ps.length, likes: ps.reduce((a, p) => a + p.likes.length, 0) }; }).sort((a, b) => b.score - a.score);
  return `<div class="chrome s-panel"><h3 class="s-h">Leaderboard</h3><p class="s-sub">You and your friends, ranked by posts (10 pts) and likes received (2 pts). Scores update as people post.</p>
    ${rows.map((r, i) => `<div class="s-row"><span class="s-rank">${i + 1}</span>${sAv({ name: r.name, c: r.c, h: r.h })}<div class="s-who"><p class="s-name">${mEsc(r.name)}${r.h === mh ? ' (you)' : ''}</p><p class="s-sub">${r.posts} posts • ${r.likes} likes</p></div><b class="s-score">${r.score}</b></div>`).join('')}</div>`;
}
function shortsView() {
  const l = sPosts.filter(p => p.kind === 'short');
  if (!l.length) return `<div class="chrome s-empty"><p class="s-name">No shorts yet</p><p class="s-sub">Record a vertical clip or share a YouTube Short.</p><button onclick="openComposer('short')" class="s-chip"><span>Post a short</span></button></div>`;
  return `<div style="height:70vh;overflow-y:auto;scroll-snap-type:y mandatory" class="rounded-3xl space-y-3">${l.map(p => `<div style="height:70vh;scroll-snap-align:start" class="relative rounded-3xl overflow-hidden bg-black">${p.yt ? `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${encodeURIComponent(p.yt)}?playsinline=1&rel=0" allowfullscreen></iframe>` : `<video data-m="${p.media}" data-short loop muted playsinline onclick="this.paused?this.play():this.pause()" class="w-full h-full object-contain"></video>`}<div class="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"><p class="text-sm font-bold text-white">@${mEsc(p.h)}</p><p class="text-xs text-white/90">${mEsc(p.text)}</p></div><div class="absolute right-3 bottom-20 flex flex-col gap-4 text-white text-xs text-center"><button onclick="toggleLike('${p.id}')">${p.likes.includes(me().h) ? '\u2665' : '\u2661'}<br>${p.likes.length}</button><button onclick="sharePost('${p.id}')">Share</button></div></div>`).join('')}</div>`;
}
function friendsView() {
  const row = p => `<div class="flex items-center gap-3 py-2">${avatar(p.name, p.c)}<div class="flex-1"><p class="text-sm font-bold text-cloud">${mEsc(p.name)}${p.demo ? ' <span class="text-[9px] px-1.5 py-0.5 rounded bg-graphite text-cloudMuted">TEST</span>' : ''}</p><p class="text-[11px] text-cloudMuted">@${mEsc(p.h)}${p.st === 'pending' ? ' \u2022 request saved, waiting for them to join' : ''}</p></div><button onclick="removePerson('${p.h}')" class="text-xs text-cloudMuted">Remove</button></div>`;
  const fr = people.filter(p => p.st === 'friend'), pe = people.filter(p => p.st === 'pending');
  return `<div class="chrome s-panel"><h3 class="font-display font-bold text-base text-cloud">Add friends</h3>
    <div class="flex gap-2"><input id="addHandle" placeholder="@handle" onkeydown="if(event.key==='Enter')addByHandle()" class="inp flex-1 rounded-2xl px-4 py-2.5 text-sm"><button onclick="addByHandle()" class="s-chip"><span>Add</span></button></div>
    <button onclick="inviteFriends()" class="s-chip s-wide"><span>Invite friends (your handle: @${mEsc(me().h)})</span></button></div>
  <div class="chrome s-panel"><h3 class="font-display font-bold text-base text-cloud mb-1">Friends (${fr.length})</h3>${fr.length ? fr.map(row).join('') : '<p class="text-xs text-cloudMuted">No friends yet.</p>'}${pe.length ? `<h3 class="font-display font-bold text-sm text-cloud mt-3">Pending</h3>${pe.map(row).join('')}` : ''}</div>
  <div class="chrome s-panel s-note"><p>Friend accounts across devices need the online backend, which is not connected yet. To try the feed with other people in it, add test friends. You can remove them any time.</p><button onclick="${people.some(p => p.demo) ? 'removeTestFriends()' : 'addTestFriends()'}" class="s-chip"><span>${people.some(p => p.demo) ? 'Remove test friends' : 'Add 3 test friends'}</span></button></div>`;
}
function renderSocial() {
  const r = document.getElementById('socialRoot'); if (!r) return;
  const T = [['feed', 'Feed', 'ph-users-three'], ['shorts', 'Explore', 'ph-play'], ['friends', 'Friends', 'ph-users'], ['leaders', 'Leaderboards', 'ph-trophy']];
  const tab = ([k, l, ic]) => `<button onclick="sView='${k}';renderSocial()" class="${sView === k ? 'on' : ''}"><i class="ph-fill ${ic}"></i><span>${l}</span></button>`;
  r.innerHTML = secTitle('SOCIAL', [['CONNECT.', '#7CFF3A'], ['SHARE.', '#a855f7'], ['VIBE.', '#fff']], '#a855f7') + `<nav class="chrome s-tabs">${T.map(tab).join('')}</nav>
  <div class="s-stack">${sView === 'feed' ? feedView() : sView === 'shorts' ? shortsView() : sView === 'leaders' ? leadersView() : friendsView()}</div>`;
  r.querySelectorAll('[data-m]').forEach(async el => {
    try { const b = await idbGet(el.dataset.m); if (b) { el.src = URL.createObjectURL(b); if (el.hasAttribute('data-short')) io.observe(el); } } catch (e) {}
  });
  const hp = document.getElementById('homeFeedPreview');
  if (hp) hp.innerHTML = sPosts.length ? sPosts.slice(0, 3).map(p => `<p class="text-xs text-cloud truncate"><b>@${mEsc(p.h)}</b> ${mEsc(p.text || p.kind)}</p>`).join('') : `<button onclick="goSocial('friends')" class="text-xs font-bold text-accentPink">Find friends</button>`;
  updateHomeStats();
}
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause(); }), { threshold: 0.6 });
document.addEventListener('DOMContentLoaded', () => { seedOfficial(); openOnboarding(); applyUserName(); renderSocial(); });
