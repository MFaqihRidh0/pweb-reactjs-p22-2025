import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBooks, deleteBook } from '../api/books'
import { Book, Condition } from '../types'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'
import ConfirmDialog from '../components/ConfirmDialog'
import { useCart } from '../context/CartContext'
import EditBookDialog from '../components/EditBookDialog'

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [condition, setCondition] = useState<Condition>('')
  const [sortBy, setSortBy] = useState<'title' | 'publication_year'>('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const perPage = 9
  const { add } = useCart()

  async function load() {
    setLoading(true)
    setError('')
    try {
      const arr = await fetchBooks()
      setBooks(arr)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal memuat data buku. Periksa API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const list = Array.isArray(books) ? books : []

    let data = list.filter(b => {
      const s = (search || '').toLowerCase()
      const genreText = typeof b.genre === 'string'
        ? b.genre
        : (b.genre && (b as any).genre.name) ? (b as any).genre.name : ''

      const matchesSearch =
        !s ||
        [b.title, b.writer, b.publisher, genreText]
          .some(x => (x || '').toString().toLowerCase().includes(s))

      const matchesCond = !condition || (b.condition ?? '') === condition
      return matchesSearch && matchesCond
    })

    data.sort((a: any, b: any) => {
      const key = sortBy === 'title' ? 'title' : 'publication_year'
      const va = (a[key] ?? '').toString().toLowerCase()
      const vb = (b[key] ?? '').toString().toLowerCase()
      if (va < vb) return order === 'asc' ? -1 : 1
      if (va > vb) return order === 'asc' ? 1 : -1
      return 0
    })

    return data
  }, [books, search, condition, sortBy, order])

  const total = filtered.length
  const start = (page - 1) * perPage
  const pageData = filtered.slice(start, start + perPage)

  if (loading) return <Spinner />
  if (error) return <Alert message={error} />
  if (!Array.isArray(books) || books.length === 0)
    return <EmptyState title="Belum ada buku" subtitle="Tambah buku terlebih dahulu." />

  async function onDelete(id: string) {
    try {
      await deleteBook(id)
      load()
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Gagal menghapus buku')
    }
  }

  return (
    <div className="col">
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <h2>Daftar Buku</h2>
          <div className="row">
            <input
              className="input"
              placeholder="Cari judul/penulis/genre"
              value={search}
              onChange={e => { setPage(1); setSearch(e.target.value) }}
            />
            <select className="select" value={condition} onChange={e => { setPage(1); setCondition(e.target.value as any) }}>
              <option value="">Semua Kondisi</option>
              <option value="NEW">Baru</option>
              <option value="USED">Bekas</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
            <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="title">Urut Judul</option>
              <option value="publication_year">Urut Tahun Terbit</option>
            </select>
            <select className="select" value={order} onChange={e => setOrder(e.target.value as any)}>
              <option value="asc">Naik</option>
              <option value="desc">Turun</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid">
        {pageData.map(b => {
          const genreText = typeof b.genre === 'string'
            ? b.genre
            : (b.genre && (b as any).genre.name) ? (b as any).genre.name : ''

          const stock = (typeof b.stock_quantity === 'number' ? b.stock_quantity : (typeof (b as any).stock === 'number' ? (b as any).stock : 0))

          return (
            <div className="card" key={b.id}>
              <div className="col">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0 }}>{b.title}</h3>
                  <span className="badge">{genreText || 'No Genre'}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <small className="badge">{b.writer}</small>
                  <small className="badge">Rp {Number(b.price ?? 0).toLocaleString('id-ID')}</small>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <small className="badge">Stok: {stock}</small>
                  <small className="badge">{b.condition || 'N/A'}</small>
                </div>

                <div className="row" style={{ marginTop: '.5rem' }}>
                  <Link className="button" to={`/books/${b.id}`}>Detail</Link>

                  <button
                    className="button success"
                    onClick={() => {
                      if (stock <= 0) {
                        alert('Stok habis, tidak bisa ditambahkan ke keranjang!')
                        return
                      }
                      add(b)
                    }}
                  >
                    Tambah ke Keranjang
                  </button>

                  <EditBookDialog book={b} onUpdated={load} />

                  <ConfirmDialog ask={`Hapus buku "${b.title}"?`} onYes={() => onDelete(b.id)} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Pagination page={page} total={total} perPage={perPage} onPage={setPage} />
    </div>
  )
}
