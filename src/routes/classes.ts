import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { School, IdType, User, Role, Class } from '../model'
import { ClassRepository, SchoolRepository, UserRepository } from '../dao'
import { verifyToken, verifyRole } from './../security'

const router = express.Router()

const classRepository: ClassRepository<IdType, Class> = new SchoolRepository<
  IdType,
  Class
>()
const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

export default router
