'use strict';

const { EventEmitter } = require('events');
const { asValue } = require('awilix');

const server = require('./server/server');
const repository = require('./repository/subscription');
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
  repository.connect(container)
    .then(repo => {
      console.log('Connected. Starting Server');
      container.register({ repo: asValue(repo) });
      return server.start(container);
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`);
      app.on('close', () => {
        container.resolve('repo').disconnect();
      });
    });
});

di.init(mediator);

mediator.emit('init');
