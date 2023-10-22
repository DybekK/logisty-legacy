import { Router, Request, Response } from 'express'
import { Controller, runLogic } from '../../../infrastructure/controller'
import { RawEffect, UnitEffect } from '../../../utils/effect.type'
import { Effect } from 'effect'
import { RouteService } from './route.service'

export const RouteController = (routeService: RouteService): Controller => {
  const routes = (router: Router): UnitEffect => {
    router.post('/routes', runLogic(matchPoints))

    return Effect.unit
  }

  const matchPoints = (req: Request, res: Response): RawEffect<void, void> =>
    Effect.gen(function* (_) {
      const result = yield* _(routeService.matchPoints(req.body))
      const cordinates = result.matchings
        .flatMap(matching => matching.legs)
        .flatMap(leg => leg?.steps)
        .flatMap(step => step?.intersections)
        .map(intersection => intersection?.location)

      res.json(cordinates)
    })

  return { routes }
}
