import mongoose from 'mongoose'

const personalNoteSchema = new mongoose.Schema({
  user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  x:        { type: Number, required: true },
  y:        { type: Number, required: true },
  biome_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Biome', default: null },
  note:     { type: String, required: true },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('PersonalNote', personalNoteSchema)