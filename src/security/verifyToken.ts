import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../model'

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const tokenHeader = req.headers['authorization']
  if (!tokenHeader) {
    next({ status: 401, message: `Unauthorized` })
    return
  }
  const segments = tokenHeader.split(' ')
  if (
    segments.length !== 2 ||
    segments[0].trim() !== 'Bearer' ||
    segments[1].trim().length < 80
  ) {
    next({ status: 401, message: `No access token provided.` })
    return
  }
  const token = segments[1].trim()

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded: User) => {
    if (error)
      next({ status: 403, message: `Failed to authenticate token.`, error })
    else {
      res.locals.user = decoded
      next()
    }
  })
}

export default verifyToken
