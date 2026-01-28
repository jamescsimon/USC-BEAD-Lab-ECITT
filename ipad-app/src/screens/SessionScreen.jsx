import { useState, useEffect } from 'react'
import { useStore } from '../store'
import NetworkService from '../services/NetworkService'
import GameScreen from './GameScreen'

export default function SessionScreen() {
  const [participantId, setParticipantId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useStore((state) => state.user)
  const currentSession = useStore((state) => state.currentSession)
  const setCurrentSession = useStore((state) => state.setCurrentSession)
  const setError = useStore((state) => state.setError)
  const error = useStore((state) => state.error)

  const handleCreateSession = async (e) => {
    e.preventDefault()
    if (!participantId) {
      setError('Please enter participant ID')
      return
    }

    setIsLoading(true)
    try {
      const session = await NetworkService.createSession(participantId, new Date().toISOString())
      NetworkService.joinSession(session.id)
      setCurrentSession(session)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  if (currentSession) {
    return <GameScreen />
  }

  return (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">New Session</h1>
        <p className="text-gray-600 mb-6">Logged in as: <strong>{user?.username}</strong></p>

        <form onSubmit={handleCreateSession} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participant ID
            </label>
            <input
              type="text"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder="e.g., ECITT_001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
          >
            {isLoading ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      </div>
    </div>
  )
}
