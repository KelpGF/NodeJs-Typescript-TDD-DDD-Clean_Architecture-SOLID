import { config } from 'dotenv'
config()

export default {
  port: process.env.PORT || 5050,
  mongoConnectUrl: process.env.MONGO_CONNECT_URL || 'mongodb://root:123@mongodb/test',
  jwtSecret: process.env.JWT_SECRET || '@(MD!@SEK#!qc'
}
