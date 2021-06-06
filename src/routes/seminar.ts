import e from 'express'
import { Code } from '../configs'
import Seminar from '../db/seminar'
import auth from '../middlewares/auth'

const router = e.Router()

router.post('/create', [auth], (req: e.Request, res: e.Response) => {
  Seminar.create({ title: req.body.title, description: req.body.description })
    .then((seminar) => {
      return res.status(Code.Created).send(String(seminar.id))
    })
    .catch((reason) => {
      console.log(reason)
      return res.status(Code.InternalServerError).send(reason)
    })
})

router.get('/query', [auth], (req: e.Request, res: e.Response) => {
  Seminar.findAll()
})

router.post('/update', [auth], (req: e.Request, res: e.Response) => {
  // Series.update()
})

router.get('/remove', [auth], (req: e.Request, res: e.Response) => {
  Seminar.destroy()
})

export default router
