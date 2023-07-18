import { Sequelize } from 'sequelize'

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbPort = +(process.env.DB_PORT) || 5432

const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: 'localhost',
  dialect: 'postgres',
  port: dbPort,
  define: {
    timestamps: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 30000
  }
})

export default db
