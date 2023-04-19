module.exports = {
  paths: {
    '/upload': {
      post: {
        tags: ['Upload'],
        description: 'Upload means of identification',
        operationId: 'uploadId',
        consumes: ['multipart/form-data'],
        parameters: [
          {
            in: 'formData',
            name: 'myImage',
            type: 'file',
            required:true,
            description: 'The file to upload.',
          },
        ],
        responses: {
          201: {
            description: 'image created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
  }
}