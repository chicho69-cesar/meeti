import { Router } from 'express'

import { authenticateUser, signOut } from '../controllers/auth.controller.js'
import verifyAuthenticatedUser from '../middlewares/verify-authenticated-user.js'

const router = Router()

router.post('/sign-in', authenticateUser)

router.get('/sign-out', [
  verifyAuthenticatedUser,
], signOut)

export default router
