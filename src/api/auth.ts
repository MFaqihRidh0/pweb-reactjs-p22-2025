import { api } from './client'
import type { User } from '../types'

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password })
  // Di-backend diasumsikan mengembalikan { access_token, user? }
  return data as { access_token: string, user?: User }
}

export async function register(email: string, password: string, name?: string) {
  const { data } = await api.post('/auth/register', { email, password, name })
  return data as { message: string }
}

export async function me() {
  const { data } = await api.get('/auth/me')
  return data as User
}
