import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import BooksList from './pages/BooksList'
import BookDetail from './pages/BookDetail'
import AddBook from './pages/AddBook'
import Checkout from './pages/Checkout'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
