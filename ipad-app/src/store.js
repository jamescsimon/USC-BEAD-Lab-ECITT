import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth state
  user: null,
  token: null,
  isAuthenticated: false,
  
  setUser: (user, token) => set({ user, token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  
  // Session state
  currentSession: null,
  sessions: [],
  
  setCurrentSession: (session) => set({ currentSession: session }),
  setSessions: (sessions) => set({ sessions }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
  
  // Event state
  events: [],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  setEvents: (events) => set({ events }),
  
  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
