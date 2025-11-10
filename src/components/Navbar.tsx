import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'

export default function Navbar() {
  const { user, token, logout } = useAuth()
  const { totalItems } = useCart()
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    console.log('👤 Current user:', user)
  }, [user])

  const onLogout = () => {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Left side: brand + nav links */}
        <div className="row">
          <span className="brand">
            <Link to={token ? '/books' : '/login'}>IT Literature Shop</Link>
          </span>

          {token && (
            <div className="nav-links">
              <Link
                to="/books"
                className={loc.pathname.startsWith('/books') ? 'badge' : ''}
              >
                Buku
              </Link>
              <Link
                to="/books/add"
                className={loc.pathname === '/books/add' ? 'badge' : ''}
              >
                Tambah Buku
              </Link>
              <Link
                to="/transactions"
                className={loc.pathname.startsWith('/transactions') ? 'badge' : ''}
              >
                Transaksi
              </Link>
              <Link
                to="/checkout"
                className={loc.pathname === '/checkout' ? 'badge' : ''}
              >
                Keranjang ({totalItems})
              </Link>
            </div>
          )}
        </div>

        {/* Right side: user info + logout */}
        <div className="nav-right">
          {token ? (
            <>
              <span className="badge">
                {/* tampilkan username > email > User */}
                {user?.username
                  ? user.username
                  : user?.email
                  ? user.email
                  : 'User'}
              </span>
              <button className="button" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="button primary" onClick={() => nav('/login')}>
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
