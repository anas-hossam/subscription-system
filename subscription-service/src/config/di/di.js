'use strict';

const { createContainer, asValue } = require('awilix');

function initDI({ serverSettings, dbSettings, mailApi, database, models }, mediator) {
    mediator.once('init', () => {
        mediator.on('db.ready', (db) => {
            const container = createContainer();

            container.register({
                database: asValue(db),
                validate: asValue(models.validate),
                ObjectID: asValue(database.ObjectID),
                serverSettings: asValue(serverSettings),
                mailApi: asValue(mailApi),
            });

            mediator.emit('di.ready', container);
        });

        mediator.on('db.error', (err) => {
            mediator.emit('di.error', err);
        });

        database.connect(dbSettings, mediator);

        mediator.emit('boot.ready');
    });
}

module.exports.initDI = initDI
