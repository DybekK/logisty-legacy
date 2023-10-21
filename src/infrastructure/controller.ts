import { Effect } from 'effect'
import { Router, Request, Response } from 'express'
import { UnitEffect, RawEffect } from 'src/utils/effect.type'

export interface Controller {
  routes(router: Router): UnitEffect
}

export const runLogic =
  <E, A>(logic: (req: Request, res: Response) => RawEffect<E, A>) =>
  (req: Request, res: Response) =>
    Effect.runPromise(logic(req, res))
