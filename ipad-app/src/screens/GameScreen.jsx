import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import NetworkService from '../services/NetworkService'
import '../styles/GameScreen.css'

const GAMES = ['frog', 'butterfly', 'bubble', 'snowflake']
const SPRITE_IMAGES = {
  frog: ['/sprites/frog-01.png', '/sprites/frog-02.png', '/sprites/frog-03.png'],
  butterfly: Array.from({ length: 8 }, (_, i) => `/sprites/bfly-0${i + 1}.png`),
  bubble: ['/sprites/bubble-01.png', '/sprites/bubble-02.png'],
  snowflake: ['/sprites/snowflake-01.png', '/sprites/snowflake-02.png'],
}

export default function GameScreen() {
  const currentSession = useStore((state) => state.currentSession)
  const addEvent = useStore((state) => state.addEvent)
  const [gameType, setGameType] = useState('frog')
  const [gameKey, setGameKey] = useState(0)
  const [trialNumber, setTrialNumber] = useState(1)
  const [totalTrials] = useState(20)

  const handleSelectGame = (game) => {
    setGameType(game)
    setGameKey((k) => k + 1)
  }

  const handleTrialComplete = () => {
    if (trialNumber < totalTrials) {
      setTrialNumber((n) => n + 1)
      setGameKey((k) => k + 1)
    } else {
      alert('Session complete!')
    }
  }

  if (!currentSession) {
    return null
  }

  return (
    <div className="game-container">
      <div className="trial-header">
        <h2>Trial {trialNumber} of {totalTrials}</h2>
      </div>
      <GameArea
        key={gameKey}
        gameType={gameType}
        sessionId={currentSession.id}
        trialNumber={trialNumber}
        onEvent={addEvent}
        onTrialComplete={handleTrialComplete}
      />
      <div className="game-selector">
        {GAMES.map((game) => (
          <button
            key={game}
            onClick={() => handleSelectGame(game)}
            className={`game-btn ${gameType === game ? 'active' : ''}`}
          >
            {game.charAt(0).toUpperCase() + game.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

function GameArea({ gameType, sessionId, trialNumber, onEvent, onTrialComplete }) {
  const containerRef = useRef(null)
  const timersRef = useRef({})
  const gameStateRef = useRef({})
  const [sprites, setSprites] = useState([])
  const [phase, setPhase] = useState('ready') // ready, stimulus, feedback, reward
  const [trialData, setTrialData] = useState({
    rewardedButton: Math.random() > 0.5 ? 'left' : 'right',
    trialStartTime: Date.now(),
    firstTouchTime: null,
    responseButton: null,
    accuracy: null,
  })
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    initializeTrial()
    return () => finalizeGame()
  }, [gameType, trialNumber])

  const initializeTrial = () => {
    const newTrialData = {
      rewardedButton: Math.random() > 0.5 ? 'left' : 'right',
      trialStartTime: Date.now(),
      firstTouchTime: null,
      responseButton: null,
      accuracy: null,
    }
    setTrialData(newTrialData)
    setPhase('stimulus')
    gameStateRef.current = {}

    switch (gameType) {
      case 'frog':
        createFrogGame()
        break
      case 'butterfly':
        createButterflyGame()
        break
      case 'bubble':
        createBubbleGame()
        break
      case 'snowflake':
        createSnowflakeGame()
        break
    }
  }

  const finalizeGame = () => {
    clearAllTimers()
  }

  const setTimeout = (key, callback, delay) => {
    if (timersRef.current[key]) clearTimeout(timersRef.current[key])
    timersRef.current[key] = window.setTimeout(callback, delay)
  }

  const clearAllTimers = () => {
    Object.values(timersRef.current).forEach((timer) => clearTimeout(timer))
    timersRef.current = {}
  }

  const playSound = (soundType) => {
    console.log('Playing sound:', soundType)
  }

  const getRandomPosition = () => {
    const width = containerRef.current?.clientWidth || window.innerWidth
    const height = containerRef.current?.clientHeight || window.innerHeight
    return {
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
    }
  }

  const handleResponse = async (button) => {
    if (phase !== 'stimulus') return
    if (trialData.responseButton) return // Already responded

    const now = Date.now()
    const reactionTime = now - trialData.trialStartTime
    const isCorrect = button === trialData.rewardedButton

    const newTrialData = {
      ...trialData,
      firstTouchTime: now,
      responseButton: button,
      accuracy: isCorrect ? 1 : 0,
    }
    setTrialData(newTrialData)

    // Log event
    const event = {
      sessionId,
      eventType: 'trial_response',
      eventTime: now,
      trialNumber,
      gameType,
      responseButton: button,
      rewardedButton: trialData.rewardedButton,
      accuracy: isCorrect ? 1 : 0,
      reactionTime,
    }

    try {
      await NetworkService.logEvent(
        sessionId,
        'trial_response',
        now,
        `${gameType}_${button}`,
        isCorrect ? 'correct' : 'incorrect'
      )
      onEvent(event)
      NetworkService.sendEvent(sessionId, event)
    } catch (err) {
      console.error('Failed to log event:', err)
    }

    // Show feedback
    setFeedback(isCorrect ? '✓ Correct!' : '✗ Incorrect')
    setPhase('feedback')

    // Show reward animation if correct
    if (isCorrect) {
      setTimeout('rewardDelay', () => {
        setPhase('reward')
        setTimeout('nextTrialDelay', () => {
          onTrialComplete()
        }, 1500)
      }, 500)
    } else {
      setTimeout('nextTrialDelay', () => {
        onTrialComplete()
      }, 1500)
    }
  }

  const createFrogGame = () => {
    gameStateRef.current = {
      ready: false,
      posX: 50,
      posY: 50,
      angle: 0,
      frameIndex: 0,
    }

    setSprites([{ id: 'frog', x: 50, y: 50, angle: 0, frameIndex: 0 }])

    playSound('quack')
    setTimeout('centerTimer', () => {
      gameStateRef.current.posX = 50
      gameStateRef.current.posY = 50
    }, 100)

    setTimeout('readyTimer', () => {
      gameStateRef.current.ready = true
      gameStateRef.current.frameIndex = 0
      setSprites([{ id: 'frog', x: 50, y: 50, angle: 0, frameIndex: 0 }])
    }, 700)
  }

  const createButterflyGame = () => {
    gameStateRef.current = {
      ready: false,
      posX: 50,
      posY: 50,
      angle: 0,
      frameIndex: 0,
    }

    setSprites([{ id: 'butterfly', x: 50, y: 50, angle: 0, frameIndex: 0 }])
    playSound('chimes')

    setTimeout('readyTimer', () => {
      gameStateRef.current.ready = true
      setSprites([{ id: 'butterfly', x: 50, y: 50, angle: 0, frameIndex: 0 }])
    }, 700)
  }

  const createBubbleGame = () => {
    gameStateRef.current = {
      bubbles: [
        { id: 'bubble1', x: 50, y: 25, angle: 0 },
        { id: 'bubble2', x: 50, y: 75, angle: 0 },
      ],
    }

    setSprites(gameStateRef.current.bubbles)
  }

  const createSnowflakeGame = () => {
    gameStateRef.current = {
      snowflakes: [
        { id: 'snowflake1', x: 50, y: 25, angle: 0 },
        { id: 'snowflake2', x: 50, y: 75, angle: 0 },
      ],
    }

    setSprites(gameStateRef.current.snowflakes)
  }

  return (
    <div className="game-area-wrapper">
      <div
        ref={containerRef}
        className="game-area"
      >
        {phase === 'stimulus' && (
          <>
            {sprites.map((sprite) => (
              <Sprite key={sprite.id} sprite={sprite} gameType={gameType} />
            ))}
          </>
        )}

        {phase === 'feedback' && (
          <div className="feedback-message">{feedback}</div>
        )}

        {phase === 'reward' && (
          <div className="reward-animation">
            <div className="reward-icon">🎉</div>
            <p>Great job!</p>
          </div>
        )}
      </div>

      <div className="response-buttons">
        <button
          onClick={() => handleResponse('left')}
          disabled={phase !== 'stimulus'}
          className="resp-btn left-btn"
        >
          LEFT
        </button>
        <button
          onClick={() => handleResponse('right')}
          disabled={phase !== 'stimulus'}
          className="resp-btn right-btn"
        >
          RIGHT
        </button>
      </div>
    </div>
  )
}

function Sprite({ sprite, gameType }) {
  const images = SPRITE_IMAGES[gameType] || []
  const imageUrl = images[sprite.frameIndex] || images[0]

  return (
    <div
      className="sprite"
      style={{
        left: `${sprite.x}%`,
        top: `${sprite.y}%`,
        transform: `rotate(${sprite.angle}deg)`,
      }}
    >
      <img src={imageUrl} alt={gameType} />
    </div>
  )
}
