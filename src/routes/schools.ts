import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { School, IdType } from '../model'
import { SchoolRepository } from '../dao'
import { verifyToken, verifyRole } from './../security'

const router = express.Router()

const schoolRepository: SchoolRepository<IdType, School> = new SchoolRepository<
  IdType,
  School
>()
