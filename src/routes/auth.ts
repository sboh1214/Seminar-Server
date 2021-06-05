import e from 'express'
import jwt from 'jsonwebtoken'
import { compareSync, genSaltSync, hashSync } from 'bcrypt'
import User from '../db/user'
import { Code } from '../configs'
import auth from '../middlewares/auth'

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

      const { accessToken, refreshToken } = createToken(email)
      return res
        .cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 })
        .cookie('refreshToken', refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 14,
        })
        .send()
    })
    .catch(() => {
      return res.status(Code.InternalServerError).send('Failed to query user.')
    })
})

router.get(
  '/refresh',
  auth('refreshToken'),
  (req: e.Request, res: e.Response) => {
    const { accessToken, refreshToken } = createToken(req.cookies.refreshToken)
    return res
      .cookie('accessToken', accessToken, { maxAge: 1000 * 60 * 60 })
      .cookie('refreshToken', refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 14,
      })
      .send()
  },
)

function createToken(email: string) {
  const accessToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET_KEY ?? 'JWT_SECRET_KEY',
    { expiresIn: '1h' },
  )
  const refreshToken = jwt.sign(
    {
      email: email,
    },
    process.env.JWT_SECRET_KEY ?? 'JWT_SECRET_KEY',
    { expiresIn: '2week' },
  )
  return { accessToken, refreshToken }
}

export default router
