import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTransaction } from '../api/transactions'
import Spinner from '../components/Spinner'
import Alert from '../components/Alert'
import EmptyState from '../components/EmptyState'

interface TransactionItem {
  book_id: string
  title: string
  price: number
  quantity: number
  subtotal: number
}

interface TransactionDetailData {
  id: string
  items: TransactionItem[]
  total_price: number
  created_at?: string
}

export default function TransactionDetail() {
  const { id } = useParams()
  const [data, setData] = useState<TransactionDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    fetchTransaction(id)
      .then(setData)
      .catch((err) => {
        setError(err?.response?.data?.message ?? 'Gagal memuat detail transaksi.')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (error) return <Alert message={error} />
  if (!data) return <EmptyState title="Transaksi tidak ditemukan" />

  return (
    <div className="card">
      <h2>Detail Transaksi #{data.id}</h2>
      <div className="badge">Tanggal: {data.created_at ? new Date(data.created_at).toLocaleString('id-ID') : '-'}</div>

      <table className="table" style={{ marginTop: '.8rem' }}>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Harga</th>
            <th>Qty</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((it, idx) => (
            <tr key={idx}>
              <td>{it.title ?? '-'}</td>
              <td>Rp {it.price.toLocaleString('id-ID')}</td>
              <td>{it.quantity}</td>
              <td>Rp {it.subtotal.toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row" style={{ justifyContent: 'flex-end', marginTop: '.5rem' }}>
        <strong>Total: Rp {data.total_price.toLocaleString('id-ID')}</strong>
      </div>
    </div>
  )
}
