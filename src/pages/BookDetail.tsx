import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'

interface BookDetail {
  id: string
  title: string
  writer: string
  publisher?: string
  price: number
  stock_quantity: number
  genre?: string | null // ← ubah ini
  publication_year?: number
  description?: string
}

export default function BookDetail() {
  const { id } = useParams()
  const [book, setBook] = useState<BookDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    api
      .get(`/books/${id}`)
      .then((res) => {
        console.log('📘 Book detail:', res.data)
        setBook(res.data?.data ?? res.data)
      })
      .catch((err) => {
        setError(err?.response?.data?.message ?? 'Gagal memuat detail buku.')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (error) return <Alert message={error} />
  if (!book) return <EmptyState title="Buku tidak ditemukan" />

  return (
    <div className="card">
      <h2>{book.title}</h2>
      <div style={{ marginTop: '1rem', lineHeight: 1.8 }}>
        <p><strong>Penulis:</strong> {book.writer}</p>
        <p><strong>Penerbit:</strong> {book.publisher ?? '-'}</p>
        <p><strong>Harga:</strong> Rp {book.price.toLocaleString('id-ID')}</p>
        <p><strong>Stok:</strong> {book.stock_quantity}</p>
        <p><strong>Genre:</strong> {book.genre ?? '-'}</p> {/* ← fix utama */}
        <p><strong>Tahun Terbit:</strong> {book.publication_year ?? '-'}</p>
        <p><strong>Deskripsi:</strong> {book.description ?? 'Tidak ada deskripsi.'}</p>
      </div>
    </div>
  )
}
