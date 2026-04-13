import express from 'express'
import { getProfile, getProgress, assignRole } from '../controllers/userController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/profile', verifyToken, getProfile)
router.get('/progress', verifyToken, requireRole('premium', 'admin'), getProgress)
router.post('/assign-role', verifyToken, requireRole('admin'), assignRole)

export default router