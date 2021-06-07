import e from 'express'
import { Code } from '../configs'
import Seminar from '../db/seminar'
import auth, { authRole, authUserInSeminar } from '../middlewares/auth'

const router = e.Router()

router.post(
  '/create',
  [auth, authRole('speaker')],
  (req: e.Request, res: e.Response) => {
    Seminar.create({
      title: req.body.title,
      description: req.body.description,
    })
      .then((seminar) => {
        seminar
          .addUser(req.query.email as string)
          .then(() => {
            return res.status(Code.Created).send(String(seminar.id))
          })
          .catch((err) => {
            console.log(err)
            return res.status(Code.InternalServerError).send(err)
          })
      })
      .catch((reason) => {
        console.log(reason)
        return res.status(Code.InternalServerError).send(reason)
      })
  },
)

router.get('/query', [auth], (req: e.Request, res: e.Response) => {
  Seminar.findAll({ order: ['updatedAt', 'DESC'], limit: 100 })
    .then((seminars) => {
      return res.send(seminars)
    })
    .catch((err) => {
      return res.status(Code.InternalServerError).send(err)
    })
})

router.get('/query/:id', (req: e.Request, res: e.Response) => {
  Seminar.findByPk(req.params.id as string)
    .then((seminar: Seminar | null) => {
      if (seminar == null) {
        return res
          .status(Code.NotFound)
          .send(`There is no seminar with id ${req.params.id}`)
      }
      return res.send(seminar)
    })
    .catch((err) => {
      return res.status(Code.InternalServerError).send(err)
    })
})

router.post(
  '/update/:id',
  [auth, authUserInSeminar],
  (req: e.Request, res: e.Response) => {
    Seminar.update(
      { title: req.body.title, description: req.body.description },
      { where: { id: req.params.id } },
    )
      .then((value) => {
        if (value[0] === 1) {
          return res.send(`Successfully update seminar id ${value[1][0].id}`)
        } else {
          return res.status(Code.InternalServerError).send('Error with ID')
        }
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

router.get(
  '/delete/:id',
  [auth, authUserInSeminar],
  (req: e.Request, res: e.Response) => {
    Seminar.destroy({ where: { id: req.params.id } })
      .then((_) => {
        return res.send('Successfully deleted')
      })
      .catch((err) => {
        return res.status(Code.InternalServerError).send(err)
      })
  },
)

export default router
