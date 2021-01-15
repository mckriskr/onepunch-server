import passport from 'passport'
import type {Request, Response, NextFunction} from 'express'

import * as J from './jwt'

const authorizationError = (res: Response) => {
  res.status(401).json({
    success: false,
    message: 'A verification code is required'
  })
}

export const authenticate = () => {
  return (
    passport.authenticate('jwt', {session: false}),
    (req: Request, res: Response, next: NextFunction) => {
      const body = req.body
      const {authorization} = req.headers
      const jwt = authorization?.substr('Bearer '.length)
      //console.log('authenticate', jwt)
      if (jwt) {
        J.jwtVerify(jwt)
          .then((decoded: object) => {
            console.log('decode', decoded)
            next()
          })
          .catch((err) => {
            authorizationError(res)
          })
      } else {
        authorizationError(res)
      }
    }
  )
}
