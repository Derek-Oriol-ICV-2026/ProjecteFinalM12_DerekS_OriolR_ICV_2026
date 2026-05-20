import { useEffect, useState } from 'react'
import './PoiPage.css'
import { resourceService } from '../../services/resource.js'
import { useAuth } from '../../context/AuthContext'
import PoiForm from './Forms/PoiForm'

export default function PoiPage() {
    const { user } = useAuth()
    const [allPoi, setAllPoi] = useState([])       // lista completa sin filtrar
    const [poi, setPoi] = useState([])              // lista mostrada (filtrada)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingPoi, setEditingPoi] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    // Carga inicial
    useEffect(() => {
        const fetchPoi = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('poi')
                setAllPoi(data)
                setPoi(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando poi:', err)
                setError('Error al cargar los poi')
                setAllPoi([])
                setPoi([])
            } finally {
                setLoading(false)
            }
        }
        fetchPoi()
    }, [])

    // Filtrar por valor cuando cambia el query
    useEffect(() => {
        if (!query.trim()) {
            setPoi(allPoi)
        } else {
            const q = query.toLowerCase().trim()
            setPoi(allPoi.filter(r =>
                r.stats?.value?.toString().toLowerCase().includes(q)
            ))
        }
    }, [query, allPoi])

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
                    setAllPoi(prev => prev.map(m => m._id === editingPoi._id ? result : m))
                    setShowForm(false)
                    setEditingPoi(null)
                }
            } else {
                const result = await resourceService.createResource(poiData)
                if (result) {
                    setAllPoi(prev => [...prev, result])
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
                setAllPoi(prev => prev.filter(m => m._id !== id))
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

                {/* Buscador */}
                <div className="poi-search-bar">
                    <input
                        type="text"
                        placeholder="Buscar por valor..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="poi-search-input"
                    />
                    {query && (
                        <button className="poi-search-clear" onClick={() => setQuery('')}>✕</button>
                    )}
                </div>
                {query && !loading && (
                    <p className="poi-search-results-count">
                        {poi.length} resultado{poi.length !== 1 ? 's' : ''} para "{query}"
                    </p>
                )}

                {error && <div className="poi-error"><p>{error}</p></div>}

                {loading && (
                    <div className="poi-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando poi...</p>
                    </div>
                )}

                {!loading && poi.length === 0 && !error && (
                    <div className="poi-empty">
                        <p>{query ? `No se encontraron resultados para "${query}"` : 'No se encontraron poi'}</p>
                    </div>
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