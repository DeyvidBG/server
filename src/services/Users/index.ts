import express, { Request, Response } from 'express'
import { encryptPassword } from '../../utils'
import { IdType } from '../shared-types'
import { User } from './User'
import { UserApi } from '../../api'
const router = express.Router()

const userApi: UserApi<IdType, User> = new UserApi<IdType, User>()

router.get('/', async (req: Request, res: Response) => {
  try {
    res.json(await userApi.getAll())
  } catch (error) {
    console.error(error)
  }
})

router.get('/:userId', async (req: Request, res: Response) => {
  try {
    res.json(await userApi.getById(parseInt(req.params.userId)))
  } catch (error) {
    console.error(error)
  }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body
    const emailAlreadyExists = await userApi.checkIfEmailExists(data.email)
    if (emailAlreadyExists) {
      res.json({ msg: 'Email is already registered!' })
      res.status(400).end()
    } else {
      const encryptedPassword = await encryptPassword(data.password)
      await userApi.create({
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
      res.json({ msg: 'A new record was created!' })
    }
  } catch (error) {
    console.error(error)
  }
})

router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const edited = await userApi.update({ ...req.body }, +req.params.userId)
    edited ? res.status(200).end() : res.status(404).end()
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const deleted = await userApi.delete(parseInt(req.params.userId))
    deleted ? res.status(200).end() : res.status(404).end()
  } catch (error) {
    console.error(error)
  }
})

export default router
