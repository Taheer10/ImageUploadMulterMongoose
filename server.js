const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose');
const multer = require('multer')
const ImageModel = require('./model/imagemodel')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_url, { useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(process.env.PORT, ()=> {
    console.log(`Db connected and server running on port ${process.env.PORT}`);
}))
.catch((error) => {
    console.log(error.message);
    
})


const Storage = multer.diskStorage({
    destination: 'imageUploads',
    filename: (req, file, cb) =>
    cb( null, file.originalname)
});

const upload = multer({
    storage: Storage
}).single('testImage')


app.get("/", (req,res) => {
    res.json("Upload File")
})

app.post('/upload', (req,res) => {
    upload(req,res, (err) => {
        if (err) {
            console.log(err);
        }
        else{
            const newImage = new ImageModel({
                name: req.body.name,
                image: {
                    data: req.file.filename,
                    contentType: 'image/png'
                }
            });
            newImage.save()
            .then(()=> res.json('Uploaded Successfully'))
            .catch((err) => console.log(err))
        }
    })
})

 
