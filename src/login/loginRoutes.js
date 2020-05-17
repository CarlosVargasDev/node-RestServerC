const express = require('express');
const Usuario = require('../user/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        //Manejamos el error
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        //Verificamos si el usuario existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'El {{email}} o la contraseña es incorrecta'
            });
        }

        //Verificamo el password
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'El email o la {{contraseña}} es incorrecta'
            });
        }


        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.exp });


        //El usuario se valido correctamente
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });




    });
});


module.exports = app;