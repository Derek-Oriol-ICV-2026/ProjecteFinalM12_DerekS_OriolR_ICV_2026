import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['user', 'premium', 'admin'], default: 'user' },
  birthDate: { type: Date, default: null },
  message: { type: String, default: '' },
  gamesPlayed: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

userSchema.pre('save', function(next) {
  this.updated_at = Date.now()
  next()
})

export default mongoose.model('User', userSchema)