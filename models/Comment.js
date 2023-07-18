import { DataTypes } from 'sequelize'

import db from '../config/db.js'

const Comment = db.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
})

export default Comment
