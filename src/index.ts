import express, { Router } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { PrismaClient } from '@prisma/client'
import { AuthService } from './modules/users/infrastructure/auth.service'
import { UserService } from './modules/users/infrastructure/user.service'
import { UserController } from './modules/users/infrastructure/user.controller'
import { OSRMService } from './infrastructure/osrm/osrm.service'
import { OSRM } from 'osrm-rest-client'
import { RouteController } from './modules/routes/infrastructure/route.controller'
import { initControllers } from './infrastructure/controller'
import { RouteService } from './modules/routes/infrastructure/route.service'

const app = express()
const router = Router()

app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))
app.use('/v1', router)

// external services
const prisma = new PrismaClient()
const osrm = OSRMService(OSRM())

// services
const userService = UserService(prisma)
const authService = AuthService(userService)
const routeService = RouteService(osrm)

// controllers
const userController = UserController(userService, authService)
const routeController = RouteController(routeService)

initControllers([userController, routeController], router)

app.listen(3000, () => console.log('Server started on port 3000'))
