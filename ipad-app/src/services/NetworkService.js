import axios from 'axios'
import { io } from 'socket.io-client'

const API_URL = localStorage.getItem('apiUrl') || 'http://192.168.1.100:3000'

class NetworkService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
    })
    this.socket = null
  }

  setApiUrl(url) {
    this.api.defaults.baseURL = url
    localStorage.setItem('apiUrl', url)
  }

  setToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.api.defaults.headers.common['Authorization']
    }
  }

  // Auth endpoints
  async login(username, password) {
    const response = await this.api.post('/api/auth/login', { username, password })
    return response.data
  }

  async register(username, password) {
    const response = await this.api.post('/api/auth/register', { username, password })
    return response.data
  }

  async verifyToken() {
    const response = await this.api.get('/api/auth/verify')
    return response.data
  }

  // Session endpoints
  async createSession(participantId, sessionDate) {
    const response = await this.api.post('/api/sessions', {
      participantId,
      sessionDate,
    })
    return response.data
  }

  async getSession(sessionId) {
    const response = await this.api.get(`/api/sessions/${sessionId}`)
    return response.data
  }

  async updateSession(sessionId, status, syncTimestamp) {
    const response = await this.api.patch(`/api/sessions/${sessionId}`, {
      status,
      syncTimestamp,
    })
    return response.data
  }

  // Event endpoints
  async logEvent(sessionId, eventType, eventTime, responseValue, accuracy) {
    const response = await this.api.post('/api/events', {
      sessionId,
      eventType,
      eventTime,
      responseValue,
      accuracy,
    })
    return response.data
  }

  async getSessionEvents(sessionId) {
    const response = await this.api.get(`/api/events/session/${sessionId}`)
    return response.data
  }

  // Sync endpoints
  async createSyncMarker(sessionId, markerId, timestamp, source) {
    const response = await this.api.post('/api/sync', {
      sessionId,
      markerId,
      timestamp,
      source,
    })
    return response.data
  }

  async getSyncInfo(sessionId) {
    const response = await this.api.get(`/api/sync/info/${sessionId}`)
    return response.data
  }

  // WebSocket
  connectSocket(token) {
    this.socket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })
    return this.socket
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  joinSession(sessionId) {
    if (this.socket) {
      this.socket.emit('join_session', sessionId)
    }
  }

  leaveSession(sessionId) {
    if (this.socket) {
      this.socket.emit('leave_session', sessionId)
    }
  }

  sendEvent(sessionId, event) {
    if (this.socket) {
      this.socket.emit('event_logged', { sessionId, event })
    }
  }

  onEventReceived(callback) {
    if (this.socket) {
      this.socket.on('event_received', callback)
    }
  }

  onSyncReceived(callback) {
    if (this.socket) {
      this.socket.on('sync_received', callback)
    }
  }
}

export default new NetworkService()
