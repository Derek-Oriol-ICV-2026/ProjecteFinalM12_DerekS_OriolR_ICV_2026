import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './RegisterPage.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Les contrasenyes no coincideixen.')
      return
    }
    try {
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
      })

      navigate('/login')
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Error al registrar'
      )
    }
  }

  return (
    <>
      <div className="register-bg" />

      <div className="register-wrapper">
        <div className="register-card">

          <div className="register-avatar">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#7aabb8" strokeWidth="1.8">
              <circle cx="18" cy="13" r="6" />
              <path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="register-title">Registre</h1>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-row">
              <label className="register-label">Nom:</label>
              <input className="register-input" name="username" onChange={handleChange} required />
            </div>

            <div className="register-row">
              <label className="register-label">Email:</label>
              <input className="register-input" name="email" type="email" onChange={handleChange} required />
            </div>

            <div className="register-row">
              <label className="register-label">Contrasenya:</label>
              <input className="register-input" name="password" type="password" onChange={handleChange} required />
            </div>

            <div className="register-row">
              <label className="register-label">Repetir Contrasenya:</label>
              <input className="register-input" name="confirmPassword" type="password" onChange={handleChange} required />
            </div>

            <button type="submit" className="register-button">Entrar</button>
          </form>

          <div className="register-divider" />

          <p className="register-footer">
            Ja tens compte?
            <Link to="/login">Inicia sessió</Link>
          </p>

        </div>
      </div>
    </>
  )
}