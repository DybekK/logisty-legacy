import { UserError } from './user.error'

export class DatabaseError extends UserError {
  constructor() {
    super('Unexpected error on database')
  }
}
