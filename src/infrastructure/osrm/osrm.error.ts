import { P } from 'ts-pattern'

export const OSRMResponsePattern = {
  _body: {
    message: P.string
  },
  code: P.string
}

export const OSRMErrorPattern = { response: OSRMResponsePattern }

export enum OSRMErrorCode {
  BadRequest = 'BadRequest',
  UnknownError = 'UnknownError'
}

export type OSRMRequestError = P.infer<typeof OSRMErrorPattern>
export type OSRMUnknownError = Error

export type OSRMError = OSRMRequestError | OSRMUnknownError
