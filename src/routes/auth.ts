import express, { Request, Response } from 'express'
import { UserRepository } from '../dao'
import { validate } from '../middleware'
import { IdType, User } from '../model'
import { userSchema, userSignInSchema } from '../schema'
import { checkPassword, encryptPassword, tryCatchWrapper } from '../utils'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../security'

const router = express.Router()

const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

router.post(
  '/signin',
  validate(userSignInSchema),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const user = await userRepository.getByEmail(req.body.email)
      if (user) {
        const isProvidedPasswordCorrect = await checkPassword(
          req.body.password,
          user.password
        )
        if (isProvidedPasswordCorrect) {
          const accessToken = jwt.sign(
            { ...user },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: '1h',
            }
          )
          res.json({
            code: 1,
            msg: 'Successfully logged in!',
            payload: user,
            jwt: accessToken,
          })
        } else {
          res.json({ code: 3, msg: 'Invalid password!' })
        }
      } else {
        res.json({ code: 2, msg: 'There is no user with that email address.' })
      }
    }, 'Error signing in user.')
  }
)

router.post(
  '/singup',
  validate(userSchema),
  async (req: Request, res: Response) => {
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
  }
)

router.get('/getUserData', verifyToken, (req: Request, res: Response) => {
  const user = res.locals.user
  if (user) {
    res.status(200).json({ user: user })
  }
})

export default router
