import { request, response } from 'express'
import { Op, Sequelize } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

import { Category, Comment, Group, Meeti, User } from '../models/index.js'

export const newMeetiForm = async (req = request, res = response) => {
  const { id: userId } = req.user

  const groups = await Group.findAll({
    where: { userId },
  })

  return res.render('new-meeti', {
    pageName: 'Crear nuevo meeti',
    groups,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const createMeeti = async (req = request, res = response) => {
  /* TODO: Validar los campos */
  const meeti = req.body

  meeti.id = uuidv4()
  meeti.userId = req.user.id
  meeti.location = [req.body.lat, req.body.lng]

  if (req.body.quota === '') {
    meeti.quota = 0
  }

  try {
    await Meeti.create(meeti)

    req.session.messages = {
      success: ['Se ha creado el Meeti Correctamente']
    }

    return res.redirect('/administration')
  } catch (error) {
    const sequelizeErrors = error.errors.map(err => err.message)
    
    req.session.messages = {
      error: sequelizeErrors
    }

    return res.redirect('/new-meeti')
  }
}

export const editMeetiForm = async (req = request, res = response) => {
  const { id: userId } = req.user
  const { id: meetiId } = req.params

  const queries = [
    Group.findAll({
      where: { userId },
    }),
    Meeti.findByPk(meetiId),
  ]

  const [groups, meeti] = await Promise.all(queries)

  if (!groups || !meeti) {
    req.session.messages = {
      error: ['No se pudo realizar la acción']
    }

    return res.redirect('/administration')
  }

  return res.render('edit-meeti', {
    pageName: `Editar meeti: ${meeti.title}`,
    groups,
    meeti,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const editMeeti = async (req = request, res = response) => {
  const { id: userId } = req.user
  const { id: meetiId } = req.params

  const meeti = await Meeti.findOne({
    where: { id: meetiId, userId },
  })

  if (!meeti) {
    req.session.messages = {
      error: ['No se pudo realizar la acción']
    }

    return res.redirect('/administration')
  }

  const {
    title,
    groupId,
    invited,
    quota,
    description,
    date,
    hour,
    direction,
    city,
    state,
    country,
    lat,
    lng,
  } = req.body

  meeti.groupId = groupId
  meeti.title = title
  meeti.invited = invited
  meeti.quota = quota
  meeti.description = description
  meeti.date = date
  meeti.hour = hour
  meeti.direction = direction
  meeti.city = city
  meeti.state = state
  meeti.country = country
  meeti.location = [lat, lng]

  await meeti.save()

  req.session.messages = {
    success: ['Se ha editado el Meeti Correctamente']
  }

  return res.redirect('/administration')
}

export const deleteMeetiForm = async (req = request, res = response) => {
  const { id: userId } = req.user
  const { id: meetiId } = req.params

  const meeti = await Meeti.findOne({
    where: { id: meetiId, userId },
  })

  if (!meeti) {
    req.session.messages = {
      error: ['No se pudo realizar la acción']
    }

    return res.redirect('/administration')
  }

  return res.render('delete-meeti', {
    pageName: `Eliminar meeti: ${meeti.title}`,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const deleteMeeti = async (req = request, res = response) => {
  const { id } = req.params

  await Meeti.destroy({
    where: { id },
  })

  req.session.messages = {
    success: ['Meeti eliminado correctamente']
  }

  return res.redirect('/administration')
}

/* PUBLIC */
export const showMeeti = async (req = request, res = response) => {
  const { slug } = req.params

  const meeti = await Meeti.findOne({
    where: { slug },
    include: [
      { model: Group, as: 'group' },
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  if (!meeti) {
    return res.redirect('/')
  }

  const latRef = +meeti.location[0] // Latitud de referencia
  const lngRef = +meeti.location[1] // Longitud de referencia

  const nearbyMeetis = await Meeti.findAll({
    order: Sequelize.literal(`(
      6371 * acos(
        cos(radians(${latRef})) * cos(radians(location[0])) * cos(radians(location[1]) - radians(${lngRef})) +
        sin(radians(${latRef})) * sin(radians(location[0]))
      )
    )`), // Ordena del más cercano al más lejano
    where: Sequelize.where(
      Sequelize.literal(`(
        6371 * acos(
          cos(radians(${latRef})) * cos(radians(location[0])) * cos(radians(location[1]) - radians(${lngRef})) +
          sin(radians(${latRef})) * sin(radians(location[0]))
        )
      )`),
      { [Op.lte]: 2 }, // 2 kilómetros
    ),
    limit: 3,
    offset: 1,
    include: [
      { model: Group, as: 'group' },
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  const comments = await Comment.findAll({
    where: { meetiId: meeti.id },
    include: [
      { model: User, as: 'user', attributes: ['id', 'name', 'image'] },
    ]
  })

  return res.render('show-meeti', {
    pageName: meeti.title,
    user: req.user,
    userLogged: req.user,
    meeti,
    comments,
    nearbyMeetis,
    moment,
    messages: req.session.messages,
  })
}

export const confirmAssistance = async (req = request, res = response) => {
  const { action } = req.body
  const { slug } = req.params

  if (action === 'confirm') {
    Meeti.update(
      { 'interesteds': Sequelize.fn('array_append', Sequelize.col('interesteds'), req.user.id) },
      { 'where': { 'slug': slug }},
    )

    return res.send('Has confirmado tu asistencia')
  } else {
    Meeti.update(
      { 'interesteds': Sequelize.fn('array_remove', Sequelize.col('interesteds'), req.user.id) },
      { 'where': { 'slug': slug } },
    )

    return res.send('Has Cancelado tu asistencia')
  }
}

export const showAssistances = async (req = request, res = response) => {
  const { slug } = req.params

  const meeti = await Meeti.findOne({
    where: { slug },
    attributes: ['interesteds'],
  })

  const { interesteds } = meeti

  const assistances = await User.findAll({
    attributes: ['id', 'name', 'image'],
    where: { id: interesteds },
  })

  return res.render('assistances-meeti', {
    pageName: 'Lista de Asistentes',
    assistances,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const showAssistancesById = async (req = request, res = response) => {
  const { id } = req.params

  const meeti = await Meeti.findOne({
    where: { id },
    attributes: ['interesteds'],
  })

  const { interesteds } = meeti

  const assistances = await User.findAll({
    attributes: ['id', 'name', 'image'],
    where: { id: interesteds },
  })

  return res.render('assistances-meeti', {
    pageName: 'Lista de Asistentes',
    assistances,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const showMeetisByCategory = async (req = request, res = response) => {
  const { category: categoryName } = req.params

  const category = await Category.findOne({
    attributes: ['id', 'name'],
    where: { slug: categoryName },
  })

  const meetis = await Meeti.findAll({
    order: [
      ['date', 'ASC'],
      ['hour', 'ASC'],
    ],
    include: [
      { model: Group, as: 'group', where: { categoryId: category.id } },
      { model: User, as: 'user' },
    ]
  })

  return res.render('category', {
    pageName: `Categoría: ${category.name}`,
    meetis,
    moment,
    userLogged: req.user,
    messages: req.session.messages,
  })
}
