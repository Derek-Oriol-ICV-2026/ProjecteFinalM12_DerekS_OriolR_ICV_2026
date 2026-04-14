import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div>
      <h1>Perfil</h1>
      <p>Usuari: {user.username}</p>
      <p>Rol: {user.role}</p>
      <button onClick={handleLogout}>Tancar sessió</button>
    </div>
  )
}