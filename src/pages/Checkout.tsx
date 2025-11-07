import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createTransaction } from '../api/transactions'
import Alert from '../components/Alert'

export default function Checkout() {
  const { items, setQty, remove, clear, totalItems, totalPrice } = useCart()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canCheckout = items.length > 0

  async function onCheckout() {
    setError('')
    try {
      setLoading(true)
      const payload = { items: items.map(it => ({ book_id: it.book.id, quantity: it.quantity })) }
      await createTransaction(payload)
      alert('Transaksi berhasil dibuat')
      clear()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal membuat transaksi. Pastikan endpoint /transactions tersedia.')
    } finally { setLoading(false) }
  }

  return (
    <div className="card">
      <h2>Keranjang</h2>
      {error && <Alert message={error} />}
      {items.length === 0 ? (
        <div className="empty">Keranjang kosong.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Harga</th>
              <th>Qty</th>
              <th>Subtotal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.book.id}>
                <td>{it.book.title}</td>
                <td>Rp {it.book.price.toLocaleString('id-ID')}</td>
                <td>
                  <input className="input" type="number" min={1} value={it.quantity}
                    onChange={e=>setQty(it.book.id, Number(e.target.value))}
                    style={{width:90}} />
                </td>
                <td>Rp {(it.book.price * it.quantity).toLocaleString('id-ID')}</td>
                <td><button className="button danger" onClick={()=>remove(it.book.id)}>Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="row" style={{justifyContent:'space-between', marginTop:'.8rem'}}>
        <div className="badge">Total Item: {totalItems}</div>
        <div className="badge">Total Harga: Rp {totalPrice.toLocaleString('id-ID')}</div>
      </div>
      <div className="row" style={{justifyContent:'flex-end', marginTop:'.8rem'}}>
        <button className="button success" disabled={!canCheckout || loading} onClick={onCheckout}>
          {loading ? 'Memproses...' : 'Checkout'}
        </button>
      </div>
    </div>
  )
}
