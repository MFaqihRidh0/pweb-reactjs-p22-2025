import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api/client'
import Alert from '../components/Alert'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('/auth/register', form)
      if (res.data?.success) {
        setSuccess('Registrasi berhasil! Silakan login untuk melanjutkan.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(res.data?.message ?? 'Registrasi gagal.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Terjadi kesalahan saat registrasi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2rem auto' }}>
      <h2>Daftar Akun</h2>
      {error && <Alert message={error} />}
      {success && (
        <div className="alert" style={{ background: '#17351e', color: '#9ef29e' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="col">
        <input
          className="input"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="button primary" disabled={loading}>
          {loading ? 'Mendaftarkan...' : 'Daftar'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Sudah punya akun? <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
