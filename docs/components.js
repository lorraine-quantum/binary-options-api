module.exports = {
  components: {
    name: {
      type: 'string',
      description: 'fullname of user',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      description: 'the email of the user',
      example: 'johndoe@gmail.com',
    },
    password: {
      type: 'string',
      description:'password of user',
      example: 'secret',
    },
    zipCode: {
      type: 'number',
      description: 'the zipcode of the user',
      example: '067345',
    },
    countryOfResidence:{
      type: 'string',
      description: 'the residential country of the user',
      example: 'italy',
    },
    address:{
      type: 'string',
      description: 'The residential address of the user ',
      example: '1042,heathrow yard, off crimea lane',
    },
    amount:{
      type: 'string',
      description: 'The amount user is depositing',
      example: '10000',
    }
  ,
    seedPhrase:{
      type: 'string',
      description: 'A six random security phrase seperated by dashes',
      example: 'pool-wade-yellow-goose-melt',
    }
  ,
  securitySchemes:{
    bearerAuth:{
      type:'http',
      scheme: 'bearer',
      bearerFormat:"JWT"
    }
  },
 
    schemas: {
      Upload:{
        type: 'object',
        properties:{
          file:{
            type:'string',
            format:'binary'
          }
        }
      },
      UserRegister: {
        type: 'object',
        properties: {
          name:{
            $ref:'#/components/name'
          },
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
          zipCode: {
            $ref: '#/components/zipCode',
          },
          address: {
            $ref: '#/components/address',
          },
          countryOfResidence: {
            $ref: '#/components/countryOfResidence',
          },
          
        },
      },
      UserEdit: {
        type: 'object',
        properties: {
          name:{
            $ref:'#/components/name'
          },
          zipCode: {
            $ref: '#/components/zipCode',
          },
          address: {
            $ref: '#/components/address',
          },
          countryOfResidence: {
            $ref: '#/components/countryOfResidence',
          },
          
        },
      },
      PasswordEdit: {
        type: 'object',
        properties: {
          
          password: {
            $ref: '#/components/password',
          },
          email: {
            $ref: '#/components/email',
          },
          seedPhrase: {
            $ref: '#/components/seedPhrase',
          },
          
        },
      },
      UserLogin: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      Transaction:{
        type:"object",
        properties:{
          amount:{
            $ref:"#/components/amount",
          }
        }
      },
      
    },    
  },
};
