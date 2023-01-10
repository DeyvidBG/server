import { ForbiddenError } from './../model/errors'
import { Request, Response, NextFunction } from 'express'
import { IdType, User } from '../model'
import { UserRepository } from '../dao'

const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

export default function verifyRole(roles) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userRepository.getById(res.locals.userId)
      if (!roles.includes(user.role)) {
        next(new ForbiddenError(`Access not allowed`))
        return
      }
      next()
    } catch (err) {
      next(err)
      return
    }
  }
}
