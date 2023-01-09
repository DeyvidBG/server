import express, { Request, Response } from 'express'
import { encryptPassword, tryCatchWrapper } from '../utils'
import { User, IdType } from '../model'
import { UserAPI } from '../api'
import { userSchema, userIdSchema } from '../schema'
import { validate } from '../middleware'

const router = express.Router()

const userAPI: UserAPI<IdType, User> = new UserAPI<IdType, User>()

router.get('/', async (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    res.status(200).json(await userAPI.getAll())
  }, 'Error getting users.')
})

router.get(
  '/:userId',
  validate(userIdSchema),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res.status(200).json(await userAPI.getById(+req.params.userId))
    }, 'Error getting user.')
  }
)

router.post('/', validate(userSchema), async (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body
    const emailAlreadyExists = await userAPI.checkIfEmailExists(data.email)
    if (emailAlreadyExists) {
      res.json({ code: 2, msg: 'Email is already registered!' })
      res.status(400).end()
    } else {
      const encryptedPassword = await encryptPassword(data.password)
      await userAPI.create({
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
      const updated = await userAPI.update({ ...req.body }, +req.params.userId)
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating user.')
  }
)

router.delete(
  '/:userId',
  validate(userIdSchema),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const deleted = await userAPI.delete(parseInt(req.params.userId))
      deleted ? res.status(204).end() : res.status(400).end()
    }, 'Error deleting user.')
  }
)

export default router
