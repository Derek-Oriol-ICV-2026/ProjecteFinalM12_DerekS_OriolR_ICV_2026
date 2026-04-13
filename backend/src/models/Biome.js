import mongoose from 'mongoose'

const biomeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  description: { type: String, default: '' },
  polygon_coords: { type: [[Number]], default: [] }
})

export default mongoose.model('Biome', biomeSchema)