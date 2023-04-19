const route = require('express').Router()
const {uploadId} = require('../controllers/uploadIdC')
route.post('/', (req,res)=>{    
    uploadId(req,res,(err)=>{
        if(req.fileValidationError){
        //  return   res.redirect('/uploadfailed')
            console.log(req.fileValidationError)
            return res.end(req.fileValidationError)
        }
        if(!req.file){
            return res.json({msg:"file cannot be empty"})
        }
        if(err)
        {
            return res.json({msg:err})
        }
        else{
            console.log(req.file)
            return res.json({message:'sucess?'})
        }
    })
})


module.exports= route