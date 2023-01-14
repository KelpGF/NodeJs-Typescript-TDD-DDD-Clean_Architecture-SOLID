export const forbiddenComponent = {
  description: 'Token inválido',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
