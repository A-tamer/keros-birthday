import confetti from 'canvas-confetti'

const COLORS = ['#d4a020', '#f0c850', '#3b6cf5', '#22c55e', '#ffffff', '#f59e0b']

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function fireSideCannons(durationMs = 3000) {
  if (prefersReducedMotion()) return

  const end = Date.now() + durationMs

  const frame = () => {
    if (Date.now() > end) return
    confetti({ particleCount: 2, angle: 60, spread: 55, startVelocity: 55, origin: { x: 0, y: 0.5 }, colors: COLORS })
    confetti({ particleCount: 2, angle: 120, spread: 55, startVelocity: 55, origin: { x: 1, y: 0.5 }, colors: COLORS })
    requestAnimationFrame(frame)
  }
  frame()
}

export function fireBurst(particleCount = 50) {
  if (prefersReducedMotion()) return
  confetti({ particleCount, spread: 70, origin: { y: 0.6 }, colors: COLORS })
}

export function fireCelebration() {
  if (prefersReducedMotion()) return
  const defaults = { origin: { y: 0.7 }, colors: COLORS }
  confetti({ ...defaults, particleCount: 40, spread: 100 })
  confetti({ ...defaults, particleCount: 40, spread: 60, scalar: 0.8 })
}
