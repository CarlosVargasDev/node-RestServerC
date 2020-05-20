//Puerto de coneccion
process.env.PORT = process.env.PORT || 3000;

//La seed
//......Falta configurar la seed en el entorno de desarrollo......
process.env.SEED = process.env.SEED || 'Este es el seed de desarrollo';



//Expiracion
process.env.exp = Math.floor(Date.now() / 1000) + (60 * 60);


//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/testCafeUltimate';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;



//Client ID de google
process.env.CLIENT_ID = process.env.CLIENT_ID || '34942969066-pm16ccj030ek0bikieiq1k15c792bqou.apps.googleusercontent.com';