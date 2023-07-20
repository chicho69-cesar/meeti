import { Router } from 'express'

import { addComment, deleteComment } from '../controllers/comments.controller.js'

const router = Router()

router.post('/meeti/:id', addComment)

router.post('/delete-comment', deleteComment)

export default router
