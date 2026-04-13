// server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error MongoDB:', err))



const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))