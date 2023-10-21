import { UserError } from './user.error'

export class UserAlreadyExistsError extends UserError {
  constructor() {
    super('User already exists.')
  }
}
