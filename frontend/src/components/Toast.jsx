import { useState, useEffect } from 'react'

let showToastFn = null

export function useToast() {
  return showToastFn
}

export default function Toast() {
  const [toast, setToast] = useState({ msg: '', visible: false, type: '' })

  useEffect(() => {
    showToastFn = (msg, type = '') => {
      setToast({ msg, visible: true, type })
      setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'var(--negro-panel)',
      border: `2px solid ${toast.type === 'success' ? '#2d6a2d' : 'var(--rojo)'}`,
      borderRadius: '4px', padding: '1rem 1.5rem',
      fontFamily: 'Oswald, sans-serif', fontSize: '0.9rem',
      letterSpacing: '1px', color: 'var(--blanco)', zIndex: 1000,
      boxShadow: '4px 4px 0 #00000066',
      transform: toast.visible ? 'translateY(0)' : 'translateY(120px)',
      opacity: toast.visible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      pointerEvents: 'none'
    }}>
      {toast.msg}
    </div>
  )
}