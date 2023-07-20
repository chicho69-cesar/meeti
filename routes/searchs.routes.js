import { Router } from 'express'
import { resultSearch } from '../controllers/searchs.controller.js'

const router = Router()

router.get('/search', resultSearch)

export default router
