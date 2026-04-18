let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;

function getCtx(): { ctx: AudioContext; dest: AudioNode } {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Setup master chain
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;

    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.7; // Global volume

    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return { ctx: audioCtx, dest: masterGain! };
}

/**
 * Call this once after any user gesture to unlock audio on mobile browsers.
 * iOS/Android require a user interaction before AudioContext can play sound.
 */
export function unlockAudio() {
  try {
    const { ctx } = getCtx();
    // Play a silent buffer to unlock the audio context
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const silentBuffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = silentBuffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch (_) {}
}

/**
 * Advanced ADSR Oscillator Synth
 */
function playSynth(
  freqs: number[],
  type: OscillatorType,
  attack: number,
  decay: number,
  sustain: number,
  release: number,
  volume = 1,
  startTimeOffset = 0,
  pitchSweep?: { endFreq: number; time: number }
) {
  try {
    const { ctx, dest } = getCtx();
    const time = ctx.currentTime + startTimeOffset;

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      if (pitchSweep) {
        osc.frequency.exponentialRampToValueAtTime(pitchSweep.endFreq, time + pitchSweep.time);
      }

      // ADSR Envelope
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + attack);
      gain.gain.exponentialRampToValueAtTime(sustain * volume + 0.001, time + attack + decay);
      gain.gain.setValueAtTime(sustain * volume + 0.001, time + attack + decay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay + release);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(time);
      osc.stop(time + attack + decay + release + 0.1);
    });
  } catch (e) {}
}

/**
 * Specific Game Sounds
 */

export function playTick() {
  playSynth([800], 'sine', 0.01, 0.05, 0, 0.1, 0.05); // Soft tiny tick
}

export function playUrgent() {
  playSynth([500], 'square', 0.01, 0.1, 0, 0.1, 0.1);
  playSynth([500], 'square', 0.01, 0.1, 0, 0.1, 0.1, 0.2);
}

// Organic Bell for Correct
export function playCorrect() {
  // Major chord (C E G) high pitch for a bell-like sound
  playSynth([523.25, 659.25, 783.99], 'sine', 0.01, 0.2, 0.2, 1.0, 0.4);
  playSynth([1046.50], 'triangle', 0.01, 0.3, 0.1, 1.2, 0.2); // Harmonic highlight
}

// Deep Bass Drop for Wrong
export function playWrong() {
  playSynth([150], 'sawtooth', 0.02, 0.1, 0.3, 0.4, 0.4, 0, { endFreq: 40, time: 0.4 });
  playSynth([145], 'square', 0.02, 0.1, 0.3, 0.4, 0.2, 0, { endFreq: 38, time: 0.4 });
}

export function playReveal() {
  // Arpeggio leading up to a cord
  playSynth([440], 'sine', 0.05, 0.1, 0.2, 0.5, 0.3, 0);
  playSynth([554.37], 'sine', 0.05, 0.1, 0.2, 0.5, 0.3, 0.15);
  playSynth([659.25], 'sine', 0.05, 0.1, 0.2, 0.5, 0.3, 0.3);
  playSynth([880], 'sine', 0.1, 0.3, 0.5, 1.5, 0.4, 0.45);
}

export function playFanfare() {
  // Rich synth fanfare sequence
  const vol = 0.5;
  playSynth([261.63, 329.63, 392.0], 'square', 0.05, 0.1, 0.8, 0.2, vol, 0);
  playSynth([261.63, 329.63, 392.0], 'square', 0.05, 0.1, 0.8, 0.2, vol, 0.3);
  playSynth([349.23, 440.0, 523.25], 'square', 0.05, 0.1, 0.8, 0.2, vol, 0.6);
  playSynth([392.0, 493.88, 587.33], 'square', 0.05, 0.1, 0.8, 0.7, vol, 0.9);
  playSynth([523.25, 659.25, 783.99], 'square', 0.1, 0.2, 0.8, 2.0, vol * 1.2, 1.2);
}

// UI Actions for hooks
export function playHoverSound() {
  playSynth([1200], 'sine', 0.01, 0.03, 0, 0.05, 0.03);
}

export function playClickSound() {
  playSynth([600], 'sine', 0.01, 0.05, 0.2, 0.1, 0.15, 0, { endFreq: 400, time: 0.1 });
}

export function playPopSound() {
  playSynth([400], 'sine', 0.02, 0.05, 0.5, 0.2, 0.3, 0, { endFreq: 900, time: 0.1 });
  playSynth([800], 'triangle', 0.02, 0.05, 0, 0.1, 0.1, 0.02);
}

export function playDrumRoll(durationSeconds = 5) {
  try {
    const { ctx, dest } = getCtx();
    const now = ctx.currentTime;

    // Snare rolls — noise bursts getting faster
    const totalBeats = 40;
    for (let i = 0; i < totalBeats; i++) {
      const progress = i / totalBeats;
      // Accelerate: start slow, end fast
      const t = now + (Math.pow(progress, 2) * durationSeconds);

      // Noise buffer for snare
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        data[j] = (Math.random() * 2 - 1) * (1 - j / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gainNode = ctx.createGain();
      const vol = 0.08 + progress * 0.2;
      gainNode.gain.setValueAtTime(vol, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      // Highpass filter for snare character
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2000;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(dest);
      source.start(t);
      source.stop(t + 0.1);
    }

    // Bass drum hits on beats
    for (let i = 0; i < 8; i++) {
      const t = now + (i / 7) * durationSeconds * 0.95;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
      gainNode.gain.setValueAtTime(0.4, t);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gainNode);
      gainNode.connect(dest);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  } catch (e) {}
}

export function playCountdownBeep(isLast = false) {
  try {
    const { ctx, dest } = getCtx();
    const now = ctx.currentTime;
    const freq = isLast ? 1200 : 800;
    const duration = isLast ? 0.6 : 0.25;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gainNode);
    gainNode.connect(dest);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (e) {}
}

export function playPodiumReveal(position: number) {
  // 0 = 3rd, 1 = 2nd, 2 = winner
  try {
    const { ctx, dest } = getCtx();
    const now = ctx.currentTime;
    const baseFreqs = [
      [261.63, 329.63, 392.0],
      [349.23, 440.0, 523.25],
      [523.25, 659.25, 783.99],
    ];
    const vol = 0.3 + position * 0.15;
    const freqs = baseFreqs[position] || baseFreqs[2];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gainNode.gain.setValueAtTime(0, now + i * 0.06);
      gainNode.gain.linearRampToValueAtTime(vol, now + i * 0.06 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.8);
      osc.connect(gainNode);
      gainNode.connect(dest);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.9);
    });
  } catch (e) {}
}

export function vibrate(pattern: number | number[] = 50) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}
