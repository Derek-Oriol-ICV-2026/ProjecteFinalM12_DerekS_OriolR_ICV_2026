import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(10, 22, 40, 0.9)',
      backdropFilter: 'blur(8px)',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          🌊 Subnautica Map
        </Link>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Mapa</Link>
        {user && <Link to="/wiki" style={{ color: '#fff', textDecoration: 'none' }}>Wiki</Link>}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>
              {user.username} ({user.role})
            </Link>
            <button onClick={handleLogout} style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Sortir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'none' }}>Registre</Link>
          </>
        )}
      </div>
    </nav>
  )
}