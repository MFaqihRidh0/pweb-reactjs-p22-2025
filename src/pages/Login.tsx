import { FormEvent, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Alert from '../components/Alert'
import { isEmailValid } from '../utils/validators'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation() as any
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!isEmailValid(email)) { setError('Email tidak valid'); return }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return }
    try {
      setLoading(true)
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name || undefined)
        await login(email, password)
      }
      const dest = loc.state?.from || '/books'
      nav(dest, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Gagal proses. Periksa API URL & kredensial.')
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{maxWidth: 440}}>
      <div className="card">
        <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
        <p style={{color:'#b7c2d6'}}>Gunakan akun API modul sebelumnya.</p>
        {error && <Alert message={error} />}
        <form onSubmit={onSubmit} className="col">
          {mode === 'register' && (
            <input className="input" placeholder="Nama (opsional)" value={name} onChange={e=>setName(e.target.value)} />
          )}
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="button primary" disabled={loading}>{loading ? 'Memproses...' : (mode==='login'?'Masuk':'Daftar')}</button>
        </form>
        <div style={{marginTop:'.8rem'}}>
          {mode==='login' ? (
            <span>Belum punya akun? <button className="button" onClick={()=>setMode('register')}>Register</button></span>
          ) : (
            <span>Sudah punya akun? <button className="button" onClick={()=>setMode('login')}>Login</button></span>
          )}
        </div>
      </div>
    </div>
  )
}
