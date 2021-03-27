const MongoClient = require('mongodb');

const connect = (options, mediator) => {
    mediator.once('boot.ready', () => {
        MongoClient.connect(
            options.dbUrl,
            options.dbParameters(),
            (err, client) => {
                if (err) {
                    mediator.emit('db.error', err);
                }

                mediator.emit('db.ready', client.db(options.db));
            }
        );
    });
};

module.exports = Object.assign({}, { connect });
