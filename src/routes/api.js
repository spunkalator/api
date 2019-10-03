const express = require('express'),
router = express.Router();
const authenticate = require('../middlewares/middlewares').authenticate;

const apiBase = '../api';

module.exports = function (app) {
    // API routes
    app.use('/auth', require(`${apiBase}/auth/index`));
    app.use('/users', authenticate, require(`${apiBase}/users/index`));
    app.use('/images', require(`${apiBase}/images/index`));
    app.use('/app', authenticate, require(`${apiBase}/app/index`));

};