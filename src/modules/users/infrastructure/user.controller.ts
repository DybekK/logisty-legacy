import { Request, Router } from 'express'
import { Response } from 'express'
import { Effect } from 'effect'
import { Controller, validate } from '../../../infrastructure/controller'
import { UserService } from './user.service'
import { AuthService } from './auth.service'
import { createUserPayloadRules } from '../domain/payloads/create-user.payload'

export const UserController = (userService: UserService, authService: AuthService): Controller => {
  const routes = (router: Router): Effect.Effect<never, never, void> => {
    router.get('/users', (_, res: Response) => {
      Effect.runPromise(userService.findAll()).then(users => res.json(users))
    })

    router.get('/users/:id', (req: Request, res: Response) => {
      const { id } = req.params
      Effect.runPromise(userService.findOne(id)).then(user => res.json(user))
    })

    router.post('/users', validate(createUserPayloadRules), (req: Request, res: Response) => {
      Effect.runPromise(authService.createUser(req.body))
        .then(user => res.json(user))
        .catch(error => res.status(400).json({ error: error.message }))
    })

    return Effect.unit
  }

  return { routes }
}
