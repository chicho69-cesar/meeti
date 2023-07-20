import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { request, response } from 'express'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { Category, Group, Meeti } from '../models/index.js'

export const showGroup = async (req = request, res = response) => {
  const { id } = req.params

  const queries = [
    Group.findOne({ where: { id } }),
    Meeti.findAll({
      where: {
        groupId: id,
      },
      order: [['date', 'ASC']]
    }),
  ]

  const [group, meetis] = await Promise.all(queries)

  if (!group) {
    req.session.messages = {
      error: ['Ese grupo no existe']
    }

    return res.redirect('/')
  }

  return res.render('show-group', {
    pageName: `Información del Grupo: ${group.name}`,
    group,
    meetis,
    moment,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const newGroupForm = async (req = request, res = response) => {
  const categories = await Category.findAll()

  return res.render('new-group', {
    pageName: 'Crear un nuevo grupo',
    categories,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const createGroup = async (req = request, res = response) => {
  /* TODO: Validar campos */

  const { id: userId } = req.user
  const group = req.body

  group.userId = userId
  group.id = uuidv4()

  if (req.file) {
    group.image = req.file.filename
  }

  try {
    await Group.create(group)

    req.session.messages = {
      success: ['Se ha creado el Grupo Correctamente']
    }

    return res.redirect('/administration')
  } catch (error) {
    const sequelizeErrors = error.errors.map((err) => err.message)

    req.session.messages = {
      error: sequelizeErrors
    }

    return res.redirect('/new-group')
  }
}

export const editGroupForm = async (req = request, res = response) => {
  const { groupId } = req.params

  const queries = [
    Group.findByPk(groupId),
    Category.findAll(),
  ]

  const [group, categories] = await Promise.all(queries)

  return res.render('edit-group', {
    pageName: `Editar Grupo: ${group.name}`,
    group,
    categories,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const editGroup = async (req = request, res = response) => {
  /* TODO: Validar campos */

  const { id: userId } = req.user
  const { groupId } = req.params

  const group = await Group.findOne({
    where: { id: groupId, userId },
  })

  if (!group) {
    req.session.messages = {
      error: ['Operación no permitida']
    }

    return res.redirect('/administration')
  }

  const { name, description, categoryId, url } = req.body

  group.name = name
  group.description = description
  group.categoryId = categoryId
  group.url = url

  await group.save()

  req.session.messages = {
    success: ['Se actualizo correctamente el Grupo']
  }

  return res.redirect('/administration')
}

export const editImageForm = async (req = request, res = response) => {
  const { id: userId } = req.user
  const { groupId } = req.params

  const group = await Group.findOne({
    where: { id: groupId, userId },
  })

  return res.render('group-image', {
    pageName: `Editar imagen del grupo: ${group.name}`,
    group,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const editImage = async (req = request, res = response) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const { id: userId } = req.user
  const { groupId } = req.params

  const group = await Group.findOne({
    where: { id: groupId, userId },
  })

  if (!group) {
    req.session.messages = {
      error: ['Operación no permitida']
    }

    return res.redirect('/administration')
  }

  if (req.file && group.image) {
    const pastImagePath = __dirname + `/../public/uploads/groups/${group.image}`

    fs.unlink(pastImagePath, (err) => {
      if (err) {
        console.log(err)
      }

      return
    })
  }

  if (req.file) {
    group.image = req.file.filename
  }

  await group.save()

  req.session.messages = {
    success: ['Se actualizo correctamente la imagen del grupo']
  }

  return res.redirect('/administration')
}

export const deleteGroupForm = async (req = request, res = response) => {
  const { id: userId } = req.user
  const { groupId } = req.params

  const group = await Group.findOne({
    where: { id: groupId, userId },
  })

  if (!group) {
    req.session.messages = {
      error: ['Operación no permitida']
    }

    return res.redirect('/administration')
  }

  return res.render('delete-group', {
    pageName: `Eliminar Grupo: ${group.name}`,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const deleteGroup = async (req = request, res = response) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const { id: userId } = req.user
  const { groupId } = req.params

  const group = await Group.findOne({
    where: { id: groupId, userId },
  })

  if (group.image) {
    const pastImagePath = __dirname + `/../public/uploads/groups/${group.image}`

    fs.unlink(pastImagePath, (err) => {
      if (err) {
        console.log(err)
      }

      return
    })
  }

  await Group.destroy({
    where: { id: groupId },
  })

  req.session.messages = {
    success: ['Grupo eliminado con éxito']
  }

  return res.redirect('/administration')
}
