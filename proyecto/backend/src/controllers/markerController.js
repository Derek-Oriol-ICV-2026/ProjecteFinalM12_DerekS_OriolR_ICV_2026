import MapMarker from '../models/MapMarker.js'

export const getAll = async (req, res) => {
  try {
    const markers = await MapMarker.find()
      .populate('resource_id')
      .populate('biome_id')
    res.json(markers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const marker = await MapMarker.findById(req.params.id)
      .populate('resource_id')
      .populate('biome_id')
    if (!marker) return res.status(404).json({ error: 'No trobat' })
    res.json(marker)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const marker = await MapMarker.create(req.body)
    res.status(201).json(marker)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const marker = await MapMarker.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(marker)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await MapMarker.findByIdAndDelete(req.params.id)
    res.json({ message: 'Eliminat correctament' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}