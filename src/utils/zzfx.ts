// ZzFX - micro sound synthesizer
// By Frank Force
// https://github.com/KilledByAPixel/ZzFX

export const zzfxV = 0.3; // volume

export const zzfx = (...args: any[]) => {
  // @ts-ignore
  let b = zzfxX.createBuffer(1, 99999, 44100),
    c = b.getChannelData(0),
    d = zzfxV,
    e = 0,
    f = 0,
    g = 0,
    h = 0,
    i = 0,
    j = 1,
    k = 0,
    l = 0,
    m = 0,
    n = 0,
    o = 0,
    p = 0,
    q = 0,
    r = 0,
    s = 0,
    t = 0,
    u = 0,
    v = 0,
    w = 0,
    x = 0;

  let [
    volume = 1,
    randomness = 0.05,
    frequency = 220,
    attack = 0,
    sustain = 0,
    release = 0.1,
    shape = 0,
    shapeCurve = 1,
    slide = 0,
    deltaSlide = 0,
    pitchJump = 0,
    pitchJumpTime = 0,
    repeatTime = 0,
    noise = 0,
    modulation = 0,
    bitCrush = 0,
    delay = 0,
    sustainVolume = 1,
    decay = 0,
    tremolo = 0,
    filter = 0
  ] = args;

  let B: number = 0;

  for (let A = 0; A < 99999; ++A) {
    if ((m = A / 44100) > attack + sustain + release) break;
    j =
      A < attack * 44100
        ? A / (attack * 44100)
        : A < (attack + sustain) * 44100
          ? 1 - ((A - attack * 44100) / (sustain * 44100)) * (1 - sustainVolume)
          : (sustainVolume * (1 - (A - (attack + sustain) * 44100) / (release * 44100))) ** decay;

    e +=
      (f += g += slide / 5e5) +
      (B =
        pitchJump *
        (pitchJumpTime && pitchJumpTime * 44100 < A ? 1 : 0) +
        (repeatTime ? Math.sin((A * 2 * Math.PI) / (repeatTime * 44100)) : 0)) +
      (modulation ? Math.sin((A * 2 * Math.PI * modulation) / 44100) : 0);

    w = Math.sin((A * 2 * Math.PI * tremolo) / 44100);

    h =
      (shape > 2
        ? Math.random() * 2 - 1
        : shape > 1
          ? (e % 1) * 2 - 1
          : shape
            ? Math.sign((e % 1) - 0.5)
            : Math.sin(e * 2 * Math.PI)) **
        shapeCurve *
      (1 - w * 0.5 + 0.5) *
      j;

    k += h * (44100 * delay > A ? 0 : 1);
    l += h - k * filter;

    c[A] =
      volume *
      d *
      l *
      (bitCrush ? Math.round(bitCrush * Math.random()) / bitCrush : 1) *
      (noise ? Math.random() * noise : 1);
  }

  // @ts-ignore
  let R = zzfxX.createBufferSource();
  R.buffer = b;
  R.connect(zzfxX.destination);
  R.start();
  return R;
};

// @ts-ignore
export const zzfxX = new (window.AudioContext || window.webkitAudioContext)();
