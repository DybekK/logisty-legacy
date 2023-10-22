import { PrismaClient, User } from '@prisma/client'
import { match, P } from 'ts-pattern'
import { Effect } from 'effect'
import { PrismaErrorCode } from '../../../infrastructure/db/prisma.error'
import { CreateUserPayload } from '../domain/user.payload'
import { CreateUserError } from '../domain/user.error'
import { RawEffect, SafeEffect } from 'src/utils/effect.type'

export interface UserService {
  findAll(): SafeEffect<User[]>
  findOne(id: string): SafeEffect<User | null>
  create(payload: CreateUserPayload): RawEffect<CreateUserError, User>
}

export const UserService = (prisma: PrismaClient): UserService => {
  const findAll = (): SafeEffect<User[]> => Effect.promise(() => prisma.user.findMany())

  const findOne = (id: string): SafeEffect<User | null> =>
    Effect.promise(() => prisma.user.findUnique({ where: { id } }))

  const create = (payload: CreateUserPayload): RawEffect<CreateUserError, User> => {
    const data = {
      ...payload,
      updatedAt: new Date()
    }

    const errorHandler = (error: unknown) =>
      match(error)
        .with({ code: PrismaErrorCode.UniqueConstraintViolation }, () => CreateUserError.UserAlreadyExists)
        .with(P._, () => CreateUserError.UnknownDatabaseError)
        .run()

    return Effect.tryPromise({
      try: () => prisma.user.create({ data }),
      catch: errorHandler
    })
  }

  return { findAll, findOne, create }
}
