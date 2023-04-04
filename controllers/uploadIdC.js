const multer = require('multer')
const path = require('path')
const {BadRequest}= require('../errors/customErrors')

const storage = multer.diskStorage({
    destination:'./public/uploads',
    filename: function(req,file,cb){
        cb(null,file.fieldname+ '-' + Date.now()+path.extname(file.originalname))
    }
})

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
      console.log(file.mimetype)
      req.fileValidationError='Please upload only images'
      return cb(('Please upload only images'), false);
} else {
      cb(null, true);
  }
}; 
    const uploadId = multer({
        storage:storage,
        limits:{fileSize:1000000},
        fileFilter: multerFilter    
    }).single("myImage")

    
    


module.exports = {uploadId}