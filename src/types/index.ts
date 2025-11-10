export type Condition = 'NEW' | 'USED' | 'REFURBISHED' | ''

// ================= USER =================
export interface User {
  id: string
  email: string
  username?: string   // ✅ tambahkan ini
  name?: string
}

// ================= GENRE =================
export interface Genre {
  id?: string
  name: string
}

// ================= BOOK =================
export interface Book {
  id: string
  title: string
  writer: string
  publisher?: string
  price: number
  stock_quantity?: number       // sesuai field backend
  stock?: number                // kompatibilitas lama frontend
  genre?: Genre | null          // backend kirim { name }
  genre_id?: string
  isbn?: string                 // opsional
  description?: string
  publication_year?: number
  condition?: Condition
  image_url?: string | null
  publish_date?: string
  created_at?: string
  updated_at?: string
}

// ================= TRANSACTION =================
export interface TransactionItem {
  book_id: string
  title?: string
  price: number
  quantity: number
}

export interface Transaction {
  id: string
  total_quantity: number
  total_price: number
  created_at?: string
  items?: TransactionItem[]
}
