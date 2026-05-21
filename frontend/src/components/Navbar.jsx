import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SonarLogo from './SonarLogo'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname.startsWith(path)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">
            <SonarLogo size='sm' showText={false} animated={true} />
            <span className="brand-text">Abyss Interactive</span>
          </Link>
        </div>

        {/* CENTER — solo desktop */}
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

        {/* RIGHT — solo desktop */}
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

        {/* HAMBURGER — solo mobile */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* OVERLAY */}
      <div
        className={`drawer-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* DRAWER */}
      <div className={`drawer ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-text">Abyss Interactive</span>
          </Link>
        </div>

        <nav className="drawer-nav">
          <Link
            to="/"
            className={`drawer-link ${isActive('/') && !isActive('/wiki') ? 'active' : ''}`}
          >
            <span className="drawer-link-icon">◈</span>
            Mapa
          </Link>

          {user && (
            <Link
              to="/wiki"
              className={`drawer-link ${isActive('/wiki') ? 'active' : ''}`}
            >
              <span className="drawer-link-icon">◈</span>
              Wiki
            </Link>
          )}
        </nav>

        <div className="drawer-footer">
          {user ? (
            <>
              <Link to="/profile" className="drawer-user" onClick={() => setMenuOpen(false)}>
                <span className="drawer-username">{user.username}</span>
                <span className="role-badge">{user.role}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn drawer-logout">
                Sortir
              </button>
            </>
          ) : (
            <div className="drawer-auth">
              <Link to="/login" className="drawer-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="register-link drawer-register" onClick={() => setMenuOpen(false)}>
                Registre
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}