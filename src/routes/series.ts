import e from 'express'
import { Code } from '../configs'
import Series from '../db/series'
import auth, { authRole, authUserInSeries } from '../middlewares/auth'

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
        series
          .addUser(req.query.email as string)
          .then(() => {
            return res.status(Code.Created).send(String(series.id))
          })
          .catch((err) => {
            console.log(err)
            return res.status(Code.InternalServerError).send(err)
          })
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

router.get('/query', (req: e.Request, res: e.Response) => {
  Series.findAll()
    .then((seriesArray) => {
      return res.send(seriesArray)
    })
    .catch((err) => {
      return res.status(Code.InternalServerError).send(err)
    })
})

router.get('/query/:id', (req: e.Request, res: e.Response) => {
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

router.post('/update/:id', [auth], (req: e.Request, res: e.Response) => {
  Series.update(
    {
      title: req.body.title,
      description: req.body.description,
      seminars: req.body.seminars,
    },
    { where: { id: req.params.id } },
  )
    .then((value) => {
      if (value[0] === 1) {
        return res.send(`Successfully update series id ${value[1][0].id}`)
      } else {
        return res.status(Code.InternalServerError).send('Error with ID')
      }
    })
    .catch((err) => {
      return res.status(Code.InternalServerError).send(err)
    })
})

router.get(
  '/delete/:id',
  [auth, authUserInSeries],
  (req: e.Request, res: e.Response) => {
    Series.destroy({ where: { id: req.params.id } })
      .then((_) => {
        return res.send('Successfully deleted.')
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

export default router
