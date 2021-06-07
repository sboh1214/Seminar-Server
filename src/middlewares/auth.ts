import e from 'express'
import { verify } from 'jsonwebtoken'
import { Code, Configs } from '../configs'
import Seminar from '../db/seminar'
import Series from '../db/series'
import User, { UserRole } from '../db/user'
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
        return res.status(Code.BadRequest).send('There is no such user.')
      }
      if (role === 'speaker') {
        if (user?.role === UserRole.SPEAKER || user?.role === UserRole.ADMIN) {
          return next()
        } else {
          return res
            .status(Code.Unauthorized)
            .send(`User has no role "${role}"`)
        }
      } else if (role === 'admin') {
        if (user?.role === UserRole.ADMIN) {
          return next()
        } else {
          return res
            .status(Code.Unauthorized)
            .send(`User has no role "${role}"`)
        }
      }
    })
  }
}

export function authUserInSeminar(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  Seminar.findByPk(req.params.id as string).then((seminar) => {
    if (!seminar) {
      return res
        .status(Code.NotFound)
        .send(`There is no seminar with ID "${req.params.id}"`)
    }
    if (seminar.hasUser(req.query.email as string)) {
      return next()
    } else {
      return res
        .status(Code.Unauthorized)
        .send('You are not owner of this seminar')
    }
  })
}

export function authUserInSeries(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  Series.findByPk(req.params.id as string).then((series) => {
    if (!series) {
      return res
        .status(Code.NotFound)
        .send(`There is no series with ID "${req.params.id}"`)
    }
    if (series.hasUser(req.query.email as string)) {
      return next()
    } else {
      return res
        .status(Code.Unauthorized)
        .send('You are not owner of this series')
    }
  })
}

export function authAdmin(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  User.findByPk(req.query.email as string).then((user) => {
    if (!user) {
      return res
        .status(Code.NotFound)
        .send(`There is no user with email "${req.query.email}"`)
    }
    if (user?.role === UserRole.ADMIN) {
      return next()
    } else {
      return res.status(Code.Unauthorized).send('You are not admin user.')
    }
  })
}
