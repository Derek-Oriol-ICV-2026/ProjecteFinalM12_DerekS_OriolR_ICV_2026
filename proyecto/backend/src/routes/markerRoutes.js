import express from 'express'
import { getAll, getOne, create, update, remove } from '../controllers/markerController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', verifyToken, requireRole('premium', 'admin'), create)
router.put('/:id', verifyToken, requireRole('premium', 'admin'), update)
router.delete('/:id', verifyToken, requireRole('admin'), remove)

export default router