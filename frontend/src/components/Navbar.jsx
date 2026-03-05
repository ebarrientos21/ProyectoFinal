import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { token, rol, nombre, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? styles.active : ''

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        BAZINGA <span>COMICS</span>
      </Link>
      <div className={styles.links}>
        <Link to="/" className={`${styles.btn} ${isActive('/')}`}>Catálogo</Link>
        {!token && <Link to="/auth" className={`${styles.btn} ${isActive('/auth')}`}>Login</Link>}
        {token && rol === 'admin' && (
          <Link to="/admin" className={`${styles.btn} ${isActive('/admin')}`}>Admin</Link>
        )}
        <Link to="/carrito" className={`${styles.btn} ${styles.cartBtn} ${isActive('/carrito')}`}>
          🛒 Carrito
          {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
        </Link>
        {token && <span className={styles.user}>{nombre}</span>}
        {token && <button className={styles.btn} onClick={handleLogout}>Salir</button>}
      </div>
    </nav>
  )
}