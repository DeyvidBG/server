import { Request, Response, NextFunction } from 'express'

const validate =
  (schema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      return next()
    } catch (err) {
      return res
        .status(400)
        .json({
          code: 4,
          msg: `Data was manipulated between client and server. ${err.message} That's not cool.`,
        })
    }
  }

export default validate
