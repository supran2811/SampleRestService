const express = require('express');
const bodyParser = require('body-parser');
const fs  = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const uniqid = require('uniqid');
const graphQlHttp = require('express-graphql');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolver');
const auth = require('./middlewares/auth');

const app = express();

const  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images');
    },
    filename: function (req, file, cb) {
      cb(null, uniqid()+'-'+file.originalname);
    }
  });
  
  const fileFilter = (req, { mimetype }, cb) => {
        cb(null , (mimetype === 'image/jpeg' || mimetype === 'image/jpg'|| mimetype === 'image/png'));
  }

app.use('/images',express.static(path.join(__dirname, 'images')));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use(multer({storage,fileFilter}).single('image'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(auth);

app.use('/uploadImage' , (req,res,next) => {
  if(!req.isAuth) {
    throw new Error('Not authenticated!').status = 403;
  }
  if(!req.file) {
    return res.status(200).json({message:'No image file exist'});
  }

  if(req.body.oldImageUrl) {
    clearImage(req.body.oldImageUrl);
  }
  
  return res.status(201).json({message:'Image Uploaded', path: req.file.path});
   
});

app.use('/graphql' , graphQlHttp({
  schema:schema,
  rootValue:resolver,
  graphiql:true,
  customFormatErrorFn(err) {
    console.log("Error is thrown from graph",err, err.originalError);
    if(!err.originalError) {
      return err;
    }

    return {
      message : err.originalError.message,
      status: err.originalError.code,
      data: err.originalError.data
    }
  }
}));

app.use((error , req, res, next) => {
    console.log('Error coming herer',error);
    const statusCode  = error.statusCode || 500;
    const message = error.message;

    res.status(statusCode).json({message});
})

mongoose.connect('mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/feeds?retryWrites=true&w=majority')
.then(result => {
    app.listen(8080);
})
.catch(error => {
    console.log('Error is thrown ',error);
});


const  clearImage = (filePath) => {

  const fileToDelete = path.join(__dirname ,  filePath);
  fs.unlink(fileToDelete, (err) => {
    if (err) {
        throw err;
    }
})
}