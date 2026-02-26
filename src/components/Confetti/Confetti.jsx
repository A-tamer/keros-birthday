import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Confetti.css'

const COLORS = ['#d4a020', '#f0c850', '#3b6cf5', '#22c55e', '#ffffff', '#f59e0b']
const PARTICLE_COUNT = 55

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(6, 14),
    duration: randomBetween(1.8, 2.8),
    delay: randomBetween(0, 0.25),
    tx: randomBetween(-150, 150),
    ty: randomBetween(-220, -100),
    rotateEnd: randomBetween(-360, 360),
  }))
}

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (active) {
      setParticles(createParticles())
      setShow(true)
      const t = setTimeout(() => setShow(false), 3500)
      return () => clearTimeout(t)
    }
  }, [active])

  if (!show || particles.length === 0) return null

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="confetti-particle"
          style={{
            left: '50%',
            top: '50%',
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            marginLeft: -p.size / 2,
            marginTop: -(p.size * 0.6) / 2,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.tx,
            y: p.ty,
            rotate: p.rotateEnd,
            scale: [1, 1.15, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  )
}
