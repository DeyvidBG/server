import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { Subject, IdType, Role } from '../model'
import { SubjectRepository } from '../dao'
import { subjectIdSchema, subjectSchema } from '../schema'
import { validate } from '../middleware'
import verifyToken from './../security/verifyToken'
import verifyRole from './../security/verifyRole'

const router = express.Router()

const subjectRepository: SubjectRepository<IdType, Subject> =
  new SubjectRepository<IdType, Subject>()

router.get(
  '/',
  verifyToken,
  verifyRole([Role.Teacher, Role.Principal, Role.Admin]),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res.status(200).json(await subjectRepository.getAll())
    }, 'Error getting subjects.')
  }
)

router.get(
  '/:subjectId',
  validate(subjectIdSchema),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res
        .status(200)
        .json(await subjectRepository.getById(+req.params.subjectId))
    }, 'Error getting subject.')
  }
)

router.post('/', validate(subjectSchema), (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body
    const result = await subjectRepository.create({
      schoolId: data.schoolId,
      name: data.name,
      description: data.description,
    })
    res.status(200).json({
      code: 1,
      msg: 'A new subject was added!',
      payload: { id: result, ...req.body },
    })
  }, 'Error creating subject.')
})

router.put(
  '/:subjectId',
  validate(subjectSchema.concat(subjectIdSchema)),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const updated = await subjectRepository.update(
        { ...req.body },
        +req.params.subjectId
      )
      updated ? res.status(204).end() : res.status(400).end()
    }, 'Error updating subject.')
  }
)

router.delete(
  '/:subjectId',
  validate(subjectIdSchema),
  async (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      const deleted = await subjectRepository.delete(+req.params.subjectId)
      deleted ? res.status(204).end() : res.status(400).end()
    })
  }
)

export default router
