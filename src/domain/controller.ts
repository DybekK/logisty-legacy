import { Effect } from 'effect'
import { Router } from 'express'

export interface Controller {
  routes(router: Router): Effect.Effect<never, never, void>
}
