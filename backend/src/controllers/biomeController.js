import Biome from '../models/Biome.js'

export const getAll = async (req, res) => {
  try {
    const biomes = await Biome.find()
    res.json(biomes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const biome = await Biome.findById(req.params.id)
    if (!biome) return res.status(404).json({ error: 'No trobat' })
    res.json(biome)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const biome = await Biome.create(req.body)
    res.status(201).json(biome)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const biome = await Biome.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(biome)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await Biome.findByIdAndDelete(req.params.id)
    res.json({ message: 'Eliminat correctament' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}