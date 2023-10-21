import express, { Router } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import { AuthService } from './modules/users/infrastructure/auth.service'
import { UserService } from './modules/users/infrastructure/user.service'
import { UserController } from './modules/users/infrastructure/user.controller'

const app = express()
const router = Router()

app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))
app.use('/v1', router)

const prisma = new PrismaClient()

const userService = UserService(prisma)
const authService = AuthService(userService)
const userController = UserController(userService, authService)

Array.from([userController]).forEach(controller => controller.routes(router))

app.listen(3000, () => console.log('Server started on port 3000'))
