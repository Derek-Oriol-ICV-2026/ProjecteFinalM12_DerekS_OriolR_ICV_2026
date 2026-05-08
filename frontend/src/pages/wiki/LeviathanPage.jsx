import { useEffect, useState } from 'react'
import './LeviathanPage.css'
import { resourceService } from '../../services/resource.js'

import { useAuth } from '../../context/AuthContext'
import LeviathanForm from './Forms/LeviathanForm'

export default function LeviathanPage() {
    const { user } = useAuth()
    const [leviathan, setLeviathan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingLeviathan, setEditingLeviathan] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    useEffect(() => {
        const fetchLeviathan = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('leviathan')
                setLeviathan(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando leviathan:', err)
                setError('Error al cargar los leviathan')
                setLeviathan([])
            } finally {
                setLoading(false)
            }
        }
        fetchLeviathan()
    }, [])

    const handleAddLeviathan = () => {
        setEditingLeviathan(null)
        setShowForm(true)
    }

    const handleEditLeviathan = (leviathan) => {
        setEditingLeviathan(leviathan)
        setShowForm(true)
    }

    const handleSaveLeviathan = async (leviathanData) => {
        try {
            setFormLoading(true)
            if (editingLeviathan) {
                const result = await resourceService.updateResource(editingLeviathan._id, leviathanData)
                if (result) {
                    setLeviathan(leviathan.map(m => m._id === editingLeviathan._id ? result : m))
                    setShowForm(false)
                    setEditingLeviathan(null)
                }
            } else {
                const result = await resourceService.createResource(leviathanData)
                if (result) {
                    setLeviathan([...leviathan, result])
                    setShowForm(false)
                }
            }
        } catch (err) {
            console.error('Error guardando leviathan:', err)
            alert('Error al guardar el leviathan')
        } finally {
            setFormLoading(false)
        }
    }

    const handleDeleteLeviathan = async (id) => {
        if (window.confirm('¿Estás seguro?')) {
            try {
                await resourceService.deleteResource(id)
                setLeviathan(leviathan.filter(m => m._id !== id))
            } catch (err) {
                console.error('Error eliminando leviathan:', err)
                alert('Error al eliminar')
            }
        }
    }

    const handleCloseForm = () => {
        setShowForm(false)
        setEditingLeviathan(null)
    }

    return (
        <div className="leviathan-page-wrapper">
            <div className="leviathan-page-content">
                <div className="leviathan-header">
                    <div className="leviathan-header-content">
                        <h1 className="leviathan-title">Leviathan</h1>
                        {user && user.role === 'admin' && (
                            <button className="btn-add" onClick={handleAddLeviathan}>+ Añadir</button>
                        )}
                    </div>
                </div>

                {error && <div className="leviathan-error"><p>{error}</p></div>}

                {loading && (
                    <div className="leviathan-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando leviathan...</p>
                    </div>
                )}

                {!loading && leviathan.length === 0 && !error && (
                    <div className="leviathan-empty"><p>No se encontraron leviathan</p></div>
                )}

                {!loading && leviathan.length > 0 && (
                    <div className="leviathan-items-container">
                        {leviathan.map((leviathan) => (
                            <div key={leviathan._id} className="leviathan-item">
                                <div className="leviathan-item-image">
                                    {leviathan.image_url ? (
                                        <img src={leviathan.image_url} alt={leviathan.name} />
                                    ) : (
                                        <div className="leviathan-placeholder"></div>
                                    )}
                                </div>
                                <div className="leviathan-item-info">
                                    <h3 className="leviathan-item-name">{leviathan.name}</h3>
                                    <p className="leviathan-item-description">{leviathan.description}</p>
                                </div>
                                <div className="leviathan-item-actions">
                                    {leviathan.stats?.value && (
                                        <span className="value-text">{leviathan.stats.value}</span>
                                    )}
                                    {user && user.role === 'admin' && (
                                        <div className="leviathan-item-buttons">
                                            <button className="btn-edit" onClick={() => handleEditLeviathan(leviathan)}>✎</button>
                                            <button className="btn-delete" onClick={() => handleDeleteLeviathan(leviathan._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showForm && (
                    <LeviathanForm 
                        leviathan={editingLeviathan}
                        onSave={handleSaveLeviathan}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}