import e from 'express'
import Series from '../db/series'
import auth, { authRole } from '../middlewares/auth'

const router = e.Router()

router.post(
  '/create',
  [auth, authRole('speaker')],
  (req: e.Request, res: e.Response) => {
    Series.create()
  },
)

router.get('/query', [auth], (req: e.Request, res: e.Response) => {
  Series.findAll()
})

router.post('/update', [auth], (req: e.Request, res: e.Response) => {
  // Series.update()
})

router.get('/remove', [auth], (req: e.Request, res: e.Response) => {
  Series.destroy()
})

export default router
