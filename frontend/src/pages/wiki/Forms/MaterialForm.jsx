import { useState, useEffect } from 'react'
import './MaterialForm.css'

export default function MaterialForm({ material, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        stats: { value: '' }
    })
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (material) {
            setFormData({
                name: material.name || '',
                description: material.description || '',
                image_url: material.image_url || '',
                stats: { value: material.stats?.value || '' }
            })
        }
    }, [material])

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Nombre requerido'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name === 'value') {
            setFormData(prev => ({
                ...prev,
                stats: { value }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            onSave({ ...formData, type: 'material' })
        }
    }

    return (
        <div className="form-overlay">
            <div className="form-container">
                <div className="form-header">
                    <h2>{material ? 'Editar Material' : 'Crear Material'}</h2>
                    <button className="btn-close" onClick={onClose} type="button">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={loading} />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4" disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>URL Imagen</label>
                        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." disabled={loading} />
                    </div>
                    <div className="form-group">
                        <label>Valor</label>
                        <input type="text" name="value" value={formData.stats.value} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Guardando...' : (material ? 'Actualizar' : 'Crear')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}