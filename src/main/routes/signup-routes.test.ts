import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Kelvin',
        email: 'kelvin.gomes.fernandes@email.com.br',
        password: 'qwe123',
        passwordConfirmation: 'qwe123'
      })
      .expect(200)
  })
})
