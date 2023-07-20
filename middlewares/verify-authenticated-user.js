import { request, response } from 'express'

const verifyAuthenticatedUser = (req = request, res = response, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/sign-in')
  }

  return next()
}

export default verifyAuthenticatedUser
