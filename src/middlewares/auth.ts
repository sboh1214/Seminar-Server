import e from 'express'
import { verify } from 'jsonwebtoken'
import { Code, Configs } from '../configs'

export default function auth(type?: 'accessToken' | 'refreshToken') {
  return (req: e.Request, res: e.Response, next: e.NextFunction) => {
    try {
      const decoded = verify(
        req.cookies[type ?? 'accessToken'] ?? '',
        Configs.jwtSecret,
      )
      req.query.email = (decoded as { email: string }).email
      next()
    } catch (err) {
      console.log(err)
      res.status(Code.Unauthorized).send('Access denied')
    }
  }
}
