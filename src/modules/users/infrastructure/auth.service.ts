import { Effect } from 'effect'
import bcrypt from 'bcrypt'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { CreateUserPayload } from '../domain/user.payload'
import { CreateUserError } from '../domain/user.error'
import { RawEffect, SafeEffect } from '../../../utils/effect.type'

const SALT_ROUNDS = 10

export interface AuthService {
  createUser(payload: CreateUserPayload): RawEffect<CreateUserError, User>
  hashPassword(password: string): SafeEffect<string>
  comparePassword(password: string, hash: string): SafeEffect<boolean>
}

export const AuthService = (userService: UserService): AuthService => {
  const createUser = (payload: CreateUserPayload): RawEffect<CreateUserError, User> =>
    Effect.gen(function* (_) {
      const password = yield* _(hashPassword(payload.password))
      return yield* _(userService.create({ ...payload, password }))
    })

  const hashPassword = (password: string): SafeEffect<string> =>
    Effect.promise(() => bcrypt.hash(password, SALT_ROUNDS))

  const comparePassword = (password: string, hash: string): SafeEffect<boolean> =>
    Effect.promise(() => bcrypt.compare(password, hash))

  return { createUser, hashPassword, comparePassword }
}
