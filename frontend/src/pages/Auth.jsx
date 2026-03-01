import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import styles from './Auth.module.css'

const API = 'http://localhost:3000/api'

export default function Auth() {
  const [tab, setTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [regData, setRegData] = useState({ nombre: '', email: '', password: '', adminSecret: '' })
  const [msg, setMsg] = useState({ text: '', type: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const showMsg = (text, type) => setMsg({ text, type })

  const doLogin = async () => {
    try {
      const { data } = await axios.post(`${API}/auth/login`, loginData)
      login(data)
      showMsg(`¡Bienvenido, ${data.nombre}!`, 'success')
      setTimeout(() => navigate('/'), 1000)
    } catch (e) {
      showMsg(e.response?.data?.error || 'Error al iniciar sesión', 'error')
    }
  }

  const doRegister = async () => {
    try {
      const { data } = await axios.post(`${API}/auth/register`, regData)
      showMsg(`¡Cuenta creada! Rol: ${data.rol}. Ahora inicia sesión.`, 'success')
      setTimeout(() => setTab('login'), 2000)
    } catch (e) {
      showMsg(e.response?.data?.error || e.response?.data?.mensaje || 'Error al registrarse', 'error')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>ACCESO</h2>
        <p className={styles.subtitle}>Inicia sesión o crea tu cuenta</p>

        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'login' ? styles.tabActive : ''}`}
            onClick={() => { setTab('login'); setMsg({ text: '', type: '' }) }}>Login</button>
          <button className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => { setTab('register'); setMsg({ text: '', type: '' }) }}>Registro</button>
        </div>

        {tab === 'login' && (
          <div>
            <div className={styles.group}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" placeholder="tu@email.com"
                value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Contraseña</label>
              <input className={styles.input} type="password" placeholder="••••••••"
                value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && doLogin()} />
            </div>
            <button className={styles.btnPrimary} onClick={doLogin}>ENTRAR</button>
          </div>
        )}

        {tab === 'register' && (
          <div>
            <div className={styles.group}>
              <label className={styles.label}>Nombre</label>
              <input className={styles.input} placeholder="Tu nombre"
                value={regData.nombre} onChange={e => setRegData({ ...regData, nombre: e.target.value })} />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Email</label>
              <input className={styles.input} type="email" placeholder="tu@email.com"
                value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Contraseña</label>
              <input className={styles.input} type="password" placeholder="••••••••"
                value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />
            </div>
            <div className={styles.group}>
              <label className={styles.label}>Código Admin (opcional)</label>
              <input className={styles.input} type="password" placeholder="Solo si eres admin"
                value={regData.adminSecret} onChange={e => setRegData({ ...regData, adminSecret: e.target.value })} />
            </div>
            <button className={styles.btnPrimary} onClick={doRegister}>REGISTRARSE</button>
          </div>
        )}

        {msg.text && (
          <div className={`${styles.msg} ${msg.type === 'success' ? styles.success : styles.error}`}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  )
}