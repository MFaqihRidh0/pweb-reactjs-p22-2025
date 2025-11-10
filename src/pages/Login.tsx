import { FormEvent, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'
import { isEmailValid } from '../utils/validators'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation() as any
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!isEmailValid(email)) {
      setError('Email tidak valid')
      return
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      const dest = loc.state?.from || '/books'
      nav(dest, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal login. Periksa kredensial.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 440 }}>
      <div className="card">
        <h2>Login</h2>
        <p style={{ color: '#b7c2d6' }}>Masuk ke akun IT Literature Shop.</p>
        {error && <Alert message={error} />}
        <form onSubmit={onSubmit} className="col">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="button primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ marginTop: '.8rem', textAlign: 'center' }}>
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </div>
  )
}
