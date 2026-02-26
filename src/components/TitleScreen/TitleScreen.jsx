import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './TitleScreen.css'

const CONFETTI_COLORS = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#01a3a4', '#ff6348', '#2ed573', '#ffa502']
const CONFETTI_SHAPES = ['square', 'rect', 'circle']
const CONFETTI_COUNT = 45

function ConfettiPiece({ index }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
  const shape = CONFETTI_SHAPES[index % CONFETTI_SHAPES.length]
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = 3 + Math.random() * 4
  const size = 6 + Math.random() * 10
  const rotation = Math.random() * 360

  return (
    <motion.div
      className={`hero-confetti hero-confetti--${shape}`}
      style={{
        left: `${left}%`,
        width: shape === 'rect' ? size * 0.4 : size,
        height: shape === 'circle' ? size : size * (shape === 'rect' ? 1.6 : 1),
        backgroundColor: color,
        borderRadius: shape === 'circle' ? '50%' : '2px',
      }}
      initial={{ y: -20, opacity: 0, rotate: rotation }}
      animate={{
        y: ['0vh', '105vh'],
        opacity: [0, 1, 1, 0],
        rotate: rotation + 360 + Math.random() * 360,
        x: [0, (Math.random() - 0.5) * 60],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default function TitleScreen({ onStart }) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hero-screen">
      {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <motion.div
        className="hero-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="hero-photo-wrap"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
        >
          <img src="/hero.png" alt="Happy Birthday Kero" className="hero-photo" />
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <span className="hero-title-line">HAPPY</span>
          <span className="hero-title-line">BIRTHDAY</span>
          <span className="hero-title-name">KERO! 🎂</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          I made you a special game — answer the questions to unlock your birthday gift!
        </motion.p>

        <AnimatePresence>
          {showButton && (
            <motion.button
              className="hero-play-btn"
              onClick={onStart}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <span className="hero-play-btn-icon">🎮</span>
              <span>LET'S PLAY!</span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
