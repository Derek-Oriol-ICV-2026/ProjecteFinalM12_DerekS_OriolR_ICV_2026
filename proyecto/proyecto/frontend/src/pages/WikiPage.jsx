import { useNavigate } from 'react-router-dom'
import './WikiPage.css'
import { markerIcons } from '../utils/markerIcons'

export default function WikiPage() {
    const navigate = useNavigate()
    
    const categories = [
        {
            id: 1,
            name: 'Materiales',
            icon: 'materials',
            path: '/wiki/materiales',
            bgImage: 'fondoMateriales.png'
        },
        {
            id: 2,
            name: 'Fauna',
            icon: 'fauna',
            path: '/wiki/fauna',
            bgImage: 'fondoFauna.png'
        },
        {
            id: 3,
            name: 'Flora',
            icon: 'flora',
            path: '/wiki/flora',
            bgImage: 'fondoFlora.png'
        },
        {
            id: 4,
            name: 'Leviatanes',
            icon: 'leviathans',
            path: '/wiki/leviatanes',
            bgImage: 'fondoLeviatanes.png'
        }
    ]

    return (
        <div className="wiki-page-wrapper">
            <div className="wiki-page-content">
                <div className="wiki-cards-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="wiki-card-item"
                            onClick={() => navigate(category.path)}
                        >
                            <div
                                className="wiki-card-background"
                                style={{
                                    backgroundImage: `url('/${category.bgImage}')`
                                }}
                            >
                                <div className="wiki-card-overlay"></div>
                            </div>

                            <div className="wiki-card-content">
                                <div className="wiki-svg-container">
                                    <div
                                        className="wiki-svg-box"
                                        dangerouslySetInnerHTML={{
                                            __html: markerIcons[category.icon]?.options?.html
                                        }}
                                    />
                                </div>

                                <h2 className="wiki-card-name">{category.name}</h2>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}