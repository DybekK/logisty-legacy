import { PrismaClient, User } from '@prisma/client'
import { match, P } from 'ts-pattern'
import { Effect } from 'effect'
import { PrismaErrorCode } from '../../../domain/prisma.error'
import { CreateUserPayload } from '../domain/payloads/create-user.payload'
import { UserError } from '../domain/errors/user.error'
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists.error'
import { DatabaseError } from '../domain/errors/database.error'

export interface UserService {
  findAll(): Effect.Effect<never, never, User[]>
  findOne(id: string): Effect.Effect<never, never, User | null>
  create(payload: CreateUserPayload): Effect.Effect<never, UserError, User>
}

export const UserService = (prisma: PrismaClient): UserService => {
  const findAll = (): Effect.Effect<never, never, User[]> => Effect.promise(() => prisma.user.findMany())

  const findOne = (id: string): Effect.Effect<never, never, User | null> =>
    Effect.promise(() => prisma.user.findUnique({ where: { id } }))

  const create = (payload: CreateUserPayload): Effect.Effect<never, UserError, User> => {
    const data = {
      ...payload,
      updatedAt: new Date()
    }

    const errorHandler = (error: unknown) =>
      match(error)
        .with({ code: PrismaErrorCode.UniqueConstraintViolation }, () => new UserAlreadyExistsError())
        .with(P.any, () => new DatabaseError())
        .run()

    return Effect.tryPromise({
      try: () => prisma.user.create({ data }),
      catch: errorHandler
    })
  }

  return { findAll, findOne, create }
}
