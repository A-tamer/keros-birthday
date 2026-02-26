import { motion } from 'framer-motion'
import './TitleScreen.css'

const HERO_IMAGE_SRC = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'

export default function TitleScreen({ onStart }) {
  return (
    <div className="title-screen">
      <motion.div
        className="title-logo-wrap"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="title-diamond" aria-hidden="true" />
        <h1 className="title-heading">
          <span className="title-who">WHO WANTS TO BE</span>
          <span className="title-millionaire">A MILLIONAIRE?</span>
        </h1>
      </motion.div>

      <motion.div
        className="title-avatar-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <img src={HERO_IMAGE_SRC} alt="Kero" className="title-avatar" />
        <p className="title-edition">🎂 Kero's Birthday Edition 🎂</p>
      </motion.div>

      <motion.p
        className="title-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        Answer 10 friendship questions to unlock the birthday gift code!
      </motion.p>

      <motion.button
        className="title-start-btn"
        onClick={onStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        START GAME
      </motion.button>
    </div>
  )
}
