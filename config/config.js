//Puerto de coneccion
process.env.PORT = process.env.PORT || 3000;

//La seed
//......Falta configurar la seed en el entorno de desarrollo......
process.env.SEED = process.env.SEED || 'Este es el seed de desarrollo';




//Expiracion
process.env.exp = Math.floor(Date.now() / 1000) + (60 * 60);