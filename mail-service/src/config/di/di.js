'use strict';

const { createContainer, asValue } = require('awilix');

const initDI = ({ serverSettings, mailSettings, models }, mediator) => {
    mediator.once('init', () => {
        mediator.on('boot.ready', () => {
            const container = createContainer();

            container.register({
                validate: asValue(models.validate),
                serverSettings: asValue(serverSettings),
                mailSettings: asValue(mailSettings),
            });

            mediator.emit('di.ready', container);
        });

        mediator.on('db.error', (err) => {
            mediator.emit('di.error', err);
        });

        mediator.emit('boot.ready');
    });
};

module.exports.initDI = initDI;
