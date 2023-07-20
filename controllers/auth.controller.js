import { request, response } from 'express'
import passport from 'passport'

export const authenticateUser = passport.authenticate('local', {
  successRedirect: '/administration',
  failureRedirect: '/sign-in',
  // failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios',
})

export const signOut = async (req = request, res = response) => {
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
      success: ['Sesión cerrada correctamente']
    }

    return res.redirect('/sign-in')
  })
}
