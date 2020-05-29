const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autentication');

const app = express();


app.get('/image/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let notFoundPATH = path.resolve(__dirname, '../assets/404.jpg')
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(notFoundPATH);
    }
});

module.exports = app;