import { config } from 'dotenv'
config()

export default {
  port: process.env.PORT || 5050,
  mongoConnectUrl: process.env.MONGO_CONNECT_URL || 'mongodb+srv://root:123@mongokelvin.5kpqp.mongodb.net/test',
  jwtSecret: process.env.JWT_SECRET || '@(MD!@SEK#!qc'
}
