import { useEffect, useState } from 'react'
import './PoiPage.css'
import { resourceService } from '../../services/resource.js'

import { useAuth } from '../../context/AuthContext'
import PoiForm from './Forms/PoiForm'

export default function PoiPage() {
    const { user } = useAuth()
    const [poi, setPoi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingPoi, setEditingPoi] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        const fetchPoi = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('poi')
                setPoi(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando poi:', err)
                setError('Error al cargar los poi')
                setPoi([])
            } finally {
                setLoading(false)
            }
        }
        fetchPoi()
    }, [])

    const handleAddPoi = () => {
        setEditingPoi(null)
        setShowForm(true)
    }

    const handleEditPoi = (poi) => {
        setEditingPoi(poi)
        setShowForm(true)
    }

    const handleSavePoi = async (poiData) => {
        try {
            setFormLoading(true)
            if (editingPoi) {
                const result = await resourceService.updateResource(editingPoi._id, poiData)
                if (result) {
                    setPoi(poi.map(m => m._id === editingPoi._id ? result : m))
                    setShowForm(false)
                    setEditingPoi(null)
                }
            } else {
                const result = await resourceService.createResource(poiData)
                if (result) {
                    setPoi([...poi, result])
                    setShowForm(false)
                }
            }
        } catch (err) {
            console.error('Error guardando poi:', err)
            alert('Error al guardar el poi')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeletePoi = async (id) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await resourceService.deleteResource(id)
                setPoi(poi.filter(m => m._id !== id))
            } catch (err) {
                console.error('Error eliminando poi:', err)
                alert('Error al eliminar')
            }
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingPoi(null)
    }

    return (
        <div className="poi-page-wrapper">
            <div className="poi-page-content">
                <div className="poi-header">
                    <div className="poi-header-content">
                        <h1 className="poi-title">Pdis</h1>
                        {user && user.role === 'admin' && (
                            <button className="btn-add" onClick={handleAddPoi}>+ Añadir</button>
                        )}
                    </div>
                </div>

                {error && <div className="poi-error"><p>{error}</p></div>}

                {loading && (
                    <div className="poi-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando poi...</p>
                    </div>
                )}

                {!loading && poi.length === 0 && !error && (
                    <div className="poi-empty"><p>No se encontraron poi</p></div>
                )}

                {!loading && poi.length > 0 && (
                    <div className="poi-items-container">
                        {poi.map((poi) => (
                            <div key={poi._id} className="poi-item">
                                <div className="poi-item-image">
                                    {poi.image_url ? (
                                        <img src={poi.image_url} alt={poi.name} />
                                    ) : (
                                        <div className="poi-placeholder"></div>
                                    )}
                                </div>
                                <div className="poi-item-info">
                                    <h3 className="poi-item-name">{poi.name}</h3>
                                    <p className="poi-item-description">{poi.description}</p>
                                </div>
                                <div className="poi-item-actions">
                                    {poi.stats?.value && (
                                        <span className="value-text">{poi.stats.value}</span>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div className="poi-item-buttons">
                                            <button className="btn-edit" onClick={() => handleEditPoi(poi)}>✎</button>
                                            <button className="btn-delete" onClick={() => handleDeletePoi(poi._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <PoiForm 
                        poi={editingPoi}
                        onSave={handleSavePoi}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}