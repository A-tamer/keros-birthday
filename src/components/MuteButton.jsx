import { useState } from 'react'
import { toggleMute, isMuted } from '../lib/sounds'
import './MuteButton.css'

export default function MuteButton() {
  const [muted, setMuted] = useState(isMuted())

  const handleToggle = () => {
    const newState = toggleMute()
    setMuted(newState)
  }

  return (
    <button
      className="mute-btn"
      onClick={handleToggle}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
