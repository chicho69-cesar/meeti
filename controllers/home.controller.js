import { request, response } from 'express'
import { Op } from 'sequelize'
import moment from 'moment'

import { Category, Group, Meeti, User } from '../models/index.js'

export const home = async (req = request, res = response) => {
  console.log(req.user)

  const queries = [
    Category.findAll(),
    Meeti.findAll({
      attributes: ['slug', 'title', 'date', 'hour'],
      where: {
        date: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD') },
      },
      limit: 3,
      order: [['date', 'ASC']],
      include: [
        { model: Group, as: 'group', attributes: ['image'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
      ]
    })
  ]

  const [categories, meetis] = await Promise.all(queries)

  return res.render('home', {
    pageName: 'Inicio',
    categories,
    meetis,
    moment,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const removeSessionMessages = async (req = request, res = response) => {
  req.session.messages = {}
  return res.status(200).send('ok')
}
