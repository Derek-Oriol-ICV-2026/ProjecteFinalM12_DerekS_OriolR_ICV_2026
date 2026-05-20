import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

export const register = async (req, res) => {
  try {
    console.log("BODY:", req.body)
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      })
    }
    
    const password_hash = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      username,
      email,
      password_hash
    })

    const { password_hash: _, ...safeUser } = user.toObject()
    res.status(201).json({ message: 'Usuari creat', user: safeUser })
    
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: 'Usuari no trobat' })
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Contrasenya incorrecta' })
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}