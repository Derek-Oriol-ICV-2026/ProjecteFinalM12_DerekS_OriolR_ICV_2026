import mongoose from 'mongoose'

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  type: { 
    type: String, 
    enum: ['fauna', 'flora', 'mineral', 'poi', 'leviathan'], 
    required: true 
  },
  description: { type: String, default: '' },
  wiki_content: { type: String, default: '' },
  image_url: { type: String, default: '' },
  stats: { type: Map, of: String, default: {} }
})

export default mongoose.model('Resource', resourceSchema)