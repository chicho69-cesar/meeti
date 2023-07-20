/* import multer, { diskStorage } from 'multer'
import { nanoid } from 'nanoid' */
const multer = require('multer')
const { nanoid } = require('nanoid')

const multerConfigurationGroupImages = {
  limits: {
    fileSize: 1000000
  },
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + '/../public/uploads/groups')
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1]
      cb(null, `${nanoid()}.${extension}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(new Error('Formato No Válido'), false)
    }
  }
}

const multerConfigurationProfileImages = {
  limits: {
    fileSize: 1000000
  },
  storage: fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + '/../public/uploads/profiles')
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1]
      cb(null, `${nanoid()}.${extension}`)
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
    } else {
      cb(new Error('Formato No Válido'), false)
    }
  }
}

/* export  */const uploadGroupImage = multer(multerConfigurationGroupImages).single('image')
/* export  */const uploadProfileImage = multer(multerConfigurationProfileImages).single('image')

module.exports = {
  uploadGroupImage,
  uploadProfileImage
}
