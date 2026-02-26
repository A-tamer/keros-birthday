import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions, TIMER_SECONDS } from '../../content/quiz'
import { playSound, startTickSound, stopTickSound } from '../../lib/sounds'
import { fireBurst } from '../../lib/confetti'
import ProgressMap from './ProgressMap'
import './GameStage.css'

const LETTERS = ['A', 'B', 'C', 'D']

export default function GameStage({ onWin }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const timerRef = useRef(null)
  const question = quizQuestions[index]
  const isLast = index === quizQuestions.length - 1


  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    setTimeLeft(TIMER_SECONDS)
    setTimerActive(true)
  }, [index])

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    if (timeLeft <= 5) startTickSound()

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timerRef.current)
  }, [timeLeft, timerActive])

  useEffect(() => {
    if (timeLeft <= 0 && timerActive) {
      stopTickSound()
      setTimerActive(false)
      setRevealed(true)
      playSound('wrong')
    }
  }, [timeLeft, timerActive])

  const handleSelect = useCallback((optIdx) => {
    if (selected !== null || revealed) return
    const correct = optIdx === question.correctIndex
    playSound(correct ? 'correct' : 'wrong')
    setSelected(optIdx)
    setTimerActive(false)
    stopTickSound()

    setTimeout(() => {
      setRevealed(true)
      if (correct) fireBurst(40)
    }, 1500)
  }, [selected, revealed, question])

  const handleNext = () => {
    if (isLast) {
      playSound('final')
      onWin()
    } else {
      setIndex((i) => i + 1)
    }
  }

  const handleRetry = () => {
    setSelected(null)
    setRevealed(false)
    setTimeLeft(TIMER_SECONDS)
    setTimerActive(true)
  }

  const isCorrect = revealed && selected === question.correctIndex
  const isWrong = revealed && selected !== null && selected !== question.correctIndex
  const isTimeout = revealed && selected === null

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft <= 5 ? 'var(--accent-red)' : timeLeft <= 10 ? 'var(--accent-orange)' : 'var(--accent-blue-light)'

  return (
    <div className="game-stage">
      <ProgressMap total={quizQuestions.length} current={index} />

      {/* Timer */}
      <div className="game-timer-wrap">
        <svg className="game-timer-svg" viewBox="0 0 100 100">
          <circle
            className="game-timer-bg"
            cx="50" cy="50" r="44"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          <circle
            className="game-timer-ring"
            cx="50" cy="50" r="44"
            fill="none"
            stroke={timerColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - timerPercent / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
          />
        </svg>
        <span className={`game-timer-text ${timeLeft <= 5 ? 'game-timer-text--danger' : ''}`}>
          {timeLeft}
        </span>
      </div>

      {/* Question number */}
      <div className="game-question-num">
        Question {index + 1} of {quizQuestions.length}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="game-question-wrap"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <div className="game-question-box">
            <p className="game-question-text">{question.question}</p>
          </div>

          {/* Options */}
          <div className="game-options">
            {question.options.map((opt, i) => {
              let cls = 'game-option'
              if (selected === i && !revealed) cls += ' game-option--selected'
              if (revealed && i === question.correctIndex) cls += ' game-option--correct'
              if (revealed && selected === i && i !== question.correctIndex) cls += ' game-option--wrong'

              return (
                <motion.button
                  key={i}
                  className={cls}
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null || revealed}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={selected === null && !revealed ? { scale: 1.02 } : {}}
                  whileTap={selected === null && !revealed ? { scale: 0.98 } : {}}
                >
                  <span className="game-option-letter">{LETTERS[i]}:</span>
                  <span className="game-option-text">{opt}</span>
                </motion.button>
              )
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                className="game-feedback"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isCorrect && (
                  <div className="game-feedback-correct">
                    Correct! On to the next.
                  </div>
                )}
                {isWrong && (
                  <div className="game-feedback-wrong">
                    Wrong answer! The correct answer was <strong>{LETTERS[question.correctIndex]}</strong>
                  </div>
                )}
                {isTimeout && (
                  <div className="game-feedback-wrong">
                    Time's up! The correct answer was <strong>{LETTERS[question.correctIndex]}</strong>
                  </div>
                )}

                <div className="game-feedback-actions">
                  {(isCorrect || isWrong || isTimeout) && (
                    <motion.button
                      className="game-next-btn"
                      onClick={isCorrect ? handleNext : handleRetry}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isCorrect
                        ? isLast
                          ? 'Reveal the Code!'
                          : 'Next Question →'
                        : 'Try Again'}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
