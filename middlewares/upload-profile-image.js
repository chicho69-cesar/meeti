import { request, response } from 'express'
import multer from 'multer'

import { uploadProfileImage } from '../helpers/multer.cjs'

export const uploadProfileImageMiddleware = (req = request, res = response, next) => {
  uploadProfileImage(req, res, function (error) {
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
