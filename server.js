import path from 'node:path'
import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'

class Server {
  constructor() {
    this.app = express()
    this.port = process.env.PORT || 3000

    this.paths = {
      home: '/'
    }
  }

  async dbConnection() {
    // 
  }

  middlewares() {
    // 
  }

  config() {
    // 
  }

  routes() {
    // 
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port: ${this.port}`)
    })
  }
}

export default Server
