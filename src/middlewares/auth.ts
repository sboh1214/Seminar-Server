import e from 'express'
import { verify } from 'jsonwebtoken'
import { Code, Configs } from '../configs'
import { createToken } from '../utils/utils'

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
      const { accessToken, refreshToken } = createToken(
        (decoded as { email: string }).email,
      )
      res
        .cookie('accessToken', accessToken, {
          maxAge: 1000 * 3600,
          signed: true,
          httpOnly: true,
          sameSite: false,
        })
        .cookie('refreshToken', refreshToken, {
          maxAge: 1000 * 3600 * 24 * 14,
          signed: true,
          httpOnly: true,
          sameSite: false,
        })
      next()
    } catch (err) {
      console.log(err)
      res.status(Code.Unauthorized).send('Access denied')
    }
  }
}
