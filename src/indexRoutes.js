const express = require('express');

const app = express();

app.use(require('./user/userRoutes'));
app.use(require('./login/loginRoutes'));
app.use(require('./categoria/categoriaRoutes'));
app.use(require('./producto/productoRoutes'));
app.use(require('./upload/uploadRoutes'));
app.use(require('./images/imagesRoutes'));

module.exports = app;