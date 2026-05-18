import express from 'express'
import { getProfile, updateProfile, getProgress, assignRole, getProgressByMarker, updateNote, getUsers } from '../controllers/userController.js'

import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/profile', verifyToken, getProfile)
router.put('/profile', verifyToken, updateProfile)  
    
router.get('/progress', verifyToken, requireRole('premium', 'admin'), getProgress)

router.get('/progress/:markerId', verifyToken, getProgressByMarker)

router.put('/progress/note',verifyToken,requireRole('premium', 'admin'),updateNote)

router.post('/assign-role', verifyToken, requireRole('admin'), assignRole)

router.get('/', verifyToken, requireRole('admin'), getUsers)

export default router