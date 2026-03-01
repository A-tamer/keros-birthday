import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions, finishSentenceQuestions, feenQuestions, TIMER_SECONDS } from '../../content/quiz'
import { playSound, startTickSound, stopTickSound } from '../../lib/sounds'
import { fireBurst } from '../../lib/confetti'
import ProgressMap from './ProgressMap'
import './GameStage.css'

const LETTERS = ['A', 'B', 'C', 'D']

const whoSaidRounds = quizQuestions.map((q) => ({ ...q, type: 'who-said' }))
const finishRounds = finishSentenceQuestions.map((q) => ({ ...q, type: 'finish-sentence' }))
const feenRounds = feenQuestions.map((q) => ({ ...q, type: 'feen' }))
const allRounds = [...whoSaidRounds, ...finishRounds, ...feenRounds]

function normalizeAnswer(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function GameStage({ onWin }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timerActive, setTimerActive] = useState(true)
  const [textAnswer, setTextAnswer] = useState('')
  const [finishCorrect, setFinishCorrect] = useState(null)
  const timerRef = useRef(null)
  const question = allRounds[index]
  const isWhoSaid = question.type === 'who-said'
  const isFeen = question.type === 'feen'
  const isLast = index === allRounds.length - 1

  useEffect(() => {
    setSelected(null)
    setRevealed(false)
    setTextAnswer('')
    setFinishCorrect(null)
    setTimeLeft(TIMER_SECONDS)
    setTimerActive(true)
  }, [index])

  useEffect(() => {
    if (!isWhoSaid || !timerActive || timeLeft <= 0) return
    if (timeLeft <= 5) startTickSound()

    timerRef.current = setTimeout(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearTimeout(timerRef.current)
  }, [isWhoSaid, timeLeft, timerActive])

  useEffect(() => {
    if (isWhoSaid && timeLeft <= 0 && timerActive) {
      stopTickSound()
      setTimerActive(false)
      setRevealed(true)
      playSound('wrong')
    }
  }, [isWhoSaid, timeLeft, timerActive])

  const isOptionCorrect = useCallback((i) => (
    question.correctIndices ? question.correctIndices.includes(i) : i === question.correctIndex
  ), [question])

  const handleSelect = useCallback((optIdx) => {
    if (!isWhoSaid || selected !== null || revealed) return
    const correct = isOptionCorrect(optIdx)
    playSound(correct ? 'correct' : 'wrong')
    setSelected(optIdx)
    setTimerActive(false)
    stopTickSound()

    setTimeout(() => {
      setRevealed(true)
      if (correct) fireBurst(40)
    }, 1500)
  }, [isWhoSaid, selected, revealed, question, isOptionCorrect])

  const handleFinishSubmit = useCallback(() => {
    if (question.type !== 'finish-sentence' || revealed) return
    const normalized = normalizeAnswer(textAnswer)
    const correct = question.correctAnswers.some((a) => normalizeAnswer(a) === normalized)
    setFinishCorrect(correct)
    setRevealed(true)
  }, [question, textAnswer, revealed])

  const handleNext = () => {
    if (isLast) {
      playSound('revealCode')
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

  const isCorrect = isWhoSaid && revealed && selected !== null && isOptionCorrect(selected)
  const isWrong = isWhoSaid && revealed && selected !== null && !isOptionCorrect(selected)
  const isTimeout = isWhoSaid && revealed && selected === null

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft <= 5 ? 'var(--accent-red)' : timeLeft <= 10 ? 'var(--accent-orange)' : 'var(--accent-blue-light)'

  return (
    <div className="game-stage">
      <ProgressMap total={allRounds.length} current={index} />

      {/* Timer – only for Who said */}
      {isWhoSaid && (
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
      )}

      {/* Question number */}
      <div className="game-question-num">
        Question {index + 1} of {allRounds.length}
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
          <h2 className="game-section-title">
            {isWhoSaid ? 'Who said' : isFeen ? 'feeeeeeen?' : 'Finish the sentence'}
          </h2>
          {!isFeen && (
          <div className="game-question-box">
            <p className="game-question-text">{question.question}</p>
          </div>
          )}

          {isWhoSaid ? (
          <>
          {/* Options */}
          <div className="game-options">
            {question.options.map((opt, i) => {
              let cls = 'game-option'
              if (selected === i && !revealed) cls += ' game-option--selected'
              if (revealed && isOptionCorrect(i)) cls += ' game-option--correct'
              if (revealed && selected === i && !isOptionCorrect(i)) cls += ' game-option--wrong'

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
          </>
          ) : isFeen ? (
          /* Feen – blurred image, Reveal replaces it with answer image (fade) */
          <div className="game-feen-wrap">
            <div className={`game-feen-image-wrap game-feen-image-slot ${revealed ? 'game-feen-revealed' : ''}`}>
              <motion.img
                key="question"
                src={question.questionImage}
                alt="Where?"
                className="game-feen-image game-feen-image-blur"
                initial={false}
                animate={{ opacity: revealed ? 0 : 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              <motion.img
                key="answer"
                src={question.answerImage}
                alt="Answer"
                className="game-feen-image game-feen-image-clear"
                initial={false}
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>
            {!revealed ? (
              <motion.button
                type="button"
                className="game-feen-reveal-btn"
                onClick={() => setRevealed(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Reveal
              </motion.button>
            ) : (
              <motion.button
                className="game-next-btn"
                onClick={handleNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isLast ? 'Reveal the Code!' : 'Next Question →'}
              </motion.button>
            )}
          </div>
          ) : (
          /* Finish the sentence – free text, no sounds */
          <div className="game-finish-wrap">
            <input
              type="text"
              className="game-finish-input"
              placeholder="Type your answer…"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFinishSubmit()}
              disabled={revealed}
              autoComplete="off"
            />
            <motion.button
              type="button"
              className="game-finish-submit"
              onClick={handleFinishSubmit}
              disabled={revealed || !textAnswer.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit
            </motion.button>
          </div>
          )}

          {/* Feedback – not used for feen (answer + Next are in feen block) */}
          <AnimatePresence>
            {revealed && !isFeen && (
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
                    Wrong answer! The correct answer was <strong>{question.correctIndices ? question.correctIndices.map(idx => LETTERS[idx]).join(' or ') : LETTERS[question.correctIndex]}</strong>
                  </div>
                )}
                {isTimeout && (
                  <div className="game-feedback-wrong">
                    Time's up! The correct answer was <strong>{question.correctIndices ? question.correctIndices.map(idx => LETTERS[idx]).join(' or ') : LETTERS[question.correctIndex]}</strong>
                  </div>
                )}
                {!isWhoSaid && finishCorrect !== null && (
                  <div className="game-feedback-correct game-feedback-answer-only">
                    {question.correctAnswers[0]}
                  </div>
                )}

                <div className="game-feedback-actions">
                  {(isCorrect || isWrong || isTimeout || (!isWhoSaid && finishCorrect !== null)) && (
                    <motion.button
                      className="game-next-btn"
                      onClick={!isWhoSaid ? handleNext : (isWrong || isTimeout) ? handleRetry : handleNext}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {!isWhoSaid
                        ? (isLast ? 'Reveal the Code!' : 'Next Question →')
                        : (isCorrect ? (isLast ? 'Reveal the Code!' : 'Next Question →') : 'Try Again')}
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
