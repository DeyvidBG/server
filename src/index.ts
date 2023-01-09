import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookies from 'cookie-parser'
import cors from 'cors'
import pool from './services/db'
import jwt, { JwtPayload } from 'jsonwebtoken'
import auths from './services/Auth/'
import { users, subjects } from './routes'

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
app.use(cookies())

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// All routes with user
app.use('/users', users)
app.use('/subjects', subjects)
app.use('/auth', auths)

// app.post('/login', (req: Request, res: Response) => {
//   const email = req.body.email
//   const password = req.body.password
//   const user = { email: email, password: password }

//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '1h',
//   })
//   res.cookie('jwt', accessToken, {
//     secure: true,
//     sameSite: 'lax',
//   })
//   res.setHeader('authorization', 'Bearer ' + accessToken)
//   res.json({ accessToken: accessToken })
// })

// app.get('/data', authenticateToken, (req: Request, res: Response) => {
//   res.json({ data: 'Successful transfer of data' })
// })

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
