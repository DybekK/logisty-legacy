import { Effect } from 'effect'
import bcrypt from 'bcrypt'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { UserError } from '../domain/errors/user.error'
import { CreateUserPayload } from '../domain/payloads/create-user.payload'

const SALT_ROUNDS = 10

export interface AuthService {
  createUser(payload: CreateUserPayload): Effect.Effect<never, UserError, User>
  hashPassword(password: string): Effect.Effect<never, never, string>
  comparePassword(password: string, hash: string): Effect.Effect<never, never, boolean>
}

export const AuthService = (userService: UserService): AuthService => {
  const createUser = (payload: CreateUserPayload): Effect.Effect<never, UserError, User> =>
    Effect.gen(function* (_) {
      const password = yield* _(hashPassword(payload.password))
      return yield* _(userService.create({ ...payload, password }))
    })

  const hashPassword = (password: string): Effect.Effect<never, never, string> =>
    Effect.promise(() => bcrypt.hash(password, SALT_ROUNDS))

  const comparePassword = (password: string, hash: string): Effect.Effect<never, never, boolean> =>
    Effect.promise(() => bcrypt.compare(password, hash))

  return { createUser, hashPassword, comparePassword }
}
