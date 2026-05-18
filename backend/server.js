import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/routes/authRoutes.js'
import userRoutes from './src/routes/userRoutes.js'
import resourceRoutes from './src/routes/resourceRoutes.js'
import biomeRoutes from './src/routes/biomeRoutes.js'
import markerRoutes from './src/routes/markerRoutes.js'
import personalNoteRoutes from './src/routes/personalNoteRoutes.js'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error MongoDB:', err))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/resources', resourceRoutes)
app.use('/api/biomes', biomeRoutes)
app.use('/api/markers', markerRoutes)
app.use('/api/notes', personalNoteRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})