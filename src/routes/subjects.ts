import express, { Request, Response } from 'express'
import { tryCatchWrapper } from '../utils'
import { Subject, IdType } from '../model'
import { SubjectAPI } from '../api'
import { subjectIdSchema, subjectSchema } from '../schema'
import { validate } from '../middleware'

const router = express.Router()

const subjectAPI: SubjectAPI<IdType, Subject> = new SubjectAPI<
  IdType,
  Subject
>()

router.get('/', (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    res.status(200).json(await subjectAPI.getAll())
  }, 'Error getting subjects.')
})

router.get(
  '/:subjectId',
  validate(subjectIdSchema),
  (req: Request, res: Response) => {
    return tryCatchWrapper(async () => {
      res.status(200).json(await subjectAPI.getById(+req.params.subjectId))
    }, 'Error getting subject.')
  }
)

router.post('/', validate(subjectSchema), (req: Request, res: Response) => {
  return tryCatchWrapper(async () => {
    const data = req.body
    const result = await subjectAPI.create({
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
      const updated = await subjectAPI.update(
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
      const deleted = await subjectAPI.delete(+req.params.subjectId)
      deleted ? res.status(204).end() : res.status(400).end()
    })
  }
)

export default router
