export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API para autenticar usuários',
    requestBody: {
      description: 'Credenciais do usuário',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginParams'
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
      }
    }
  }
}
