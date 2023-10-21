import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req)
      if (result.context.errors.length) break
    }

    const errors = validationResult(req).array()
    if (!errors.length) {
      return next()
    }

    res.status(400).json({ errors })
  }
}
