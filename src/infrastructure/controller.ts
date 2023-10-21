import { Effect } from 'effect'
import { NextFunction, Request, Response, Router } from 'express'
import { validationResult, ValidationChain } from 'express-validator'

export interface Controller {
  routes(router: Router): Effect.Effect<never, never, void>
}

export const validate = (validations: ValidationChain[]) => {
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
