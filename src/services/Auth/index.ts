import express, { Request, Response } from 'express'
import { encryptPassword, checkPassword } from '../../utils'
import { IdType } from '../shared-types'
import { User } from '../Users/User'
import { UserApi } from '../Users/users'
const router = express.Router()

const userApi: UserApi<IdType, User> = new UserApi<IdType, User>()

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const data = req.body
    const emailAlreadyExists = await userApi.checkEmail(data.email)
    if (emailAlreadyExists) {
      res.json({ code: 3, msg: 'Email is already registered!' })
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
      res.json({ code: 1, msg: 'A new record was created!' })
    }
  } catch (error) {
    console.error(error)
    res.json({
      code: 4,
      msg: 'Unexpected error occurred. Please try again later!',
    })
  }
})

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const results = await userApi.getByEmail(req.body.email)
    if (results.length > 0) {
      const isProvidedPasswordCorrect = await checkPassword(
        req.body.password,
        results[0].password
      )
      if (isProvidedPasswordCorrect) {
        res.json({
          code: 1,
          msg: 'Successfully logged in!',
          payload: { ...results[0] },
        })
      } else {
        res.json({ code: 3, msg: 'Invalid password!' })
      }
    } else {
      res.json({ code: 2, msg: 'There is no user with that email address.' })
    }
  } catch (error) {
    console.error(error)
    res.json({
      code: 4,
      msg: 'Unexpected error occurred. Please try again later!',
    })
  }
})

router.post('/checkCookie', (req: Request, res: Response) => {
  console.log(req.cookies)
})

export default router
