import paths from './paths'
import schemas from './schemas'
import components from './components'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API criada utilizando Clean Arq, SOLID e TDD',
    version: '1.0.0',
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    { name: 'Login' },
    { name: 'SignUp' },
    { name: 'Enquete' }
  ],
  paths,
  schemas,
  components
}
