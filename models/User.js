import bcrypt from 'bcrypt'
import { DataTypes } from 'sequelize'

import db from '../config/db.js'

const User = db.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: 'Agrega un email valido' },
    },
    unique: {
      msg: 'El email ya existe'
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Agrega una contraseña' },
    }
  },
  active: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  token: {
    type: DataTypes.TEXT,
  },
  expirationToken: {
    type: DataTypes.DATE,
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
    }
  }
})

User.prototype.matchPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

User.prototype.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

export default User
