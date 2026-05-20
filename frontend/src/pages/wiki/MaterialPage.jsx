import { useEffect, useState } from 'react'
import './MaterialPage.css'
import { resourceService } from '../../services/resource.js'
import { useAuth } from '../../context/AuthContext'
import MaterialForm from './Forms/MaterialForm'

export default function MaterialPage() {
    const { user } = useAuth()
    const [allMaterial, setAllMaterial] = useState([])       // lista completa sin filtrar
    const [material, setMaterial] = useState([])              // lista mostrada (filtrada)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingMaterial, setEditingMaterial] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    // Carga inicial
    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('material')
                setAllMaterial(data)
                setMaterial(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando material:', err)
                setError('Error al cargar los material')
                setAllMaterial([])
                setMaterial([])
            } finally {
                setLoading(false)
            }
        }
        fetchMaterial()
    }, [])

    // Filtrar por valor cuando cambia el query
    useEffect(() => {
        if (!query.trim()) {
            setMaterial(allMaterial)
        } else {
            const q = query.toLowerCase().trim()
            setMaterial(allMaterial.filter(r =>
                r.stats?.value?.toString().toLowerCase().includes(q)
            ))
        }
    }, [query, allMaterial])

    const handleAddMaterial = () => {
        setEditingMaterial(null)
        setShowForm(true)
    }

    const handleEditMaterial = (material) => {
        setEditingMaterial(material)
        setShowForm(true)
    }

    const handleSaveMaterial = async (materialData) => {
        try {
            setFormLoading(true)
            if (editingMaterial) {
                const result = await resourceService.updateResource(editingMaterial._id, materialData)
                if (result) {
                    setAllMaterial(prev => prev.map(m => m._id === editingMaterial._id ? result : m))
                    setShowForm(false)
                    setEditingMaterial(null)
                }
            } else {
                const result = await resourceService.createResource(materialData)
                if (result) {
                    setAllMaterial(prev => [...prev, result])
                    setShowForm(false)
                }
            }
        } catch (err) {
            console.error('Error guardando material:', err)
            alert('Error al guardar el material')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeleteMaterial = async (id) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await resourceService.deleteResource(id)
                setAllMaterial(prev => prev.filter(m => m._id !== id))
            } catch (err) {
                console.error('Error eliminando material:', err)
                alert('Error al eliminar')
            }
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingMaterial(null)
    }

    return (
        <div className="material-page-wrapper">
            <div className="material-page-content">
                <div className="material-header">
                    <div className="material-header-content">
                        <h1 className="material-title">Pdis</h1>
                        {user && user.role === 'admin' && (
                            <button className="btn-add" onClick={handleAddMaterial}>+ Añadir</button>
                        )}
                    </div>
                </div>

                {/* Buscador */}
                <div className="material-search-bar">
                    <input
                        type="text"
                        placeholder="Buscar por valor..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="material-search-input"
                    />
                    {query && (
                        <button className="material-search-clear" onClick={() => setQuery('')}>✕</button>
                    )}
                </div>
                {query && !loading && (
                    <p className="material-search-results-count">
                        {material.length} resultado{material.length !== 1 ? 's' : ''} para "{query}"
                    </p>
                )}

                {error && <div className="material-error"><p>{error}</p></div>}

                {loading && (
                    <div className="material-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando material...</p>
                    </div>
                )}

                {!loading && material.length === 0 && !error && (
                    <div className="material-empty">
                        <p>{query ? `No se encontraron resultados para "${query}"` : 'No se encontraron material'}</p>
                    </div>
                )}

                {!loading && material.length > 0 && (
                    <div className="material-items-container">
                        {material.map((material) => (
                            <div key={material._id} className="material-item">
                                <div className="material-item-image">
                                    {material.image_url ? (
                                        <img src={material.image_url} alt={material.name} />
                                    ) : (
                                        <div className="material-placeholder"></div>
                                    )}
                                </div>
                                <div className="material-item-info">
                                    <h3 className="material-item-name">{material.name}</h3>
                                    <p className="material-item-description">{material.description}</p>
                                </div>
                                <div className="material-item-actions">
                                    {material.stats?.value && (
                                        <span className="value-text">{material.stats.value}</span>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div className="material-item-buttons">
                                            <button className="btn-edit" onClick={() => handleEditMaterial(material)}>✎</button>
                                            <button className="btn-delete" onClick={() => handleDeleteMaterial(material._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <MaterialForm
                        material={editingMaterial}
                        onSave={handleSaveMaterial}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}