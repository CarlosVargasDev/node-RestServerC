const express = require('express');

const app = express();

app.use(require('./user/userRoutes'));
app.use(require('./login/loginRoutes'));
app.use(require('./categoria/categoriaRoutes'));
app.use(require('./producto/productoRoutes'));

module.exports = app;