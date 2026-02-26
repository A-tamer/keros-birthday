const SOUND_URLS = {
  correct: '/sounds/true-answer.mp3',
  wrong: '/sounds/false-answer.mp3',
  final: '/sounds/true-answer.mp3',
}

const cache = {}

function getAudio(key) {
  if (cache[key]) return cache[key]
  const audio = new Audio(SOUND_URLS[key])
  audio.preload = 'auto'
  cache[key] = audio
  return audio
}

export function preloadSounds() {
  try {
    getAudio('correct').load()
    getAudio('wrong').load()
    getAudio('final').load()
  } catch {}
}

/**
 * Play a sound. Call this directly from a user gesture (e.g. click) on mobile so it's allowed.
 */
export function playSound(key) {
  try {
    const audio = getAudio(key)
    if (!audio || !SOUND_URLS[key]) return
    audio.currentTime = 0
    audio.volume = 0.8
    audio.play().catch(() => {})
  } catch {}
}

export function startBackgroundMusic() {
  /* removed - no background audio */
}

export function stopBackgroundMusic() {
  /* removed */
}

export function startTickSound() {
  /* removed - no tick */
}

export function stopTickSound() {
  /* removed */
}

export function toggleMute() {
  return false
}

export function isMuted() {
  return false
}
