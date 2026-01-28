import { useEffect } from 'react'
import { useStore } from './store'
import NetworkService from './services/NetworkService'
import LoginScreen from './screens/LoginScreen'
import SessionScreen from './screens/SessionScreen'

export default function App() {
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token) {
      NetworkService.setToken(token)
      NetworkService.verifyToken()
        .then((data) => {
          setUser(data.user, token)
          NetworkService.connectSocket(token)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
    }
  }, [setUser])

  return (
    <div className="w-full h-full">
      {isAuthenticated ? <SessionScreen /> : <LoginScreen />}
    </div>
  )
}
