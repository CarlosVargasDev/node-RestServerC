const express = require('express');
const Usuario = require('./userModel');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();




app.get('/user', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Hacemos una busqueda
    Usuario.find({}, 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Usuario.countDocuments({ status: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    });
                }
                res.json({
                    ok: true,
                    size: conteo,
                    usuarios: usuariosDB
                });

            })




        })

    // res.json({
    //     ok: true,
    //     message: 'GET'
    // });
});

app.post('/user', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //body.password,
        role: body.role

    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: usuarioDB
        });
    });

});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    //Definimos los Campos a actualizar 
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Usuario actualizado',
            usuario: usuarioDB
        });

    });
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        status: false
    }

    //Eliminacion virtual 
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Usuario elminado',
            usuario: usuarioDB
        });
    });



    //Eliminacion Real
    // Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: err
    //         });
    //     }
    //     if (usuarioDB == null) {
    //         return res.status(404).json({
    //             ok: false,
    //             message: 'Usuario no encontrado'
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         message: 'Usuario Eliminado'
    //     })

    // })

    // res.json({
    //     ok: true,
    //     message: 'DELETE'
    // });
});

module.exports = app;