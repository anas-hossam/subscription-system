'use strict';

const db = process.env.DB || 'subscription-service';

const dbSettings = {
    db,
    dbUrl: `${process.env.DB_URI || 'mongodb://localhost:27017'}/${db}`,
    dbParameters: () => ({
        useUnifiedTopology: true,
    }),
};

const serverSettings = {
    port: process.env.PORT || 3200,
    tokenSecret: process.env.TOKEN_SECRET || 'this is token signature secret',
};

const mailApi = {
    url: process.env.MAIL_API_URL || 'http://localhost:3300',
    tokenSecret: process.env.MAIL_TOKEN_SECRET || 'this is token signature secret',
}

module.exports = Object.assign({}, {
    [process.env.NODE_ENV]: Object.assign({}, { dbSettings, serverSettings, mailApi }),
});