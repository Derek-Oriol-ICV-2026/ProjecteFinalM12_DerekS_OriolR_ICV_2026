import express from 'express'
import { 
  getProfile, 
  updateProfile,    
  getProgress, 
  assignRole
} from '../controllers/userController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

// Rutas de perfil
router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)  

// Rutas de progreso
router.get('/progress', verifyToken, requireRole('premium', 'admin'), getProgress)

// Rutas de admin
router.post('/assign-role', verifyToken, requireRole('admin'), assignRole)

export default router