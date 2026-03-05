import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import Loader from '../components/Loader'
import styles from './Admin.module.css'

const API = 'https://bazinga-comics-backend.onrender.com/api'

const emptyForm = { nombre: '', descripcion: '', precio: '', stock: '', imagen: '', editorial: '', personaje: '' }

export default function Admin() {
  const { token, rol } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [comics, setComics] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  useEffect(() => {
    if (!token || rol !== 'admin') return
    loadComics()
  }, [token, rol])

  const loadComics = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${API}/comics`)
      setComics(data)
    } catch (e) {}
    setLoading(false)
  }

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${API}/comics/${editId}`, {
          ...form, precio: Number(form.precio), stock: Number(form.stock)
        }, { headers: { Authorization: `Bearer ${token}` } })
        setMsg({ text: '¡Cómic actualizado!', type: 'success' })
        setEditId(null)
      } else {
        await axios.post(`${API}/comics`, {
          ...form, precio: Number(form.precio), stock: Number(form.stock)
        }, { headers: { Authorization: `Bearer ${token}` } })
        setMsg({ text: '¡Cómic agregado exitosamente!', type: 'success' })
      }
      setForm(emptyForm)
      loadComics()
      setTimeout(() => setMsg({ text: '', type: '' }), 2000)
    } catch (e) {
      setMsg({ text: e.response?.data?.error || 'Error al guardar', type: 'error' })
    }
  }

  const handleEdit = (c) => {
    setEditId(c._id)
    setForm({
      nombre: c.nombre || '',
      descripcion: c.descripcion || '',
      precio: c.precio || '',
      stock: c.stock || '',
      imagen: c.imagen || '',
      editorial: c.editorial || '',
      personaje: c.personaje || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditId(null)
    setForm(emptyForm)
    setMsg({ text: '', type: '' })
  }

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    try {
      await axios.delete(`${API}/comics/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      showToast?.(`${nombre} eliminado`, 'success')
      loadComics()
    } catch (e) {
      showToast?.('Error al eliminar')
    }
  }

  if (!token || rol !== 'admin') {
    return (
      <div className={styles.blocked}>
        <p className={styles.blockedTitle}>⛔ ACCESO DENEGADO</p>
        <p style={{ color: 'var(--gris-texto)', fontFamily: 'Oswald', letterSpacing: 2, marginBottom: '1.5rem' }}>
          Necesitas iniciar sesión como administrador.
        </p>
        <button className={styles.btnPrimary} onClick={() => navigate('/auth')}>IR AL LOGIN</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Panel Admin</h2>
      <div className={styles.formBox}>
        <h3 className={styles.formTitle}>
          {editId ? '✏️ Editando Cómic' : '➕ Agregar Cómic'}
        </h3>
        <div className={styles.grid}>
          {[
            { id: 'nombre', label: 'Nombre *', placeholder: 'Batman: Year One' },
            { id: 'personaje', label: 'Personaje', placeholder: 'Batman' },
            { id: 'editorial', label: 'Editorial', placeholder: 'DC Comics' },
            { id: 'precio', label: 'Precio *', placeholder: '250', type: 'number' },
            { id: 'stock', label: 'Stock *', placeholder: '10', type: 'number' },
            { id: 'imagen', label: 'URL Imagen', placeholder: 'https://...' },
          ].map(f => (
            <div className={styles.group} key={f.id}>
              <label className={styles.label}>{f.label}</label>
              <input className={styles.input} type={f.type || 'text'} placeholder={f.placeholder}
                value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })} />
            </div>
          ))}
          <div className={`${styles.group} ${styles.full}`}>
            <label className={styles.label}>Descripción</label>
            <input className={styles.input} placeholder="Breve descripción..."
              value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className={styles.btnSubmit} onClick={handleSubmit}>
            {editId ? 'GUARDAR CAMBIOS' : 'AGREGAR CÓMIC'}
          </button>
          {editId && (
            <button className={styles.btnCancel} onClick={handleCancel}>CANCELAR</button>
          )}
        </div>
        {msg.text && (
          <div className={`${styles.msg} ${msg.type === 'success' ? styles.success : styles.error}`}>{msg.text}</div>
        )}
      </div>

      <h3 className={styles.listTitle}>Cómics en Catálogo</h3>
      {loading ? <Loader /> : (
        <div className={styles.list}>
          {comics.length === 0 && <p style={{ color: 'var(--gris-texto)', fontFamily: 'Oswald', letterSpacing: 1 }}>No hay cómics aún.</p>}
          {comics.map(c => (
            <div key={c._id} className={styles.item}>
              <div className={styles.itemInfo}>
                <div className={styles.itemNombre}>{c.nombre}</div>
                <div className={styles.itemMeta}>
                  {c.editorial || 'Sin editorial'} · {c.personaje || '-'} · Stock: <span>{c.stock}</span> · <span>${c.precio}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={styles.btnEdit} onClick={() => handleEdit(c)}>Editar</button>
                <button className={styles.btnDelete} onClick={() => handleDelete(c._id, c.nombre)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}