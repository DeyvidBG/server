import { ForbiddenError } from './../model/errors'
import { Request, Response, NextFunction } from 'express'

// export default function verifyRole(roles) {
//   return async function (req: Request, res: Response, next: NextFunction) {
//     const userRepo = req.app.locals.usersRepo as UserRepository
//     try {
//       const user = await userRepo.findById(res.locals.userId)
//       if (!roles.includes(user.role)) {
//         next(new ForbiddenError(`Access not allowed`))
//         return
//       }
//       next()
//     } catch (err) {
//       next(err)
//       return
//     }
//   }
// }
