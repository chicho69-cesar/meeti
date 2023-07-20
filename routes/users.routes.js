import { Router } from 'express'

import { 
  showUser,
  signInForm,
  signUpForm,
  signUp,
  confirmAccount,
  editProfileForm,
  editProfile,
  changePasswordForm,
  changePassword,
  uploadProfileImageForm,
  saveProfileImage,
} from '../controllers/users.controller.js'
import verifyAuthenticatedUser from '../middlewares/verify-authenticated-user.js'
import { uploadProfileImageMiddleware } from '../middlewares/upload-profile-image.js'

const router = Router()

router.get('/users/:id', showUser)

router.get('/sign-in', signInForm)

router.get('/sign-up', signUpForm)

router.post('/sign-up', signUp)

router.get('/confirm-account/:email', confirmAccount)

router.get('/edit-profile', [
  verifyAuthenticatedUser,
], editProfileForm)

router.post('/edit-profile', [
  verifyAuthenticatedUser,
], editProfile)

router.get('/reset-password', [
  verifyAuthenticatedUser,
], changePasswordForm)

router.post('/reset-password', [
  verifyAuthenticatedUser,
], changePassword)

router.get('/profile-image', [
  verifyAuthenticatedUser,
], uploadProfileImageForm)

router.post('/profile-image', [
  verifyAuthenticatedUser,
  uploadProfileImageMiddleware,
], saveProfileImage)

export default router
