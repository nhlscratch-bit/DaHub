    // Audio feedback synth via Web Audio API
    let audioCtx = null;
    function playAudioTone(freq = 440, type = 'sine', duration = 0.08) {
      const toggle = document.getElementById('audioToggle');
      if (toggle && !toggle.checked) return;
      try {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        // Safe silence if audio restricted
      }
    }

    function triggerEasterEggSound() {
      playAudioTone(587.33, 'triangle', 0.1);
      setTimeout(() => playAudioTone(880, 'triangle', 0.2), 100);
    }
  

/* ===== Supabase (accounts). The publishable key is public by design; never put a service_role key here. ===== */
const SUPA_URL = 'https://netegdwqbzqugjbjtrnb.supabase.co';
const SUPA_KEY = 'sb_publishable_9z0pmkU3lB-K2M3uz-iEvg_vMvs6HiX';
const sb = (window.supabase && window.supabase.createClient) ? window.supabase.createClient(SUPA_URL, SUPA_KEY) : null;
