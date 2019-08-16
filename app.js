const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const feedRoutes = require('./routes/feed');

const app = express();

app.use('/images',express.static(path.join(__dirname, 'images')));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);

app.use((error , req, res, next) => {
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
