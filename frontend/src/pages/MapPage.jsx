import { useEffect, useState } from 'react'
import { MapContainer, ImageOverlay, CircleMarker, Popup } from 'react-leaflet'
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
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ height: '100%', width: '100%', background: '#0a1628' }}
        maxZoom={2}
        minZoom={-3}
        zoomSnap={0.5}
      >
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
  )
}