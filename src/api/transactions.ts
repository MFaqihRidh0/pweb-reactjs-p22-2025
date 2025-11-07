import { api } from './client'

// ✅ Buat transaksi baru
export async function createTransaction(payload: { items: { book_id: string; quantity: number }[] }) {
  const { data } = await api.post('/transactions', payload)
  // backend kirim: { success, message, data: {...} }
  return data?.data ?? null
}

// ✅ Ambil semua transaksi
export async function fetchTransactions() {
  const { data } = await api.get('/transactions')
  // backend kirim: { success, message, data: { data: [...], meta: {...} } }
  const list = data?.data?.data
  return Array.isArray(list) ? list : []
}

// ✅ Ambil detail transaksi berdasarkan ID
export async function fetchTransaction(id: string) {
  const { data } = await api.get(`/transactions/${id}`)
  // backend kirim: { success, message, data: {...} }
  return data?.data ?? null
}
