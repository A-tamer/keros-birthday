import { motion } from 'framer-motion'
import './ProgressMap.css'

export default function ProgressMap({ total, current }) {
  return (
    <div className="progress-map" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total} aria-label={`Question ${current + 1} of ${total}`}>
      <div className="progress-map-track">
        {Array.from({ length: total }, (_, i) => {
          const isCompleted = i < current
          const isCurrent = i === current
          return (
            <motion.div
              key={i}
              className={`progress-map-step ${isCompleted ? 'progress-map-step--done' : ''} ${isCurrent ? 'progress-map-step--current' : ''}`}
              initial={false}
              animate={{
                scale: isCurrent ? [1, 1.15, 1] : 1,
                opacity: isCompleted ? 1 : isCurrent ? 1 : 0.4,
              }}
              transition={{
                scale: { duration: 1.5, repeat: isCurrent ? Infinity : 0, ease: 'easeInOut' },
                opacity: { duration: 0.3 },
              }}
            >
              <span className="progress-map-dot" />
              {i < total - 1 && (
                <motion.span
                  className="progress-map-connector"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'left center' }}
                />
              )}
            </motion.div>
          )
        })}
      </div>
      <div className="progress-map-labels">
        <span className="progress-map-done-label">{current} done</span>
        <span className="progress-map-left-label">{total - current - 1} to go</span>
      </div>
    </div>
  )
}
