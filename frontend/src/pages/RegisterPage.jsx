import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError('Error al registrar. Prova amb un altre email.')
    }
  }

  return (
    <div style={{ marginTop: '150px' }}>
      <h1>Registre</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Nom d'usuari" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contrasenya" onChange={handleChange} required />
        <button type="submit">Registrar-se</button>
      </form>
      <p>Ja tens compte? <Link to="/login">Inicia sessió</Link></p>
    </div>
  )
}