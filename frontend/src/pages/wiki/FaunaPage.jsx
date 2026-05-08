import { useEffect, useState } from 'react'
import './FaunaPage.css'
import { resourceService } from '../../services/resource.js'

import { useAuth } from '../../context/AuthContext'
import FaunaForm from './Forms/FaunaForm'

export default function FaunaPage() {
    const { user } = useAuth()
    const [fauna, setFauna] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingFauna, setEditingFauna] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        const fetchFauna = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('fauna')
                setFauna(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando fauna:', err)
                setError('Error al cargar los fauna')
                setFauna([])
            } finally {
                setLoading(false)
            }
        }
        fetchFauna()
    }, [])

    const handleAddFauna = () => {
        setEditingFauna(null)
        setShowForm(true)
    }

    const handleEditFauna = (fauna) => {
        setEditingFauna(fauna)
        setShowForm(true)
    }

    const handleSaveFauna = async (faunaData) => {
        try {
            setFormLoading(true)
            if (editingFauna) {
                const result = await resourceService.updateResource(editingFauna._id, faunaData)
                if (result) {
                    setFauna(fauna.map(m => m._id === editingFauna._id ? result : m))
                    setShowForm(false)
                    setEditingFauna(null)
                }
            } else {
                const result = await resourceService.createResource(faunaData)
                if (result) {
                    setFauna([...fauna, result])
                    setShowForm(false)
                }
            }
        } catch (err) {
            console.error('Error guardando fauna:', err)
            alert('Error al guardar el fauna')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeleteFauna = async (id) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await resourceService.deleteResource(id)
                setFauna(fauna.filter(m => m._id !== id))
            } catch (err) {
                console.error('Error eliminando fauna:', err)
                alert('Error al eliminar')
            }
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingFauna(null)
    }

    return (
        <div className="fauna-page-wrapper">
            <div className="fauna-page-content">
                <div className="fauna-header">
                    <div className="fauna-header-content">
                        <h1 className="fauna-title">Fauna</h1>
                        {user && user.role === 'admin' && (
                            <button className="btn-add" onClick={handleAddFauna}>+ Añadir</button>
                        )}
                    </div>
                </div>

                {error && <div className="fauna-error"><p>{error}</p></div>}

                {loading && (
                    <div className="fauna-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando fauna...</p>
                    </div>
                )}

                {!loading && fauna.length === 0 && !error && (
                    <div className="fauna-empty"><p>No se encontraron fauna </p></div>
                )}

                {!loading && fauna.length > 0 && (
                    <div className="fauna-items-container">
                        {fauna.map((fauna) => (
                            <div key={fauna._id} className="fauna-item">
                                <div className="fauna-item-image">
                                    {fauna.image_url ? (
                                        <img src={fauna.image_url} alt={fauna.name} />
                                    ) : (
                                        <div className="fauna-placeholder"></div>
                                    )}
                                </div>
                                <div className="fauna-item-info">
                                    <h3 className="fauna-item-name">{fauna.name}</h3>
                                    <p className="fauna-item-description">{fauna.description}</p>
                                </div>
                                <div className="fauna-item-actions">
                                    {fauna.stats?.value && (
                                        <span className="value-text">{fauna.stats.value}</span>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div className="fauna-item-buttons">
                                            <button className="btn-edit" onClick={() => handleEditFauna(fauna)}>✎</button>
                                            <button className="btn-delete" onClick={() => handleDeleteFauna(fauna._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <FaunaForm 
                        fauna={editingFauna}
                        onSave={handleSaveFauna}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}