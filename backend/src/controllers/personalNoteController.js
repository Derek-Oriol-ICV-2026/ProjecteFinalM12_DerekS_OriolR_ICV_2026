import PersonalNote from '../models/PersonalNote.js'

export const getMyNotes = async (req, res) => {
  try {
    const notes = await PersonalNote.find({ user_id: req.user.id }).populate('biome_id', 'name color')
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const createNote = async (req, res) => {
  try {
    const { x, y, biome_id, note } = req.body
    if (!note?.trim()) return res.status(400).json({ error: 'La nota no puede estar vacía' })

    const newNote = await PersonalNote.create({
      user_id: req.user.id,
      x, y,
      biome_id: biome_id || null,
      note: note.trim()
    })
    const populated = await newNote.populate('biome_id', 'name color')
    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateNote = async (req, res) => {
  try {
    const note = await PersonalNote.findOne({ _id: req.params.id, user_id: req.user.id })
    if (!note) return res.status(404).json({ error: 'Nota no encontrada' })

    if (req.body.note !== undefined) note.note = req.body.note
    if (req.body.biome_id !== undefined) note.biome_id = req.body.biome_id
    await note.save()
    res.json(note)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const deleteNote = async (req, res) => {
  try {
    const note = await PersonalNote.findOne({ _id: req.params.id, user_id: req.user.id })
    if (!note) return res.status(404).json({ error: 'Nota no encontrada' })
    await note.deleteOne()
    res.json({ message: 'Nota eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}