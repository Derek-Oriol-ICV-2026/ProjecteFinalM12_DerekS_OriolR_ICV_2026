import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BiomePage.css'
import { biomeService } from '../../services/biomes'
import { useAuth } from '../../context/AuthContext'
import BiomeForm from './Forms/BiomeForm'

export default function BiomePage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [biomas, setBiomas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingBiome, setEditingBiome] = useState(null)
    const [formLoading, setFormLoading] = useState(false)

    // Cargar biomas
    useEffect(() => {
        const fetchBiomas = async () => {
            try {
                setLoading(true)
                const data = await biomeService.getAllBiomes()
                setBiomas(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando biomas:', err)
                setError('Error al cargar los biomas')
                setBiomas([])
            } finally {
                setLoading(false)
            }
        }

        fetchBiomas()
    }, [])

    // Manejar editar bioma
    const handleEditBiome = (bioma) => {
        setEditingBiome(bioma)
        setShowForm(true)
    }

    // Manejar guardar (solo editar)
    const handleSaveBiome = async (biomeData) => {
        try {
            setFormLoading(true)
            if (editingBiome) {
                // Actualizar
                const result = await biomeService.updateBiome(editingBiome._id, biomeData)
                if (result) {
                    setBiomas(biomas.map(b => b._id === editingBiome._id ? result : b))
                    setShowForm(false)
                    setEditingBiome(null)
                }
            }
        } catch (err) {
            console.error('Error guardando bioma:', err)
            alert('Error al guardar el bioma')
        } finally {
            setFormLoading(false)
        }
    }

    // Cerrar formulario
    const handleCloseForm = () => {
        setShowForm(false)
        setEditingBiome(null)
    }

    // Deduplicar biomas por nombre base (sin el número final)
    const getBaseName = (name) => name.replace(/\s+\d+$/, '').trim()

    const biomasUnicos = biomas.filter((bioma, index, self) => {
        const baseName = getBaseName(bioma.name)
        return index === self.findIndex(b => getBaseName(b.name) === baseName)
    })

    return (
        <div className="bioma-page-wrapper">
            <div className="bioma-page-content">
                {/* Header */}
                <div className="bioma-header">
                    <h1 className="bioma-title">Biomas</h1>
                </div>

                {error && (
                    <div className="bioma-error">
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="bioma-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando biomas...</p>
                    </div>
                )}

                {!loading && biomas.length === 0 && !error && (
                    <div className="bioma-empty">
                        <p>No se encontraron biomas</p>
                    </div>
                )}

                {!loading && biomas.length > 0 && (
                    <div className="bioma-items-container">
                        {biomasUnicos.map((bioma) => (
                            <div
                                key={bioma._id}
                                className="bioma-item"
                            >
                                {/* Left: Image/Color */}
                                <div className="bioma-item-image">
                                    {bioma.color ? (
                                        <div
                                            className="bioma-color"
                                            style={{ backgroundColor: bioma.color }}
                                            title={`Color: ${bioma.color}`}
                                        ></div>
                                    ) : (
                                        <div className="bioma-placeholder"></div>
                                    )}
                                </div>

                                {/* Center: Info */}
                                <div className="bioma-item-info">
                                    <h3 className="bioma-item-name">{getBaseName(bioma.name)}</h3>
                                    <p className="bioma-item-description">{bioma.description}</p>
                                </div>

                                {/* Right: Coordinates + Button */}
                                <div className="bioma-item-actions">
                                    <div className="bioma-item-coords">
                                        {bioma.polygon_coords && bioma.polygon_coords.length > 0 ? (
                                            <span className="coords-text">{bioma.polygon_coords.length} puntos</span>
                                        ) : (
                                            <span className="coords-text">-</span>
                                        )}
                                    </div>

                                    {/* Botón solo para admins */}
                                    {user && user.role === 'admin' && (
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditBiome(bioma)}
                                            title="Editar"
                                        >
                                            ✎
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Formulario */}
                {showForm && (
                    <BiomeForm
                        biome={editingBiome}
                        onSave={handleSaveBiome}
                        onClose={handleCloseForm}
                        loading={formLoading}
                    />
                )}
            </div>
        </div>
    )
}