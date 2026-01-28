import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://192.168.1.100:3000'; // Change to your laptop IP

class NetworkService {
  constructor() {
    this.api = axios.create({ baseURL: API_URL, timeout: 10000 });
    this.socket = null;
  }

  async login(username, password) {
    const response = await this.api.post('/api/auth/login', { username, password });
    return response.data;
  }

  connectSocket(token) {
    this.socket = io(API_URL, {
      auth: { token },
      reconnection: true,
    });
    return this.socket;
  }

  async createSession(participantId) {
    const response = await this.api.post('/api/sessions', { participant_id: participantId });
    return response.data;
  }

  async logEvent(sessionId, eventType, eventTime, responseValue) {
    const response = await this.api.post('/api/events', {
      session_id: sessionId,
      event_type: eventType,
      event_time: eventTime,
      response_value: responseValue,
    });
    return response.data;
  }

  async getSessionStatus(sessionId) {
    const response = await this.api.get(`/api/sessions/${sessionId}`);
    return response.data;
  }
}

export default new NetworkService();
