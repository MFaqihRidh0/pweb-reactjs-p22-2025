import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { clearToken, getToken, setToken } from '../utils/storage'
import { login as loginApi, register as registerApi, me as meApi } from '../api/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTok] = useState<string | null>(getToken())
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const t = getToken()
    if (!t) {
      setLoading(false)
      return
    }
    meApi().then((u) => setUser(u)).catch(() => {
      clearToken(); setTok(null)
    }).finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const res = await loginApi(email, password)
    setToken(res.access_token)
    setTok(res.access_token)
    try {
      const u = res.user ?? await meApi()
      setUser(u)
    } catch {}
  }

  async function register(email: string, password: string, name?: string) {
    await registerApi(email, password, name)
  }

  function logout() {
    clearToken()
    setTok(null)
    setUser(null)
    // soft redirect
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
