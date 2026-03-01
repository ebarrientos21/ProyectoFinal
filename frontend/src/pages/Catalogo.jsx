import { useEffect, useState } from 'react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import styles from './Catalogo.module.css'

const API = 'http://localhost:3000/api'

export default function Catalogo() {
  const [comics, setComics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { addToCart } = useCart()
  const showToast = useToast()

  useEffect(() => {
    axios.get(`${API}/comics`)
      .then(r => { setComics(r.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const handleAdd = (comic) => {
    addToCart(comic)
    showToast?.(`¡${comic.nombre} agregado! 🔥`, 'success')
  }

  return (
    <div>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>KOMIX STORE</h1>
        <p className={styles.heroSub}>Tu universo de cómics</p>
        <p className={styles.heroDesc}>Los mejores cómics de Marvel, DC y más. Envío gratis en pedidos +$500.</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Catálogo</h2>
        {loading && <Loader />}
        {error && (
          <div className={styles.empty}>
            <p style={{ color: 'var(--rojo)', fontFamily: 'Oswald', letterSpacing: 2 }}>
              ⚠ No se pudo conectar al servidor.
            </p>
          </div>
        )}
        {!loading && !error && comics.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📚</span>
            <p>No hay cómics aún. ¡Agrega desde el panel admin!</p>
          </div>
        )}
        {!loading && !error && (
          <div className={styles.grid}>
            {comics.map((c, i) => (
              <div key={c._id} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={styles.imgWrap}>
                  {c.imagen
                    ? <img src={c.imagen} alt={c.nombre} className={styles.img}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                    : null}
                  <div className={styles.imgPlaceholder} style={{ display: c.imagen ? 'none' : 'flex' }}>📖</div>
                  <span className={styles.stockBadge}>Stock: {c.stock}</span>
                </div>
                <div className={styles.info}>
                  <div className={styles.editorial}>{c.editorial || 'Sin editorial'}</div>
                  <div className={styles.nombre}>{c.nombre}</div>
                  <div className={styles.personaje}>{c.personaje}</div>
                  <div className={styles.footer}>
                    <span className={styles.precio}>${c.precio}</span>
                    <button className={styles.addBtn} onClick={() => handleAdd(c)}>+ Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}