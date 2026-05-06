import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BiomePage.css'
import { biomeService } from '../../services/biomes'

export default function BiomePage() {
    const navigate = useNavigate()
    const [biomas, setBiomas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                        {biomas.map((bioma) => (
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
                                    <h3 className="bioma-item-name">{bioma.name}</h3>
                                    <p className="bioma-item-description">{bioma.description}</p>
                                </div>

                                {/* Right: Coordinates Count */}
                                <div className="bioma-item-coords">
                                    {bioma.polygon_coords && bioma.polygon_coords.length > 0 ? (
                                        <span className="coords-text">{bioma.polygon_coords.length} puntos</span>
                                    ) : (
                                        <span className="coords-text">-</span>
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