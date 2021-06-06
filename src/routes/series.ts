import e from 'express'
import { Code } from '../configs'
import Series from '../db/series'
import auth, { authRole } from '../middlewares/auth'

const router = e.Router()

router.post(
  '/create',
  [auth, authRole('speaker')],
  (req: e.Request, res: e.Response) => {
    Series.create({
      title: req.body.title,
      description: req.body.description,
      seminars: req.body.seminars,
    })
      .then((series) => {
        return res.status(Code.Created).send(String(series.id))
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

router.get('/query', [auth], (req: e.Request, res: e.Response) => {
  Series.findAll()
})

router.get('/query/:id', [auth], (req: e.Request, res: e.Response) => {
  Series.findByPk(req.params.id as string)
    .then((series: Series | null) => {
      if (series == null) {
        return res
          .status(Code.NotFound)
          .send(`There is no series with id ${req.params.id}`)
      }
      return res.send(series)
    })
    .catch((err) => {
      return res.status(Code.InternalServerError).send(err)
    })
})

router.post('/update', [auth], (req: e.Request, res: e.Response) => {
  // Series.update()
})

router.get('/remove', [auth], (req: e.Request, res: e.Response) => {
  Series.destroy()
})

export default router
