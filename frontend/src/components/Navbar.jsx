import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SonarLogo from './SonarLogo'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname.startsWith(path)
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
        <Link
          to="/"
          className={`nav-link ${isActive('/') && !isActive('/wiki') ? 'active' : ''}`}
        >
          Mapa
        </Link>
        {user && (
          <Link
            to="/wiki"
            className={`nav-link ${isActive('/wiki') ? 'active' : ''}`}
          >
            Wiki
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/profile" className="nav-link user-link">
              <span className="username-text">{user.username}</span>
              <span className="role-badge">{user.role}</span>
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