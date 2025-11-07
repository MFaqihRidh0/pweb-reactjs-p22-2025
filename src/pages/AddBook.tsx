import { FormEvent, useEffect, useState } from 'react'
import { createBook } from '../api/books'
import { fetchGenres } from '../api/genres'
import { Genre } from '../types'
import Alert from '../components/Alert'

export default function AddBook() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // form state (strings for inputs so we control numeric parsing)
  const [title, setTitle] = useState('')
  const [writer, setWriter] = useState('')
  const [publisher, setPublisher] = useState('')
  const [price, setPrice] = useState('')           // string to validate digits
  const [stock, setStock] = useState('')
  const [genreId, setGenreId] = useState('')
  const [description, setDescription] = useState('')
  const [publicationYear, setPublicationYear] = useState('')
  const [condition, setCondition] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    // fetchGenres returns Genre[] (see api/genres.ts)
    fetchGenres().then(setGenres).catch(() => setGenres([]))
  }, [])

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) {
    const val = e.target.value
    // allow empty or only digits
    if (/^\d*$/.test(val)) setter(val)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    // basic required validation
    if (!title.trim() || !writer.trim() || !publisher.trim() || !price || !stock || !publicationYear || !genreId) {
      setError('Judul, Penulis, Penerbit, Harga, Stok, Tahun Terbit, dan Genre wajib diisi.')
      return
    }

    // prepare payload matching backend schema
    const payload = {
      title: title.trim(),
      writer: writer.trim(),
      publisher: publisher.trim(),
      description: description.trim() || undefined,
      publication_year: Number(publicationYear),
      price: Number(price),
      stock_quantity: Number(stock),
      genre_id: genreId,
      // optional extras (if backend supports them, otherwise undefined)
      condition: condition || undefined,
      image_url: imageUrl || undefined
    }

    try {
      setLoading(true)
      await createBook(payload)
      alert('Buku berhasil ditambahkan ✅')
      // reset form
      setTitle(''); setWriter(''); setPublisher(''); setPrice(''); setStock(''); setGenreId('')
      setDescription(''); setPublicationYear(''); setCondition(''); setImageUrl('')
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal menambah buku')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Tambah Buku</h2>
      {error && <Alert message={error} />}
      <form onSubmit={onSubmit} className="grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        <input className="input" placeholder="Judul *" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="input" placeholder="Penulis *" value={writer} onChange={e => setWriter(e.target.value)} />
        <input className="input" placeholder="Penerbit *" value={publisher} onChange={e => setPublisher(e.target.value)} />
        <input className="input" placeholder="Harga *" value={price} onChange={e => handleNumberInput(e, setPrice)} />
        <input className="input" placeholder="Stok *" value={stock} onChange={e => handleNumberInput(e, setStock)} />
        <select className="select" value={genreId} onChange={e => setGenreId(e.target.value)}>
          <option value="">Pilih Genre...</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input className="input" placeholder="Tahun Terbit *" value={publicationYear} onChange={e => handleNumberInput(e, setPublicationYear)} />
        <select className="select" value={condition} onChange={e => setCondition(e.target.value)}>
          <option value="">Kondisi (opsional)</option>
          <option value="NEW">Baru</option>
          <option value="USED">Bekas</option>
          <option value="REFURBISHED">Refurbished</option>
        </select>
        <input className="input" placeholder="URL Gambar (opsional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <textarea className="input" placeholder="Deskripsi (opsional)" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
        <div className="row" style={{ gridColumn: '1/-1', justifyContent: 'flex-end' }}>
          <button className="button primary" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
      </form>
    </div>
  )
}
