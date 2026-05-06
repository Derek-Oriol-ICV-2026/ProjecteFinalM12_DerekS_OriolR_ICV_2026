import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FaunaPage.css'
import { resourceService } from '../../services/resource.js'

export default function FaunaPage() {
    const navigate = useNavigate()
    const [fauna, setFauna] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    return (
        <div className="fauna-page-wrapper">
            <div className="fauna-page-content">

                <div className="fauna-header">
                    <h1 className="fauna-title">Fauna</h1>
                </div>


                {error && (
                    <div className="fauna-error">
                        <p>{error}</p>
                    </div>
                )}


                {loading && (
                    <div className="fauna-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando fauna...</p>
                    </div>
                )}


                {!loading && fauna.length === 0 && !error && (
                    <div className="fauna-empty">
                        <p>No se encontraron fauna</p>
                    </div>
                )}


                {!loading && fauna.length > 0 && (
                    <div className="fauna-items-container">
                        {fauna.map((fauna) => (
                            <div
                                key={fauna._id}
                                className="fauna-item"
                            >

                                <div className="fauna-item-image">
                                    {fauna.image_url ? (
                                        <img
                                            src={fauna.image_url}
                                            alt={fauna.name}
                                            onError={(e) => {
                                                e.target.style.background = 'linear-gradient(135deg, #1a5a7a 0%, #0a3a4a 100%)'
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="fauna-placeholder"></div>
                                    )}
                                </div>


                                <div className="fauna-item-info">
                                    <h3 className="fauna-item-name">{fauna.name}</h3>
                                    <p className="fauna-item-description">{fauna.description}</p>
                                </div>


                                <div className="fauna-item-value">
                                    {fauna.stats && fauna.stats.value ? (
                                        <span className="value-text">{fauna.stats.value}</span>
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