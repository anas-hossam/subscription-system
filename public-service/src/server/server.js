'use strict';

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyparser = require('body-parser');
const cors = require('cors');

const _api = require('../api/subscription');
const { InternalServerError} = require('../Errors');

const start = (container) => {
    return new Promise((resolve, reject) => {
        const { port, tokenSecret } = container.resolve('serverSettings');
        const subscriptionService = container.resolve('subscriptionService');
        const { authenticate } = container.resolve('middlewares');

        if (!subscriptionService) {
            reject(new InternalServerError('The server must be started with a connected subscription service'));
        }

        if (!port) {
            reject(new InternalServerError('The server must be started with an available port'));
        }

        const app = express();
        app.use(morgan('dev'));
        app.use(bodyparser.json());
        app.use(cors());
        app.use(helmet());

        app.use(authenticate({
            secret: tokenSecret,
        }));

        app.use((err, req, res, next) => {
            reject(new InternalServerError('Something went wrong!, err:' + err));
            res.status(500).send('Something went wrong!');
            next();
        });

        app.use((req, res, next) => {
            req.container = container.createScope();
            next();
        });

        const api = _api.bind(null, { subscriptionService });
        api(app);

        const server = app.listen(port, () => resolve(server));
    });
}

module.exports = Object.assign({}, { start });
