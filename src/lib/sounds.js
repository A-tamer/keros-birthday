let audioCtx = null
let muted = false
let bgMusic = null
let tickInterval = null

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  if (muted) return
  try {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

function playChord(freqs, duration, type = 'sine', volume = 0.15) {
  freqs.forEach((f) => playTone(f, duration, type, volume))
}

const SOUNDS = {
  correct() {
    playChord([523.25, 659.25, 783.99], 0.15, 'sine', 0.2)
    setTimeout(() => playChord([659.25, 783.99, 1046.5], 0.3, 'sine', 0.2), 150)
  },
  wrong() {
    playTone(200, 0.15, 'square', 0.2)
    setTimeout(() => playTone(150, 0.4, 'square', 0.15), 150)
  },
  final() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5]
    notes.forEach((f, i) => {
      setTimeout(() => playTone(f, 0.3, 'sine', 0.2), i * 120)
    })
  },
  tick() {
    playTone(800, 0.05, 'square', 0.1)
  },
}

export function preloadSounds() {
  try { getCtx() } catch {}
}

export function playSound(key) {
  if (muted) return
  try { SOUNDS[key]?.() } catch {}
}

export function startBackgroundMusic() {
  if (muted) return
  try {
    const ctx = getCtx()
    if (bgMusic) return

    const bpm = 100
    const beat = 60 / bpm
    const bar = beat * 4
    let nextTime = ctx.currentTime + 0.05

    const bassLine = [130.81, 146.83, 164.81, 174.61, 164.81, 146.83]
    let bassIdx = 0
    let running = true

    function scheduleBass() {
      if (!running || muted) return
      const now = ctx.currentTime
      while (nextTime < now + 0.5) {
        const freq = bassLine[bassIdx % bassLine.length]
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, nextTime)
        gain.gain.setValueAtTime(0.06, nextTime)
        gain.gain.exponentialRampToValueAtTime(0.001, nextTime + beat * 0.9)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(nextTime)
        osc.stop(nextTime + beat)
        bassIdx++
        nextTime += beat
      }
      bgMusic._raf = requestAnimationFrame(scheduleBass)
    }

    bgMusic = {
      _raf: null,
      stop() {
        running = false
        if (this._raf) cancelAnimationFrame(this._raf)
      },
    }
    scheduleBass()
  } catch {}
}

export function stopBackgroundMusic() {
  if (bgMusic) {
    bgMusic.stop()
    bgMusic = null
  }
}

export function startTickSound() {
  if (muted || tickInterval) return
  tickInterval = setInterval(() => {
    if (!muted) SOUNDS.tick()
  }, 1000)
}

export function stopTickSound() {
  if (tickInterval) {
    clearInterval(tickInterval)
    tickInterval = null
  }
}

export function toggleMute() {
  muted = !muted
  if (muted) {
    stopBackgroundMusic()
    stopTickSound()
  }
  return muted
}

export function isMuted() {
  return muted
}
