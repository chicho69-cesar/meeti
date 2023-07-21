import { DataTypes } from 'sequelize'
import slug from 'slug'

import db from '../config/db.js'
import { nanoid } from 'nanoid'

const Meeti = db.define('meetis', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El titulo no puede ir vacio' }
    }
  },
  slug: {
    type: DataTypes.TEXT,
  },
  invited: {
    type: DataTypes.TEXT,
  },
  quota: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripcion no puede ir vacia' },
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La fecha no puede ir vacia' },
    }
  },
  hour: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La hora no puede ir vacia' },
    }
  },
  direction: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La direccion no puede ir vacia' },
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La ciudad no puede ir vacia' },
    }
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El estado no puede ir vacia' },
    }
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El pais no puede ir vacia' },
    }
  },
  /* location: {
    type: DataTypes.GEOGRAPHY('POINT', 4326),
  }, */
  location: {
    type: DataTypes.STRING,
    get() {
      const value = this.getDataValue('location')
      if (value) {
        const [lat, lng] = value.split(',').map(parseFloat)
        return [lat, lng]
      }
      
      return null
    },
    set(value) {
      this.setDataValue('location', value.join(','))
    }
  },
  interesteds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: []
  }
}, {
  hooks: {
    beforeCreate: async (meeti) => {
      const url = slug(meeti.title).toLowerCase()
      meeti.slug = `${url}-${nanoid()}`
    }
  }
})

export default Meeti
