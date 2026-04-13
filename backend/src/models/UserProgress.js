import mongoose from 'mongoose'

const userProgressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MapMarker', required: true },
  discovered: { type: Boolean, default: false },
  personal_note: { type: String, default: '' },
  updated_at: { type: Date, default: Date.now }
})

export default mongoose.model('UserProgress', userProgressSchema)