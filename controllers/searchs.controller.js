import { request, response } from 'express'
import { Op } from 'sequelize'
import moment from 'moment'

import { Group, Meeti, User } from '../models/index.js'

export const resultSearch = async (req = request, res = response) => {
  const { category, title, city, country } = req.query

  const query = category === ''
    ? ''
    : `where: {
      categoryId: { [Op.eq]: ${category} },
    }`

  const meetis = await Meeti.findAll({
    where: {
      title: { [Op.iLike]: '%' + title + '%', },
      city: { [Op.iLike]: '%' + city + '%', },
      country: { [Op.iLike]: '%' + country + '%', },
    },
    include: [
      { model: Group, as: 'group', query },
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] }
    ],
  })

  return res.render('search', {
    pageName: 'Resultados de la bÚsqueda',
    meetis,
    moment,
    userLogged: req.user,
    messages: req.session.messages,
  })
}
