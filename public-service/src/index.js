'use strict';

const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const server = require('./server/server');
const { Subscriptions } = require('./Services');
const { createToken } = require('./utilities');
const middlewares = require('./middlewares');
const di = require('./config');

const mediator = new EventEmitter();

console.log('--- Public Service ---');

process.on('uncaughtException', err => {
    console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', err => {
    console.error('Unhandled Rejection', err);
});

mediator.on('di.ready', (container) => {
    container.register({
        createToken: asValue(createToken),
    });

    return Promise.resolve(new Subscriptions({
        subscriptionsApi: container.resolve('subscriptionsApi'),
        createToken: container.resolve('createToken'),
    }))
        .then(service => {
            console.log('Connected. Starting Server');

            container.register({
                subscriptionService: asValue(service),
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
