const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    //Verificamos el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        //Manejamos el error 401(no autorizado) retornando ello
        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }


        //decodificamos al usuario 
        req.usuario = decoded.usuario;


        //Despues de verificar el token, llamamos a next el cual es una funcion que precesiga con el resto de la peticion. usuario/usuarioRoutes.js       
        next();
    });
}

let verificarAdminRole = (req, res, next) => {
    let usuario = req.usuario;


    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es admin'
            }
        });
    }
}



module.exports = {
    verificaToken,
    verificarAdminRole
}