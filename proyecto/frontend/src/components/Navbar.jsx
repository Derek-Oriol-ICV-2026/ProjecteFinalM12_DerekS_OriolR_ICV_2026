import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SonarLogo from './SonarLogo'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <SonarLogo size="sm" showText={false} animated={true} />
          <span className="brand-text">Abyss Interactive</span>
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/" className="nav-link">Mapa</Link>
        {user && <Link to="/wiki" className="nav-link">Wiki</Link>}
      </div>
        
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="nav-link user-link">
              {user.username} <span className="role-badge">{user.role}</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Sortir
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link register-link">Registre</Link>
          </>
        )}
      </div>
    </nav>
  )
}