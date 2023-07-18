import { DataTypes } from 'sequelize'

import db from '../config/db.js'

const Category = db.define('categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: false
})

export default Category
