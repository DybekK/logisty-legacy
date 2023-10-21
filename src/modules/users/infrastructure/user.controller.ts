import { Request, Router } from 'express'
import { Response } from 'express'
import { Effect, Either } from 'effect'
import { Controller, runLogic } from '../../../infrastructure/controller'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { createUserPayloadRules } from '../domain/user.payload'
import { validateRequest } from '../../../infrastructure/validator'
import { UnitEffect } from '../../../utils/effect.type'

export const UserController = (userService: UserService, authService: AuthService): Controller => {
  const routes = (router: Router): UnitEffect => {
    router.get('/users', runLogic(getUsers))
    router.get('/users/:id', runLogic(getUser))
    router.post('/users', validateRequest(createUserPayloadRules), runLogic(createUser))

    return Effect.unit
  }

  const getUsers = (_: Request, res: Response): UnitEffect =>
    Effect.gen(function* (_) {
      const users = yield* _(userService.findAll())
      res.json(users)
    })

  const getUser = (req: Request, res: Response): UnitEffect =>
    Effect.gen(function* (_) {
      const { id } = req.params
      const user = yield* _(userService.findOne(id))
      res.json(user)
    })

  const createUser = (req: Request, res: Response): UnitEffect =>
    Effect.gen(function* (_) {
      const result = yield* _(Effect.either(authService.createUser(req.body)))
      Either.match(result, {
        onLeft: error => res.status(400).json({ error }),
        onRight: user => res.json(user)
      })
    })

  return { routes }
}
