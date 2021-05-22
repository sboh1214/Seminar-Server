import e from 'express'
import { verify } from 'jsonwebtoken'
import { Code, Configs } from '../configs'

export default function auth(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction,
) {
  try {
    const decoded = verify(req.headers.authorization ?? '', Configs.jwtSecret)
    req.query.email = (decoded as { email: string }).email
    next()
  } catch (err) {
    console.log(err)
    res.status(Code.Unauthorized).send('Access denied')
  }
}
