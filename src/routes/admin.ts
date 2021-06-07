import e from 'express'
import { Code } from '../configs'
import User from '../db/user'
import auth, { authAdmin } from '../middlewares/auth'

const router = e.Router()

router.post(
  '/update/:email',
  [auth, authAdmin],
  (req: e.Request, res: e.Response) => {
    User.update({ role: req.body.role }, { where: { email: req.params.email } })
      .then(() => {
        return res.send(`Successfully updated`)
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

router.get(
  '/delete/:email',
  [auth, authAdmin],
  (req: e.Request, res: e.Response) => {
    User.destroy({ where: { email: req.params.email } })
      .then(() => {
        return res.send(`Deleted user with email "${req.params.email}".`)
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

export default router
