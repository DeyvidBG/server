import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { School, IdType, User, Role } from '../model'
import { SchoolRepository, UserRepository } from '../dao'
import { verifyToken, verifyRole } from './../security'
import { validate } from '../middleware'
import { schoolSchema } from '../schema'

const router = express.Router()

const schoolRepository: SchoolRepository<IdType, School> = new SchoolRepository<
  IdType,
  School
>()
const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

router.get('/', (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    res.status(200).json(await schoolRepository.getAll())
  }, 'Error getting schools.')
})

router.get(
  '/unverified',
  verifyToken,
  verifyRole([Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res
        .status(200)
        .json(await schoolRepository.getAllUnverified())
        .end()
    })
  }
)

router.post('/', validate(schoolSchema), (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body as School
    const principal = await userRepository.getByEmail(
      data.principalEmail as Partial<User>
    )
    const vicePrincipal = await userRepository.getByEmail(
      data.vicePrincipalEmail as Partial<User>
    )
    if (principal && vicePrincipal) {
      if (principal.role === 1 && vicePrincipal.role === 1) {
        await userRepository.updateUsersRole(principal.id, Role.Principal)
        await userRepository.updateUsersRole(vicePrincipal.id, Role.Principal)
        await schoolRepository.create({
          name: data.name,
          welcomeText: data.welcomeText,
          principalId: principal.id,
          vicePrincipalId: vicePrincipal.id,
          country: data.country,
          city: data.city,
          zipCode: data.zipCode,
          streetAddress: data.streetAddress,
          website: data.website,
        })
        res
          .status(200)
          .json({ code: 1, msg: 'A new school was successfully created.' })
      } else {
        res
          .status(400)
          .json({
            code: 3,
            msg: 'One or both of the user has/have already a role in our system.',
          })
          .end()
      }
    } else {
      res
        .status(400)
        .json({
          code: 3,
          msg: 'One or both of the emails is/are not in the system.',
        })
        .end()
    }
  }, 'Error creating school.')
})

export default router