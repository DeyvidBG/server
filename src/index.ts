import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import logger from 'morgan'
import cors from 'cors'
import { JwtPayload } from 'jsonwebtoken'
import { users, subjects, schools, auth, groups } from './routes'
import {
  AuthenticationError,
  ForbiddenError,
  InvalidDataError,
  NotFoundError,
} from './model'
import { sendErrorResponse } from './utils'

const PORT = 8000
const app: Express = express()
const jsonParser = bodyParser.json()

declare global {
  namespace Express {
    interface Request {
      user: string | JwtPayload
    }
  }
}

app.use(cors())
app.use(bodyParser.json({ type: 'application/json' }))
app.use(logger('dev'))
app.use((err, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  let status = 500
  if (err instanceof AuthenticationError) {
    status = 401
  } else if (err instanceof ForbiddenError) {
    status = 403
  } else if (err instanceof NotFoundError) {
    status = 404
  } else if (err instanceof InvalidDataError) {
    status = 400
  }
  sendErrorResponse(
    req,
    res,
    err.status || status,
    `Error: ${err.message}`,
    err
  )
})

// All routes with user
app.use('/users', users)
app.use('/subjects', subjects)
app.use('/schools', schools)
app.use('/groups', groups)
app.use('/auth', auth)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
