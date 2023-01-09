import 'module-alias/register'
import env from './config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

MongoHelper.connect(env.mongoConnectUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.listen(env.port, () => console.log('Server running at http://localhost:5050'))
  })
  .catch(console.error)
