import { Router } from 'express'
import { home, removeSessionMessages } from '../controllers/home.controller.js'

const router = Router()

router.get('/', home)

router.get('/remove-messages', removeSessionMessages)

export default router
