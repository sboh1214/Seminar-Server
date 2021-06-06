import e from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { genSaltSync, hashSync } from 'bcrypt'
import AuthRouter from './routes/auth'
import SeminarRouter from './routes/seminar'
import SeriesRouter from './routes/series'
import { Sequelize } from 'sequelize'
import User, { createAssociations, initUser, UserRole } from './db/user'
import { Configs } from './configs'
import Seminar, { initSeminar } from './db/seminar'
import Series, { initSeries } from './db/series'

const app = e()

app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser('10'))
app.use(e.json())
app.use(e.urlencoded({ extended: true }))

app.get('/', (_: e.Request, res: e.Response) => {
  res.send('Hello World')
})
app.use('/auth', AuthRouter)
app.use('/seminar', SeminarRouter)
app.use('/series', SeriesRouter)

const sequelize = new Sequelize(
  Configs.database,
  Configs.username,
  Configs.password,
  {
    host: Configs.host,
    dialect: 'postgres',
    logging: false,
  },
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')

    initUser(sequelize)
    initSeminar(sequelize)
    initSeries(sequelize)
    createAssociations()

    if (!Configs.production) {
      User.sync({ force: true }).then(() => {
        const hash = hashSync('admin', genSaltSync(10))

        User.create({
          email: 'admin@admin.org',
          secret: hash,
          role: UserRole.ADMIN,
        })
      })
      Seminar.sync({ force: true })
      Series.sync({ force: true })
    }

    app.listen(Configs.port, () => {
      console.log(`App listening on port ${Configs.port}`)
    })
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

export default app
