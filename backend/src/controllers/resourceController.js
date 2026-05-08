import Resource from '../models/Resource.js'

export const getAll = async (req, res) => {
  try {
    const { type } = req.query
    const filter = type ? { type } : {}
    const resources = await Resource.find(filter)
    res.json(resources)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getOne = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ error: 'No trobat' })
    res.json(resource)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const resource = await Resource.create(req.body)
    res.status(201).json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })
    res.json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id)
    res.json({ message: 'Eliminat correctament' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}