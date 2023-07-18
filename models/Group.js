import { DataTypes } from 'sequelize'

import db from '../config/db.js'

const Group = db.define('groups', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El grupo debe tener un nombre' },
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripcion no puede ir vacia' },
    }
  },
  url: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.TEXT,
  }
})

export default Group
