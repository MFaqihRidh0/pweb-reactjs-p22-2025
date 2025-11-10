import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { clearToken, getToken, setToken } from '../utils/storage'
import { login as loginApi, register as registerApi, me as meApi } from '../api/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setTok] = useState<string | null>(getToken())
  const [loading, setLoading] = useState<boolean>(true)

  // ambil user saat ada token
  useEffect(() => {
    const t = getToken()
    if (!t) {
      setLoading(false)
      return
    }
    meApi()
      .then((u) => setUser(u))
      .catch(() => {
        clearToken()
        setTok(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // 🔹 login: dapatkan token → simpan → ambil data user dari /me
  async function login(email: string, password: string) {
    const res = await loginApi(email, password)
    const accessToken = res?.access_token
    if (!accessToken) throw new Error('Access token tidak ditemukan.')

    setToken(accessToken)
    setTok(accessToken)

    try {
      const u = await meApi()
      setUser(u)
    } catch (err) {
      console.error('Gagal ambil data user:', err)
    }
  }

  // 🔹 register: hanya daftar tanpa auto-login
  async function register(email: string, password: string, username?: string) {
    await registerApi(email, password, username)
    alert('Registrasi berhasil! Silakan login menggunakan akun Anda.')
    // redirect manual ke login
    window.location.href = '/login'
  }

  // 🔹 logout: hapus token & reset state
  function logout() {
    clearToken()
    setTok(null)
    setUser(null)
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
