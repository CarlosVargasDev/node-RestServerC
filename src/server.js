require('../config/config')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//Rutas
app.use(require('./indexRoutes'));
// app.use(require('./user/userRoutes'));
// app.use(require('./user/index')); //Implementar despues


//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });



app.listen(process.env.PORT, () => {
    console.log(`Escuchando desde el puerto ${process.env.PORT}`);
});