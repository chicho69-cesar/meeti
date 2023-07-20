import { request, response } from 'express'
import moment from 'moment'
import { Op } from 'sequelize'

import { Group, Meeti } from '../models/index.js'

export const adminDashboard = async (req = request, res = response) => {
  const { id: userId } = req.user
  
  const queries = [
    Group.findAll({ where: { userId }}),
    Meeti.findAll({ 
      where: {
        userId,
        date: {
          [Op.gte]: moment(new Date()).format('YYYY-MM-DD')
        },
      },
      order: [['date', 'ASC']]
    }),
    Meeti.findAll({
      where: {
        userId,
        date: {
          [Op.lt]: moment(new Date()).format('YYYY-MM-DD')
        }
      }
    }),
  ]

  const [groups, meeti, pastMeeti] = await Promise.all(queries)

  return res.render('administration', {
    pageName: 'Panel de administración',
    groups,
    meeti,
    pastMeeti,
    moment,
    userLogged: req.user,
    messages: req.session.messages,
  })
}
