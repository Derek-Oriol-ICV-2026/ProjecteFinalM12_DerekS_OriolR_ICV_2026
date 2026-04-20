import { useEffect, useState } from 'react'
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

  useEffect(() => {
    api.get('/markers')
      .then(res => setMarkers(res.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      {/* VIDEO DE FONDO FIJO */}
      <video 
        style={{
          position: 'fixed',
          top: 80,
          left: 0,
          width: '100%',
          height: 'calc(100vh - 80px)',
          objectFit: 'cover',
          zIndex: 1,
          pointerEvents: 'none',
          filter: 'brightness(1)'
        }}
        autoPlay 
        muted 
        loop 
        playsInline
      >
          <source src="/subnautica_liveWallpaper.mp4" type="video/mp4" />
      </video>

      {/* MAPA CON MÁRGENES PARA VER VIDEO EN BORDES */}
      <div style={{ 
        height: '100vh', 
        width: '100%',
        padding: '30px',
        position: 'relative',
        zIndex: 10,
        boxSizing: 'border-box',
        marginTop: '80px'
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
    </>
  )
}