import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LeviathanPage.css'
import { resourceService } from '../../services/resource.js'

export default function LeviathanPage() {
    const navigate = useNavigate()
    const [leviathan, setLeviathan] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    return (
        <div className="leviathan-page-wrapper">
            <div className="leviathan-page-content">
                {/* Header */}
                <div className="leviathan-header">
                    <h1 className="leviathan-title">Leviatanes</h1>
                </div>

                {error && (
                    <div className="leviathan-error">
                        <p>{error}</p>
                    </div>
                )}

                {loading && (
                    <div className="leviathan-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando leviathan...</p>
                    </div>
                )}

                {!loading && leviathan.length === 0 && !error && (
                    <div className="leviathan-empty">
                        <p>No se encontraron leviathan</p>
                    </div>
                )}

                {!loading && leviathan.length > 0 && (
                    <div className="leviathan-items-container">
                        {leviathan.map((leviathan) => (
                            <div
                                key={leviathan._id}
                                className="leviathan-item"
                            >
                                <div className="leviathan-item-image">
                                    {leviathan.image_url ? (
                                        <img
                                            src={leviathan.image_url}
                                            alt={leviathan.name}
                                            onError={(e) => {
                                                e.target.style.background = 'linear-gradient(135deg, #1a5a7a 0%, #0a3a4a 100%)'
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="leviathan-placeholder"></div>
                                    )}
                                </div>

                                <div className="leviathan-item-info">
                                    <h3 className="leviathan-item-name">{leviathan.name}</h3>
                                    <p className="leviathan-item-description">{leviathan.description}</p>
                                </div>

                                <div className="leviathan-item-value">
                                    {leviathan.stats && leviathan.stats.value ? (
                                        <span className="value-text">{leviathan.stats.value}</span>
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