import { Router } from 'express'

import { adminDashboard } from '../controllers/admin.controller.js'
import verifyAuthenticatedUser from '../middlewares/verify-authenticated-user.js'

const router = Router()

router.get('/administration', [
  verifyAuthenticatedUser,
], adminDashboard)

export default router
