import 'colors'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

import db from './config/db.js'
import passport from './config/passport.js'
import {
  adminRouter,
  authRouter,
  commentsRouter,
  groupsRouter,
  homeRouter,
  meetiRouter,
  searchsRouter,
  usersRouter,
} from './routes/index.js'

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000

    this.path = '/'

    // DB connection
    this.dbConnection()
    // Middlewares
    this.middlewares()
    // Config
    this.config()
    // Routes
    this.routes()
  }

  async dbConnection() {
    try {
      await db.authenticate()
      db.sync()

      console.log('Connection has been established successfully.'.green)
    } catch (error) {
      console.log(`${error}`.red)
    }
  }

  middlewares() {
    // Enable body parser
    this.app.use(bodyParser.json())
    // URL encoded for POST requests with form data
    this.app.use(express.urlencoded({ extended: true }))
    // JSON parser for API requests
    this.app.use(express.json())
    // Enable the use of the public folder
    this.app.use(express.static('public'))
    // Cookies by cookie parser
    this.app.use(cookieParser())
    // Session
    this.app.use(session({
      secret: process.env.SECRET,
      key: process.env.KEY,
      resave: false,
      saveUninitialized: true,
    }))
    // Initialize passport
    this.app.use(passport.initialize())
    // Passport sessions
    this.app.use(passport.session())
  }

  config() {
    // Configure the express layouts for ejs
    this.app.use(expressLayouts)
    // Configure ejs as view engine
    this.app.set('view engine', 'ejs')
    // Configure views folder
    this.app.set('views', './views')
  }

  routes() {
    this.app.use(this.path, adminRouter)
    this.app.use(this.path, authRouter)
    this.app.use(this.path, commentsRouter)
    this.app.use(this.path, groupsRouter)
    this.app.use(this.path, homeRouter)
    this.app.use(this.path, meetiRouter)
    this.app.use(this.path, searchsRouter)
    this.app.use(this.path, usersRouter)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port: ${this.port}`)
    })
  }
}

export default Server
