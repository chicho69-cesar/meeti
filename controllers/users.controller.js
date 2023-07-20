import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { request, response } from 'express'

import { sendMail } from '../helpers/emails.js'
import { Group, User } from '../models/index.js'

export const signUpForm = async (req = request, res = response) => {
  res.render('sign-up', {
    pageName: 'Crea tu cuenta',
    user: req.user,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const signUp = async (req = request, res = response) => {
  /* TODO: Validar campos, y validar que el confirm password sea igual al password */
  const user = req.body

  try {
    await User.create(user)

    // Confirmation url
    const url = `${req.protocol}://${req.headers.host}/confirm-account/${user.email}`

    await sendMail({
      user,
      url,
      subject: 'Confirma tu cuenta',
      file: 'confirm-account',
    })

    req.session.messages = {
      success: ['Hemos enviado un E-mail, confirma tu cuenta']
    }

    return res.redirect('/sign-in')
  } catch (error) {
    console.log(error)
    const sequelizeErrors = error?.errors?.map(err => err.message)

    if (sequelizeErrors) {
      req.session.messages = {
        errors: sequelizeErrors
      }
    }

    return res.redirect('/sign-up')
  }
}

export const confirmAccount = async (req = request, res = response) => {
  const { email } = req.params
  const user = await User.findOne({ where: { email } })

  if (!user) {
    req.session.messages = {
      errors: ['No existe esta cuenta']
    }

    return res.redirect('/sign-up')
  }

  user.active = 1
  await user.save()

  req.session.messages = {
    success: ['La cuenta se ha confirmado, ya puedes iniciar sesión']
  }

  return res.redirect('/sign-in')
}

export const signInForm = (req = request, res = response) => {
  res.render('sign-in', {
    pageName: 'Inicia sesión',
    user: req.user,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const editProfileForm = async (req = request, res = response) => {
  const { id } = req.user
  const user = await User.findByPk(id)

  return res.render('edit-profile', {
    pageName: 'Editar perfil',
    user,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const editProfile = async (req = request, res = response) => {
  /* TODO: Validar campos */
  const { id } = req.user
  const user = await User.findByPk(id)

  const { name, description, email } = req.body

  user.name = name
  user.description = description
  user.email = email

  await user.save()

  req.session.messages = {
    success: ['Cambios Guardados Correctamente']
  }

  return res.redirect('/administration')
}

export const changePasswordForm = async (req = request, res = response) => {
  res.render('reset-password', {
    pageName: 'Cambiar contraseña',
    user: req.user,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const changePassword = async (req = request, res = response) => {
  const { id } = req.user
  const { last_password: lastPassword, new_password: newPassword } = req.body

  const user = await User.findByPk(id)

  if (!user.matchPassword(lastPassword)) {
    req.session.messages = {
      error: ['El password actual no es correcto']
    }

    return res.redirect('/administration')
  }

  const hash = user.hashPassword(newPassword)
  user.password = hash

  await user.save()

  req.logout(function (err) {
    if (err) {
      console.log(err)
      return res.render('error', {
        pageName: 'Error al cerrar sesión',
        userLogged: req.user,
        messages: req.session.messages,
      })
    }

    req.session.messages = {
      success: ['Password Modificado Correctamente, vuelve a iniciar sesión']
    }

    return res.redirect('/sign-in')
  })
}

export const uploadProfileImageForm = async (req = request, res = response) => {
  const { id } = req.user
  const user = await User.findByPk(id)

  return res.render('profile-image', {
    pageName: 'Cambiar imagen de perfil',
    user,
    userLogged: req.user,
    messages: req.session.messages,
  })
}

export const saveProfileImage = async (req = request, res = response) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const { id } = req.user
  const user = await User.findByPk(id)

  if (req.file && user.image) {
    const lastImagePath = __dirname + `/../public/uploads/profiles/${user.image}`

    fs.unlink(lastImagePath, (err) => {
      if (err) {
        console.log(err)
      }

      return
    })
  }

  if (req.file) {
    user.image = req.file.filename
  }

  await user.save()

  req.session.messages = {
    success: ['Imagen de perfil guardada correctamente']
  }

  return res.redirect('/administration')
}

/* PUBLIC */
export const showUser = async (req = request, res = response) => {
  const { id: userId } = req.params

  const queries = [
    User.findOne({ where: { id: userId } }),
    Group.findAll({ where: { userId } }),
  ]

  const [user, groups] = Promise.all(queries)

  if (!user) {
    return res.redirect('/')
  }

  return res.render('show-profile', {
    pageName: `Perfil de usuario: ${user.name}`,
    user,
    groups,
    userLogged: req.user,
    messages: req.session.messages,
  })
}
