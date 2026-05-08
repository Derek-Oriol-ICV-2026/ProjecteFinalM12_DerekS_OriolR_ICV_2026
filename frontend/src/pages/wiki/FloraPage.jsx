import { useEffect, useState } from 'react'
import './FloraPage.css'
import { resourceService } from '../../services/resource.js'

import { useAuth } from '../../context/AuthContext'
import FloraForm from './Forms/FloraForm'

export default function FloraPage() {
    const { user } = useAuth()
    const [flora, setFlora] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingFlora, setEditingFlora] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        const fetchFlora = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('flora')
                setFlora(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando flora:', err)
                setError('Error al cargar los flora')
                setFlora([])
            } finally {
                setLoading(false)
            }
        }
        fetchFlora()
    }, [])

    const handleAddFlora = () => {
        setEditingFlora(null)
        setShowForm(true)
    }

    const handleEditFlora = (flora) => {
        setEditingFlora(flora)
        setShowForm(true)
    }

    const handleSaveFlora = async (floraData) => {
        try {
            setFormLoading(true)
            if (editingFlora) {
                const result = await resourceService.updateResource(editingFlora._id, floraData)
                if (result) {
                    setFlora(flora.map(m => m._id === editingFlora._id ? result : m))
                    setShowForm(false)
                    setEditingFlora(null)
                }
            } else {
                const result = await resourceService.createResource(floraData)
                if (result) {
                    setFlora([...flora, result])
                    setShowForm(false)
                }
            }
        } catch (err) {
            console.error('Error guardando flora:', err)
            alert('Error al guardar el flora')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeleteFlora = async (id) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await resourceService.deleteResource(id)
                setFlora(flora.filter(m => m._id !== id))
            } catch (err) {
                console.error('Error eliminando flora:', err)
                alert('Error al eliminar')
            }
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingFlora(null)
    }

    return (
        <div className="flora-page-wrapper">
            <div className="flora-page-content">
                <div className="flora-header">
                    <div className="flora-header-content">
                        <h1 className="flora-title">Flora</h1>
                        {user && user.role === 'admin' && (
                            <button className="btn-add" onClick={handleAddFlora}>+ Añadir</button>
                        )}
                    </div>
                </div>

                {error && <div className="flora-error"><p>{error}</p></div>}

                {loading && (
                    <div className="flora-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando flora...</p>
                    </div>
                )}

                {!loading && flora.length === 0 && !error && (
                    <div className="flora-empty"><p>No se encontraron flora</p></div>
                )}

                {!loading && flora.length > 0 && (
                    <div className="flora-items-container">
                        {flora.map((flora) => (
                            <div key={flora._id} className="flora-item">
                                <div className="flora-item-image">
                                    {flora.image_url ? (
                                        <img src={flora.image_url} alt={flora.name} />
                                    ) : (
                                        <div className="flora-placeholder"></div>
                                    )}
                                </div>
                                <div className="flora-item-info">
                                    <h3 className="flora-item-name">{flora.name}</h3>
                                    <p className="flora-item-description">{flora.description}</p>
                                </div>
                                <div className="flora-item-actions">
                                    {flora.stats?.value && (
                                        <span className="value-text">{flora.stats.value}</span>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div className="flora-item-buttons">
                                            <button className="btn-edit" onClick={() => handleEditFlora(flora)}>✎</button>
                                            <button className="btn-delete" onClick={() => handleDeleteFlora(flora._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <FloraForm 
                        flora={editingFlora}
                        onSave={handleSaveFlora}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}