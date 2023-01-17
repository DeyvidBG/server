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
  '/verified',
  verifyToken,
  verifyRole([Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res
        .status(200)
        .json(await schoolRepository.getAllVerified())
        .end()
    })
  }
)

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

router.get(
  '/teacher/:teacherEmail',
  verifyToken,
  verifyRole([Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const params = req.params
      const teacherStatus = await schoolRepository.getTeacherStatus(
        params.teacherEmail,
        res.locals.user.id
      )
      if (teacherStatus) {
        res.status(200).json(teacherStatus)
      } else {
        res.status(200).json({
          ...(await userRepository.getByEmail(params.teacherEmail)),
          status: 0,
        })
      }
    })
  }
)

router.post('/', validate(schoolSchema), (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body as School
    const principal = await userRepository.getByEmail(data.principalEmail)
    const vicePrincipal = await userRepository.getByEmail(
      data.vicePrincipalEmail
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

router.put(
  '/verify',
  verifyToken,
  verifyRole([Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const updated = await schoolRepository.verifySchool(req.body.schoolId)
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating school.')
  }
)

router.put(
  '/assign/:teacherId',
  verifyToken,
  verifyRole([Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const params = req.params
      const updated = await schoolRepository.assignTeacher(
        +params.teacherId,
        res.locals.user.id
      )
      if (updated) {
        userRepository.updateUsersRole(+params.teacherId, Role.Teacher)
        res.status(204).end()
      } else {
        res.status(400).end()
      }
    }, 'Error assigning teacher.')
  }
)

router.delete(
  '/dismiss/:teacherId',
  verifyToken,
  verifyRole([Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const params = req.params
      const deleted = await schoolRepository.dismissTeacher(+params.teacherId)
      if (deleted) {
        userRepository.updateUsersRole(+params.teacherId, Role.User)
        res.status(204).end()
      } else {
        res.status(400).end()
      }
    })
  }
)

export default router
