import { useEffect, useState, useRef } from 'react'
import { MapContainer, SVGOverlay, ZoomControl, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import api from '../services/api'
import { SubnauticaMapPaths } from '../components/SubnauticaMapSVG'

const BIOME_COLORS = {
  aguas_seguras:             '#00d4ff',
  bosque_de_algas:           '#2d8a4e',
  mesetas_herbosas:          '#6abf69',
  bosque_de_setas:           '#e8a0c8',
  zona_de_algas_sangrientas: '#cc0000',
  gran_arrecife:             '#1a6fa8',
  islas_submarinas:          '#48c9b0',
  zona_de_bulbos:            '#f39c12',
  campo_de_riscos:           '#7f8c8d',
  dunas:                     '#d4ac0d',
  montanas:                  '#5d6d7e',
  arrecife_disperso:         '#5dade2',
  sendero_de_caminantes:     '#a569bd',
  aurora:                    '#e74c3c',
  zona_de_aterrizaje:        '#e67e22',
}

const BIOME_NAMES = {
  aguas_seguras:             'Aguas Seguras',
  bosque_de_algas:           'Bosque de Algas',
  mesetas_herbosas:          'Mesetas Herbosas',
  bosque_de_setas:           'Bosque de Setas',
  zona_de_algas_sangrientas: 'Zona de Algas Sangrientas',
  gran_arrecife:             'Gran Arrecife',
  islas_submarinas:          'Islas Submarinas',
  zona_de_bulbos:            'Zona de Bulbos',
  campo_de_riscos:           'Campo de Riscos',
  dunas:                     'Dunas',
  montanas:                  'Montañas',
  arrecife_disperso:         'Arrecife Disperso',
  sendero_de_caminantes:     'Sendero de Caminantes',
  aurora:                    'Aurora (Zona de Impacto)',
  zona_de_aterrizaje:        'Zona de Aterrizaje',
}

const categoryColors = {
  fauna:     '#ff0040',
  flora:     '#4ade80',
  mineral:   '#f97316',
  poi:       '#a78bfa',
  leviathan: '#fb7185',
}


const SVG_W = 3439
const SVG_H = 3579
const SCALE = 4000 / SVG_H
const HALF_W = (SVG_W * SCALE) / 2
const HALF_H = 2000
const SVG_BOUNDS = [[-HALF_H, -HALF_W], [HALF_H, HALF_W]]

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [isAlternativeVideo, setIsAlternativeVideo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [hoveredBiome, setHoveredBiome] = useState(null)
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
      setTimeout(() => setIsTransitioning(false), 500)
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
      <video
        ref={videoRef}
        onEnded={handleVideoEnd}
        style={{
          position:      'fixed',
          top:           80,
          left:          0,
          width:         '100%',
          height:        'calc(100vh - 80px)',
          objectFit:     'cover',
          zIndex:        1,
          pointerEvents: 'none',
          opacity:       isTransitioning ? 0 : 1,
          transition:    'opacity 0.5s ease-in-out',
        }}
        autoPlay
        muted
        loop={!isAlternativeVideo}
        playsInline
        key={isAlternativeVideo ? 'alt' : 'main'}
      >
        <source
          src={isAlternativeVideo ? '/subnauticaFondoAnimalEdit.mp4' : '/subnautica_liveWallpaper.mp4'}
          type="video/mp4"
        />
      </video>

      {showButton && (
        <button
          onClick={handleVideoChange}
          style={{
            position:       'fixed',
            bottom:         '30px',
            right:          '30px',
            zIndex:         100,
            background:     'rgba(96, 165, 250, 0.2)',
            border:         '2px solid rgba(96, 165, 250, 0.5)',
            color:          '#60a5fa',
            padding:        '12px 24px',
            borderRadius:   '8px',
            cursor:         'pointer',
            fontWeight:     '600',
            fontSize:       '0.95rem',
            transition:     'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            animation:      'fadeIn 0.3s ease-in-out',
          }}
          onMouseEnter={e => {
            e.target.style.background  = 'rgba(96, 165, 250, 0.3)'
            e.target.style.borderColor = '#60a5fa'
          }}
          onMouseLeave={e => {
            e.target.style.background  = 'rgba(96, 165, 250, 0.2)'
            e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)'
          }}
        >
          Atacar Criatura
        </button>
      )}

      <div style={{
        height:     '100vh',
        width:      '100%',
        marginTop:  '80px',
        padding:    '30px',
        position:   'relative',
        zIndex:     10,
        boxSizing:  'border-box',
      }}>
        <MapContainer
          zoomControl={false}
          crs={L.CRS.Simple}
          bounds={SVG_BOUNDS}
          style={{
            height:       '100%',
            width:        '100%',
            background:   '#0a1628',
            borderRadius: '12px',
            boxShadow:    '0 8px 32px rgba(0, 0, 0, 0.6)',
            border:       '2px solid rgba(96, 165, 250, 0.2)',
          }}
          maxZoom={2}
          minZoom={-3}
          zoomSnap={0.5}
          attributionControl={false}
        >
          <ZoomControl position="bottomleft" />


          <SVGOverlay bounds={SVG_BOUNDS} className="biome-svg-overlay">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: '100%' }}
            >

              <SubnauticaMapPaths
                biomeColors={BIOME_COLORS}
                hoveredBiome={hoveredBiome}
                setHoveredBiome={setHoveredBiome}
              />
            </svg>
          </SVGOverlay>

          {markers.map(marker => (
            <CircleMarker
              key={marker._id}
              center={[marker.y, marker.x]}
              radius={8}
              pathOptions={{
                color:       categoryColors[marker.resource_id?.type] || '#fff',
                fillColor:   categoryColors[marker.resource_id?.type] || '#fff',
                fillOpacity: 0.9,
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

        {hoveredBiome && (
          <div style={{
            position:       'absolute',
            bottom:         '50px',
            left:           '50%',
            transform:      'translateX(-50%)',
            background:     'rgba(10, 22, 40, 0.92)',
            border:         `2px solid ${BIOME_COLORS[hoveredBiome] || '#60a5fa'}`,
            borderRadius:   '8px',
            padding:        '8px 24px',
            color:          BIOME_COLORS[hoveredBiome] || '#60a5fa',
            fontWeight:     '700',
            fontSize:       '1rem',
            zIndex:         1000,
            backdropFilter: 'blur(8px)',
            pointerEvents:  'none',
            whiteSpace:     'nowrap',
            boxShadow:      `0 0 24px ${BIOME_COLORS[hoveredBiome]}55`,
            letterSpacing:  '0.06em',
            textTransform:  'uppercase',
          }}>
            {BIOME_NAMES[hoveredBiome] || hoveredBiome}
          </div>
        )}
      </div>

      <div style={{
        minHeight:  '100vh',
        background: 'rgba(10, 22, 40, 0.8)',
        padding:    '4rem 2rem',
        color:      '#fff',
        position:   'relative',
        zIndex:     5,
        opacity:    0,
      }}>
        <h2>Sección adicional</h2>
        <p>Aquí irá contenido futuro (Wiki, etc...)</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Activar pointer-events en el SVGOverlay de Leaflet.
           Por defecto Leaflet pone pointer-events: none en overlayPane.
           Con esto los onMouseEnter/Leave del SVG funcionan. */
        .leaflet-overlay-pane .biome-svg-overlay,
        .leaflet-overlay-pane .biome-svg-overlay svg,
        .leaflet-overlay-pane .biome-svg-overlay svg path {
          pointer-events: auto !important;
        }
      `}</style>
    </>
  )
}