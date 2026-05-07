import { useState, useEffect } from 'react'
import './BiomeForm.css'

export default function BiomeForm({ biome, onSave, onClose, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#0066FF',
        polygon_coords: []
    })

    const [errors, setErrors] = useState({})

    // Cargar datos del bioma si estamos editando
    useEffect(() => {
        if (biome) {
            setFormData({
                name: biome.name || '',
                description: biome.description || '',
                color: biome.color || '#0066FF',
                polygon_coords: biome.polygon_coords || []
            })
        }
    }, [biome])

    // Validar formulario
    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido'
        }

        if (!formData.color.trim()) {
            newErrors.color = 'El color es requerido'
        }

        // Validar que el color sea un hex válido
        if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
            newErrors.color = 'Color hex inválido (ej: #FF0000)'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    // Manejar submit
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (validateForm()) {
            onSave(formData)
        }
    }

    return (
        <div className="biome-form-overlay">
            <div className="biome-form-container">
                <div className="biome-form-header">
                    <h2>{biome ? 'Editar Bioma' : 'Crear Nuevo Bioma'}</h2>
                    <button 
                        className="btn-close"
                        onClick={onClose}
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="biome-form">
                    {/* Nombre */}
                    <div className="form-group">
                        <label htmlFor="name">Nombre *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ej: Deep Grand Reef"
                            disabled={loading}
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>

                    {/* Descripción */}
                    <div className="form-group">
                        <label htmlFor="description">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe este bioma..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    {/* Color */}
                    <div className="form-group">
                        <label htmlFor="color">Color *</label>
                        <div className="color-input-group">
                            <input
                                type="color"
                                id="color"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="#0066FF"
                                disabled={loading}
                            />
                        </div>
                        {errors.color && <span className="error">{errors.color}</span>}
                    </div>

                    {/* Info sobre coordenadas */}
                    <div className="form-group info">
                        <p>
                            <strong>Nota:</strong> Las coordenadas poligonales se configuran desde el mapa.
                            Actualmente: <strong>{formData.polygon_coords.length}</strong> puntos
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="form-buttons">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (biome ? 'Actualizar' : 'Crear')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}