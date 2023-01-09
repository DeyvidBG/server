import express, { Request, Response } from 'express'
import { IdType } from '../shared-types'
import { Room } from './Room'
import { RoomsApi } from './rooms'
const router = express.Router()

const roomApi: RoomsApi<IdType, Room> = new RoomsApi<IdType, Room>()
