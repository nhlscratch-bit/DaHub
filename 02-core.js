    /* --- DATA STORAGE KEYS & DEFAULT SEED DATA --- */
    const STORAGE_KEY_POSTS = 'dahub_social_posts_v3';
    const STORAGE_KEY_WORKOUTS = 'dahub_workouts_v3';
    const STORAGE_KEY_WATCHLIST = 'dahub_watchlist_v3';
    const STORAGE_KEY_USER_XP = 'dahub_xp_v3';

    // Mock initial community posts (Streetwear + Fitness DNA)
    const DEFAULT_POSTS = [
      {
        id: 'post-1',
        author: 'Jaxson "Heavy" R.',
        handle: '@jax_beast',
        avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
        content: 'New 405lb squat PR on the books. Raw wraps only. Streetwear oversized hoodie kept the pump primed all morning! Consistency beats motivation every rep.',
        tag: '#GymGains',
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
        likes: 138,
        liked: false,
        timeAgo: '42m ago',
        comments: [
          { author: 'Marcus D.', text: 'Form was textbook solid bro. What wraps you using?' },
          { author: 'Elena Fit', text: 'That depth was unreal! Inspiring work 🔥' }
        ]
      },
      {
        id: 'post-2',
        author: 'Kiki Chen',
        handle: '@kiki_drip',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        content: 'Acid-wash oversized pump cover paired with high-top gym retros. Function meets street aesthetic. Don’t sleep on comfortable silhouettes in the iron house.',
        tag: '#Streetwear',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
        likes: 89,
        liked: true,
        timeAgo: '2h ago',
        comments: [
          { author: 'Leo_Hub', text: 'Clean styling! Need that hoodie link asap.' }
        ]
      },
      {
        id: 'post-3',
        author: 'Coach Dave Miller',
        handle: '@dave_hypertrophy',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        content: 'Stop ego lifting on the incline bench. Take 3-second negatives, pause 1 second at full chest stretch, and explode up. You’ll grow faster with 70lbs than sloppy 100s.',
        tag: '#Motivation',
        image: '',
        likes: 215,
        liked: false,
        timeAgo: '5h ago',
        comments: [
          { author: 'Jordan K.', text: 'Switched to slow eccentrics last month, chest soreness is insane.' }
        ]
      }
    ];

    // Curated high quality YouTube videos (Fitness, Form, Streetwear, Gym Trap Beats)
    const CURATED_MEDIA = [
      {
        id: 'v1',
        youtubeId: 'IODxDxX7oi4', // AthleanX Chest Workout or similar form
        title: 'The Perfect Chest Workout (Sets & Reps Included)',
        channel: 'ATHLEAN-X™',
        category: 'fitness',
        duration: '14:20',
        thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
        views: '3.4M views'
      },
      {
        id: 'v2',
        youtubeId: 'qwx1k91F9a4', // Streetwear style breakdown
        title: 'Streetwear Trends That Will Dominate This Year',
        channel: 'Frugal Aesthetic',
        category: 'streetwear',
        duration: '11:45',
        thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80',
        views: '890K views'
      },
      {
        id: 'v3',
        youtubeId: 'p2OQd7eK06Q', // Gym Trap Beats
        title: '1 Hour Heavy Trap Lifting & Gym Motivation Beats',
        channel: 'DaHub Soundworks',
        category: 'music',
        duration: '58:30',
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        views: '1.2M views'
      },
      {
        id: 'v4',
        youtubeId: 'vc1E5CfRfos', // Squat Form guide
        title: 'How to Squat Deep Without Lower Back Pain',
        channel: 'Squat University',
        category: 'fitness',
        duration: '09:15',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
        views: '2.1M views'
      },
      {
        id: 'v5',
        youtubeId: 'dQw4w9WgXcQ', // Sneaker rotation
        title: 'The Ultimate 5-Pair Sneaker Rotation for Gym & Street',
        channel: 'Complex Sneakers',
        category: 'streetwear',
        duration: '16:02',
        thumbnail: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&auto=format&fit=crop&q=80',
        views: '540K views'
      }
    ];

    // Seeded Workouts
    const DEFAULT_WORKOUTS = [
      { id: 'w1', exercise: 'Incline Barbell Bench Press', weight: 205, reps: 8, rpe: 8.5, time: '10:15 AM' },
      { id: 'w2', exercise: 'Flat Dumbbell Press', weight: 85, reps: 10, rpe: 8.0, time: '10:28 AM' },
      { id: 'w3', exercise: 'Cable Chest Flyes', weight: 45, reps: 12, rpe: 9.0, time: '10:40 AM' }
    ];

    /* --- APPLICATION STATE --- */
    let currentTab = 'home';
    let userXp = parseInt(localStorage.getItem(STORAGE_KEY_USER_XP)) || 0;
    let posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS)) || [];
    let workouts = JSON.parse(localStorage.getItem(STORAGE_KEY_WORKOUTS)) || [];
    let watchlist = JSON.parse(localStorage.getItem(STORAGE_KEY_WATCHLIST)) || [];
    let selectedTag = '#GymGains';
    let currentPlayingVideo = null;

    // Rest Timer State
    let timerDuration = 90; // seconds
    let timerRemaining = 90;
    let timerInterval = null;
    let isTimerRunning = false;

    /* --- INITIALIZATION --- */
    window.onload = function () {
      initApp();
    };

    function initApp() {
      // Setup splash progress bar animation
      const progressBar = document.getElementById('splashProgressBar');
      if (progressBar) {
        setTimeout(() => progressBar.style.width = '100%', 150);
      }

      // Render functional tabs
      renderSocialFeed();
      renderWorkoutList();
      renderMediaGrid('all');
      updateWatchlistCounter();
      updateXpDisplay();
    }

    function enterApplication() {
      playAudioTone(523.25, 'sine', 0.15);
      const splash = document.getElementById('splashScreen');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
          splash.style.display = 'none';
        }, 700);
      }
    }

    function replaySplash() {
      const splash = document.getElementById('splashScreen');
      if (splash) {
        splash.style.display = 'flex';
        setTimeout(() => {
          splash.style.opacity = '1';
        }, 20);
      }
    }

    /* --- TAB ROUTING --- */
    function switchTab(tabId) {
      if (currentTab === tabId) return;
      playAudioTone(380, 'sine', 0.05);

      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      // Show targeted tab
      const target = document.getElementById('tab-' + tabId);
      if (target) target.classList.add('active');

      // Update nav button states
      const navButtons = {
        home: { id: 'nav-btn-home', color: 'text-violetHub', glow: 'bg-violetHub/30' },
        train: { id: 'nav-btn-train', color: 'text-volt', glow: 'bg-volt/30' },
        media: { id: 'nav-btn-media', color: 'text-accentOrange', glow: 'bg-accentOrange/30' },
        social: { id: 'nav-btn-social', color: 'text-accentPink', glow: 'bg-accentPink/30' },
      };

      Object.keys(navButtons).forEach(key => {
        const btn = document.getElementById(navButtons[key].id);
        if (btn) {
          const glow = btn.querySelector('.nav-glow');
          if (key === tabId) {
            btn.className = `nav-button flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl ${navButtons[key].color} transition-all group`;
            if (glow) glow.style.opacity = '1';
          } else {
            btn.className = `nav-button flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl text-cloudMuted transition-all group hover:text-white`;
            if (glow) glow.style.opacity = '0';
          }
        }
      });

      currentTab = tabId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* --- NOTIFICATION TOAST HELPER --- */
    function showNotificationToast(msg) {
      playAudioTone(659.25, 'triangle', 0.1);
      const toast = document.getElementById('notificationToast');
      const text = document.getElementById('toastMessage');
      if (toast && text) {
        text.innerText = msg;
        toast.classList.remove('opacity-0', '-translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', '-translate-y-4');
        }, 2800);
      }
    }

    /* --- XP PROGRESSION SYSTEM --- */
    function awardXp(amount, reason = 'Action completed') {
      userXp += amount;
      localStorage.setItem(STORAGE_KEY_USER_XP, userXp);
      updateXpDisplay();
      showNotificationToast(`+${amount} XP Earned! ${reason}`);
    }

    function updateXpDisplay() {
      const headerXp = document.getElementById('headerXpDisplay');
      if (headerXp) headerXp.innerText = userXp.toLocaleString();
    }

    /* ================================================= */
    /* SOCIAL MVP LOGIC & COMMENT INTERACTIONS           */
    /* ================================================= */
    function renderSocialFeed() {
      const container = document.getElementById('socialFeedContainer');
      if (!container) return;

      if (posts.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-cloudMuted">No posts yet. Flex first!</div>`;
        return;
      }

      container.innerHTML = posts.map(post => `
        <article class="glass-panel p-5 rounded-3xl border border-graphiteBorder space-y-3.5 transition-all">
          <!-- Post Author Header -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img src="${post.avatar}" class="w-10 h-10 rounded-2xl object-cover border border-graphiteBorder">
              <div>
                <h4 class="font-display font-bold text-sm text-white flex items-center gap-1.5">
                  ${post.author}
                  ${post.tag ? `<span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-graphiteLight text-neonPurple border border-neonPurple/30">${post.tag}</span>` : ''}
                </h4>
                <p class="text-xs text-cloudMuted">${post.handle} &bull; ${post.timeAgo}</p>
              </div>
            </div>
            <button onclick="showNotificationToast('Post options saved')" class="text-cloudMuted hover:text-white">
              <i class="ph ph-dots-three-vertical text-lg"></i>
            </button>
          </div>

          <!-- Post Content -->
          <p class="text-xs sm:text-sm text-cloud/90 leading-relaxed">${escapeHtml(post.content)}</p>

          <!-- Optional Post Image -->
          ${post.image ? `
            <div class="rounded-2xl overflow-hidden max-h-80 w-full border border-graphiteBorder/50">
              <img src="${post.image}" alt="Post image" class="w-full h-full object-cover">
            </div>
          ` : ''}

          <!-- Action Row (Like, Comment, Share) -->
          <div class="flex items-center justify-between pt-2 border-t border-graphiteBorder">
            <div class="flex items-center gap-4">
              <!-- Like Button -->
              <button onclick="toggleLikePost('${post.id}')" class="flex items-center gap-1.5 text-xs font-bold ${post.liked ? 'text-accentPink' : 'text-cloudMuted'} hover:text-accentPink transition-colors">
                <i class="ph-fill ${post.liked ? 'ph-heart text-accentPink' : 'ph-heart'} text-base"></i>
                <span id="like-count-${post.id}">${post.likes}</span>
              </button>
              
              <!-- Comment Trigger -->
              <button onclick="toggleCommentBox('${post.id}')" class="flex items-center gap-1.5 text-xs font-bold text-cloudMuted hover:text-violetHub transition-colors">
                <i class="ph ph-chat-teardrop text-base"></i>
                <span>${post.comments ? post.comments.length : 0}</span>
              </button>
            </div>

            <button onclick="copyPostShareLink('${post.id}')" class="text-xs text-cloudMuted hover:text-white flex items-center gap-1">
              <i class="ph ph-share-network"></i> Share
            </button>
          </div>

          <!-- Expandable Comments Tray -->
          <div id="comment-tray-${post.id}" class="space-y-2 pt-2 border-t border-graphiteBorder/40">
            <div class="space-y-1.5 max-h-36 overflow-y-auto">
              ${(post.comments || []).map(c => `
                <div class="text-xs bg-obsidian/50 p-2.5 rounded-xl border border-graphiteBorder flex items-start gap-2">
                  <span class="font-bold text-cloud whitespace-nowrap">${escapeHtml(c.author)}:</span>
                  <span class="text-cloudMuted">${escapeHtml(c.text)}</span>
                </div>
              `).join('')}
            </div>

            <!-- Add Comment Form -->
            <form onsubmit="handleAddComment(event, '${post.id}')" class="flex gap-2 pt-1">
              <input type="text" placeholder="Drop a reply..." required class="flex-1 bg-obsidian border border-graphiteBorder rounded-xl px-3 py-1.5 text-xs text-cloud focus:outline-none focus:border-neonPurple">
              <button type="submit" class="px-3 py-1.5 bg-graphiteLight text-cloud font-bold text-xs rounded-xl hover:bg-neonPurple hover:text-obsidian transition-colors">
                Reply
              </button>
            </form>
          </div>
        </article>
      `).join('');

      // Update profile post count
      const profileCount = document.getElementById('profilePostsCount');
      if (profileCount) profileCount.innerText = posts.length;
    }

    function toggleLikePost(postId) {
      playAudioTone(480, 'sine', 0.05);
      posts = posts.map(p => {
        if (p.id === postId) {
          const newLiked = !p.liked;
          return {
            ...p,
            liked: newLiked,
            likes: newLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      renderSocialFeed();
    }

    function toggleCommentBox(postId) {
      const tray = document.getElementById(`comment-tray-${postId}`);
      if (tray) {
        tray.classList.toggle('hidden');
      }
    }

    function handleAddComment(e, postId) {
      e.preventDefault();
      const input = e.target.querySelector('input');
      const text = input.value.trim();
      if (!text) return;

      posts = posts.map(p => {
        if (p.id === postId) {
          const updatedComments = p.comments || [];
          updatedComments.push({
            author: getUserName(),
            text: text
          });
          return { ...p, comments: updatedComments };
        }
        return p;
      });

      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      input.value = '';
      awardXp(15, 'Commented on post');
      renderSocialFeed();
    }

    function copyPostShareLink(postId) {
      document.execCommand('copy');
      showNotificationToast('Post link copied to clipboard!');
    }

    /* ================================================= */
    /* WORKOUT TRAINER & REST TIMER (Train MVP)          */
    /* ================================================= */
    function renderWorkoutList() {
      const list = document.getElementById('workoutList');
      const volumeDisplay = document.getElementById('totalWorkoutVolume');
      if (!list) return;

      if (workouts.length === 0) {
        list.innerHTML = `<div class="p-4 text-center text-xs text-cloudMuted">No sets logged yet today. Hit the rack!</div>`;
        if (volumeDisplay) volumeDisplay.innerText = 'Volume: 0 lbs';
        return;
      }

      let totalVolume = 0;
      list.innerHTML = workouts.map(item => {
        const setVolume = (item.weight || 0) * (item.reps || 0);
        totalVolume += setVolume;
        return `
          <div class="bg-obsidian/70 p-3 rounded-2xl border border-graphiteBorder flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-cloud">${escapeHtml(item.exercise)}</p>
              <p class="text-[11px] text-cloudMuted">${item.weight} lbs &times; ${item.reps} reps ${item.rpe ? `&bull; RPE ${item.rpe}` : ''}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-display font-black text-volt">${setVolume.toLocaleString()} lbs</span>
              <button onclick="deleteWorkoutSet('${item.id}')" class="text-cloudMuted/60 hover:text-red-400 p-1">
                <i class="ph ph-trash"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (volumeDisplay) volumeDisplay.innerText = `Volume: ${totalVolume.toLocaleString()} lbs`;
    }

    function handleLogWorkout(e) {
      e.preventDefault();
      const exercise = document.getElementById('exerciseInput').value.trim();
      const weight = parseFloat(document.getElementById('weightInput').value);
      const reps = parseInt(document.getElementById('repsInput').value);
      const rpe = document.getElementById('rpeInput').value || '8.0';

      if (!exercise || isNaN(weight) || isNaN(reps)) return;

      const newSet = {
        id: 'w_' + Date.now(),
        exercise,
        weight,
        reps,
        rpe,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      workouts.unshift(newSet);
      localStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify(workouts));

      // Reset form fields
      document.getElementById('repsInput').value = '';
      awardXp(30, 'Workout Set Logged');
      renderWorkoutList();

      // Trigger automatic rest timer start
      resetTimer();
      startTimer();
    }

    function deleteWorkoutSet(id) {
      workouts = workouts.filter(w => w.id !== id);
      localStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify(workouts));
      renderWorkoutList();
      showNotificationToast('Set record removed');
    }

    /* Stopwatch Timer Logic */
    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function toggleTimer() {
      if (isTimerRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    }

    function startTimer() {
      if (isTimerRunning) return;
      isTimerRunning = true;
      const icon = document.getElementById('timerIcon');
      if (icon) icon.className = 'ph-fill ph-pause text-lg';
      
      timerInterval = setInterval(() => {
        if (timerRemaining > 0) {
          timerRemaining--;
          updateTimerUI();
        } else {
          pauseTimer();
          playAudioTone(880, 'sine', 0.4);
          showNotificationToast('Rest interval complete! Time to lift.');
        }
      }, 1000);
    }

    function pauseTimer() {
      isTimerRunning = false;
      clearInterval(timerInterval);
      const icon = document.getElementById('timerIcon');
      if (icon) icon.className = 'ph-fill ph-play text-lg';
    }

    function resetTimer() {
      pauseTimer();
      timerRemaining = timerDuration;
      updateTimerUI();
    }

    function updateTimerUI() {
      const display = document.getElementById('timerDisplay');
      if (display) display.innerText = formatTime(timerRemaining);
    }

    /* ================================================= */
    /* MEDIA HUB & YOUTUBE PLAYER MODAL (Media MVP)      */
    /* ================================================= */
    let currentMediaCategory = 'all';

    const STORAGE_KEY_YTKEY = 'dahub_ytkey_v3';
    let ytKey = localStorage.getItem(STORAGE_KEY_YTKEY) || '';
    let mediaResults = [], mediaState = 'idle', mediaError = '', lastLoad = null;
    const YT_QUERIES = { music: 'music', gaming: 'gaming', news: 'news today', learn: 'how to learn' };
    const mEsc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const fmtViews = n => { n = +n; if (!n) return ''; return n >= 1e6 ? (n/1e6).toFixed(1)+'M views' : n >= 1e3 ? Math.round(n/1e3)+'K views' : n+' views'; };
    const isSaved = id => watchlist.some(w => w.id === id);
    const findVideo = id => mediaResults.find(v => v.id === id) || watchlist.find(v => v.id === id);

    async function ytFetch(path, params) {
      let res;
      try { res = await fetch('https://www.googleapis.com/youtube/v3/' + path + '?' + new URLSearchParams({ ...params, key: ytKey })); }
      catch (e) { throw new Error('Network error. Check your connection and retry.'); }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const reason = (data.error && data.error.errors && data.error.errors[0] && data.error.errors[0].reason) || '';
        if (reason === 'quotaExceeded' || reason === 'rateLimitExceeded') throw new Error('YouTube daily quota used up. Try again tomorrow.');
        if (reason === 'keyInvalid' || res.status === 400) throw new Error('YouTube rejected this API key. Check it and save again.');
        throw new Error('YouTube access denied. Make sure YouTube Data API v3 is enabled for this key and that its restrictions allow this site.');
      }
      return data;
    }
    const normalize = (id, sn, st) => ({ id, youtubeId: id, title: sn.title, channel: sn.channelTitle, thumbnail: (sn.thumbnails.medium || sn.thumbnails.default).url, views: st ? fmtViews(st.viewCount) : '' });

    async function loadMedia(kind, q) {
      lastLoad = [kind, q]; mediaState = 'loading'; mediaError = ''; renderMediaGrid();
      try {
        if (kind === 'trending') {
          const d = await ytFetch('videos', { part: 'snippet,statistics', chart: 'mostPopular', maxResults: 12, regionCode: 'US' });
          mediaResults = d.items.map(v => normalize(v.id, v.snippet, v.statistics));
        } else {
          const d = await ytFetch('search', { part: 'snippet', type: 'video', maxResults: 12, q });
          mediaResults = d.items.map(v => normalize(v.id.videoId, v.snippet));
        }
        mediaState = 'ready';
      } catch (e) { mediaState = 'error'; mediaError = e.message; }
      renderMediaGrid();
    }
    function retryMedia() { if (lastLoad) loadMedia(lastLoad[0], lastLoad[1]); }
    function saveYtKey() {
      const v = document.getElementById('ytKeyInput').value.trim(); if (!v) return;
      ytKey = v; localStorage.setItem(STORAGE_KEY_YTKEY, v); loadMedia('trending');
    }

    function renderMediaGrid() {
      const grid = document.getElementById('mediaGrid'); if (!grid) return;
      const cat = currentMediaCategory;
      const box = html => { grid.innerHTML = '<div class="col-span-full py-10 text-center text-cloudMuted space-y-3 px-4">' + html + '</div>'; };
      if (cat === 'saved') {
        if (!watchlist.length) return box('<i class="ph ph-bookmark-simple text-3xl"></i><p class="text-xs">Nothing saved yet. Tap the bookmark on any video.</p>');
        return drawCards(grid, watchlist);
      }
      if (!ytKey && !mediaResults.length) return box('<i class="ph ph-key text-3xl text-accentOrange"></i><p class="text-sm font-bold text-cloud">Connect YouTube to search</p><p class="text-xs">Paste a YouTube Data API v3 key. It stays on this device. You can still paste any YouTube link in the search bar to watch it.</p><input id="ytKeyInput" type="password" placeholder="YouTube API key" class="w-full bg-obsidian border border-graphiteBorder rounded-2xl px-4 py-3 text-sm text-cloud"><button onclick="saveYtKey()" class="btn-chunky px-5 py-2.5 rounded-2xl bg-accentOrange text-obsidian font-display font-extrabold text-xs uppercase">Save key</button>');
      if (ytKey && mediaState === 'idle') { loadMedia('trending'); return; }
      if (mediaState === 'loading') { grid.innerHTML = Array(4).fill('<div class="rounded-3xl bg-graphite aspect-video animate-pulse"></div>').join(''); return; }
      if (mediaState === 'error') return box('<i class="ph ph-warning text-3xl text-accentOrange"></i><p class="text-xs">' + mEsc(mediaError) + '</p><button onclick="retryMedia()" class="px-4 py-2 rounded-xl bg-graphite border border-graphiteBorder text-xs font-bold text-cloud">Retry</button>');
      if (!mediaResults.length) return box('<i class="ph ph-video-camera-slash text-3xl"></i><p class="text-xs">No results. Try different words.</p>');
      drawCards(grid, mediaResults);
    }
    function drawCards(grid, list) {
      grid.innerHTML = list.map(item => `
        <div class="glass-panel rounded-3xl border border-graphiteBorder overflow-hidden group hover:border-accentOrange/50 transition-all">
          <div class="relative aspect-video overflow-hidden cursor-pointer bg-obsidian" onclick="openVideoPlayer('${mEsc(item.id)}')">
            <img src="${mEsc(item.thumbnail)}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-0 bg-black/30 flex items-center justify-center"><div class="w-12 h-12 rounded-2xl bg-obsidian/80 text-accentOrange flex items-center justify-center border border-accentOrange/30"><i class="ph-fill ph-play text-xl ml-0.5"></i></div></div>
          </div>
          <div class="p-4 space-y-2">
            <div class="flex items-start justify-between gap-2">
              <h4 class="font-display font-bold text-xs sm:text-sm text-cloud line-clamp-2 cursor-pointer" onclick="openVideoPlayer('${mEsc(item.id)}')">${mEsc(item.title)}</h4>
              <button onclick="toggleWatchlist('${mEsc(item.id)}')" title="Save" class="text-sm p-1 ${isSaved(item.id) ? 'text-accentOrange' : 'text-cloudMuted'}"><i class="${isSaved(item.id) ? 'ph-fill' : 'ph'} ph-bookmark-simple"></i></button>
            </div>
            <div class="flex items-center justify-between text-[11px] text-cloudMuted"><span>${mEsc(item.channel)}</span><span>${mEsc(item.views)}</span></div>
          </div>
        </div>`).join('');
    }
    function filterMediaCategory(cat, btn) {
      currentMediaCategory = cat;
      document.querySelectorAll('.media-pill').forEach(b => { b.classList.remove('active', 'bg-accentOrange', 'text-obsidian'); b.classList.add('bg-graphite', 'text-cloudMuted'); });
      if (btn) { btn.classList.remove('bg-graphite', 'text-cloudMuted'); btn.classList.add('active', 'bg-accentOrange', 'text-obsidian'); }
      if (cat === 'saved' || !ytKey) return renderMediaGrid();
      loadMedia(cat === 'trending' ? 'trending' : 'search', YT_QUERIES[cat]);
    }
    function handleMediaSearch(query) {
      query = query.trim(); if (!query) return;
      const m = query.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
      if (m) {
        const id = m[1];
        if (!findVideo(id)) mediaResults.unshift({ id, youtubeId: id, title: 'YouTube video', channel: 'Pasted link', thumbnail: 'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg', views: '' });
        return openVideoPlayer(id);
      }
      currentMediaCategory = 'search';
      document.querySelectorAll('.media-pill').forEach(b => { b.classList.remove('active', 'bg-accentOrange', 'text-obsidian'); b.classList.add('bg-graphite', 'text-cloudMuted'); });
      if (!ytKey) return renderMediaGrid();
      loadMedia('search', query);
    }
    function clearMediaSearch() {
      const input = document.getElementById('mediaSearchInput');
      if (input) { input.value = ''; input.focus(); }
      document.getElementById('clearSearchBtn').classList.add('hidden');
    }
    function toggleWatchlist(id) {
      const v = findVideo(id); if (!v) return;
      if (isSaved(id)) { watchlist = watchlist.filter(w => w.id !== id); showNotificationToast('Removed from Saved'); }
      else { watchlist.push(v); showNotificationToast('Saved!'); }
      localStorage.setItem(STORAGE_KEY_WATCHLIST, JSON.stringify(watchlist));
      updateWatchlistCounter(); renderMediaGrid();
    }
    function updateWatchlistCounter() { const c = document.getElementById('watchlistCount'); if (c) c.innerText = watchlist.length; }
    function openVideoPlayer(id) {
      const video = findVideo(id); if (!video) return;
      currentPlayingVideo = video;
      document.getElementById('videoPlayerTitle').innerText = video.title;
      document.getElementById('videoPlayerChannel').innerHTML = mEsc(video.channel) + ' &bull; <a class="underline text-accentOrange" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=' + encodeURIComponent(video.youtubeId) + '">Open on YouTube</a>';
      document.getElementById('youtubeIframe').src = 'https://www.youtube.com/embed/' + encodeURIComponent(video.youtubeId) + '?autoplay=1&rel=0';
      document.getElementById('videoPlayerModal').classList.remove('hidden');
      awardXp(10, 'Media Played');
    }
    function closeVideoPlayer() { document.getElementById('youtubeIframe').src = ''; document.getElementById('videoPlayerModal').classList.add('hidden'); }
    function toggleCurrentVideoWatchlist() { if (currentPlayingVideo) toggleWatchlist(currentPlayingVideo.id); }

    /* ---- Identity (fresh-user onboarding) ---- */
    function getUserName() { return localStorage.getItem('dahub_name_v3') || 'You'; }
    function applyUserName() {
      const n = localStorage.getItem('dahub_name_v3'); if (!n) return;
      const set = (id, t) => { const e = document.getElementById(id); if (e) e.textContent = t; };
      let since = localStorage.getItem('dahub_since_v3');
      if (!since) { since = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); localStorage.setItem('dahub_since_v3', since); }
      set('homeName', n); set('profileName', n); set('profileHandle', '@' + n.toLowerCase().replace(/[^a-z0-9]+/g, '') + ' \u2022 Member since ' + since);
      set('userHeaderAvatar', n[0].toUpperCase()); set('profileAvatar', n[0].toUpperCase());
    }
    function saveUserName() {
      const v = document.getElementById('nameInput').value.trim(); if (!v) return;
      localStorage.setItem('dahub_name_v3', v); document.getElementById('nameModal').remove(); applyUserName();
    }
    function updateHomeStats() { const s = (i, v) => { const e = document.getElementById(i); if (e) e.textContent = v; }; s('statSets', workouts.length); s('statPosts', posts.length); s('statSaved', watchlist.length); }
    document.addEventListener('DOMContentLoaded', () => {
      applyUserName(); updateHomeStats(); setInterval(updateHomeStats, 1000);
      if (!localStorage.getItem('dahub_name_v3')) {
        const d = document.createElement('div'); d.id = 'nameModal';
        d.className = 'fixed inset-0 z-[70] bg-obsidian/95 flex items-center justify-center p-6';
        d.innerHTML = '<div class="w-full max-w-sm glass-panel-elevated p-6 rounded-3xl border border-graphiteBorder space-y-4 text-center"><h2 class="font-display font-extrabold text-2xl text-white">Welcome to DaHub</h2><p class="text-xs text-cloudMuted">What should we call you?</p><input id="nameInput" maxlength="24" placeholder="Your name" class="w-full bg-obsidian border border-graphiteBorder rounded-2xl px-4 py-3 text-sm text-cloud text-center" onkeydown="if(event.key===\'Enter\')saveUserName()"><button onclick="saveUserName()" class="btn-chunky w-full py-3 rounded-2xl bg-gradient-to-r from-neonPurple via-violetHub to-volt text-obsidian font-display font-extrabold text-sm uppercase">Let\u2019s go</button></div>';
        document.body.appendChild(d);
      }
    });

    /* ================================================= */
    /* ASK AI SIMULATED CONVERSATION ASSISTANT           */
    /* ================================================= */
    function useAiPreset(prompt) {
      const input = document.getElementById('aiInputPrompt');
      if (input) {
        input.value = prompt;
        handleSendAiMessage(new Event('submit'));
      }
    }

    function handleSendAiMessage(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('aiInputPrompt');
      const text = input.value.trim();
      if (!text) return;

      const chatWindow = document.getElementById('aiChatWindow');

      // Append user bubble
      const userBubble = `
        <div class="flex items-start gap-3 justify-end">
          <div class="bg-electricBlue text-obsidian font-semibold p-3.5 rounded-2xl rounded-tr-sm text-xs leading-relaxed max-w-[85%] shadow-md">
            ${escapeHtml(text)}
          </div>
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-neonPurple to-violetHub flex-shrink-0 flex items-center justify-center font-bold text-xs text-obsidian">
            ME
          </div>
        </div>
      `;
      chatWindow.insertAdjacentHTML('beforeend', userBubble);
      input.value = '';
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // Temporary typing indicator
      const typingId = 'typing_' + Date.now();
      const typingBubble = `
        <div id="${typingId}" class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-xl bg-electricBlue/20 text-electricBlue flex-shrink-0 flex items-center justify-center font-bold text-xs">
            AI
          </div>
          <div class="bg-graphiteLight p-3 rounded-2xl rounded-tl-sm text-xs text-cloudMuted flex items-center gap-1.5 border border-graphiteBorder">
            <span class="w-1.5 h-1.5 rounded-full bg-electricBlue animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-electricBlue animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-electricBlue animate-bounce [animation-delay:0.4s]"></span>
          </div>
        </div>
      `;
      chatWindow.insertAdjacentHTML('beforeend', typingBubble);
      chatWindow.scrollTop = chatWindow.scrollHeight;

      // Generate contextual intelligent response
      setTimeout(() => {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const reply = generateAiReply(text);
        const aiBubble = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-electricBlue/20 text-electricBlue flex-shrink-0 flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div class="bg-graphiteLight p-3.5 rounded-2xl rounded-tl-sm text-xs text-cloud leading-relaxed max-w-[85%] border border-graphiteBorder space-y-2">
              ${reply}
            </div>
          </div>
        `;
        chatWindow.insertAdjacentHTML('beforeend', aiBubble);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        playAudioTone(520, 'sine', 0.08);
        awardXp(10, 'AI Strategy Consultation');
      }, 900);
    }

    function generateAiReply(userPrompt) {
      const p = userPrompt.toLowerCase();
      if (p.includes('split') || p.includes('chest') || p.includes('workout') || p.includes('hypertrophy')) {
        return `
          <p class="font-bold text-volt">🔥 DaHub Hypertrophy Prescription:</p>
          <ul class="list-disc pl-4 space-y-1 text-cloud/90">
            <li><strong>Primary Compound:</strong> Incline DB Press (3 sets × 8–10 reps, 3-second eccentric).</li>
            <li><strong>Mechanical Stretch:</strong> Low-to-High Cable Flyes (3 sets × 12 reps with 2s squeeze).</li>
            <li><strong>Triceps Overload:</strong> Overhead Rope Extension superset with Dips to failure.</li>
          </ul>
          <p class="text-[11px] text-cloudMuted">Rest 90-120 seconds between working sets for max motor-unit recovery.</p>
        `;
      } else if (p.includes('streetwear') || p.includes('fit') || p.includes('sneaker') || p.includes('drip')) {
        return `
          <p class="font-bold text-neonPurple">👟 Streetwear & Gym Capsule Blueprint:</p>
          <p>Pair an acid-wash, heavy 320 GSM boxy oversized tee with charcoal tactical cargos and high-profile retro trainers. Monochromatic graphite tones keep the silhouette tall and dimensional.</p>
          <p class="text-[11px] text-cloudMuted">Pro Tip: Keep the crown emblem subtle—layer with a minimal stainless chain.</p>
        `;
      } else if (p.includes('protein') || p.includes('meal') || p.includes('diet') || p.includes('calories')) {
        return `
          <p class="font-bold text-goldCrown">🥩 180g Lean Macro Strategy:</p>
          <p>1. <strong>Meal 1:</strong> 4 whole eggs + 1 cup liquid egg whites scramble + sourdough (45g protein).</p>
          <p>2. <strong>Meal 2:</strong> 8oz Grilled chicken breast with jasmine rice & avocado (55g protein).</p>
          <p>3. <strong>Meal 3:</strong> 1.5 cups Non-fat Greek yogurt with blueberries & almonds (35g protein).</p>
          <p>4. <strong>Meal 4:</strong> 7oz 93/7 Lean ground beef bowl (45g protein).</p>
        `;
      } else {
        return `
          <p>Understood. In the DaHub ecosystem, execution is everything. Whether you're optimizing physical performance, dialing in your personal brand, or sharpening your daily routine, keep the friction low and the standard high.</p>
          <p class="text-[11px] text-electricBlue font-semibold">What specific metric would you like to refine next?</p>
        `;
      }
    }

    function clearAiChat() {
      const chatWindow = document.getElementById('aiChatWindow');
      if (chatWindow) {
        chatWindow.innerHTML = `
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-xl bg-electricBlue/20 text-electricBlue flex-shrink-0 flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <div class="bg-graphiteLight p-3.5 rounded-2xl rounded-tl-sm text-xs text-cloud leading-relaxed max-w-[85%] border border-graphiteBorder">
              Chat session refreshed. What's on your agenda?
            </div>
          </div>
        `;
      }
    }

    /* ================================================= */
    /* CREATE ACTION MODAL (Universal Dispatcher)        */
    /* ================================================= */
    let currentCreateMode = 'post';

    function openCreateModal(mode = 'quick') {
      playAudioTone(440, 'triangle', 0.08);
      const modal = document.getElementById('createActionModal');
      modal.classList.remove('hidden');
      setupCreateForm(mode === 'quick' ? 'post' : mode);
    }

    function closeCreateModal() {
      const modal = document.getElementById('createActionModal');
      modal.classList.add('hidden');
    }

    function setupCreateForm(type) {
      currentCreateMode = type;
      const title = document.getElementById('createModalTitle');
      const label = document.getElementById('createLabelText');
      const textarea = document.getElementById('createTextarea');
      const imageRow = document.getElementById('postImageInputRow');
      const tagRow = document.getElementById('postTagSelector');

      if (type === 'post') {
        title.innerText = 'Create Social Post';
        label.innerText = 'What are you flexing?';
        textarea.placeholder = 'Share workout updates, gym quotes, streetwear drops...';
        imageRow.classList.remove('hidden');
        tagRow.classList.remove('hidden');
      } else if (type === 'workout') {
        title.innerText = 'Quick Workout Note';
        label.innerText = 'Log Quick Set / PR';
        textarea.placeholder = 'e.g. Incline Bench 225 lbs × 5 reps (Easy PR)';
        imageRow.classList.add('hidden');
        tagRow.classList.add('hidden');
      } else if (type === 'ask') {
        title.innerText = 'Ask AI Engine';
        label.innerText = 'Prompt Query';
        textarea.placeholder = 'Ask anything on biomechanics, meals, fits...';
        imageRow.classList.add('hidden');
        tagRow.classList.add('hidden');
      }
    }

    function selectPostTag(btn, tag) {
      selectedTag = tag;
      document.querySelectorAll('.tag-chip').forEach(c => {
        c.className = 'tag-chip text-xs px-2.5 py-1 rounded-xl bg-obsidian text-cloudMuted border border-graphiteBorder';
      });
      btn.className = 'tag-chip text-xs px-2.5 py-1 rounded-xl bg-volt/15 text-volt border border-volt/30 font-bold';
    }

    function handleDynamicSubmit(e) {
      e.preventDefault();
      const text = document.getElementById('createTextarea').value.trim();
      const imageUrl = document.getElementById('createImageInput').value.trim();
      if (!text) return;

      if (currentCreateMode === 'post') {
        const newPost = {
          id: 'post-' + Date.now(),
          author: getUserName(),
          handle: '@'+getUserName().toLowerCase().replace(/[^a-z0-9]+/g,''),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          content: text,
          tag: selectedTag,
          image: imageUrl || '',
          likes: 1,
          liked: true,
          timeAgo: 'Just now',
          comments: []
        };
        posts.unshift(newPost);
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
        awardXp(50, 'Published New Community Post');
        renderSocialFeed();
        switchTab('social');
      } else if (currentCreateMode === 'workout') {
        workouts.unshift({
          id: 'w_' + Date.now(),
          exercise: text,
          weight: 200,
          reps: 8,
          rpe: 8.0,
          time: 'Just now'
        });
        localStorage.setItem(STORAGE_KEY_WORKOUTS, JSON.stringify(workouts));
        renderWorkoutList();
        awardXp(30, 'Workout note logged');
        switchTab('train');
      } else if (currentCreateMode === 'ask') {
        switchTab('ask');
        useAiPreset(text);
      }

      document.getElementById('createTextarea').value = '';
      document.getElementById('createImageInput').value = '';
      closeCreateModal();
    }

    /* Reset Demo Data */
    function resetAllDataConfirmation() {
      localStorage.removeItem(STORAGE_KEY_POSTS);
      localStorage.removeItem(STORAGE_KEY_WORKOUTS);
      localStorage.removeItem(STORAGE_KEY_WATCHLIST);
      localStorage.removeItem(STORAGE_KEY_USER_XP);['dahub_sposts_v3','dahub_people_v3','dahub_handle_v3','dahub_name_v3'].forEach(k=>localStorage.removeItem(k));
      posts = [];
      workouts = [];
      watchlist = ['v1', 'v3'];
      userXp = 1420;
      updateXpDisplay();
      renderSocialFeed();
      renderWorkoutList();
      renderMediaGrid('all');
      updateWatchlistCounter();
      showNotificationToast('Reset to DaHub default demo data');
    }

    function toggleAudioFeedback() {
      playAudioTone(440, 'sine', 0.1);
    }

    function escapeHtml(string) {
      if (!string) return '';
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  
