'use strict';

const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const server = require('./server/server');
const { Mail } = require('./Services');
const { formatMail } = require('./utilities');
const middlewares = require('./middlewares');
const di = require('./config');

const mediator = new EventEmitter();

console.log('--- Mail Service ---');

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
});

mediator.on('di.ready', (container) => {
    container.register({
        formatMail: asValue(formatMail),
    });

    return Promise.resolve(new Mail({
        config: container.resolve('mailSettings'),
    }))
        .then(service => {
            console.log('Connected. Starting Server');

            container.register({
                mailService: asValue(service),
                middlewares: asValue(middlewares),
            });

            return server.start(container);
        })
        .then(() => {
            console.log(`Server started successfully, running on port: ${container.cradle.serverSettings.port}.`);
        });
});

di.init(mediator);

mediator.emit('init');
