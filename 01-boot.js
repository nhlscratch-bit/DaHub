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
  
