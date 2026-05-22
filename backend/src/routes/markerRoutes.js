import express from 'express'
import { getAll, getOne, create, update, remove, updateDiscovered } from '../controllers/markerController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/', getAll)
router.post('/', verifyToken, requireRole('premium', 'admin'), create)
router.put('/:id/discovered', verifyToken, requireRole('premium', 'admin'), updateDiscovered)
router.put('/:id', verifyToken, requireRole('premium', 'admin'), update)
router.get('/:id', getOne)
router.delete('/:id', verifyToken, requireRole('admin'), remove)

export default router