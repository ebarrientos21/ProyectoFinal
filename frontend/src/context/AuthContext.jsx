import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [rol, setRol] = useState(localStorage.getItem('rol'))
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'))

  const login = (data) => {
    setToken(data.token)
    setRol(data.rol)
    setNombre(data.nombre)
    localStorage.setItem('token', data.token)
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombre', data.nombre)
  }

  const logout = () => {
    setToken(null); setRol(null); setNombre(null)
    localStorage.removeItem('token')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombre')
  }

  return (
    <AuthContext.Provider value={{ token, rol, nombre, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)