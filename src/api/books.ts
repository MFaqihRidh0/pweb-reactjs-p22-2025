import { api } from './client'
import type { Book } from '../types'

export async function fetchBooks(): Promise<Book[]> {
  const res = await api.get('/books')
  // backend: { success, message, data, meta }
  return Array.isArray(res.data?.data) ? (res.data.data as Book[]) : []
}

export async function fetchBook(id: string): Promise<Book | null> {
  const res = await api.get(`/books/${id}`)
  return res.data?.data ? (res.data.data as Book) : null
}

export async function createBook(payload: {
  title: string
  writer: string
  publisher: string
  description?: string
  publication_year: number
  price: number
  stock_quantity: number
  genre_id: string
}) {
  const res = await api.post('/books', payload)
  return res.data?.data as Book
}

export async function deleteBook(id: string) {
  const res = await api.delete(`/books/${id}`)
  return res.data as { message?: string }
}
