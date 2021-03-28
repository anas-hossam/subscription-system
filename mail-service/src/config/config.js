'use strict';

const serverSettings = {
    port: process.env.PORT || 3300,
    tokenSecret: process.env.TOKEN_SECRET || 'this is token signature secret',
};

const mailSettings = {
    client_id: process.env.SES_CLIENT_ID || 'client-id',
    client_secret: process.env.SES_CLIENT_SECRET || 'client-secret',
    from_email: process.env.SES_FROM_EMAIL || 'hello@addidas.com',
};

module.exports = Object.assign({}, {
    [process.env.NODE_ENV]: Object.assign({}, { serverSettings, mailSettings }),
});
