import { ValidationChain, check } from 'express-validator'

export type CreateUserPayload = {
  email: string
  name: string
  password: string
}

export const createUserPayloadRules: ValidationChain[] = [
  check('email').isEmail().withMessage('Email is not valid'),
  check('name').notEmpty().withMessage('Name is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]
