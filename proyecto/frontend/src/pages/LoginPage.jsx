import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './LoginPage.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError('Email o contrasenya incorrectes')
    }
  }

  return (
    <>
      {/* Fondo full viewport igual que el vídeo del mapa */}
      <div className="bg" />

      <div className="wrapper">
        <div className="card">

          <div className="avatarWrap">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#7aabb8" strokeWidth="1.8">
              <circle cx="18" cy="13" r="6" />
              <path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="title">Login</h1>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="form">
            <div className="row">
              <label className="label">Email:</label>
              <input className="input" name="email" type="email" onChange={handleChange} required />
            </div>

            <div className="row">
              <label className="label">Contrasenya:</label>
              <input className="input" name="password" type="password" onChange={handleChange} required />
            </div>

            <button type="submit" className="button">Entrar</button>
          </form>

          <div className="divider" />

          <p className="footer">
            No tens compte?
            <Link to="/register" className="footerLink">Registra&apos;t</Link>
          </p>

        </div>
      </div>
    </>
  )
}