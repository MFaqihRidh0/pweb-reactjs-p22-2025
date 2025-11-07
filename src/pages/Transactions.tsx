import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTransactions } from '../api/transactions'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'
import Pagination from '../components/Pagination'

interface TransactionRow {
  id: string
  amount: number
  price: number
  created_at?: string
}

export default function Transactions() {
  const [list, setList] = useState<TransactionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchId, setSearchId] = useState('')
  const [sortBy, setSortBy] = useState<'id' | 'amount' | 'price'>('id')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const perPage = 10

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchTransactions()
      console.log('✅ fetched transactions:', data)
      setList(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal memuat transaksi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    let data = list.filter(t => !searchId || t.id.includes(searchId))
    data.sort((a: any, b: any) => {
      const key = sortBy
      const va = a[key] ?? 0
      const vb = b[key] ?? 0
      if (va < vb) return order === 'asc' ? -1 : 1
      if (va > vb) return order === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [list, searchId, sortBy, order])

  const total = filtered.length
  const start = (page - 1) * perPage
  const pageData = filtered.slice(start, start + perPage)

  if (loading) return <Spinner />
  if (error) return <Alert message={error} />
  if (list.length === 0)
    return <EmptyState title="Belum ada transaksi" subtitle="Belum ada data transaksi yang tercatat." />

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>Riwayat Transaksi</h2>
        <div className="row">
          <input
            className="input"
            placeholder="Cari ID"
            value={searchId}
            onChange={e => { setPage(1); setSearchId(e.target.value) }}
          />
          <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="id">Urut ID</option>
            <option value="amount">Urut Jumlah Item</option>
            <option value="price">Urut Total Harga</option>
          </select>
          <select className="select" value={order} onChange={e => setOrder(e.target.value as any)}>
            <option value="asc">Naik</option>
            <option value="desc">Turun</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Jumlah Item</th>
            <th>Total Harga</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.amount ?? 0}</td>
              <td>Rp {(t.price ?? 0).toLocaleString('id-ID')}</td>
              <td>{t.created_at ? new Date(t.created_at).toLocaleString('id-ID') : '-'}</td>
              <td>
                <Link className="button" to={`/transactions/${t.id}`}>Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} total={total} perPage={perPage} onPage={setPage} />
    </div>
  )
}
