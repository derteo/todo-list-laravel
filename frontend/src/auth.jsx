import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler } from './api'

const TOKEN_KEY = 'sanctum_token'
const NAME_KEY = 'user_name'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '')

  const save = useCallback((data) => {
    const userName = data.user?.name || ''
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(NAME_KEY, userName)
    setToken(data.token)
    setName(userName)
  }, [])

  const clear = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(NAME_KEY)
    setToken(null)
    setName('')
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clear)
  }, [clear])

  const value = useMemo(
    () => ({
      token,
      name,
      async login(email, password) {
        save(await api('/login', { method: 'POST', body: { email, password }, auth: false }))
      },
      async register(payload) {
        save(await api('/register', { method: 'POST', body: payload, auth: false }))
      },
      async logout() {
        try {
          await api('/logout', { method: 'POST' })
        } catch {
          /* il token viene comunque rimosso */
        } finally {
          clear()
        }
      },
    }),
    [token, name, save, clear],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
