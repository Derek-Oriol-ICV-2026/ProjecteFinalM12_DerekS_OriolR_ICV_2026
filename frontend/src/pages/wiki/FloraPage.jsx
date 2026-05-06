import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FloraPage.css'
import { resourceService } from '../../services/resource.js'

export default function FloraPage() {
    const navigate = useNavigate()
    const [flora, setFlora] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFlora = async () => {
            try {
                setLoading(true)
                const data = await resourceService.getResourcesByType('flora')
                setFlora(data)
                setError(null)
            } catch (err) {
                console.error('Error cargando flora:', err)
                setError('Error al cargar los flora')
                setFlora([])
            } finally {
                setLoading(false)
            }
        }

        fetchFlora()
    }, [])

    return (
        <div className="flora-page-wrapper">
            <div className="flora-page-content">

                <div className="flora-header">
                    <h1 className="flora-title">Flora</h1>
                </div>

                {error && (
                    <div className="flora-error">
                        <p>{error}</p>
                    </div>
                )}


                {loading && (
                    <div className="flora-loading">
                        <div className="loading-spinner"></div>
                        <p>Cargando flora...</p>
                    </div>
                )}


                {!loading && flora.length === 0 && !error && (
                    <div className="flora-empty">
                        <p>No se encontraron flora</p>
                    </div>
                )}


                {!loading && flora.length > 0 && (
                    <div className="flora-items-container">
                        {flora.map((flora) => (
                            <div
                                key={flora._id}
                                className="flora-item"
                            >

                                <div className="flora-item-image">
                                    {flora.image_url ? (
                                        <img
                                            src={flora.image_url}
                                            alt={flora.name}
                                            onError={(e) => {
                                                e.target.style.background = 'linear-gradient(135deg, #1a5a7a 0%, #0a3a4a 100%)'
                                                e.target.style.display = 'none'
                                            }}
                                        />
                                    ) : (
                                        <div className="flora-placeholder"></div>
                                    )}
                                </div>


                                <div className="flora-item-info">
                                    <h3 className="flora-item-name">{flora.name}</h3>
                                    <p className="flora-item-description">{flora.description}</p>
                                </div>


                                <div className="flora-item-value">
                                    {flora.stats && flora.stats.value ? (
                                        <span className="value-text">{flora.stats.value}</span>
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