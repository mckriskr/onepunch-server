// @ts-nocheck
import type {Express} from 'express'
import passport from 'passport'
import {Strategy as LocalStrategy} from 'passport-local'

import Account from '../models/account'

import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt'

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
  // issuer: 'accounts.examplesoft.com',
  // audience: 'yoursite.net'
}

export const passportSetup = (app: Express) => {
  app.use(passport.initialize())
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('jwt_payload', jwt_payload)
    })
  )
  // passport.use(new LocalStrategy(Account.authenticate()))

  // passport.serializeUser(Account.serializeUser())
  // passport.deserializeUser(Account.deserializeUser())

  /*
  passport.use(new LocalStrategy(Account.authenticate()))
  passport.serializeUser(Account.serializeUser())
  passport.deserializeUser(Account.deserializeUser())
  
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('jwt_payload', jwt_payload)
      // User.findOne({id: jwt_payload.sub}, function(err, user) {
      //     if (err) {
      //         return done(err, false);
      //     }
      //     if (user) {
      //         return done(null, user);
      //     } else {
      //         return done(null, false);
      //         // or you could create a new account
      //     }
      // });
    })
  )
  */
}
