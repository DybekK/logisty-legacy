import { Effect, identity } from 'effect'
import { match, P } from 'ts-pattern'
import { IMatchOptions, IOsrm, IOsrmMatchResult } from 'osrm-rest-client'
import { RawEffect } from 'src/utils/effect.type'
import { OSRMError, OSRMErrorPattern, OSRMRequestError, OSRMUnknownError } from './osrm.error'

export interface OSRMService {
  matchPoints(options: IMatchOptions): RawEffect<OSRMError, IOsrmMatchResult>
}

export const OSRMService = (osrm: IOsrm): OSRMService => {
  const matchPoints = (options: IMatchOptions): RawEffect<OSRMError, IOsrmMatchResult> => {
    const errorHandler = (error: unknown) =>
      match(error)
        .with(OSRMErrorPattern, identity<OSRMRequestError>)
        .with(P._, identity<OSRMUnknownError>)
        .run()

    return Effect.tryPromise({
      try: () => osrm.match(options),
      catch: errorHandler
    })
  }

  return { matchPoints }
}
