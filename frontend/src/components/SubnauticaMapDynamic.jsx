import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

export function SubnauticaMapDynamic() {
  const map = useMap()
  const [biomas, setBiomas] = useState([])
  const [hoveredBioma, setHoveredBioma] = useState(null)
  const [loading, setLoading] = useState(true)
  const [layers, setLayers] = useState([])

  const SCALE = 4000 / 3579

  useEffect(() => {
    fetch('http://localhost:5000/api/biomas/')
      .then(res => res.json())
      .then(data => {
        setBiomas(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error cargando biomas:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!map || biomas.length === 0) return

    layers.forEach(layer => map.removeLayer(layer))

    const newLayers = biomas.map(bioma => {
      const latLngs = bioma.polygon_coords.map(([x, y]) => [
        (y * SCALE) - 2000,
        (x * SCALE) - (3439 * SCALE) / 2
      ])

      const isHovered = hoveredBioma === bioma.name
      const fillColor = isHovered ? bioma.color : '#c1effd'

      const polygon = L.polygon(latLngs, {
        color: 'black',
        weight: 1,
        fillColor: fillColor,
        fillOpacity: 0.6
      })

      polygon.on('mouseover', () => setHoveredBioma(bioma.name))
      polygon.on('mouseout', () => setHoveredBioma(null))
      polygon.bindPopup(`<b>${bioma.name}</b>`)

      polygon.addTo(map)
      return polygon
    })

    setLayers(newLayers)

    return () => {
      newLayers.forEach(layer => map.removeLayer(layer))
    }
  }, [map, biomas, hoveredBioma])

  if (loading) return null

  return null
}