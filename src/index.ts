import express, { Router } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()
const router = Router()

app.use(express.json())
app.use(helmet())
app.use(morgan('tiny'))
app.use('/v1', router)

app.listen(3000, () => console.log('Server started on port 3000'))
