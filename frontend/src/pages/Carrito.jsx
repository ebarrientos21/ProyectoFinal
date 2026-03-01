import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import styles from './Carrito.module.css'

export default function Carrito() {
  const { carrito, changeQty, removeItem, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()
  const showToast = useToast()

  const envio = totalPrice >= 500 ? 0 : 99
  const total = totalPrice + envio

  const checkout = () => {
    showToast?.('¡Gracias por tu compra! 🎉', 'success')
    clearCart()
    setTimeout(() => navigate('/'), 2000)
  }

  if (!carrito.length) {
    return (
      <div className={styles.container}>
        <h2 className={styles.pageTitle}>Tu Carrito</h2>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🛒</span>
          <p>Tu carrito está vacío</p>
          <button className={styles.btnPrimary} onClick={() => navigate('/')}>VER CATÁLOGO</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Tu Carrito</h2>
      <div className={styles.grid}>
        <div className={styles.items}>
          {carrito.map(item => (
            <div key={item._id} className={styles.item}>
              <div className={styles.itemImg}>
                {item.imagen
                  ? <img src={item.imagen} alt={item.nombre}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : null}
                <span style={{ display: item.imagen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📖</span>
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemNombre}>{item.nombre}</div>
                <div className={styles.itemEditorial}>{item.editorial}</div>
                <div className={styles.qty}>
                  <button className={styles.qtyBtn} onClick={() => changeQty(item._id, -1)}>−</button>
                  <span className={styles.qtyNum}>{item.qty}</span>
                  <button className={styles.qtyBtn} onClick={() => changeQty(item._id, 1)}>+</button>
                </div>
              </div>
              <div className={styles.itemPrecio}>${item.precio * item.qty}</div>
              <button className={styles.removeBtn} onClick={() => removeItem(item._id)}>✕</button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryTitle}>RESUMEN</div>
          <div className={styles.row}><span>Subtotal</span><span>${totalPrice}</span></div>
          <div className={styles.row}><span>Envío</span><span>{envio === 0 ? '🎉 Gratis' : `$${envio}`}</span></div>
          <div className={`${styles.row} ${styles.total}`}><span>Total</span><span>${total}</span></div>
          <button className={styles.btnPrimary} onClick={checkout} style={{ marginTop: '1rem' }}>COMPRAR AHORA</button>
          <button className={styles.btnSecondary} onClick={() => navigate('/')}>Seguir comprando</button>
        </div>
      </div>
    </div>
  )
}