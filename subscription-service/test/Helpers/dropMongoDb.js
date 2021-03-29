'use strict';

const { MongoClient } = require('mongodb');

module.exports = (url, dbName) => MongoClient.connect(url, { useUnifiedTopology: true })
    .then(client => client.db(dbName))
    .then(db => db.dropDatabase());
