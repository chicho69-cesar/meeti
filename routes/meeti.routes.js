import { Router } from 'express'

import { 
  showMeeti, 
  confirmAssistance,
  showAssistances,
  showAssistancesById,
  showMeetisByCategory,
  newMeetiForm,
  createMeeti,
  editMeetiForm,
  editMeeti,
  deleteMeetiForm,
  deleteMeeti,
} from '../controllers/meeti.controller.js'
import verifyAuthenticatedUser from '../middlewares/verify-authenticated-user.js'

const router = Router()

router.get('/meeti/:slug', showMeeti)

router.post('/confirm-assistance/:slug', confirmAssistance)

router.get('/assistances/:slug', showAssistances)
router.get('/assistances-meeti/:id', showAssistancesById)

router.get('/category/:category', showMeetisByCategory)

router.get('/new-meeti', [
  verifyAuthenticatedUser,
], newMeetiForm)

router.post('/new-meeti', [
  verifyAuthenticatedUser,
], createMeeti)

router.get('/edit-meeti/:id', [
  verifyAuthenticatedUser,
], editMeetiForm)

router.post('/edit-meeti/:id', [
  verifyAuthenticatedUser,
], editMeeti)

router.get('/delete-meeti/:id', [
  verifyAuthenticatedUser,
], deleteMeetiForm)

router.post('/delete-meeti/:id', [
  verifyAuthenticatedUser,
], deleteMeeti)

export default router
