import { useState } from 'react'
import { useStore } from '../store'
import NetworkService from '../services/NetworkService'

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [apiUrl, setApiUrl] = useState(localStorage.getItem('apiUrl') || 'http://192.168.1.100:3000')
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useStore((state) => state.setUser)
  const setError = useStore((state) => state.setError)
  const error = useStore((state) => state.error)

  const handleApiUrlChange = (e) => {
    const url = e.target.value
    setApiUrl(url)
    NetworkService.setApiUrl(url)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    setIsLoading(true)
    try {
      const data = await NetworkService.login(username, password)
      NetworkService.setToken(data.token)
      NetworkService.connectSocket(data.token)
      setUser(data, data.token)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    setIsLoading(true)
    try {
      const data = await NetworkService.register(username, password)
      NetworkService.setToken(data.token)
      NetworkService.connectSocket(data.token)
      setUser(data, data.token)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">ECITT</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Server URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={handleApiUrlChange}
              placeholder="http://192.168.x.x:3000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition"
          >
            {isLoading ? 'Registering...' : 'Register New User'}
          </button>
        </form>
      </div>
    </div>
  )
}
