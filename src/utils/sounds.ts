let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;

function getCtx(): { ctx: AudioContext; dest: AudioNode } {
  if (!audioCtx) {
    audioCtx = new AudioContext();
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

export function vibrate(pattern: number | number[] = 50) {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (_) {}
}
