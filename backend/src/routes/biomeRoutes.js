import express from 'express'
import Biome from '../models/Biome.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const biomas = await Biome.find()
    res.json(biomas)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const bioma = await Biome.findById(req.params.id)
    if (!bioma) {
      return res.status(404).json({ error: 'Bioma no encontrado' })
    }
    res.json(bioma)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/search/point', async (req, res) => {
  try {
    const { x, y } = req.body
    if (x === undefined || y === undefined) {
      return res.status(400).json({ error: 'Se requieren coordenadas x, y' })
    }
    const point = [x, y]
    const isPointInPolygon = (point, polygon) => {
      const [px, py] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        const intersect = yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
        if (intersect) inside = !inside
      }
      return inside
    }
    const biomas = await Biome.find()
    let candidatos = biomas.filter((bioma) => {
      return x >= bioma.min_x && x <= bioma.max_x && y >= bioma.min_y && y <= bioma.max_y
    })
    for (const bioma of candidatos) {
      if (isPointInPolygon(point, bioma.polygon_coords)) {
        return res.json({ found: true, bioma: bioma })
      }
    }
    res.json({ found: false, bioma: null, message: 'No hay bioma en estas coordenadas' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router