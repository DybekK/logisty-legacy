import { IMatchOptions, IOsrmMatchResult } from 'osrm-rest-client'
import { RawEffect } from '../../../utils/effect.type'
import { MatchRouteError } from '../domain/route.error'
import { OSRMService } from '../../../infrastructure/osrm/osrm.service'
import { Effect } from 'effect'
import { OSRMError, OSRMErrorCode, OSRMErrorPattern } from '../../../infrastructure/osrm/osrm.error'
import { P, match } from 'ts-pattern'

export interface RouteService {
  matchPoints(options: IMatchOptions): RawEffect<MatchRouteError, IOsrmMatchResult>
}

export const RouteService = (osrm: OSRMService): RouteService => {
  const matchPoints = (options: IMatchOptions): RawEffect<MatchRouteError, IOsrmMatchResult> =>
    osrm.matchPoints(options).pipe(Effect.catchAll(fromOSRMError))

  const fromOSRMError = (error: OSRMError) => {
    const mappedError = match(error)
      .with(OSRMErrorPattern, ({ response }) => new MatchRouteError(response._body.message, OSRMErrorCode.BadRequest))
      .with(P._, ({ message }) => new MatchRouteError(message, OSRMErrorCode.UnknownError))
      .run()

    return Effect.fail(mappedError)
  }

  return { matchPoints }
}
