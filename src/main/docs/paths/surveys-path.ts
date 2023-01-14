export const surveysPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquete'],
    summary: 'API para listar todas as enquete',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyList'
            }
          }
        }
      },
      204: { description: 'Nenhuma enquete registrada' },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/internalServerError' }
    }
  }
}
