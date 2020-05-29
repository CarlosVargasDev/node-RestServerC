const express = require('express');
const { verificaToken, verificarAdminRole } = require('../middlewares/autentication');
const Categoria = require('./categoriaModel');
const _ = require('underscore');
let app = express();


//Obtener todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .exec((err, categoriaDB) => {
            //Manejamos el error
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            //Para contar el numero de elemento
            Categoria.countDocuments({ ok: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }
                //Devolvemos la respuesta
                res.json({
                    ok: true,
                    size: conteo,
                    categorias: categoriaDB
                });
            })
        });
});

//Obtener categoria por id
app.get('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        //Manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                message: 'Id incorrecto'
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

    // res.json({
    //     ok: true,
    //     message: 'categoria id GET',
    //     id
    // });
});

//Crear una categoria
app.post('/categoria', [verificaToken], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id,
        descripcion: body.descripcion
    });


    categoria.save((err, categoriaDB) => {
        //Manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
    // res.json({
    //     ok: true,
    //     message: 'categoria POST'
    // });
});

//Actualizar categoria
app.put('/categoria/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    // let body = req.body
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        //manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Categoria actualizada',
            categoria: categoriaDB
        });
    });
    // res.json({
    //     ok: true,
    //     message: 'categoria PUT'
    // });
});


//Eliminar categoria
app.delete('/categoria/:id', [verificaToken, verificarAdminRole], (req, res) => {
    let id = req.params.id;
    //Eliminacion Real
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (categoriaDB == null) {
            return res.status(404).json({
                ok: false,
                message: 'Categoria no encontrado'
            });
        }
        res.json({
            ok: true,
            message: 'Categoria Eliminada'
        })

    })

    // res.json({
    //     ok: true,
    //     message: 'categoria DELETE'
    // });
});


module.exports = app;