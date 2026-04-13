import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)