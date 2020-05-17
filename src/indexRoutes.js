const express = require('express');

const app = express();

app.use(require('./user/userRoutes'));
app.use(require('./login/loginRoutes'));



module.exports = app;