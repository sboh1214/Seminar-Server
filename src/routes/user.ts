import e from 'express'
import { Code } from '../configs'
import User from '../db/user'

const router = e.Router()

router.get('/query/:email', (req: e.Request, res: e.Response) => {
  User.findByPk(req.params.email)
    .then((user) => {
      if (!user) {
        return res
          .status(Code.NotFound)
          .send(`There is no user with "${req.params.email}"`)
      }
      return res.send(user)
    })
    .catch((err) => {
      res.status(Code.InternalServerError).send(err)
    })
})

export default router
