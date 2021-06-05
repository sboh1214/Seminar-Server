import e from 'express'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import User from '../db/user'
import { Code } from '../configs'
import auth from '../middlewares/auth'
import { createToken, setCookies } from '../utils/utils'

const router = e.Router()

router.post('/signup', (req: e.Request, res: e.Response) => {
  const { email, password, localName, englishName } = req.body
  User.findByPk(email)
    .then((user: User | null) => {
      if (user) {
        return res.status(Code.BadRequest).send('User already exist.')
      }
      const hash = hashSync(password, genSaltSync(10))
      User.create({
        email: email,
        secret: hash,
        localName: localName,
        englishName: englishName,
      })
        .then(() => {
          return res.status(Code.Created).send()
        })
        .catch((_) => {
          return res
            .status(Code.InternalServerError)
            .send('Failed to add user.')
        })
    })
    .catch((_) => {
      return res.status(Code.InternalServerError).send('Failed to query user.')
    })
})

router.post('/signin', (req: e.Request, res: e.Response) => {
  const { email, password } = req.body

  User.findByPk(email)
    .then((user: User | null) => {
      if (!user)
        return res.status(Code.BadRequest).send('There is no such user')

      const isSamePassword = compareSync(password, user.secret)
      if (!isSamePassword)
        return res.status(Code.BadRequest).send('Wrong Password')

      setCookies(res, createToken(email))
      return res.send()
    })
    .catch(() => {
      return res.status(Code.InternalServerError).send('Failed to query user.')
    })
})

router.get('/refresh', auth, (_: e.Request, res: e.Response) => {
  return res.send()
})

export default router
