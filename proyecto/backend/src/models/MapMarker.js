import mongoose from 'mongoose'

const mapMarkerSchema = new mongoose.Schema({
  resource_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  biome_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Biome', required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  notes: { type: String, default: '' },
  is_official: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
})

export default mongoose.model('MapMarker', mapMarkerSchema)