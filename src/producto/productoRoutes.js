const express = require('express');
const Producto = require('./productoModel');
const { verificaToken } = require('../middlewares/autentication');

const app = express();


app.get('/producto', verificaToken, (req, res) => {
    let ordenar = req.query.ordenar || 'nombre';

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Hacemos una busqueda
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .sort(ordenar)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }
            Producto.countDocuments({ status: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: err
                    });
                }
                res.json({
                    ok: true,
                    size: conteo,
                    productos: productoDB
                });

            })
        })
});


app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        //Manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                message: 'Id incorrecto'
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        //Manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});



app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        //manejamos el error
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Producto actualizada',
            producto: productoDB
        });
    });

});


app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    }

    //Eliminacion virtual 
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Producto elminado',
            producto: productoDB
        });
    });



});


module.exports = app;