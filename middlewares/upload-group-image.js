import { request, response } from 'express'
import multer from 'multer'

import { uploadGroupImage } from '../helpers/multer.cjs'

export const uploadGroupImageMiddleware = (req = request, res = response, next) => {
  uploadGroupImage(req, res, function(error) {
    if (error) {
      const message = error instanceof multer.MulterError
        ? error.code === 'LIMIT_FILE_SIZE'
          ? 'El archivo es muy grande: Máximo 1MB'
          : error.message
        : error.message

      req.session.messages = {
        error: [message]
      }

      return res.redirect('/administration')
    } else {
      return next()
    }
  })
}
