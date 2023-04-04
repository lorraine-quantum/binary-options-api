module.exports = {
  paths: {
    '/upload': {
      post: {
        tags: ['Upload'],
        description: 'Upload means of identification',
        operationId: 'uploadId',
        requestBody: {
          content: ['multipart/form-data'],
          schema: {
            $ref: '#/components/schemas/Upload',
          }
        },
        parameters: [
          {
            in: 'formData',
            name: 'myImage',
            type: 'file',
            description: 'The file to upload.',
          },
        ],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Users'],
        description: 'Create users',
        operationId: 'createUsers',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegister',
              },
            },
          },
        },
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Users'],
        description: 'Login Users',
        operationId: 'loginUsers',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLogin',
              },
            },
          },
        },
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/transaction/token-user': {
      get: {
        tags: ['Users'],
        security: [{
          bearerAuth: []
        }],
        description: 'Get user Object',
        operationId: 'getUsersObject',
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/edit-user': {
      put: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Users'],
        description: 'Edit User Password',
        operationId: 'EditPassword',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserEdit',
              },
            },
          },
        },

        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/edit-password': {
      put: {
        tags: ['Users'],
        description: 'Edit User details',
        operationId: 'EditUsers',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PasswordEdit',
              },
            },
          },
        },

        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/transaction/add': {
      post: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Transactions'],
        description: 'Store User transaction',
        operationId: 'AddTransaction',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Transaction',
              },
            },
          },
        },

        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/transaction/all': {
      get: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Transactions'],
        description: 'GET all User transaction',
        operationId: 'getTransaction',
        parameters: [],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/transaction/single/{id}': {
      get: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Transactions'],
        description: 'GET single transaction. NOTE: id is the transaction id (_id) gotten at the instance of creating a tranasaction ',
        operationId: 'getSingeTransaction',
        parameters: [{
          in: 'path',
          name: "id",
          type: "string",
          required: "true",
          description: "id of a transaction"
        }],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/withdrawal/add': {
      post: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Withdrawal'],
        description: 'Store User withdrawal',
        operationId: 'AddWithdrawal',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Transaction',
              },
            },
          },
        },

        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/withdrawal/all': {
      get: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Withdrawal'],
        description: 'GET all User withdrawal',
        operationId: 'getWithdrawal',
        parameters: [],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/Withdrawal/single/{id}': {
      get: {
        security: [{
          bearerAuth: []
        }],
        tags: ['Withdrawal'],
        description: 'GET single withdrawal. NOTE: id is the transaction id (_id) gotten at the instance of creating a withdrawal',
        operationId: 'getSingeWithdrawal',
        parameters: [{
          in: 'path',
          name: "id",
          type: "string",
          required: "true",
          description: "id of a withdrawal"
        }],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },

  },
};
