export function playSound(type: "select" | "hit" | "damage" | "victory" | "confirm" | "queue" | "intro" | "error") {
  try {
    const AudioCtor: typeof globalThis.AudioContext | undefined =
      window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof globalThis.AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();

    if (type === "intro") {
      // Synthesize high-fidelity video game swoop whoosh using resonant white noise sweeps
      const duration = 0.85;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 8.5; // resonant peak for retro-futuristic swoosh texture

      const gain = ctx.createGain();
      const now = ctx.currentTime;

      // Symmetrical filter frequency sweep: Low -> High -> Low
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.32);
      filter.frequency.exponentialRampToValueAtTime(120, now + duration);

      // Gain sweep: Fade in -> Peak -> Fade out
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    const settings = {
      select: [800, 1200, 0.1, "sine"],
      hit: [400, 800, 0.15, "square"],
      damage: [150, 40, 0.3, "sawtooth"],
      victory: [440, 659, 1, "triangle"],
      confirm: [520, 980, 0.12, "triangle"],
      queue: [300, 620, 0.18, "sine"],
      error: [180, 90, 0.22, "sawtooth"],
    } as const;
    const [start, end, duration, wave] = settings[type as Exclude<typeof type, "intro">];

    osc.type = wave;
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(type === "damage" || type === "error" ? 0.3 : 0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Audio is cosmetic; ignore browser autoplay restrictions.
  }
}
