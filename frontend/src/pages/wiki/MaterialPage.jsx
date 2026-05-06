import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MaterialPage.css'
import { resourceService } from '../../services/resource.js'

export default function MaterialPage() {
    const navigate = useNavigate()
    const [materiales, setMateriales] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMateriales = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('material')
                setMateriales(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando materiales:', err)
                setError('Error al cargar los materiales')
                setMateriales([])
            } finally {
                setLoading(false)
            }
        }

        fetchMateriales()
    }, [])

    return (
        <div className="material-page-wrapper">
            <div className="material-page-content">

                <div className="material-header">
                    <h1 className="material-title">Materiales</h1>
                </div>

                {error && (
                    <div className="material-error">
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="material-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando materiales...</p>
                    </div>
                )}

                {!loading && materiales.length === 0 && !error && (
                    <div className="material-empty">
                        <p>No se encontraron materiales</p>
                    </div>
                )}

                {!loading && materiales.length > 0 && (
                    <div className="material-items-container">
                        {materiales.map((material) => (
                            <div
                                key={material._id}
                                className="material-item"
                            >
                                <div className="material-item-image">
                                    {material.image_url ? (
                                        <img
                                            src={material.image_url}
                                            alt={material.name}
                                            onError={(e) => {
                                                e.target.style.background = 'linear-gradient(135deg, #1a5a7a 0%, #0a3a4a 100%)'
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="material-placeholder"></div>
                                    )}
                                </div>

                                <div className="material-item-info">
                                    <h3 className="material-item-name">{material.name}</h3>
                                    <p className="material-item-description">{material.description}</p>
                                </div>

                                <div className="material-item-value">
                                    {material.stats && material.stats.value ? (
                                        <span className="value-text">{material.stats.value}</span>
                                    ) : (
                                        <span className="value-text">-</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}