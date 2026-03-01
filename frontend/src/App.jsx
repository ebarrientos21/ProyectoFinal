import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Catalogo from './pages/Catalogo'
import Auth from './pages/Auth'
import Admin from './pages/Admin'
import Carrito from './pages/Carrito'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Catalogo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>
          <Toast />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}