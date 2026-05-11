import { useState, useEffect, useRef } from 'react'
import api from '../services/api'
import L from 'leaflet'
import { markerIcons } from '../utils/markerIcons'

const MARKER_TYPES = {
  fauna:     { label: 'Fauna',    icon: markerIcons.fauna?.options?.html, color: '#ff6b6b', desc: 'Criaturas marinas' },
  flora:     { label: 'Flora',    icon: markerIcons.flora?.options?.html, color: '#4ade80', desc: 'Plantas y algas'   },
  material:  { label: 'Material', icon: markerIcons.material?.options?.html, color: '#fbbf24', desc: 'Recursos y minerales' },
  poi:       { label: 'PDI',      icon: markerIcons.pdi?.options?.html, color: '#a78bfa', desc: 'Puntos de interés' },
  leviathan: { label: 'Leviatán', icon: markerIcons.leviathan?.options?.html, color: '#fb7185', desc: 'Leviatanes'        },
}

export function DragDropResourceTool({ mapRef, onClose, onMarkerCreated }) {
  const [biomes, setBiomes]                   = useState([])
  const [resources, setResources]             = useState([])
  const [loadingRes, setLoadingRes]           = useState(false)
  const [draggedType, setDraggedType]         = useState(null)
  const [dropState, setDropState]             = useState(null)   
  const [search, setSearch]                   = useState('')
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedBiome, setSelectedBiome]     = useState('')
  const [notes, setNotes]                     = useState('')
  const [loading, setLoading]                 = useState(false)
  const [message, setMessage]                 = useState({ text: '', type: '' })
  const tempMarkerRef = useRef(null)
  const searchRef     = useRef(null)

  useEffect(() => {
    api.get('/biomes').then(r => setBiomes(r.data)).catch(console.error)
  }, [])

  useEffect(() => {
    if (!dropState) return
    setLoadingRes(true)
    api.get('/resources')
      .then(r => {
        setResources(r.data.filter(res => res.type === dropState.type))
      })
      .catch(console.error)
      .finally(() => setLoadingRes(false))
    setTimeout(() => searchRef.current?.focus(), 100)
  }, [dropState])

  useEffect(() => {
    if (!mapRef?.current) return
    const map       = mapRef.current
    const container = map.getContainer()

    const onDragOver = (e) => {
      if (!draggedType) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      container.style.cursor = 'crosshair'
    }

    const onDragLeave = () => {
      container.style.cursor = ''
    }

    const onDrop = (e) => {
      e.preventDefault()
      container.style.cursor = ''
      if (!draggedType) return

      const rect  = container.getBoundingClientRect()
      const point = L.point(e.clientX - rect.left, e.clientY - rect.top)
      const latlng = map.containerPointToLatLng(point)

      if (tempMarkerRef.current) tempMarkerRef.current.remove()
      const icon = markerIcons[draggedType] || markerIcons.default
      tempMarkerRef.current = L.marker([latlng.lat, latlng.lng], { icon, opacity: 0.6 })
        .addTo(map)

      setDropState({ coords: { lat: latlng.lat, lng: latlng.lng }, type: draggedType })
      setDraggedType(null)
      setSelectedResource(null)
      setSelectedBiome('')
      setSearch('')
      setNotes('')
      setMessage({ text: '', type: '' })
    }

    container.addEventListener('dragover', onDragOver)
    container.addEventListener('dragleave', onDragLeave)
    container.addEventListener('drop', onDrop)
    return () => {
      container.removeEventListener('dragover', onDragOver)
      container.removeEventListener('dragleave', onDragLeave)
      container.removeEventListener('drop', onDrop)
    }
  }, [mapRef, draggedType])

  const cancelDrop = () => {
    if (tempMarkerRef.current) { tempMarkerRef.current.remove(); tempMarkerRef.current = null }
    setDropState(null)
    setMessage({ text: '', type: '' })
  }

  const handleSubmit = async () => {
    if (!selectedResource) return setMessage({ text: '⚠️ Selecciona un recurso', type: 'warn' })
    if (!selectedBiome)    return setMessage({ text: '⚠️ Selecciona un bioma',   type: 'warn' })

    setLoading(true)
    try {
      await api.post('/markers', {
        resource_id: selectedResource._id,
        biome_id:    selectedBiome,
        x:           dropState.coords.lng,
        y:           dropState.coords.lat,
        notes,
      })

      if (tempMarkerRef.current) { tempMarkerRef.current.remove(); tempMarkerRef.current = null }
      setMessage({ text: ' Marcador creado correctamente', type: 'ok' })
      onMarkerCreated?.()

      setTimeout(() => { setDropState(null); setMessage({ text: '', type: '' }) }, 1500)
    } catch (err) {
      setMessage({ text: ` ${err.response?.data?.error || err.message}`, type: 'err' })
    } finally {
      setLoading(false)
    }
  }

  const filteredResources = resources.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase())
  )

  const typeInfo = dropState ? MARKER_TYPES[dropState.type] : null

  return (
    <>
      {/* Panel lateral  */}
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.panelHeader}>
          <span style={styles.panelTitle}>📍 Añadir Marcador</span>
          <button onClick={onClose} style={styles.closeBtn} title="Cerrar">✕</button>
        </div>

        <p style={styles.panelHint}>
          Arrastra un tipo al punto del mapa donde quieres colocarlo
        </p>

        {/* Cards */}
        <div style={styles.typeGrid}>
          {Object.entries(MARKER_TYPES).map(([type, info]) => (
            <div
              key={type}
              draggable
              onDragStart={e => { setDraggedType(type); e.dataTransfer.effectAllowed = 'copy' }}
              onDragEnd={() => setDraggedType(null)}
              style={{
                ...styles.typeCard,
                borderColor: draggedType === type ? info.color : `${info.color}55`,
                background:  draggedType === type ? `${info.color}22` : `${info.color}0d`,
                transform:   draggedType === type ? 'scale(0.96)' : 'scale(1)',
              }}
            >
              <span
                style={{ fontSize: '1.8rem', lineHeight: 1 }}
                dangerouslySetInnerHTML={{ __html: info.icon }}
              />
              <span style={{ ...styles.typeLabel, color: info.color }}>{info.label}</span>
              <span style={styles.typeDesc}>{info.desc}</span>
            </div>
          ))}
        </div>

        {/* Indicador  */}
        {draggedType && (
          <div style={{ ...styles.dragIndicator, borderColor: MARKER_TYPES[draggedType].color, color: MARKER_TYPES[draggedType].color }}>
            Suelta en el mapa para colocar
          </div>
        )}
      </div>

      {/* Modal de selección */}
      {dropState && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && cancelDrop()}>
          <div style={{ ...styles.modal, '--accent': typeInfo?.color || '#00d4ff' }}>

            {/* Header del modal */}
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={styles.modalTitle}>Seleccionar recurso</span>
              </div>
              <button onClick={cancelDrop} style={styles.closeBtn}>✕</button>
            </div>

            {/* Coords */}
            <div style={styles.coordsBadge}>
               x: {dropState.coords.lng.toFixed(1)} · y: {dropState.coords.lat.toFixed(1)}
            </div>

            {/* Búsqueda de recurso */}
            <div style={styles.section}>
              <label style={styles.label}>Recurso *</label>
              <input
                ref={searchRef}
                type="text"
                placeholder={`Buscar ${typeInfo?.label.toLowerCase()}...`}
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedResource(null) }}
                style={styles.searchInput}
              />

              {/* Lista de recursos */}
              <div style={styles.resourceList}>
                {loadingRes ? (
                  <div style={styles.listPlaceholder}>Cargando recursos…</div>
                ) : filteredResources.length === 0 ? (
                  <div style={styles.listPlaceholder}>
                    {search ? `Sin resultados para "${search}"` : `No hay ${typeInfo?.label.toLowerCase()} en la BD`}
                  </div>
                ) : (
                  filteredResources.map(r => (
                    <button
                      key={r._id}
                      onClick={() => setSelectedResource(r)}
                      style={{
                        ...styles.resourceItem,
                        background:   selectedResource?._id === r._id ? `${typeInfo?.color}22` : 'rgba(255,255,255,0.03)',
                        borderColor:  selectedResource?._id === r._id ? `${typeInfo?.color}88` : 'rgba(255,255,255,0.07)',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                        <span style={{ color: selectedResource?._id === r._id ? typeInfo?.color : '#e2e8f0', fontWeight: '600', fontSize: '0.85rem' }}>
                          {r.name}
                        </span>
                        {r.description && (
                          <span style={{ color: '#64748b', fontSize: '0.72rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '340px' }}>
                            {r.description}
                          </span>
                        )}
                      </div>
                      {selectedResource?._id === r._id && (
                        <span style={{ color: typeInfo?.color, fontSize: '1rem', flexShrink: 0 }}>✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Bioma */}
            <div style={styles.section}>
              <label style={styles.label}>Bioma *</label>
              <select
                value={selectedBiome}
                onChange={e => setSelectedBiome(e.target.value)}
                style={styles.select}
              >
                <option value="">— Selecciona un bioma —</option>
                {biomes.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Notas opcionales */}
            <div style={styles.section}>
              <label style={styles.label}>Notas <span style={{ color: '#475569', fontWeight: 400 }}>(opcional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Profundidad, comportamiento especial, rareza…"
                rows={2}
                style={styles.textarea}
              />
            </div>

            {/* Mensaje final */}
            {message.text && (
              <div style={{
                ...styles.messageBanner,
                background:   message.type === 'ok'   ? 'rgba(74,222,128,0.12)' : message.type === 'warn' ? 'rgba(251,191,36,0.12)' : 'rgba(248,113,113,0.12)',
                borderColor:  message.type === 'ok'   ? '#4ade8066'             : message.type === 'warn' ? '#fbbf2466'             : '#f8717166',
                color:        message.type === 'ok'   ? '#4ade80'               : message.type === 'warn' ? '#fbbf24'               : '#f87171',
              }}>
                {message.text}
              </div>
            )}

            {/* Botones */}
            <div style={styles.modalFooter}>
              <button onClick={cancelDrop} style={styles.btnCancel}>Cancelar</button>
              <button
                onClick={handleSubmit}
                disabled={loading || !selectedResource || !selectedBiome}
                style={{
                  ...styles.btnConfirm,
                  background:    (!selectedResource || !selectedBiome) ? 'rgba(255,255,255,0.07)' : `${typeInfo?.color}`,
                  color:         (!selectedResource || !selectedBiome) ? '#475569' : '#000',
                  cursor:        (!selectedResource || !selectedBiome) ? 'not-allowed' : 'pointer',
                  boxShadow:     (!selectedResource || !selectedBiome) ? 'none' : `0 4px 20px ${typeInfo?.color}55`,
                }}
              >
                {loading ? ' Guardando…' : ' Colocar marcador'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  panel: {
    position:       'absolute',
    top:            '100px',
    left:           '-300px',
    width:          '230px',
    background:     'rgba(8, 16, 36, 0.95)',
    border:         '1px solid rgba(0, 212, 255, 0.25)',
    borderRadius:   '14px',
    padding:        '16px',
    zIndex:         500,
    backdropFilter: 'blur(16px)',
    boxShadow:      '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.08)',
    display:        'flex',
    flexDirection:  'column',
    gap:            '12px',
  },
  panelHeader: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  panelTitle: {
    color:       '#e2e8f0',
    fontWeight:  '700',
    fontSize:    '0.9rem',
    letterSpacing: '0.04em',
  },
  panelHint: {
    margin:     0,
    color:      '#475569',
    fontSize:   '0.72rem',
    lineHeight: '1.5',
  },
  typeGrid: {
    display:             'grid',
    gridTemplateColumns: '1fr 1fr',
    gap:                 '8px',
  },
  typeCard: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '4px',
    padding:        '12px 8px',
    borderRadius:   '10px',
    border:         '1px solid',
    cursor:         'grab',
    userSelect:     'none',
    transition:     'all 0.15s ease',
  },
  typeLabel: {
    fontSize:   '0.75rem',
    fontWeight: '700',
  },
  typeDesc: {
    fontSize:   '0.62rem',
    color:      '#475569',
    textAlign:  'center',
    lineHeight: '1.3',
  },
  dragIndicator: {
    textAlign:    'center',
    padding:      '8px',
    borderRadius: '8px',
    border:       '1px dashed',
    fontSize:     '0.72rem',
    fontWeight:   '600',
    animation:    'pulse 1.2s ease-in-out infinite',
  },

  closeBtn: {
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.1)',
    color:        '#64748b',
    width:        '28px',
    height:       '28px',
    borderRadius: '50%',
    cursor:       'pointer',
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    fontSize:     '0.8rem',
    transition:   'all 0.2s',
    flexShrink:   0,
  },

  overlay: {
    position:       'fixed',
    inset:          0,
    zIndex:         2000,
    background:     'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    padding:        '20px',
  },
  modal: {
    background:     'rgba(8, 16, 36, 0.98)',
    border:         '1px solid rgba(255,255,255,0.1)',
    borderRadius:   '16px',
    padding:        '24px',
    width:          '100%',
    maxWidth:       '480px',
    boxShadow:      '0 24px 64px rgba(0,0,0,0.7)',
    display:        'flex',
    flexDirection:  'column',
    gap:            '16px',
    maxHeight:      '90vh',
    overflowY:      'auto',
  },
  modalHeader: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  modalTitle: {
    color:      '#e2e8f0',
    fontWeight: '700',
    fontSize:   '1rem',
  },
  typeBadge: {
    padding:       '3px 10px',
    borderRadius:  '20px',
    fontSize:      '0.72rem',
    fontWeight:    '700',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  coordsBadge: {
    background:   'rgba(255,255,255,0.04)',
    border:       '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding:      '7px 12px',
    color:        '#64748b',
    fontSize:     '0.75rem',
    fontFamily:   'monospace',
  },
  section: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '7px',
  },
  label: {
    color:         '#94a3b8',
    fontSize:      '0.72rem',
    fontWeight:    '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  searchInput: {
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding:      '9px 12px',
    color:        '#e2e8f0',
    fontSize:     '0.85rem',
    outline:      'none',
    transition:   'all 0.2s',
    width:        '100%',
    boxSizing:    'border-box',
  },
  resourceList: {
    maxHeight:  '180px',
    overflowY:  'auto',
    display:    'flex',
    flexDirection: 'column',
    gap:        '4px',
    paddingRight: '2px',
  },
  listPlaceholder: {
    color:     '#475569',
    fontSize:  '0.8rem',
    textAlign: 'center',
    padding:   '20px 0',
    fontStyle: 'italic',
  },
  resourceItem: {
    display:        'flex',
    justifyContent: 'space-between',
    alignItems:     'center',
    padding:        '9px 12px',
    borderRadius:   '8px',
    border:         '1px solid',
    cursor:         'pointer',
    transition:     'all 0.15s',
    width:          '100%',
    textAlign:      'left',
  },
  select: {
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding:      '9px 12px',
    color:        '#e2e8f0',
    fontSize:     '0.85rem',
    outline:      'none',
    cursor:       'pointer',
    width:        '100%',
  },
  textarea: {
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding:      '9px 12px',
    color:        '#e2e8f0',
    fontSize:     '0.82rem',
    outline:      'none',
    resize:       'vertical',
    fontFamily:   'inherit',
    lineHeight:   '1.5',
    width:        '100%',
    boxSizing:    'border-box',
  },
  messageBanner: {
    padding:      '10px 14px',
    borderRadius: '8px',
    border:       '1px solid',
    fontSize:     '0.82rem',
    fontWeight:   '600',
    textAlign:    'center',
  },
  modalFooter: {
    display: 'flex',
    gap:     '10px',
    paddingTop: '4px',
  },
  btnCancel: {
    flex:         1,
    padding:      '11px',
    borderRadius: '8px',
    background:   'rgba(255,255,255,0.05)',
    border:       '1px solid rgba(255,255,255,0.1)',
    color:        '#64748b',
    fontWeight:   '600',
    fontSize:     '0.85rem',
    cursor:       'pointer',
    transition:   'all 0.2s',
  },
  btnConfirm: {
    flex:         2,
    padding:      '11px',
    borderRadius: '8px',
    border:       'none',
    fontWeight:   '700',
    fontSize:     '0.85rem',
    transition:   'all 0.2s',
  },
}