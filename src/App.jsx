import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TitleScreen from './components/TitleScreen/TitleScreen'
import GameStage from './components/GameStage/GameStage'
import WinScreen from './components/WinScreen/WinScreen'
import MuteButton from './components/MuteButton'
import Confetti from './components/Confetti/Confetti'
import Footer from './components/Footer/Footer'
import { preloadSounds } from './lib/sounds'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('title')
  const [won, setWon] = useState(false)

  const handleStart = useCallback(() => {
    preloadSounds()
    setScreen('game')
  }, [])

  const handleWin = useCallback(() => {
    setWon(true)
    setScreen('win')
  }, [])

  return (
    <div className="app">
      <MuteButton />
      <Confetti active={won} />

      <AnimatePresence mode="wait">
        {screen === 'title' && (
          <motion.div
            key="title"
            className="app-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <TitleScreen onStart={handleStart} />
          </motion.div>
        )}

        {screen === 'game' && (
          <motion.div
            key="game"
            className="app-screen"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GameStage onWin={handleWin} />
          </motion.div>
        )}

        {screen === 'win' && (
          <motion.div
            key="win"
            className="app-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <WinScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
