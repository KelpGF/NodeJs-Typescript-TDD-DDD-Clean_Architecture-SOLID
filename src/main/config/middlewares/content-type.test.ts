import request from 'supertest'
import app from '../app'

describe('Content Type Middleware', () => {
  test('Should return default content type JSON', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return content type XML forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
