import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import { User } from '../models/index.js'

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, next) => {
  const user = await User.findOne({ where: { email, active: 1 }})

  if (!user) {
    return next(null, false, {
      message: 'The user doesn\' exists'
    })
  }

  if (!user.matchPassword(password)) {
    return next(null, false, {
      message: 'Wrong password'
    })
  }

  return next(null, user)
}))

passport.serializeUser((user, next) => {
  return next(null, user)
})

passport.deserializeUser((user, next) => {
  return next(null, user)
})

export default passport
