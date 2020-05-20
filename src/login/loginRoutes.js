const express = require('express');
const Usuario = require('../user/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Para el loggeo de google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // console.log('Nombre: ' + payload.name);
    // console.log('Email: ' + payload.email);
    // console.log('Imagen: ' + payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }


}
//   verify().catch(console.error);


//Para ael login de google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            error: e
        });
    })

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        //Manejamos el error
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        //Por si el usuario que se autentico con la cuenta de google NO se habia registrado con google sino con email
        if (usuarioDB) {
            if (usuarioDB.google == false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe de usar su autenticacion normal'
                    }
                });
            } else {
                //LE generamos un token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.exp });


                //El usuario se valido correctamente
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: err
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
        }
    });

    // res.json({
    //     usuario: googleUser
    // });
});

module.exports = app;