import express from 'express'
import { getMyNotes, createNote, updateNote, deleteNote } from '../controllers/personalNoteController.js'
import { verifyToken } from '../middleware/authMiddleware.js'
import { requireRole } from '../middleware/roleMiddleware.js'

const router = express.Router()

router.get('/',        verifyToken, requireRole('premium', 'admin'), getMyNotes)
router.post('/',       verifyToken, requireRole('premium', 'admin'), createNote)
router.put('/:id',     verifyToken, requireRole('premium', 'admin'), updateNote)
router.delete('/:id',  verifyToken, requireRole('premium', 'admin'), deleteNote)

export default router