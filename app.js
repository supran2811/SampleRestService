const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const uniqid = require('uniqid');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
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

app.use('/feed', feedRoutes);
app.use('/user',userRoutes);
app.use(authRoutes);

app.use((error , req, res, next) => {
    console.log('Error coming herer',error);
    const statusCode  = error.statusCode || 500;
    const message = error.message;

    res.status(statusCode).json({message});
})

mongoose.connect('mongodb+srv://supran:1234@supran-cluster0-zzni5.mongodb.net/feeds?retryWrites=true&w=majority')
.then(result => {
   const server =  app.listen(8080);
   const io = require('./socket').init(server);
   io.on('connection' , (socket) => {
     console.log('client connected!!!');
   })
})
.catch(error => {
    console.log('Error is thrown ',error);
});

