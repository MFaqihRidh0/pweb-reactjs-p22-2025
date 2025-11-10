import { useState } from 'react'
import { updateBook } from '../api/books'
import { Book } from '../types'

interface EditBookDialogProps {
    book: Book
    onUpdated: () => void
    }

export default function EditBookDialog({ book, onUpdated }: EditBookDialogProps) {
    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState(book.description ?? '')
    const [price, setPrice] = useState(book.price ?? 0)
    const [stock, setStock] = useState(book.stock_quantity ?? book.stock ?? 0)
    const [loading, setLoading] = useState(false)

    async function handleSave() {
        setLoading(true)
        try {
        await updateBook(book.id, {
            description,
            price,
            stock_quantity: stock,
        })
        alert('✅ Buku berhasil diperbarui!')
        setOpen(false)
        onUpdated()
        } catch (err: any) {
        alert(err?.response?.data?.message ?? 'Gagal memperbarui buku.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <>
        <button className="button warning" onClick={() => setOpen(true)}>Edit</button>

        {open && (
            <div className="modal">
            <div className="modal-content card">
                <h3>Edit Buku: {book.title}</h3>
                <label>Deskripsi:</label>
                <textarea
                className="input"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />

                <label>Harga:</label>
                <input
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                />

                <label>Stok:</label>
                <input
                type="number"
                className="input"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                />

                <div className="row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="button" onClick={() => setOpen(false)} disabled={loading}>Batal</button>
                <button className="button success" onClick={handleSave} disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    )
    }
