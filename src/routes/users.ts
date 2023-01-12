import express, { Request, Response } from 'express'
import { encryptPassword, tryCatchWrapper } from '../utils'
import { User, IdType, Role } from '../model'
import { UserRepository } from '../dao'
import { userSchema, userIdSchema } from '../schema'
import { validate } from '../middleware'
import verifyToken from './../security/verifyToken'
import { verifyRole } from '../security'

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
  validate(userIdSchema),
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
  '/:userId',
  validate(userSchema.concat(userIdSchema)),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const updated = await userRepository.update(
        { ...req.body },
        +req.params.userId
      )
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating user.')
  }
)

router.delete(
  '/:userId',
  validate(userIdSchema),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const deleted = await userRepository.delete(parseInt(req.params.userId))
      deleted ? res.status(204).end() : res.status(400).end()
    }, 'Error deleting user.')
  }
)

export default router
