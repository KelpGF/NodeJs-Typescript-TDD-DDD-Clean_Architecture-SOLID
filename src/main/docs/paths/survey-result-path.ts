export const surveyResultPath = {
  get: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquete'],
    summary: 'API para consultar o resultado de uma enquete',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/internalServerError' }
    }
  },

  put: {
    security: [{ apiKeyAuth: [] }],
    tags: ['Enquete'],
    summary: 'API para criar a resposta de uma enquete',
    parameters: [{
      in: 'path',
      name: 'surveyId',
      description: 'ID da enquete',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      description: 'Dados da enquete',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/saveSurveyResultParams'
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveyResult'
            }
          }
        }
      },
      400: { $ref: '#/components/badRequest' },
      403: { $ref: '#/components/forbidden' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/internalServerError' }
    }
  }
}
