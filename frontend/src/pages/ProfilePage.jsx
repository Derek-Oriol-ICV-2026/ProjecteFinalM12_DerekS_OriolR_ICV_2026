import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import './ProfilePage.css'

export default function ProfilePage() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    birthDate: '',
    message: '',
    gamesPlayed: 0,
    score: 0,
    avatar: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user?.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/profile')
      
      setForm({
        username: response.data.username || '',
        email: response.data.email || '',
        password: '',
        birthDate: response.data.birthDate ? response.data.birthDate.split('T')[0] : '',
        message: response.data.message || '',
        gamesPlayed: response.data.gamesPlayed || 0,
        score: response.data.score || 0,
        avatar: response.data.avatar || '',
      })
      
      setAvatarPreview(response.data.avatar || '')
      setError('')
    } catch (err) {
      console.error('Error cargando perfil:', err)
      setError('Error al cargar el perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const compressImage = (file, callback) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > 400 || height > 400) {
          const ratio = Math.min(400 / width, 400 / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7)
        callback(compressedDataUrl)
      }
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      
      compressImage(file, (compressedDataUrl) => {
        setAvatarPreview(compressedDataUrl)
        setForm(prev => ({ ...prev, avatar: compressedDataUrl }))
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.username.trim()) {
      setError('El nombre de usuario es obligatorio')
      return
    }
    if (!form.email.trim()) {
      setError('El email es obligatorio')
      return
    }
    if (!form.email.includes('@')) {
      setError('Email inválido')
      return
    }
    if (parseInt(form.gamesPlayed) > 17) {
      setError('Los logros no pueden superar 17')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const updateData = {
        username: form.username,
        email: form.email,
        birthDate: form.birthDate,
        message: form.message,
        gamesPlayed: parseInt(form.gamesPlayed) || 0,
        score: parseInt(form.score) || 0,
        avatar: form.avatar,
      }

      if (form.password && form.password.trim()) {
        if (form.password.length < 6) {
          setError('La contrasenya debe tenir al menys 6 caràcters')
          setLoading(false)
          return
        }
        updateData.password = form.password
      }

      const response = await api.put('/users/profile', updateData)
      
      if (setUser && response.data.user) {
        setUser({
          ...user,
          ...response.data.user
        })
      }

      setSuccess('Perfil actualitzat correctament')
      setIsEditing(false)
      setForm(prev => ({ ...prev, password: '' }))
      setFileName('')
      
      setTimeout(() => {
        loadProfile()
      }, 2000)
      
    } catch (err) {
      console.error('Error actualizando perfil:', err)
      const errorMessage = err.response?.data?.error || 'Error en actualitzar el perfil'
      setError(errorMessage)
      setSuccess('')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setForm(prev => ({ ...prev, password: '' }))
    setError('')
    setSuccess('')
    setFileName('')
    loadProfile()
  }

  if (loading && !form.username) {
    return (
      <div className="profile-wrapper">
        <div className="profile-body">
          <div className="loading">Cargant perfil...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg" />

      <div className="profile-wrapper">
        <div className="profile-banner" />

        <div className="profile-body">
          <div className="profile-left">
            <div className="profile-avatar-wrap">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="avatar-image" />
              ) : (
                <svg width="48" height="48" viewBox="0 0 36 36" fill="none" stroke="#7aabb8" strokeWidth="1.8">
                  <circle cx="18" cy="13" r="6" />
                  <path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <ul className="profile-info-list">
              <li>Rol: <span>{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—'}</span></li>
              <li>Membre des de: <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString('ca-ES') : '—'}</span></li>
              <li>Logros: <span>{form.gamesPlayed ?? '—'}</span></li>
              <li>Temps de joc: <span>{form.score ?? '—'} h </span></li>
            </ul>
          </div>

          <div className="profile-card">
            <div className="title-row">
              <h1 className="title">Perfil</h1>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <form onSubmit={handleSubmit} className="form">
              {isEditing && (
                <div className="row">
                  <label className="label">Foto de perfil:</label>
                  <div className="file-input-wrapper">
                    <label className="file-button">
                      Examinar...
                      <input 
                        className="input-file" 
                        name="avatar" 
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </label>
                    <span className="file-name">{fileName || 'Ningún archivo'}</span>
                  </div>
                </div>
              )}

              <div className="row">
                <label className="label">Nom:</label>
                <input 
                  className="input" 
                  name="username" 
                  value={form.username} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="row">
                <label className="label">Email:</label>
                <input 
                  className="input" 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              {isEditing && (
                <div className="row">
                  <label className="label">Contrasenya:</label>
                  <div className="input-password-wrap">
                    <input
                      className="input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
              )}

              <div className="row">
                <label className="label">Data de naixement:</label>
                <input 
                  className="input" 
                  name="birthDate" 
                  type="date" 
                  value={form.birthDate} 
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="row">
                  <label className="label">Logros:</label>
                  <input 
                    className="input" 
                    name="gamesPlayed" 
                    type="number"
                    min="0"
                    max="17"
                    value={form.gamesPlayed} 
                    onChange={handleChange}
                  />
                  <span className="input-hint-small">(Máx 17)</span>
                </div>
              )}

              {isEditing && (
                <div className="row">
                  <label className="label">Temps de joc:</label>
                  <input 
                    className="input" 
                    name="score" 
                    type="number"
                    min="0"
                    value={form.score} 
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="row row-textarea">
                <label className="label label-top">Missatge:</label>
                <textarea 
                  className="input textarea" 
                  name="message" 
                  value={form.message} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4} 
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              {!isEditing && (
                <button 
                  type="button" 
                  className="button"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </button>
              )}

              {isEditing && (
                <div className="button-group">
                  <button 
                    type="submit" 
                    className="button"
                    disabled={loading}
                  >
                    {loading ? 'Guardant...' : 'Guardar canvis'}
                  </button>
                  <button 
                    type="button" 
                    className="button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}