import express from 'express'
import setupSwagger from './config-swagger'
import setupMiddleware from './middlewares'
import setupRoutes from './routes'

const app = express()
setupSwagger(app)
setupMiddleware(app)
setupRoutes(app)
export default app
