import User from '../models/User.js'
import UserProgress from '../models/UserProgress.js'
import bcrypt from 'bcrypt'

export const getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select('-password_hash')
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const fieldsToAdd = {}
    if (user.birthDate === undefined) fieldsToAdd.birthDate = null
    if (user.message === undefined) fieldsToAdd.message = ''
    if (user.gamesPlayed === undefined) fieldsToAdd.gamesPlayed = 0
    if (user.score === undefined) fieldsToAdd.score = 0
    if (user.avatar === undefined) fieldsToAdd.avatar = ''

    if (Object.keys(fieldsToAdd).length > 0) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        fieldsToAdd,
        { returnDocument: 'after' }
      ).select('-password_hash')
    }

    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProgressByMarker = async (req, res) => {
  const userId = req.user.id
  const { markerId } = req.params

  const progress = await UserProgress.findOne({
    user_id: userId,
    marker_id: markerId
  })

  res.json(progress || null)
}

export const updateProfile = async (req, res) => {
  try {
    const { username, email, password, birthDate, message, gamesPlayed, score, avatar } = req.body
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Nombre de usuario y email son obligatorios' })
    }

    const gamesPlayedNum = parseInt(gamesPlayed) || 0
    if (gamesPlayedNum > 17) {
      return res.status(400).json({ error: 'Los logros no pueden superar 17' })
    }

    const currentUser = await User.findById(req.user.id)

    if (email !== currentUser.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.user.id } })
      if (existingEmail) {
        return res.status(400).json({ error: 'Este email ya está en uso' })
      }
    }

    if (username !== currentUser.username) {
      const existingUsername = await User.findOne({ username, _id: { $ne: req.user.id } })
      if (existingUsername) {
        return res.status(400).json({ error: 'Este nombre de usuario ya está en uso' })
      }
    }

    const updateData = {
      username,
      email,
      birthDate,
      message,
      gamesPlayed: gamesPlayedNum, 
      score: parseInt(score) || 0,
      avatar,
      updated_at: new Date()
    }



    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password_hash = hashedPassword
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
      updateData, 
      { returnDocument: 'after', runValidators: true }
    ).select('-password_hash')

    res.json({ 
      message: 'Perfil actualizado correctamente',
      user 
    })
  } catch (err) {
    console.error('Error en updateProfile:', err)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]
      res.status(400).json({ error: `Este ${field} ya está en uso` })
    } else {
      res.status(500).json({ error: err.message })
    }
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

    if (!['user', 'premium', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol inválido' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { 
        role,
        updated_at: new Date()
      }, 
      { returnDocument: 'after' }
    ).select('-password_hash')

    res.json({ 
      message: 'Rol asignado correctamente',
      user: updatedUser 
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const updateNote = async (req, res) => {
  try {
    const userId = req.user.id
    const { marker_id, personal_note } = req.body

    if (req.user.role !== 'premium' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const updated = await UserProgress.findOneAndUpdate(
      { user_id: userId, marker_id },
      {
        personal_note,
        updated_at: new Date()
      },
      { new: true, upsert: true }
    )

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}