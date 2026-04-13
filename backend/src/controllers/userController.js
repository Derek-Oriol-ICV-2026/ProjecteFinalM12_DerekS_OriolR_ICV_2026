import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash')
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ user_id: req.user.id })
      .populate('marker_id')
    res.json(progress)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}