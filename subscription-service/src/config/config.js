'use strict';

const db = process.env.DB || 'subscriptions-service';

const dbSettings = {
    db,
    dbUrl: `${process.env.DB_URI || 'mongodb://localhost:27017'}/${db}`,
    dbParameters: () => ({
        useUnifiedTopology: true,
    }),
  };
  
  const serverSettings = {
    port: process.env.PORT || 3000,
    tokenSecret: process.env.TOKEN_SECRET || 'this is token signature secret',
  };
  
  module.exports = Object.assign({}, { dbSettings, serverSettings })
  