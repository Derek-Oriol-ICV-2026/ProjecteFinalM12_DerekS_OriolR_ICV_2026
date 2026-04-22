import { useEffect, useState, useRef } from 'react'
import { MapContainer, ImageOverlay, CircleMarker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import api from '../services/api'

const bounds = [[-2000, -2000], [2000, 2000]]

const categoryColors = {
  fauna: '#ff0040',
  flora: '#4ade80',
  mineral: '#f97316',
  poi: '#a78bfa',
  leviathan: '#fb7185'
}

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [isAlternativeVideo, setIsAlternativeVideo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    api.get('/markers')
      .then(res => setMarkers(res.data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }, [isAlternativeVideo])

  const handleVideoChange = () => {
    setShowButton(false)
    setIsTransitioning(true)
    
    setTimeout(() => {
      setIsAlternativeVideo(true)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
    }, 500)
  }

  const handleVideoEnd = () => {
    if (isAlternativeVideo) {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setIsAlternativeVideo(false)
        setTimeout(() => {
          setIsTransitioning(false)
          setShowButton(true)
        }, 500)
      }, 500)
    }
  }

  return (
    <>
      {/* VIDEO DE FONDO CON TRANSICIONES */}
      <video 
        ref={videoRef}
        onEnded={handleVideoEnd}
        style={{
          position: 'fixed',
          top: 80,
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none',
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out'
        }}
        autoPlay 
        muted 
        loop={!isAlternativeVideo}
        playsInline
        key={isAlternativeVideo ? 'alt' : 'main'}
      >
        <source 
          src={isAlternativeVideo ? "/subnauticaFondoAnimalEdit.mp4" : "/subnautica_liveWallpaper.mp4"} 
          type="video/mp4" 
        />
      </video>

      {/* BOTÓN FLOTANTE PARA CAMBIAR VIDEO - DESAPARECE AL HACER CLICK */}
      {showButton && (
        <button
          onClick={handleVideoChange}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 100,
            background: 'rgba(96, 165, 250, 0.2)',
            border: '2px solid rgba(96, 165, 250, 0.5)',
            color: '#60a5fa',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(96, 165, 250, 0.3)'
            e.target.style.borderColor = '#60a5fa'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(96, 165, 250, 0.2)'
            e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)'
          }}
        >
          Atacar Criatura
        </button>
      )}

      {/* MAPA CON MÁRGENES PARA VER VIDEO EN BORDES */}
      <div style={{ 
        height: '100vh', 
        width: '100%',
        marginTop: '80px',
        padding: '30px',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box'
      }}>
        <MapContainer
          zoomControl={false}
          crs={L.CRS.Simple}
          bounds={bounds}
          style={{ 
            height: '100%', 
            width: '100%', 
            background: '#0a1628',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(96, 165, 250, 0.2)'
          }}
          maxZoom={2}
          minZoom={-3}
          zoomSnap={0.5}
          attributionControl={false}
        >
          <ZoomControl position="bottomleft" />
          <ImageOverlay url="/subnauticaMap.jpg" bounds={bounds} />

          <CircleMarker
            center={[0, 0]}
            radius={8}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
          >
            <Popup>Centre [0, 0]</Popup>
          </CircleMarker>

          {markers.map(marker => (
            <CircleMarker
              key={marker._id}
              center={[marker.y, marker.x]}
              radius={8}
              pathOptions={{
                color: categoryColors[marker.resource_id?.type] || '#fff',
                fillColor: categoryColors[marker.resource_id?.type] || '#fff',
                fillOpacity: 0.9
              }}
            >
              <Popup>
                <b>{marker.resource_id?.name}</b><br />
                {marker.resource_id?.type}<br />
                {marker.resource_id?.description}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* ÁREA PARA SCROLL Y VER VIDEO */}
      <div style={{
        minHeight: '100vh',
        background: 'rgba(10, 22, 40, 0.8)',
        padding: '4rem 2rem',
        color: '#fff',
        position: 'relative',
        zIndex: 5,
        opacity: 0,
      }}>
        <h2>Sección adicional</h2>
        <p>Aquí irá contenido futuro (Wiki, etc...)</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}