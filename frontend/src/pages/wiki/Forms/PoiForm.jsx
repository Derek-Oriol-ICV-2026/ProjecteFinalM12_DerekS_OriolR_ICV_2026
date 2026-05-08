import { useState, useEffect } from 'react'
import './PoiForm.css'

export default function PoiForm({ poi, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({ name: '', description: '', image_url: '', stats: { value: '' } })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (poi) setFormData({
            name: poi.name || '',
            description: poi.description || '',
            image_url: poi.image_url || '',
            stats: { value: poi.stats?.value || '' }
        })
    }, [poi])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => name === 'value' ? { ...prev, stats: { value } } : { ...prev, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.name.trim()) onSave({ ...formData, type: 'poi' })
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>{poi ? 'Editar Poi' : 'Crear Poi'}</h2>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>URL Imagen</label>
                        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Valor</label>
                        <input type="text" name="value" value={formData.stats.value} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Guardando...' : (poi ? 'Actualizar' : 'Crear')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}