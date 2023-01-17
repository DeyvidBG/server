import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { School, IdType, User, Role, Group } from '../model'
import { GroupRepository, SchoolRepository, UserRepository } from '../dao'
import { verifyToken, verifyRole } from '../security'
import { addGroupSchema, teacherIdSchema } from '../schema'
import { validate } from '../middleware'

const router = express.Router()

const groupRepository: GroupRepository<IdType, Group> = new GroupRepository<
  IdType,
  Group
>()
const userRepository: UserRepository<IdType, User> = new UserRepository<
  IdType,
  User
>()

router.get(
  '/byTeacherId',
  verifyToken,
  verifyRole([Role.Teacher, Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const results = await groupRepository.getByTeacherId(res.locals.user.id)
      results ? res.status(200).json(results) : res.status(400).json(null)
    }, 'Error getting group.')
  }
)

router.post(
  '/',
  verifyToken,
  verifyRole([Role.Teacher, Role.Principal, Role.Admin]),
  validate(addGroupSchema),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const data = req.body
      const result = await groupRepository.create({
        name: data.name,
        type: data.type,
        teacherId: res.locals.user.id,
      })
      result > 0 ? res.status(204).end() : res.status(400).end()
    }, 'Error creating group.')
  }
)

router.delete(
  '/:groupId',
  verifyToken,
  verifyRole([Role.Teacher, Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const params = req.params
      await groupRepository.deleteSubscriptions(+params.groupId)
      const deleted = await groupRepository.delete(+params.groupId)
      deleted ? res.status(204).end() : res.status(400).end()
    }, 'Error deleting group.')
  }
)

export default router
