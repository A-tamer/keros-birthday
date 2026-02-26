import { motion } from 'framer-motion'
import './WinScreen.css'

export default function WinScreen() {
  return (
    <div className="win-screen">
      <motion.div
        className="win-badge"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        🏆
      </motion.div>

      <motion.h1
        className="win-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        YOU WON $1,000,000!
      </motion.h1>

      <motion.p
        className="win-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        You know our friendship better than anyone.
        <br />Now go unlock that box — you've earned it.
      </motion.p>

      <motion.div
        className="win-code-wrap"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <p className="win-code-label">Your unlock code:</p>
        <div className="win-code-digits">
          {'4829'.split('').map((d, i) => (
            <motion.span
              key={i}
              className="win-code-digit"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
            >
              {d}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.p
        className="win-message"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        🎂 Happy Birthday, Kero! 🎂
      </motion.p>
    </div>
  )
}
