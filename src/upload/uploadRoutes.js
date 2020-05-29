const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../user/userModel');
const Producto = require('../producto/productoModel');

const fs = require('fs');
const path = require('path');

const app = express();

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.json({
            ok: false,
            error: {
                message: 'Los tipos validos son: ' + tiposValidos
            }
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El archivo no fue encontrado'
            }

        });
    }

    let extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    //The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.json({
            ok: false,
            error: {
                extencion,
                message: 'Extencion no valida'
            }
        });
    }

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extencion}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        //Aqui la imagen ya esta cargada, simplemente actualizamos al usuario o producto para que guarde esa img en la bd


        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }




    });

});



function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivoSiExiste(nombreArchivo, 'usuarios');
            return res.json({
                ok: false,
                error: err
            });
        }

        if (!usuarioDB) {
            return res.json({
                ok: false,
                error: {
                    message: 'Usuario no existe'
                }
            });
        }


        borraArchivoSiExiste(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivoSiExiste(nombreArchivo, 'productos');
            return res.json({
                ok: false,
                error: err
            });
        }
        if (!productoDB) {
            return res.json({
                ok: true,
                error: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivoSiExiste(productoDB.img, 'productos');
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoDB) => {
            res.json({
                ok: true,
                producto: productoDB,
                img: nombreArchivo
            });
        });
    });
}

function borraArchivoSiExiste(nombreIMG, tipo) {
    //Para eliminar una imagen que ya exista.
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreIMG}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;