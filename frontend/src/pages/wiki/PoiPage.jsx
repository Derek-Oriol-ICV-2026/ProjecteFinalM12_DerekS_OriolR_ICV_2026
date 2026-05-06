import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PoiPage.css'
import { resourceService } from '../../services/resource.js'

export default function PoiPage() {
    const navigate = useNavigate()
    const [poi, setPoi] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    return (
        <div className="poi-page-wrapper">
            <div className="poi-page-content">

                <div className="poi-header">
                    <h1 className="poi-title">Poi</h1>
                </div>

                {error && (
                    <div className="poi-error">
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="poi-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando poi...</p>
                    </div>
                )}

                {!loading && poi.length === 0 && !error && (
                    <div className="poi-empty">
                        <p>No se encontraron poi</p>
                    </div>
                )}

                {!loading && poi.length > 0 && (
                    <div className="poi-items-container">
                        {poi.map((poi) => (
                            <div
                                key={poi._id}
                                className="poi-item"
                            >
                                <div className="poi-item-image">
                                    {poi.image_url ? (
                                        <img
                                            src={poi.image_url}
                                            alt={poi.name}
                                            onError={(e) => {
                                                e.target.style.background = 'linear-gradient(135deg, #1a5a7a 0%, #0a3a4a 100%)'
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="poi-placeholder"></div>
                                    )}
                                </div>

                                <div className="poi-item-info">
                                    <h3 className="poi-item-name">{poi.name}</h3>
                                    <p className="poi-item-description">{poi.description}</p>
                                </div>

                                <div className="poi-item-value">
                                    {poi.stats && poi.stats.value ? (
                                        <span className="value-text">{poi.stats.value}</span>
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