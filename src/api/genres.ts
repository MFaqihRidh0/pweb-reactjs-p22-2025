import { api } from './client'
import type { Genre } from '../types'

export async function fetchGenres(): Promise<Genre[]> {
  try {
    const res = await api.get('/genres')
    // backend returns { success, message, data, meta }
    return Array.isArray(res.data?.data) ? (res.data.data as Genre[]) : []
  } catch (err) {
    console.error('fetchGenres error', err)
    return []
  }
}
