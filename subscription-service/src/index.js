'use strict';

const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const server = require('./server/server');
const repository = require('./repository/subscription');
const { createToken } = require('./utilities');
const { Mail } = require('./Services');
const middlewares = require('./middlewares');
const di = require('./config');

const mediator = new EventEmitter();

console.log('--- Subscription Service ---');
console.log('Connecting to subscription repository...');

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception', err);
});

process.on('uncaughtRejection', (err, promise) => {
    console.error('Unhandled Rejection', err);
});

mediator.on('di.ready', (container) => {
    container.register({
        createToken: asValue(createToken),
    });

    repository.connect(container)
        .then(repo => {
            console.log('Connected. Starting Server');

            container.register({
                repo: asValue(repo),
                middlewares: asValue(middlewares),
            });

            return new Mail({
                mailApi: container.resolve('mailApi'),
                createToken: container.resolve('createToken'),
            });
        })
        .then(service => {
            container.register({
                mailService: asValue(service),
            });

            return server.start(container)
        })
        .then(app => {
            console.log(`Server started successfully, running on port: ${container.cradle.serverSettings.port}.`);
            app.on('close', () => {
                container.resolve('repo').disconnect();
            });
        });
});

di.init(mediator);

mediator.emit('init');
