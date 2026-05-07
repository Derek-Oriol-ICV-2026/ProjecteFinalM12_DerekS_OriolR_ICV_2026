import { useEffect, useState, useRef } from 'react'
import { MapContainer, SVGOverlay, ZoomControl, Marker, useMapEvents } from 'react-leaflet'
import { markerIcons } from '../utils/markerIcons'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import api from '../services/api'

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

const TYPE_LABELS = {
  fauna:     'Fauna',
  flora:     'Flora',
  material:  'Material',
  poi:       'Punto de interés',
  leviathan: 'Leviatán',
}

const TYPE_COLORS = {
  fauna:     '#ff6b6b',
  flora:     '#4ade80',
  material:  '#fbbf24',
  poi:       '#a78bfa',
  leviathan: '#fb7185',
}

const SVG_W = 3439
const SVG_H = 3579
const SCALE = 4000 / SVG_H
const HALF_W = (SVG_W * SCALE) / 2
const HALF_H = 2000
const SVG_BOUNDS = [[-HALF_H, -HALF_W], [HALF_H, HALF_W]]

function MapInitializer({ setMap }) {
  const map = useMapEvents({})
  useEffect(() => { setMap(map) }, [map])
  return null
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick })
  return null
}

function ResourcePanel({ marker, onClose }) {
  const resource = marker?.resource_id
  const visible = !!marker
  const typeColor = TYPE_COLORS[resource?.type] || '#60a5fa'

  const stats = resource?.stats
    ? (resource.stats instanceof Map
        ? Object.fromEntries(resource.stats)
        : typeof resource.stats === 'object' ? resource.stats : {})
    : {}
  const statsEntries = Object.entries(stats)

  return (
    <div style={{
      position:      'absolute',
      bottom:        '27px',
      left:          '30px',
      right:         '28px',
      zIndex:        500,
      opacity:       visible ? 1 : 0,
      transform:     visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
      transition:    'opacity 0.25s ease, transform 0.25s ease',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        background:     'rgba(8, 16, 36, 0.96)',
        border:         `1px solid ${typeColor}44`,
        borderRadius:   '12px',
        backdropFilter: 'blur(16px)',
        boxShadow:      `0 -4px 32px rgba(0,0,0,0.5), 0 0 0 1px ${typeColor}22`,
        overflow:       'hidden',
        display:        'flex',
        height:         '160px',
      }}>
        <div style={{ width: '4px', background: typeColor, flexShrink: 0 }} />
        <div style={{
          width:          '140px',
          flexShrink:     0,
          background:     'rgba(0,0,0,0.3)',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          overflow:       'hidden',
        }}>
          {resource?.image_url ? (
            <img src={resource.image_url} alt={resource.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: `${typeColor}22`, border: `2px solid ${typeColor}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
            }}>
              {resource?.type === 'fauna' ? '🐟' : resource?.type === 'flora' ? '🌿' : resource?.type === 'material' ? '💎' : resource?.type === 'leviathan' ? '🦑' : '📍'}
            </div>
          )}
        </div>
        <div style={{
          flex: 1, padding: '14px 20px', display: 'flex',
          flexDirection: 'column', gap: '6px', overflow: 'hidden',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: `${typeColor}22`, border: `1px solid ${typeColor}66`,
              color: typeColor, padding: '2px 10px', borderRadius: '20px',
              fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.08em', flexShrink: 0,
            }}>
              {TYPE_LABELS[resource?.type] || resource?.type}
            </span>
            <h3 style={{ margin: 0, color: '#e2e8f0', fontSize: '1.1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {resource?.name}
            </h3>
          </div>
          {marker?.biome_id?.name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#475569', fontSize: '0.75rem' }}>Bioma:</span>
              <span style={{ color: '#7dd3fc', fontSize: '0.75rem', fontWeight: '600' }}>{marker.biome_id.name}</span>
            </div>
          )}
          {resource?.description && (
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {resource.description}
            </p>
          )}
          {resource?.wiki_content && (
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', fontStyle: 'italic' }}>
              {resource.wiki_content}
            </p>
          )}
          <a href={`/wiki/${resource?._id}`} style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', color: typeColor, fontSize: '0.75rem', fontWeight: '600', textDecoration: 'none', opacity: 0.85, width: 'fit-content' }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.85}
          >
            Ver en la Wiki →
          </a>
        </div>
        {statsEntries.length > 0 && (
          <div style={{ width: '160px', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <span style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Stats</span>
            {statsEntries.map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'capitalize' }}>{key}</span>
                <span style={{ color: '#e2e8f0', fontSize: '0.8rem', fontWeight: '600' }}>{val}</span>
              </div>
            ))}
          </div>
        )}
        {marker?.notes && (
          <div style={{ width: '180px', flexShrink: 0, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Notas</span>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' }}>
              {marker.notes}
            </p>
          </div>
        )}
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#e2e8f0' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#64748b' }}
        >✕</button>
      </div>
    </div>
  )
}

function FilterPanel({ markers, activeTypes, setActiveTypes, activeBiomes, setActiveBiomes }) {
  const [open, setOpen] = useState(false)

  const uniqueBiomes = Object.values(
    markers.reduce((acc, m) => {
      if (m.biome_id?._id) acc[m.biome_id._id] = m.biome_id
      return acc
    }, {})
  )

  const toggleType = (type) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
  }

  const toggleBiome = (id) => {
    setActiveBiomes(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allTypesOn  = activeTypes.size === Object.keys(TYPE_LABELS).length
  const allBiomesOn = activeBiomes.size === uniqueBiomes.length
  const anyFilterOff = !allTypesOn || !allBiomesOn

  const resetAll = () => {
    setActiveTypes(new Set(Object.keys(TYPE_LABELS)))
    setActiveBiomes(new Set(uniqueBiomes.map(b => b._id)))
  }

  return (
    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: anyFilterOff ? 'rgba(96,165,250,0.25)' : 'rgba(8,16,36,0.88)', border: `1px solid ${anyFilterOff ? '#60a5fa' : 'rgba(96,165,250,0.3)'}`, borderRadius: '8px', color: anyFilterOff ? '#60a5fa' : '#94a3b8', padding: '8px 14px', cursor: 'pointer', fontWeight: '600', fontSize: '0.82rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s', letterSpacing: '0.04em' }}>
        <span style={{ fontSize: '1rem' }}>⚙</span>
        Filtros
        {anyFilterOff && (
          <span style={{ background: '#60a5fa', color: '#000', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: '800' }}>
            {Object.keys(TYPE_LABELS).length - activeTypes.size + uniqueBiomes.length - activeBiomes.size}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'absolute', top: '44px', right: 0, width: '260px', background: 'rgba(8,16,36,0.96)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Filtros del mapa</span>
            {anyFilterOff && <button onClick={resetAll} style={{ background: 'none', border: 'none', color: '#60a5fa', fontSize: '0.72rem', cursor: 'pointer', fontWeight: '600' }}>Mostrar todo</button>}
          </div>
          <div>
            <div style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '8px' }}>Tipo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {Object.entries(TYPE_LABELS).map(([type, label]) => {
                const active = activeTypes.has(type)
                const color = TYPE_COLORS[type] || '#60a5fa'
                return (
                  <button key={type} onClick={() => toggleType(type)} style={{ background: active ? `${color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? color + '88' : 'rgba(255,255,255,0.1)'}`, color: active ? color : '#475569', borderRadius: '20px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s' }}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: '#475569', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Bioma</span>
              <button onClick={() => { if (allBiomesOn) setActiveBiomes(new Set()); else setActiveBiomes(new Set(uniqueBiomes.map(b => b._id))) }} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '0.7rem', cursor: 'pointer' }}>
                {allBiomesOn ? 'Ninguno' : 'Todos'}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
              {uniqueBiomes.map(biome => {
                const active = activeBiomes.has(biome._id)
                const color = biome.color || '#60a5fa'
                return (
                  <button key={biome._id} onClick={() => toggleBiome(biome._id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: active ? `${color}11` : 'transparent', border: `1px solid ${active ? color + '44' : 'transparent'}`, borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: active ? color : '#1e293b', border: `2px solid ${color}`, transition: 'all 0.15s' }} />
                    <span style={{ color: active ? '#e2e8f0' : '#475569', fontSize: '0.78rem', fontWeight: '500' }}>{biome.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', color: '#475569', fontSize: '0.72rem', textAlign: 'center' }}>
            Mostrando marcadores de {activeTypes.size} tipo{activeTypes.size !== 1 ? 's' : ''} · {activeBiomes.size} bioma{activeBiomes.size !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MapPage() {
  const [markers, setMarkers] = useState([])
  const [activeTypes, setActiveTypes] = useState(new Set(Object.keys(TYPE_LABELS)))
  const [activeBiomes, setActiveBiomes] = useState(null)
  const [isAlternativeVideo, setIsAlternativeVideo] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [hoveredBioma, setHoveredBioma] = useState(null)
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [biomas, setBiomas] = useState([])
  const [map, setMap] = useState(null)
  const videoRef = useRef(null)
  const polygonsRef = useRef([])

  useEffect(() => {
    api.get('/markers')
      .then(res => {
        setMarkers(res.data)
        const biomeIds = new Set(res.data.map(m => m.biome_id?._id).filter(Boolean))
        setActiveBiomes(biomeIds)
      })
      .catch(err => console.error(err))

    fetch('http://localhost:5000/api/biomas/')
      .then(res => res.json())
      .then(data => setBiomas(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (!map || biomas.length === 0) return

    polygonsRef.current.forEach(p => { if (map.hasLayer(p)) map.removeLayer(p) })
    polygonsRef.current = []

    biomas.forEach((bioma) => {
      const latLngs = bioma.polygon_coords.map(([x, y]) => [
        HALF_H - (y * SCALE),
        (x * SCALE) - HALF_W
      ])

      const polygon = L.polygon(latLngs, {
        color: '#1a0a4a',
        weight: 1,
        fillColor: bioma.color || '#2D127E',
        fillOpacity: 1
      })

      polygon.on('mouseover', () => {
        polygon.setStyle({ fillColor: bioma.color, fillOpacity: 0.8 })
        setHoveredBioma(bioma.name)
      })
      polygon.on('mouseout', () => {
        polygon.setStyle({ fillColor: bioma.color || '#c1effd', fillOpacity: 0.5 })
        setHoveredBioma(null)
      })

      polygonsRef.current.push(polygon)
    })

    return () => {
      polygonsRef.current.forEach(p => { if (map.hasLayer(p)) map.removeLayer(p) })
    }
  }, [map, biomas])

  const filteredMarkers = markers.filter(m =>
    activeTypes.has(m.resource_id?.type) &&
    (activeBiomes === null || activeBiomes.has(m.biome_id?._id))
  )

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
        style={{ position: 'fixed', top: 80, left: 0, width: '100%', height: 'calc(100vh - 80px)', objectFit: 'cover', zIndex: 1, pointerEvents: 'none', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}
        autoPlay muted loop={!isAlternativeVideo} playsInline key={isAlternativeVideo ? 'alt' : 'main'}
      >
        <source src={isAlternativeVideo ? '/subnauticaFondoAnimalEdit.mp4' : '/subnautica_liveWallpaper.mp4'} type="video/mp4" />
      </video>

      {showButton && (
        <button onClick={handleVideoChange} style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100, background: 'rgba(96, 165, 250, 0.2)', border: '2px solid rgba(96, 165, 250, 0.5)', color: '#60a5fa', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-in-out' }}
          onMouseEnter={e => { e.target.style.background = 'rgba(96, 165, 250, 0.3)'; e.target.style.borderColor = '#60a5fa' }}
          onMouseLeave={e => { e.target.style.background = 'rgba(96, 165, 250, 0.2)'; e.target.style.borderColor = 'rgba(96, 165, 250, 0.5)' }}
        >
          Atacar Criatura
        </button>
      )}

      <div style={{ height: '90vh', width: '100%', marginTop: '80px', padding: '30px', position: 'relative', zIndex: 10, boxSizing: 'border-box', overflow: 'visible' }}>
        <MapContainer
          zoomControl={false}
          crs={L.CRS.Simple}
          bounds={SVG_BOUNDS}
          style={{ height: '100%', width: '100%', background: '#0a1628', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)', border: '2px solid rgba(96, 165, 250, 0.2)' }}
          maxZoom={2}
          minZoom={-3}
          zoomSnap={0.2}
          attributionControl={false}
        >
          <ZoomControl position="topleft" />
          <MapInitializer setMap={setMap} />
          <MapClickHandler onMapClick={() => setSelectedMarker(null)} />

          <SVGOverlay bounds={SVG_BOUNDS} className="biome-svg-overlay">
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <rect width={SVG_W} height={SVG_H} fill="#1E1E1E" />
            </svg>
          </SVGOverlay>

          {filteredMarkers.map(marker => (
            <Marker
              key={marker._id}
              position={[marker.y, marker.x]}
              icon={markerIcons[marker.resource_id?.type] || markerIcons.default}
              eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelectedMarker(marker) } }}
            />
          ))}
        </MapContainer>

        {activeBiomes !== null && (
          <FilterPanel
            markers={markers}
            activeTypes={activeTypes}
            setActiveTypes={setActiveTypes}
            activeBiomes={activeBiomes}
            setActiveBiomes={setActiveBiomes}
          />
        )}

        <ResourcePanel marker={selectedMarker} onClose={() => setSelectedMarker(null)} />

        {hoveredBioma && !selectedMarker && (
          <div style={{ position: 'absolute', bottom: '50px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(10, 22, 40, 0.92)', border: `2px solid ${BIOME_COLORS[hoveredBioma] || '#60a5fa'}`, borderRadius: '8px', padding: '8px 24px', color: BIOME_COLORS[hoveredBioma] || '#60a5fa', fontWeight: '700', fontSize: '1rem', zIndex: 1000, backdropFilter: 'blur(8px)', pointerEvents: 'none', whiteSpace: 'nowrap', boxShadow: `0 0 24px ${BIOME_COLORS[hoveredBioma]}55`, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {BIOME_NAMES[hoveredBioma] || hoveredBioma}
          </div>
        )}
      </div>

      <div style={{ minHeight: '100vh', background: 'rgba(10, 22, 40, 0.8)', padding: '4rem 2rem', color: '#fff', position: 'relative', zIndex: 5, opacity: 0 }}>
        <h2>Sección adicional</h2>
        <p>Aquí irá contenido futuro (Wiki, etc...)</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}