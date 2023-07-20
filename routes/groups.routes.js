import { Router } from 'express'

import { 
  showGroup,
  newGroupForm,
  createGroup,
  editGroupForm,
  editGroup,
  editImageForm,
  editImage,
  deleteGroupForm,
  deleteGroup,
} from '../controllers/groups.controller.js'
import verifyAuthenticatedUser from '../middlewares/verify-authenticated-user.js'
import { uploadGroupImageMiddleware } from '../middlewares/upload-group-image.js'

const router = Router()

router.get('/groups/:id', showGroup)

router.get('/new-group', [
  verifyAuthenticatedUser,
], newGroupForm)

router.post('/new-group', [
  verifyAuthenticatedUser,
  uploadGroupImageMiddleware,
], createGroup)

router.get('/edit-group/:groupId', [
  verifyAuthenticatedUser,
], editGroupForm)

router.post('/edit-group/:groupId', [
  verifyAuthenticatedUser,
], editGroup)

router.get('/group-image/:groupId', [
  verifyAuthenticatedUser,
], editImageForm)

router.post('/group-image/:groupId', [
  verifyAuthenticatedUser,
  uploadGroupImageMiddleware,
], editImage)

router.get('/delete-group/:groupId', [
  verifyAuthenticatedUser,
], deleteGroupForm)

router.post('/delete-group/:groupId', [
  verifyAuthenticatedUser,
], deleteGroup)

export default router
