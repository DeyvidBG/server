import express, { Request, Response } from 'express'
import { encryptPassword, tryCatchWrapper } from '../utils'
import { User, IdType, Role } from '../model'
import { UserRepository } from '../dao'
import { userSchema, userIdSchemaParams, userIdSchemaBody } from '../schema'
import { validate } from '../middleware'
import { verifyToken, verifyRole } from '../security'

const router = express.Router()

const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

router.get(
  '/',
  verifyToken,
  verifyRole([Role.Admin]),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res.status(200).json(await userRepository.getAll())
    }, 'Error getting users.')
  }
)

router.get(
  '/:userId',
  validate(userIdSchemaParams),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res.status(200).json(await userRepository.getById(+req.params.userId))
    }, 'Error getting user.')
  }
)

router.post('/', validate(userSchema), async (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body
    const emailAlreadyExists = await userRepository.checkIfEmailExists(
      data.email
    )
    if (emailAlreadyExists) {
      res.json({ code: 2, msg: 'Email is already registered!' })
      res.status(400).end()
    } else {
      const encryptedPassword = await encryptPassword(data.password)
      await userRepository.create({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        email: data.email,
        password: encryptedPassword,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        role: 1,
      })
      res.status(200).json({ code: 1, msg: 'A new account was created!' })
    }
  }, 'Error creating an account.')
})

router.put(
  '/makeAdmin',
  verifyToken,
  verifyRole([Role.Admin]),
  validate(userIdSchemaBody),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const data = req.body
      const updated = await userRepository.updateUsersRole(
        data.userId,
        Role.Admin
      )
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating users role.')
  }
)

router.put(
  '/makeUser',
  verifyToken,
  verifyRole([Role.Admin]),
  validate(userIdSchemaBody),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const updated = await userRepository.updateUsersRole(
        req.body.userId,
        Role.User
      )
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating users role.')
  }
)

router.put(
  '/:userId',
  verifyToken,
  validate(userSchema.concat(userIdSchemaParams)),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const data = req.body
      const encryptedPassword = await encryptPassword(data.password)
      const updated = await userRepository.update(
        {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          password: encryptedPassword,
          phoneNumber: data.phoneNumber,
          birthDate: new Date(data.birthDate),
          gender: data.gender,
          role: data.role,
        },
        +req.params.userId
      )
      updated
        ? res.status(204).json({ msg: 'Successful!' }).end()
        : res.status(400).json({ msg: 'Unsuccessful!' }).end()
    }, 'Error updating user.')
  }
)

router.delete(
  '/:userId',
  verifyToken,
  verifyRole([Role.Admin]),
  validate(userIdSchemaParams),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const deleted = await userRepository.delete(parseInt(req.params.userId))
      deleted ? res.status(204).end() : res.status(400).end()
    }, 'Error deleting user.')
  }
)

export default router
