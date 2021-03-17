require('dotenv/config')

const express = require('express')
const multer = require('multer')
const AWS = require('aws-sdk')
const { uuid } = require('uuidv4');




const app = express()
const port = 3000

// edit by @abhi

app.use((req,res,next)=>{
    res.setHeader('Acces-Control-Allow-Origin','*');
    res.setHeader('Acces-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Acces-Contorl-Allow-Methods','Content-Type','Authorization');
    next(); 
})

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

// storage for multer
const storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '')
        // null and path->path for temp folder
    }
})

// middleware
const upload = multer({storage}).single('file')

app.post('/upload',upload,(req, res) => {

    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        var options = { partSize: 5 * 1024 * 1024, queueSize: 10 };  


var s3 = new AWS.S3({ httpOptions: { timeout: 10 * 60 * 1000 }});  
s3.upload(params, options)





        if(error){
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})

app.listen(port, () => {
    console.log(`Server is up at ${port}`)
})