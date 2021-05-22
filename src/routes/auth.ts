import e from 'express'
import jwt from 'jsonwebtoken'
import { compareSync } from 'bcrypt'
import User from '../db/user'
import { Code } from '../configs'
import auth from '../middlewares/auth'

const router = e.Router()

router.post('/signin', (req: e.Request, res: e.Response) => {
  const { email, password } = req.body

  User.findByPk(email)
    .then((user: User | null) => {
      if (!user) return res.status(400).send('There is no such user')

      const isSamePassword = compareSync(password, user.secret)
      if (!isSamePassword) return res.status(400).send('Wrong Password')
      return res.json(createToken(email))
    })
    .catch(() => {
      return res.status(Code.InternalServerError).send('DB Error')
    })
})

router.get('/refresh', auth, (req: e.Request, res: e.Response) => {
  return res.json(createToken(req.query.email as string))
})

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
