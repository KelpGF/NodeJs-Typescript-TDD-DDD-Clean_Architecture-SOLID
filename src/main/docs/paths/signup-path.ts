export const signupPath = {
  post: {
    tags: ['SignUp'],
    summary: 'API para criar conta de um usuário',
    requestBody: {
      description: 'Dados do usuário',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account'
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
