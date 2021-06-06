import e from 'express'
import { verify } from 'jsonwebtoken'
import { Code, Configs } from '../configs'
import User from '../db/user'
import { createToken, setCookies } from '../utils/utils'

export default function auth(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  if (!req.signedCookies.refreshToken) {
    return res.status(Code.Unauthorized).send('No credentials')
  }
  try {
    const decoded = verify(req.signedCookies.accessToken, Configs.jwtSecret)
    req.query.email = (decoded as { email: string }).email
    next()
  } catch (err) {
    try {
      const decoded = verify(req.signedCookies.refreshToken, Configs.jwtSecret)
      req.query.email = (decoded as { email: string }).email
      setCookies(res, createToken((decoded as { email: string }).email))
      next()
    } catch (err) {
      console.log(err)
      res.status(Code.Unauthorized).send('Access denied')
    }
  }
}

export function authRole(role: 'speaker' | 'admin') {
  return (req: e.Request, res: e.Response, next: e.NextFunction) => {
    User.findByPk(req.query.email as string).then((user) => {
      if (!user) {
        res.status(Code.BadRequest).send('There is no such user.')
      }
      if (role === 'speaker') {
        if (user?.isSpeaker) {
          return next()
        } else {
          res.status(Code.Unauthorized).send(`User has no role "${role}"`)
        }
      } else if (role === 'admin') {
        if (user?.isAdmin) {
          return next()
        } else {
          res.status(Code.Unauthorized).send(`User has no role "${role}"`)
        }
      }
    })
  }
}
